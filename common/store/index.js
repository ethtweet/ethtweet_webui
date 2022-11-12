import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

let ipfsMode = uni.getStorageSync('ipfs_mode') || false;
let userInfo = uni.getStorageSync('USER_INFO');

const state = {
  ipfsMode: ipfsMode,
  userInfo: userInfo,
  
}

export default new Vuex.Store({
  state,
  mutations
})
