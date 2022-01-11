import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {
    SET_INFO: (state, info) => {
      state.user.info = info;
    }
  },
  actions: {

  },
  token: state => state.user.token,
});
