import Enum from 'enum';

export const playerState = new Enum([
  'free',
  'gettingPackage',
  'startSendingPackage',
  'sendingPackageOnCar',
  'sendingPackageOnFoot',
  'finishedPackage',
]);

export const carState = new Enum(['fine', 'driving', 'outOfGas', 'broken', 'charging']);
