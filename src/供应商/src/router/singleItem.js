var pages = [
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/addSingleItem' }, { title: '添加单项资源', url: '/singleItem/addSingleItem' }]
        },
        path: '/singleItem/addSingleItem',
        name: 'addSingleItem',
        component: (resolve) => require(['@/views/singleItem/addSingleItem.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/singleItemList' }, { title: '单项资源列表', url: '/singleItem/singleItemList' }]
        },
        path: '/singleItem/singleItemList',
        name: 'singleItemList',
        component: (resolve) => require(['@/views/singleItem/singleItemList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '资源中心',
            breadcrumb: [{ title: '资源中心', url: '' }, { title: '单项资源', url: '/singleItem/singleItemDetail' }, { title: '单项资源详情', url: '/singleItem/singleItemDetail' }]
        },
        path: '/singleItem/singleItemDetail',
        name: 'singleItemDetail',
        component: (resolve) => require(['@/views/singleItem/singleItemDetail.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单管理',
            breadcrumb: [{ title: '订单管理', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderList' }, { title: '单项订单列表', url: '/singleItem/singleOrderList' }]
        },
        path: '/singleItem/singleOrderList',
        name: 'singleOrderList',
        component: (resolve) => require(['@/views/singleItem/singleOrderList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单管理',
            breadcrumb: [{ title: '订单管理', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderDetail' }, { title: '单项订单详情', url: '/singleItem/singleOrderDetail' }]
        },
        path: '/singleItem/singleOrderDetail',
        name: 'singleOrderDetail',
        component: (resolve) => require(['@/views/singleItem/singleOrderDetail.vue'], resolve)
    }
]

export default pages