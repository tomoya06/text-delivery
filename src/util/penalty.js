import { randomTrue, pickFromArray } from './random';

const allPenalties = require('../data/penalties.json');

const defaultPenaltyRate = 0.01;


/**
 * @param {Number} rate
 */
export function doYouNeedAPenalty(rate = defaultPenaltyRate) {
  const isPenalty = randomTrue(rate);
  if (!isPenalty) {
    return null;
  }
  return pickFromArray(allPenalties);
}

export function placeHolder() {}
