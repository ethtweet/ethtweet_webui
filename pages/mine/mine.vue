<template>
	<view class="usercenter-container" @click="cancelBubble">
		<view class="linear_wrap padd_h_48">
			<uni-status-bar />
			<view class="flex_h_end_start padd_top_30">
				<image src="../../static/mine/share.png" mode="" class="share_icon" @click.stop="copyAddr"></image>
				<image src="../../static/setting.png" mode="" class="setting_icon" @click.stop="goSetting"></image>
			</view>
			<view class="mt_55 ml_190">
				<text class="fStyle44ffffffw800">{{userInfo && userInfo.Name || ''}}</text>
			</view>
			<view class="position_avatar">
				<image :src="'https://ipfs.io/ipfs/'+userInfo.Avatar" mode="" v-if="userInfo.Avatar != ''"></image>
			</view>
		</view>
		<view class="ml_190 padd_h_48">
			<text class="fStyle26ffffff">{{userInfo && userInfo.Desc || i18n.noProfile}}</text>
		</view>
		<view class="flex_h_between_center padd_h_48 mt_80">
			<view class="flex_v_center_center" @click="goFollowList">
				<text class="fStyle26C4C4C4">{{i18n.focus}}</text>
			</view>
			<view class="flex_v_center_center" @click="goRepeactList">
				<!-- <text class="fStyle34ffffffw800">1312</text> -->
				<text class="fStyle26C4C4C4">@Mine</text>
			</view>
			<view class="focus_btn flex_h_between_center" @click="gotoEdit">
				<text class="fStyle2242C4B3W600">{{i18n.editUserInfo}}</text>
			</view>
		</view>
		<view class="flex_h_center_center padd_h_48 mt_30" v-if="(userInfo) != null">
			<view class="address_wrap flex_v_center_center">
				<view class="flex_h_center_center" style="width: 100%;">
					<image src="../../static/eth_icon.png" mode="" class="eth_icon"></image>
					<view class="flex1 ellipse" style="color: #FFFFFF">
						<text class="fStyle30FFFFFFw900 ">ETH {{balance}}</text>
					</view>
					<image src="../../static/mine/qrcode.png" mode="" class="qrcode_icon" @click="showQrcode"></image>
					<image src="../../static/mine/copy.png" mode="" class="copy_icon" @click="copyUserId(userInfo.Id)">
					</image>
				</view>
				<view class="address_wrap_text ellipse" style="color: #FFFFFF;">
					<text class="fStyle26505C75">{{userInfo.Id || ''}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="flex_h_center_center padd_h_48 mt_30" v-if="(userInfo) != null">
			<view class="address_wrap flex_h_center_center">
				<image src="../../static/mine/wallet.png" mode="" class="wallet_icon"></image>
				<view class="flex1 address_wrap_text ellipse">
					<text class="fStyle26ffffff ">{{userInfo && userInfo.Id || ''}}</text>
				</view>
				<image src="../../static/mine/qrcode.png" mode="" class="qrcode_icon" @click="showQrcode"></image>
				<image src="../../static/mine/copy.png" mode="" class="copy_icon" @click="copyUserId(userInfo.Id)">
				</image>
			</view>
		</view> -->
		<view class="" v-if="list.length > 0">
			<w-tweet-item v-for="(item, index) in list" :key="index" :item="item" :scrollTop="scrollTop">
				<view class="more_wrap" @click="deleteTweet">
					<image src="../../static/delete_icon.png" mode=""></image>
				</view>
			</w-tweet-item>
		</view>
		<view class="flex_h_center_center mt_80" v-if="list.length == 0">
			<image src="../../static/no_data.png" mode="" class="no_data"></image>
		</view>

		<uni-load-more v-if="!(list.length == 0)" :status="loadStatus"
			:contentText="{contentdown: i18n.contentdown, contentrefresh: i18n.contentrefresh, contentnomore: i18n.contentnomore }">
		</uni-load-more>
		<w-bubble ref="bubble"></w-bubble>
		<view class="layer flex_h_center_center" v-show="showQrcodeModel" @click="showQrcodeModel= false">
			<view class="layer_content flex_v_center_center" @click.stop>
				<view class="layer_content_main flex_v_center_center">
					<text class="fStyle26B4BCCB">Scan QRCode</text>
					<ayQrcode ref="qrcode" :modal="modal_qr" :url="userInfo &&  userInfo.Id " @hideQrcode="hideQrcode" :height="160"
						:width="160" class="mt_55" />
					<view style="width: 80%;" class="mt_55">
						<text class=" fStyle26344463"
							style="word-wrap:break-word; text-align: center; line-height: 1;">{{userInfo &&  userInfo.Id || ''}}</text>
					</view>
				</view>
				<view class="wallet_btn flex_h_center_center" @click="copyUserId(userInfo.Id)">
					<text class="fStyle22B4BCCBW500">copy wallet address</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import WBubble from '../../components/w-bubble/w-bubble.vue';
	import {
		h5Copy
	} from '@/common/utils.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	import Big from 'big.js'
	export default {
		components: {
			WBubble,
			ayQrcode
		},

		mixins: [h5Copy],
		data() {
			return {
				userId: '',
				list: [],
				page: 1,
				pagesize: 15,
				nodata: false,
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
				latestCid: '',
				qrCodeImg: '',
				showQrcodeModel: false,
				modal_qr: false,
				scrollTop: 0,
				balance: 0
				// url: 'https://pixabay.com/images/search/?order=ec', // 
			};
		},
		onReachBottom() { //上拉触底函数
			if (this.isIpfsModel) {
				if (!this.isLoadMore) {
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
		async onPullDownRefresh() {
			this.isLoadMore = true
			this.page = 1
			await this.getList();
			uni.stopPullDownRefresh();
		},
		onPageScroll({scrollTop}) {
			this.scrollTop = scrollTop;
		},
		onLoad(params) {
			this.getUserInfo();
			
		},
		computed: {
			...mapState(['userInfo', 'ipfsMode']),
			i18n() {
				return this.$t('index')
			}
		},
		watch: {
			userInfo: {
				handler: function(props) {
					console.log('我是修改wathc');
					console.log(props);
					// this.getUserSelf();
				},
				deep: true
			},
			ipfsMode: {
				handler: function(props) {
					console.log('我是修改wathc233');
					console.log(props);
					// this.getUserSelf();
				},
			}
		},
		methods: {
			...mapMutations(['USER_INFO']),
			copyAddr() {
				const origin = (window.location.href || '').split('#')[0]
				this.h5Copy(origin + '#/pages/usercenter/usercenter?userid=' + this.userInfo.Id + '&ipfsMode=1');
				uni.showToast({
					title: this.i18n.copySuccess,
					icon: 'none'
				});

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
			cancelBubble() {
				if (this.$refs.bubble) {
					if (this.$refs.bubble.opacity == 1) {
						this.$refs.bubble.hideBobble();
					}
				}
			},
			deleteTweet() {
				// 删除当前推文
			},
			async getUserInfo() {
				let json = await this.$api.myselfInfo();
				if (json.code == 0) {
					this.USER_INFO(json.data);
					if (this.ipfsMode) {
						this.getIpfsList(json.data.LatestCid);
					} else {
						this.getList();
					}
					this.getBalance();
				}
			},
			async getList() {
				let json = await this.$api.userTweetList({
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
			async getIpfsList(previousCid) {
				while (this.pagesize > 0 && this.loadStatus != 'nomore') {
					let jsonStr = await this.$api.ipfsTweetDetail(previousCid);
					this.list.push(jsonStr);
					this.pagesize--;
					if (jsonStr.Nonce != 0) {
						console.log(jsonStr.Nonce);
						this.latestCid = jsonStr.PreviousCid;
						await this.getIpfsList(jsonStr.PreviousCid);
					} else {
						this.loadStatus = 'nomore';
						this.isLoadMore = true;
					}
				}
				if (this.loadStatus != 'nomore') {
					this.isLoadMore = false;
				}
			},
			async getBalance() {
				let json = await this.$api.getBalanceof(this.userInfo.Id);
				if(json.status == 1){
					this.balance = Big(json.result).div(Big(Math.pow(10, 18))).toFixed()
				} else {
					this.balance = '0.00'
				}
			},
			goSetting() {
				uni.navigateTo({
					url: '/pages/setting/setting'
				});
			},
			goFollowList() {
				uni.navigateTo({
					url: '/pages/userlist/userlist?type=myFocusList&userid=' + this.userInfo.Id
				});
			},
			goRepeactList() {
				uni.navigateTo({
					url: '/pages/repeact_list/repeact_list'
				});
			},
			gotoEdit() {
				uni.navigateTo({
					url: '/pages/edit_user_info/edit_user_info'
				})
			}
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

				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 160rpx;
					background-color: #ff0;
				}
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

		.more_wrap {
			position: relative;

			image {
				width: 40rpx;
				height: 40rpx;
			}

		}

		.no_data {
			width: 160rpx;
			height: 146rpx;
		}

		.back_icon {
			width: 36rpx;
			height: 32rpx;
		}

		.share_icon,
		.setting_icon {
			width: 40rpx;
			height: 40rpx;
		}

		.share_icon {
			margin-right: 30rpx;
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
				// width: 80%;
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
