import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    menus: [],
    currentLeft: [],
    breadcrumb: [],
    activeLeft: [],
    settleClientId:''
};

const mutations = {
    updateMenus(state, value) {
        state.menus = value
    },
    updateCurrentLeft(state,value) {
        state.currentLeft=value
      },
      updateBreadcrumb(state,value) {
        state.breadcrumb=value
      },
      updateActiveLeft(state,value) {
        state.activeLeft=value
      },
      setgetClientID(state,value){
        window.sessionStorage.setItem('SettleClientId',value);
        state.settleClientId = value;
      }
}
const actions = {
    setMenus({ commit }, value) {
        //更改所有菜单
        commit('updateMenus', value)
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
}

const getters = {
    getActiveLeft: function(state) {
        let activeLeft=state.activeLeft[2].url;
        return activeLeft
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});