<template>
    <div class='view'>
         <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="使用状态" >
                <el-select v-model="ContractStatus" placeholder="请选择" clearable>
                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型" >
                <el-select v-model="ContractType" placeholder="请选择"  clearable>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同编号" >
                <el-input v-model="ContractNo" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="使用人" >
                 <el-input v-model="UserByName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="订单号" >
                <el-input v-model="OrderNo" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="" >
                <el-button type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row style="margin-bottom:10px">
              <el-button size="small" type="primary" :disabled="flag"  @click='Return'>合同归还</el-button>
              <!-- <el-button size="small" type="primary" @click="borrowContract">转借合同</el-button> -->
        </el-row>
        <el-table size="small" ref="multipleTable" :data="contractList"
         tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
            <el-table-column size="small" align="center" type="selection"></el-table-column>
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userByName" label="使用人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userDateString" label="使用时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="statusString" label="使用状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" width='200' class='table-button'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled='!(scope.row.canView)' @click='checkContract(scope.row)' class='table-button'>查看</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canInvalid)' @click='invalidHandler(scope.row)' class='table-button'>作废</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canLose)' @click='lostHandler(scope.row)' class='table-button'>丢失</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canCancelReturn)' @click='Cancel(scope.row)' class='table-button'>取消归还</el-button>
                    <el-button type="text" size="mini" :disabled='scope.row.status!=5' @click='releaseContract(scope.row)' class='table-button'>释放合同</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                fixed="right"
                :data = 'pagination'
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.sizes"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog title="" :visible.sync="lostVisible" width="30%" :show-close='false'>
            <el-form :model="lostForm" :rules="lostRule" ref="lostForm" style='margin-top:-50px;'>
               <el-form-item label='丢失原因'>
                   <el-input type="textarea" :rows="4" v-model="lostForm.lostReason"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lostVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small'  @click='lostContract'>确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible.sync="invalidVisible" width="30%" :show-close='false'>
            <el-form :model="invalidForm" :rules="invalidRule" ref="invalidForm" style='margin-top:-50px;'>
               <el-form-item label='作废原因'>
                   <el-input type="textarea" :rows="4" v-model="invalidForm.invalidReason"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="invalidVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small' @click="invalidContract">确 定</el-button>
            </div>
        </el-dialog>
        <div>
          
        </div>
        <el-dialog title="合同转借" :visible.sync="dialogFormVisible" width='500px'>
            <el-form :model="contractForm" :rules="contractrules" ref="contractForm" :inline="true" label-width="80px">
              <el-form-item label="合同类型" size="small" prop="type" class="m_top_12px">
                <el-select v-model="contractForm.type" placeholder="请选择" @change="getTypeName">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-row>
              <el-col class="margin_left_0">
                <el-form-item label="合同编号" size="mini" prop="contractQZ">
                  <el-input v-model="contractForm.contractQZ" placeholder="合同前缀"></el-input>
                </el-form-item>
                <el-form-item size="mini" prop="contractStart">
                  <el-input v-model.number="contractForm.contractStart" placeholder="开始序号"></el-input>
                </el-form-item>
                <span>至</span>
                <el-form-item size="mini" prop="contractEnd">
                  <el-input v-model.number="contractForm.contractEnd" placeholder="结束序号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-form-item label="借入方" size="small" prop="borrowMan">
                <el-select v-model="contractForm.borrowMan" placeholder="请选择" @change="getCompanyInfoName">
                  <el-option
                    v-for="item in options"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop="linkMan">
              <el-input size="small" v-model="contractForm.linkMan"></el-input>
            </el-form-item>
             <el-form-item label="备注" prop="remarks">
                <el-input type="textarea" v-model="contractForm.remarks"></el-input>
              </el-form-item>
            </el-form>     
    <div slot="footer" class="dialog-footer">
    <el-button @click="cancelContract('contractForm')" size="small">取 消</el-button>
    <el-button type="primary" @click="contractLend('contractForm')" size="small" :loading="loading">确 定</el-button>
  </div>
