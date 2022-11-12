<template>
	<view class="container" @click="cancelBubble">
		<!-- <uni-status-bar /> -->
		<view class="flex_v_center_center fixed_header">
			<uni-status-bar />
			<view class="flex_h_between_center padd_h_30">
				<view style="width: 60%;" class="flex_h_between_center">
					<view class="tab" @click="changeListIndex(0)">
						<text
							:class="['trans', currIndex == 0 ? 'fStyle36ffffffw600' : 'fStyle30FFFFFFw600' ]">{{i18n.recommend}}</text>
						<view class="tab_line trans" :style="{opacity: currIndex == 0 ? 1 : 0} ">

						</view>
					</view>
					<view class="tab" @click="changeListIndex(1)">
						<text
							:class="['trans', currIndex == 0 ? 'fStyle36ffffffw600' : 'fStyle30FFFFFFw600']">{{i18n.focus}}</text>
						<view class="tab_line trans" :style="{opacity: currIndex == 1 ? 1 : 0} ">
						</view>
					</view>
				</view>

				<view class="input_wrap flex_h_between_center">
					<view class="sarch_icon">
						<image src="../../static/home/search_icon.png" mode=""></image>
					</view>
					<input type="text" value="" :placeholder="i18n.search" placeholder-class="fStyle264E586E" />
				</view>
			</view>
		</view>
		<uni-status-bar />
		<view class="header_placeholder">

		</view>
		<!-- <view class="mt_30 flex_h_between_center padd_h_60">
			<text class="fStyle40ffffffw600">{{i18n.recommendFocus}}</text>
			<text class="fStyle247F7F7F" @click="goMore">{{i18n.more}}</text>
		</view>
		<view class="flex_h_between_center padd_h_60 mt_15">
			<w-avatar v-for="(item, index) in recommentList" :key="index" :avatar_img_url="item"
				:avatar_name="String(item)"></w-avatar>
		</view> -->


		<view class="flex_h_center_center mt_80" v-if="noData">
			<image src="../../static/no_data.png" mode="" class="no_data"></image>
		</view>

		<view class="" v-else>
			<w-tweet-item v-for="(item, index) in list" :key="index" :item="item" :scrollTop="scrollTop">
				<!-- <view class="more_wrap" @click.stop="showBubble(item.UserId, $event)">
					<image src="../../static/home/more_icon.png" mode=""></image>
				</view> -->
			</w-tweet-item>
		</view>

		<uni-load-more v-if="!noData" :status="loadStatus"
			:contentText="{contentdown: i18n.contentdown, contentrefresh: i18n.contentrefresh, contentnomore: i18n.contentnomore }">
		</uni-load-more>
		<w-bubble ref="bubble" @onCancelFollow="cancelFollow"></w-bubble>
	</view>
</template>

