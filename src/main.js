import 'es6-promise/auto'


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'
import MKOHistoryManager from './plugins/MKOHistoryManager'
import MKOMessagePlugin from './plugins/MKOMessagePlugin'
import MKOUITools from './plugins/MKOUITools'
import MKOLike from './plugins/MKOLike'
import MKOTap from './plugins/MKOTap'
import AwesomeSwiper from 'vue-awesome-swiper'


Vue.config.productionTip = false

Vue.use(MuseUI);
Vue.use(MKOHistoryManager);
Vue.use(MKOMessagePlugin);
Vue.use(MKOUITools);
Vue.use(MKOLike);
Vue.use(MKOTap);
Vue.use(AwesomeSwiper);

document.addEventListener('backbutton', function (e) {
  e.preventDefault();
  if (window.mkoBackButton && window.mkoBackButton.bInputData) {
    window.mkoBackButton.callback();
    return;
  }
  let route = window.mkoVue.$MKOPop();
  if (!route) {
    // 已经返回到最顶部了，交给原生处理
  }
}, false);

window.mkoBackButton = {};
window.mkoVue = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
