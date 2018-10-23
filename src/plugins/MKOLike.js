/**
 * Created by queue on 2017/5/26.
 */

class MKOLike {
  constructor() {
  }
}

MKOLike.installed = false;

MKOLike.install = function (Vue, options) {
  const _KEY = 'vinjak_like';
  const ctrlLike = function (data, isUpdate) {

    if (!localStorage.getItem(_KEY))
      localStorage.setItem(_KEY, "");

    //获取本地数据
    let arr = null;
    let local = localStorage.getItem(_KEY);
    if (local) {
      try {
        arr = JSON.parse(local);
      } catch (err) {
        console.log(err.name);
      }
    } else {
      arr = [];
    }

    //处理数据
    if (data.isLike && !isUpdate) {
      arr.unshift(data);
    } else {
      for (let index in arr) {
        if (arr[index].id == data.id) {
          if (isUpdate) {
            arr.splice(index, 1, data);
          } else {
            arr.splice(index, 1);
          }
        }
      }
    }

    //将数据存入本地
    let json = '';
    try {
      json = JSON.stringify(arr);
    } catch (err) {
      console.log(err.name);
    }
    if (json.length) {
      localStorage[_KEY] = json;
    }
  };

  Vue.prototype.$MKOiLike = function (data, index, allList) {
    if (!data.isLike) {
      data.isLike = 1;
    } else {
      data.isLike = 0;
    }
    if (allList)
      allList.splice(index, 1, data); //刷新数据
    ctrlLike(data);
  };
  Vue.prototype.$MKOUnLike = function (data, index, allList) {
    data.isLike = 0;
    if (allList)
      allList.splice(index, 1, data); //刷新数据
    ctrlLike(data);
  };
  Vue.prototype.$MKOUpdateLike = function (data) {
    ctrlLike(data, true);
  }
};

export default MKOLike;