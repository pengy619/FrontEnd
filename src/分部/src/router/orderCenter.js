var pages = [
	//分部-新增预留单
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/reverseList'},{title:'跟团游预留单',url:'/grouptour/addReverse'}]
		},
		path: '/grouptour/addReverse',
		name: 'addReverse',
		component: (resolve) => require(['@/views/grouptour/branchWork/addReverse.vue'], resolve)
	},
	//分部-预留列表
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/reverseList'},{ title:'跟团游预留单列表',url:'/grouptour/reverseList'}]
		},
		path: '/grouptour/reverseList',
		name: 'reverseList',
		component: (resolve) => require(['@/views/grouptour/branchWork/reverseList.vue'], resolve)
	},
	//分部-销售中心-下单
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/productList'},{title:'跟团游下单页',url:'/grouptour/placeOrder'}]
		},
		path: '/grouptour/placeOrder',
		name: 'placeOrder',
		component: (resolve) => require(['@/views/grouptour/branchWork/placeOrder.vue'], resolve)
	},
	//分部-订单中心-收款页面
	{
		meta: {
		parentMenu: '订单中心'
		},
		path: '/grouptour/paymentPage',
		name: 'paymentPage',
		component: (resolve) => require(['@/views/grouptour/branchWork/paymentPage.vue'], resolve)
	},
	//自营线路收客订单
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'跟团游内部订单列表',url:'/grouptour/orderList'}]
		},
		path: '/grouptour/orderList',
		name: 'orderList',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderList.vue'], resolve)
	},
	//线下订单
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/offlineOrderList'},{ title:'线下订单列表',url:'/grouptour/offlineOrderList'}]
		},
		path: '/grouptour/offlineOrderList',
		name: 'offlineOrderList',
		component: (resolve) => require(['@/views/grouptour/branchWork/offlineOrderList.vue'], resolve)
	},
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'创建线下订单',url:'/grouptour/createOfflineOrder'}]
		},
		path: '/grouptour/createOfflineOrder',
		name: 'createOfflineOrder',
		component: (resolve) => require(['@/views/grouptour/branchWork/createOfflineOrder.vue'], resolve)
	},
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'线下订单详情',url:'/grouptour/offlineOrderDetail'}]
		},
		path: '/grouptour/offlineOrderDetail',
		name: 'offlineOrderDetail',
		component: (resolve) => require(['@/views/grouptour/branchWork/offlineOrderDetail.vue'], resolve)
	},
	//新增变更申请记录
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'新增变更合同申请',url:'/grouptour/addChangeOrder'}]
		},
		path: '/grouptour/addChangeOrder',
		name: 'addChangeOrder',
		component: (resolve) => require(['@/views/grouptour/branchWork/addChangeOrder.vue'], resolve)
	},
	{
		meta: {
		parentMenu: '订单中心',
			breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'线下订单收款',url:'/grouptour/offlineOrderReceivables'}]
		},
		path: '/grouptour/offlineOrderReceivables',
		name: 'offlineOrderReceivables',
		component: (resolve) => require(['@/views/grouptour/branchWork/offlineOrderReceivables.vue'], resolve)
	},
	//外部线路收客订单
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/ExternalList'},{ title:'跟团游外部订单列表',url:'/grouptour/ExternalList'}]
		},
		path: '/grouptour/ExternalList',
		name: 'ExternalList',
		component: (resolve) => require(['@/views/grouptour/releasepath/ExternalList.vue'], resolve)
	},
	//订单变更表
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/grouplinechangeorder'},{ title:'订单变更列表',url:'/grouptour/grouplinechangeorder'}]
		},
		path: '/grouptour/grouplinechangeorder',
		name: 'grouplinechangeorder',
		component: (resolve) => require(['@/views/grouptour/branchWork/grouplinechangeorder.vue'], resolve)
	},
	//订单详情
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{ title:'跟团游订单详情页',url:'/grouptour/orderCheck'}]
		},
		path: '/grouptour/orderCheck',
		name: 'orderCheck',
		component: (resolve) => require(['@/views/grouptour/releasepath/orderCheck.vue'], resolve)
	},
	//商品详情页
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/productList'},{title:'跟团游产品详情页',url:'/grouptour/linedetails'}]
		},
		path: '/grouptour/linedetails',
		name: 'linedetails',
		component: (resolve) => require(['@/views/grouptour/branchWork/linedetails.vue'], resolve)
	},
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/reverseList'},{title:'跟团游预留单转订单',url:'/grouptour/OrderForm'}]
		},
		path: '/grouptour/OrderForm',
		name: 'OrderForm',
		component: (resolve) => require(['@/views/grouptour/releasepath/OrderForm.vue'], resolve)
	},
	//签订合同
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游',url:'/grouptour/orderList'},{title:'签订合同',url:'/grouptour/signContract'}]
		},
		path: '/grouptour/signContract',
		name: 'signContract',
		component: (resolve) => require(['@/views/grouptour/branchWork/signContract.vue'], resolve)
	},
	//分部 订单中心 收款管理列表
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'收款管理列表',url:'/grouptour/shoukuanguanli'}]
		},
		path: '/grouptour/shoukuanguanli',
		name: 'shoukuanguanli',
		component: (resolve) => require(['@/views/grouptour/branchWork/shoukuanguanli.vue'], resolve)
	},
	//分部 订单中心 退款管理列表
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'退款管理列表',url:'/grouptour/tuikuanguanli'}]
		},
		path: '/grouptour/tuikuanguanli',
		name: 'tuikuanguanli',
		component: (resolve) => require(['@/views/grouptour/branchWork/tuikuanguanli.vue'], resolve)
	},
	//分部 订单中心 收付款管理 收款详情
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'收款详情',url:'/grouptour/orderReceivables'}]
		},
		path: '/grouptour/orderReceivables',
		name: 'orderReceivables',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderReceivables.vue'], resolve)
	},
	//分部 订单中心 收付款管理 退款详情
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'退款详情',url:'/grouptour/orderRefund'}]
		},
		path: '/grouptour/orderRefund',
		name: 'orderRefund',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderRefund.vue'], resolve)
	},
	
	//订单中心 收付款管理  收款管理列表 查看详情 orderRefundDetail
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'收款管理列表详情',url:'/grouptour/orderReceiptDetails'}]
		},
		path: '/grouptour/orderReceiptDetails',
		name: 'orderReceiptDetails',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderReceiptDetails.vue'], resolve)
	},
	//订单中心 收付款管理  退款管理列表 查看详情 orderRefundDetail
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'收付款管理',url:''},{title:'退款管理列表详情',url:'/grouptour/orderRefundDetail'}]
		},
		path: '/grouptour/orderRefundDetail',
		name: 'orderRefundDetail',
		component: (resolve) => require(['@/views/grouptour/branchWork/orderRefundDetail.vue'], resolve)
	},
	{//代付管理列表
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'代付管理',url:'/grouptour/payList'},{ title:'代付管理列表',url:'/grouptour/payList'}]
		},
		path: '/grouptour/payList',
		name: 'payList',
		component: (resolve) => require(['@/views/grouptour/releasepath/payList.vue'], resolve)
	},
	{//代付款详情
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'代付管理',url:'/grouptour/payDetails'},{ title:'代付详情页',url:'/grouptour/payDetails'}]
		},
		path: '/grouptour/payDetails',
		name: 'payDetails',
		component: (resolve) => require(['@/views/grouptour/releasepath/payDetails.vue'], resolve)
	},
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游', url: '/grouptour/changePriceOrder' }, { title: '订单改价列表', url: '/grouptour/changePriceOrder' }]
		},
		path: '/grouptour/changePriceOrder',
		name: 'changePriceOrder',
		component: (resolve) => require(['@/views/grouptour/branchWork/changePriceOrder.vue'], resolve)
	},

	/*酒店 */
	//订单中心 酒店  酒店订单列表
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'酒店',url:''},{title:'酒店订单列表',url:''}]
		},
		path: '/hotel/hotelOrderList',
		name: 'hotelOrderList',
		component: (resolve) => require(['@/views/hotel/orderCenter/hotelOrderList.vue'], resolve)
	},
	//订单中心 酒店  酒店订单详情
	{
		meta: {
		parentMenu: '订单中心',
		breadcrumb:[{ title:'订单中心',url:''},{ title:'酒店',url:''},{title:'酒店订单详情',url:''}]
		},
		path: '/hotel/hotelOrderDetail',
		name: 'hotelOrderDetail',
		component: (resolve) => require(['@/views/hotel/orderCenter/hotelOrderDetail.vue'], resolve)
	},
]
export default pages
