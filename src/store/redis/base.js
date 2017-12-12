import Boom from 'boom';
import Redis from 'redis';
import RedisMock from 'redis-mock';
import config from '../../config';
import { redisLogger } from '../../helpers/logger';
import _ from 'lodash';

RedisMock.setMaxListeners(20);

const redisConfig = config.redis;

export default class BaseClient {
  masterClient = null;
  slaveClients = [];
  slaveIndex = 0;

  storageKeys = null;

  redisOptions = {
    retry_strategy: options => {
      return Math.min(options.attempt * 100, 4000);
    },
    enable_offline_queue: false
  };

  constructor(options) {
    const {
      master = redisConfig.master,
      slaves = redisConfig.slaves,
      autodetectSlaves = redisConfig.autodetectSlaves,
      db = 0,
      storageKeys = {},
      logger = redisLogger
    } = options;

    this.masterClient = this.createClient({ role: 'master', ...master, db }, master => {
      // Autodetect slaves
      if(autodetectSlaves && _.isEmpty(this.slaveClients)) {
        master.info('replication', (err, res) => {
          this.parseSlaveInfo(res).forEach(({ host, port }) => {
            this.slaveClients.push(this.createClient({ role: 'slave', host, port, db }));
          });
        });
      }
    });
    // Use slaves defined in config
    if(slaves) {
      slaves.forEach(slave => {
        this.slaveClients.push(this.createClient({ role: 'slave', ...slave, db }));
      });
    }

    this.storageKeys = storageKeys;
    this.logger = logger;
  }

  createClient(options, callback) {
    let client = null;

    if(redisConfig.fake) {
      client = new RedisMock.createClient({ fast: true });
      client.connected = true;
      client.role = options.role;
      client.host = options.host;
    } else {
      client = Redis.createClient(_.merge(options, this.redisOptions));

      client.on('error', err => {
        this.logger.error(err, `Connection failed (${options.role})`);
        client.connected = false;
      });

      client.on('ready', () => {
        client.connected = true;
        this.logger.info(`Connection restored (${options.role})`);
        if(callback) {
          callback(client);
        }
      });
    }

    return client;
  }

  parseSlaveInfo(res) {
    const lines = res.split('\r\n');
    return _.map(
      _.filter(lines, line => {
        return line.match(/^slave.*state=online/);
      }),
      line => {
        const match = /ip=([0-9].+),port=([0-9]{0,5})/g.exec(line);
        return {
          host: match[1],
          port: match[2]
        };
      }
    );
  }

  setConnected(bool) {
    this.masterClient.connected = bool;
  }

  getMaster() {
    return this.masterClient;
  }

  getSlave() {
    const connectedSlaves = _.filter(this.slaveClients, { connected: true });
    if(!_.isEmpty(connectedSlaves)) {
      this.slaveIndex++;
      if(this.slaveIndex >= connectedSlaves.length) {
        this.slaveIndex = 0;
      }
      return connectedSlaves[this.slaveIndex];
    }
    return this.masterClient;
  }

  getStorageNode(itemId, type) {
    return this.storageKeys[type].node + itemId;
  }

  getItem(id, type) {
    return new Promise((resolve, reject) => {
      const slave = this.getSlave();
      if(!slave.connected) {
        return reject('Not connected');
      }

      const node = this.getStorageNode(id, type);

      slave.get(node, (error, response) => {
        if(error || !response) {
          this.logger.trace('Not found');
          reject(Boom.notFound());
        } else {
          resolve(JSON.parse(response));
        }
      });
    });
  }

  getItems(ids, type = 'overview') {
    return new Promise((resolve, reject) => {
      const slave = this.getSlave();
      if(!slave.connected) {
        return reject('Not connected');
      }

      const nodes = ids.map(id => this.getStorageNode(id, type));

      slave.mget(...nodes, (error, response) => {
        if(error) {
          reject(error);
        } else {
          resolve({
            results: _.compact(response).map(JSON.parse),
            notFound: _.compact(response.map((item, index) => item === null && ids[index]))
          });
        }
      });
    });
  }

  setItem({ id, data, type }) {
    return new Promise((resolve, reject) => {
      const node = this.getStorageNode(id, type);
      const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
      const { ttl } = this.storageKeys[type];
      const cb = (error, response) => {
        if(error) {
          this.logger.error(error, 'Could not save itemId: ' + id);
          reject(error);
        } else {
          this.logger.trace(`Stored: ${type} ${id}${ttl ? ' (ttl: ' + ttl + ')' : ''}`);
          if(ttl) {
            this.logger.trace(`Successfully set TTL for ${type} ${node}`);
          }
          resolve(response);
        }
      };
      if(typeof ttl === 'number') {
        this.getMaster().setex(node, ttl, stringifiedData, cb);
      } else {
        this.getMaster().set(node, stringifiedData, cb);
      }
    });
  }

  delItem({ id, type }) {
    const node = this.getStorageNode(id, type);
    this.getMaster().del(node);
  }

  exists({ id, type }) {
    return new Promise((resolve, reject) => {
      const slave = this.getSlave();
      if(!slave.connected) {
        return reject('Not connected');
      }

      const node = this.getStorageNode(id, type);

      slave.exists(node, (error, response) => {
        if(error) {
          reject(Boom.badImplementation('Could not check for data'));
        } else {
          resolve(response);
        }
      });
    });
  }

  ping() {
    return new Promise(resolve => {
      const master = this.getMaster();
      if(!master.connected) {
        return resolve(false);
      }
      master.ping(error => resolve(!error));
    });
  }
}

/*
// MASTER SLAVE - FIXED READ REPLICAS
  "master": { "host": "redis-master", "port": 6379 },
  "slaves": [
    { "host": "redis-master", "port": 6379 },
    { "host": "redis-slave-1", "port": 6379 },
    { "host": "redis-slave-2", "port": 6379 }
  ]

OR

// MASTER SLAVE - DETECT READ REPLICAS
  "replica": {
    "master": { "host": "redis-master", "port": 6379 },
    "autodetectSlaves": true
  }
*/
