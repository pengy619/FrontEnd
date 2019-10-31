var pages = [
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '/systemSettings/bulletinList' }, { title: '公告列表', url: '/systemSettings/bulletinList' }]
        },
        path: '/systemSettings/bulletinList',
        name: 'bulletinList',
        component: (resolve) => require(['@/views/systemSettings/bulletinList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '新增公告内容', url: '/systemSettings/addBulletin' }]
        },
        path: '/systemSettings/addBulletin',
        name: 'addBulletin',
        component: (resolve) => require(['@/views/systemSettings/addBulletin.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '公告板块', url: '/systemSettings/bulletinBoard' }]
        },
        path: '/systemSettings/bulletinBoard',
        name: 'bulletinBoard',
        component: (resolve) => require(['@/views/systemSettings/bulletinBoard.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '学习板块', url: '/systemSettings/learningPlate' }]
        },
        path: '/systemSettings/learningPlate',
        name: 'learningPlate',
        component: (resolve) => require(['@/views/systemSettings/learningPlate.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '学习板块详情', url: '/systemSettings/learningPlateDetail' }]
        },
        path: '/systemSettings/learningPlateDetail',
        name: 'learningPlateDetail',
        component: (resolve) => require(['@/views/systemSettings/learningPlateDetail.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '系统设置',
            breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '公告板块详情', url: '/systemSettings/bulletinBoardDetail' }]
        },
        path: '/systemSettings/bulletinBoardDetail',
        name: 'bulletinBoardDetail',
        component: (resolve) => require(['@/views/systemSettings/bulletinBoardDetail.vue'], resolve)
    }
]
export default pages