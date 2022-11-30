<template>
	<view class="w-tweet-item_wrap padd_h_60" :style="{paddingTop: noMargin ? '0' : '60rpx'}">
		<view class="flex_h_between_center">
			<view class="flex1 flex_h_start_center" @click="gotoUserCenter(item && item.UserId)">
				<view class="avatar_wrap">
					<image :src="'https://ipfs.io/ipfs/'+item.UserInfo.Avatar" mode="" class="avatar"
						v-if="item && item.UserInfo && item.UserInfo.Avatar != ''"></image>
				</view>
				<view class="flex_v_center_start">
					<text
						class="fStyle34ffffffw800">{{item && item.UserInfo && item.UserInfo.Name || item.UserId.substring(46)}}</text>
					<text class="fStyle264E586E">{{item != null ? friendlyDate(item.CreatedAt) : ''}}</text>
				</view>
			</view>
			<slot></slot>
		</view>
		<view class="fStyle24ffffff htmlcontent" v-html="replaceStr(item && item.Content)" style="word-wrap:break-word; text-align: left; line-height: 1.8;">
			<!-- <text class="fStyle24ffffff lHeight_40">{{replaceStr(item && item.Content)}}</text> -->
		</view>
		<view class="swiper_wrap" v-if="imgUrls.length != 0 && !isVedio" @click="previewImg">
			<swiper :current="swipterIndex" @change="changeIndex" :indicator-dots="true" :circular="true"
				:autoplay="false" :interval="3000" :duration="1000" class="tweet_item_img_wrap"
				indicator-color="#ffffff" indicator-active-color="#DB2B2B">
				<swiper-item v-for="(item, index) in imgUrls" :key="index" class="tweet_item">
					<!-- <image :src="item" mode="aspectFill" lazy-load></image> -->
					<easy-loadimage mode="widthFix" :scroll-top="scrollTop" :image-src="item" class="tweet_item">
					</easy-loadimage>
				</swiper-item>
			</swiper>
			<view class="indicator flex_h_between_center">
				<text class="fStyle20ffffff">{{swipterIndex+1}}/{{imgUrls.length}}</text>
			</view>
		</view>
		<view class="vedio_wrap" v-if="imgUrls.length != 0 && isVedio">
			<video :src="imgUrls[0]" controls></video>
		</view>
		<w-trans-tweet-item v-if="item && item.OriginTwId != '' && transInfo != null " :item="transInfo"
			:scrollTop="scrollTop"></w-trans-tweet-item>
		<view class="flex_h_between_center mt_30">
			<view class="flex_h_start_center flex1">
				<image src="../../static/mine/like.png" mode="" class="like_icon"></image>
				<text class="fStyle30FFFFFF">124</text>
			</view>
			<view class="flex_h_center_center flex1" @click="repeatTweet">
				<image src="../../static/mine/trans.png" mode="" class="trans_icon"></image>
				<!-- <text class="fStyle30FFFFFF">124</text> -->
			</view>
			<view class="flex_h_end_center flex1">
				<image src="../../static/mine/commet.png" mode="" class="commet_icon"></image>
				<text class="fStyle30FFFFFF">124</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		friendlyDate
	} from '@/common/utils.js';
	import moment from 'moment';
	import WTransTweetItem from '../w-trans-tweet-item/w-trans-tweet-item.vue';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	export default {
		mixins: [friendlyDate],
		components: {
			WTransTweetItem,
			easyLoadimage
		},
		data() {
			return {
				imgUrls: [],
				opacity: 0,
				swipterIndex: 0,
				isVedio: false,
				transInfo: null,
			};
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		mounted() {
			this.dealImgs();
			if (this.item && this.item.OriginTwId != '') {
				this.getOriginTweet();
			}
		},
		props: {
			item: Object,
			noMargin: {
				type: Boolean,
				default: false
			},
			scrollTop: Number
		},

		methods: {
			dealImgs() {
				if (this.item != null && this.item.Attachment != null && this.item.Attachment != '') {
					this.imgUrls = this.item.Attachment.split(',');
				}
				for (var i = 0, len = this.imgUrls.length; i < len; i++) {
					if (/(http|https):\/\/([\w.]+\/?)\S*/.test(this.imgUrls[i])) {
						this.imgUrls[i].replace("https://wx1.sinaimg.cn/","https://cdn.ipfsscan.io/weibo/")
						this.imgUrls[i].replace("https://wx2.sinaimg.cn/","https://cdn.ipfsscan.io/weibo/")
						this.imgUrls[i].replace("https://wx3.sinaimg.cn/","https://cdn.ipfsscan.io/weibo/")
					} else {
						this.imgUrls[i] = this.$api.ipfsResUrl() + this.imgUrls[i];
					}
				}
				if (this.imgUrls.length == 1) {
					let regx = /(.swf|.avi|.flv|.mpg|.rm|.mov|.wav|.asf|.3gp|.mkv|.rmvb|.mp4)$/i;
					if (regx.test(this.imgUrls[0])) {
						this.isVedio = true;
					}
				}
			},
			async getOriginTweet() {
				let json = await this.$api.tweetDetail({
					id: this.item.OriginTwId
				});
				if (json.code == 0) {
					this.transInfo = json.data;
				}
			},
			gotoUserCenter(user) {
				uni.navigateTo({
					url: '/pages/usercenter/usercenter?userid=' + user
				})
			},
			changeIndex(e) {
				this.swipterIndex = e.detail.current || 0;
			},
			previewImg(item, index) {
				uni.setStorageSync("currentImgIndex", this.swipterIndex) // 当前下标
				uni.setStorageSync('imgPreviewPicList', this.imgUrls) // 当前数组
				uni.navigateTo({
					url: '/pages/preview_img/preview_img' // 要跳转的预览页
				})
			},
			repeatTweet() {
				console.log(this.item);
				if (this.item && this.item.OriginTwId == '') {
					uni.setStorageSync('tweetDtail', this.item) // 保存当前转发的推文
					uni.navigateTo({
						url: '/pages/repeat/repeat'
					})
				} else {
					uni.showToast({
						title: this.i18n.canotTrans,
						icon: 'none'
					})
				}
			},
			replaceStr(content) {
				if (content.length) {
					var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\%|\.|\/|&|-)+)/g;
					content = content.replace(reg, "<a href='$1$2'>$1$2</a>");
				}
				return content;
			}
		}
	}
