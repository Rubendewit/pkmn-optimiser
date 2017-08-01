const charizard = require('./charizard');

module.exports = {
  cache: false,
  path: '/mocks/smogon/build',
  method: 'POST',
  template: () => charizard
};
