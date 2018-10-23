<template>
  <div class="classify-page-wrap">
    <div class="tab-wrap">
      <div class="tab">
        <div class="item-wrap" :class="{'active':item.value==activeTab}" @click="handleTabChange(item.value)"
             v-for="item in tabItem">
          <div class="item">{{item.text}}</div>
        </div>
      </div>
    </div>

    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh" v-if="activeTab=='sp'"/>
    <mu-circular-progress :size="40" color="burlywood" v-if="isLoading"/>
    <div class="container" v-if="item.value==activeTab" v-for="item in tabItem">
      <div class="card" @click="go(data.title,data.id)" v-for="data in item.data" v-if="activeTab!='sp'">
        <div class="photo-wrap"
             :style="{backgroundImage: `url(${data.cover})`}">
          <div class="mask"></div>
        </div>
        <div class="content abs-all-middle" :class="data.ab[0]">
        </div>
      </div>
      <!--特价列表-->
      <list :list="item.data" v-show="!isLoading" v-if="activeTab=='sp'"></list>
      <mu-infinite-scroll :scroller="scroller" :loading="isInfiloading" :loadingText="loadingText"
                          v-if="activeTab=='sp'&&!noMoreData"/>
      <!--返回顶部-->
      <to-top v-if="activeTab=='sp'&&showToTop"></to-top>
    </div>
  </div>
</template>

