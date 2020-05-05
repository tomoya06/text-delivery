import { pickFromArray } from './random';

const allCoupons = require('../data/coupons.json');

/**
 *
 * @param {String} exec
 */
function execCoupon(ogVal, exec) {
  const [cmd, val] = exec.split(' ');
  switch (cmd) {
    case '*': return ogVal * parseFloat(val);
    case '+': return ogVal + parseFloat(val);
    default: return ogVal;
  }
}

/**
 *
 * @param {Object} incomes
 * @param {Array} coupons
 */
export function calcCoupon(incomes, coupons) {
  const newIncomes = JSON.parse(JSON.stringify(incomes));
  coupons.forEach((coupon) => {
    if (newIncomes[coupon.type]) {
      newIncomes[coupon.type].value = execCoupon(newIncomes[coupon.type].value, coupon.exec);
    }
  });
  return newIncomes;
}

export function generateNewCoupon() {
  return pickFromArray(allCoupons);
}

export function placeHolder() {}
