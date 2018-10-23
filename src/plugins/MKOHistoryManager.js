class MKOHistoryManager{
    constructor(){
    }
}

MKOHistoryManager.installed = false;

MKOHistoryManager.install = function(Vue, options){
    let history = [];
    if (MKOHistoryManager.installed){
        warn('MKOHistoryManager already installed!');
        return;
    }

    // /*
    //     清除尾部指定Tag
    // */
    // Vue.prototype.$MKOClearRouterByTag = function(tag){
    //     if (!tag || tag.lenght == 0 || routerQueue.length == 0)
    //         return;
    //     while(true){
    //         if (routerQueue.length == 0)
    //             break;
    //         let lastRouter = routerQueue[routerQueue.length - 1];
    //         if (lastRouter.tag == tag){
    //             routerQueue.pop();
    //         }else {
    //             break;
    //         }
    //     }
    // }

    Vue.prototype.$MKOPush = function(location, from, bReplaceLastLocation){
        if (!from){
            from = {
                path: this.$route.path,
                params: this.$route.params,
                query: this.$route.query,
                name: this.$route.name
            }
        }
        if (bReplaceLastLocation){
            history.pop();
            history.push({
                to: location,
                from: from
            })
        }else {
            history.push({
                to: location,
                from: from
            });
        }
        this.$router.push(location);
        // console.log(history);
        // console.log(`$MKOPush To: ${JSON.stringify(location)}`);
        // console.log(`$MKOPush From: ${JSON.stringify(from)}`);
    }

    Vue.prototype.$MKOPop = function(bHandle){
        let result = null;
        if (history.length > 0){
            result = history.pop();
            if (!bHandle){
                // console.log(history);
                // console.log(`$MKOPop ${JSON.stringify(result)}`);
                this.$router.replace(result.from);
            }
        }
        return result;
    }

    Vue.prototype.$MKOJump = function(location){
        history = [];
        this.$router.replace(location);
        console.log(`$MKOJump ${JSON.stringify(location)}`);
    }

    Vue.prototype.$MKOPresent = function(location){

    }

    Vue.prototype.$MKODissmis = function(){

    }

    MKOHistoryManager.installed = true;
}

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MKOHistoryManager)
}

export default MKOHistoryManager;
