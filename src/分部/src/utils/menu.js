let menus;
if (process.env.NODE_ENV === 'production') {
  var menu = localStorage.getItem('menus');
  menus = JSON.parse(menu);
} else {
  menus = {
    "menu": [{
      "menuName": "运营中心",
      "url": "/",
      "iconCss": "icon-yunyingshangfenbu2",
      "childMenu": [{
        "menuName": "运营概况",
        "url": "/Home/Infos",
        "iconCss": "icon-paiming",
        "childMenu": []
      }, {
        "menuName": "站内信管理",
        "url": "#Message",
        "iconCss": "icon-paiming",
        "childMenu": [{
          "menuName": "平台站内信",
          "url": "/Message/SearchMsg",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "系统站内信",
          "url": "/Message/ReceiveMsg",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }, {
        "menuName": "公告管理",
        "url": "/HomeBulletin",
        "iconCss": "icon-paiming",
        "childMenu": [{
          "menuName": "区域公告",
          "url": "/HomeBulletin/BulletinList",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }, {
        "menuName": "评论管理",
        "url": "#Comment",
        "iconCss": "icon-pinglun1",
        "childMenu": [{
          "menuName": "评论查询",
          "url": "/Home/CommentList",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }]
    }, {
      "menuName": "客商中心",
      "url": "/UserCenter",
      "iconCss": "icon-huiyuanzhongxin",
      "childMenu": [{
        "menuName": "供应商管理",
        "url": "#SupplierManage",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": [{
          "menuName": "供应商查询",
          "url": "/UserCenter/SupplierSearch",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }, {
          "menuName": "激励审核",
          "url": "/UserCenter/SupBonus",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }]
      }, {
        "menuName": "分销商管理",
        "url": "#DistrManage",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": [{
          "menuName": "分销商查询",
          "url": "/UserCenter/DistributorSearch",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }, {
          "menuName": "分销商设置",
          "url": "/UserCenter/DistributorSetup",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }]
      }, {
        "menuName": "客户类型",
        "url": "#DisTypeManage",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": [{
          "menuName": "客户类型查询",
          "url": "/UserCenter/UserTypeList",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }]
      }, {
        "menuName": "结算单位管理",
        "url": "#DisSettleClient",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": [{
          "menuName": "结算单位查询",
          "url": "/UserCenter/DisSettleClientList",
          "iconCss": "icon-huiyuanzhongxin",
          "childMenu": []
        }]
      }, {
        "menuName": "会员管理",
        "url": "#MemManage",
        "iconCss": "icon-zhanghaoguanli",
        "childMenu": [{
          "menuName": "会员查询",
          "url": "/UserCenter/MemberSerach",
          "iconCss": "icon-zhanghaoguanli",
          "childMenu": []
        }]
      }, {
        "menuName": "旅客资料",
        "url": "#PassengerManage",
        "iconCss": "icon-zhanghaoguanli",
        "childMenu": [{
          "menuName": "旅客资料",
          "url": "/UserCenter/PassengerSearchList",
          "iconCss": "icon-zhanghaoguanli",
          "childMenu": []
        }, {
          "menuName": "证件类型设置",
          "url": "/UserCenter/CardTypeList",
          "iconCss": "icon-zhanghaoguanli",
          "childMenu": []
        }]
      }]
    }, {
      "menuName": "资源中心",
      "url": "/Home/ProductManage",
      "iconCss": "icon-shangpinguanli",
      "childMenu": [
        {
          "menuName": "酒店",
          "url": "/Hotel/HotelProduct/Index",
          "iconCss": "icon-jiudian",
          "childMenu": [{
            "menuName": "自营商品",
            "url": "/Hotel/HotelProduct/BranchProduct",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "共享商品",
            "url": "/Hotel/HotelProduct/HotelSharedProductList",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "接口商品",
            "url": "/Hotel/HotelProduct/HotelResourcesProductList",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "飞猪商品",
            "url": "/Hotel/HotelProduct/FliggyProductList",
            "iconCss": "icon-",
            "childMenu": []
          }]
        }, {
          "menuName": "门票",
          "url": "/Tickets/Product/Index",
          "iconCss": "icon-menpiao",
          "childMenu": [{
            "menuName": "分部商品",
            "url": "/Tickets/Product/TicketList",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "总部商品",
            "url": "/Tickets/Product/TicketSharedList",
            "iconCss": "icon-",
            "childMenu": []
          }]
        }, {
          "menuName": "机票",
          "url": "#Flight",
          "iconCss": "icon-menpiao",
          "childMenu": [{
            "menuName": "包机采购管理",
            "url": "/dist/#/airplane/purchase",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "包机库存列表",
            "url": "/dist/#/airplane/stock-list",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "库存调配",
            "url": "/dist/#/airplane/deploy-list",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "基础信息设置",
            "url": "/dist/#/airplane/basic-info",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "航空公司管理",
            "url": "/dist/#/airplane/company-list",
            "iconCss": "icon-",
            "childMenu": []
          }]
        }, {
          "menuName": "跟团游",
          "url": "#GroupLineRes",
          "iconCss": "icon-menpiao",
          "childMenu": [{
            "menuName": "线路列表",
            "url": "/dist/#/grouptour/RouteTable",
            "iconCss": "icon-",
            "childMenu": []
          }, {
            "menuName": "线路基础设置",
            "url": "/dist/#/grouptour/infoMaintenance",
            "iconCss": "icon-",
            "childMenu": []
          }]
        }]
    }, {
      "menuName": "销售中心",
      "url": "/dist/#/branchWork/routeReserve",
      "iconCss": "icon-shangpinguanli",
      "childMenu": [{
        "menuName": "跟团游",
        "url": "#grouptour",
        "iconCss": "icon-menpiao",
        "childMenu": [{
          "menuName": "跟团游产品",
          "url": "adfa",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }]
    }, {
      "menuName": "订单中心",
      "url": "/Home/OrderMangage",
      "iconCss": "icon-dingdanguanli",
      "childMenu": [{
        "menuName": "门票订单",
        "url": "/Tickets/TicketOrder/Index",
        "iconCss": "icon-menpiao",
        "childMenu": [{
          "menuName": "分部订单",
          "url": "/Tickets/TicketOrder/TicketOrder",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "总部订单",
          "url": "/Tickets/TicketOrder/TicketOrderHeadquarters",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }, {
        "menuName": "酒店订单",
        "url": "/Hotel/HotelOrder/Index",
        "iconCss": "icon-jiudian",
        "childMenu": [{
          "menuName": "自营商品订单",
          "url": "/Hotel/HotelOrder/HotelOrderSearch",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "总部商品订单",
          "url": "/Hotel/HotelOrder/GroupHotelOrderSearch",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }, {
        "menuName": "跟团游",
        "url": "#grouplineorder",
        "iconCss": "icon-menpiao",
        "childMenu": [{
          "menuName": "自营线路",
          "url": "/dist/#/branchWork/selfsupportLineReceiveOrders",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "线路预留单",
          "url": "/dist/#/branchWork/reverseList",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }]
    }, {
      "menuName": "财务中心",
      "url": "/FinanceCenter",
      "iconCss": "icon-finance",
      "childMenu": [{
        "menuName": "账户资产",
        "url": "/FinanceCenter/FianceAsset",
        "iconCss": "icon-finance",
        "childMenu": [{
          "menuName": "提现",
          "url": "/FinanceCenter/Withdraw",
          "iconCss": "icon-finance",
          "childMenu": []
        }]
      }, {
        "menuName": "结算中心",
        "url": "/FinanceCenter/PendingSettle",
        "iconCss": "icon-finance",
        "childMenu": []
      }, {
        "menuName": "提现账号",
        "url": "#CashAccounts",
        "iconCss": "icon-finance",
        "childMenu": [{
          "menuName": "提现账号",
          "url": "/FinanceCenter/WithdrawalsAccount",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "提现/支付密码设置 ",
          "url": "/FinanceCenter/Password",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }]
    }, {
      "menuName": "系统设置",
      "url": "/SystemSetting",
      "iconCss": "icon-xitongshezhi",
      "childMenu": [{
        "menuName": "账户信息",
        "url": "/SystemSetting/AccountInfo",
        "iconCss": "icon-zhanghuguanli",
        "childMenu": []
      }, {
        "menuName": "账号管理",
        "url": "/SystemSetting/Accounts",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": []
      }, {
        "menuName": "角色管理",
        "url": "/SystemSetting/Roles",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": []
      }, {
        "menuName": "组织架构",
        "url": "/SystemSetting/OrganizationUnits",
        "iconCss": "icon-huiyuanzhongxin",
        "childMenu": []
      }, {
        "menuName": "系统设置",
        "url": "#SystemSetting",
        "iconCss": "icon-xitongguanli",
        "childMenu": [{
          "menuName": "OTA接口管理",
          "url": "/SystemSetting/Plugins",
          "iconCss": "icon-",
          "childMenu": []
        }, {
          "menuName": "系统编号设置",
          "url": "/SystemSetting/SerialNoSetting",
          "iconCss": "icon-",
          "childMenu": []
        }]
      }, {
        "menuName": "修改密码",
        "url": "/SystemSetting/ResetPwd",
        "iconCss": "icon-mima",
        "childMenu": []
      }, {
        "menuName": "意见反馈",
        "url": "/SystemSetting/Opionion",
        "iconCss": "icon-mima",
        "childMenu": []
      }]
    }
    // ,{
    //   "menuName": "报表中心",
    //   "url": "/",
    //   "iconCss": "icon-yunyingshangfenbu2",
    //   "childMenu": [{
    //     "menuName": "财务报表",
    //     "url": "dist/#/ReportManage/FinanceReport",
    //     "iconCss": "icon-zhanghuguanli",
    //     "childMenu": []
    //   }
    // ]}
  ]}
}
export default menus
