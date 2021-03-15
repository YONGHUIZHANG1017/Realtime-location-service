import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appHeight: 200,
    userInfo: {},
  },
  getters: {
    userInfo: (state) => state.userInfo,
    appHeight: (state) => state.appHeight,
  },
  mutations: {
    SET_USER_INFO(state, data) {
      console.log(3333333333);
      state.userInfo = data;
    },
    SET_APP_HEIGHT(state, value) {
      state.appHeight = value;
    },
  },
  actions: {},
  modules: {},
});
