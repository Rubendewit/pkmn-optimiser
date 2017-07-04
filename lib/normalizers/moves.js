import _ from 'lodash';
import { arrayToObject } from '../helpers/util';

const addTypeToMove = move => {
  move = Object.assign(...move);
  const { level, tm, parent } = move;

  // if(level) type = 'levelup';
  // if(tm) type = 'tm';
  // if(parent) type = 'breeding';

  return level ? 'levelup' : tm ? 'tm' : parent ? 'breeding' : '';
};

const mergeLearnsets = (learnset, smogonLearnset) => {
  smogonLearnset = arrayToObject(_.uniq(smogonLearnset));
  learnset = _.groupBy(learnset, 'move');

  const moves = {...smogonLearnset, ...learnset};
  return moves;
};

export const normalizeMoves = (learnset, smogonLearnset) => {
  const moves = mergeLearnsets(learnset, smogonLearnset);

  // _.forEach(moves, move => {
  //   const type = addTypeToMove(move);
  //   return _.flatten(move);
  // });

  console.log('>>>', moves);

  return moves;
};