</el-dialog>
        <el-dialog title="" :visible.sync="checkLostVisible" width="600px" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>丢失时间</span>{{checkLost.loseByDateFormat}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>丢失人</span>{{checkLost.loseByName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col style='position:relative'>
                    <span style='position:absolute;'>丢失原因</span><span style='position:absolute;left:85px;width:450px;text-align:left;'>{{checkLost.loseDesc}}</span>
                </el-col>
            </el-row>
            <el-button @click="checkLostVisible = false" size='small' class='cancle-btn'>取 消</el-button>
        </el-dialog>
        <el-dialog title="" :visible.sync="checkInvalidVisible" width="600px" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>作废时间</span>{{checkInvalid.invalidDateFormat}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>作废人</span>{{checkInvalid.invalidByName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span style='position:absolute;'>作废原因</span><span style='position:absolute;left:85px;width:450px;text-align:left;'>{{checkInvalid.invalidDesc}}</span>
                </el-col>
            </el-row>
            <el-button @click="checkInvalidVisible = false" size='small' class='cancle-btn'>取 消</el-button>
        </el-dialog>
    </div>
</template>
<style scoped lang="scss">
.el-input {
  width: 200px;
}
.el-row .el-col {
  width: 300px;
  margin: 15px 10px 10px 5px;
}
.el-row .el-col .el-select {
  width: 200px;
}
.el-row .el-col span {
  display: inline-block;
  width: 70px;
  text-align: right;
  margin-right: 10px;
}
.search {
  margin-left: 20px;
}
.table-button {
  padding: 7px 5px !important;
}
.view .el-dialog .el-row .margin_left_0 {
  margin-left: 0px;
  width: auto;
  .el-input.el-input--mini {
    width: 100px;
  }
  span {
    width: auto;
    margin-right: 0px;
    margin-left: -10px;
  }
}
.cancle-btn{
        margin:50px 0 0 45%;
    }

</style>
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      tableLoading:false,
      flag:true,
      contract:[],
      ContractIds:[],
      typeList: [],
      options: [],
      loading: false,
      ContractTypeName: "",
      InCompanyInfoName: "",
      ContractType: 0,
      statusList: [],
      ContractStatus: 0,
      ContractNo: "",
      UserByName: "",
      OrderNo: "",
      contractList: [],
      //丢失原因
      lostForm: { lostReason: "" },
      lostRule: {},
      lostVisible: false,
      //作废原因
      invalidForm: { invalidReason: "" },
      invalidRule: {},
      invalidVisible: false,
                //查看丢失
                checkLostVisible:false,
                checkLost:{},
                //查看作废
                checkInvalidVisible:false,
                checkInvalid:{},      
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      dialogFormVisible: false,
      contractForm: {
        type: "",
        contractQZ: "",
        contractStart: "",
        contractEnd: "",
        borrowMan: "",
        remarks: "",
        linkMan: ""
      },
      contractrules: {
        type: [
          {
            required: true,
            type: "number",
            message: "请输入合同类型",
            trigger: "change"
          }
        ],
        borrowMan: [
          {
            required: true,
            type: "number",
            message: "请输入借入方",
            trigger: "change"
          }
        ],
        contractQZ: [{ required: true, message: "请输入合同号前缀", trigger: "blur" }],
        linkMan: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contractStart: [
          { required: true, message: "请输入开始序号" },
          { type: "number", message: "请输入数字" }
        ],
        contractEnd: [
          { required: true, message: "请输入结束序号" },
          { type: "number", message: "请输入数字" }
        ]
      }
    };
  },
  methods: {
    queryData(size, index) {
        this.tableLoading = true;
      this.shopHttp
        .get(
          "Contract/ContractManagementList?ContractStatus=" +
            this.ContractStatus +
            "&ContractType=" +
            this.ContractType +
            "&UserByName=" +
            this.UserByName +
            "&ContractNo=" +
            this.ContractNo +
            "&OrderNo=" +
            this.OrderNo +
            "&PageSize=" +
            (size ? size : 10) +
            "&PageIndex=" +
            (index ? index : 1)
        )
        .then(res => {
          if (res.data.isSuccess == true) {
            this.contractList = res.data.objects;
            this.pagination.total = res.data.total;
            this.tableLoading = false;
          } else {
            this.$message({
              type: "info",
              message: "出错了" + res.data.message
            });
             this.tableLoading = false;
          }
        })
        .catch(e => {
          this.tableLoading = false;
          console.log(e);
        });
    },
    //释放合同
      releaseContract(row){
      this.shopHttp.post('Contract/ReleaseContract',{
        ContractNo:row.contractNo
      }).then(res=>{
        if(res.data.isSuccess == true){
          this.$message({
            type:'success',
            message:'合同释放成功'
          })
          this.queryData(this.pagination.size,this.pagination.currentPage)
        }else{
          this.$message.error(res.data.message)
        }
      }).catch(e=>{
        console.log(e);
      })
    },
    //查看
    check() {
      this.$router.push({
        path: "/grouptour/orderCheck"
      });
    },
    
            //查看
            checkContract(row){
                console.log(row);
                switch(row.statusString){
                    case '未派发':
                        break;
                    case '已派发':
                        break;
                    case '已丢失':
                        this.checkLostVisible = true;
                        this.checkLost = {
                            loseByDateFormat:row.loseByDateFormat,
                            loseByName:row.loseByName,
                            loseDesc:row.loseDesc
                        }
                        break;
                    case '已作废':
                        this.checkInvalidVisible = true;
                        this.checkInvalid = {
                            invalidDateFormat:row.invalidDateFormat,
                            invalidByName:row.invalidByName,
                            invalidDesc:row.invalidDesc
                        }
                        break;
                    case '已使用':
                        this.$router.push({
                            path:'/orderCenter/orderCheck',
                            query:{orderNo:row.orderNo,OrderType:row.orderType}
                        })
                        break;
                    case '已归还':
                        break;
                }
            },
            //初始化作废
            invalidHandler(row){
                this.invalidVisible = true;
                this.invalidForm = {invalidReason:''};
                this.currentRow = row;
            },
            //初始化丢失
            lostHandler(row){
                this.lostVisible = true;
                this.lostForm={lostReason:''};
                this.currentRow = row;
            },
      //丢失
            lostContract(){
                if(!this.lostForm.lostReason){
                    this.$message({
                        type:'info',
                        message:'您还没有填写丢失原因'
                    })
                    return;
                }
                this.shopHttp.post("Contract/LoseContract",{
                    LoseDesc:this.lostForm.lostReason,
                    Id:this.currentRow.id
                }).then(res => {
                    if (res.data.isSuccess == true) {
                        this.$message({
                            type: "success",
                            message: "操作丢失成功" 
                        })
                        this.queryData(this.pagination.size,this.pagination.currentPage)
                        this.lostVisible = false;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
            },
            //作废
            invalidContract(){
                if(!this.invalidForm.invalidReason){
                    this.$message({
                        type:'info',
                        message:'您还没有填写作废原因'
                    })
                    return;
                }
                this.shopHttp.post("Contract/InvalidContract",{
                    InvalidDesc:this.invalidForm.invalidReason,
                    Id:this.currentRow.id
                }).then(res => {
                    if (res.data.isSuccess == true) {
                        this.$message({
                            type: "success",
                            message: "操作作废成功" 
                        })
                        this.queryData(this.pagination.size,this.pagination.currentPage)
                        this.invalidVisible = false;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
            },
    sizeChange(val) {
      this.pagination.size = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    borrowContract() {
      this.dialogFormVisible = true;
    },
    //获取类型名称
    getTypeName(val) {
      this.typeList.forEach(item => {
        if (item.id == val) {
          this.ContractTypeName = item.name;
        }
      });
    },
    //获取借入方名称
    getCompanyInfoName(val) {
      this.options.forEach(item => {
        if (item.key == val) {
          this.InCompanyInfoName = item.value;
        }
      });
    },
    //获取借入方
    GetContractBorrowers() {
      this.shopHttp.get("/Contract/GetContractBorrowers?keyword=").then(res => {
        if (res.data.isSuccess == true) {
          this.options = res.data.objects;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //取消
    cancelContract(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    //转借合同
    contractLend(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.shopHttp
            .post("/Contract/ContractLend", {
              ContractTypeId: this.contractForm.type,
              InCompanyInfoName: this.InCompanyInfoName,
              ContractTypeName: this.ContractTypeName,
              ContractPrefix: this.contractForm.contractQZ,
              StartNum: this.contractForm.contractStart,
              EndNum: this.contractForm.contractEnd,
              InCompanyInfoId: this.contractForm.borrowMan,
              InContanct: this.contractForm.linkMan,
              Desc: this.contractForm.remarks
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "转借成功"
                });
                this.loading = false;
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
              } else {
                this.loading = false;
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    Return(){//合同归还
        this.shopHttp.post('Contract/ReturnContract',{ContractIds:this.ContractIds})
        .then(res =>{
            if(res.data.isSuccess ==true){
                this.queryData();
                this.$message({
                    type: 'success',
                    message:'合同归还成功！'
                })
            }else{
                this.$message({
                    type: 'info',
                    message:'合同归还失败！'
                })
            }
        })
    },
    handleSelectionChange(val){ //多选
        this.contract = val;
        this.ContractIds = [];
        for(let i=0;i<this.contract.length;i++){
            this.ContractIds.push(this.contract[i].id);
            console.log(this.contract[i].canReturn)
            if(this.contract[i].canReturn == false){
                this.flag = true;
                return;
            }else{
                this.flag = false;
            } 
        }
    },
    Cancel(row){
        this.$confirm('确定取消合同归还?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.shopHttp.post('/Contract/CancelReturnContract',{ContractId:row.id})
                .then(res =>{
                    if(res.data.isSuccess ==true){
                        this.queryData();
                        this.$message({
                            type: 'success',
                            message:'取消归还成功！'
                        })
                    }else{
                        this.$message({
                            type: 'info',
                            message:'取消归还失败！'
                        })
                    }
                })
            })
    }
  },
  mounted() {
    this.queryData();
    this.GetContractBorrowers();
    //获取合同类型
    this.shopHttp
      .get("Contract/GetContractTypeNames")
      .then(res => {
        if (res.data.isSuccess == true) {
          this.typeList = res.data.objects;
        } else {
          this.$message({
            type: "info",
            message: "出错了" + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    //获取使用状态
    this.shopHttp
      .get("Contract/GetContractStatus")
      .then(res => {
        //console.log(res);
        if (res.data.isSuccess == true) {
          this.statusList = res.data.objects;
        } else {
          this.$message({
            type: "info",
            message: "出错了" + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>
