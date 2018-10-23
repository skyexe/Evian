<template>
  <div>
    <div class="header-top"></div>
    <div class="header-wrap">
      <mu-appbar :title="!isLoading?brandInfo.title:''" :zDepth=0>
        <div class="text-wrap" slot="left">
          <div class="icon icon-Vin-back" @click="$MKOPop()"></div>
        </div>
        <div class="icon" slot="right"></div>
      </mu-appbar>
    </div>

    <div class="refresh-container">
      <!--<mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>-->
      <mu-circular-progress :size="40" color="burlywood" v-if="isLoading" />
      <div class="abs-all-middle" v-if="!isLoading&&noData">{{Lang.no_data_invalid}}</div>
      <photo-view :photos="photos" :initIndex="$refs['photo-swiper'].swiper.activeIndex" @close="ctrlPhotoView"
                  v-if="showPhotoView"></photo-view>
      <save-btn :photo="touchPhoto" :pos="touchPos" @close="showSaveBtn=false"
                v-if="!isBrowser&&showSaveBtn"></save-btn>

      <div class="page-wrap goods-page-wrap" v-show="!isLoading&&!noData">
        <div class="photo-wrap">
          <swiper :options="swiperOption" ref="photo-swiper" v-show="photos.length!=0">
            <swiper-slide v-for="(item,index) in photos" :key="index">
              <div class="slide-photo" :style="{'background-image':`url(${item.zoom})`}"
                   @click="showPhotoView=true"></div>
              <!--<img class="abs-all-middle" :src="item.name|photoFr|imgZoomFr(`${clientWidth},0,1`)" alt="">-->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <div class="icon icon-Vin-non-image abs-all-middle" v-if="photos.length==0"></div>
        </div>
        <div class="main">
          <div class="title no-overflow">{{brandInfo.title}}</div>
          <div class="des no-overflow">{{goodsInfo.title}}</div>
          <div class="price">
            <span>{{conf.priceSign}}</span>{{priceFr(goodsInfo.price_discount || goodsInfo.price, '').split('.')[0]}}<span>.{{priceFr(goodsInfo.price_discount || goodsInfo.price, '').split('.')[1]}}</span>
          </div>
          <div class="other no-overflow" v-if="goodsInfo.price_discount">
            {{Lang.goods_or_price}}：<span>{{goodsInfo.price | priceFr}}</span>
          </div>
          <!--<div class="other no-overflow">{{Lang.goods_payment}}</div>-->
          <choose-bar :list="sizeList"></choose-bar>
        </div>
        <div class="info-wrap">
          <div class="info">
            <div class="label">{{Lang.goods_number}}</div>
            <div class="value no-overflow">{{goodsInfo.origin_no || '-'}}</div>
          </div>
          <div class="info">
            <div class="label">{{Lang.goods_color}}</div>
            <div class="value no-overflow">{{goodsInfo.color_list | arrFr}}</div>
          </div>
          <div class="info">
            <div class="label">{{Lang.goods_area}}</div>
            <div class="value no-overflow">{{goodsInfo.origin_area || '-'}}</div>
          </div>
          <div class="info">
            <div class="label">{{Lang.goods_material}}</div>
            <div class="value">{{goodsInfo.material || '-'}}</div>
          </div>
        </div>
        <div class="info-wrap">
          <div class="info" v-if="goodsInfo.label_list&&goodsInfo.label_list.length!=0">
            <div class="label">{{Lang.goods_label}}</div>
            <div class="value no-overflow">{{goodsInfo.label_list | arrFr('title')}}</div>
          </div>
          <div class="info" v-for="item in goodsInfo.attribute">
            <div class="label">{{item.name ? item.name.split('-')[0] : ''}}</div>
            <div class="value no-overflow">{{item.name ? item.name.split('-')[1] : ''}}</div>
          </div>
        </div>
        <div class="notes" v-if="goodsInfo.describe">
          <div class="label">{{Lang.goods_des}}</div>
          <div>{{goodsInfo.describe}}</div>
        </div>
        <div class="notes margin-top" v-if="goodsInfo.size_remark">
          <div class="label">{{Lang.goods_size_guide}}</div>
          <div>{{goodsInfo.size_remark}}</div>
        </div>
        <!--商品详细介绍-->
        <div class="content">
          <div class="photos">
            <img :src="item.zoom" v-for="item in photos" alt="" @touchstart="$MKOTouchStart"
                 @touchend="$MKOLongTouch($event,savePhoto,item.or)">
          </div>
          <div v-html="goodsInfo.content"></div>
        </div>
        <!--尺码表-->
        <div class="table-wrap" v-if="goodsInfo.image_size">
          <div class="table">
            <img :src="goodsInfo.image_size|photoFr" :style="tableImgSize" alt=""
                 v-if="tableImgSize">
          </div>
          <div class="sign icon-Vin-slide"></div>
        </div>
        <!--洗涤信息-->
        <div class="washing-list">
          <div :class="{'abs-middle':goodsInfo.washing_list_length<4,'normal':goodsInfo.washing_list_length>=4}">
            <div class="item" :class="{'sp-flex':goodsInfo.washing_list_length<4}"
                 @click="checkWashingMsg(item.content)"
                 v-for="(item,i) in goodsInfo.washing_list">
              <img class="sign " :src="item.image|washingSignFr" alt="">
            </div>
          </div>
        </div>
        <!--品牌信息-->
        <div class="brand-wrap">
          <div class="avatar" :class="{'no-logo':!brandInfo.logo}" @click="go(brandInfo.id)">
            <img class="abs-all-middle" :src="brandInfo.logo|photoFr" v-if="brandInfo.logo">
            <div class="default icon-Vin-non-image" v-else></div>
          </div>
          <div class="title no-overflow" @click="go(brandInfo.id)">{{brandInfo.title}}</div>
          <!--<div class="des">-->
          <!--{{brandInfo.remark || Lang.brand_no_data}}-->
          <!--</div>-->
          <div class="link" @click="go(brandInfo.id)">{{Lang.brand_check}}<i
              class="sign icon-Vin-go"></i>
          </div>
        </div>
        <!--Footer-->
        <transition name="fade" mode="out-in" appear>
          <div class="footer" v-if="showFooter">
            <div class="like" :class="{'is-like':isLike==1}" @click="iLikeThis">
              <div class="icon" :class="{'icon-Vin-like2':isLike==1,'icon-Vin-like':!isLike}"></div>
              <div class="text">{{goodsInfo.isLike == 1 ? Lang.like_collected : Lang.like_not_collected}}</div>
            </div>
            <div class="order" @click="ctrlPopup(true)">
              <div class="order-text-wrap">
                <div class="order-text">{{Lang.order_title}}</div>
              </div>
            </div>
          </div>
        </transition>
        <!--弹出框-->
        <mu-popup position="bottom" popupClass="popup-wrap" :open="openPopup" @close="ctrlPopup(false)">
          <mu-appbar :title="isBrowser?'立即下单':'添加工作人员微信号下单'" :zDepth=0>
            <div class="icon icon-Vin-wechat" slot="left"></div>
            <div class="icon icon-Vin-close" slot="right" @click="ctrlPopup(false)"></div>
          </mu-appbar>
          <mu-content-block :class="{'only-code':isBrowser}">
            <div class="content-wrap" v-if="!isBrowser">
              <div class="content">
                <div class="subtitle">方式一</div>
                <div class="title">复制微信号购买</div>
                <div class="des">在微信中添加好友购买</div>
                <div class="des">微信号：{{goodsInfo.waiter_wx || Lang.wx_id}}</div>
                <!--<div class="button">点我，复制微信号</div>-->
              </div>
              <div class="content">
                <div class="subtitle">方式二</div>
                <div class="title">扫描二维码购买</div>
                <div class="des">屏幕截图</div>
                <div class="des">在微信中扫描图片二维码</div>
                <div class="QR-code">
                  <img :src="goodsInfo.image_qr|photoFr" alt="" v-if="goodsInfo.image_qr">
                </div>
              </div>
            </div>
            <div class="code-wrap" v-if="isBrowser">
              <div class="QR-code">
                <img :src="goodsInfo.image_qr|photoFr" alt="" v-if="goodsInfo.image_qr">
              </div>
              <div v-if="goodsInfo.image_qr">长按识别二维码，添加客服微信号即可下单</div>
              <div v-if="!goodsInfo.image_qr">添加客服微信号购买：{{goodsInfo.waiter_wx || 'vinjakmoda'}}</div>
            </div>
            <div class="content-wrap" :class="{'only-code':isBrowser}">如有任何疑问，请拨打客服电话 <a href="tel:00852-23773863">00852-23773863</a>
            </div>
          </mu-content-block>
        </mu-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import Lang from 'language';
  import api from 'api';
  import conf from '../../config.js'
  import { priceFr, imgZoomFr, photoFr, sizeSortFr } from 'filters';
  import { photoView, saveBtn, chooseBar } from 'components';
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  let HISTORY_ID = '';
  let SIZE_CONF = '';
  export default {
    data() {
      return {
        Lang: Lang,
        conf: conf,
        isBrowser: conf.isBrowser,
        imgPath: conf.imgPath,
        clientWidth: conf.clientWidth,
        openPopup: false,
        showFooter: false,
        showPhotoView: false,
        //保存按钮
        showSaveBtn: false,
        touchPos: {},
        touchPhoto: null,
        //refresh
        refreshing: false,
        trigger: null,
        //progress
        isLoading: false,
        //data
        goodsInfo: {
          isLike: 0
        },
        brandInfo: {},
        sizeList: [],
        isLike: 0,
        photos: [],
        tableImgSize: '',
        noData: false,
        //滑动配置
        swiperOption: {
          notNextTick: true,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
        },
      }
    },
    mounted() {
      this.trigger = this.$el;
      this.Lang = Lang;
      this.clientWidth = conf.clientWidth;
      this.imgPath = conf.imgPath;
      const w = parseInt((conf.clientWidth > conf.standardWidth ? conf.standardWidth : conf.clientWidth) * conf.deviceRatio);
      const h = parseInt(w * 1.06);
      SIZE_CONF = `${w},${h},1`;
    },
    activated() {
      scrollTo(0, 0);
      window.onscroll = this.ctrlFooter;
      this.$refs['photo-swiper'].swiper.slideTo(0);
      if (HISTORY_ID != this.$route.params.id) {
        this.tableImgSize = '';
        this.getData();
      } else {
        this.calcLikeData(this.goodsInfo);
      }
      this.sizeSortFr();
    },
    deactivated() {
      this.isLoading = false;
      this.refreshing = false;
      this.showFooter = false;
      window.onscroll = null;
    },
    methods: {
      priceFr,
      photoFr,
      imgZoomFr,
      sizeSortFr,
      getData(isRefresh) {
        let _id = this.$route.params.id;
        if (!_id)
          return;

        if (!isRefresh)
          this.isLoading = true;

        this.noData = false;
        api.getGoodsInfo(_id).then(res => {
          if (res && res.data) {
            this.goodsInfo = res.data || {};
            this.goodsInfo['washing_list_length'] = this.goodsInfo['washing_list'].length;
            this.brandInfo = res.data.brand;
            this.photos = this.goodsInfo['img_plan'].map(item => {
              return {
                or: conf.imgPath + item.name,
                zoom: this.imgZoomFr(conf.imgPath + item.name, SIZE_CONF)
              };
            });

            this.matchTableImg(this.goodsInfo.image_size);
            this.matchQuantity(this.goodsInfo);
            this.calcLikeData(this.goodsInfo);

            HISTORY_ID = _id;
          } else {
            this.noData = true;
          }
          this.isLoading = false;
          this.refreshing = false;
        });
      },
      matchTableImg(img) {
        let table_img = new Image();
        table_img.src = conf.imgPath + img;
        let that = this;
        table_img.onload = function () {
          let ZOOM = 2;
          let MAX_H = 500;
          let w = table_img.width / ZOOM;
          let h = table_img.height;
          if (w > conf.clientWidth) {
            that.tableImgSize = `height:${(h / ZOOM) > MAX_H ? MAX_H : (h / ZOOM)}px`;
          } else {
            that.tableImgSize = `width:${conf.clientWidth}px`
          }
        };
      },
      matchQuantity(data) {
        let result = [];
        let size = this.sizeSortFr(data.size_list);
        let list = data.detail_list;
        for (let size_i in size) {
          result.push({
            size: size[size_i],
            quantity: 0
          });
          for (let list_i in list) {
            if (size[size_i] == list[list_i].sizeName && list[list_i].quantity > 0) {
              result[result.length - 1].quantity = 1;
              break;
            }
          }
        }
        this.sizeList = result;
      },
      calcLikeData(info) {
        let local = localStorage.getItem('vinjak_like');
        let arr = [];
        if (local) {
          try {
            arr = JSON.parse(local);
          } catch (err) {
            console.log(err.name)
          }
        }
        info.isLike = 0;
        for (let like of arr) {
          if (info.id == like.id)
            info.isLike = 1;
        }
        this.isLike = info.isLike;
      },
      refresh() {
        this.refreshing = true;
        this.getData(1);
      },
      iLikeThis() {
        this.$MKOiLike(this.goodsInfo);
        this.isLike = this.goodsInfo.isLike;
      },
      ctrlPhotoView(index) {
        this.$refs['photo-swiper'].swiper.slideTo(index, 0);
        this.showPhotoView = false;
      },
      ctrlPopup(bool) {
        this.openPopup = bool;
      },
      ctrlFooter() {
        let scoTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scoTop > 20) {
          this.showFooter = true;
        } else {
          this.showFooter = false;
        }
      },
      savePhoto(item, pos) {
        this.touchPhoto = item;
        this.touchPos = pos;
        this.showSaveBtn = true;
      },
      checkWashingMsg(msg) {
        if (msg)
          this.$MKODialog({
            msg: msg,
          });
      },
      go(id) {
        let path = `/goods_list/brand?id=${id}`;
        this.$MKOPush(path);
      },
    },
    components: {
      photoView,
      saveBtn,
      chooseBar,
      swiper,
      swiperSlide
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  @swiperPhotoHeight: 436px;
  .goods-page-wrap {
    margin-bottom: 86px;
    .photo-wrap {
      position: relative;
      /*padding:15px 0;*/
      width: 100%;
      height: @swiperPhotoHeight;
      overflow: hidden;
      .swiper-container {
        height: @swiperPhotoHeight;
        .swiper-slide {
          overflow: hidden;
          .slide-photo {
            height: 100%;
            width: 100%;
            background: no-repeat center;
            background-size: cover;
          }
        }
        .swiper-pagination-bullet {
          opacity: 0.3;
          border: 1px solid #232323;
          background: #fff;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      }
      .icon {
        font-size: 50px;
        color: @nonColor;
      }
      img {
        height: 100%;
        vertical-align: bottom
      }
    }
    .main {
      margin: 0 5.31%;
      padding: 16px 0 29px;
      width: 89.37%;
      /*border-bottom: 1px solid #E5EBED;*/
      letter-spacing: 0;
      .title {
        margin-bottom: 6px;
        line-height: 38px;
        font-size: 2.4rem;
        color: @textDark00;
      }
      .des {
        line-height: 25px;
        font-size: 18px;
        color: #000;
      }
      .price {
        margin-top: 6px;
        line-height: 28px;
        font-size: 24px;
        color: #E5003F;
        span {
          padding-right: 2px;
          font-size: 1.6rem;
        }
      }
      .other {
        line-height: 20px;
        font-size: 10px;
        color: #000;
        font-family: PingFangSC-Regular;
        span {
          text-decoration: line-through;
        }
      }
    }
    .info-wrap {
      margin: 0 5.31% 18px;
      letter-spacing: 0;
      .info {
        display: flex;
        .label {
          /*flex: 0 0 64px;*/
          min-width: 32px;
          line-height: 24px;
          font-size: 16px;
          color: #9B9B9B;
        }
        .value {
          margin-left: 12px;
          line-height: 24px;
          font-size: 16px;
          color: @textDark00;
        }
      }
    }
    .notes {
      margin: 0 5.31% 32px;
      letter-spacing: 0;
      font-size: 16px;
      color: @textDark00;
      &.margin-top {
        margin-top: 32px;
        margin-bottom: 0;
      }
      .label {
        color: #9B9B9B;
      }
    }
    .content {
      .photos {
        position: relative;
      }
      img {
        width: 101%;
        vertical-align: bottom;
      }
    }
    .table-wrap {
      margin-top: 10px;
      .table {
        position: relative;
        /*height: 300px;*/
        overflow-x: scroll;
        overflow-y: hidden;
        img {
          vertical-align: bottom;
          max-height: 500px;
        }
      }
      .sign {
        margin-top: 5px;
        line-height: 12px;
        font-size: 23px;
        text-align: center;
        color: #303230;
      }
    }
    .washing-list {
      margin: 32px 47px 0;
      min-height: 50px;
      .normal {
        margin: 0 auto;
        width: 200px;
        position: relative;
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
      }
      .item {
        position: relative;
        flex: 0 0 25%;
        text-align: center;
        &.sp-flex {
          float: left;
        }
        .sign {
          width: 100%;
          max-width: 50px;
          vertical-align: middle;

        }
      }
    }
    .brand-wrap {
      position: relative;
      margin-top: 32px;
      letter-spacing: 0;
      .avatar {
        position: relative;
        margin: 0 auto 10px;
        width: 50px;
        height: 50px;
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
          font-size: 3rem;
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
        display: table;
        margin: auto;
        line-height: 24px;
        font-size: 20px;
        color: #43464c;
      }
      .des {
        margin: 25px auto 0;
        min-height: 100px;
        font-size: 14px;
        color: @textDark00;
      }
      .link {
        margin: auto;
        width: 140px;
        /*height: 44px;*/
        /*line-height: 44px;*/
        font-size: 12px;
        color: #363232;
        text-align: center;
        .sign {
          position: relative;
          left: 2px;
          bottom: 1px;
          font-size: 6px;
          color: #E5003F;
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0);
      display: flex;
      width: 100%;
      height: 54px;
      z-index: 1;
      text-align: center;
      .like {
        flex: 0 0 100px;
        padding-top: 6px;
        background-color: #F5F8FA;
        &.is-like {
          .icon, .text {
            color: @heightLightTextColor;
          }
        }
        .icon {
          margin: 0 auto;
          display: table;
          height: 30px;
          font-size: 3rem;
          color: #515251;
          &:before {
            display: table-cell;
            vertical-align: middle;
          }
        }
        .text {
          font-size: 1rem;
          color: #2E3541;
          letter-spacing: 0;
        }
      }
      .order {
        flex: 1;
        font-size: 20px;
        background-color: @mainBgColor;
        color: #FFF;
        letter-spacing: 0;
        .order-text-wrap {
          display: table;
          margin: 0 auto;
          height: 100%;
          line-height: 54px;
          .order-text {
            display: table-cell;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .popup-wrap {
    max-width: @standardWidth;
    width: 100%;
    .mu-appbar {
      height: 40px;
      padding: 0 17px;
      background: #f1f2f3;
      color: #575f65;
      .icon-Vin-wechat {
        font-size: 20px;
      }
      .icon-Vin-close {
        font-size: 16px;
      }
      .mu-appbar-title {
        line-height: 40px;
        font-size: 18px;
        letter-spacing: -0.44px;
      }
    }
    .mu-content-block {
      padding: 0;
      padding-bottom: 42px;
      &.only-code {
        padding-bottom: 22px;
      }
    }
    //app下的样式
    .content-wrap {
      display: flex;
      padding: 42px 0 0 5.07%;
      &.only-code {
        display: block;
        padding: 42px 0 0 0;
        text-align: center;
        a {
          color: #214C9C;
        }
      }
      .content {
        flex: 1;
        .subtitle {
          margin-bottom: 28px;
          line-height: 14px;
          font-size: 12px;
          letter-spacing: -0.29px;
          color: @mainTextColor;
        }
        .title {
          margin-bottom: 7px;
          line-height: 22px;
          font-size: 22px;
          letter-spacing: 0;
          color: @mainTextColor;
        }
        .des {
          line-height: 20px;
          font-size: 14px;
          letter-spacing: 0;
          color: #575F65;
        }
        .button {
          margin-top: 7px;
          width: 112px;
          height: 20px;
          line-height: 20px;
          border: 1px solid @wechatGreen;
          border-radius: 100px;
          font-size: 12px;
          letter-spacing: 0;
          text-align: center;
          color: @wechatGreen;
        }
        .QR-code {
          margin-top: 7px;
          width: 120px;
          height: 120px;
          overflow: hidden;
          img {
            height: 100%;
          }
        }
      }
    }
    //微信下的样式
    .code-wrap {
      padding-top: 15px;
      text-align: center;
      font-size: 16px;
    }
  }
</style>
