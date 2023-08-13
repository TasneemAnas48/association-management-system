import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://127.0.0.1:8001",
    aca_url: "http://127.0.0.1:8002",
    aca_url_front: "http://192.168.43.244:8081",
    id: '',
    name: '',
    email:'',
    token:'',
    role:'',
    data_report: [],
    task: null
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
