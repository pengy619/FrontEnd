var pages = [
    {
        meta: {
            parentMenu: '报表中心',
            breadcrumb: [{ title: '报表中心', url: '' }, { title: '财务报表', url: '/ReportManage/FinanceReport' }]
        },
        path: '/ReportManage/FinanceReport',
        name: 'FinanceReport',
        component: (resolve) => require(['@/views/ReportManage/FinanceReport'], resolve)
    }
]
export default pages