import axios from 'axios';
import qs from 'qs';

const common = {}

const baseApi = "http://81.68.73.220:8000/api"

common.setToken = function (token) {
    if (token) {
        window.localStorage.setItem("token", token)
    } else {
        window.localStorage.removeItem("token")
    }
}

common.getToken = function () {
    let token = window.localStorage.getItem("token")
    return token === null ? '' : token
}

common.ajax = function (method, api, data, config = {}) {

    data = data || {}

    const isGet = method.toLowerCase() === 'get'

    const configDefault = {
        // application/x-www-form-urlencoded、multipart/form-data、application/json
        'contentType': 'application/json',

        // 调用api超时时间 (毫秒)
        'timeout': 20000,
    }

    config = { ...configDefault, ...config }

    let headers = {
        'Content-Type': config['contentType']
    }
    // headers['token'] = common.getToken()

    let params = {}

    let token = common.getToken()
    if (token) {
        params.token = common.getToken()
    }

    if (!isGet && config['contentType'].toLowerCase() === 'application/x-www-form-urlencoded') {
        data = qs.stringify(isGet ? null : data)
    }
    if (isGet) {
        params = { ...data, ...params }
        data = {}
    }

    return new Promise((resolve, reject) => {

        axios({
            method: method,
            url: baseApi + api,
            params: params,
            data: data,
            headers: headers,
            timeout: config.timeout
        }).then((response) => {

            // code: SUCCESS
            if (response.data.code === 'SUCCESS') {
                resolve(response.data.data)
                return
            }

            switch (response.data.code) {
                case 'INVALID_TOKEN':
                    alert('请登录')
                    break
                default:
                    alert("出错了 " + response.data.data)
            }

            reject(response.data)

        }).catch((error) => {
            alert("出错了 " + error)
        })

    })
}

export default common