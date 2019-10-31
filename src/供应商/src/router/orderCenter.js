var pages = [
	/*线路 */
	//线路
	{
		meta: {
		  parentMenu: '订单管理',
		  breadcrumb:[{ title:'订单管理',url:''},{ title:'收付款管理',url:''},{title:'收款详情',url:'/grouptour/orderReceivables'}]
		},
		path: '/grouptour/orderReceivables',
		name: 'orderReceivables',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderReceivables.vue'], resolve)
	},
	//新增 改价订单
	{
		meta: {
		  parentMenu: '订单管理',
		  breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:''},{title:'改价订单列表',url:'/grouptour/changePriceOrder'}]
		},
		path: '/grouptour/changePriceOrder',
		name: 'orderReceivables',
		component: (resolve) => require(['@/views/grouptour/releasepath/changePriceOrder.vue'], resolve)
	},
	//分部-销售中心-下单
	{
		meta: {
		  parentMenu: '订单管理',
		  breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游',url:'/grouptour/productList'},{title:'跟团游下单页',url:'/grouptour/placeOrder'}]
		},
		path: '/grouptour/placeOrder',
		name: 'placeOrder',
		component: (resolve) => require(['@/views/grouptour/branchWork/placeOrder.vue'], resolve)
	},
	//跟团游订单列表
	{
		meta: {
			parentMenu: '订单管理',
			breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:'/grouptour/orderList'},{ title:'跟团游订单列表',url:'/grouptour/orderList'}]
		},
		path: '/grouptour/orderList',
		name: 'orderList',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderList.vue'], resolve)
	},
	//订单变更列表
	{
		meta: {
			parentMenu: '订单管理',
			breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:'/grouptour/orderList'},{ title:'跟团游变更订单列表',url:'/grouptour/grouplinechangeorder'}]
		},
		path: '/grouptour/grouplinechangeorder',
		name: 'grouplinechangeorder',
		component: (resolve) => require(['@/views/grouptour/branchWork/grouplinechangeorder.vue'], resolve)
	},
	//订单详情
	{
		meta: {
			parentMenu: '订单管理',
			breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:'/grouptour/orderList'},{ title:'跟团游订单详情页',url:'/grouptour/orderCheck'}]
		},
		path: '/grouptour/orderCheck',
		name: 'orderCheck',
		component: (resolve) => require(['@/views/grouptour/releasepath/orderCheck.vue'], resolve)
	},
	{
		meta: {
			parentMenu: '订单管理',
			breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:'/grouptour/refundList'},{ title:'跟团游退款列表',url:'/grouptour/refundList'}]
		},
		path: '/grouptour/refundList',
		name: 'refundList',
		component: (resolve) => require(['@/views/grouptour/branchWork/refundList.vue'], resolve)
	},
	{
		meta: {
			parentMenu: '订单管理',
			breadcrumb:[{ title:'订单管理',url:''},{ title:'跟团游订单管理',url:'/grouptour/refundList'},{ title:'跟团游退款详情页',url:'/grouptour/refundDetails'}]
		},
		path: '/grouptour/refundDetails',
		name: 'refundDetails',
		component: (resolve) => require(['@/views/grouptour/branchWork/refundDetails.vue'], resolve)
	},
	{//财务中心 提现 - 跟团游订单详情
		meta: {
			parentMenu: '财务中心',
			breadcrumb:[{ title:'财务中心',url:''},{ title:'提现',url:'/FinanceCenter/Withdraw'},{ title:'跟团游订单详情',url:'/grouptour/orderDetail'}]
		},
		path: '/grouptour/orderDetail',
		name: 'orderDetail',
		component: (resolve) => require(['@/views/grouptour/releasepath/orderDetail.vue'], resolve)
	},

	/*酒店 */
	//订单中心 酒店  酒店订单列表
	{
		meta: {
		parentMenu: '订单管理',
		breadcrumb:[{ title:'订单管理',url:''},{ title:'酒店',url:''},{title:'酒店订单列表',url:''}]
		},
		path: '/hotel/hotelOrderList',
		name: 'hotelOrderList',
		component: (resolve) => require(['@/views/hotel/orderCenter/hotelOrderList.vue'], resolve)
	},
	//订单中心 酒店  酒店订单详情
	{
		meta: {
		parentMenu: '订单管理',
		breadcrumb:[{ title:'订单管理',url:''},{ title:'酒店',url:''},{title:'酒店订单详情',url:''}]
		},
		path: '/hotel/hotelOrderDetail',
		name: 'hotelOrderDetail',
		component: (resolve) => require(['@/views/hotel/orderCenter/hotelOrderDetail.vue'], resolve)
	},
]
export default pages
