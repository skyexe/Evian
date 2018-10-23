import 'es6-promise/auto'
Object.assign = require('object-assign')

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

var cordovaApp = {
  initialize: function (callback) {
    this.bindEvents()
    this.initialized = callback
  },
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  onDeviceReady: function () {
    cordovaApp.receivedEvent('deviceready')
    document.addEventListener('backbutton', function (e) {
      if (window.mkoBackButton && window.mkoBackButton.bInputData) {
        window.mkoBackButton.callback();
        return;
      }
      e.preventDefault();
      let route = window.mkoVue.$MKOPop();
      if (!route) {
        // 已经返回到最顶部了，交给原生处理
      }
    }, false);
  },
  receivedEvent: function (id) {
    this.initialized()
  }
};

window.mkoBackButton = {};
cordovaApp.initialize(function () {
  console.log(window.device)
  window.mkoBackButton = {};
  window.mkoVue = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
  })
})