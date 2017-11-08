import BaseClient from './base';

const MONTHS = (amount = 1) => 1 * 60 * 60 * 24 * 30 * amount;

export const storageKeys = {
  overview: {
    node: 'api:overview:',
    ttl: MONTHS(6)
  },
  detail: {
    node: 'api:detail:',
    ttl: MONTHS(6)
  },
  smogon: {
    node: 'api:smogon:',
    ttl: MONTHS(3)
  }
};

export default new BaseClient({ storageKeys });
