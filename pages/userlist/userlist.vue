

<template>
	<view class="userlist-container">
		<view class="flex_h_center_center" v-if="nodata">
			<image src="../../static/no_data.png" mode="" class="no_data"></image>
		</view>
		<view class="" v-else>
			<w-user-item v-for="(item, index) in list" :key="index" :item="item" v-if="type =='recommonList'">
				<view class="focus_btn flex_h_between_center" @click="focus">
					<text class="fStyle2242C4B3">{{i18n.focus}}</text>
				</view>
			</w-user-item>
			<w-user-item v-for="(item, index) in list" :key="index" :item="item" v-if="type =='myFocusList'">
				<view class="focus_btn flex_h_between_center" @click="cancelFollow(item.FollowedID)">
					<text class="fStyle2242C4B3W600">{{i18n.followed}}</text>
				</view>
			</w-user-item>
			<w-user-item v-for="(item, index) in list" :key="index" :item="item"  v-if="type =='blackList'">
				<view class="">
					<image src="../../static/delete.png" mode="" class="delete_icon"></image>
				</view>
			</w-user-item>
		</view>
		
		<uni-load-more v-if="!nodata" :status="loadStatus" :contentText="{contentdown: i18n.contentdown, contentrefresh: i18n.contentrefresh, contentnomore: i18n.contentnomore }"></uni-load-more>
	</view>
</template>

<script>
	import WUserItem from '../../components/w-user-item/w-user-item.vue'
	export default {
		components: {
			WUserItem,
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		data() {
			return {
				list: [],
				page: 1,
				pagesize: 15,
				nodata: false,
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
				type: '',
				userId: '',
			}
		},
		onLoad(params) {
			this.type = params.type || '';
			this.userId = params.userid;
			
			
			if(this.type == 'recommonList'){
				uni.setNavigationBarTitle({
					title: this.i18n.recommendFocus
				})
			} else if(this.type == 'myFocusList'){
				uni.setNavigationBarTitle({
					title: this.i18n.myFocus
				})
			} else {
				uni.setNavigationBarTitle({
					title: this.i18n.blackList
				})
			}
			this.getList();
			
		},
		async onPullDownRefresh() {
			this.isLoadMore = true
			this.page = 1
			this.list = [];
			await this.getList();
			uni.stopPullDownRefresh();
		},
		methods:{
			onReachBottom() { //上拉触底函数
				if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.page += 1
					this.getList()
				}
			},
			async getList() {
				let json;
				if(this.type == 'myFocusList'){
					json = await this.$api.userFollowedList({id: this.userId,page: this.page});
				} else {
					json = await this.$api.tweetList();
				}
				if (json.code == 0) {
					if (json.data.length) {
						this.nodata = false;
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
						this.list = [];
						if (this.page == 1) {
							this.nodata = true;
						} else{
							this.nodata = false;
						}
						this.isLoadMore = true;
						this.loadStatus = 'nomore';
					}
				} else {
					uni.showToast({
						title: json.data.msg,
						icon: 'none'
					});
					this.isLoadMore = false;
				}
			},
			async focus() {
				// 请求接口
				if(json.data == 0){
					uni.showToast({title: i18n.focusToast, icon: 'none'});
					this.isLoadMore = true
					this.page = 1
					this.getList()
				} 
				console.log('我关注了');
			},
			async delete() {
				if(json.data == 0){
					uni.showToast({title: i18n.deleteToast, icon: 'none'});
					this.isLoadMore = true
					this.page = 1
					this.getList()
				} 
			},
			async cancelFollow(id) {
				let json = await this.$api.cancelFollow({
					id: id
				});
				if (json.code == 0) {
					uni.showToast({
						title: this.i18n.unfollowTips,
						icon: 'none'
					})
					this.getList();
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.userlist-container {
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;
		.focus_btn{
			border: 1px solid #43D09C;
			padding: 13rpx 30rpx;
			border-radius: 100rpx;
			
		}
		.delete_icon{
			width: 42rpx;
			height: 42rpx;
		}
		.no_data {
			width: 160rpx;
			height: 146rpx;
			padding-top: 80rpx;
		}
		// .focus_btn {
		// 	padding: 17rpx 50rpx;
		// 	border: 1px solid #43D09C;
		// 	border-radius: 40rpx;
		// }
	}

</style>

