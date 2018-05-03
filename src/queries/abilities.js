import { doQuery } from '../helpers/query';

export const getAbilityName = async ({ id }) => {
  const redisOptions = {
    type: 'species',
    id: 'abilities'
  };

  const query = {
    command: `
      SELECT identifier AS name
      FROM abilities
      WHERE id = ${id}
    `
  };

  return await doQuery({ query, redisOptions }).then(([ability]) => ability.name);
};
