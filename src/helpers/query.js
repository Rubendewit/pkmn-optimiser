import { execute } from '../store/postgres';

const limit = 10;
let offset = 0;

const fetchIds = () => {
  return execute({
    query: `
      SELECT id, identifier AS name, "order"
      FROM pokemon
      WHERE is_default = 'TRUE'
      LIMIT ${limit} OFFSET ${offset};
    `
  });
};

export default { fetchIds };
