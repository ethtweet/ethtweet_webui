<template>
	<view>
		<view class="bubble_tips"
			:style="{'height': height+'rpx', 'top': top+'px','left': left+'px', 'opacity': opacity}">
			<view class="flex_h_start_center opt_item" @click.stop="copyAddr">

				<image src="../../static/mine/share_icon.png" mode="" class="share_icon"></image>
				<text class="fStyle22ffffff">{{i18n.share}}</text>

			</view>
			<!-- 	<view class="flex_h_start_center opt_item" @click.stop="share">
				<image src="../../static/home/blacklist_icon.png" mode="" class="blacklist_icon"></image>
				<text class="fStyle22ffffff">拉黑</text>
			</view> -->
			<view class="flex_h_start_center opt_item" @click.stop="shield">
				<image src="../../static/home/shield_icon.png" mode="" class="shield_icon"></image>
				<text class="fStyle22ffffff">{{i18n.localScope}}</text>
			</view>
			<view class="flex_h_start_center opt_item noBorder" @click.stop="focus">
				<image src="../../static/home/unfocus_icon.png" mode="" class="unfocus_icon"></image>
				<text class="fStyle22ffffff">{{i18n.unfollow}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		h5Copy
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				height: 0,
				left: 0,
				top: 0,
				opacity: 0,
				copyBtn: null, //存储初始化复制按钮事件
			};
		},
		mixins: [h5Copy],
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		props: {
			id: String
		},
		mounted() {
			// this.copyBtn = new this.clipboard(this.$refs.copy)
		},
		methods: {
			// 复制地址
			copyAddr() {
				this.h5Copy(window.location.href+'&ipfsMode=1');
				uni.showToast({
					title: this.i18n.copySuccess,
					icon:'none'
				});
				this.hideBobble();
			},
			joinBlackList() {
				console.log('加入黑名单');
			},
			shield() {
				console.log('屏蔽');
			},
			focus() {
				this.$emit('onCancelFollow');
			},
			setHeight(left, top) {
				this.height = 276;
				this.opacity = 1;
				this.left = left - 160;
				this.top = top + 20;
			},
			hideBobble() {
				this.height = 0;
				this.left = 0;
				this.top = 0;
				this.opacity = 0;
			}
		}
	}
</script>

<style lang="scss">
	.bubble_tips {
		width: 316rpx;
		// height: 276rpx;
		background-image: url(../../static/home/bubble_icon.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: fixed;
		bottom: 0;
		right: 0;
		transition: height .5s;
		opacity: 0;
		overflow: hidden;

		.opt_item {
			margin-left: 18rpx;
			margin-right: 18rpx;
			padding-top: 24rpx;
			padding-bottom: 24rpx;
			padding-left: 40rpx;
			padding-right: 20rpx;
			border-bottom: 1px solid #7F8AA3;
		}

		.opt_item.noBorder {
			border-bottom: none;
		}

		.blacklist_icon {
			width: 29rpx;
			height: 31rpx;
			margin-right: 20rpx;
		}

		.share_icon {
			width: 29rpx;
			height: 29rpx;
			margin-right: 20rpx;
		}

		.shield_icon {
			width: 29rpx;
			height: 29rpx;
			margin-right: 20rpx;
		}

		.unfocus_icon {
			width: 29rpx;
			height: 30rpx;
			margin-right: 20rpx;
		}
	}
</style>
