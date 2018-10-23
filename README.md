# vinjak_app

> vinjak app project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8083
npm run dev              本地开发

# build for production with minification
npm run build
sh ./build-browser.sh    微信端打包命令

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 技术找

vue2+muse-ui+less

### 目录结构

```
.
├── build
│   ├── build.cordova.android.js
│   ├── build.cordova.ios.js
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server-cordova.js
│   ├── dev-server.js
│   ├── macros_android.json
│   ├── macros_ios.json
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   ├── webpack.dev.cordova.conf.js
│   ├── webpack.prod.conf.js
│   └── webpack.prod.cordova.conf.js
├── build-browser.sh                        构建微信版脚本
├── build-ios.sh
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── dist                                    打包编译后的文件，用来web部署
├── index-cordova.html
├── index.html
├── package.json                            包依赖
├── README.md
├── src
│   ├── api                                 API 管理
│   │   ├── index.js
│   │   └── requestService.js
│   ├── apiconf                             API接口列表
│   │   ├── debug.js
│   │   ├── index.js
│   │   └── prod.js
│   ├── App.less
│   ├── App.vue
│   ├── components                          公共组件
│   │   ├── chooseBar.vue
│   │   ├── index.js
│   │   ├── list.vue
│   │   ├── photoView.vue
│   │   ├── saveBtn.vue
│   │   ├── searchBar.vue
│   │   ├── tabs.vue
│   │   └── toTop.vue
│   ├── config.js                           全局接口域名配置、图片域名配置等
│   ├── config.less                         全局less配置
│   ├── filters                             vue 过滤器
│   │   └── index.js
│   ├── language
│   │   ├── index.js
│   │   ├── language_CN.js
│   │   └── language_EN.js
│   ├── main-cordova.js
│   ├── main.js
│   ├── plugins
│   │   ├── MKOHistoryManager.js
│   │   ├── MKOLike.js
│   │   ├── MKOMessagePlugin.js
│   │   ├── MKOTap.js
│   │   └── MKOUITools.js
│   ├── router.js
│   ├── utils
│   │   └── PinyinFirstLetter.js
│   └── views
│       ├── enter
│       ├── goods
│       └── like
├── static
│   ├── classify_name.png
│   ├── image
│   │   ├── brand_avatar_default.png
│   │   ├── brand_banner_default.png
│   │   ├── classify_name.png
│   │   ├── triangle.png
│   │   ├── washing_sign.png
│   │   └── wx_code.jpg
│   ├── platform_android
│   │   ├── cordova.js
│   │   ├── cordova-js-src
│   │   ├── cordova_plugins.js
│   │   └── plugins
│   ├── platform_www_browser
│   │   ├── confighelper.js
│   │   ├── cordova.js
│   │   ├── cordova-js-src
│   │   ├── cordova_plugins.js
│   │   ├── exec.js
│   │   ├── platform.js
│   │   └── plugins
│   ├── platform_www_ios
│   │   ├── cordova.js
│   │   ├── cordova-js-src
│   │   ├── cordova_plugins.js
│   │   └── plugins
│   └── Vin-Icon
│       ├── demo-files
│       ├── demo.html
│       ├── fonts
│       ├── ie7
│       ├── Read Me.txt
│       ├── selection.json
│       └── style.css
└── version.json

```