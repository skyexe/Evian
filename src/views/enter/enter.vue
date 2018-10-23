<template>
  <div>
    <div class="header-top"></div>
    <div class="header-wrap" :class="{'has-search-bar':searchBarShow}">
      <mu-appbar :zDepth=0>
        <div class="text-wrap" slot="left">
          <div class="icon icon-Vin-search" @click="showSearchBar"></div>
        </div>
        <div class="text-wrap" slot="default" v-show="!searchBarShow">
          <div class="icon-Vin-logo-title"></div>
        </div>
        <search-bar @cancel="searchBarShow=false" v-show="searchBarShow" slot="default"></search-bar>
        <div class="text-wrap" slot="right" v-show="!searchBarShow">
          <div class="icon icon-Vin-like" @click="go('/like_list')"></div>
        </div>
      </mu-appbar>
    </div>
    <!--<div class="search-wrap" v-if="searchBarShow">-->
    <!--<div class="search">-->
    <!--<div class="ipt-wrap">-->
    <!--<div class="placeHolder abs-all-middle">-->
    <!--<i class="sign icon-Vin-search" v-if="!onFocus"></i>-->
    <!--<span v-if="!onFocus">Search</span>-->
    <!--</div>-->
    <!--<input class="ipt abs-middle" type="text" v-model="searchVal" @focus="onFocus=true" @blur="onFocus=false"-->
    <!--@keyup.enter="searchGoods">-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <div v-show="!searchBarShow">
      <tabs :class="{'has-search-bar':searchBarShow}" :activeTab="activeType"></tabs>
      <keep-alive>
        <router-view class="page-wrap"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  let clientHeight = document.documentElement.clientHeight;
  import {tabs, searchBar} from 'components';
  export default {
    data () {
      return {
        searchVal: '',
        searchBarShow: false,
        searchBarScroll: false,
        onFocus: false,
//        hasSearchBar: false
      }
    },
    watch: {},
    computed: {
      activeType(){
        return this.$route.path.split('/')[2] || 'new_goods';
      },
    },
    mounted(){
//        window.onscroll = this.ctrlSearchBar;
    },
    activated(){
    },
    deactivated(){
    },
    methods: {
      showSearchBar(){
        this.searchBarShow = true;
      },
      ctrlSearchBar(){
        let scoTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scoTop >= clientHeight / 10) {
          this.searchBarShow = true;
        } else {
          this.searchBarShow = false;
        }
      },
      go(path){
        this.$MKOPush(path);
      }
    },
    components: {
      tabs, searchBar
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config";

  @searchBarHeight: 48px;
  .has-search-bar {
    .mu-tabs {
      top: @header+@searchBarHeight !important;
    }
  }

  .search-wrap {
    height: @searchBarHeight;
    .search {
      z-index: 3;
      position: fixed;
      top: @header;
      padding: 7px 1.93%;
      width: 100%;
      height: @searchBarHeight;
      background-color: @bgGrey00;
      .ipt-wrap {
        position: relative;
        /*width:96.14%; */
        height: 34px;
        background: #FFFFFF;
        border-radius: 100px;
        .placeHolder {
          z-index: 10;
          color: #8c8c8c;
        }
        .ipt {
          width: 90%;
          height: 34px;
        }
      }
    }
  }
</style>
