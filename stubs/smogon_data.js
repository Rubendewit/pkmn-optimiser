const data = require('./smogon_data');

module.exports = {
  cache: false,
  path: '/mocks/smogon/data',
  method: 'POST',
  template: () => data
};
