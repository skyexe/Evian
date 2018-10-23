<template>
  <div class="to-top-wrap" @click="scrollToTop">
    <div class="sign icon-Vin-to-top2"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    mounted() {
    },
    activated(){
    },
    deactivated() {
    },
    methods: {
      scrollToTop(){
        let SCO_TOP = document.documentElement.scrollTop || document.body.scrollTop;
        let STEP = SCO_TOP / 5;
        let timer = setInterval(() => {
          let top = document.documentElement.scrollTop || document.body.scrollTop;
          if (top <= 0) {
            clearTimeout(timer);
            return;
          }
          scrollTo(0, top - STEP);
        }, 20)


      },
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .to-top-wrap {
    display: table;
    position: fixed;
    right: 12px;
    bottom: 72px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(240, 241, 241, .5);
    box-shadow: 0 1px 3px @bgGrey00;
    text-align: center;
    .sign {
      display: table-cell;
      vertical-align: middle;
      font-size: 26px;
      color: @mainBgColor;
    }
  }
</style>
