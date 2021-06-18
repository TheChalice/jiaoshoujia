import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.use(Vant);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
