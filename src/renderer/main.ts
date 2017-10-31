import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.use(Vuetify);
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>',
}).$mount('#app');


// Make drag/drop work already:
// https://github.com/electron/electron/issues/908#issuecomment-66510118
document.addEventListener('drop', (e: any) => {
	e.preventDefault();
	e.stopPropagation();
});
document.addEventListener('dragover', (e: any) => {
	e.preventDefault();
	e.stopPropagation();
});
