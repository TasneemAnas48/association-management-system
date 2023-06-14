import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://192.168.1.118:8000",
    id: '',
    name: '',
    email:'',
    token:'',
    role:'',
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
