import _ from 'lodash';

export const normalizeAbilities = (abilities, smogonAbilities) => {
  smogonAbilities = _.map(smogonAbilities, ability => ({name: ability }));
  return _.merge(abilities, smogonAbilities);
};
