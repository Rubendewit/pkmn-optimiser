import _ from 'lodash';
import Debug from 'debug';
import resources from './resources';
import { exceptions } from './exceptions';
import { normalizeName } from '../../normalizers/names';

const debug = Debug('smogon');

const smogon = {};

export default class Smogon {
  constructor() {
    if(_.isEmpty(smogon)) {
      this.initialize();
      debug('Smogon resources have been initialized');
    }
  }

  initialize() {
    _.forEach(resources, (resource, resourceKey) => {
      smogon[resourceKey] = {};
      _.forEach(resource, item => {
        let { shorthand, name } = item;

        if(name in exceptions) {
          name = exceptions[name]({shorthand, name});
        }

        const key = normalizeName(shorthand || name);
        smogon[resourceKey][key] = item;
      });
    });
  }

  getAbilities(name) {
    return smogon.abilities[name];
  }

  getFormats(name) {
    return smogon.formats[name];
  }

  getItems(name) {
    return smogon.items[name];
  }

  getMoves(name) {
    return smogon.moves[name];
  }

  getNatures(name) {
    return smogon.natures[name];
  }

  getPokemon(name) {
    return smogon.pokemon[name];
  }

  getTypes(name) {
    return smogon.types[name];
  }

  getNames() {
    return Object.keys(smogon.pokemon);
  }
}