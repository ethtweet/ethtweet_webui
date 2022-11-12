<template>
	<view class="forward-item flex_h_start_start">
		<view class="avatar_wrap">
			<image :src="'https://ipfs.io/ipfs/'+item.UserInfo.Avatar" mode="" class="avatar" v-if="item && item.UserInfo && item.UserInfo.Avatar != ''"></image>
		</view>
		
		<view class="flex_v_start_start flex1 border">
			<text class="fStyle26C4C4C4">{{item && item.UserInfo && item.UserInfo.Name || item.UserId.substring(46)}}</text>
			<text class="fStyle24ffffff">{{item.Content}}</text>
			<text class="fStyle264E586E">{{item != null ? friendlyDate(item.CreatedAt) : ''}}</text>
		</view>
	</view>
</template>

<script>
	import {
		friendlyDate
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				
			};
		},
		mixins: [friendlyDate],
		props:{
			item: Object
		}
	}
</script>

<style lang="scss">
	.forward-item{
		margin-top: 20rpx;
		
		// margin-left: 60rpx;
		// margin-right: 60rpx;
		.avatar_wrap{
			margin-left: 60rpx;
			width: 60rpx;
			height: 60rpx;
			border-radius: 100%;
			background-color: #ff0;
			margin-right: 30rpx
		}
		.avatar{
			width: 60rpx;
			height: 60rpx;
			border-radius: 100%;
			background-color: #ff0;
			
		}
		.border{
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #3B4456;
		}
	}

</style>
