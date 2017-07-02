import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));
const api = argv.api || 'production';

const endpointList = {
  stub: {
    smogon: () => '../stub/smogon-data.json'
  },
  production: {
    smogon: () => 'http://www.smogon.com/dex/_rpc/dump-pokemon'
  }
};

export const endpoints = endpointList[api];
