<template>
	<view class="w-user-item flex_h_between_center" >
		<view class="flex1 flex_h_start_center" @click="gotoUserCenter">
			<image src="" mode="" class="avatar"></image>
			<text class="fStyle32FFFFFFw600">{{item &&  item.UserId.substring(46)}}</text>	
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		// props:{
		// 	item: Object
		// },
		data() {
			return {
				
			};
		},
		props:{
			item: Object
		},
		methods:{
			gotoUserCenter() {
				uni.navigateTo({url: '/pages/usercenter/usercenter?userid='+this.item.FollowedID});
			}
		}
	}
</script>

<style lang="scss">
	.w-user-item{
		margin-left: 54rpx;
		margin-right: 54rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
		border-bottom: 1rpx solid #3B4456;
		.avatar{
			width: 74rpx;
			height: 74rpx;
			border-radius: 100%;
			margin-right: 45rpx;
			background-color: #ff0;
		}
		
	}

</style>
