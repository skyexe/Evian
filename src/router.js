import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

const enter = resolve => require(['./views/enter/enter.vue'], resolve);
const newGoods = resolve => require(['./views/enter/newGoods.vue'], resolve);
const classify = resolve => require(['./views/enter/classify.vue'], resolve);
const brand = resolve => require(['./views/enter/brand.vue'], resolve);

const goodsList = resolve => require(['./views/goods/goodsList.vue'], resolve);
const goods = resolve => require(['./views/goods/goods.vue'], resolve);
const likeList = resolve => require(['./views/like/likeList.vue'], resolve);

const routers = {
  routes: [
    {
      path: '/',
      redirect: '/enter',
      component: enter,
    },
    {
      path: '/enter',
      component: enter,
      redirect: '/enter/new_goods',
      children: [
        {
          path: 'new_goods',
          component: newGoods,
          title: '新品',
        },
        {
          path: 'classify',
          component: classify,
          title: '类别',
        },
        {
          path: 'brand',
          component: brand,
          title: '品牌',
        },
      ]
    },
    {
      path: '/goods_list/:type',
      component: goodsList,
    },
    {
      path: '/goods/:id',
      component: goods
    },
    {
      path: '/like_list',
      component: likeList
    }
  ]
};

export default new Router(routers);


