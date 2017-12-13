import { doQuery } from '../helpers/query';

export const getTypeName = async ({ id }) => {
  const redisOptions = {
    type: 'species',
    id: 'types'
  };

  const query = {
    command: `
      SELECT identifier
      FROM types
      WHERE id = ${id}
    `,
    values: { id }
  };

  return await doQuery({ query, redisOptions }).then(([type]) => type.identifier);
};
