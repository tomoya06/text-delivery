import Vue from 'vue';
import App from './App.vue';
import store from './store';

import * as filters from './common/filters';

Vue.config.productionTip = false;

// eslint-disable-next-line no-restricted-syntax
for (const filterKey of Object.keys(filters)) {
  if (filterKey.endsWith('Filter')) { Vue.filter(filterKey, filters[filterKey]); }
}

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
