
const IPFS_MODEL = 'IPFS_MODEL'; // 存储币涨跌颜色状态。
const USER_INFO = 'USER_INFO'; // 存储登录者的info信息件反面照

export default {
	// 登录信息
	[USER_INFO](state, info) {
		state.userInfo = info;
		uni.setStorage({
			key: USER_INFO,
			data: info
		});
	},
	// API token
	[IPFS_MODEL](state, status) {
		state.ipfsMode = status;
		uni.setStorage({
			key:'ipfs_mode',
			data: status
		})
	}
}