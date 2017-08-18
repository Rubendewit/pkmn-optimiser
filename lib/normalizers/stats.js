export const normalizeStats = (stats) => {
  const { hp, atk, def, spa, spd, spe } = stats;
  const total = hp + atk + def + spa + spd + spe;
  return { hp, atk, def, spa, spd, spe, total };
};
