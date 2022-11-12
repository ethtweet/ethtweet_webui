<template>
	<view class="repeat_container">
		<uni-status-bar />
		 <view class="flex_h_between_center padd_h_48" style="padding-top: 10px;">
			<text class="fStyle3042C4B3w600" @click="cancel">{{i18n.cancel}}</text>
			<view class="publish_btn flex_h_center_center">
				<text class="fStyle30FFFFFFw600" @click="publish">{{i18n.publish}}</text>
			</view>
			
		</view>
		<view class="padd_h_48 flex_h_center_start mt_30 flex1">
			<view class="avatar_wrap">
				<image :src="'https://ipfs.io/ipfs/'+userInfo.Avatar" mode="" class="avatar"  v-if="userInfo.Avatar != ''"></image>
			</view>
			<view class="flex1">
				<textarea value="" :placeholder="i18n.sharePlaceholder" placeholder-class="fStyle30505C75w600 texetare" focus="true" @focus="focus" @blur="footerBottom = 50" v-model="content" style="color: #FFFFFF"/>
			</view>
		</view> 
		<!-- <scroll-view scroll-x="true" class="images_list padd_h_48" v-if="imageUrl.length != 0">
			<view class="image_wrap" v-for="(item, index) in imageUrl" :key="index">
				<image :src="item" mode="" class="img" mode="aspectFill"></image>
				<image src="../../static/publish/delete_icon.png" mode="" class="delete_btn" @click="deleteImg(index)"></image>
			</view>
		</scroll-view>
		<view class="padd_h_48 footer flex_h_start_center" :style="{bottom:footerBottom+'px'}">
			<image src="../../static/publish/upload_icon.png" class="upload_icon" mode="" @click="uploadImage"></image>
			<image src="../../static/publish/vedio.png" mode="" class="vedio_icon" @click="uploadVedio"></image>
			
		</view>-->
		<view class="padd_h_48">
			<w-trans-tweet-item :item="followDetail"></w-trans-tweet-item>
		</view>
		
	</view>
</template>

