import _ from 'lodash';
import { statMap } from '../constants/stats';

export const normalizeSpeciesAbilities = speciesAbilities => {
  const abilities = _.map(speciesAbilities, ability => {
    const { abilityName, isHidden, order } = ability;
    const name = abilityName
      .split('-')
      .reduce((res, word) => res + ' ' + _.capitalize(word), '')
      .trim();

    return {
      name,
      isHidden,
      order
    };
  });

  return abilities;
};

export const normalizeSpeciesStats = speciesStats => {
  const stats = speciesStats.reduce(
    (obj, stat) => {
      const { stat_id, base_stat } = stat;
      const name = statMap[stat_id];
      obj[name] = base_stat;
      obj.total += base_stat;
      return obj;
    },
    { total: 0 }
  );

  return stats;
};
