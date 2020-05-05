/**
 * @param {Array} list
 */
export function pickFromArray(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {Array} list
 */
export function pickIndexFromArray(list) {
  return Math.floor(Math.random() * list.length);
}


/**
 * 隨機生成配送距離。單位m
 */
export function generateDistance() {
  return Math.random() * 5000 + 1000;
}

export function generateRandomTime() {
  return Math.random() * 500 + 600;
}

export function randomTrue(rate) {
  return Math.random() <= rate;
}
