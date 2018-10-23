/**
 * Created by enjoyzhou on 17-2-16.
 * https://github.com/mzabriskie/axios#request-config
 */

import Axios from 'axios'
import Conf from '../apiconf'

const Http = (path, method, domain, bHandleError) => {
  return (data, params) => {
    return Axios({
      method: method,
      url: (domain || Conf.domain) + '' + path,
      data: method === 'post' ? data : null,
      params: method === 'get' ? data : params,
      timeout: 10000,
    }).then(function (response) {
      if (response.data.code == 0) {
        return response
      } else {
        if (bHandleError == true) {
          return response.data;
        } else {
          window.mkoVue.$MKOToast({msg:`请求数据错误[code:${response.data.code}],${response.data.msg}`});
          return null;
        }
      }
    }).catch(function (error) {
      let errorString = error.toString();
      if (error.code == "ECONNABORTED") {
        window.mkoVue.$MKOToast({msg:`请求数据超时，请检查网络连接是否正常!`});
      } else if (errorString.match('^Error: Network Error')) {
        window.mkoVue.$MKOToast({msg:`网络异常，请检查网络连接是否正常!`});
      } else {
        window.mkoVue.$MKOToast({msg:`网络异常[${errorString}]，请检查网络是否正常!`});
      }
      return null;
    })
  }
}

export function httpGet(path, domain, bHandleError) {
  return Http(path, 'get', domain, bHandleError)
}

export function httpPost(path, domain, bHandleError) {
  return Http(path, 'post', domain, bHandleError)
}

export function httpPath(path, domain) {
  return (paths) => {
    return Axios({
      method: 'get',
      url: (domain || Conf.domain) + '' + path + '' + paths,
      // timeout: 10000
    }).then(function (response) {
      let res = response.data;
      if (res.code != 0) {
        window.mkoVue.$MKOToast({msg:'错误代码:' + res.code + ', ' + res.msg});
        return null
      }
      return res
    }).catch(function (error) {
      window.mkoVue.$MKOToast({msg:`请求数据超时，请检查网络连接是否正常!`});
      return null
    })
  }
}

export function readFile(path) {
  return (paths) => {
    return Axios.get('/version.json')
      .then(function (response) {
        let res = response.data
        return res
      })
      .catch(function (error) {
        window.mkoVue.$MKOToast({msg:`请求数据超时，请检查网络连接是否正常!`});
        return error
      });
  }
}
