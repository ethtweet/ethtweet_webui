<template>
	<view class="previewImg_container">
		<view class="previewImg">
			<view class="mask">
				<swiper @change="changeSwiper" class="my_swiper" :current="current" :circular="circular" :indicator-dots="indicatorDots"
				 :autoplay="autoplay" :duration="duration">
					<swiper-item v-for="(x, y) in picList" :key="y">
						<!-- <view class="bg_img" :style="{ backgroundImage: 'url('+x+')'}"> -->
						<view class="bg_img flex_h_center_center">
							<image :src="x" mode="aspectFit"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="page" v-if="picList.length>0">{{ current + 1 }} / {{ picList.length }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				picList: [],
				indicatorDots: false,
				autoplay: false,
				duration: 500,
				circular: true,
				current: 0,
				isShowSwiper: false
			};
		},
		onLoad() {
			this.picListInit();
		},
		methods: {
			clickPic(index) {
				this.current = index;
				this.isShowSwiper = true;
			},
			async picListInit() {
				this.current = uni.getStorageSync("currentImgIndex");
				this.picList = uni.getStorageSync("imgPreviewPicList");
				console.log(this.picList);
			},
			changeSwiper(e) {
				this.current = e.target.current;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.previewImg_container {
		min-height: 100%;
		position: relative;
		background-color: $uni-bg-color;
		position: fixed;
		z-index: 6;
		color: #fff;
		bottom: 20rpx;
		text-align: center;
		width: 100%;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $uni-bg-color;
		z-index: 5;

		>.my_swiper {
			width: 100%;
			height: 100vh;

			.bg_img {
				background-size: 100% auto;
				background-repeat: no-repeat;
				background-position: center;
				width: 100%;
				height: 100%;
				overflow-y: scroll;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.pic_list {
		display: flex;
		flex-flow: row wrap;
		>view {
			flex: 0 0 33.3vw;
			height: 33.3vw;
			padding: 1vw;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
