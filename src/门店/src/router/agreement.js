var pages=[{
    meta: {
    parentMenu: '订单中心',
    breadcrumb:[{ title:'订单中心',url:''},{ title:'线路订单',url:'/orderCenter/default'},{ title:'免责协议',url:''}]
    },
    path: '/orderCenter/agreement/:id',
    name: 'agreement',
    component: (resolve) => require(['@/views/orderCenter/agreementList'], resolve)
},{
    meta: {
    parentMenu: '订单中心',
    breadcrumb:[{ title:'订单中心',url:''},{ title:'线路订单',url:'/orderCenter/default'},{ title:'发起免责协议',url:''}]
    },
    path: '/orderCenter/editAgreement/:id',
    name: 'agreement',
    component: (resolve) => require(['@/views/orderCenter/editAgreement'], resolve)
}]
export default pages