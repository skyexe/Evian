/**
 * Created by queue on 2017/7/25.
 */
class MKOUITools {
  constructor() {
  }
}

MKOUITools.installed = false;

MKOUITools.install = function (Vue, options) {

  Vue.prototype.$MKOToast = function (op) {
    const tpl = `<mu-toast class="toast-wrap" v-show="toast" :message="message" @close="hideToast"/>`;
    let div = document.getElementById('MKOToast');
    if (div) {
      div.innerHTML = '';
      div.innerHTML = tpl;
    } else {
      div = document.createElement('div');
      div.id = 'MKOToast';
      div.innerHTML = tpl;
      document.body.appendChild(div);
    }
    const MKOToastShow = new Vue({
      el: div,
      data: {
        toast: null,
        toastTimer: null,
        message: op.msg
      },
      created(){
        this.toast = true;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
          this.toast = false
        }, 1500)
      },
      methods: {
        hideToast(){
          this.toast = false;
          if (this.toastTimer) clearTimeout(this.toastTimer)
        }
      }
    });
  };

  Vue.prototype.$MKODialog = function (op) {
    const tpl = `<mu-dialog :open="dialog" :title="title" @close="close">
  <div v-html="message"></div>
  <div slot="actions" class="btn" @click="close" v-if="cancel">取消</div>
  <div slot="actions" class="btn" @click="confirm">确定</div>
</mu-dialog>`;
    let div = document.getElementById('MKODialog');
    if (div) {
      div.innerHTML = '';
      div.innerHTML = tpl;
    } else {
      div = document.createElement('div');
      div.id = 'MKODialog';
      div.innerHTML = tpl;
      document.body.appendChild(div);
    }
    const MKODialogShow = new Vue({
      el: div,
      data: {
        dialog: null,
        title: op.title,
        message: op.msg,
        callback: op.callback,
        cancel: op.cancel
      },
      created(){
        this.dialog = true;
      },
      methods: {
        close(){
          this.dialog = false;
        },
        confirm(){
          if (this.callback)
            this.callback();
          this.close();
        }
      }
    });
  }
};

export default MKOUITools;