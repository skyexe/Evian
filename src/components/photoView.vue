<template>
  <div class="photo-view-wrap">
    <div class="photo-wrap" @click="closeView">
      <swiper :options="viewSwiperOption" ref="photo-view-swiper" v-show="photos.length!=0">
        <swiper-slide v-for="(item,index) in photos" :key="index">
          <div class="slide-photo" :style="{'background-image':`url(${item.zoom})`}"></div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="btn-wrap" v-if="!isBrowser">
      <div class="btn icon-Vin-save" @click="savePhoto"></div>
      <div class="text" v-if="saveSucc">图片保存成功</div>
    </div>
  </div>
</template>

<script>
  import conf from '../config.js'
  import { photoFr } from 'filters';
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    props: ['photos', 'initIndex'],
    data () {
      return {
        isBrowser: conf.isBrowser,
        imgPath: conf.imgPath,
        saveSucc: false,
        //滑动配置
        viewSwiperOption: {
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
//      this.$refs['photo-view-swiper'].$el.querySelector('.swiper-wrapper').onclick = this.closeView;
      if (this.initIndex)
        this.$refs['photo-view-swiper'].swiper.slideTo(this.initIndex, 0);
    },
    activated(){
    },
    deactivated() {
    },
    methods: {
      photoFr,
      savePhoto(){
        let index = this.$refs['photo-view-swiper'].swiper.activeIndex;
        let photo = this.photos[index].or;
//        console.log(photo);
        this.$savePhoto(photo, (response) => {
          if (response.code == 0) {
            this.saveSucc = true;
            let that = this;
            let timer = setTimeout(function () {
              that.saveSucc = false;
              clearTimeout(timer);
            }, 1000)
          } else {
            this.$MKOToast({msg: '图片保存失败:' + response.msg});
          }
        });
      },
      closeView(e){
        let target = e.target.className;
        if (target != 'swiper-wrapper' && target != 'swiper-slide' && target != 'slide-photo')
          return;
        let index = this.$refs['photo-view-swiper'].swiper.activeIndex;
        this.$emit('close', index);
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  @swiperPhotoHeight: 436px;
  .photo-view-wrap {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: @header;
    background: #000;
    .photo-wrap {
      position: relative;
      /*padding:15px 0;*/
      width: 100%;
      height: 100%;
      overflow: hidden;
      .swiper-container {
        height: 100%;
        .swiper-slide {
          height: @swiperPhotoHeight;
          overflow: hidden;
          z-index: 2;
          .slide-photo {
            height: 100%;
            width: 100%;
            background: no-repeat center/cover;
          }
        }
        .swiper-pagination {
          position: fixed;
          bottom: 10px;
          .swiper-pagination-bullet {
            opacity: 0.3;
            border: 1px solid #232323;
            background: #fff;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
          }
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
    .btn-wrap {
      position: fixed;
      z-index: 1;
      top: @header+@swiperPhotoHeight;
      left: 50%;
      transform: translate(-50%, 0);
      transform: -webkit-translate(-50%, 0);
      width: 100px;
      text-align: center;
      color: #fff;
      .btn {
        margin-top: 28px;
        font-size: 30px;
      }
      .text {
        margin-top: 10px;
      }
    }
  }
</style>
