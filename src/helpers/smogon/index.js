import _ from 'lodash';
import Debug from 'debug';
import * as resources from './resources';
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
        const { shorthand, name } = item;
        const key = normalizeName(shorthand || name);
        smogon[resourceKey][key] = item;
      });
    });
  }

  async getAbilities(name) {
    return smogon.abilities[name];
  }

  async getFormats(name) {
    return smogon.formats[name];
  }

  async getItems(name) {
    return smogon.items[name];
  }

  async getMoves(name) {
    return smogon.moves[name];
  }

  async getNatures(name) {
    return smogon.natures[name];
  }

  async getPokemon(name) {
    return smogon.pokemon[name];
  }

  async getTypes(name) {
    return smogon.types[name];
  }
}