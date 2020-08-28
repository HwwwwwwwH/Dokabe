import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../network/network'
import asyncLocalStorage from './local-storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Axios: axios,
    AsyncLocalStorage: asyncLocalStorage,
    bbs: 'http://simplebbs.iterator-traits.com/'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