<script>
  import api from 'api';
  import conf from '../../config.js'
  import Lang from 'language'
  import { imgZoomFr } from 'filters';
  import { list, toTop } from 'components';
  let SCO_TOP = 0;
  let BODY_HEIGHT = 0;
  let WRAP_HEIGHT = 0;
  export default {
    data () {
      return {
        showToTop: false,
        //refresh
        refreshing: false,
        trigger: null,
        //progress
        isLoading: false,
        //infiniteScroll
        scroller: null,
        isInfiloading: false,
        loadingText: '',
        noMoreData: false,
        //tab
        activeTab: '0',
        tabItem: [
          {text: Lang.class_tab_female, value: '0', data: []},
          {text: Lang.class_tab_male, value: '1', data: []},
          {text: Lang.special_price, value: 'sp', data: []}
        ],
        spPage: 1,
        spPageSize: 20,
      }
    },
    mounted() {
      WRAP_HEIGHT = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
      this.trigger = this.$el;
      this.scroller = this.$el
    },
    activated(){
      scrollTo(0, SCO_TOP);
      if (this.activeTab == 'sp') {
        if (this.tabItem[2].data.length == 0) {
          this.spPage = 1;
          this.noMoreData = false;
          this.getSpData();
        } else {
          window.onscroll = this.getScrollTop;
          this.calcLikeData(this.tabItem[2].data);
        }
      } else {
        window.onscroll = this.getScrollTop;
        this.getData(this.activeTab);
      }
    },
    deactivated() {
      this.isLoading = false;
      this.refreshing = false;
      window.onscroll = null;
    },
    methods: {
      imgZoomFr,
      getData(gender, isRefresh){

        if (!isRefresh)
          this.isLoading = true;

        api.getLibClassList(gender + '?no_limit=true').then(res => {
          if (res) {
            let sizeConf = `${parseInt((conf.clientWidth > conf.standardWidth ? conf.standardWidth : conf.clientWidth) * conf.deviceRatio)},0,2`;
            this.tabItem[gender].data = res.data.map(item => {
              item.cover = this.imgZoomFr(conf.imgPath + item.cover, sizeConf);
              return item;
            });
          }
          this.isLoading = false;
          this.refreshing = false;
        });
      },
      getSpData(isRefresh){

        if (!isRefresh && this.spPage == 1) {
          this.isLoading = true;
        }

        let params = `?is_offer=1&page=${this.spPage}&page_size=${this.spPageSize}`;
        api.getGoodsList(params).then(res => {
          if (res && res.data) {
            let dataLength = res.data.data.length;
            if (this.spPage == 1) {
              this.tabItem[2].data = res.data.data;
            } else {
              if (dataLength > 0) {
                res.data.data.forEach(item => {
                  this.tabItem[2].data.push(item);
                });
              }
            }
            if (dataLength < this.spPageSize)
              this.noMoreData = true;
            this.calcLikeData(this.tabItem[2].data);
          }
          this.getScrollTop();
          window.onscroll = this.getScrollTop;
          this.isLoading = false;
          this.refreshing = false;
          this.isInfiloading = false;
        });
      },
      calcLikeData(list){
        let local = localStorage.getItem('vinjak_like');
        let arr = [];
        if (local) {
          try {
            arr = JSON.parse(local);
          } catch (err) {
            console.log(err.name)
          }
        }
        list.forEach((item, index) => {
          item.isLike = 0;
          for (let like of arr) {
            if (item.id == like.id)
              item.isLike = 1;
          }
          list.splice(index, 1, item)
        });
      },
      //仅特价商品页面有refresh和loadMore方法
      refresh(){
        this.spPage = 1;
        this.noMoreData = false;
        this.refreshing = true;
        this.getSpData(1);
      },
      loadMore(){
        if (this.noMoreData || this.isInfiloading)
          return;

        this.isInfiloading = true;
        this.spPage++;
        this.getSpData();
      },
      handleTabChange(val){
        this.isLoading = false;
        this.activeTab = val;
        scrollTo(0, 0);

        if (val == 'sp') {
          if (this.tabItem[2].data.length == 0) {
            this.spPage = 1;
            this.noMoreData = false;
            this.getSpData();
          } else {
            this.calcLikeData(this.tabItem[2].data);
          }
          return;
        }
        if (this.tabItem[this.activeTab].data.length == 0)
          this.getData(val);
      },
      getScrollTop(){
        SCO_TOP = document.documentElement.scrollTop || document.body.scrollTop;
        BODY_HEIGHT = document.body.clientHeight;
        if (SCO_TOP != 0 && SCO_TOP >= BODY_HEIGHT - WRAP_HEIGHT)
          this.loadMore();

        if (SCO_TOP > WRAP_HEIGHT) {
          this.showToTop = true;
        } else {
          this.showToTop = false;
        }
      },
      go(title, id){
        this.$MKOPush(`/goods_list/classify?type=${title}&id=${id}`);
      },
    },
    components: {
      list, toTop
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .classify-page-wrap {
    .tab-wrap {
      position: fixed;
      z-index: 3;
      width: 100%;
      max-width: @standardWidth;
      height: 46px;
      background: #fff;
      padding: 8px;
      .tab {
        position: relative;
        text-align: center;
        .item-wrap {
          float: left;
          display: table;
          width: 33.33%;
          border: 1px solid @borderDark00;
          border-left: none;
          border-right: none;
          height: 30px;
          background-color: #fff;
          &:first-child {
            border: 1px solid @borderDark00;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          &:last-child {
            border: 1px solid @borderDark00;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          &.active {
            background-color: @mainBgColor;
            color: #fff;
          }
          .item {
            position: relative;
            top: 1px;
            display: table-cell;
            vertical-align: middle;
          }
        }
      }
    }
    .container {
      margin-top: 46px;
      .card {
        position: relative;
        margin-bottom: 1px;
        overflow: hidden;
        .photo-wrap {
          position: relative;
          width: 100%;
          max-width: @standardWidth;
          height: 132px;
          overflow: hidden;
          background: no-repeat center;
          background-size: cover;
          img {
            height: 100%;
          }
          .mask {
            position: absolute;
            /*z-index: 1;*/
            width: 100%;
            height: 100%;
            opacity: 0.5;
            background: #000000;

          }
        }
        .content {
          position: absolute;
          /*z-index: 2;*/
          width: 212px;
          height: 44px;
          /*top: 50%;*/
          /*transform: translate(0, -50%);*/
          /*-webkit-ttransform: translate(0, -50%);*/
          text-align: center;
          color: #fff;
          background: url(/static/image/classify_name.png) 0 0 no-repeat;
          background-size: 848px 129px;
          &.A {
            background-position: 0 0;
          }
          &.B {
            background-position: -212px 0;
          }
          &.C {
            background-position: -424px 0;
          }
          &.D {
            background-position: -636px 0;
          }
          &.E {
            background-position: 0 -44px;
          }
          &.F {
            background-position: -212px -44px;
          }
          &.G {
            background-position: -424px -44px;
          }
          &.H {
            background-position: -636px -44px;
          }
        }
      }
    }
  }
</style>
