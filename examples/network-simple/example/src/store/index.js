import Vue from 'vue'
import Vuex from 'vuex'
import requestManager from '../request'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    users: []
  },
  mutations: {
    Save(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    }
  },
  actions: {
    ...requestManager.action2Vuex('User')
  }
})

export default store