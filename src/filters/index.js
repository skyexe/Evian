/**
 * Created by queue on 2017/5/25.
 */
import Vue from 'vue'
import conf from '../config.js'

//图片过滤
export const photoFr = Vue.filter('photoFr', (cover) => {
  let path = conf.imgPath;
  let res = "";
  if (cover)
    res = path + cover;
  return res;
});

export const washingSignFr = Vue.filter('washingSignFr', (cover) => {
  let path = conf.washingSignPath;
  let res = "";
  if (cover)
    res = path + cover;
  return res;
});
export const _imgZoomFr = Vue.filter('imgZoomFr', function (source, size) {
  var s = size.split(',');
  var d = source;
  var m = '1';
  if (Object.prototype.toString.call(s) === '[object Array]') {
    if (s.length == 3) {
      if (s[1] * 1 == 0) {
        d += '?imageView2/' + s[2] + '/w/' + s[0] + '/interlace/1/q/79';
      } else {
        d += '?imageView2/' + s[2] + '/w/' + s[0] + '/h/' + s[1] + '/interlace/1/q/79';
      }
      
    } else {
      if (s.length == 1)
        d += '?imageView2/' + m + '/w/' + s[0] + '/interlace/1/q/79';
      if (s.length == 2)
        d += '?imageView2/' + m + '/w/' + s[0] + '/h/' + s[1] + '/interlace/1/q/79';
    }
  }
  return d;
});
export const imgZoomFr = Vue.filter('imgZoomFr', function (source, size) {
    return source+'!w800';
});

//价格过滤
export const priceDotFr = Vue.filter('priceDotFr', (money) => {
  if (money == "") {
    return "";
  }
  money = (money / 100).toFixed(2);
  if (/[^0-9\.\-\+]/.test(money)) {
    return money;
  }
  money = parseFloat(money) + "";
  if (money == 'NaN') {
    return "0.00";
  }
  let money_flag = "";
  if (money.indexOf("-") != -1) {
    money = money.replace(/-/g, "");
    money_flag = "-";
  }
  money = money.replace(/^(\d*)$/, "$1.");
  money = (money).replace(/(\d*\.\d\d)\d*/, "$1");
  money = money.replace(".", ",");
  let re = /(\d)(\d{3},)/;
  while (re.test(money)) {
    money = money.replace(re, "$1,$2");
  }
  money = money.replace(/,(\d\d)$/, ".$1");
  let result = money_flag + "" + money.replace(/^\./, "0.");
  result = result.substring(0, result.lastIndexOf(','));
  return result;
});

export const priceFr = Vue.filter('priceFr', (money, sign) => {
  if (money == "") {
    return "";
  }
  if (!sign && sign !== '')
    sign = `${conf.priceSign} `;

  let str = `${(money / 100).toFixed(2)}`;
  return `${sign}${str}`;
});

//数组转字符串
export const arrFr = Vue.filter('arrFr', (arr, key) => {
  if (!arr || arr.length == 0)
    return '-';
  let str = '';
  if (key) {
    arr.forEach((item, i) => {
      str += item[key];
      if (i < arr.length - 1)
        str += ', '
    });
  } else {
    str = arr.join(', ');
  }
  return str;
});

//尺码排序
export const sizeSortFr = Vue.filter('sizeSortFr', (arr) => {
  if (!arr || arr.length == 0)
    return '';

  let CALLBACK = function (a, b) {
    return a - b;
  };
  if (!parseInt(arr[0])) {
    let SIZE_LIST = 'XS,S,M,L,XL,XXL,XXXL,XXXXL'.split(',');
    CALLBACK = function (a, b) {
      a = a.toUpperCase();
      b = b.toUpperCase();
      let a_index = '';
      let b_index = '';
      for (let index in SIZE_LIST) {
        if (a == SIZE_LIST[index])
          a_index = index;
        if (b == SIZE_LIST[index])
          b_index = index
      }
      return a_index - b_index;
    };
  }
  return arr.sort(CALLBACK);
});

//图片比例计算
export const calcImageRatio = function (img, ratioH, ratioW) {
  if (!ratioW)
    ratioW = conf.clientWidth;
  if (!ratioH)
    ratioH = 1;
  // let img = new Image();
  // img.src = conf.imgPath + src;
  img.onload = function () {
    let w = img.width;
    let h = img.height;
    let ratio = ratioW / ratioH;
    if ((w / h) > ratio) {
      img.style.height = '100%';
      console.log('height-full');
      return 'height-full'
    } else {
      img.style.width = '100%';
      console.log('width-full');
      return 'width-full'
    }
  };

};

export default{
  photoFr,
  washingSignFr,
  imgZoomFr,
  priceFr,
  arrFr,
  sizeSortFr,
  calcImageRatio
}