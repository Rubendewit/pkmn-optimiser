import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));
const api = argv.api || 'production';

const endpointList = {
  stub: {
    smogon: () => '/mocks/smogon'
  },
  production: {
    smogon: () => 'http://www.smogon.com/dex/_rpc/dump-pokemon'
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
