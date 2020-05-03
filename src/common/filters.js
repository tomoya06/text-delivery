/**
 * @param {Number} value
 */
export function fixedNumberFilter(value) {
  return value.toFixed(1);
}

export function distanceFilter(value) {
  if (value > 1000) {
    return `${(value / 1000).toFixed(1)} km`;
  }
  return `${value.toFixed(1)} m`;
}

export function moneyFilter(value) {
  return `${value.toFixed(1)}園`;
}

export function rawDistanceFilter(value) {
  return `${value.toFixed(1)} m`;
}

export function percentFilter(value) {
  return `${(value * 100).toFixed(1)}%`;
}
