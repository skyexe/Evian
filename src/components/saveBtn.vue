<template>
  <div class="save-btn-wrap" @touchstart.self="closeBtn">
    <div class="btn-wrap" ref="btn-wrap">
      <div class="btn save line-middle" @click="savePhoto" v-show="showBtn">
        <div class="line-middle-text">保存</div>
        <div class="sign icon-Vin-go"></div>
      </div>
      <div class="btn tick line-middle" v-if="saveSucc">
        <div class="icon-Vin-tick line-middle-text"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['photo', 'pos'],
    data () {
      return {
        showBtn: true,
        saveSucc: false
      }
    },
    mounted() {
      this.$refs['btn-wrap'].style.left = this.pos.x - 80 + 'px';
      this.$refs['btn-wrap'].style.top = this.pos.y - 50 + 'px';
    },
    activated(){
    },
    deactivated() {
    },
    methods: {
      savePhoto(){
        this.showBtn = false;
//        console.log(this.photo);
        this.$savePhoto(this.photo, (response) => {
          if (response.code == 0) {
            this.saveSucc = true;
            let that = this;
            let timer = setTimeout(function () {
              that.saveSucc = false;
              that.closeBtn();
              clearTimeout(timer);
            }, 1000)
          } else {
            this.closeBtn();
            this.$MKOToast({msg: '图片保存失败:' + response.msg});
          }
        });
      },
      closeBtn(){
        this.$emit('close');
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .save-btn-wrap {
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 100%;
    .btn-wrap {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translate(0, -50%);
      transform: -webkit-translate(0, -50%);
      .btn {
        width: 50px;
        height: 30px;
        background: #fff;
        font-size: 12px;
        border-radius: 100px;
        box-shadow: 0 2px 8px @borderGrey00;
        text-align: center;
        &.save {
          position: relative;
          color: #43464C;
          .text {
            position: relative;
            top: 1px;
          }
          .sign {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            transform: -webkit-translate(0, -50%);
            color: #fff;
            right: -4px;
          }
        }
        &.tick {
          color: #4ABC30;
          font-size: 16px;
          > div {
            position: relative;
            top: -2px;
          }
        }
      }
    }

  }
</style>
