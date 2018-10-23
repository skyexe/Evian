<template>
  <div>
    <div class="header-top"></div>
    <div class="header-wrap">
      <mu-appbar :title="Lang.like_title" :zDepth=0>
        <div class="text-wrap" slot="left" v-if="!$route.query['is_enter']">
          <div class="icon icon-Vin-back" @click="$MKOPop()"></div>
        </div>
        <div class="icon" slot="left" v-if="$route.query['is_enter']"></div>
        <div class="icon" slot="right"></div>
      </mu-appbar>
    </div>
    <div class="page-wrap like-list-page-wrap">
      <div class="list">
        <div class="abs-all-middle" v-if="list.length<=0">{{Lang.no_data}}</div>
        <!--<transition-group tag="div" name="fade" mode="out-in" appear>-->
        <div class="item" :class="{'isDelete':item.hasDelete}" @touchstart="_touchStart($event)"
             @touchend="_touchEnd($event,item)" v-if="item.isLike" v-for="(item,index) in list">
          <div class="photo">
            <img class="abs-all-middle"
                 :src="item.image|photoFr|imgZoomFr(`${sizeConf},${parseInt(sizeConf*1.06,0)},1`)" v-if="item.image">
            <div class="mask line-middle" v-if="item.is_shelve!==1">
              <div class="line-middle-text">{{Lang.goods_invalid}}</div>
            </div>
          </div>
          <div class="content">
            <div class="title no-overflow">{{item.brand.title}}</div>
            <div class="info no-overflow">{{item.title}}</div>
            <div class="des no-overflow">{{item.mode_no}}</div>
            <div class="price-wrap">
              <div class="fl">
                <span>{{conf.priceSign}}</span>{{priceFr(item.price_discount || item.price, '').split('.')[0]}}<span>.{{priceFr(item.price_discount || item.price, '').split('.')[1]}}</span>
              </div>
              <div class="price-invalid fl" v-if="item.price_discount">{{item.price | priceFr}}</div>
            </div>
          </div>
          <transition name="fade" mode="out-in" appear>
            <div class="delete" @touchstart="unLikeThis(item,index)" v-if="item.hasDelete">
              <div class="text abs-all-middle">{{Lang.like_cancel}}</div>
            </div>
          </transition>
        </div>
        <!--</transition-group>-->
      </div>
    </div>
  </div>
</template>

<script>
  let SLIDER_DISTANCE = 30;
  let CLICK_DISTANCE = 2;
  let TOUCH_START_X = 0;
  let TOUCH_START_Y = 0;
  let SCO_TOP = 0;

  import api from 'api';
  import conf from '../../config.js'
  import Lang from 'language';
  import { photoFr, priceFr } from 'filters';

  export default {
    data() {
      return {
        Lang: Lang,
        conf: conf,
        list: [],
        sizeConf: parseInt(90 * conf.deviceRatio)
      }
    },
    mounted() {
      this.Lang = Lang;
    },
    activated() {
      scrollTo(0, SCO_TOP);
      window.onscroll = this.getScrollTop;
      this.getData();
    },
    deactivated() {
      window.onscroll = null;
    },
    methods: {
      priceFr,
      getData() {
        let local = localStorage.getItem('vinjak_like');
        let arr = [];
        if (local) {
          try {
            arr = JSON.parse(local);
          } catch (err) {
            console.log(err.name)
          }
        }
        this.list = arr.map((item, index) => {
          item.hasDelete = false;
          return item
        });
        arr.forEach((item, index) => {
          this.updateData(item.id, index);
        });
      },
      updateData(id, index) {
        api.getGoodsInfo(id).then(res => {
          if (res) {
            res.data.hasDelete = false;
            res.data.isLike = 1;
            this.list.splice(index, 1, res.data);
            this.$MKOUpdateLike(res.data);
          }
        });
      },
      unLikeThis(item, index) {
        this.$MKOUnLike(item, index, this.list);
      },
      _touchStart(e) {
        TOUCH_START_X = e.touches[0].clientX;
        TOUCH_START_Y = e.touches[0].clientY;
      },
      _touchEnd(e, item) {
        e.preventDefault();
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;
        let s_x = TOUCH_START_X;
        let s_y = TOUCH_START_Y;

        if (s_x - x > SLIDER_DISTANCE) {
          this.list.forEach(data => {
            data.hasDelete = false;
          });
          item.hasDelete = true;
        } else if (s_x == x || (s_x - x < CLICK_DISTANCE)) {
          if (item.hasDelete) {
            item.hasDelete = false
          } else {
            if (s_y - y < CLICK_DISTANCE && item.is_shelve == 1)
              this.go(item.id);
          }
        }
      },
      getScrollTop() {
        SCO_TOP = document.documentElement.scrollTop || document.body.scrollTop;
      },
      go(id) {
        this.$MKOPush(`/goods/${id}`)
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .like-list-page-wrap {
    .list {
      .item {
        display: flex;
        padding: 10px 0 0 10px;
        &.isDelete {
          position: relative;
          right: 60px;

        }
        .delete {
          position: absolute;
          top: -1px;
          right: -60px;
          width: 60px;
          height: 111px;
          background-color: @heightLightTextColor;
          color: #fff;
          text-align: center;
          .text {
            width: 29px;
            height: 34px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            letter-spacing: 0;
          }
        }
        .photo {
          flex: 0 0 90px;
          position: relative;
          width: 90px;
          height: 90px;
          overflow: hidden;
          .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            font-size: 1.4rem;
            text-align: center;
            background: rgba(53, 54, 60, .7);
            color: #fff;
          }
          img {
            width: 100%;
          }
        }
        .content {
          flex: 1;
          position: relative;
          height: 100px;
          margin-left: 34px;
          border-bottom: 1px solid @borderGrey02;
          > div {
            width: 90%;
          }
          .title {
            line-height: 19px;
            font-size: 16px;
            letter-spacing: 0;
            color: @textDark01;
            font-family: Helvetica-Bold;
          }
          .info, .des {
            line-height: 19px;
            font-size: 14px;
            color: @textDark01;
            letter-spacing: 0;
            font-family: PingFangSC-Regular;
          }
          .price-wrap {
            position: absolute;
            left: 0;
            bottom: 12%;
            line-height: 18px;
            font-size: 16px;
            color: #E5003F;
            letter-spacing: -0.39px;
            font-family: HelveticaNeue;
            span {
              padding-right: 2px;
              font-size: 1rem;
            }
            .price-invalid {
              position: relative;
              top: 2px;
              padding-left: 2px;
              font-size: 1rem;
              text-decoration: line-through;
              color: #B4B4B4;
            }
          }
        }
      }
    }
  }
</style>
