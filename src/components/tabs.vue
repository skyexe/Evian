<template>
  <div class="tab-wrap">
    <mu-tabs lineClass="tabLine" :value="activeTab" @change="handleTabChange">
      <mu-tab :value="item.value" :title="item.text" v-for="item in tabItem" :key="item.value" />
    </mu-tabs>
  </div>
</template>

<script>
  import Lang from 'language'
  export default {
    props: ['activeTab'],
    data () {
      return {
        tabItem: [
          {text: Lang.index_tab_new, value: 'new_goods'},
          {text: Lang.index_tab_classify, value: 'classify'},
          {text: Lang.index_tab_brand, value: 'brand'}
        ]
      }
    },
    mounted() {
      this.tabItem = [
        {text: Lang.index_tab_new, value: 'new_goods'},
        {text: Lang.index_tab_classify, value: 'classify'},
        {text: Lang.index_tab_brand, value: 'brand'}
      ];
    },
    activated(){
    },
    deactivated() {
    },
    methods: {
      handleTabChange(val){
        this.$MKOJump(`/enter/${val}`);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../config.less";

  .tab-wrap {
    height: @enterTabsHeight;
    .mu-tabs {
      position: fixed;
      background-color: #fbfbfb;
      .mu-tab-link {
        min-height: @enterTabsHeight;
        height: @enterTabsHeight;
        color: @mainTextColor;
      }
      .mu-tab-text {
        font-size: 1.8rem;
        line-height: 1.6rem;
      }
    }
    .mu-tab-link-highlight {
      background-color: @mainTextColor;
    }
  }
</style>
