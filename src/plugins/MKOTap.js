/**
 * Created by queue on 2017/5/26.
 */

class MKOTap {
  constructor() {
  }
}

MKOTap.installed = false;

MKOTap.install = function (Vue, options) {
  let TOUCH_START_X, TOUCH_START_Y, TOUCH_START_TIME = 0;
  let IN_DIS = false;
  Vue.prototype.$MKOTouchStart = function (e) {
    TOUCH_START_X = e.touches[0].clientX;
    TOUCH_START_Y = e.touches[0].clientY;
    TOUCH_START_TIME = (new Date()).getTime();
  };

  Vue.prototype.$MKOLongTouch = function (e, CALLBACK, data) {
    e.preventDefault();
    let cur_x = e.changedTouches[0].clientX;
    let cur_y = e.changedTouches[0].clientY;
    let cur_time = (new Date()).getTime();
    let s_x = TOUCH_START_X;
    let s_y = TOUCH_START_Y;
    let s_time = TOUCH_START_TIME;

    if (Math.abs(cur_x - s_x) < 6 && Math.abs(cur_y - s_y) < 6) {
      IN_DIS = true;
    } else {
      IN_DIS = false;
    }

    if (cur_time - s_time > 300 && IN_DIS) {
      if (CALLBACK) {
        let pos = {
          x: cur_x,
          y: cur_y
        }
        CALLBACK(data, pos);
      } else {
        return 'long-touch'
      }
    }
  }
};

export default MKOTap;