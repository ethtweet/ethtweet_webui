<template>
	<view class="ontTweet_container">
		<uni-status-bar />
		<w-tweet-item :item="info" v-if="info != null" :noMargin="true"></w-tweet-item>
		<view class="flex_h_start_center padd_h_60 tab_line">
			<text class="fStyle24ffffff">{{i18n.forward}}</text>
		</view>
		<view class="">
			<w-forward-item v-for="(item, index) in list" :key="index" :item="item"></w-forward-item>
		</view>
		<uni-load-more :status="loadStatus" :contentText="{contentdown: i18n.contentdown, contentrefresh: i18n.contentrefresh, contentnomore: i18n.contentnomore }"></uni-load-more>
	</view>
</template>

<script>
	import WForwardItem from '../../components/w-forward-item/w-forward-item.vue';
	export default {
		components:{
			WForwardItem
		},
		data() {
			return {
				id: '',
				info: null,
				list: [1,2,3,],
				page: 1,
				pagesize: 20,
				nodata: false,
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加
			};
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.artical
			})
		},
		onReachBottom() { //上拉触底函数
			if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
				this.isLoadMore = true
				this.page += 1
				// this.getList()
			}
		},
		async onPullDownRefresh(){
			this.isLoadMore = true
			this.page = 1
			await this.getList();
			uni.stopPullDownRefresh();
		},
		onLoad(params){
			this.id = params.id;
			this.getOriginTweet();
			this.getList();
		},
		methods:{
			async getOriginTweet() {
				let json = await this.$api.tweetDetail({id: this.id});
				if(json.code == 0){
					this.info = json.data;
				}
			},
			async getList() {
				let json = await this.$api.tweetForwardList({page: this.page});
				if (json.code == 0) {
					if (json.data.length) {
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
							this.nodata = true;
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
		}
	}
</script>

<style lang="scss">
.ontTweet_container{
	min-height: 100%;
	position: relative;
	background-color: $uni-bg-color;
	.tab_line{
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #3B4456;
	}
}
</style>
