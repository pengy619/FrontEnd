
var papes = [{
    path: '/systemsettings/mendianguanli',//门店管理
    name: 'mendianguanli',
    meta: {
        breadcrumb: [{ title: '门店管理', url: '/systemsettings/mendianguanli' }]
    },
    component: (resolve) => require(['@/views/systemsettings/mendianguanli.vue'], resolve)
},
{
    path: '/systemsettings/shopInfo',//门店基础信息编辑
    name: 'shopInfo',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: 'systemsettings/default' }, { title: '基础信息设置', url: '/systemsettings/shopInfo' }, { title: '基础信息设置', url: '/systemsettings/shopInfo' }]
    },
    component: (resolve) => require(['@/views/systemsettings/shopInfo.vue'], resolve)
},

{
    path: '/systemsettings/staffmanagement',//员工管理
    alias: '/systemsettings/default',
    name: 'staffmanagement',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '门店管理', url: '/systemsettings/staffmanagement' }, { title: '员工管理', url: '/systemsettings/staffmanagement' }]
    },
    component: (resolve) => require(['@/views/systemsettings/storemanagement/staffmanagement.vue'], resolve)
}, {
    path: '/systemsettings/setanagement',//新建员工
    name: 'setanagement',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '/systemsettings/default' }, { title: '门店管理', url: '/systemsettings/staffmanagement' }, { title: '新建员工', url: '/systemsettings/setanagement' }]
    },
    component: (resolve) => require(['@/views/systemsettings/storemanagement/setanagement.vue'], resolve)
}, {
    path: '/systemsettings/convertOrder/:id',//修改员工列表
    name: 'convertOrder',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '/systemsettings/default' }, { title: '门店管理', url: '/systemsettings/staffmanagement' }, { title: '员工资料编辑', url: '/systemsettings/convertOrder/:id' }]
    },
    component: (resolve) => require(['@/views/systemsettings/storemanagement/convertOrder.vue'], resolve)
}, {
    path: '/systemsettings/details/:id',//员工信息详情
    name: 'details',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '/systemsettings/default' }, { title: '门店管理', url: '/systemsettings/staffmanagement' }, { title: '员工详情', url: '/systemsettings/details/:id' }]
    },
    component: (resolve) => require(['@/views/systemsettings/storemanagement/details.vue'], resolve)
},


// 角色管理
{
    path: '/systemsettings/role',//角色管理
    name: 'role',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '/systemsettings/default' }, { title: '角色管理', url: '/systemsettings/role' }, { title: '角色管理列表', url: '/systemsettings/role' }]
    },
    component: (resolve) => require(['@/views/systemsettings/role.vue'], resolve)
}, {
    path: '/systemsettings/role-add',//新增角色
    name: 'role-add',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '/systemsettings/default' }, { title: '角色管理', url: '/systemsettings/role' }, { title: '新增角色', url: '/systemsettings/role-add' }]
    },
    component: (resolve) => require(['@/views/systemsettings/role-add.vue'], resolve)
},
{//系统设置  门店详情
    path: '/grouptour/mendiandetail',
    name: 'mendianDetail',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '门店管理', url: '' }, { title: '门店详情', url: '/grouptour/mendiandetail' }]
    },
    component: (resolve) => require(['@/views/grouptour/mendianDetail.vue'], resolve)
},
{//系统设置  门店详情
    path: '/priceTable',
    name: 'priceTable',
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '门店管理', url: '' }, { title: '门店详情', url: '/grouptour/mendiandetail' }]
    },
    component: (resolve) => require(['@/components/priceTable.vue'], resolve)
},

//公告管理
{
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '公告板块', url: '/systemSettings/bulletinBoard' }]
    },
    path: '/systemSettings/bulletinBoard',
    name: 'bulletinBoard',
    component: (resolve) => require(['@/views/systemSettings/announcement/bulletinBoard.vue'], resolve)
},
{
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '公告板块详情', url: '/systemSettings/bulletinBoardDetail' }]
    },
    path: '/systemSettings/bulletinBoardDetail',
    name: 'bulletinBoardDetail',
    component: (resolve) => require(['@/views/systemSettings/announcement/bulletinBoardDetail.vue'], resolve)
},
{
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '学习板块', url: '/systemSettings/learningPlate' }]
    },
    path: '/systemSettings/learningPlate',
    name: 'learningPlate',
    component: (resolve) => require(['@/views/systemSettings/announcement/learningPlate.vue'], resolve)
},
{
    meta: {
        parentMenu: '系统设置',
        breadcrumb: [{ title: '系统设置', url: '' }, { title: '公告管理', url: '' }, { title: '学习板块详情', url: '/systemSettings/learningPlateDetail' }]
    },
    path: '/systemSettings/learningPlateDetail',
    name: 'learningPlateDetail',
    component: (resolve) => require(['@/views/systemSettings/announcement/learningPlateDetail.vue'], resolve)
},
]
export default papes
