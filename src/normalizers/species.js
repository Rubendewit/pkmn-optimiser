import _ from 'lodash';
import { statMap } from '../constants/stats';

export const normalizeSpeciesIds = speciesIds =>
  _(speciesIds)
    .map(id => id.species_id)
    .sortBy();

export const normalizeSpeciesName = ([speciesName]) => speciesName.name;

export const normalizeSpeciesStats = speciesStats => {
  const stats = {};
  let total = 0;

  _.forEach(speciesStats, stat => {
    const { stat_id, base_stat } = stat;
    const name = statMap[stat_id];
    stats[name] = base_stat;
    total = total + base_stat;
  });

  stats.total = total;

  return stats;
};
