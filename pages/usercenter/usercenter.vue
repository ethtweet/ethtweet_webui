<template>
	<view class="usercenter-container" @click="cancelBubble">
		<view class="linear_wrap padd_h_48">
			<uni-status-bar />
			<view class="flex_h_between_center padd_top_30">
				<image src="../../static/arrow.png" mode="" class="back_icon" @click="goBack"></image>
				<image src="../../static/v_more.png" mode="" class="v_more_icon" @click.stop="showMore"></image>
			</view>
			<view class="mt_55 ml_190">
				<text class="fStyle44ffffffw800">{{userInfo && userInfo.Name || '-'}}</text>
			</view>
			<view class="position_avatar">
			</view>
		</view>
		<view class="ml_190 padd_h_48">
			<text class="fStyle26ffffff">{{userInfo && userInfo.Desc || i18n.noProfile}}</text>
		</view>
		<view class="flex_h_between_center padd_h_48 mt_80">
			<view class="flex_v_center_center" @click="goFollowList">
				<!-- <text class="fStyle34ffffffw800">128</text> -->
				<text class="fStyle26C4C4C4">{{i18n.focus}}</text>
			</view>
			<!-- <view class="flex_v_center_center" style="margin-left: 30rpx">
				<text class="fStyle34ffffffw800">1312</text>
				<text class="fStyle26C4C4C4">{{i18n.friend}}</text>
			</view> -->
			<view class="focus_btn flex_h_between_center" v-if="followed == 0 && !isIpfsModel" @click="follow">
				<text class="fStyle2242C4B3W600" >+{{i18n.focus}}</text>
			</view>
			<view class="focusing_btn flex_h_between_center" v-else-if="!isIpfsModel" @click="cancelFollow">
				<text class="fStyle22FFFFFFW600" >{{i18n.focusing}}</text>
			</view>
			<view class="flex1" v-else>
				
			</view>
		</view>
		<view class="flex_h_center_center padd_h_48 mt_30" v-if="userId != ''">
			<view class="address_wrap flex_v_center_center">
				<view class="flex_h_center_center" style="width: 100%;">
					<image src="../../static/eth_icon.png" mode="" class="eth_icon"></image>
					<view class="flex1 ellipse" style="color: #FFFFFF">
						<text class="fStyle30FFFFFFw900 ">ETH {{balance}}</text>
					</view>
					<image src="../../static/mine/qrcode.png" mode="" class="qrcode_icon" @click="showQrcode"></image>
					<image src="../../static/mine/copy.png" mode="" class="copy_icon" @click="copyUserId(userId)">
					</image>
				</view>
				<view class="address_wrap_text ellipse" style="color: #FFFFFF;">
					<text class="fStyle26505C75">{{userId || ''}}</text>
				</view>
			</view>
		</view>
		<view class="">
			<w-tweet-item v-for="(item, index) in list" :key="index" :item="item" :scrollTop="scrollTop">
				<!-- <view class="more_wrap" @click="showBubble">
					<image src="../../static/home/more_icon.png" mode=""></image>
				</view> -->
			</w-tweet-item>
		</view>

		<uni-load-more :status="loadStatus"
			:contentText="{contentdown: i18n.contentdown, contentrefresh: i18n.contentrefresh, contentnomore: i18n.contentnomore }">
		</uni-load-more>
		<view class="download_wrap flex_h_center_center" v-if="isH5">
			<view class="download_btn flex_h_center_center">
				<image src="../../static/logo.png" mode="" class="logo_img"></image>
				<text class="fStyle30FFFFFFw600">Download EthTweet</text>
			</view>
		</view>
		<w-bubble ref="bubble"></w-bubble>
		<view class="layer flex_h_center_center" v-show="showQrcodeModel" @click="showQrcodeModel= false">
			<view class="layer_content flex_v_center_center" @click.stop>
				<view class="layer_content_main flex_v_center_center">
					<text class="fStyle26B4BCCB">Scan QRCode</text>
					<ayQrcode ref="qrcode" :modal="modal_qr" :url="userId" @hideQrcode="hideQrcode" :height="160"
						:width="160" class="mt_55" />
					<view style="width: 80%;" class="mt_55">
						<text class=" fStyle26344463"
							style="word-wrap:break-word; text-align: center; line-height: 1;">{{userId|| ''}}</text>
					</view>
				</view>
				<view class="wallet_btn flex_h_center_center" @click="copyUserId(userId)">
					<text class="fStyle22B4BCCBW500">copy wallet address</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import WBubble from '../../components/w-bubble/w-bubble.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		h5Copy
	} from '@/common/utils.js';
	import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	import Big from 'big.js'
	export default {
		components: {
			WBubble,
			ayQrcode
		},
		mixins: [h5Copy],
		computed: {
			...mapState(['ipfsMode']),
			i18n() {
				return this.$t('index')
			}
		},
	
		onPageScroll({scrollTop}) {
			this.scrollTop = scrollTop;
		},
		data() {
			return {
				userId: '',
				userInfo: null,
				list: [],
				page: 1,
				pagesize: 15,
				nodata: false,
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
				isIpfsModel: false,
				latestCid: '',
				followed: false,
				isH5: false,
				showQrcodeModel: false,
				modal_qr: false,
				scrollTop: 0,
				balance: 0.00
			};
		},
		onReachBottom() { //上拉触底函数
			if(this.isIpfsModel){
				if(this.isH5){
					return;
				}
				if(!this.isLoadMore){
					this.isLoadMore = true
					this.pagesize = 15;
					this.getIpfsList(this.latestCid);
				}
			} else {
				if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.page += 1
					this.getList()
				}
			}
			
		},
		onLoad(params) {
			this.userId = params.userid;
			this.isIpfsModel = params.ipfsMode == 1 ? true : false;
			this.isH5 = params.ipfsMode == 1 ? true : false;
			if(this.isIpfsModel){
				this.getIpfsUserInfo();
			} else {
				this.getUserInfo();
				this.getUserFollowState();
			}
			this.getBalance();
		},
		methods: {
			cancelBubble() {
				if (this.$refs.bubble) {
					if (this.$refs.bubble.opacity == 1) {
						this.$refs.bubble.hideBobble();
					}
				}
			},
			
			copyUserId(id) {
				this.h5Copy(id);
				uni.showToast({
					title: this.i18n.copySuccess,
					icon: 'none'
				});
			},
			
			// 展示二维码
			showQrcode() {
				let _this = this;
				this.modal_qr = true;
				setTimeout(function() {
					_this.$refs.qrcode.crtQrCode()
				}, 50)
				this.showQrcodeModel = true;
			},
			async getUserInfo() {
				let json = await this.$api.userInfo(this.userId);
				if (json.code == 0) {
					this.userInfo = json.data;
					// if(this.isIpfsModel){
					// 	this.getIpfsList(json.data.LatestCid);
					// } else {
						this.getList();
					// }
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
			},
			async getBalance() {
				let json = await this.$api.getBalanceof(this.userId);
				if(json.status == 1){
					this.balance = Big(json.result).div(Big(Math.pow(10, 18))).toFixed()
				} else {
					this.balance = '0.00'
				}
			},
			async getIpfsUserInfo() {
				let json = await this.$api.ipfsMyselfInfo(this.userId);
				if (json.code == 0) {
					this.userInfo = json.data;
					// if (this.ipfsMode) {
						this.getIpfsList(json.data.LatestCid);
					// } else {
					// 	this.getList();
					// }
				}
			},
			async getUserFollowState(){
				let json = await this.$api.followStatus(this.userId);
				if (json.code == 0) {
					this.followed = json.data.State;
				}
			},
			async getIpfsList(previousCid){
				while(this.pagesize > 0 && this.loadStatus != 'nomore'){
					let jsonStr = await this.$api.ipfsTweetDetail(previousCid);
					this.list.push(jsonStr);
					if(jsonStr.Nonce != 0 && jsonStr.PreviousCid != ''){
						console.log(jsonStr.Nonce);
						this.pagesize--;
						this.latestCid = jsonStr.PreviousCid;
						await this.getIpfsList(jsonStr.PreviousCid);
					} else {
						this.loadStatus = 'nomore';
						this.isLoadMore = true;
					}
				}
				if(this.loadStatus != 'nomore'){
					this.isLoadMore = false;
				}
			},
			async getList() {
				let json = await this.$api.personTweetList({
					id: this.userId,
					page: this.page
				});
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
			async follow() {
				if(this.userInfo == null){
					return;
				}
				let json = await this.$api.follow({
					id: this.userId
				});
				if (json.code == 0) {
					this.followed = 1;
					uni.showToast({
						title: this.i18n.followTips,
						icon: 'none'
					})
					this.getUserInfo();
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
			},
			async cancelFollow() {
				let json = await this.$api.cancelFollow({
					id: this.userId
				});
				if (json.code == 0) {
					this.followed = 0;
					uni.showToast({
						title: this.i18n.unfollowTips,
						icon: 'none'
					})
					this.getUserInfo();
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
			},
			goBack() {
				uni.navigateBack();
			},
			showMore(e) {
				this.$refs.bubble.setHeight(e.detail.x, e.detail.y);
			},
			goFollowList(){
				uni.navigateTo({
					url: '/pages/userlist/userlist?type=myFocusList&userid='+this.userId
				});
			},
		}

	}
</script>

<style lang="scss">
	.usercenter-container {
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;
		position: relative;
		.linear_wrap {
			background: linear-gradient(225deg, #1BACAA 0%, #325AB6 100%);
			position: relative;

			.position_avatar {
				width: 160rpx;
				height: 160rpx;
				position: absolute;
				bottom: -80rpx;
				background-color: #ff0;
				border: 2rpx solid #FFFFFF;
				left: 48rpx;
				border-radius: 160rpx;
			}
		}

		.more_wrap {
			position: relative;

			image {
				width: 40rpx;
				height: 10rpx;
			}

		}

		.back_icon {
			width: 36rpx;
			height: 32rpx;
		}

		.v_more_icon {
			width: 10rpx;
			height: 40rpx;
		}

		.focus_btn {
			padding: 17rpx 70rpx;
			border: 1px solid #43D09C;
			border-radius: 40rpx;
		}

		.focusing_btn {
			border-radius: 40rpx;
			padding: 17rpx 70rpx;
			background: linear-gradient(137deg, #43D09C 0%, #3FA5F0 100%);
		}
		.download_wrap{
			height: 140rpx;
			background-color: rgba($color: #ffffff, $alpha: 0.2);
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			.download_btn{
				.logo_img{
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
					border-radius: 10rpx;
				}
				border-radius: 40rpx;
				padding: 17rpx 70rpx;
				background: linear-gradient(137deg, #43D09C 0%, #3FA5F0 100%);
			}
		}
		.address_wrap {
			background-color: #2F3646;
			border-radius: 20rpx;
			padding: 40rpx 35rpx;
			// padding-left: 65rpx;
			// padding-right: 65rpx;
			// padding-top: 15rpx;
			// padding-bottom: 15rpx;
			box-sizing: border-box;
			width: 100%;
		
			.address_wrap_text {
				// color: #FFFFFF
				background-color: #2A303D;
				border-radius: 50rpx;
				padding: 13rpx 30rpx;
				box-sizing: border-box;
				width: 100%;
				margin-top: 16rpx;
			}
		
			.eth_icon {
				width: 24rpx;
				height: 42rpx;
				margin-right: 15rpx;
			}
		
			.qrcode_icon {
				width: 31rpx;
				height: 31rpx;
				margin-left: 50rpx;
			}
		
			.copy_icon {
				width: 31rpx;
				height: 31rpx;
				margin-left: 50rpx;
			}
		}
		.layer {
			position: fixed;
			// left: 0;
			// right: 0;
			width: 100%;
			max-width: 1000rpx;
			top: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, .6);
		
			.layer_content {
				width: 80%;
				border-radius: 24rpx;
				overflow: hidden;
			}
		
			.layer_content_main {
				background-color: #FFFFFF;
				padding: 60rpx;
				width: 100%;
		
				.qrcode {
					width: 180px;
					height: 180px;
				}
			}
		
			.wallet_btn {
				background: #242A37;
				padding-top: 43rpx;
				padding-bottom: 43rpx;
				width: 100%;
			}
		}
	}
</style>
