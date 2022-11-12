<template>
	<view class="setting_container">
		<view class="list_item flex_h_between_center" @click="goto('blackList')">
			<view class="flex1">
				<image src="../../static/mine/blackList_icon.png" mode="" class="black_list_cion"></image>
				<text class="fStyle32FFFFFFw600">{{i18n.blackList}}</text>
			</view>
			<image src="../../static/mine/arrow_right.png" mode="" class="arrow_icon"></image>
		</view>
		<view class="list_item flex_h_between_center" @click="goto('helpCenter')">
			<view class="flex1">
				<image src="../../static/mine/help_icon.png" mode="" class="help_icon"></image>
				<text class="fStyle32FFFFFFw600">{{i18n.helpCenter}}</text>
			</view>
			<image src="../../static/mine/arrow_right.png" mode="" class="arrow_icon"></image>
		</view>
		<view class="list_item flex_h_between_center" @click="goto('about')">
			<view class="flex1">
				<image src="../../static/mine/about.png" mode="" class="about_icon"></image>
				<text class="fStyle32FFFFFFw600">{{i18n.about}}</text>
			</view>
			<image src="../../static/mine/arrow_right.png" mode="" class="arrow_icon"></image>
		</view>
		<view class="list_item flex_h_between_center">
			<view class="flex1">
				<image src="../../static/mine/about.png" mode="" class="about_icon"></image>
				<text class="fStyle32FFFFFFw600">{{i18n.ipfsMode}}</text>
			</view>
			<switch :checked="ipfsMode" @change="changeMode" />
			<!-- <image src="../../static/mine/arrow_right.png" mode="" class="arrow_icon"></image> -->
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex';
	export default {
		computed: {
			...mapState(['ipfsMode']),
			i18n() {
				return this.$t('index')
			}
		},
		data() {
			return {
				// ipfsMode: false,
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.setting
			})
			
			// this.ipfsMode = getApp().globalData.ipfsMode;
		},
		methods:{
			...mapMutations(['IPFS_MODEL']),
			goto(type) {
				let url = '';
				if(type === 'blackList'){
					url = '/pages/userlist/userlist?type=blackList';
					uni.navigateTo({
						url: url
					});
				} else if(type === 'about'){
					uni.showToast({
						title: this.i18n.about,
						icon:'none'
					})
				} else {
					uni.showToast({
						title: this.i18n.helpCenter,
						icon:'none'
					})
				}
				
			},
			changeMode(e) {
				this.IPFS_MODEL(e.detail.value);
				// getApp().globalData.ipfsMode = e.detail.value;
			}
		}
	}
</script>

<style lang="scss">
	.setting_container {
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;
		.list_item{
			margin-left: 54rpx;
			margin-right: 54rpx;
			padding-top: 62rpx;
			padding-bottom: 24rpx;
			border-bottom: 1px solid #3B4456;
		}
		.black_list_cion{
			width: 43rpx;
			height: 46rpx;
			margin-right: 46rpx;
		}
		.help_icon{
			width: 32rpx;
			height: 46rpx;
			margin-right: 57rpx;
		}
		.about_icon{
			width: 46rpx;
			height: 45rpx;
			margin-right: 43rpx;
		}
		.arrow_icon{
			width: 17rpx;
			height: 30rpx;
		}
	}
</style>
