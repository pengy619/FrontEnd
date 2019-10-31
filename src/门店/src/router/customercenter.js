// 客户中心

//旅客资料
var pages=[{
    path: '/customercenter/traveller-passage',//旅客资料
    name: 'traveller-passage',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'旅客资料',url:'/customercenter/traveller-passage'},{ title:'旅客资料',url:'/customercenter/traveller-passage'}]
    },
    component:(resolve) => require(['@/views/customercenter/traveller/traveller-passage.vue'], resolve)
},{
    path: '/customercenter/traveller-add',//新增旅客信息
    name: 'traveller-add',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'旅客资料',url:'/customercenter/traveller-passage'},{ title:'新建旅客资料',url:'/customercenter/traveller-add'}]
    },
    component:(resolve) => require(['@/views/customercenter/traveller/traveller-add.vue'], resolve)
},{
    path: '/customercenter/traveller-edit/:id',//编辑旅客资料
    name: 'traveller-edit',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'旅客资料',url:'/customercenter/traveller-passage'},{ title:'编辑旅客资料',url:'/customercenter/traveller-edit/:id'}]
    },
    component:(resolve) => require(['@/views/customercenter/traveller/traveller-edit.vue'], resolve)
},{
    path: '/customercenter/travellerDetailes/',//旅客详情
    name: 'travellerDetailes',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'旅客资料',url:'/customercenter/traveller-passage'},{ title:'旅客详情页',url:'/customercenter/travellerDetailes'}]
    },
    component:(resolve) => require(['@/views/customercenter/traveller/travellerDetailes.vue'], resolve)
},{
    path: '/customercenter/straight-custormer',//直客管理
    name: 'straight-custromer',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'客户管理',url:'/customercenter/straight-custormer'},{ title:'客户列表',url:'/customercenter/straight-custormer'}]
    },
    component:(resolve) => require(['@/views/customercenter/straight/straight-custormer.vue'], resolve)
},{
    path: '/customercenter/straight-add',//新增直客
    name: 'straight-add',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'客户管理',url:'/customercenter/straight-custormer'},{ title:'新建客户资料',url:'/customercenter/straight-add'}]
    },
    component:(resolve) => require(['@/views/customercenter/straight/straight-add.vue'], resolve)
},{
    path: '/customercenter/straight-edit/:id',//修改直客
    name: 'straight-edit',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'客户管理',url:'/customercenter/straight-custormer'},{ title:'编辑客户资料',url:'/customercenter/straight-edit/:id'}]
    },
    component:(resolve) => require(['@/views/customercenter/straight/straight-edit.vue'], resolve)
},

//常用供应商管理
{
    path: '/customercenter/supplier-list',//常用供应商管理
    name: 'supplier-list',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'常用供应商管理',url:'/customercenter/supplier-list'},{ title:'常用供应商列表',url:'/customercenter/supplier-list'}]
    },
    component:(resolve) => require(['@/views/customercenter/supplier/supplier-list.vue'], resolve)
},
{
    path: '/customercenter/supplier-edit',//添加或编辑供应商
    name: 'supplier-edit',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{ title:'客户中心',url:'/customercenter/default'},{ title:'常用供应商管理',url:'/customercenter/supplier-list'},{ title:'添加/编辑供应商',url:'/customercenter/supplier-edit'}]
    },
    component:(resolve) => require(['@/views/customercenter/supplier/supplier-edit.vue'], resolve)
},


//结算单位管理
{
    path: '/customercenter/jiesuandanwei',//结算单位
    alias:'/customercenter/default',
    name: 'jiesuandanwei',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:''},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'结算单位列表',url:'/customercenter/jiesuandanwei'}]
    },
    component:(resolve) => require(['@/views/customercenter/jiesuan/jiesuandanwei.vue'], resolve)
},{
    path: '/customercenter/jiesuandanwei-add',//结算单位
    name: 'jiesuandanwei-add',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'新建结算单位',url:'/customercenter/jiesuandanwei-add'}]
    },
    component:(resolve) => require(['@/views/customercenter/jiesuan/jiesuandanwei-add.vue'], resolve)
},{
    path: '/customercenter/settleClient-edit/:id',//修改结算单位
    name: 'settleClient-edit',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'结算单位编辑',url:'/customercenter/settleClient-edit/:id'}]
    },
    component:(resolve) => require(['@/views/customercenter/jiesuan/settleClient-edit.vue'], resolve)
},{
    path: '/customercenter/jiesuan-details/:id',//结算详情
    name: 'jiesuan-details',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'结算单位详情',url:'/customercenter/jiesuan-details/:id'}]
    },
    component:(resolve) => require(['@/views/customercenter/jiesuan/jiesuan-details.vue'], resolve)
},
{
    path: '/customercenter/invoice/:id',//结算发票
    name: 'invoice',
    meta: {
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'发票列表',url:'/customercenter/invoice/'}]
    },
    component:(resolve) => require(['@/views/customercenter/jiesuan/invoice.vue'], resolve)
}]
export default pages 