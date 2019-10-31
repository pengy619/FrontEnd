var pages = [
	//线路预定
	{
		meta: {
		parentMenu: '销售中心'
		},
		path: '/grouptour/routeBooking',
		name: 'routeBooking',
		component: (resolve) => require(['@/views/grouptour/branchWork/routeBooking.vue'], resolve)
	},
	//跟团游商品列表
	{
		meta: {
		parentMenu: '销售中心',
			breadcrumb:[{ title:'销售中心',url:''},{ title:'跟团游',url:'/grouptour/productList'},{ title:'跟团游产品列表',url:'/grouptour/productList'}]
		},
		path: '/grouptour/productList',
		name: 'productList',
		component: (resolve) => require(['@/views/grouptour/branchWork/productList.vue'], resolve)
	},
	//跟团游团期列表
	{
		meta: {
		parentMenu: '销售中心',
			breadcrumb:[{ title:'销售中心',url:''},{ title:'跟团游',url:'/grouptour/groupList'},{ title:'跟团游团期列表',url:'/grouptour/groupList'}]
		},
		path: '/grouptour/groupList',
		name: 'groupList',
		component: (resolve) => require(['@/views/grouptour/branchWork/groupList.vue'], resolve)
	},
 
]
export default pages
