<template>
  <div>
    <div class="header-top"></div>
    <div class="header-wrap">
      <mu-appbar :zDepth=0>
        <div class="text-wrap" slot="left">
          <div class="icon icon-Vin-back" @click="back"></div>
        </div>
        <div class="text-wrap" slot="default">
          <div class="icon-Vin-logo-title" v-if="type!='brand'&&type!='classify'"></div>
          <div v-if="!isLoading&&type=='brand'">{{brandInfo.title || $route.query.title}}</div>
          <div v-if="!isLoading&&type=='classify'">{{$route.query.type}}</div>
        </div>
        <div class="icon" slot="right"></div>
      </mu-appbar>
    </div>

    <mu-circular-progress :size="40" color="burlywood" v-if="isLoading" />
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh" />

    <div class="page-wrap good_list_page_wrap" v-show="!isLoading">
      <!--仅品牌页面显示-->
      <div class="brand" v-if="type=='brand'">
        <div v-if="!hasSel">
          <div class="photo-wrap">
            <img class="abs-all-middle" :src="brandInfo.cover|photoFr" v-if="brandInfo.cover">
            <img class="abs-all-middle" src="static/image/brand_banner_default.png" v-else>
          </div>
          <div class="content-wrap">
            <div class="avatar" :class="{'no-logo':!brandInfo.logo}">
              <img class="abs-all-middle" :src="brandInfo.logo|photoFr" v-if="brandInfo.logo">
              <div class="default icon-Vin-non-image" v-else></div>
            </div>
            <div class="title no-overflow">{{brandInfo.title}}</div>
            <div class="title title-CN no-overflow">{{brandInfo.title2}}</div>
            <div class="des">{{brandInfo.remark}}</div>
          </div>
        </div>
        <div class="info-wrap" :class="{'has-sel':hasSel}">
          <div class="select-wrap">
            <div class="btn fl" @click="ctrlSelectPopup(true)">
              <div class="btn-text">筛选</div>
            </div>
            <mu-chip class="chip fl" @delete="deleteChip('gender')" showDelete v-if="genderTitle!==''">
              <div class="chip-text">
                {{genderTabs[genderTitle + 1].text}}
              </div>
            </mu-chip>
            <mu-chip class="chip fl" @delete="deleteChip('season')" showDelete v-if="seasonTitle">
              <div class="chip-text">
                {{seasonTitle}}
              </div>
            </mu-chip>
            <mu-popup position="bottom" popupClass="select-popup" :open="openPopup">
              <mu-content-block>
                <div class="header-top"></div>
                <div class="header">
                  <div class="title">{{brandInfo.title}}</div>
                  <div class="close icon-Vin-back" @click="ctrlSelectPopup(false)"></div>
                </div>
                <div class="main clear">
                  <div class="title">性别</div>
                  <div class="list">
                    <span class="item" :class="{'active':genderTitle===item.value}" @click="genderTitle=item.value"
                          v-for="item in genderTabs">{{item.text}}</span>
                  </div>
                </div>
                <div class="main clear">
                  <div class="title">季节</div>
                  <div class="list">
                    <span class="item" :class="{'active':seasonTitle==item}" @click="seasonTitle=item"
                          v-for="item in seasonList">{{item || '全部'}}</span>
                  </div>
                </div>
                <div class="footer" @click="selectData(1)">完成</div>
                <!--<mu-list>-->
                <!--<mu-list-item :title="item" v-for="item in seasonList" :key="item" @click="selectSeason(item,1)"/>-->
                <!--</mu-list>-->
              </mu-content-block>
            </mu-popup>
          </div>
          <div class="count">
            <div class="count-text">共{{listCount || 0}}件商品</div>
          </div>
        </div>
      </div>
      <!--列表-->
      <list :list="list" v-if="!isLoading"></list>
      <mu-infinite-scroll :scroller="scroller" :loading="isInfiloading" :loadingText="loadingText" v-if="!noMoreData" />
      <!--返回顶部-->
      <to-top v-if="showToTop"></to-top>
    </div>
  </div>
</template>

