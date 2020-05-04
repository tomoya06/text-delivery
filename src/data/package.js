const allProvidersData = require('./allPackage.json');

const filteredProvidersData = allProvidersData.map((provider) => ({
  name: provider.name.replace(/[(（].*/, ''),
  services: provider.services.filter((item) => item.price[0] !== 0),
}));

export const serviceProviders = filteredProvidersData;

const allRcvNames = require('./allRcvNames.json');

const filteredRcvNames = [...new Set(allRcvNames)]
  .map((name) => name.replace(/\W/, ''))
  .filter((name) => name);

export const rcvNames = filteredRcvNames;

export const competitorNames = filteredRcvNames;
