import Vue from 'vue';
import App from './App.vue';
import store from './store';

import { fixedNumberFilter } from './common/filters';

Vue.config.productionTip = false;

Vue.filter('fixedNumberFilter', fixedNumberFilter);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
