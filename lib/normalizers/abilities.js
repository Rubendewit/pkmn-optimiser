import _ from 'lodash';

export const normalizeAbilities = (smogonAbilities = [], abilities = []) => {
  smogonAbilities = _.map(smogonAbilities, ability => ({name: ability }));
  return _.merge(abilities, smogonAbilities);
};
