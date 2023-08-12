import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://192.168.43.244:8000",
    aca_url: "http://192.168.43.244:8082/side-view",
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
