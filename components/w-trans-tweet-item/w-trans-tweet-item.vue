<template>
	<view class="transTweet_wrap mt_30" @click="gotoOneTweet">
		<view class="flex1 flex_h_start_center" @click="gotoUserCenter(item && item.UserId)">
			<view class="transTweet_avatar_wrap">
				<image :src="'https://ipfs.io/ipfs/'+item.UserInfo.Avatar" mode="" class="avatar" v-if="item && item.UserInfo && item.UserInfo.Avatar != ''"></image>
			</view>
			
			<view class="flex_v_center_start">
				<text class="fStyle34ffffffw800">{{item && item.UserInfo && item.UserInfo.Name || item.UserId.substring(46)}}</text>
			</view>
		</view>
		<view class="flex_h_start_center mt_30">
			<view class="transTweet_image" v-if="imgUrls.length > 0 && !this.isVedio">
				<!-- <image :src="imgUrls[0]" mode="aspectFit"></image> -->
				<easy-loadimage mode="widthFix"
				                :scroll-top="scrollTop"
				                :image-src="imgUrls[0]" class="tweet_item"></easy-loadimage>
			</view>
			<view class="transTweet_image flex_h_center_center" v-if="imgUrls.length > 0 && this.isVedio">
				<image src="../../static/play.png" class="play_icon"></image>
			</view>
			<view class="fStyle24ffffff htmlcontent" v-html="replaceStr(item && item.Content)" style="word-wrap:break-word; text-align: left; line-height: 1.8;"></view>
			<!-- <text class="fStyle24ffffff" >{{item && item.Content}}</text> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrls: [],
				isVedio: false,
			};
		},
		props:{
			item: Object,
			scrollTop: Number,
		},
		mounted() {
			if(this.item){
				this.dealImgs();
			}
		},
		methods:{
			dealImgs() {
				if (this.item.Attachment != null && this.item.Attachment != '') {
					this.imgUrls = this.item.Attachment.split(',');
				}
				for(var i = 0, len = this.imgUrls.length; i < len; i++){
					if(/(http|https):\/\/([\w.]+\/?)\S*/.test(this.imgUrls[i])){
					
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
			gotoUserCenter(user) {
				uni.navigateTo({
					url: '/pages/usercenter/usercenter?userid=' + user
				})
				console.log(this.$api.ipfsResUrl() + user);
			},
			gotoOneTweet() {
				uni.navigateTo({
					url:'/pages/one_tweet/one_tweet?id='+this.item.Id
				})
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
	.transTweet_wrap {
		border: 1px solid #3F4A61;
		border-radius: 20rpx;
		padding: 30rpx 25rpx;
		.transTweet_avatar_wrap{
			width: 50rpx;
			height: 50rpx;
			border-radius: 100%;
			margin-right: 15rpx;
			background-color: #ff0;
		}
		.transTweet_avatar {
			width: 50rpx;
			height: 50rpx;
			border-radius: 100%;
			background-color: #ff0;
		}
		

		.transTweet_image image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			// margin-right: 20rpx;
		}
		.transTweet_image{
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-right: 20rpx;
		}
		.transTweet_image .play_icon{
			width: 50rpx;
			height: 50rpx;
		}
		.htmlcontent {
			/deep/ a {
				color: #FFFFFF;
			}
		}
	}
</style>
