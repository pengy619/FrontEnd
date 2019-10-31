var pages = [
	//线路列表
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '跟团游线路列表', url: '/grouptour/RouteTable' }]
		},
		path: '/grouptour/RouteTable',
		name: 'RouteTable',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteTable'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '跟团游线路列表', url: '/grouptour/RouteTable' }]
		},
		path: '/',
		name: 'RouteTable',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteTable'], resolve)
	},
	//线路基本信息
	{
		meta: {//线路
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游线路信息', url: '/grouptour/RouteMessage' }]
		},
		path: '/grouptour/RouteMessage',
		name: 'RouteMessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteMessage'], resolve)
	},
	{
		meta: {//行程
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游行程信息', url: '/grouptour/JourneyMessage' }]
		},
		path: '/grouptour/JourneyMessage',
		name: 'JourneyMessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/JourneyMessage'], resolve)
	},
	{//小项目
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '小项目', url: '/grouptour/subentryMessagefb' }]
		},
		path: '/grouptour/subentryMessagefb',
		name: 'subentryMessagefb',
		component: (resolve) => require(['@/views/grouptour/releasepath/subentryMessagefb'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游行程说明', url: '/grouptour/RouteReserve' }]
		},
		path: '/grouptour/RouteReserve',
		name: 'RouteReserve',
		component: (resolve) => require(['@/views/grouptour/releasepath/RouteReserve'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游特殊人群限制', url: '/grouptour/SpecialPerson' }]
		},
		path: '/grouptour/SpecialPerson',
		name: 'SpecialPerson',
		component: (resolve) => require(['@/views/grouptour/releasepath/SpecialPerson'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游附件上传', url: '/grouptour/FileUpload' }]
		},
		path: '/grouptour/FileUpload',
		name: 'FileUpload',
		component: (resolve) => require(['@/views/grouptour/releasepath/FileUpload'], resolve)
	},

	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '跟团游退款说明', url: '/grouptour/Refund' }]
		},
		path: '/grouptour/Refund',
		name: 'Refund',
		component: (resolve) => require(['@/views/grouptour/releasepath/Refund'], resolve)
	},
	{
		meta: {//小项目设置
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '' }, { title: '小项目设置', url: '/grouptour/addsubentryfb' }]
		},
		path: '/grouptour/addsubentryfb',
		name: 'addsubentryfb',
		component: (resolve) => require(['@/views/grouptour/releasepath/addsubentryfb'], resolve)
	},
	//开团
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '跟团游开团信息', url: '/grouptour/GroupMessage' }]
		},
		path: '/grouptour/GroupMessage',
		name: 'GroupMessage',
		component: (resolve) => require(['@/views/grouptour/groupmessage/GroupMessage'], resolve)
	},
	//设置出发地
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '跟团游设置出发地', url: '/grouptour/PlaceOfDeparture' }]
		},
		path: '/grouptour/PlaceOfDeparture',
		name: 'PlaceOfDeparture',
		component: (resolve) => require(['@/views/grouptour/groupmessage/PlaceOfDeparture'], resolve)
	},
	//编辑
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '跟团游线路信息编辑', url: '/grouptour/Editmessage' }]
		},
		path: '/grouptour/Editmessage',
		name: 'Editmessage',
		component: (resolve) => require(['@/views/grouptour/releasepath/editmessage/Editmessage'], resolve)
	},

	//分部-跟团游基础信息维护
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/infoMaintenance' }, { title: '跟团游基础信息', url: '/grouptour/infoMaintenance' }]
		},
		path: '/grouptour/infoMaintenance',
		name: 'infoMaintenance',
		component: (resolve) => require(['@/views/grouptour/branchWork/infoMaintenance.vue'], resolve)
	},
	//分部 资源中心 跟团业务 外部线路列表
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/leagueRouteList' }, { title: '外部线路列表', url: '/grouptour/leagueRouteList' }]
		},
		path: '/grouptour/leagueRouteList',
		name: 'leagueRouteList',
		component: (resolve) => require(['@/views/grouptour/branchWork/leagueRouteList.vue'], resolve)
	},
	//分部 资源中心 跟团业务 外部线路详情
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/leagueRouteList' }, { title: '外部线路详情', url: '/grouptour/leagueRouteDetail' }]
		},
		path: '/grouptour/leagueRouteDetail',
		name: 'leagueRouteDetail',
		component: (resolve) => require(['@/views/grouptour/branchWork/leagueRouteDetail.vue'], resolve)
	},
	//分部 资源中心 跟团业务 审核价格
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/leagueRouteList' }, { title: '审核价格', url: '/grouptour/auditingPrice' }]
		},
		path: '/grouptour/auditingPrice',
		name: 'auditingPrice',
		component: (resolve) => require(['@/views/grouptour/branchWork/auditingPrice.vue'], resolve)
	},
	//分部 跟团游 待审核平台产品
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '待审核平台产品', url: '/grouptour/unauditedProduct' }]
		},
		path: '/grouptour/unauditedProduct',
		name: 'unauditedProduct',
		component: (resolve) => require(['@/views/grouptour/platformPages/unauditedProduct.vue'], resolve)
	},
	//分部 跟团游 已审核平台产品
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '已审核平台产品', url: '/grouptour/auditedProduct' }]
		},
		path: '/grouptour/auditedProduct',
		name: 'auditedProduct',
		component: (resolve) => require(['@/views/grouptour/platformPages/auditedProduct.vue'], resolve)
	},
	//分部 跟团游 已审核平台产品
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '资源平台产品详情', url: '/grouptour/platformProductDetail' }]
		},
		path: '/grouptour/platformProductDetail',
		name: 'platformProductDetail',
		component: (resolve) => require(['@/views/grouptour/platformPages/platformProductDetail.vue'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '跟团游', url: '/grouptour/RouteTable' }, { title: '资源平台产品详情', url: '/grouptour/lineDetailForUTour' }]
		},
		path: '/grouptour/lineDetailForUTour',
		name: 'lineDetailForUTour',
		component: (resolve) => require(['@/views/grouptour/platformPages/lineDetailForUTour.vue'], resolve)
	},
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '新增合同', url: '/ContractManage/IncreaseContract' }]
		},
		path: '/ContractManage/IncreaseContract',
		name: 'IncreaseContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/IncreaseContract'], resolve)
	},
	{//资源中心 合同管理 合同归还
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '合同归还', url: '' }]
		},
		path: '/ContractManage/returnContract',
		name: 'returnContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/returnContract.vue'], resolve)
	},
	{//资源中心 合同管理 作废合同 lostContract
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '作废合同', url: '' }]
		},
		path: '/ContractManage/invalidContract',
		name: 'invalidContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/invalidContract.vue'], resolve)
	},
	{//资源中心 合同管理 丢失合同
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '丢失合同', url: '' }]
		},
		path: '/ContractManage/lostContract',
		name: 'lostContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/lostContract.vue'], resolve)
	},
	{//资源中心 合同管理 合同类型 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '合同类型', url: '' }]
		},
		path: '/ContractManage/contractType',
		name: 'contractType',
		component: (resolve) => require(['@/views/grouptour/contractManage/contractType.vue'], resolve)
	},
	{//资源中心 合同管理 已使用合同
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '已使用合同', url: '' }]
		},
		path: '/ContractManage/usedContract',
		name: 'usedContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/usedContract.vue'], resolve)
	},
	{//资源中心 合同管理 已使用合同 ---新增页
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '未使用合同', url: '' }]
		},
		path: '/ContractManage/usedContractNew',
		name: 'usedContractNew',
		component: (resolve) => require(['@/views/grouptour/contractManage/usedContractNew.vue'], resolve)
	},
	{//资源中心 合同管理 合同派发记录 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '合同派发记录', url: '' }]
		},
		path: '/ContractManage/contractRecord',
		name: 'contractRecord',
		component: (resolve) => require(['@/views/grouptour/contractManage/contractRecord.vue'], resolve)
	},
	{//资源中心 合同管理 未使用合同 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '未使用合同', url: '' }]
		},
		path: '/ContractManage/unusedContract',
		name: 'unusedContract',
		component: (resolve) => require(['@/views/grouptour/contractManage/unusedContract.vue'], resolve)
	},
	{//资源中心 合同管理 合同管理列表 
		meta: {
			parentMenu: '销售中心',
			breadcrumb: [{ title: '销售中心', url: '' }, { title: '合同管理', url: '' }, { title: '合同管理列表', url: '' }]
		},
		path: '/ContractManage/contractList',
		name: 'contractList',
		component: (resolve) => require(['@/views/grouptour/contractManage/contractList.vue'], resolve)
	},
	{//资源中心 合同管理 丢失合同管理
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '丢失合同管理', url: '' }]
		},
		path: '/ContractManage/lostContractManagement',
		name: 'lostContractManagement',
		component: (resolve) => require(['@/views/grouptour/contractManage/lostContractManagement.vue'], resolve)
	},
	{//资源中心 合同管理 作废合同管理 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '作废合同管理', url: '' }]
		},
		path: '/ContractManage/invalidContractManagement',
		name: 'invalidContractManagement',
		component: (resolve) => require(['@/views/grouptour/contractManage/invalidContractManagement.vue'], resolve)
	},
	{//资源中心 合同管理 合同限制设置 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '限制设置', url: '' }]
		},
		path: '/ContractManage/contractLimit',
		name: 'contractLimit',
		component: (resolve) => require(['@/views/grouptour/contractManage/contractLimit.vue'], resolve)
	}, {//资源中心 合同管理 电子合同限制设置 
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '限制设置', url: '' }]
		},
		path: '/ContractManage/e-contractLimit',
		name: 'e-contractLimit',
		component: (resolve) => require(['@/views/grouptour/contractManage/e-contractLimit.vue'], resolve)
	},
	{//资源中心 合同管理 核销合同
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '核销合同', url: '' }]
		},
		path: '/ContractManage/verification',
		name: 'verification',
		component: (resolve) => require(['@/views/grouptour/contractManage/verification.vue'], resolve)
	},
	{//资源中心 合同管理 电子合同列表
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '电子合同列表', url: '' }]
		},
		path: '/ContractManage/electronicContractList',
		name: 'electronicContractList',
		component: (resolve) => require(['@/views/grouptour/contractManage/electronicContractList.vue'], resolve)
	},
	{//资源中心 合同管理 电子合同统计
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '电子合同统计', url: '' }]
		},
		path: '/ContractManage/electronicContractAnalysis',
		name: 'electronicContractAnalysis',
		component: (resolve) => require(['@/views/grouptour/contractManage/electronicContractAnalysis.vue'], resolve)
	},
	{//资源中心 合同管理 电子合同详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '电子合同详情', url: '' }]
		},
		path: '/ContractManage/electronicContractDetail',
		name: 'electronicContractDetail',
		component: (resolve) => require(['@/views/grouptour/contractManage/electronicContractDetail.vue'], resolve)
	},
	//资源中心 合同管理 合同已派发统计
	{
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '合同管理', url: '' }, { title: '合同派发统计', url: '/ContractManage/sentContractList' }]
		},
		path: '/ContractManage/sentContractList',
		name: 'sentContractList',
		component: (resolve) => require(['@/views/grouptour/contractManage/sentContractList.vue'], resolve)
	},
	//   酒店业务 ----------
	{//资源中心 酒店 酒店基础信息设置
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店', url: '' }, { title: '酒店基础信息设置', url: '' }]
		},
		path: '/hotel/hotelBasicInfoSetting',
		name: 'hotelBasicInfoSetting',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelBasicInfoSetting.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店', url: '' }, { title: '酒店资料库管理', url: '' }]
		},
		path: '/hotel/hotelDBManagement',
		name: 'hotelDBManagement',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelDBManagement.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加基本信息
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '基本信息', url: '' }]
		},
		path: '/hotel/basicInfo',
		name: 'basicInfo',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/basicInfo.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店房型
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店房型', url: '' }]
		},
		path: '/hotel/hotelHouseType',
		name: 'hotelHouseType',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelHouseType.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店餐厅
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店餐厅', url: '' }]
		},
		path: '/hotel/hotelRestaurant',
		name: 'hotelRestaurant',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelRestaurant.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店美食
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店美食', url: '' }]
		},
		path: '/hotel/hotelFood',
		name: 'hotelFood',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelFood.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店会议室
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店会议室', url: '' }]
		},
		path: '/hotel/hotelConferenceRoom',
		name: 'hotelConferenceRoom',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelConferenceRoom.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店配套设施
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店配套设施', url: '' }]
		},
		path: '/hotel/hotelFacilities',
		name: 'hotelFacilities',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/hotelFacilities.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  添加酒店交通路线
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '酒店交通路线', url: '' }]
		},
		path: '/hotel/trafficRoutes',
		name: 'trafficRoutes',
		component: (resolve) => require(['@/views/hotel/resourceCenter/addHotel/trafficRoutes.vue'], resolve)
	},
	{//资源中心 酒店 酒店资料库管理  编辑酒店
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店资料库管理', url: '' }, { title: '编辑酒店', url: '' }]
		},
		path: '/hotel/editHotel',
		name: 'editHotel',
		component: (resolve) => require(['@/views/hotel/resourceCenter/editHotel/editHotel.vue'], resolve)
	},
	{//资源中心 酒店 酒店详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店列表', url: '' }, { title: '酒店详情', url: '' }]
		},
		path: '/hotel/hotelDetail/:id',
		name: 'hotelDetail',
		component: (resolve) => require(['@/views/hotel/resourceCenter/hotelDetail.vue'], resolve)
	},
	{//资源中心 酒店 酒店商品列表
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店列表', url: '' }, { title: '酒店商品列表', url: '' }]
		},
		path: '/hotel/hotelProductList',
		name: 'hotelProductList',
		component: (resolve) => require(['@/views/hotel/resourceCenter/product/hotelProductList.vue'], resolve)
	},
	{//资源中心 酒店 酒店商品详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店列表', url: '' }, { title: '酒店商品详情', url: '' }]
		},
		path: '/hotel/hotelProductDetail/:id',
		name: 'hotelProductDetail',
		component: (resolve) => require(['@/views/hotel/resourceCenter/product/hotelProductDetail.vue'], resolve)
	},
	{//资源中心 酒店 酒店商品房间详情
		meta: {
			parentMenu: '资源中心',
			breadcrumb: [{ title: '资源中心', url: '' }, { title: '酒店列表', url: '' }, { title: '酒店商品详情', url: '' }]
		},
		path: '/hotel/hotelProductRoomDetail/:id',
		name: 'hotelProductRoomDetail',
		component: (resolve) => require(['@/views/hotel/resourceCenter/product/hotelProductRoomDetail.vue'], resolve)
	},
]
export default pages
