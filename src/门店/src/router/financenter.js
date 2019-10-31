//财务中心 -->
var pages = [
    {//缴款管理-->缴款申请
     path:'/financenter/adddemand',
     meta:{
        parentMenu: '财务中心',
         breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"缴款管理",url:'/financenter/adddemand'},{title:"缴款申请",url:'/financenter/adddemand'}]
     },
     name:"adddemand",
     component:(resolve) => require(['@/views/financenter/adddemand.vue'],resolve)
},
{
    path:'/financenter/demandetail',
    meta:{//缴款详情 -- 收款详情 （都是这个路由页面）
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"缴款管理",url:'/financenter/adddemand'},{title:"缴款详情页",url:'/financenter/demandetail'}]
    },
    name:'demandetail',
    component:(resolve)=>require(['@/views/financenter/demandetail.vue'],resolve)
},
{
    path:'/financenter/finacecheck',//缴款管理-->缴款账单
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"缴款管理",url:'/financenter/adddemand'},{title:"缴款账单记录",url:'/financenter/finacecheck'}]
    },
    name:'finacecheck',
    component:(resolve) => require(['@/views/financenter/finacecheck.vue'],resolve)
},
{//收款管理--->收款记录管理
    path:'/paymanage/payinfo',
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:''},{title:'收款管理',url:'/paymanage/payinfo'},{title:'收款记录管理',url:'/paymanage/payinfo'}]
    },
    name:'payinfo',
    component:(resolve) => require(["@/views/paymanage/payinfo.vue"],resolve)
},
{
    
    path:'/financenter/demandetail',
    meta:{//缴款详情 -- 收款详情 （都是这个路由页面）
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"收款管理",url:'/paymanage/payinfo'},{title:"收款详情页",url:'/financenter/demandetail'}]
    },
    name:'demandetail',
    component:(resolve)=>require(['@/views/financenter/demandetail.vue'],resolve)
},
{
    path:'/paymanage/refundmanage',
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:''},{title:'收款管理',url:'/paymanage/payinfo'},{title:'退款记录管理',url:'/paymanage/refundmanage'}]
    },
    name:'refundmanage',
    component:(resolve) => require(["@/views/paymanage/refundmanage.vue"],resolve)
},
{
    path:'/paymanage/refunddetail',
    meta:{
        parentMenu:'财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:'收款管理',url:'/paymanage/payinfo'},{title:'退款记录详情',url:'/paymanage/refunddetail'}]
    },
    name:'refunddetail',
    component:(resolve)=>require(["@/views/paymanage/refunddetail.vue"],resolve)
},
{
    path:"/paymanage/payinfoupdata",
    meta:{
        breadcrumb:[{title:'修改收款',url:'/paymanage/payinfoupdata'}]
    },
    name:"payinfoupdata",
    component:(resolve)=> require(["@/views/paymanage/payinfoupdata.vue"],resolve)
},
//代扣管理
{
    path:'/paymanage/deducteManage',
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:'收付款管理',url:''},{title:'代扣管理',url:'/paymanage/deducteManage'}]
    },
    name:"deducteManage",
    component:(resolve) => require(['@/views/paymanage/deducteManage.vue'],resolve)
 },
 //代收管理
{
    path:'/paymanage/collectManage',
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:'收付款管理',url:''},{title:'代收管理',url:'/paymanage/collectManage'}]
    },
    name:"collectManage",
    component:(resolve) => require(['@/views/paymanage/collectManage.vue'],resolve)
 },
{//充值中心-
    path: '/systemsettings/recharge',// 线下充值
    name: 'recharge',
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'充值管理',url:''},{title:'充值页',url:'/systemsettings/recharge'}]
    },
    component:(resolve) => require(['@/views/systemsettings/recharge.vue'], resolve)
},{
    path:'/systemsettings/rechargelist',//充值列表
    name:"rechargelist",
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'充值管理',url:''},{title:'充值列表',url:'/systemsettings/rechargelist'}]
    },
    component:(resolve)=> require(['@/views/systemsettings/rechargelist.vue'],resolve)
},
{
    path:'/systemsettings/rechargedetail',
    meta:{
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'充值管理',url:''},{title:'充值详情页',url:'/systemsettings/rechargedetail'}]
    },
    name:'rechargedetail',
    component:(resolve) => require(['@/views/systemsettings/rechargedetail.vue'],resolve)
},
{//账户资产
    path:'/paymanage/accountproperty',
    alias:'/paymanage/default',
    meta:{//账户资产
        parentMenu: '财务中心',
        breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账户资产',url:'/paymanage/default'},{title:'账户资产',url:'/paymanage/accountproperty'}]
    },
    name:'accountproperty',
    component:(resolve) => require(['@/views/paymanage/accountproperty.vue'],resolve)
},{
    path:'/paymanage/lineofCreditManage',
    meta:{//信用授权
        parentMenu:'财务中心',
        breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账户资产',url:''},{title:'信用额管理',url:'/paymanage/lineofCreditManage'}]
    },
    name:'lineofCreditManage',
    component:(resolve) =>require(['@/views/paymanage/lineofCreditManage.vue'],resolve)
},
{
    path:'/paymanage/balanceout',
    meta:{//余额管理
       parentMenu:'财务中心',
       breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账户资产',url:''},{title:'余额管理',url:'/paymanage/balanceout'}]
    },
    name:'balanceout',
    component:(resolve) =>require(['@/views/paymanage/balanceout.vue'],resolve)
},
//支付密码
{
    path:'/paymanage/payPassword',
    meta:{//余额管理
       parentMenu:'财务中心',
       breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账户资产',url:''},{title:'支付密码',url:'/paymanage/payPassword'}]
    },
    name:'payPassword',
    component:(resolve) =>require(['@/views/paymanage/payPassword.vue'],resolve)
},