<script>
	import WTransTweetItem from '../../components/w-trans-tweet-item/w-trans-tweet-item.vue'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			WTransTweetItem
		},
		data() {
			return {
				/* #ifdef APP-PLUS */
				footerBottom: 0,
				/* #endif */
				/* #ifndef APP-PLUS */
				footerBottom: 50,
				/* #endif */
				content: '',
				imageUrl: [],
				hasVedio: false,
				submiting: false,
				followDetail: null
			};
		},
		computed: {
			...mapState(['userInfo']),
		    i18n () {  
		      return this.$t('index')
		    }  
		  },
		onLoad() {
		 	this.getItemDetail();
		 },
		methods:{
			getItemDetail() {
				this.followDetail = uni.getStorageSync("tweetDtail");
			},
			async publish() {
				if(this.submiting){
					return;
				}
				if(this.content == ''){
					uni.showToast({
						title: this.i18n.shareToast,
						icon: 'none'
					})
				}
				let params = {
					"forward_id": this.followDetail.Id,
					"content": this.content,
				};
				// if(this.imageUrl.length > 0) {
				// 	let attachmentStr = this.imageUrl.join(',');
				// 	Object.assign(params,{attachment: attachmentStr});
				// }
				this.submiting = true;
				uni.showLoading({title: this.i18n.publishing , mask:true})
				let json = await this.$api.publishTweet(params);
				if(json.code == 0) {
					uni.showToast({
						title: this.i18n.publishSuccess,
						icon: 'none'
					})
					this.content = '';
					uni.switchTab({
						url:'/pages/mine/mine'
					})
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
				this.submiting = false;
				uni.hideLoading();
				
			},
			
			
			/// 发布推文逻辑，后面可能有用
			uploadImage() {
				let that = this;
				uni.chooseImage({
				    count: 9, //默认9
				    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				    success: function (res) {
						let files = [];
						if(res.tempFilePaths.length > 9){
							uni.showToast({
								title: this.i18n.imagesMaxToast
							});
							return;
						} else {
							for(var i = 0; i < res.tempFilePaths.length; i++){
								files.push({
									name: res.tempFiles[i].name,
									uri: res.tempFilePaths[i]
								});
							}
							// 用于测试
							// let jsonStr = `{"Name":"WechatIMG33.jpeg","Hash":"QmcKjuvCXgyeUKnSMappmciAZmiVeiK79zUJpTYQsdn1Mj","Size":"97963"}
							// {"Name":"WechatIMG34.jpeg","Hash":"QmawcWdHnLUB75DJ3P2GkwH4rtQ1F7pi47Vc5417sjiD43","Size":"146581"}
							// {"Name":"WechatIMG35.jpeg","Hash":"QmQvKKpRLyMbCWZNHisWEEVyGVeXroZEfBaMQDoAsahGY8","Size":"128842"}
							// {"Name":"WechatIMG36.jpeg","Hash":"QmWoV1uwkyu5VF4TrcQ9wkxqQXjAtfa1qbXYScweuE89Kr","Size":"83752"}
							// {"Name":"WechatIMG37.jpeg","Hash":"Qmb1EBk9pYoEEMQ2okXXttLTtfB1XZdY2TQigeqdNrc8tL","Size":"137597"}
							// {"Name":"WechatIMG38.jpeg","Hash":"QmV2FkbmmabSxDkqxpzeZkdYKL5JgWorZXgP6QakAHcH7m","Size":"86834"}
							// {"Name":"WechatIMG39.jpeg","Hash":"QmYDBNFjHPQenBZuHy2qgCnpDZSTto8PAhxUgGJShbLwkw","Size":"228943"}
							// {"Name":"WechatIMG40.jpeg","Hash":"QmSot5dXdq5RW6E8mCnf8Ch9S8QHvQTtPR1zwPFBGU47AR","Size":"172873"}
							// {"Name":"WechatIMG41.jpeg","Hash":"QmWb5DuVpeAEJUcPw1muEds1HS9Gy42fwQeyKCVgFP4Awi","Size":"239594"}`
							// 			 jsonStr = "["+((jsonStr.trim()).replace(/[\n\r]/g,','))+"]";
									
										
							// 			console.log(jsonStr);
							// 			let json = JSON.parse(jsonStr);
							// 			for(var j = 0; j < json.length; j++){
							// 				let imgUrl = that.$api.ipfsResUrl() + json[j].Hash +"?filename="+json[j].Name;
							// 				if(that.hasVedio){
							// 					that.imageUrl=[imgUrl];
							// 				} else {
							// 					that.imageUrl.push(imgUrl);
							// 				}		
							// 			}
							// 			console.log(that.imageUrl);
							// 用于测试 -end
			
							uni.showLoading({title: that.i18n.uploading , mask:true})
							uni.uploadFile({
								url: that.$api.ipfsApiUrl()+'add?pin=false',
								files:files,
								success: (uploadFileRes) => {
									if(uploadFileRes.statusCode == 200){
										let jsonStr = "["+((uploadFileRes.data.trim()).replace(/[\n\r]/g,','))+"]";
										let json = JSON.parse(jsonStr);
										for(var j = 0; j < json.length; j++){
											let imgUrl = that.$api.ipfsResUrl() + json[j].Hash +"?filename="+json[j].Name;
														that.imageUrl.push(imgUrl);
										}
									}
									uni.hideLoading();
								}
							});
						}
						
			// 			const tempFilePaths = res.tempFilePaths;
							
				
						
				    }
				});
			},
			uploadVedio() {
				// 视频资源 QmbH6PhV4YrTtsW74W8xUckWCpxz8z2paQ5QoQYWaLsJeX
				let that = this;
				uni.chooseVideo({
					maxDuration:60,
				    success: function (res) {
						uni.showLoading({title:that.i18n.uploading, mask:true})
						uni.uploadFile({
							url: that.$api.ipfsApiUrl()+'add?pin=false',
							files:[{
								name: res.name,
								uri: res.tempFilePath
							}],
							success: (uploadFileRes) => {
								if(uploadFileRes.statusCode == 200){
									// TODO：这里可能有问题，现有接口问题
									let jsonStr = "["+((uploadFileRes.data.trim()).replace(/[\n\r]/g,','))+"]";
									let json = JSON.parse(jsonStr);
									for(var j = 0; j < json.length; j++){
										let imgUrl = that.$api.ipfsResUrl() + json[j].Hash +"?filename="+json[j].Name;
										that.imageUrl = [imgUrl];
										that.hasVedio = true;
									}
								}
								uni.hideLoading();
							}
						});
				    }
				});
			},
			deleteImg(index) {
				this.imageUrl.splice(index, 1);
			},
			cancel(){
				uni.navigateBack({
					
				})
			},
			focus(e){
				// console.log()
				if(e.detail.height){
					this.footerBottom = (e.detail.height - 50) || 0;
				} else {
					/* #ifndef APP-PLUS */
						this.footerBottom = 50;
					/* #endif */
					/* #ifdef APP-PLUS */
						this.footerBottom = 0;
					/* #endif */
				}
				
			}
		}
	}
</script>

<style lang="scss">
	/deep/ uni-textarea{
		width: 100%;
	}
.repeat_container{
	min-height: 100%;
	position: relative;
		background-color: $uni-bg-color;
		.publish_btn{
			background-image: url(../../static/publish/repeat_btn_bg.png);
			width: 160rpx;
			height: 62rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			text-align: center;
		}
		.avatar_wrap{
			width: 50rpx;
			height: 50rpx;
			margin-right: 30rpx;
			border-radius: 100%;
			background-color: #ff0;
		}
		.avatar{
			width: 50rpx;
			height: 50rpx;
			margin-right: 30rpx;
			border-radius: 100%;
			background-color: #ff0;
			display: block;
		}
		.texetare{
			width: 100%;
		}
		.footer{
			position: fixed;
			// bottom: 56px;
			width: 100%;
			height: 96rpx;
			background-color: #FFFFFF;
			left: 0px;
			right: 0px;
			box-sizing: border-box;
			.upload_icon{
				width: 33rpx;
				height: 33rpx;
				margin-right: 100rpx;
				display: inline-block;
			}
			.vedio_icon{
				width: 40rpx;
				height: 33rpx;
				display: inline-block;
			}
		}
		.images_list{
			width: 100%;
			overflow: hidden;
			        white-space: nowrap;
		}
		.image_wrap{
			position: relative;
			width: 200rpx;
			height: 200rpx;
			margin-right: 20rpx;
			display: inline-block;
			.img{
				width: 200rpx;
				height: 200rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
			}
			.delete_btn{
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: 17rpx;
				top: 17rpx
			}
		}
}
</style>
