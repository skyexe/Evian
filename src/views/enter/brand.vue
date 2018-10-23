<template>
  <div class="brand-page-wrap" ref="wrap">
    <mu-circular-progress :size="40" color="burlywood" v-if="isLoading" @touchmove="" @touchend=""/>
    <div class="container" ref="container" v-show="!isLoading">
      <div class="active-title line-middle" v-show="showActiveTitle">
        <div class="line-middle-text">{{activeList}}</div>
      </div>
      <div class="list" :ref="`list_${key}`" v-if="list.length!=0" v-for="(list,key) in brandList">
        <div class="title">
          <div class="line-middle">
            <div class="line-middle-text">{{key}}</div>
          </div>
        </div>
        <div class="item" v-for="item in list">
          <div class="touch-area" @click="go(item.id,item.title)">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div class="select-bar" :style="{'font-size':(wrapHeight*0.025>=16?16:wrapHeight*0.025)+'px'}" ref="sel-bar">
      <div class="item" :style="{'height':(wrapHeight*0.0338>=22?22:wrapHeight*0.0338)+'px'}"
           @touchmove="selLetter($event)" @touchstart="selLetter($event)"
           v-if="item.length!=0" v-for="(item,key) in brandList">
        {{key}}
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api';
  import PinyinFirstLetter from 'utils/PinyinFirstLetter'
  let HEADER_HEIGHT = 84;
  let TITLE_HEIGHT = 48;
  let INIT_TITLE = '';
  let HAS_DATA = false;
  let SCO_TOP = 0;
  export default {
    data () {
      return {
        showActiveTitle: true,
        //progress
        isLoading: false,
        //wrap
        wrapHeight: 0,
        //data
        brandList: {},
        activeList: '',
      }
    },
    created(){
    },
    mounted() {
      this.wrapHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrap.getBoundingClientRect().top;
      let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
      str.split('').forEach(item => {
        this.brandList[item] = [];
      });
      this.getData();
    },
    activated(){
      this.activeList = INIT_TITLE;
      scrollTo(0, SCO_TOP);
      if (!HAS_DATA) {
        this.isLoading = true;
      } else {
        let that = this;
        window.onscroll = function () {
          that.calcActiveList();
          that.getScrollTop();
        }
      }
    },
    deactivated() {
      this.isLoading = false;
      this.refreshing = false;
      window.onscroll = null;
    },
    methods: {
      getData(){
        let list = this.brandList;
        api.getBrandList('?no_limit=true').then(res => {
          if (res) {
            //数据按首字母分类
            res.data.forEach(data => {
              let s = data.title[0].toUpperCase();
              for (let key in list) {
                if (key == PinyinFirstLetter(s).toUpperCase() || key == s) {
                  list[key].push(data);
                  data.isClaim = 1;
                  break;
                }
              }
              if (data.isClaim != 1)
                list['#'].push(data);
            });

            //计算当前title
            for (let key in list) {
              if (list[key].length != 0) {
                this.activeList = INIT_TITLE = key;
                break;
              }
            }
            //记录是否有数据
            HAS_DATA = true;

            //绑定滚动事件
            let that = this;
            window.onscroll = function () {
              that.calcActiveList();
              that.getScrollTop();
            }
          }
          this.isLoading = false;
        });
      },
      selLetter(e){
        e.preventDefault();
        let y = e.touches[0].clientY;
        let bar = this.$refs['sel-bar'].querySelectorAll('.item');
        let val = '';
        for (let i = 0; i < bar.length; i++) {
          let top = bar[i].getBoundingClientRect().top;
          if (top > y) {
            let index = i == 0 ? 0 : (i - 1);
            val = bar[index].innerText;
            break;
          }
          if (i == (bar.length - 1)) {
            val = bar[i].innerText;
            break;
          }
        }
        if (val && this.$refs[`list_${val}`][0]) {
          let containerHeight = this.$refs['container'].clientHeight;
          let itemTop = this.$refs[`list_${val}`][0].offsetTop;
          if (containerHeight - itemTop > this.wrapHeight - TITLE_HEIGHT) {
            scrollTo(0, itemTop);
          } else {
            let maxScroll = containerHeight - this.wrapHeight;
            scrollTo(0, maxScroll > 0 ? maxScroll : 0)
          }
          this.calcActiveList();
        }
      },
      calcActiveList(){
        let wrapTop = HEADER_HEIGHT + TITLE_HEIGHT / 2;
        let list = this.$refs['container'].querySelectorAll('.list');
        if (list[0] && list[0].getBoundingClientRect().top > HEADER_HEIGHT) {
          this.showActiveTitle = false;
          return;
        }
        this.showActiveTitle = true;
        for (let i = 0; i < list.length; i++) {
          let top = list[i].getBoundingClientRect().top;
          if (top > wrapTop) {
            let index = i == 0 ? 0 : (i - 1);
            this.activeList = list[index].innerText.split('')[0];
            break;
          }
        }
      },
      getScrollTop(){
        SCO_TOP = document.documentElement.scrollTop || document.body.scrollTop;
      },
      go(id, title){
        this.$MKOPush(`/goods_list/brand?id=${id}&title=${title}`);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  @topHeight: @header+@enterTabsHeight;
  .brand-page-wrap {
    display: flex;
    .select-bar {
      position: fixed;
      top: 50%;
      right: 0.3rem;
      transform: translate(0, -50%);
      transform: -webkit-translate(0, -50%);
      flex: 0 0 24px;
      width: 54px;
      padding-top: 62px;
      font-size: 16px;
      text-align: center;
      color: @mainDarkColor;
      .item {
        height: 22px;
        padding-left: 30px;
      }
    }
    .container {
      flex: 1;
      position: relative;
      margin-right: 24px;
      .active-title {
        position: fixed;
        right: 24px;
        left: 0;
        width: 100%;
        z-index: 1;
        margin-left: 20px;
        height: 48px;
        font-size: 2.4rem;
        color: @mainDarkColor;
        background: #fff;
      }
      .list {
        .title {
          margin-left: 20px;
          height: 48px;
          font-size: 2.4rem;
          color: @mainDarkColor;
          background: #fff;
          &.active {
            /**/
          }
          > div {
            height: 100%;
          }
        }
        .is-active {
          /*padding-top: 48px;*/
        }
        .item {
          margin-left: 18px;
          padding: 14px 0 2px 2px;
          height: 48px;
          font-size: 1.7rem;
          letter-spacing: -0.41px;
          .touch-area {
            width: 85%;
          }
        }
      }
    }
  }
</style>
