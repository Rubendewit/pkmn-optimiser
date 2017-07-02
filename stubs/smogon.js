const charizard = require('./charizard-smogon');

const getResponse = () => {
  return charizard;
};

module.exports = {
  cache: false,
  path: '/mocks/smogon',
  method: 'POST',
  template: (params, query, body) => getResponse(body)
};
