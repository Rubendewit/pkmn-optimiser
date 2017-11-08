import BaseClient from './base';
import { storageKeys } from './extended-client';
import bluebird from 'bluebird';

const FlushClient = class FlushClient extends BaseClient {

  constructor(options) {
    super(options);
    bluebird.promisifyAll(this.masterClient);
  }

  flushAll() {
    return new Promise(resolve => {
      const master = this.getMaster();
      if(!master.connected) {
        return resolve({result: 'NOK'});
      }

      master.flushdb(error => resolve({result: error ? 'NOK' : 'OK'}));

    });
  }
};

export default new FlushClient({ storageKeys });