<script>
	import WAvatar from '../../components/w_avatar/w_avatar.vue';
	import WtweetItem from '../../components/w-tweet-item/w-tweet-item.vue'
	export default {
		components: {
			WAvatar,
			WtweetItem
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		data() {
			return {
				recommentList: [1],
				list: [],
				currIndex: 0,
				page: 1,
				pagesize: 20,
				// nodata: false,
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
				noData: false,
				itemid: '',
				scrollTop: 0
			}
		},
		onReachBottom() { //上拉触底函数
			if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
				this.isLoadMore = true
				this.page += 1
				this.list = [];
				this.getList()
			}
		},
		async onPullDownRefresh() {
			this.isLoadMore = true
			this.page = 1
			this.list = [];
			await this.getList();
			uni.stopPullDownRefresh();
		},
		onPageScroll(e) {
			this.cancelBubble();
			if (e.scrollTop == 0) {
				console.log('我到顶了');
			}
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.getList();
		},
		methods: {
			changeListIndex(index) {
				this.currIndex = index;
				this.isLoadMore = true
				this.page = 1
				this.list = [];
				this.getList()
			},
			async getList() {
				let json;
				if (this.currIndex == 0) {
					json = await this.$api.tweetList({
						page: this.page
					});
				} else {
					json = await this.$api.followList({
						page: this.page
					});
				}
				if (json.code == 0) {
					if (json.data.length) {
						this.noData = false;
						if (this.page == 1) {
							this.list = json.data || [];
						} else {
							this.list = this.list.concat(json.data || []);
						}
						if (json.data.length < this.pagesize) {
							this.isLoadMore = true;
							this.loadStatus = 'nomore';
							this.page++;
						} else {
							this.isLoadMore = false;
						}
					} else {
						if (this.page == 1) {
							this.noData = true;
						} else {
							this.noData = false;
						}
						this.isLoadMore = true;
						this.loadStatus = 'nomore';
					}
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					});
					this.isLoadMore = false;

				}
			},
			async cancelFollow(){
				let json = await this.$api.cancelFollow({id: this.itemid});
				if(json.code == 0){
					uni.showToast({
						title:'取消成功！',
						icon: 'none'
					});
					this.getList();
				} else {
					uni.showToast({
						title: json.data,
						icon:'none'
					});
				}
			},
			showBubble(id,e) {
				
				this.itemid = id;
				this.$refs.bubble.setHeight(e.detail.x, e.detail.y);
				console.log(e);
			},
			cancelBubble() {
				if (this.$refs.bubble) {
					if (this.$refs.bubble.opacity == 1) {
						this.$refs.bubble.hideBobble();
					}
				}
			},
			// async follow(id, index) {
			// 	let json = await this.$api.follow({
			// 		follow_id: id
			// 	});
			// 	if (json.code == 0) {
			// 		uni.showToast({
			// 			title: this.i18n.followTips,
			// 			icon: 'none'
			// 		});
			// 		let item = Object.assgin(this.list[index], {});
			// 		// 重新获取list获取已经关注人的列表
			// 		this.isLoadMore = true
			// 		this.page = 1
			// 		this.list = [];
			// 		this.getList();
			// 	} else {
			// 		uni.showToast({
			// 			title: json.msg,
			// 			icon: 'none'
			// 		})
			// 	}
			// },
			goMore() {
				uni.navigateTo({
					url: '/pages/userlist/userlist?type=recommonList'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;

		.fixed_header {
			position: fixed;
			// left: 0;
			// right: 0;
			top: 0;
			z-index: 99;
			background-color: $uni-bg-color;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			max-width: 1000rpx;
		}

		.header_placeholder {
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			height: 72rpx;
		}

		.focus_btn {
			padding: 10rpx 40rpx;
			border: 1px solid #43D09C;
			border-radius: 40rpx;
			margin-right: 30rpx;
		}

		.tab {

			position: relative;
			margin-right: 30rpx;

			.trans {
				transition: all .3s;
			}

			.tab_line {
				width: 100%;
				height: 7rpx;
				border-radius: 100rpx;
				background-color: #42C4B3;
				opacity: 0;
			}
		}

		.more_wrap {
			position: relative;

			image {
				width: 40rpx;
				height: 10rpx;
			}

		}

		.input_wrap {
			width: 100%;
			height: 72rpx;
			border-radius: 100px;
			background-color: rgba(142, 142, 147, 0.12);
			;
			padding-left: 36rpx;
			padding-right: 36rpx;

			.sarch_icon image {
				width: 32rpx;
				height: 32rpx;
			}

			input {
				// background-color: #FFFFFF;
				width: 100%;
				height: 100%;
				padding-left: 30rpx;
				padding-right: 30rpx;
				padding-top: 0rpx;
				padding-bottom: 0rpx;
			}
		}

		.publish_btn image {
			width: 72rpx;
			height: 72rpx;
			border-radius: 100%;
			margin-left: 28rpx;
		}

		.no_data {
			width: 160rpx;
			height: 146rpx;
		}
	}
</style>
