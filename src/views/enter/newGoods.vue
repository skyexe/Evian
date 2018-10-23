<template>
  <div class="new-goods-page-wrap">
    <div class="refresh-container">
      <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
      <mu-circular-progress :size="40" color="burlywood" v-if="isLoading"/>
      <div class="card" @click="go(item.id)" v-for="(item,i) in articleList">
        <div class="photo-wrap" :class="{'no-photo':!item.cover}"
             :style="{backgroundImage:`url(${item.cover})`}">
          <div class="sign abs-middle icon-Vin-triangle"></div>
          <div class="icon icon-Vin-non-image abs-all-middle" v-if="!item.cover"></div>
        </div>
        <div class="content-wrap">
          <div class="title line-middle">
            <div class="line-middle-text">
              <div class="text no-overflow">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="des line-middle" v-if="item.title2">
            <div class="line-middle-text">
              <div class="text no-overflow">
                {{item.title2}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <mu-infinite-scroll :scroller="scroller" :loading="isInfiloading" :loadingText="loadingText" v-if="!noMoreData"/>
      <!--返回顶部-->
      <to-top v-if="showToTop"></to-top>
    </div>
  </div>
</template>

<script>
  import api from 'api';
  import conf from '../../config.js'
  import {imgZoomFr} from 'filters';
  import {tabs, list, toTop} from 'components';
  let SCO_TOP = 0;
  let BODY_HEIGHT = 0;  //内容的长度
  let WRAP_HEIGHT = 0;  //外层容器的长度
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
        //数据
        articleList: [],
        page: 1,
        pageSize: 10
      }
    },
    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el
      WRAP_HEIGHT = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
    },
    activated(){
      scrollTo(0, SCO_TOP);
      if (this.articleList.length == 0) {
        this.page = 1;
        this.noMoreData = false;
        this.isLoading = true;
        this.getData();
      } else {
        window.onscroll = this.getScrollTop;
      }
    },
    deactivated() {
      this.isLoading = false;
      this.refreshing = false;
      window.onscroll = null;
    },
    methods: {
      getData(){
        let params = `0?page=${this.page}&page_size=${this.pageSize}`;
        api.getArticleList(params).then(res => {
          if (res) {
            let sizeConf = `${parseInt((conf.clientWidth > conf.standardWidth ? conf.standardWidth : conf.clientWidth) * conf.deviceRatio)},0,2`;
            let dataLength = res.data.data.length;
            if (this.page == 1) {
              this.articleList.length = 0;
            }
            res.data.data.forEach(item => {
              item.cover = this.imgZoomFr(conf.imgPath + item.cover, sizeConf);
              this.articleList.push(item);
            });
            if (dataLength < this.pageSize)
              this.noMoreData = true;
          }
          this.getScrollTop();
          window.onscroll = this.getScrollTop;
          this.isLoading = false;
          this.refreshing = false;
          this.isInfiloading = false;
        });
      },
      calcImage(){
        if (this.$refs['img0']) {
          this.articleList.forEach((item, i) => {
            let img = this.$refs[`img${i}`][0];
            this.calcImageRatio(img, 220);
          })
        }
        return false;
      },
      imgZoomFr,
      refresh(){
        this.page = 1;
        this.noMoreData = false;
        this.refreshing = true;
        this.getData();
      },
      loadMore(){
        if (this.noMoreData || this.isInfiloading)
          return;

        this.isInfiloading = true;
        this.page++;
        this.getData();
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
      go(id){
        this.$MKOPush('/goods_list/new_goods?id=' + id);
      }
    },
    components: {
      toTop
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .new-goods-page-wrap {
    .card {
      .photo-wrap {
        position: relative;
        max-width: @standardWidth;
        /*max-height: 220px;*/
        height: 220px;
        overflow: hidden;
        background: no-repeat center;
        background-size: cover;
        background-color: @nonColor;
        &.no-photo {
          background: @nonColor;
        }
        .icon {
          font-size: 50px;
          color: #fff;
        }
        .sign {
          bottom: -3px;
          text-align: center;
          color: #fff;
          font-size: 1.2rem;
        }
      }
      .content-wrap {
        position: relative;
        margin: 6px auto;
        text-align: center;
        .title {
          margin: auto;
          width: 86.96%;
          height: 30px;
          font-size: 20px;
          color: @textGrey00;
          .text {
            margin: 0 auto;
            width: 300px;
          }
        }
        .des {
          margin: auto;
          width: 86.96%;
          height: 18px;
          font-size: 12px;
          color: @textGrey01;
        }
      }
    }
  }
</style>
