<template>
  <div class="view">
    <h4>账户额度</h4>
    <div>
      <div>账户现有额度：<span>{{assets}}</span> <!--<el-button type="info" size="small" @click="showDialog" style="margin-left:25px">转借</el-button>--></div>
      
      <el-row>
        <el-col :span="4"><div>冻结余额：<span>{{freezeAssets}}</span> </div></el-col>
        <el-col :span="4"><div>可用余额：<span>{{(assets-freezeAssets).toFixed(2)}}</span></div></el-col>
    
      </el-row>
      <el-dialog title="转借" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="finSubtenancyform" ref="finSubtenancyform" :rules="rules">
          <el-form-item label="转借金额" prop="SubtenancyAmount" label-width="80px">
            <el-input auto-complete="off" type="number" v-model="finSubtenancyform.SubtenancyAmount" size="small" style="width:218px;"></el-input>
          </el-form-item>
          <el-form-item label="转入对象" prop="BorrowDisCompanyInfoId" label-width="80px">
            <el-select v-model="finSubtenancyform.BorrowDisCompanyInfoId" size="small" style="width:218px;">
              <el-option v-for="(item,index) in branchshop" :key="index" :label="item.name" :value="item.value+'-'+item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" label-width="80px">
            <el-input type="textarea" v-model="finSubtenancyform.Remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-row :gutter="24">
            <el-col style="width:200px;" :offset="7">
              <el-form-item>
                <span>
                  <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                </span>
                <span style="display:inline-block;margin-left:20px;">
                  <el-button size="small" type="primary" @click="addBalance('finSubtenancyform')">确 定</el-button>
                </span>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-dialog>

    </div>
    <div style='margin-top:10px;'>
      <el-tabs>
        <el-tab-pane label='余额冻结记录'>

          <el-table ooltip-effect="dark" :data="freeoptionData" size="small" style="width:100%">
            <el-table-column prop="createOnFormat" label="冻结时间" align="center" size='small'></el-table-column>
            <el-table-column prop="freezeAssets" label="冻结金额" align="center" size='small'></el-table-column>
            <el-table-column prop="unfreezeAssets" label="已解冻金额" align="center" size='small'></el-table-column>
            <el-table-column prop="operationName" label="冻结人" align="center" size='small'></el-table-column>
            <el-table-column prop="opeRemark" label="冻结原因" align="center" size='small'></el-table-column>
            <!--<el-table-column label="操作" align="center" size='small'>
              <template slot-scope="scope">
                <el-button type="text" size="small">申请冻结</el-button>
              </template>
            </el-table-column>-->
          </el-table>
              <el-pagination class="pagination"
                             @size-change="freeoptionchangesize"
                             @current-change="freeoptionchangeindex"
                             :current-page="freeoptionpageindex"
                             :page-sizes="[5,10,20,50]"
                             :page-size="freeoptionpagesize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="freeoptiontotal">
              </el-pagination>
        </el-tab-pane>

        <!-- <el-tab-pane label="余额借出记录">
          <el-table ooltip-effect="dark" :data="loanObj" size="small" style="width:100%">
            <el-table-column prop="subtenancyTime" :formatter="creationtime" label="借出时间" align="center" size='small'></el-table-column>
            <el-table-column prop="subtenancyAmount" label="借出金额" align="center" size='small'></el-table-column>
            <el-table-column prop="loanShopSysAccountName" label="借出人" align="center" size='small'></el-table-column>
            <el-table-column prop="borrowDisCompanyInfoName" label="借出对象" align="center" size='small'></el-table-column>

            <el-table-column prop="auditBoSysAccountName" v-if="flagid" label="审核人" align="center" size='small'></el-table-column>
            <el-table-column prop="auditTime" label="审核时间" v-if="flagid" align="center" size='small'></el-table-column>
            <el-table-column prop="branchStatus" label="审核状态" v-if="flagid" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmTime" v-if="flagid" label="确认时间" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmShopSysAccountName" v-if="flagid" label="确认人" align="center" size='small'></el-table-column>

            <el-table-column prop="affirmShopSysAccountName" :formatter="loanAffirpeo" label="确认人" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmTime" :formatter="cusloanaffirmtime" label="确认时间" align="center" size='small'></el-table-column>
            <el-table-column prop="shopStatus" :formatter="loanresshopstatus" label="状态" align="center" size='small'></el-table-column>

          </el-table>
          <el-row class="mypage" :gutter="24">
            <el-col :span="10" :offset="13">
              <el-pagination class="pagination"
                             @size-change="loanSizeChange"
                             @current-change="loanCurrentChange"
                             :current-page="loanpageindex"
                             :page-sizes="[5,10,20,50]"
                             :page-size="loanpagesize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="loantotal">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="余额借入记录">
          <el-table ooltip-effect="dark" :data="borrowObj" size="small" style="width:100%">
            <el-table-column prop="subtenancyTime" :formatter="creationtime" label="借入时间" align="center" size='small'></el-table-column>
            <el-table-column prop="subtenancyAmount" label="借入金额" align="center" size='small'></el-table-column>
            <el-table-column prop="loanShopSysAccountName" label="借入人" align="center" size='small'></el-table-column>
            <el-table-column prop="borrowDisCompanyInfoName" label="借入对象" align="center" size='small'></el-table-column> 
            <el-table-column prop="auditBoSysAccountName" v-if="flagid" label="审核人" align="center" size='small'></el-table-column>
            <el-table-column prop="auditTime" label="审核时间" v-if="flagid" align="center" size='small'></el-table-column>
            <el-table-column prop="branchStatus" label="审核状态" v-if="flagid" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmTime" v-if="flagid" label="确认时间" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmShopSysAccountName" v-if="flagid" label="确认人" align="center" size='small'></el-table-column>

            <el-table-column prop="affirmShopSysAccountName" :formatter="loanAffirpeo" label="确认人" align="center" size='small'></el-table-column>
            <el-table-column prop="affirmTime" :formatter="cusloanaffirmtime" label="确认时间" align="center" size='small'></el-table-column>
            <el-table-column prop="shopStatus" :formatter="loanresshopstatus" label="状态" align="center" size='small'></el-table-column>

            <el-table-column prop="id" label="" v-if="flagid" align="center" size='small'></el-table-column>
            <el-table-column label="操作" align="center" size='small'>
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.shopStatus == 1 && scope.row.branchStatus == 1" size="small" @click="shopAffirm(scope.row)">确认</el-button>
                <el-button type="text" v-if="scope.row.shopStatus == 1 && scope.row.branchStatus == 1" size="small" @click="shopCannel(scope.row)">取消</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-row class="mypage" :gutter="24">
            <el-col :span="10" :offset="13">
              <el-pagination class="pagination"
                             @size-change="borrowSizeChange"
                             @current-change="borrowCurrentChange"
                             :current-page="borrowpageindex"
                             :page-sizes="[5,10,20,50]"
                             :page-size="borrowpagesize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="borrowpagetotal">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>--> 
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let moneyvalidator = (rule, value, callback) => {
        let reg = /^\d+(?:\.\d{1,2})?$/;
        if (!value) {
          callback(new Error("金额不能为空"));
        } else if (!reg.test(value)) {
          callback(new Error("金额必须为正数，且仅保留两位小数"));
        } else {
          callback();
        }
      }
      return {
        flagid: false,
        dialogFormVisible: false,
        assets: '',
        freezeAssets:'',
        freeoptionpagesize: 10,
        freeoptionpageindex: 1,
        freeoptiontotal: 0,
        freeoptionData: [],
        branchshop: [],
        borrowpagesize: 10,
        borrowpageindex: 1,
        borrowpagetotal: 0,
        borrowObj: [],
        loanpagesize: 10,
        loanpageindex: 1,
        loantotal: 0,
        loanObj: [],
        cusshopStatus: ['待审核', '待确认', '已确认', '已取消'],
        finSubtenancyform: {
          SubtenancyAmount: '',//转借金额
          SubtenancyType: 0,//转借类型
          BorrowDisCompanyInfoId: '',//转借对象ID
          BorrowDisCompanyInfoName: '',//转借对象名称
          Remark: '',//转借备注
        },
        rules: {
          BorrowDisCompanyInfoId: [{ required: true, message: '请选择转借对象', type: 'string', trigger: 'change' }],
          SubtenancyAmount: [{ required: true, validator: moneyvalidator, trigger: 'blur' }]
        }

      }
    }, mounted: function () {
      this.getFreeoption();
      this.getProperty();
      this.getBranchshops();
      this.getBorrowlist();
      this.getLoanList();
    }, methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      getFreeoption() {
        //冻结金额
        var _this = this;
        _this.shopHttp.get('/Finance/GetFreezeOptionPageList?PageIndex=' + _this.freeoptionpageindex + "&PageSize=" + _this.freeoptionpagesize).then(res => {
          // console.log(res);
          if (res.data.isSuccess) {
            _this.freeoptionData = res.data.objects;
            _this.freeoptiontotal = res.data.total;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getProperty() {//账户余额
        var _this = this;
        _this.shopHttp.get('/Property/GetProperty').then(res => {
          // console.log(res);
          if (res.data.isSuccess) {
            _this.assets = res.data.objects[0].assets;
            _this.freezeAssets = res.data.objects[0].freezeAssets;
            
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getBranchshops() {
        //获取交易类型
        var _this = this;
        _this.shopHttp.get('/Property/GetBranchShops?subtenancyType=0').then(res => {
          console.log(res);
          if (res.data.isSuccess) {
            _this.branchshop = res.data.objects;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getBorrowlist() {
        // 转入
        var _this = this;
        _this.shopHttp.get('Property/BorrowList?SubtenancyType=0&PageSize=' + _this.borrowpagesize + '&PageIndex=' + _this.borrowpageindex).then(res => {
          // console.log(res);
          if (res.data.isSuccess) {
            _this.borrowObj = res.data.objects;
            _this.borrowpagetotal = res.data.total;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getLoanList() {
        //转出
        var _this = this;
        _this.shopHttp.get('Property/LoanList?SubtenancyType=0&PageSize=' + _this.loanpagesize + '&PageIndex=' + _this.loanpageindex).then(res => {
          //console.log(res);
          if (res.data.isSuccess) {
            _this.loanObj = res.data.objects;
            _this.loantotal = res.data.total;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      addBalance(finSubtenancyform) {//转借
        var _this = this;
        _this.$refs[finSubtenancyform].validate(valida => {
          if (valida) {
            let borrowstr = this.finSubtenancyform.BorrowDisCompanyInfoId;
            let borrowid = borrowstr.substring(0, borrowstr.lastIndexOf('-'));
            let borrowname = borrowstr.substring(borrowstr.indexOf('-') + 1, borrowstr.length);
            this.finSubtenancyform.BorrowDisCompanyInfoId = borrowid;
            this.finSubtenancyform.BorrowDisCompanyInfoName = borrowname;
            _this.dialogFormVisible = false;
            _this.shopHttp.post('/Property/AddFinSubtenancyLog', _this.finSubtenancyform).then(res => {
              // console.log(res);
              if (res.data.isSuccess) {
                _this.$message({ type: 'success', message: res.data.message });
                _this.getLoanList();
                _this.getBorrowlist();
              } else {
                _this.$message({ type: 'error', message: res.data.message });
              }
            }).catch(err => {
              console.log(err);
              _this.$message({ type: 'error', message: res.data.message });
            })
          } else {
            return false;
          }
        })

      },
      freeoptionchangesize(val) {
        this.freeoptionpagesize = val;
        this.getFreeoption();
      },
      freeoptionchangeindex(val) {
        this.freeoptionpageindex = val;
        this.getFreeoption();
      },
      creationtime(val) {
        let oTime = val.subtenancyTime;
        if (oTime != null && oTime != '') {
          let tTime = oTime.substring(0, oTime.lastIndexOf('T'));
          let sTime = oTime.substring(oTime.indexOf('T') + 1, oTime.lastIndexOf('.'));
          return tTime + " " + sTime;
        }
      },
      resshopstatus(val) {
        return this.cusshopStatus[val.shopStatus];
      },
      loanSizeChange(val) {//借出
        this.loanpagesize = val;
        this.getLoanList();
      },
      loanCurrentChange(val) {
        this.loanpageindex = val;
        this.getLoanList();
      },
      borrowSizeChange(val) {//借入
        this.borrowpagesize = val;
        this.getBorrowlist();
      },
      borrowCurrentChange(val) {
        this.borrowpageindex = val;
        this.getBorrowlist();
      },
      shopAffirm(val) {
        //确认
        var _this = this;
        this.$confirm('操作将不可返回，请确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          _this.shopHttp.post('/Property/ShopAffirm', { LogId: val.id, SubtenancyType: 0 }).then(res => {
            // console.log(res);
            if (res.data.isSuccess) {
              _this.$message({ type: 'success', message: res.data.message });
              _this.getLoanList();//确认成功之后  在 转出 记录中刷新
            } else {
              _this.$message({ type: 'error', message: res.data.message });
            }
          }).catch(err => {
            console.log(err);
            this.$message({ type: 'error', message: res.data.message });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });


      },
      shopCannel(val) {
        //取消
        // var _this = this;
        this.$confirm('操作将不可返回，请确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.shopHttp.post('/Property/ShopCountermand', { LogId: val.id, SubtenancyType: 0 }).then(res => {
            // console.log(res);
            if (res.data.isSuccess) {
              this.$message({ type: 'success', message: res.data.message });
              this.getBorrowlist();
            } else {
              this.$message({ type: 'error', message: res.data.message });
            }
          }).catch(err => {
            this.$message({ type: 'error', message: res.data.message });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: res.data.message
          });
        });


      },
      cusaffirmtime(val) {
        let oTime = val.affirmTime;
        if (oTime != null && oTime != '') {
          let tTime = oTime.substring(0, oTime.lastIndexOf('T'));
          let sTime = oTime.substring(oTime.indexOf('T') + 1, oTime.lastIndexOf('.'));
          return tTime + " " + sTime;
        }
      },
      cusloanaffirmtime(val) {
        if (val.branchStatus == 2) {//表示 已拒绝
          let oTime = val.auditTime;
          if (oTime != null && oTime != '') {
            let tTime = oTime.substring(0, oTime.lastIndexOf('T'));
            let sTime = oTime.substring(oTime.indexOf('T') + 1, oTime.lastIndexOf('.'));
            return tTime + " " + sTime;
          }

        } else {
          let oTime = val.affirmTime;
          if (oTime != null && oTime != '') {
            let tTime = oTime.substring(0, oTime.lastIndexOf('T'));
            let sTime = oTime.substring(oTime.indexOf('T') + 1, oTime.lastIndexOf('.'));
            return tTime + " " + sTime;
          }
        }

      },
      loanresshopstatus(val) {
        if (val.branchStatus == 2) {
          return '已拒绝';
        } else {
          return this.cusshopStatus[val.shopStatus];
        }
      },
      loanAffirpeo(val) {
        //console.log(val.auditBoSysAccountName);
        if (val.branchStatus == 2) {
          return val.auditBoSysAccountName;
        } else {
          return val.affirmShopSysAccountName;
        }
      },
      showDialog() {
        this.dialogFormVisible = true;
        this.finSubtenancyform.SubtenancyAmount = '';
        this.finSubtenancyform.BorrowDisCompanyInfoId = '';
        this.finSubtenancyform.Remark = '';
      }

    }
  }
</script>

<style lang='scss' scoped>
</style>
