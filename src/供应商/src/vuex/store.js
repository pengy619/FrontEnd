/**
 * Created by zss on 2017/11/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'

Vue.use(Vuex)

const mutations = {
  updateMenus(state,value) {
    state.menus=value
  },
  updateCurrentLeft(state,value) {
    state.currentLeft=value
  },
  updateBreadcrumb(state,value) {
    state.breadcrumb=value
  },
  updateActiveLeft(state,value) {
    state.activeLeft=value
  }
};
const actions = {
  setMenus({ commit },value) {
    //更改所有菜单
    commit('updateMenus',value)
  },
  setLeftMenus({ commit },value) {
    //更改左侧菜单
    commit('updateCurrentLeft',value)
  },
  setBreadcrumb({ commit },value) {
    //更改面包屑导航
    commit('updateBreadcrumb',value)
  },
  setActiveLeft({ commit },value) {
    //更改面包屑导航
    commit('updateActiveLeft',value)
  }
};
const state = {
  menus:[],
  currentLeft:[],
  breadcrumb:[],
  activeLeft:[],
  count:0
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
