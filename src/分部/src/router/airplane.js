var pages=[{
      path: '/airplane/purchase',//包机采购管理
      name: 'purchase',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{ title:'包机采购管理',url:'/airplane/purchase'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-list.vue'], resolve)
    },{
      path: '/airplane/purchase-detail/:id',//采购单详情
      name: 'purchase-detail',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机采购管理', url:'/airplane/purchase' },{ title:'包机采购单详情',url:'/airplane/purchase-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-detail.vue'], resolve)
    },{
      path: '/airplane/view-pricing',//采购单详情
      name: 'view-pricing',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机采购管理', url:'/airplane/purchase' },{ title:'查看定价详情',url:'/airplane/view-pricing'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/view-pricing.vue'], resolve)
    },{
      path: '/airplane/purchase-add',//新增包机采购单
      name: 'purchase-add',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机采购管理', url:'/airplane/purchase' },{ title:'新增包机采购单',url:'/airplane/purchase-add'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-add.vue'], resolve)
    },{
      path: '/airplane/purchase-sale/:id',//定价销售
      name: 'purchase-sale',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机采购管理', url:'/airplane/purchase' },{ title:'定价销售',url:'/airplane/purchase-sale'}]
      },
      component:(resolve) => require(['@/views/airplane/purchase/purchase-sale.vue'], resolve)
    },{
      path: '/airplane/shuaiwei-price/:id',//甩位定价
      name: 'shuaiwei-price',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'甩位',url:'/airplane/shuaiwei-price'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/shuaiwei-price.vue'], resolve)
    },{
      path: '/airplane/air-detail/:id',//查看机票详情
      name: 'air-detail',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'详情',url:'/airplane/air-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/air-detail.vue'], resolve)
    },{
      path: '/airplane/stock-kongwei/:id',//控位
      name: 'stock-kongwei',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'控位',url:'/airplane/stock-kongwei'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-kongwei.vue'], resolve)
    },{
      path: '/airplane/stock-qiewei/:id',//切位
      name: 'stock-qiewei',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'切位',url:'/airplane/stock-qiewei'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-qiewei.vue'], resolve)
    },{
      path: '/airplane/stock-tuiqie/:id',//退切
      name: 'stock-tuiqie',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'退切',url:'/airplane/stock-tuiqie'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-tuiqie.vue'], resolve)
    },{
      path: '/airplane/modify-price/:id',//修改机票价格
      name: 'modify-price',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'包机库存列表', url:'/airplane/stock-list' },{ title:'修改',url:'/airplane/modify-price'}]
      },
      component:(resolve) => require(['@/views/airplane/stock/modify-price.vue'], resolve)
    },{
      path: '/airplane/stock-list',//包机库存列表
      name: 'stock-list',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{title:'包机库存列表', url:'/airplane/stock-list' }]
      },
      component:(resolve) => require(['@/views/airplane/stock/stock-list.vue'], resolve)
    },{
      path: '/airplane/air-rules',//包机配置规则
      name: 'air-rules',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{title:'包机配置规则', url:'/airplane/air-rules' }]
      },
      component:(resolve) => require(['@/views/airplane/air-rules/air-rules.vue'], resolve)
    },{
      path: '/airplane/basic-info',//基础信息设置
      name: 'basic-info',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{title:'基础信息设置', url:'/airplane/basic-info' }]
      },
      component:(resolve) => require(['@/views/airplane/basic-info/basic-info.vue'], resolve)
    },{
      path: '/airplane/company-list',//航空公司管理
      name: 'company-list',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{title:'航空公司管理', url:'/airplane/company-list'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-list.vue'], resolve)
    },{
      path: '/airplane/company-add',//新增航空公司
      name: 'company-add',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'航空公司管理', url:'/airplane/company-list' },{ title:'新增',url:'/airplane/company-add'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-add.vue'], resolve)
    },{
      path: '/airplane/company-edit/:id',//编辑航空公司
      name: 'company-edit',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'航空公司管理', url:'/airplane/company-list' },{ title:'编辑',url:'/airplane/company-edit'}]
      },
      component:(resolve) => require(['@/views/airplane/company/company-edit.vue'], resolve)
    },{
      path: '/airplane/shuaiwei-detail',//查看甩位详情
      name: 'shuaiwei-detail',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'库存调配', url:'/airplane/deploy-list' },{ title:'详情',url:'/airplane/shuaiwei-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/deploy/shuaiwei-detail.vue'], resolve)
    },{
      path: '/airplane/kongwei-detail',//查看控位详情
      name: 'kongwei-detail',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{title:'库存调配', url:'/airplane/deploy-list' },{ title:'详情',url:'/airplane/kongwei-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/deploy/kongwei-detail.vue'], resolve)
    },{
      path: '/airplane/deploy-list',//库存调配
      name: 'deploy-list',
      meta:{
        breadcrumb:[{ title:'资源中心',url:''},{ title:'包机业务',url:''},{title:'库存调配', url:'/airplane/deploy-list'}]
      },
      component:(resolve) => require(['@/views/airplane/deploy/deploy-list.vue'], resolve)
    },{
      path: '/airplane/airticket-list',//机票预订列表
      name: 'airticket-list',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{ title:'机票预订',url:''},{title:'机票预订列表', url:'/airplane/airticket-list'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket/airticket-list.vue'], resolve)
    },{
      path: '/airplane/airticket-book',//预定机票
      name: 'airticket-book',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{title:'机票预订列表', url:'/airplane/airticket-list'},{title:'预订机票', url:'/airplane/airticket-book'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket/airticket-book.vue'], resolve)
    },{
      path: '/airplane/reservation/:id',//机票预订-预留单
      name: 'reservation',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{title:'机票预订列表', url:'/airplane/airticket-list'},{title:'预留单', url:'/airplane/reservation'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket/reservation.vue'], resolve)
    },{
      path: '/airplane/airticket-shuaiwei-list',//甩位机票预订列表
      name: 'airticket-shuaiwei-list',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{ title:'机票预订',url:''},{title:'甩位机票预订列表', url:'/airplane/airticket-shuaiwei-list'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket-shuaiwei/airticket-shuaiwei-list.vue'], resolve)
    },{
      path: '/airplane/airticket-shuaiwei-book',//甩位预定机票
      name: 'airticket-shuaiwei-book',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{title:'甩位机票预订列表', url:'/airplane/airticket-shuaiwei-list'},{title:'甩位机票预订', url:'/airplane/airticket-shuaiwei-book'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket-shuaiwei/airticket-shuaiwei-book.vue'], resolve)
    },{
      path: '/airplane/reservation-shuaiwei',//甩位机票预订-预留单
      name: 'reservation-shuaiwei',
      meta:{
        breadcrumb:[{ title:'销售中心',url:''},{title:'甩位机票预订列表', url:'/airplane/airticket-shuaiwei-list'},{title:'甩位预留单', url:'/airplane/reservation-shuaiwei'}]
      },
      component:(resolve) => require(['@/views/airplane/airticket-shuaiwei/reservation-shuaiwei.vue'], resolve)
    },{
      path: '/airplane/online-order',//线上订单列表
      name: 'online-order',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{ title:'机票订单',url:''},{title:'线上订单列表', url:'/airplane/online-order'}]
      },
      component:(resolve) => require(['@/views/airplane/online-order/online-order.vue'], resolve)
    },{
      path: '/airplane/online-order-detail/:id',//线上订单详情
      name: 'online-order-detail',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{title:'线上订单列表', url:'/airplane/online-order'},{title:'线上订单详情', url:'/airplane/online-order-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/online-order/online-order-detail.vue'], resolve)
    },{
      path: '/airplane/reservation-list',//预留单列表
      name: 'reservation-list',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{ title:'机票订单',url:''},{title:'预留单列表', url:'/airplane/reservation-list'}]
      },
      component:(resolve) => require(['@/views/airplane/reservation/reservation-list.vue'], resolve)
    },{
      path: '/airplane/reservation-detail/:id',//预留单详情
      name: 'reservation-detail',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{title:'预留单列表', url:'/airplane/reservation-list'},{title:'预留单详情', url:'/airplane/reservation-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/reservation/reservation-detail.vue'], resolve)
    },{
      path: '/airplane/qiewei-order',//切位订单列表
      name: 'qiewei-order',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{ title:'机票订单',url:''},{title:'切位订单列表', url:'/airplane/qiewei-order'}]
      },
      component:(resolve) => require(['@/views/airplane/qiewei-order/qiewei-order.vue'], resolve)
    },{
      path: '/airplane/qiewei-order-detail/:id',//查看切位订单详情
      name: 'qiewei-order-detail',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{title:'切位订单列表', url:'/airplane/qiewei-order'},{title:'切位订单详情', url:'/airplane/qiewei-order-detail'}]
      },
      component:(resolve) => require(['@/views/airplane/qiewei-order/qiewei-order-detail.vue'], resolve)
    },{
      path: '/airplane/qiewei-recovery/:id',//回收切位
      name: 'qiewei-recovery',
      meta:{
        breadcrumb:[{ title:'订单中心',url:''},{title:'切位订单列表', url:'/airplane/qiewei-order'},{title:'回收切位', url:'/airplane/qiewei-recovery'}]
      },
      component:(resolve) => require(['@/views/airplane/qiewei-order/qiewei-recovery.vue'], resolve)
    }]
export default pages
