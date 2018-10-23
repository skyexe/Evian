/**
 * Created by enjoyzhou on 17-2-16.
 */
import { httpGet, httpPost, httpPath, readFile } from './requestService'
import Conf from '../apiconf'

export default {
  getArticleList:httpPath('/article/list/'), //新品文章列表
  getArticleInfo:httpPath('/article/'), //新品文章详情+新品列表
  getLibClassList:httpPath('/lib_class/list/'), //分类类别列表
  getBrandList:httpPath('/brand/list'),  //品牌列表
  getGoodsList:httpPath('/goods/list'),  //商品列表
  getGoodsInfo:httpPath('/goods/'), //商品详情
  getSeasonList:httpPath('/goods/season/list'), //商品详情
}