<script>
  import Lang from 'language';
  import api from 'api';
  import { tabs, list, toTop } from 'components';
  import { photoFr } from 'filters';
  let HISTORY_TYPE = '';
  let HISTORY_ID = '';
  let HISTORY_VAL = '';
  let SCO_TOP = 0;
  let BODY_HEIGHT = 0;  //内容的长度
  let WRAP_HEIGHT = 0;  //外层容器的长度

  let SEASON = '';
  let GENDER = '';
  export default {
    data () {
      return {
        Lang: Lang,
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
        //筛选-仅品牌页面
        openPopup: false,
        hasSel: false,
        genderTitle: '',
        genderTabs: [
          {text: '全部', value: ''},
          {text: '女士', value: 0},
          {text: '男士', value: 1}
        ],
        seasonTitle: '',
        seasonList: [],
        //data
        type: this.$route.params.type || 'new_goods',
        list: [],
        brandInfo: {},
        listCount: '',
        page: 1,
        pageSize: 20,
      }
    },
    mounted() {
      WRAP_HEIGHT = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
      this.Lang = Lang;
      this.trigger = this.$el;
      this.scroller = this.$el
    },
    activated(){
      this.type = this.$route.params.type || 'new_goods';
      scrollTo(0, SCO_TOP);
      if (HISTORY_TYPE == this.$route.params.type && HISTORY_ID == this.$route.query.id && HISTORY_VAL == this.$route.query.val) {
        window.onscroll = this.getScrollTop;
        this.calcLikeData(this.list);
      } else {
        this.page = 1;
        this.noMoreData = false;
        this.getData();
      }
    },
    deactivated() {
      this.isLoading = false;
      this.refreshing = false;
      this.isInfiloading = false;
      window.onscroll = null;
      window.mkoBackButton.bInputData = false;
    },
    methods: {
      getData(isRefresh){
        let page = this.page;
        let _id = this.$route.query.id;
        let _val = this.$route.query.val;
        if (!_id && !_val)
          return;

        if (!isRefresh && page == 1) {
          this.isLoading = true;
        }

        let params = this.calcRequest(this.type, _id, _val);
        api.getGoodsList(params).then(res => {
          if (res) {
            let dataLength = res.data.data.length;
            if (page == 1) {
              this.list = res.data.data;
              this.listCount = res.data.num || '';
              this.brandInfo = (this.list.length != 0) ? this.list[0].brand : {};
              if (this.type == 'brand')
                this.getSeasonList(this.brandInfo.ab);
            } else {
              if (dataLength > 0) {
                res.data.data.forEach(item => {
                  this.list.push(item);
                });
              }
            }
            if (dataLength < this.pageSize)
              this.noMoreData = true;
            this.calcLikeData(this.list);

            HISTORY_TYPE = this.$route.params.type;
            HISTORY_ID = _id;
            HISTORY_VAL = _val;
          }
          this.getScrollTop();
          window.onscroll = this.getScrollTop;
          this.isLoading = false;
          this.refreshing = false;
          this.isInfiloading = false;
        });
      },
      calcRequest(type, _id, _val){
        let page = `page=${this.page}&page_size=${this.pageSize}`;
        let params = {
          'new_goods': `?article_id=${_id}&${page}`,
          'classify': `?class_pid=${_id}&${page}`,
          'brand': `?brand_id=${_id}&${page}`,
          'search': `?keyword=${_val}&${page}`
        };
        return params[type];
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
      getSeasonList(ab){
        this.seasonTitle = "";
        this.seasonList = [];
        if (!ab)
          return;
        let params = `?brand_ab=${ab}&no_limit=true`;
        api.getSeasonList(params).then(res => {
          if (res) {
            this.seasonList = res.data;
            this.seasonList.unshift('');
          }
        });
      },
      refresh(){
        this.page = 1;
        this.noMoreData = false;
        this.refreshing = true;
        if (this.hasSel) {
          this.selectData()
        } else {
          this.getData(1);
        }
      },
      loadMore(){
        if (this.noMoreData || this.isInfiloading)
          return;

        this.isInfiloading = true;
        this.page++;
        if (this.hasSel) {
          this.selectData()
        } else {
          this.getData();
        }
      },
      ctrlSelectPopup(bool){
        this.openPopup = bool;
        this.seasonTitle = SEASON;
        this.genderTitle = GENDER;
      },
      selectData(init){
        this.openPopup = false;
        SEASON = this.seasonTitle;
        GENDER = this.genderTitle;

        this.hasSel = SEASON !== '' || GENDER !== '';

        if (init) {
          this.page = 1;
          this.noMoreData = false;
          this.isLoading = true;
        }

        this.setBackButton();

        let page = `page=${this.page}&page_size=${this.pageSize}`;
        let params = `?${page}&brand_id=${this.brandInfo.id}`;
        if (GENDER !== '')
          params += `&gender=${GENDER}`;
        if (SEASON)
          params += `&season_title=${SEASON}`;

        api.getGoodsList(params).then(res => {
          if (res) {
            let dataLength = res.data.data.length;
            if (this.page == 1) {
              this.list = res.data.data;
              this.listCount = res.data.num || '';
            } else {
              if (dataLength > 0) {
                res.data.data.forEach(item => {
                  this.list.push(item);
                });
              }
            }
            if (dataLength < this.pageSize)
              this.noMoreData = true;
            this.calcLikeData(this.list);
          }
          this.isLoading = false;
          this.isInfiloading = false;
          this.refreshing = false;
        });
      },
      deleteChip(title){
        let that = this;
        let fns = {
          'reset': function () {
            GENDER = that.genderTitle = '';
            SEASON = that.seasonTitle = '';
          },
          'gender': function () {
            GENDER = that.genderTitle = '';
          },
          'season': function () {
            SEASON = that.seasonTitle = '';
          }
        };
        fns[title]();

        this.selectData(1);
      },
      setBackButton(){
        if (!window.mkoBackButton)
          window.mkoBackButton = {};
        window.mkoBackButton.bInputData = true;
        window.mkoBackButton.callback = this.back;
      },
      back(){
        if (this.hasSel) {
          this.deleteChip('reset');
          return;
        }
        this.$MKOPop();
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
      }
    },
    components: {
      tabs, list, toTop
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .good_list_page_wrap {
    .brand {
      .photo-wrap {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        .icon {
          font-size: 50px;
          color: @nonColor;
        }
        img {
          width: 100%;
        }
      }
      .content-wrap {
        position: relative;
        padding: 5px 21px 10px;
        .avatar {
          position: absolute;
          top: -64px;
          left: 21px;
          width: 110px;
          height: 110px;
          border: 1px solid @borderDark01;
          border-radius: 8px;
          background: #FFFFFF;
          overflow: hidden;
          &.no-logo {
            border: 1px solid #fff;
          }
          .default {
            display: table;
            width: 100%;
            height: 100%;
            font-size: 5rem;
            text-align: center;
            background: @mainBgColor;
            color: #fff;
            &:before {
              display: table-cell;
              vertical-align: middle;
            }
          }
          img {
            width: 100%;
          }
        }
        .title {
          margin-left: 120px;
          line-height: 2.4rem;
          font-size: 2rem;
          letter-spacing: 0;
          color: #43464c;
          &.title-CN {
            height: 1.7rem;
            line-height: 1.7rem;
            font-size: 1.2rem;
          }
        }
        .des {
          margin: 20px auto 0;
          font-size: 1.4rem;
          letter-spacing: 1px;
          text-align: justify;
          color: @textGrey02;
        }
      }
      .info-wrap {
        height: 40px;
        padding: 10px 21px;
        &.has-sel {
          padding: 10px 3.5%;
        }
        .select-wrap {
          float: left;
          .btn {
            display: table;
            width: 48px;
            height: 20px;
            border: 1px solid #727377;
            border-radius: 10px;
            font-size: 14px;
            letter-spacing: 1px;
            text-align: center;
            color: #43464C;
            .btn-text {
              position: relative;
              top: 0.5px;
              left: 1px;
              display: table-cell;
              vertical-align: middle;
              line-height: 0;
            }
          }
        }
        .count {
          display: table;
          float: right;
          height: 20px;
          font-size: 1.4rem;
          color: #B2B6BE;
          letter-spacing: 0.85px;
          .count-text {
            display: table-cell;
            vertical-align: middle;
          }
        }
      }
    }
    /*muse组件自定义样式*/
    .chip {
      margin-left: 4px;
      padding-left: 8px;
      height: 20px;
      line-height: 2rem;
      background: @mainBgColor;
      color: #fff;
      .mu-chip-delete-icon {
        width: 14px;
        height: 14px;
        color: #fff;
      }
    }
  }

  .select-popup {
    width: 100%;
    height: 100%;
    .mu-content-block {
      padding: 0;
    }
    .header {
      position: relative;
      height: 44px;
      margin-bottom: 17px;
      border-bottom: 1px solid #f1f1f1;
      text-align: center;
      color: #35383B;
      .title {
        line-height: 44px;
        font-size: 18px;
        letter-spacing: 0;
      }
      .close {
        position: absolute;
        top: 0;
        right: 12px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        transform: rotate(-90deg);
      }
    }
    .main {
      margin-bottom: 26px;
      padding: 0 12px;
      letter-spacing: 0;
      color: @mainDarkColor;
      .title {
        margin-bottom: 13px;
        font-size: 18px;
      }
      .list {
        color: @textDark01;
        font-size: 14px;
        .item {
          float: left;
          padding: 6px 15px;
          border-radius: 6px;
          border: 1px solid #ebebeb;
          margin-right: 8px;
          margin-bottom: 8px;
          /*&:not(:first-child) {*/
          /*margin-left: 8px;*/
          /*}*/
          &.active {
            border: 1px solid #262626;
            color: @mainDarkColor;
          }
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 12px 0;
      font-size: 20px;
      text-align: center;
      color: #fff;
      background: @mainBgColor;
    }
    .mu-item {
      text-align: center;
    }
  }
</style>
