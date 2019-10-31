var pages = [
    {
        path: '/',
        name: 'orderList',
        component: (resolve) => require(['@/view/content/orderList.vue'], resolve)
    },
    {
        path: '/orderList',
        name: 'orderList',
        component: (resolve) => require(['@/view/content/orderList.vue'], resolve)
    },
    {
        path: '/placeOrder',
        name: 'placeOrder',
        component: (resolve) => require(['@/view/content/placeOrder.vue'], resolve)
    }
]

export default pages