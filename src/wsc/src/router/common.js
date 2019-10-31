let pages=[
    {   //登录
        path: '/Login',
        name: 'Login',
        component: (resolve)=>require(['@/views//Login.vue'],resolve)
    },
    {   //找回密码
        path: '/FindPassword',
        name: 'FindPassword',
        component: (resolve)=>require(['@/views//FindPassword.vue'],resolve)
    },
]

export default pages;