import Vue from 'vue'
import App from './App'
import MinRequest from '@/common/service/MinRequest'
import minRequest from '@/common/service/api'
import VueI18n from 'vue-i18n'
import store from '@/common/store/index';

Vue.use(VueI18n) 
Vue.prototype.$http = minRequest.minRequest // ajax请求方法
Vue.use(MinRequest)

Vue.config.productionTip = false

const i18n = new VueI18n({  
  locale: 'en-US',  
  messages: {  
    'en-US': {  
      index: {  
        cancel: 'Cancel',
		publish: 'Publish',
		sharePlaceholder: 'Type and share!',
		uploading: 'Uploading...',
		imagesMaxToast: 'Only up to 9 pictures or 1 video can be sent',
		shareToast: 'Please type in to share',
		search: 'Search...',
		contentdown: 'Pull up to show more',
		contentrefresh: 'Loading...',
		contentnomore: 'No more Data',
		recommend: 'Recommended',
		focus: 'Following',
		focusToast: 'Now Following!!',
		focusing: 'Following',
		deleteToast: 'Removed!!',
		friend: 'Friends',
		blackList: 'Blacklist',
		helpCenter: 'Help Center',
		about: 'About us',
		editUserInfo: 'Edit Profile',
		nickName: 'Nickname',
		nickTips: '（only be modified once within 30 days）',
		profile: 'Profile',
		profileTips: '(Show your profile tags)',
		setting: 'Setting',
		more: 'More',
		recommendFocus: 'You might like',
		myFocus: 'Following',
		publishing: 'Publishing',
		publishSuccess: 'Published!',
		noProfile: 'Nothing Yet',
		canotTrans: "This tweet can't be shared at the moment",
		artical: 'Tweet',
		forward: 'Forward',
		modifyTips: 'Update success!',
		followTips: 'Followed!!',
		followed: 'Followed',
		unfollowTips: 'Unfollowed!!',
		ipfsMode: 'ipfs Mode',
		localScope: 'Mute the user',
		share: 'Share',
		unfollow: 'Unfollow',
		copySuccess: 'Copy success!'
      }  
    },  
    'zh-CN': {  
      index: {  
        cancel: '取消',  
        publish: '发布',
		sharePlaceholder: '快来分享你的趣事...',
		uploading: '正在上传中...',
		imagesMaxToast: '最多可以上传9张图片资源，或1个视频资源',
		shareToast: '请求输入需要发布的内容',
		search: '搜索...',
		contentdown: '上拉显示更多',
		contentrefresh: '正在加载...',
		contentnomore: '没有更多数据了',
		recommend: '推荐',
		focus: '关注',
		focusToast: '成功关注！',
		focusing: '正在关注',
		deleteToast: '删除成功！',
		friend: '好友',
		blackList: '黑名单',
		helpCenter: '帮助中心',
		about: '关于我们',
		editUserInfo: '编辑个人资料',
		nickName: '昵称',
		nickTips: '（30天内只能修改一次）',
		profile: '简介',
		profileTips: '(显示个人资料标签)',
		setting: '设置',
		more: '更多',
		recommendFocus: '推荐关注',
		myFocus: '我的关注',
		publishing: '发布中...',
		publishSuccess: '发布成功!',
		noProfile: '暂无简介',
		canotTrans: '当前文章不能转发！',
		artical: '推文',
		forward: '转发',
		modifyTips: '更新成功！',
		followed: '已关注',
		followTips: '关注成功！！',
		unfollowTips: '取关成功!!',
		ipfsMode: 'ipfs模式',
		localScope: '本地屏蔽',
		share: '分享',
		unfollow: '取消关注',
		copySuccess: '复制成功！'
      }  
    }  
  }  
})  

Vue.prototype._i18n = i18n  

App.mpType = 'app'

const app = new Vue({
	data: {
	    test: '123'
	  },
	i18n,
	...App,
	store,
	minRequest
})
app.$mount()

