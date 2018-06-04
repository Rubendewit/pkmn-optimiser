import _ from 'lodash';
import Boom from 'boom';
import Smogon from '../helpers/smogon';
import { normalizeName } from '../normalizers/names';
import {
  getSpeciesAbilities,
  getSpeciesForms,
  getSpecies,
  getSpeciesName,
  getSpeciesStats,
  getSpeciesTypes
} from '../queries/species';


export const getPokemonDetail = () => {};

export const getPokemon = async () => {
  try {
    return await getSpecies();
  } catch(err) {
    throw Boom.badImplementation(err);
  }
};

export const getPokemonOverviewData = async ({ id, languageId }) => {
  const smogon = new Smogon();
  
  try {
    const name = await getSpeciesName({ id, languageId });
    const normalizedName = normalizeName(name);
    const types = await getSpeciesTypes({ id });
    const stats = await getSpeciesStats({ id });
    const abilities = await getSpeciesAbilities({ id });
    const forms = await getSpeciesForms({ id });
    let format;

    const smogonData = smogon.getPokemon(normalizedName);
    
    if(smogonData) {
      const [variants, base] = _.partition(smogonData.alts, alt => !!alt.suffix);

      format = base[0].formats;

      forms.forEach(form => {
        const { formname } = form;

        if(formname.includes('alola')) {
          const alolaData = smogon.getPokemon(formname);
          
          if(alolaData) {
            form.format = _.result(alolaData, 'alts[0].formats');
          }
        } else {       
          variants.forEach(variant => {
            const variantName = normalizedName + '-' + variant.suffix.toLowerCase();

            if(formname === variantName) {
              form.format = variant.formats;
            }
          });
        }
      });
    }

    return { id, name, types, stats, abilities, format, forms };
  } catch(err) {
    throw Boom.badImplementation(err);
  }
};
