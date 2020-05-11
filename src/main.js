import Vue from 'vue';
import Toasted from 'vue-toasted';
import App from './App.vue';
import store from './store';

import * as filters from './common/filters';

Vue.config.productionTip = false;
Vue.use(Toasted);

// eslint-disable-next-line no-restricted-syntax
for (const filterKey of Object.keys(filters)) {
  if (filterKey.endsWith('Filter')) { Vue.filter(filterKey, filters[filterKey]); }
}

Vue.mixin({
  methods: {
    sendMsg(msg) {
      this.$toasted.show(msg, {
        theme: 'outline',
        position: 'bottom-center',
        duration: 2000,
      });
    },
  },
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
