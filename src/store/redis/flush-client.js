import BaseClient from './base';
import { storageKeys } from './extended-client';
import bluebird from 'bluebird';

const FlushClient = class FlushClient extends BaseClient {
  constructor(options) {
    super(options);
    bluebird.promisifyAll(this.masterClient);
  }

  flush({ type, id }) {
    return new Promise(resolve => {
      const node = this.getStorageNode(id, type);
      return this.getMaster()
        .delAsync(node)
        .then(deleted => {
          resolve({ [type]: deleted || 0 });
        });
    });
  }

  flushAll() {
    return new Promise(resolve => {
      const master = this.getMaster();
      if(!master.connected) {
        return resolve({ result: 'NOK' });
      }

      master.flushdb(error => resolve({ result: error ? 'NOK' : 'OK' }));
    });
  }
};

export default new FlushClient({ storageKeys });
