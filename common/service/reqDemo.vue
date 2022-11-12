<script>
    /**
     * main.js

     import MinRequest from './service/MinRequest'
     import minRequest from './service/api'

     Vue.prototype.$http = minRequest.minRequest // ajax请求方法
     Vue.use(MinRequest)
     Vue.config.productionTip = false

     App.mpType = 'app'

     const app = new Vue({
        ...App,
        minRequest
     })
     */
    export default {
        data() {
            return {}
        },
        async onLoad() {
            // 获取屏幕宽度
            this.testRequest1()
            this.testRequest2()
            this.testRequest3()
        },
        onReady() {
        },
        methods: {
            // 使用方法一
            testRequest1() {
                this.$api.uniapp({wd: 'uni-app'}).then(res => {
                    this.res = res
                    console.log("使用方法一")
                }).catch(err => {
                    console.log(err)
                })
            },

            // 使用方式二
            async testRequest2() {
                try {
                    this.$http.get('/web/captcha', {wd: 'uni2'})
                    const res = await this.$api.uniapp({wd: 'uni-app'})
                    console.log("使用方法二")
                } catch (err) {
                    console.log(err)
                }
            },
            // 使用方法三
            testRequest3() {
                this.$http.get('/web/captcha', {wd: 'uni2'}).then(res => {
                    this.res = res
                    console.log("使用方法三")
                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>