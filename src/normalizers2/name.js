import { getMegaVariant } from '../helpers/megas';

export const normalizeName = name => {
  name = name.toLowerCase();
  name = name.replace(/ /g, '_');
  name = name.replace('\'', '');
  name = name.replace('.', '');
  name = name.replace(':', '');
  name = name.replace('♀', '-f');
  name = name.replace('♂', '-m');

  return name;
};

export const normalizeMegaName = (name, suffix) => {
  const variant = getMegaVariant(suffix);
  return name + (variant ? `-mega-${variant}` : '-mega');
};
