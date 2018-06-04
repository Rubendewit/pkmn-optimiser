import _ from 'lodash';

export const normalizeName = name => {
  name = name.toLowerCase();
  name = _.deburr(name);
  name = name.replace(/ /g, '_');
  name = name.replace('\'', '');
  name = name.replace('.', '');
  name = name.replace(':', '');
  name = name.replace('’', '');
  name = name.replace('♀', '-f');
  name = name.replace('♂', '-m');

  return name;
};
