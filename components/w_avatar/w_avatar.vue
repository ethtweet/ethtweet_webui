<template>
	<view class="avatar_wrap ellipse" @click="gotoUserCenter">
		<view class="avatar_img_wrap">
			<image src="" mode=""></image>
		</view>
		<text class="ellipse fStyle20ffffff ">{{avatar_name}}</text>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			avatar_img_url: String,
			avatar_name: String
		},
		methods:{
			gotoUserCenter() {
				uni.navigateTo({url: '/pages/usercenter/usercenter?id=1'});
			}
		}
	}
</script>

<style lang="scss">
	.avatar_wrap{
		text-align: center;
		width: 77rpx;
		color: #ffffff;
		.avatar_img_wrap{
			width: 77rpx;
			height: 77rpx;
			border-radius: 100%;
			padding: 8px;
			background-image: url('../../static/home/avatar_border.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			box-sizing: border-box;
			image{
				width: 51px;
				height: 51px;
				border-radius: 100%;
			}
		}
	}
	
</style>
