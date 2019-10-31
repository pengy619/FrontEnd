import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		direction: 'forward',
		useTransition: true,
		selectInvoice:null,
		branchAndShop:{
			BranchId:null,
			CommunityShopId:null,
		}
	},
	mutations: {
		setDirection(state, value) {
			state.direction = value
		},
		useTransition(state, value) {
			state.useTransition = value
		},
		setSelectInvoice(state, value) {
			state.selectInvoice = value
		},
		setBranchAndShop(state, value){
			state.branchAndShop = value
		}
	}
})
export default store