var pages = [
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/settingList' }, { title: '业务类型列表', url: '/singleItem/settingList' }]
        },
        path: '/singleItem/settingList',
        name: 'settingList',
        component: (resolve) => require(['@/views/singleItem/settingList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/addSetting' }, { title: '添加业务类型', url: '/singleItem/addSetting' }]
        },
        path: '/singleItem/addSetting',
        name: 'addSetting',
        component: (resolve) => require(['@/views/singleItem/addSetting.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/singleItemList' }, { title: '单项资源', url: '/singleItem/singleItemList' }]
        },
        path: '/singleItem/singleItemList',
        name: 'singleItemList',
        component: (resolve) => require(['@/views/singleItem/singleItemList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/waitAuditList' }, { title: '待审核单项产品', url: '/singleItem/waitAuditList' }]
        },
        path: '/singleItem/waitAuditList',
        name: 'waitAuditList',
        component: (resolve) => require(['@/views/singleItem/waitAuditList.vue'], resolve)
    }, {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/auditedList' }, { title: '已审核单项产品', url: '/singleItem/auditedList' }]
        },
        path: '/singleItem/auditedList',
        name: 'auditedList',
        component: (resolve) => require(['@/views/singleItem/auditedList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/singleProductDetail' }, { title: '单项产品详情', url: '/singleItem/singleProductDetail' }]
        },
        path: '/singleItem/singleProductDetail',
        name: 'singleProductDetail',
        component: (resolve) => require(['@/views/singleItem/singleProductDetail.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/resourceAudit' }, { title: '审核页面', url: '/singleItem/resourceAudit' }]
        },
        path: '/singleItem/resourceAudit',
        name: 'resourceAudit',
        component: (resolve) => require(['@/views/singleItem/resourceAudit.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderList' }, { title: '单项订单列表', url: '/singleItem/singleOrderList' }]
        },
        path: '/singleItem/singleOrderList',
        name: 'singleOrderList',
        component: (resolve) => require(['@/views/singleItem/singleOrderList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderDetail' }, { title: '单项订单详情', url: '/singleItem/singleOrderDetail' }]
        },
        path: '/singleItem/singleOrderDetail',
        name: 'singleOrderDetail',
        component: (resolve) => require(['@/views/singleItem/singleOrderDetail.vue'], resolve)
    },
    //单项改价
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/changePriceSingleOrder' }, { title: '单项改价列表', url: '/singleItem/changePriceSingleOrder' }]
        },
        path: '/singleItem/changePriceSingleOrder',
        name: 'changePriceSingleOrder',
        component: (resolve) => require(['@/views/singleItem/changePriceSingleOrder.vue'], resolve)
    }
]
export default pages