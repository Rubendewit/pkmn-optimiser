import _ from 'lodash';
import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));

const api = argv.api || 'production';
const port = process.env.PORT || argv.port || 3000;

const endpointList = {
  stub: {
    smogon_build: () => '/mocks/smogon/build',
    smogon_data: () => '/mocks/smogon/data'
  },
  production: {
    smogon_build: () => 'http://www.smogon.com/dex/_rpc/dump-pokemon',
    smogon_data: () => 'http://www.smogon.com/dex/_rpc/dump-basics'
  }
};

const {
  PG_HOST: dbHost,
  PG_PORT: dbPort,
  PG_USERNAME: username,
  PG_PASSWORD: password,
  PG_DATABASE: database
} = process.env;

const dbConfig = {
  host: dbHost,
  port: dbPort,
  username,
  password,
  database
};

const config = {
  api,
  port,
  dbConfig,
  endpoints: endpointList[api]
};

for(const key in endpointList.production) {
  if(key in endpointList.stub) {
    const originalFn = endpointList.stub[key];
    endpointList.stub[key] = () => 'http://localhost:8181' + originalFn.apply(null, arguments);
  } else {
    endpointList.stub[key] = endpointList.production[key];
  }
}

export default config;
