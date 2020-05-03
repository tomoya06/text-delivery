import Vue from 'vue';
import App from './App.vue';
import store from './store';

import { fixedNumberFilter, distanceFilter } from './common/filters';

Vue.config.productionTip = false;

Vue.filter('fixedNumberFilter', fixedNumberFilter);
Vue.filter('distanceFilter', distanceFilter);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