{ 
   ///账单管理部分
   path:'/paymanage/billManage',
   meta:{//账单管理
      parentMenu:'财务中心',
      breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账单管理',url:''},{title:'账单管理',url:'/paymanage/billManage'}]
   },
   name:'billManage',
   component:(resolve) =>require(['@/views/paymanage/billManage.vue'],resolve)
},
{
    path:'/paymanage/reconciliationrecord',
    meta:{//账单管理--对账申请记录
       parentMenu:'财务中心',
       breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账单管理',url:''},{title:'对账申请记录',url:'/paymanage/reconciliationrecord'}]
    },
    name:'reconciliationrecord',
    component:(resolve) =>require(['@/views/paymanage/reconciliationrecord.vue'],resolve)
},
{
    path:'/paymanage/reconciliationdetail/:billCode',
    meta:{//账单管理--对账申请记录--对账详情
       parentMenu:'财务中心',
       breadcrumb:[{title:'财务中心',url:'/paymanage/default'},{title:'账单管理',url:'/paymanage/reconciliationrecord'},{title:'对账单详情',url:'/paymanage/reconciliationdetail'}]
    },
    name:'reconciliationdetail',
    component:(resolve) =>require(['@/views/paymanage/reconciliationdetail.vue'],resolve)
},
//发票管理-客户发票申请列表 
{
    meta: {
      parentMenu: '财务中心',
      breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"客户发票申请列表",url:'/grouptour/fapiaoshenqingList'}]
    },
    path: '/grouptour/fapiaoshenqingList',
    name: 'fapiaoshenqingList',
    component: (resolve) => require(['@/views/grouptour/fapiaoshenqingList.vue'], resolve)
},
//发票管理-客户发票申请列表详情页
{
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"客户发票申请详情页",url:'/grouptour/fapiaoshenqingDetail'}]
    },
    path: '/grouptour/fapiaoshenqingDetail',
    name: 'fapiaoshenqingDetail',
    component: (resolve) => require(['@/views/grouptour/fapiaoshenqingDetail.vue'], resolve)
},
//开发票  发票管理-开票页
{
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"客户发票申请页",url:'/grouptour/kaifapiao'}]
    },
    path: '/grouptour/kaifapiao',
    name: 'kaifapiao',
    component: (resolve) => require(['@/views/grouptour/kaifapiao.vue'], resolve)
},
//门店 发票管理 自定义发票
{
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"自定义发票页",url:'/grouptour/zidingyifapiao'}]
    },
    path: '/grouptour/zidingyifapiao',
    name: 'zidingyifapiao',
    component: (resolve) => require(['@/views/grouptour/zidingyifapiao.vue'], resolve)
},
//门店 发票申请记录列表
{
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"申请发票记录列表",url:'/grouptour/shenqingjiluList'}]
    },
    path: '/grouptour/shenqingjiluList',
    name: 'shenqingjiluList',
    component: (resolve) => require(['@/views/grouptour/shenqingjiluList.vue'], resolve)
},
//门店 发票管理-开票记录列表详情页
{
    meta: {
        parentMenu: '财务中心',
        breadcrumb:[{title:"财务中心",url:'/paymanage/default'},{title:"发票管理",url:'/grouptour/fapiaoshenqingList'},{title:"申请发票记录详情页",url:'/grouptour/kaipiaojiluxiangqing'}]
    },
    path: '/grouptour/kaipiaojiluxiangqing',
    name: 'kaipiaojiluxiangqing',
    component: (resolve) => require(['@/views/grouptour/kaipiaojiluxiangqing.vue'], resolve)
},
{
    path:'/customercenter/jiesuan/setCreditLine',
    meta:{//信用额度
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'信用额度',url:'/customercenter/jiesuan/setCreditLine'}]
    },
    name:'setCreditLine',
    component:(resolve)=>require(['@/views/customercenter/jiesuan/setCreditLine.vue'],resolve)
},
{
    path:"/customercenter/jiesuan/mailingaddress",
    meta:{//邮寄地址
        parentMenu: '客户中心',
        breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'邮寄地址',url:'/customercenter/jiesuan/mailingaddress'}]
    },
    name:'mailingaddress',
    component:(resolve)=>require(['@/views/customercenter/jiesuan/mailingaddress.vue'],resolve)
},{
   path:'/customercenter/jiesuan/setBankList',
   meta:{//银行账号
    parentMenu: '客户中心',
    breadcrumb:[{title:'客户中心',url:'/customercenter/default'},{title:'结算单位',url:'/customercenter/jiesuandanwei'},{ title:'银行账号',url:'/customercenter/jiesuan/setBankList'}]
   },
   name:'setBankList',
   component:(resolve)=>require(['@/views/customercenter/jiesuan/setBankList.vue'],resolve)
},
{//销售中心 合同管理 合同管理列表
    path:'/sellcenter/contractList',
    meta:{
        parentMenu: '销售中心',
        breadcrumb:[{title:'销售中心',url:'/sellcenter/default'},{title:'合同管理',url:'/sellcenter/contractList'},{title:'合同管理列表',url:'/sellcenter/contractList'}]
    },
    name:'contractList',
    component:(resolve) => require(['@/views/sellcenter/contractList.vue'],resolve)
},
{//销售中心 合同管理 合同转借记录列表
    path:'/sellcenter/lentRecordList',
    meta:{
        parentMenu: '销售中心',
        breadcrumb:[{title:'销售中心',url:'/sellcenter/default'},{title:'合同管理',url:'/sellcenter/lentRecordList'},{title:'合同转借列表',url:'/sellcenter/lentRecordList'}]
    },
    name:'lentRecordList',
    component:(resolve) => require(['@/views/sellcenter/lentRecordList.vue'],resolve)
},
//报表中心
{
    meta: {
        parentMenu: '报表中心',
        breadcrumb: [{ title: '报表中心', url: '' }, { title: '报表中心', url: '/ReportManage/FinanceReport' },{ title: '财务报表', url: '/ReportManage/FinanceReport' }]
    },
    path: '/ReportManage/FinanceReport',
    alias: '/ReportManage/default',
    name: 'FinanceReport',
    component: (resolve) => require(['@/views/financenter/financeReport'], resolve)
}
]
export default pages