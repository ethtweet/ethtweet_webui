const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class MinRequest {
    [config] = {
        baseURL: '',
        header: {
            'content-type': 'application/json',
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text'
    }

    interceptors = {
        request: (func) => {
            if (func) {
                MinRequest[requestBefore] = func
            } else {
                MinRequest[requestBefore] = (request) => request
            }

        },
        response: (func) => {
            if (func) {
                MinRequest[requestAfter] = func
            } else {
                MinRequest[requestAfter] = (response) => response
            }
        }
    }

    static [requestBefore] (config) {
        return config
    }

    static [requestAfter] (config) {
        return response
    }

    static [isCompleteURL] (url) {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
    }

    setConfig (func) {
        this[config] = func(this[config])
    }

    request (options = {}) {
        options.baseURL = options.baseURL || this[config].baseURL
        options.dataType = options.dataType || this[config].dataType
        options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
        options.data = options.data
        options.header = {...options.header, ...this[config].header}
        options.method = options.method || this[config].method

        options = {...options, ...MinRequest[requestBefore](options)}
		


        return new Promise((resolve, reject) => {
            options.success = function (res) {
				// console.log('我是1');
                resolve(MinRequest[requestAfter](res))
            }
            options.fail= function (err) {
				// console.log('我是3');
                reject(MinRequest[requestAfter](err))
            }
            uni.request(options)
        })
    }

    get (url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'GET'
        return this.request(options)
    }

    post (url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'POST'
        return this.request(options)
    }

    put (url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'PUT'
        return this.request(options)
    }

    delete (url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'DELETE'
        return this.request(options)
    }

    uploadFile(url, file, options) {
        let data = null || options.data
        let name = 'file' || options.name
        const uploadTask = uni.uploadFile({
            url: url, //仅为示例，非真实的接口地址
            filePath: file,
            name: name,
            formData: data,
        });

        // 上传进度事件
        // uploadTask.onProgressUpdate((res) => {
        //     console.log('上传进度' + res.progress);
        //     console.log('已经上传的数据长度' + res.totalBytesSent);
        //     console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
        //
        //     // 测试条件，取消上传任务。
        //     if (res.progress > 50) {
        //         uploadTask.abort();
        //     }
        // });

        return uploadTask
    }

    downloadFile(url) {
        const downloadTask = uni.downloadFile({
            url: url,
        });

        // 下载进度事件
        // downloadTask.onProgressUpdate((res) => {
        //     console.log('下载进度' + res.progress);
        //     console.log('已经下载的数据长度' + res.totalBytesWritten);
        //     console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
        //
        //     // 测试条件，取消下载任务。
        //     if (res.progress > 50) {
        //         downloadTask.abort();
        //     }
        // });
        return downloadTask
    }
}

MinRequest.install = function (Vue) {
    Vue.mixin({
        beforeCreate: function () {
            if (this.$options.minRequest) {
                Vue._minRequest = this.$options.minRequest
            }
        },
    })
    Object.defineProperty(Vue.prototype, '$api', {
        get: function () {
            return Vue._minRequest.apis
        }
    })
}

export default MinRequest