</script>

<style lang="scss">
	/deep/ uni-swiper .uni-swiper-dots-horizontal {
		bottom: -15px;
	}

	/deep/ uni-swiper .uni-swiper-wrapper {
		height: 410rpx;
		overflow: visible;
	}

	/deep/ uni-swiper .uni-swiper-dot {
		width: 6rpx;
		height: 6rpx;
	}

	/deep/ uni-swiper .uni-swiper-dots-horizontal .uni-swiper-dot {
		margin-right: 8rpx;
	}

	/deep/ uni-video {
		width: 100%;
	}

	.w-tweet-item_wrap {
		border-bottom: 1rpx solid #3B4456;
		padding: 60rpx;
		padding-bottom: 50rpx;

		.avatar_wrap {
			width: 100rpx;
			height: 100rpx;
			margin-right: 30rpx;
			border-radius: 100%;

			background-color: #ff0;
		}

		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;

			background-color: #ff0;
		}


		.h_20 {
			width: 20rpx;
		}

		.v_20 {
			height: 20rpx;
		}

		.htmlcontent {
			white-space: pre-wrap; // 支持换行
			/deep/ a {
				color: #FFFFFF;
			}
		}

		.swiper_wrap {
			position: relative;

			.indicator {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				background-color: rgba(0, 0, 0, .6);
				padding: 3rpx 16rpx;
				border-radius: 50rpx;
				// text-align: center;
				// width: 40rpx;
				// vertical-align
			}
		}

		.vedio_wrap {
			border-radius: 20rpx;
			overflow: hidden;
			margin-top: 10rpx;

			// height: 450rpx;
			video {
				border-radius: 20rpx;
				overflow: hidden;
				// margin-top: 10rpx;
				height: 450rpx;
				// padd
			}
		}

		.tweet_item_img_wrap {
			border-radius: 20rpx;
			overflow: hidden;
			margin-top: 10rpx;
			height: 450rpx;

		}

		.uni-swiper-dots-horizontal {
			bottom: -10px;
		}

		.tweet_item_img_wrap .tweet_item {
			width: 100%;
			height: 410rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			display: block;

			image {
				width: 100%;
				height: 450rpx;
			}
		}

		.tweet_item_img_wrap .half_img {
			width: 100%;
			height: 195rpx;
			background-color: #FFFFFF;
		}

		.like_icon {
			width: 34rpx;
			height: 28rpx;
			margin-right: 13rpx;
		}

		.commet_icon,
		.trans_icon {
			width: 33rpx;
			height: 33rpx;
			margin-right: 13rpx;
		}

	}
</style>
