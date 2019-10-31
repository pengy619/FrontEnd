var pages=[{
      path: '/airplane/purchase',//包机采购管理
      name: 'purchase',
      meta:{
        breadcrumb:[{ title:'包机采购管理',url:'/airplane/purchase'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-list.vue'], resolve) 
    },{
      path: '/airplane/purchase-detail/:id',//采购单详情
      name: 'purchase-detail',
      meta:{
        breadcrumb:[{title:'包机采购管理', url:'/airplane/purchase' },{ title:'包机采购单详情',url:'/airplane/purchase-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-detail.vue'], resolve) 
    },{
      path: '/airplane/purchase-add',//新增包机采购单
      name: 'purchase-add',
      meta:{
        breadcrumb:[{title:'包机采购管理', url:'/airplane/purchase' },{ title:'新增包机采购单',url:'/airplane/purchase-add'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-add.vue'], resolve) 
    },{
      path: '/airplane/purchase-sale/:id',//定价销售
      name: 'purchase-sale',
      meta:{
        breadcrumb:[{title:'包机采购管理', url:'/airplane/purchase' },{ title:'定价销售',url:'/airplane/purchase-sale'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-sale.vue'], resolve) 
    },{
      path: '/airplane/purchase-tuiqie',//退切
      name: 'purchase-tuiqie',
      meta:{
        breadcrumb:[{title:'包机采购管理', url:'/airplane/purchase' },{ title:'退切',url:'/airplane/purchase-tuiqie'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-tuiqie.vue'], resolve) 
    },{
      path: '/airplane/shuaiwei-price/:id',//甩位定价
      name: 'shuaiwei-price',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'甩位',url:'/airplane/shuaiwei-price'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/shuaiwei-price.vue'], resolve) 
    },{
      path: '/airplane/air-detail/:id',//查看机票详情
      name: 'air-detail',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'详情',url:'/airplane/air-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/air-detail.vue'], resolve) 
    },{
      path: '/airplane/stock-kongwei/:id',//控位
      name: 'stock-kongwei',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'控位',url:'/airplane/stock-kongwei'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-kongwei.vue'], resolve) 
    },{
      path: '/airplane/stock-qiewei/:id',//切位
      name: 'stock-qiewei',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'切位',url:'/airplane/stock-qiewei'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-qiewei.vue'], resolve) 
    },{
      path: '/airplane/modify-price/:id',//修改机票价格
      name: 'modify-price',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'修改',url:'/airplane/modify-price'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/modify-price.vue'], resolve) 
    },{
      path: '/airplane/stock-list',//包机库存列表
      name: 'stock-list',
      meta:{
        breadcrumb:[{title:'包机库存列表', url:'/airplane/stock-list' }]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-list.vue'], resolve) 
    },{
      path: '/airplane/air-rules',//包机配置规则
      name: 'air-rules',
      component:(resolve) => require(['@/views/airplane/air-rules/air-rules.vue'], resolve) 
    },{
      path: '/airplane/basic-info',//基础信息设置--与原型图有出入，待修改
      name: 'basic-info',
      meta:{
        breadcrumb:[{title:'基础信息设置', url:'/airplane/basic-info' }]
      },
      component:(resolve) => require(['@/views/airplane/basic-info/basic-info.vue'], resolve) 
    },{
      path: '/airplane/company-list',//航空公司管理
      name: 'company-list',
      meta:{
        breadcrumb:[{title:'航空公司管理', url:'/airplane/company-list'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-list.vue'], resolve) 
    },{
      path: '/airplane/company-add',//新增航空公司
      name: 'company-add',
      meta:{
        breadcrumb:[{title:'航空公司管理', url:'/airplane/company-list' },{ title:'新增',url:'/airplane/company-add'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-add.vue'], resolve) 
    },{
      path: '/airplane/company-edit/:id',//编辑航空公司
      name: 'company-edit',
      meta:{
        breadcrumb:[{title:'航空公司管理', url:'/airplane/company-list' },{ title:'编辑',url:'/airplane/company-edit'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-edit.vue'], resolve) 
    },{
      path: '/airplane/shuaiwei-detail',//查看甩位详情
      name: 'shuaiwei-detail',
      meta:{
        breadcrumb:[{title:'基础信息设置', url:'/airplane/basic-info' },{ title:'详情',url:'/airplane/shuaiwei-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/deploy/shuaiwei-detail.vue'], resolve) 
    },{
      path: '/airplane/deploy-list',//库存调配
      name: 'deploy-list',
      meta:{
        breadcrumb:[{title:'库存调配', url:'/airplane/deploy-list'}]
      },
      component:(resolve) => require(['@/views/airplane/deploy/deploy-list.vue'], resolve) 
    },{
      path: '/airplane/reservation-list',//机票预订列表
      name: 'reservation-list',
      meta:{
        breadcrumb:[{title:'机票预订列表', url:'/airplane/reservation-list'}]
      },
      component:(resolve) => require(['@/views/airplane/reservation/reservation-list.vue'], resolve) 
    },{
      path: '/airplane/reservation-air/:id',//预定机票
      name: 'reservation-air',
      meta:{
        breadcrumb:[{title:'预订机票', url:'/airplane/reservation-air'}]
      },
      component:(resolve) => require(['@/views/airplane/reservation/reservation-air.vue'], resolve) 
    }]
export default pages