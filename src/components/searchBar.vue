<template>
  <div>
    <div class="search-bar-wrap">
      <div class="box">
        <input class="ipt" :class="{'has-value':iptHasValue}" type="text" autofocus="autofocus"
               :placeholder="Lang.search_hint" v-model="value"
               @keyup.enter="searchGoods">
        <div class="delete icon-Vin-delete" @click="reset" v-if="iptHasValue"></div>
      </div>
      <!--<div class="sign" v-if="!iptHasValue">-->
      <!--{{Lang.search_hint}}-->
      <!--</div>-->
      <div class="cancel line-middle" @click="cancel">
        <div class="line-middle-text">{{Lang.search_cancel}}</div>
      </div>
    </div>
    <!--<list :list=""></list>-->
  </div>
</template>


<script>
  import Lang from 'language'
  import list from './list.vue';
  export default{
    data() {
      return {
        Lang: Lang,
        value: '',
        iptHasValue: false
      }
    },
    watch: {
      value: function (val) {
        if (!val) {
          this.iptHasValue = false;
        } else {
          this.iptHasValue = true;
        }
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      searchGoods(){
        this.$MKOPush('/goods_list/search?val=' + this.value);
      },
      reset(){
        this.value = '';
      },
      cancel(){
        this.reset();
        this.$emit('cancel');
      }
    },
    components: {
      list
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .search-bar-wrap {
    position: relative;
    height: -1px + @header;
    line-height: -1px + @header;
    font-size: 1.5rem;
    .box {
      position: relative;
      height: 100%;
      margin-right: 44px;
      .ipt {
        position: absolute;
        left: 0;
        padding-top: .5rem;
        width: 100%;
        height: 100%;
        line-height: 21px;
        &.has-value {
          padding-top: .5rem;
        }
        &::-webkit-input-placeholder { /* WebKit browsers */
          color: #D3D3D3;
        }
        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #D3D3D3;
        }
        &::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #D3D3D3;
        }
        &:-ms-input-placeholder { /* Internet Explorer 10+ */
          color: #D3D3D3;
        }
      }
      .delete {
        display: table;
        position: absolute;
        right: 0;
        top: 0;
        width: 30px;
        height: 100%;
        font-size: 1.4rem;
        text-align: center;
        &:before {
          display: table-cell;
          vertical-align: middle;
          position: relative;
          top: 1px;
        }
      }
    }
    .sign {
      position: absolute;
      left: 0;
      top: 2.5rem;
      color: #D3D3D3;
      letter-spacing: -0.24px;
    }
    .cancel {
      position: absolute;
      right: 0;
      top: 0.2rem;
      width: 4.4rem;
      height: 100%;
      line-height: 1.5rem;
      letter-spacing: -0.24px;
      text-align: left;
      color: #E5003F;
    }
  }
</style>
