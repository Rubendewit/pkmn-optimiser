import _ from 'lodash';

export const normalizeSpeciesIds = result =>
  _(result)
    .map(id => id.species_id)
    .sortBy();

export const normalizeSpeciesName = ([result]) => result.name;

export const normalizeSpeciesTypes = res => {
  console.log('+++++++++');
  console.log(res);
  return res;
};
