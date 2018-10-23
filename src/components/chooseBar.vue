<template>
  <div class="choose-bar-wrap" v-if="list.length!=0">
    <div class="choose-bar">
      <div class="item-wrap" @click="activated=item" v-for="item in list">
        <div class="item" :class="{'disabled':item.quantity==0,'activated':activated.size==item.size}">{{item.size}}
        </div>
      </div>
    </div>
    <div class="remark">
      <!--<mu-circular-progress :size="20" color="burlywood" />-->
      {{activated ? (activated.quantity == 0 ? '无货' : '有货') : ''}}
    </div>
  </div>
</template>

<script>
  export default {
    props: ['list'],
    data () {
      return {
        activated: '',
//        list: [
//          {quantity: 1, size: '21'},
//        ]
      }
    },
    watch: {
      list: function () {
        this.activated = this.list[0];
      }
    },
    mounted() {
    },
    activated(){

    },
    deactivated() {
    },
    methods: {},
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .choose-bar-wrap {
    margin-top: 6px;
    .choose-bar {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      border-top: 1px solid #E5EBED;
      border-bottom: 1px solid #E5EBED;
      .item-wrap {
        display: table;
        flex: 0 0 10%;
        width: 10%;
        text-align: center;
        .item {
          box-sizing: border-box;
          display: table-cell;
          vertical-align: middle;
          height: 34px;
          line-height: 0;
          &.disabled {
            color: @textGrey01;
          }
          &.activated {
            border: 2px solid #E5003F;
            border-radius: 2px;
          }
        }
      }
    }
    .remark {
      margin-top: 4px;
      line-height: 20px;
      font-size: 1.2rem;
      letter-spacing: 0;
      color: #E5003F;
    }
  }
</style>
