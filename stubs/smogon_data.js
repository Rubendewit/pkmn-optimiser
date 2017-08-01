const data = require('./smogon_data_dump');

module.exports = {
  cache: false,
  path: '/mocks/smogon/data',
  method: 'POST',
  template: () => data
};
