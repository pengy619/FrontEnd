var pages = [
	/* 线路 */
	//线路列表
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/RouteTable'},{ title:'跟团游线路列表',url:'/grouptour/RouteTable'}]
		},
		path: '/grouptour/RouteTable',
		name: 'RouteTable',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteTable'], resolve)
	},
	//线路基本信息
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游线路信息',url:'/grouptour/RouteMessage'}]
		},
		path: '/grouptour/RouteMessage',
		name: 'RouteMessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteMessage'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游行程信息',url:'/grouptour/JourneyMessage'}]
		},
		path: '/grouptour/JourneyMessage',
		name: 'JourneyMessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/JourneyMessage'], resolve)
	},
	{
		meta: {// 小项目 步骤
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'小项目',url:'/grouptour/subentryMessage'}]
		},
		path: '/grouptour/subentryMessage',
		name: 'subentryMessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/subentryMessage'], resolve)
	},
	{
		meta: {// 小项目列表
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/RouteTable'},{title:'小项目类型',url:'/grouptour/addsubentry'}]
		},
		path: '/grouptour/addsubentry',
		name: 'addsubentry',
		component: (resolve) => require(['@/views/grouptour/addsubentry.vue'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游行程说明',url:'/grouptour/RouteReserve'}]
		},
		path: '/grouptour/RouteReserve',
		name: 'RouteReserve',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteReserve'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游特殊人群限制',url:'/grouptour/SpecialPerson'}]
		},
		path: '/grouptour/SpecialPerson',
		name: 'SpecialPerson',
		component: (resolve) => require(['@/views/grouptour/releasepath/SpecialPerson'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游附件上传',url:'/grouptour/FileUpload'}]
		},
		path: '/grouptour/FileUpload',
		name: 'FileUpload',
		component: (resolve) => require(['@/views/grouptour/releasepath/FileUpload'], resolve)
	},
	//供应商退款说明
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:''},{title:'跟团游退款说明',url:'/grouptour/Refund'}]
		},
		path: '/grouptour/Refund',
		name: 'Refund',
		component: (resolve) => require(['@/views/grouptour/releasepath/Refund'], resolve)
	},
	//开团
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/RouteTable'},{title:'跟团游开团信息',url:'/grouptour/GroupMessage'}]
		},
		path: '/grouptour/GroupMessage',
		name: 'GroupMessage',
		component: (resolve) => require(['@/views/grouptour/groupmessage/GroupMessage'], resolve)
	},
	//设置出发地
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/RouteTable'},{title:'跟团游设置出发地',url:'/grouptour/PlaceOfDeparture'}]
		},
		path: '/grouptour/PlaceOfDeparture',
		name: 'PlaceOfDeparture',
		component: (resolve) => require(['@/views/grouptour/groupmessage/PlaceOfDeparture'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/RouteTable'},{title:'跟团游线路信息编辑',url:'/grouptour/Editmessage'}]
		},
		path: '/grouptour/Editmessage',
		name: 'Editmessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/editmessage/Editmessage'], resolve)
	},
	//分部-跟团游基础信息维护
	{
		meta: {
		parentMenu: '资源中心',
		breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/infoMaintenance'},{ title:'跟团游基础信息',url:'/grouptour/infoMaintenance'}]
		},
		path: '/grouptour/infoMaintenance',
		name: 'infoMaintenance',
		component: (resolve) => require(['@/views/grouptour/basicmessage/infoMaintenance.vue'], resolve)
	},
	//资源中心 线路列表 查看
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'跟团游',url:'/grouptour/productList'},{ title:'跟团游线路列表',url:'/grouptour/routeDetails'}]
		},
		path: '/grouptour/routeDetails',
		name: 'routeDetails',
		component: (resolve) => require(['@/views/grouptour/releasepath/routeDetails.vue'], resolve)
	},

	/* 酒店业务 */
	//资源中心 酒店 酒店列表
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{ title:'酒店列表',url:'/hotel/hotelProductList'}]
		},
		path: '/hotel/hotelProductList',
		name: 'hotelProductList',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelProductList.vue'], resolve)
	},
	{//资源中心 酒店 酒店商品详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店列表',url:''},{title:'酒店商品详情',url:''}]
		},
		path: '/hotel/hotelProductDetail/:id',
		name: 'hotelProductDetail',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelProductDetail.vue'], resolve)
	},
	{//资源中心 酒店 酒店商品房间详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店列表',url:''},{title:'酒店商品详情',url:''}]
		},
		path: '/hotel/hotelProductRoomDetail/:id',
		name: 'hotelProductRoomDetail',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelProductRoomDetail.vue'], resolve)
	},
	//资源中心 酒店 发布酒店  选择酒店
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{ title:'选择酒店',url:'/hotel/chooseHotel'}]
		},
		path: '/hotel/chooseHotel',
		name: 'chooseHotel',
		component: (resolve) => require(['@/views/hotel/resourceCenter/releaseHotel/chooseHotel.vue'], resolve)
	},
	//资源中心 酒店 发布酒店  选择房型
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{ title:'选择房型',url:'/hotel/chooseRoomType'}]
		},
		path: '/hotel/chooseRoomType',
		name: 'chooseRoomType',
		component: (resolve) => require(['@/views/hotel/resourceCenter/releaseHotel/chooseRoomType.vue'], resolve)
	},
	//资源中心 酒店 发布酒店  产品设置
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{ title:'产品设置',url:'/hotel/productSetting'}]
		},
		path: '/hotel/productSetting',
		name: 'productSetting',
		component: (resolve) => require(['@/views/hotel/resourceCenter/releaseHotel/productSetting.vue'], resolve)
	},
	//资源中心 酒店 发布酒店  价格设置
	{
		meta: {
		  parentMenu: '资源中心',
		  breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{ title:'价格设置',url:'/hotel/priceSetting'}]
		},
		path: '/hotel/priceSetting',
		name: 'priceSetting',
		component: (resolve) => require(['@/views/hotel/resourceCenter/releaseHotel/priceSetting.vue'], resolve)
	},
	{//资源中心 酒店   添加基本信息
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'基本信息',url:''}]
		},
		path: '/hotel/basicInfo',
		name: 'basicInfo',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/basicInfo.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店房型
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店房型',url:''}]
		},
		path: '/hotel/hotelHouseType',
		name: 'hotelHouseType',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelHouseType.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店餐厅
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店餐厅',url:''}]
		},
		path: '/hotel/hotelRestaurant',
		name: 'hotelRestaurant',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelRestaurant.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店美食
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店美食',url:''}]
		},
		path: '/hotel/hotelFood',
		name: 'hotelFood',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelFood.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店会议室
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店会议室',url:''}]
		},
		path: '/hotel/hotelConferenceRoom',
		name: 'hotelConferenceRoom',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelConferenceRoom.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店配套设施
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店配套设施',url:''}]
		},
		path: '/hotel/hotelFacilities',
		name: 'hotelFacilities',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelFacilities.vue'], resolve)
	},
	{//资源中心 酒店   添加酒店交通路线
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'酒店交通路线',url:''}]
		},
		path: '/hotel/trafficRoutes',
		name: 'trafficRoutes',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/trafficRoutes.vue'], resolve)
	},
	{//资源中心 酒店   编辑酒店
		meta: {
			parentMenu: '资源中心',
			breadcrumb:[{ title:'资源中心',url:''},{ title:'酒店',url:''},{title:'编辑酒店',url:''}]
		},
		path: '/hotel/editHotel',
		name: 'editHotel',
		component: (resolve) => require(['@/views/hotel/resourceCenter/editHotel/editHotel.vue'], resolve)
	},
]
export default pages
