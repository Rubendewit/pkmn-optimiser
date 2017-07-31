import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));
const api = argv.api || 'production';

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

for(const key in endpointList.production) {
  if(key in endpointList.stub) {
    const originalFn = endpointList.stub[key];
    endpointList.stub[key] = function() {
      return 'http://localhost:8181' + originalFn.apply(null, arguments);
    };
  } else {
    endpointList.stub[key] = endpointList.production[key];
  }
}

export const endpoints = endpointList[api];
