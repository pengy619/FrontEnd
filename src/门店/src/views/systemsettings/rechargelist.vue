<template>
  <div class="view" >
    <div style='height:175px;'>
      <div class='div_top left'>
        <div style='font-size:18px;'>我的账户</div>
        <p style='font-size:14px;'><span>账户名:</span>{{userName}}</p>
        <el-button size="small" v-if="rechargesearchfrom.IsActive" type="warning">提现</el-button>
        <i class="icon iconfont icon-qianbao"></i>
      </div>
      <div class='div_top right'>
        <div style='font-size:14px;'>账户余额(元)</div>
        <p style='font-size:30px;margin:0;'>{{balance}}</p>
        <i class="icon iconfont icon-xiaoshoumingxi"></i>
      </div>
    </div>
    <el-form  :inline="true" size="small" label-width="80px">
          <el-form-item label="充值状态" >
            <el-select v-model="rechargesearchfrom.status" size="small" placeholder="请选择充值类型"  clearable>
              <el-option v-for="item in rechargestatusObj" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值账号" >
            <el-input size="small" v-model="rechargesearchfrom.createByName"></el-input>
          </el-form-item>
          <el-form-item label="充值方式" >
            <el-select v-model="rechargesearchfrom.rechargeWayId" size="small" placeholder="请选择充值类型" clearable>
              <el-option v-for="item in rechargemethodObj" :key="item.id" :label="item.rechargeWayName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="充值时间" >
            <el-date-picker v-model="rechargesearchfrom.StartTransactionDate"
                            type="date"
                            id="StartTransactionDate"
                            value-format="yyyy-MM-dd"
                            placeholder="选择开始日期">
            </el-date-picker>-
            <el-date-picker v-model="rechargesearchfrom.EndTransactionDate"
                            type="date"
                            id="EndTransactionDate"
                            value-format="yyyy-MM-dd"
                            placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="rechargeSearch">搜索</el-button>
          </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-button type="primary" size="small" @click="updateRecharge" style='margin-left:10px;'>充值</el-button>
      <el-button  size="small" @click="handleExport">导出Excel</el-button>
    </el-row>
    <div class="margin_top">
      <el-table :data="tableData"
                v-loading="loading2" size="small" tooltip-effect="dark"
                style="width: 100%">
        <!--<el-table-column  size="small" prop="companyInfoName" align="center"  label="充值门店" >
        </el-table-column>-->
        <el-table-column size="small" prop="createByName" align="center" label="充值账号">
        </el-table-column>
        <el-table-column size="small" prop="unitName" align="center" label="单位名称">
        </el-table-column>
        <el-table-column size="small" prop="methodText" align="center" label="充值方式">
        </el-table-column>
        <el-table-column size="small" prop="serialNumber" align="center" label="充值流水号">
        </el-table-column>
        <el-table-column size="small" prop="balanceBeforeTrade" align="center" label="充值前账号余额">
        </el-table-column>
        <el-table-column size="small" prop="amount" align="center" label="充值金额">
        </el-table-column>
        <el-table-column size="small"   align="center" label="手续费">
          <template slot-scope="scope">
            {{ scope.row.fee>0?scope.row.fee:'无需手续费' }}
          </template>
        </el-table-column>
        <el-table-column size="small" prop="actualAmount" align="center" label="实际到账">
        </el-table-column>
        <el-table-column size="small" prop="confirmTime" align="center" :formatter="confirmTime" label="确认时间">
        </el-table-column>
        <el-table-column size="small" prop="transactionDateStr" align="center" label="充值时间">
        </el-table-column>
        <el-table-column size="small" prop="documentNo" align="center" label="四联单号">
        </el-table-column>
        <el-table-column size="small" label="附件" align="center">
          <template slot-scope="scope">
            <!-- attachment -->
            <el-button type="text" size="small" @click="checkfujian(scope.row)">查看附件</el-button>
            <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </template>
        </el-table-column>
        <!--<el-table-column  size="small" prop="executeDesc" align="center"  label="备注">
        </el-table-column>-->
        <el-table-column size="small" prop="statusText" align="center" label="状态">
        </el-table-column>
        <el-table-column size="small" label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addRecharge(scope.row)">查看</el-button>
            <!-- <el-button type="text" size="small"  @click="updateRecharge">编辑</el-button> -->
            <el-button type="text" size="small" @click="deleteRechargesingle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pagesobj.pageIndex"
                       :page-sizes="[5,10,20,50]"
                       :page-size="pagesobj.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                        fixed="right"
                       :total="pagesobj.total">
        </el-pagination>
        </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userName: '',
        balance: '0.00',
        rechargesearchfrom: {
          status: '',//充值状态
          StartTransactionDate: '',
          EndTransactionDate: '',
          method: '',
          rechargeWayId:'',
          createByName: '',
          IsActive: '', //是否提现按钮
          //    transactionType:''
        },
        tableData: [{
          companyInfoName: '',
          createByName: '',
          transactionTypeText: '',
          methodText: '',
          serialNumber: '',
          amount: '',
          transactionDate: '',
          executeDesc: '',
          statusText: '',
          documentNo: ''
        }],
        rechargestatusObj: [],//充值状态对象
        rechargemethodObj: [],//充值方式
        vouvherbanknumobj: [],//充值类型
        currentPage4: 1,
        pagesobj: {
          pageIndex: 1,//第几页
          pageSize: 10,//每页多少条
          total: 3//总条数
        },
        loading2: false,
        dialogVisible: false,
        dialogImageUrl: '',
        searchTime: ''
      }
    },
    mounted: function () {
      this.getVoucherstatus();
      this.rechargeSearch();
      this.getVoucherway();
      this.getVouchertype();
      this.getIsActive();
      this.userName = localStorage.username;
      this.shopHttp.get("/Finance/GetAssets").then((res) => {
        if (res.data.isSuccess == true) {
          this.balance = res.data.objects[0]
        }
      }).catch((e) => {
        console.log(e);
      });
    },
    methods: {
      handleExport() {
        let WEB_API = process.env.WEB_API;     
        let url = "PageIndex=" + this.pagesobj.pageIndex + "&PageSize="
          + this.pagesobj.pageSize + "&status=" + this.rechargesearchfrom.status +
          "&RechargeWayId=" + this.rechargesearchfrom.rechargeWayId + "&createByName=" + this.rechargesearchfrom.createByName +
          "&StartTransactionDate=" + this.rechargesearchfrom.StartTransactionDate + "&EndTransactionDate=" + this.rechargesearchfrom.EndTransactionDate +
          "&Export=true" + '&CompanyInfoId=';
        var reqUrl = WEB_API +"/Finance/GetFinTransactionRecordList?" + url
        //window.location.href = reqUrl;
        this.shopHttp.get("/Finance/GetShopId").then(function (res) {
          window.location.href = reqUrl + res.data;
        })
      },
      rechargeSearch() {
        if (this.rechargesearchfrom.StartTransactionDate == null) {
          this.rechargesearchfrom.StartTransactionDate = '';
        }
        if (this.rechargesearchfrom.EndTransactionDate == null) {
          this.rechargesearchfrom.EndTransactionDate = '';
        }

        let url = "PageIndex=" + this.pagesobj.pageIndex + "&PageSize="
          + this.pagesobj.pageSize + "&status=" + this.rechargesearchfrom.status +
          "&rechargeWayId=" + this.rechargesearchfrom.rechargeWayId + "&createByName=" + this.rechargesearchfrom.createByName +
          "&StartTransactionDate=" + this.rechargesearchfrom.StartTransactionDate + "&EndTransactionDate=" + this.rechargesearchfrom.EndTransactionDate;
        this.getVoucherlist(url);
      },
      getVoucherway() {
        var _this = this;
        this.shopHttp.get("/Finance/GetRechargeWayList", {}).then(function (res) {   
          _this.rechargemethodObj = res.data;
          console.log(_this.rechargemethodObj);
        
        }).catch(function (er) {
          console.log("充值页面获取充值方式错误提示:" + er);

        });
      },
      getVouchertype() {
        var _this = this;
        this.shopHttp.post("/Finance/GetFinTransactionType", {}).then(function (res) {
          _this.vouvherbanknumobj = res.data.objects;
          // console.log(_this.vouvherbanknumobj);
        }).catch(function (err) {
          console.log("充值页面获取充值类型错误提示:" + er);
        });
      },
      getVoucherstatus() {
        var _this = this;
        _this.shopHttp.post("/Finance/GetFinTransactionStatus", {}).then(function (res) {
          // console.log(res.data.objects);
          _this.rechargestatusObj = res.data.objects;
        }).catch(function (err) {
          console.log(err);
        })
      },
      getVoucherlist(url) {//获取到分页数据
        var _this = this;
        _this.loading2 = true;
        this.shopHttp.get("/Finance/GetFinTransactionRecordPageList?" + url).then(function (res) {
          // console.log(res.data);
          if (res.data.isSuccess) {
            _this.tableData = res.data.objects;
            _this.pagesobj.total = res.data.total;
          }
          _this.loading2 = false;
        }).catch(function (err) {
          console.log(err);
          _this.loading2 = false;
          _this.$message("加载数据失败");
        });
      },
      deleteRechargesingle(row) {
        ///删除一条数据
        var _this = this;
        this.$confirm('此操作将清空历史操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading2 = true;
          _this.shopHttp.post("/Finance/DeleteFinTransactionRecord?RecordId=" + row.id, {}).then((res) => {
            //console.log(res);
            if (res.data.isSuccess) {
              _this.$message({ type: 'success', message: '删除成功!' });
              _this.rechargeSearch();
            } else {
              _this.$message("已确认充值记录不能删除");
            }
            _this.loading2 = false;
          }).catch((er) => {
            console.log(er);
            _this.loading2 = false;
            _this.$message({ type: 'info', message: "已确认充值记录不能删除" });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      addRecharge(row) {
        this.$router.push({ path: '/systemsettings/rechargedetail', name: "rechargedetail", params: row });
      },
      updateRecharge() {
        this.$router.push({ path: '/systemsettings/recharge', name: 'recharge' });
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pagesobj.pageSize = val;
        this.rechargeSearch();
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pagesobj.pageIndex = val;
        this.rechargeSearch();
      },
      checkfujian(row) {
        // console.log(row.attachment);
        //this.$message(row.attachment);
        //window.open(row.attachment);
        this.dialogImageUrl = row.attachment;
        this.dialogVisible = true;
      }, 
      confirmTime(rowtime) {
        let time = rowtime.confirmTime;
        return time != null && time != '' ? time.replace("T", " ").substring(0, time.lastIndexOf('.')) : '';
        //return time != null || time != '' ? time.substring(0,time.lastIndexOf('T')):"";
      },
      rechargeTime(rowtime) {
        let time = rowtime.transactionDate;
        return time != null && time != '' ? time.replace("T", " ").substring(0, time.lastIndexOf('.')) : '';
        //return time != null || time != '' ? time.substring(0,time.lastIndexOf('T')):"";
      },
      //是否启用 门店提现
      getIsActive() {
        this.shopHttp.get('/SystemSetting/GetShopWithdrawSetting')
          .then(res => {
            this.rechargesearchfrom.IsActive = res.data.isActive;
          })
      }
    }

  }
</script>

<style lang="scss" scoped>

  .div_top {
    display: inline-block;
    height: 157px;
    width: 49.5%;
    margin-bottom: 0 0 20px 0;
    color: white;
    position: relative;
    padding: 20px;
  }

    .div_top i {
      width: 70px;
      height: 112px;
      position: absolute;
      top: 31px;
      right: 40px;
      opacity: .3;
      font-size: 70px;
      line-height: 112px;
    }

  .left {
    float: left;
    background: rgb(253, 135, 116);
  }

  .right {
    float: right;
    background: rgb(90, 183, 223);
  }
</style>
