export const exceptions = {
  'Meowstic-M': ({name}) => {
    name = name.replace('-M', '');
    return name;
  },
  'Meowstic-F': ({name}) => {
    name = name.replace('-F', '-female');
    return name;
  }
};
