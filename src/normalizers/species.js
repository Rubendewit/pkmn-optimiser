import _ from 'lodash';
import { statMap } from '../constants/stats';

export const normalizeSpeciesIds = speciesIds =>
  _(speciesIds)
    .map(id => id.species_id)
    .sortBy();

export const normalizeSpeciesName = ([speciesName]) => speciesName.name;

export const normalizeSpeciesStats = speciesStats => {
  const stats = {};

  _.forEach(speciesStats, stat => {
    const name = statMap[stat.stat_id];
    stats[name] = stat.base_stat;
  });

  return stats;
};
