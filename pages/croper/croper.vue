<template>
	<view>
		<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
		<image :src="cropFilePath" mode="aspectFit" style="width: 100%;"></image>
	</view>
</template>

<script>
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		data() {
			return {
				cropFilePath: '',
				tempFilePath: '',
			};
		},
		components: {
			ImageCropper
		},
		onLoad() {
			this.tempFilePath = uni.getStorageSync('imag_avatar');
			console.log(uni.getStorageSync('imag_avatar'));
		},
		methods: {
			confirm() {},
			cancel() {}
		}
	}
</script>

<style lang="scss">

</style>
