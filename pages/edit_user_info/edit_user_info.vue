<template>
	<view class="edit_container">
		<view class="flex_h_center_center">
			<view class="awatar_wrap flex_h_center_center">
				<image :src="cropFilePath" mode="" class="awatar"></image>
				<view class="avatar_mask flex_h_center_center" @click="upload">
					<image src="../../static/camera.png" mode="" class="camera_icon"></image>
				</view>
			</view>
			
		</view>
		<view class="flex_h_between_center padd_h_48 mt_80">
			<text class="fStyle32FFFFFFw600">{{i18n.nickName}}</text>
			<text class="fStyle227f7f7fW600">{{i18n.nickTips}}</text>
		</view>
		<view class="padd_h_48 nick_input_wrap mt_15">
			<input type="text" value="" v-model="nickName" />
		</view>
		
		<view class="flex_h_between_center padd_h_48 mt_55">
			<text class="fStyle32FFFFFFw600">{{i18n.profile}}</text>
			<text class="fStyle227f7f7fW600">{{i18n.profileTips}}</text>
		</view>
		<view class="padd_h_48 nick_richText_wrap mt_15">
			<textarea value="" placeholder="" v-model="desc" />
		</view>
		
		<view class="focus_btn flex_h_center_center" @click="modifyUserInfo">
			<text class="fStyle2242C4B3W600">Save</text>
		</view>
		<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
		<!-- <image :src="cropFilePath" mode="aspectFit" style="width: 100%;"></image> -->
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex';
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		computed: {
			...mapState(['userInfo']),
			i18n() {
				return this.$t('index')
			}
		},
		data() {
			return {
				nickName: '',
				desc: '',
				cropFilePath: '',
				tempFilePath: '',
				cropFileHash: ''
			};
		},
		components: {
			ImageCropper
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.editUserInfo
			});
			this.nickName = this.userInfo && this.userInfo.Name || '';
			this.desc = this.userInfo && this.userInfo.Desc;
			this.cropFilePath = (this.userInfo && this.userInfo.Avatar) == '' ? '': 'https://ipfs.io/ipfs/'+ (this.userInfo && this.userInfo.Avatar);
			this.cropFileHash = this.userInfo && this.userInfo.Avatar;
		},
		methods:{
			...mapMutations(['USER_INFO']),
			goto() {
				console.log('上传头像');
			},
			upload(){
				let self = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: (res) => {
						self.tempFilePath = res.tempFilePaths.shift();
				    }
				});
			},
			confirm(e) {
				let that = this;
				uni.uploadFile({
					url: that.$api.ipfsApiUrl()+'add?pin=false',
					files:[{
									uri: e.detail.tempFilePath
								}],
					success: (uploadFileRes) => {
						if(uploadFileRes.statusCode == 200){
							this.tempFilePath = ''
							let jsonStr = "["+((uploadFileRes.data.trim()).replace(/[\n\r]/g,','))+"]";
							let json = JSON.parse(jsonStr);
							for(var j = 0; j < json.length; j++){
								that.cropFileHash = json[j].Hash;
								let showImageUrl =  that.$api.ipfsResUrl() + json[j].Hash;
								that.cropFilePath= showImageUrl
								
							}
						}
						uni.hideLoading();
					}
				});
			    // this.tempFilePath = ''
			    // this.cropFilePath = e.detail.tempFilePath
			},
			cancel() {
			    console.log('canceled')
			},
			async modifyUserInfo(){
				// this.USER_INFO({
				// 	Name: 'test',
				// 	Desc: '我是描述'
				// });
				// uni.navigateBack({
					
				// })
				let params = {
					name: this.nickName,
					desc: this.desc,
					avatar: this.cropFileHash
				}
				let json = await this.$api.modifyselfInfo(params);
				if(json.code == 0){
					uni.showToast({
						title: this.i18n.modifyTips,
						icon: 'none'
					});
					
					this.USER_INFO({
						Name: this.nickName != '' ? this.nickName : this.userInfo.Name,
						Desc: this.desc != '' ? this.desc : this.userInfo.Desc ,
						Avatar: this.cropFileHash != '' ? this.cropFileHash : ''
					});
					// uni.setStorageSync('userInfo', params);
					uni.navigateBack({
						
					});
				} else {
					uni.showToast({
						title: json.msg,
						icon: 'none'
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.edit_container{
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;
		.awatar_wrap{
			// width: 162rpx;
			// height: 162rpx;
			// border-radius: 100%;
			position: relative;
			.awatar{
				width: 158rpx;
				height: 158rpx;
				border: 4rpx solid #FFFFFF;
				background-color: #ff0;
				border-radius: 100%;
			}
			.avatar_mask{
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				top: 0;
				border-radius: 100%;
				// border
				background-color: rgba(0,0,0,.5);
			}
		}
		.camera_icon{
			width: 40rpx;
			height: 40rpx;
		}
		.nick_input_wrap input{
			width: 100%;
			height: 113rpx;
			background-color: #1B202B;
			color: #FFFFFF;
			border-radius: 10rpx;
			padding-left: 18rpx;
			padding-right: 18rpx;
			box-sizing: border-box;
		}
		.nick_richText_wrap textarea{
			width: 100%;
			height: 233rpx;
			background-color: #1B202B;
			color: #FFFFFF;
			border-radius: 10rpx;
			padding-left: 18rpx;
			padding-right: 18rpx;
			box-sizing: border-box;
		}
		.focus_btn {
			padding: 17rpx 70rpx;
			border: 1px solid #43D09C;
			border-radius: 40rpx;
			margin-left: 60rpx;
			margin-right: 60rpx;
			margin-top: 60rpx
		}
	}
</style>
