//销售中心路由
var pages = [{
    path: '/sellcenter/hotelProductList',//酒店列表
    name: 'hotelProductList',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '酒店', url: '' }, { title: '酒店列表', url: '' }]
    },
    component: (resolve) => require(['@/views/sellcenter/hotel/hotelProductList.vue'], resolve)
}, {
    path: '/sellcenter/hotelProductDetail/:id',//酒店详情
    name: 'hotelProductDetail',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '酒店列表', url: '' }, { title: '酒店详情', url: '' }]
    },
    component: (resolve) => require(['@/views/sellcenter/hotel/hotelProductDetail.vue'], resolve)
}, {
    path: '/sellcenter/hotelProductRoomDetail/:id',//商品详情
    name: 'hotelProductRoomDetail',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '酒店列表', url: '' }, { title: '商品详情', url: '' }]
    },
    component: (resolve) => require(['@/views/sellcenter/hotel/hotelProductRoomDetail.vue'], resolve)
}, {
    path: '/sellcenter/hotelBooking/:id',//酒店预订
    name: 'hotelBooking',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '酒店销售列表', url: '' }, { title: '酒店预订', url: '' }]
    },
    component: (resolve) => require(['@/views/sellcenter/hotel/hotelBooking.vue'], resolve)
},
{//销售中心---线路预定
    path: '/sellcenter/linelist',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/linelist' }, { title: '线路预订页', url: '/sellcenter/linelist' }]
    },
    name: 'linelist',
    component: (resolve) => require(['@/views/sellcenter/linelist.vue'], resolve)
},
{//销售中心---团期列表
    path: '/sellcenter/grouplist',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/grouplist' }, { title: '团期列表', url: '/sellcenter/grouplist' }]
    },
    name: 'grouplist',
    component: (resolve) => require(['@/views/sellcenter/grouplist.vue'], resolve)
},
{//销售中心---线路预定
    path: '/',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/linelist' }, { title: '线路预订页', url: '/sellcenter/linelist' }]
    },
    name: 'linelist',
    component: (resolve) => require(['@/views/sellcenter/linelist.vue'], resolve)
},
{//销售中心---线路详情
    path: '/sellcenter/linedetails',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '/sellcenter/default' }, { title: '线路预订', url: '/sellcenter/linelist' }, { title: '线路详情页', url: '/sellcenter/linedetails' }]
    },
    name: 'linedetails',
    component: (resolve) => require(['@/views/sellcenter/linedetails.vue'], resolve)
},
//线路产品添加预留
{
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '/sellcenter/default' }, { title: '线路预订', url: '/sellcenter/linelist' }, { title: '线路报名页', url: '/grouptour/addReverse' }]
    },
    path: '/grouptour/addReverse',
    name: 'addReverse',
    component: (resolve) => require(['@/views/grouptour/addReverse.vue'], resolve)
},
//下单
{
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '/sellcenter/default' }, { title: '线路预订', url: '/sellcenter/linelist' }, { title: '线路报名页', url: '/grouptour/baoming' }]
    },
    path: '/grouptour/baoming',
    name: 'baoming',
    component: (resolve) => require(['@/views/grouptour/baoming.vue'], resolve)
},

//合同列表及详情
{
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '/sellcenter/default' }, { title: '合同管理', url: '/sellcenter/electronicContractList' }, { title: '电子合同列表', url: '/sellcenter/electronicContractList' }]
    },
    path: '/sellcenter/electronicContractList',
    name: 'electronicContractList',
    component: (resolve) => require(['@/views/sellcenter/contracts/electronicContractList.vue'], resolve)
}, {
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '/sellcenter/default' }, { title: '合同管理', url: '/sellcenter/electronicContractDetail' }, { title: '线路报名页', url: '/sellcenter/electronicContractDetail' }]
    },
    path: '/sellcenter/electronicContractDetail',
    name: 'electronicContractDetail',
    component: (resolve) => require(['@/views/sellcenter/contracts/electronicContractDetail.vue'], resolve)
},

//资源平台   外部订单
{
    path: '/sellcenter/externalLineList',
    alias: '/sellcenter/default',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/externalLineList' }, { title: '平台产品预订列表', url: '/sellcenter/externalLineList' }]
    },
    name: 'externalLineList',
    component: (resolve) => require(['@/views/sellcenter/externalLine/externalLineList.vue'], resolve)
},
{
    path: '/sellcenter/externalLineDetail',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/externalLineDetail' }, { title: '平台产品预订详情', url: '/sellcenter/externalLineDetail' }]
    },
    name: 'externalLineDetail',
    component: (resolve) => require(['@/views/sellcenter/externalLine/externalLineDetail.vue'], resolve)
},
{
    path: '/sellcenter/lineDetailForUTour',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/lineDetailForUTour' }, { title: '平台产品预订详情', url: '/sellcenter/lineDetailForUTour' }]
    },
    name: 'lineDetailForUTour',
    component: (resolve) => require(['@/views/sellcenter/externalLine/lineDetailForUTour.vue'], resolve)
},
{
    path: '/sellcenter/reservationLine',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/reservationLine' }, { title: '平台产品预订页', url: '/sellcenter/reservationLine' }]
    },
    name: 'reservationLine',
    component: (resolve) => require(['@/views/sellcenter/externalLine/reservationLine.vue'], resolve)
},
{
    path: '/sellcenter/createLineOrderForUtour',
    meta: {
        parentMenu: '销售中心',
        breadcrumb: [{ title: '销售中心', url: '' }, { title: '线路预订', url: '/sellcenter/createLineOrderForUtour' }, { title: '平台产品预订页', url: '/sellcenter/createLineOrderForUtour' }]
    },
    name: 'createLineOrderForUtour',
    component: (resolve) => require(['@/views/sellcenter/externalLine/createLineOrderForUtour.vue'], resolve)
}
]
export default pages 