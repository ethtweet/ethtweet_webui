<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		ipfsMode: false,
		userInfo: null
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
/deep/ uni-app{
	max-width: 1000rpx;
	margin: 0 auto;
	position: relative;
}

uni-tabbar.uni-tabbar-bottom, uni-tabbar.uni-tabbar-bottom .uni-tabbar, uni-tabbar.uni-tabbar-top, uni-tabbar.uni-tabbar-top .uni-tabbar{
left: initial;
	right: initial;	
	max-width: 1000rpx;
	width: 100%;
}
page{
		min-height: 100%;
		height: 100%;
		width: 100%;
		max-width: 1000rpx;
		margin: 0 auto;
		/* background-color: #; */
		position: relative;
		font-size: 12px;
		font-family: 'PingFangSC-Regular, sans-serif;';
	}
</style>
