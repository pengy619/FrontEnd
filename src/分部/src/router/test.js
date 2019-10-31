var pages=[{
      path: '/test',
      name: '内容页',
      component: (resolve) => require(['@/views/test.vue'], resolve)
    },
    {
      path: '/test2',
      name: 'Hello',
      component:(resolve) => require(['@/views/test2.vue'], resolve)
    },{
      path: '/test3',
      name: 'Hello',
      component:(resolve) => require(['@/views/test3.vue'], resolve)
    },{
      path: '/test4',
      name: 'Hello',
      component:(resolve) => require(['@/views/test4.vue'], resolve)
    },{
      path: '/table',
      name: 'Hello',
      component:(resolve) => require(['@/views/table.vue'], resolve)
    }]
export default pages
