<template>
  <div class="com-list clear">
    <div class="abs-all-middle" v-if="list.length==0">{{Lang.no_data}}</div>
    <div class="item" v-for="(item,index) in list" v-if="list.length!=0">
      <div class="photo-wrap" @click="go(item.id)">
        <img class="abs-all-middle"
             :src="item.image|photoFr|imgZoomFr(`${sizeConf},${parseInt(sizeConf*1.06,0)},1`)"
             v-if="item.image">
        <div class="icon icon-Vin-non-image abs-all-middle" v-else></div>
      </div>
      <div class="content-wrap abs-middle">
        <div class="title no-overflow" @click="go(item.id)">{{item.brand ? item.brand.title : ''}}</div>
        <div class="des no-overflow" @click="go(item.id)">{{item.title}}</div>
        <div class="price-wrap">
          <div class="fl" @click="go(item.id)">
            <span>{{conf.priceSign}}</span>{{priceFr(item.price_discount || item.price, '').split('.')[0]}}<span>.{{priceFr(item.price_discount || item.price, '').split('.')[1]}}</span>
          </div>
          <div class="price-invalid fl" @click="go(item.id)" v-if="item.price_discount">
            {{item.price | priceFr}}
          </div>
          <div class="like" :class="{'icon-Vin-like2':item.isLike==1,'icon-Vin-like':!item.isLike}"
               @click="iLikeThis(item,index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Lang from 'language';
  import conf from '../config.js'
  import { photoFr, priceFr } from 'filters';

  export default {
    props: ['list'],
    data() {
      return {
        Lang: Lang,
        conf: conf,
        sizeConf: parseInt((conf.clientWidth > conf.standardWidth ? conf.standardWidth : conf.clientWidth) / 2 * 0.88 * conf.deviceRatio)
      }
    },
    created() {

    },
    mounted() {
      this.Lang = Lang;
    },
    methods: {
      priceFr,
      iLikeThis(data, index) {
        this.$MKOiLike(data, index, this.list);
      },
      go(id) {
        this.$MKOPush(`/goods/${id}`);
      },
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .com-list {
    &:not(:first-child) {
      border-top: 1px solid @borderGrey01;
    }
    .item {
      position: relative;
      float: left;
      width: 50%;
      height: 294px;
      padding-top: 28px;
      border-bottom: 1px solid @borderGrey01;
      &:nth-child(odd) {
        border-right: 1px solid @borderGrey01;
      }
      .photo-wrap {
        position: relative;
        width: 87.38%;
        max-width: 178px;
        height: 178px;
        margin: 0 auto 17px;
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
        /*margin: 9px 12px 15px;*/
        width: 87.38%;
        .title {
          width: 100%;
          height: 17px;
          font-family: Helvetica-Bold;
          font-size: 14px;
          color: @textDark01;
        }
        .des {
          /*width: 180px;*/
          width: 100%;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: @textDark01;
        }
        .price-wrap {
          position: relative;
          margin-top: 8px;
          /*width: 148px;*/
          width: 82.22%;
          height: 16px;
          font-size: 16px;
          color: @textRed00;
          span {
            font-size: 1rem;
            padding-right: 2px;
          }
          .price-invalid {
            position: relative;
            top: 6px;
            padding-left: 2px;
            font-size: 1rem;
            text-decoration: line-through;
            color: #B4B4B4;
            font-weight: 100;
          }
          .like {
            position: absolute;
            right: -29.3%;
            top: -12px;
            padding-top: 15px;
            width: 27%;
            height: 40px;
            text-align: center;
          }
        }
      }
    }
  }
</style>




