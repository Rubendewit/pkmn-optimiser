import _ from 'lodash';
import { getMegaVariant } from '../helpers/megas';

const megaEvoProps = [
  'types',
  'ability',
  'mega_stone',
  'mega_form',
  'base_stats'
];

const _sanitizeMegaEvo = evolution => {
  evolution.mega_form = getMegaVariant(evolution.image_suffix);
  return _.pick(evolution, megaEvoProps);
};

export const normalizeMegaEvolutions = evolutions => _.map(evolutions, _sanitizeMegaEvo);
