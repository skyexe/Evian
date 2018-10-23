<template>
  <div v-if="!isBrowser||isWeixin">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Lang from 'language';
  import conf from './config.js';
  export default {
    data () {
      return {
        isWeixin: false,
        isBrowser: conf.isBrowser
      }
    },
    mounted() {
      let that = this;
      (function () {
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          that.isWeixin = true;
        } else {
          that.isWeixin = false;
        }
        if (that.isBrowser && !that.isWeixin) {
          let msg = `<div class="enter-dialog">对不起，本网站只能在微信打开，请搜索关注微信公众号：${Lang.wx_id} </br>或扫描以下二维码关注。<img class='enter-dialog-code' src="static/image/wx_code.jpg"></div>`;
          that.$MKODialog({
            msg: msg
          });
        }
      })();
    },
  }
</script>

<style lang="less" src="./App.less"></style>
<style lang="less">
  .enter-dialog{
    text-align: center;
    .enter-dialog-code {
      width: 80%;
    }
  }
</style>
