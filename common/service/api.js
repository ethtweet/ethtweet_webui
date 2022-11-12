import MinRequest from './MinRequest';

const minRequest = new MinRequest()
const apiUrl = 'http://localhost:8080/api/v0/'
const zeroApiUrl = '0.0.0.0'
const ipfsApiUrl = 'https://cdn.ipfsscan.io/api/v0/'
const ipfsResUrl = 'https://ipfs.io/ipfs/';
const userApiUrl = 'https://api.ethtweet.io/api/v0/';

// 请求拦截器
minRequest.interceptors.request((request) => {
    return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	// console.log('我是tweet拦截器', response);
    return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
    config.baseURL = ipfsApiUrl
    config.header = {
        // 'content-type': 'application/json',
		'content-type': 'application/x-www-form-urlencoded',
    }
    return config
})


export default {
    // 这里统一管理api请求
    minRequest,
	// ipfsRequest,
    apis: {
		/**
		 * TODO:ipfs的资源地址
		 * @returns {Promise<unknown>}
		 */
		ipfsResUrl() {
			return ipfsResUrl;
		},
		/**
		 * TODO:ipfs的资源地址
		 * @returns {Promise<unknown>}
		 */
		ipfsApiUrl(){
			return ipfsApiUrl;
		},
		/**
		 * TODO:推文列表
		 * @returns {Promise<unknown>}
		 */
		tweetList(data) {
		    return minRequest.get(apiUrl+'tweet/explore?page='+data.page, data)
		},
		/**
		 * TODO:发布推文
		 * @returns {Promise<unknown>}
		 */
		publishTweet(data) {
			return minRequest.post(apiUrl+'tweet/release', data)
		},
		/**
		 * TODO:个人信息
		 * @returns {Promise<unknown>}
		 */
		myselfInfo(data){
			return minRequest.get(apiUrl+'user/profile')
		},
		/**
		 * TODO:ipfs用户信息
		 * @returns {Promise<unknown>}
		 */
		ipfsMyselfInfo(userid){
			return minRequest.get(userApiUrl+'user/'+userid)
		},
		/**
		 * TODO:修改个人信息
		 * @returns {Promise<unknown>}
		 */
		modifyselfInfo(data){
			return minRequest.post(apiUrl+'user/profile', data)
		},
		/**
		 * TODO:自己的个人中心推文
		 * @returns {Promise<unknown>}
		 */
		userTweetList(data){
			return minRequest.get(apiUrl+'tweet/user/timeline?page='+data.page, data)
		},
		/**
		 * TODO:获取个人中心详情
		 * @returns {Promise<unknown>}
		 */
		userInfo(data){
			return minRequest.get(apiUrl+'user/'+data)
		},
		/**
		 * TODO:个人中心推文
		 * @returns {Promise<unknown>}
		 */
		personTweetList(data){
			return minRequest.get(apiUrl+'tweet/user/timeline/'+data.id+'?page='+data.page)
		},
		/**
		 * TODO:推文详情
		 * @returns {Promise<unknown>}
		 */
		tweetDetail(data){
			return minRequest.get(apiUrl+'tweet/'+data.id)
		},
		/**
		 * TODO:转发推文列表
		 * @returns {Promise<unknown>}
		 */
		tweetForwardList(data){
			return minRequest.get(apiUrl+'tweet/user/forward?page='+data.page)
		},
		/**
		 * TODO: 获取转发我的推文
		 * @returns {Promise<unknown>}
		 */
		atMeList(data) {
			return minRequest.get(apiUrl+'tweet/at_me?page='+data.page);
		},
		/**
		 * TODO:关注
		 * @returns {Promise<unknown>}
		 */
		follow(data){
			return minRequest.post(apiUrl+'follow', data)
		},
		/**
		 * TODO:取消关注
		 * @returns {Promise<unknown>}
		 */
		cancelFollow(data){
			return minRequest.post(apiUrl+'follow/cancel', data)
		},
		/**
		 * TODO: 关注状态
		 * @returns {Promise<unknown>}
		 */
		followStatus(userid) {
			return minRequest.get(apiUrl + 'follow/state/'+userid);
		},
		/**
		 * TODO:推特列表（已关注）
		 * @returns {Promise<unknown>}
		 */
		followList(data){
			return minRequest.get(apiUrl+'tweet/follow?page='+data.page)
		},
		/**
		 * TODO: 用户关注的列表
		 * @returns {Promise<unknown>}
		 */
		userFollowedList(data){
			return minRequest.get(apiUrl+'follow/'+data.id+'?page='+data.page)
		},
		/**
		 * TODO:关注的人
		 * @returns {Promise<unknown>}
		 */
		ipfsUpload() {
			return ipfsRequest.post('add?pin=false', data);
		},
		/**
		 * TODO: 获取ipfs上的tweet的详情
		 * @returns {Promise<unknown>}
		 */
		ipfsTweetDetail(tweetid) {
			return minRequest.get(ipfsResUrl + tweetid);
		},
		getBalanceof(addr) {
			return minRequest.get('https://api.etherscan.io/api?module=account&action=balance&address='+addr+'&tag=latest&apikey=YourApiKeyToken')
		}
    }
}
