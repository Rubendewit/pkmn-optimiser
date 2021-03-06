import _ from 'lodash';
import { isDefined } from '../helpers/util';

const hiddenPowerRE = new RegExp('^Hidden Power ', 'i');

const arrayToMoveObject = array => {
  return array.reduce((obj, move) => {
    obj[move] = [{ move }];
    return obj;
  }, {});
};

const normalizeMove = move => {
  const parents = [];
  const types = [];
  const name = move[0].move;
  let level, tm;

  move.forEach(item => {
    if(typeof item.level === 'number') {
      level = item.level;
      types.push('levelup');
    }
    if(item.tm) {
      types.push('tm');
      tm = item.tm;
    }
    if(item.parent) {
      parents.push(item.parent);
      types.push('breeding');
    }
  });

  return _.pickBy({
    name,
    types: _.isEmpty(types) ? ['misc'] : _.uniq(types),
    level,
    parents,
    tm
  }, isDefined);
};

const mergeLearnsets = (learnset, smogonLearnset) => {
  smogonLearnset = arrayToMoveObject(_.uniq(smogonLearnset));
  learnset = _.groupBy(learnset, 'move');
  return {...smogonLearnset, ...learnset};
};

const removeHiddenPowers = moves => _.filter(moves, move => !hiddenPowerRE.test(move.name));

export const normalizeLearnset = (learnset, smogonLearnset) => {
  const moves = mergeLearnsets(learnset, smogonLearnset);
  const normalizedMoves = _.map(moves, move => normalizeMove(move));
  return removeHiddenPowers(normalizedMoves);
};
