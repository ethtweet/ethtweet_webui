<template>
	<view class="previewImg" v-if="showBox" @touchmove.stop.prevent="mpClear">
		<view class="close" @click="close">
			<text>关闭</text>
		</view>
		<view class="mask">
			
			<swiper @change="changeSwiper" class="my_swiper" :current="currentIndex" :circular="circular" :indicator-dots="indicatorDots" :autoplay="autoplay" :duration="duration">
				<swiper-item v-for="(src, y) in picList" :key="y">
					<view class="bg_img" :style="{ backgroundImage: 'url('+ src +')'}"></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="pagebox" v-if="picList.length>0">{{ Number(currentIndex) + 1 }} / {{ picList.length }}</view>
	</view>
</template>

<script>
	export default {
		name: 'hx-preview-img',
		props: {
			current: {
				type: String,
				default: ''
			},
			list: {
				type: Array,
				default: function(){
					return new Array();
				}
			},
			//开始
			start: {
			    type: Number,
				default: 0
			},
			
		},
			
		data() {
			return {
				picList: [],
				indicatorDots: false,
				autoplay: false,
				duration: 500,
				circular: true,
				currentIndex: 0,
				isShowSwiper: false,
				showBox: false
			};
		},
		watch: {
			list(val) {
				
			},
			current(val){
				
			},
			start(val,oldVal) {
				var that = this;
				this.picListInit();
			}
		},
		created() {
			
		},
		methods: {
			clickPic(index) {
				this.currentIndex = index;
				this.isShowSwiper = true;
			},
			picListInit() {
				this.showBox = true;
				if(!this.current || !this.list){
					return;
				}
				for(var i in this.list){
					if(this.current == this.list[i]){
						this.currentIndex = i;
						break;
					}
				}
				
				console.log(this.currentIndex);
				this.picList=this.list;
				
			},
			changeSwiper(e) {
				this.currentIndex = e.target.current;
			},
			mpClear(e) {
				// TODO nvue 取消冒泡
				e.stopPropagation()
			},
			close(){
				this.showBox = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
.previewImg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99999999;
	
	.close{
		position: absolute;
		top: calc(var(--status-bar-height) + 15px);
		left: 15px;
		z-index: 6;
		color: #ffffff;
		font-size: 14px;
		background-color: rgba(255, 255, 255, 0.4);
		padding: 0 9px;
		border-radius: 4px;
		text-align: center;
		display: flex;
		align-items: center;
		height: 27px;

	}
	.pagebox{
		position: absolute;
		z-index: 6;
		color: #fff;
		bottom: 20rpx;
		text-align: center;
		width: 100%;
	}
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000;
		z-index: 5;
		> .my_swiper {
			width: 100%;
			height: 60vh;
			.bg_img {
				background-size: 100% auto;
				background-repeat: no-repeat;
				background-position:center;
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.pic_list {
		display: flex;
		flex-flow: row wrap;
		> view {
			flex: 0 0 33.3vw;
			height: 33.3vw;
			padding: 1vw;
			> image {
				width: 100%;
				height: 100%;
			}
		}
	}
}

</style>
