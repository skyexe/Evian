class MKOMessagePlugin{
    constructor(){
    }
}

MKOMessagePlugin.installed = false;

MKOMessagePlugin.install = function(Vue, options){
    if (MKOMessagePlugin.installed){
        warn('MKOMessagePlugin already installed!');
        return;
    }
    let _send = function(success, fail, key, params){
        return window.cordova.exec(success, fail, 'MKOMessagePlugin', 'message', [key, params]);
    }

    let createCallbackFunction = function(cb) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        let len = 16;
        let radix = chars.length;
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
        let fName = `F` + uuid.join('');
        window[fName] = function(opts){
            let value = null;
            try{
                value = JSON.parse(opts);
            }catch(e){
                console.error('parseCallback JSON fail');
                console.error(`[CALLBACK DATA]: ${opts}`);
            }
            cb(value);
            delete window[fName];
        }
        return `window.${fName}`;
    }

    let _sendMessage = function(key, params){
        _send( (result) => {
            console.info(result);
        }, (error) => {
            console.error(error);
        }, key, params);
    }

    Vue.prototype.$savePhoto = function(url, callback){
      let command = {
        type: 'Photo',
        subType: 'SavePhoto',
        data: url,
        callback: createCallbackFunction(callback)
      }
      _sendMessage('notification', command);
      //callback(err);
    }

    Vue.prototype.$takePhoto = function(callback){
        let command = {
            type: 'Camera',
            subType: 'TakePhoto',
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$choosePhoto = function(callback){
        let command = {
            type: 'Camera',
            subType: 'ChoosePhoto',
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$uploadXunChaData = function(data, uploadURL, callback){
        let command = {
            type: 'Upload',
            subType: 'UploadXunChaData',
            callback: createCallbackFunction(callback),
            uploadURL: uploadURL,
            data: JSON.stringify(data),
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$uploadImages = function(data, uploadURL, callback){
        let command = {
            type: 'Upload',
            subType: 'uploadImages',
            callback: createCallbackFunction(callback),
            uploadURL: uploadURL,
            data: JSON.stringify(data),
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$getMobileNetworkType = function(callback){
        let command = {
            command: 'NetworkType'
        }
        _send( (result) => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }

    Vue.prototype.$registerPUSHService = function(tags, userName){
        let command = {
            type: 'Register',
            subType: 'PushService',
            tags: tags,
            userName: userName
        }
        _sendMessage('notification', command);
    }
    
    Vue.prototype.$getAppVersion = function(callback){
        let command = {
            command: 'getAppVersion'
        }
        _send( (result) => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }
    
    Vue.prototype.$MKOJumpOutsideURL = function(url){
        let command = {
            type: 'JumpOutsideURL',
            url: url
        }
        _sendMessage('notification', command);
    }

    //关闭APP
    Vue.prototype.$MKOShutDownApp = function () {
        let command = {
            type: 'exitApp'
        }
        _sendMessage('notification', command);
    }
    MKOMessagePlugin.installed = true;
}


// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MKOMessagePlugin)
}

export default MKOMessagePlugin;