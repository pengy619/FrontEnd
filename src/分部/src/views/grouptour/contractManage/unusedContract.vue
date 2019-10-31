<template>
  <div class='view'>
    <el-form size="small" :inline="true"  label-width="80px">
      <el-form-item label="合同类型">
        <el-select v-model="ContractTypeId" placeholder="请选择" size='small'>
          <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
       </el-form-item>
      <el-form-item label="合同编号">
        <el-input v-model="ContractNo" placeholder="" size='small'></el-input>
       </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="UserName" placeholder="" size='small'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class='search' size="small" type="warning" icon="el-icon-search"
                   @click='queryData(pagination.size,1)'>搜索
        </el-button>
      </el-form-item>
    </el-form>
    <el-row class="margin_bottom">
        <el-button size="small" type="primary" icon="el-icon-plus" @click='addContract'>添加</el-button>
        <el-button size="small" type="primary" icon="el-icon-delete" @click='deleteContract' :disabled='dis_btn'>删除</el-button>
        <el-button size="small" type="primary" @click='initBatchLose' :disabled='dis_btn'>批量设置丢失</el-button>
        <el-button size="small" type="primary" @click='initBatchInvalid' :disabled='dis_btn'>批量设置作废</el-button>
        <el-button size="small" type="primary" @click='initDistributeDialog'>合同派发</el-button>
        <el-button size="small" type="primary" @click='redemptVisible = true'>合同换领</el-button>
    </el-row>
    <!-- <el-row>
        <el-col>
            总计： 未使用<span style='color:#e4393c;margin-left:0;widrh:200px;text-align:left;'>{{num}}</span>
        </el-col>
    </el-row> -->
    <el-table size="small" ref="multipleTable" :data="unusedList" max-height="800" tooltip-effect="dark"
              style="width: 100%" v-loading='tableLoading'  @selection-change="unsendSelectionChange">
      <el-table-column size="small" type="selection" align="center"></el-table-column>
      <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="categoryName" label="合同类别" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="createTimeStr" label="创建时间" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="createUserName" label="创建人" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="contractCode" label="合同编号" align="center"
                       show-overflow-tooltip></el-table-column>
      <!-- <el-table-column size="small" align="center"  label="操作" fixed="right" width='150'>
          <template slot-scope="scope">
              <el-button type="text" size="mini" @click='lostVisible = true'>丢失</el-button>
              <el-button type="text" size="mini" @click='invalidVisible = true'>作废</el-button>
              <el-button type="text" size="mini" @click='checkVisible = true'>查看</el-button>
          </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data='pagination'
        @size-change="sizeChange"
        @current-change="currentPageChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog title="合同换领" :visible.sync="redemptVisible" :show-close='false' center width="700px">
      <el-row class="margin_bottom">
        <el-col>
          <span>换领对象:</span>
          <el-select v-model="CompanyInfoID" placeholder="请选择" class="el-input--small" @change="getCompanyInfoName">
            <el-option
              v-for="item in SenderList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
          <span>换领人</span>
          <el-input v-model="ChangeName" class="el-input--small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <span class="margin_left_25px">现有合同:</span>
        <el-col class="width_505">
          <el-form :model="item" :rules="oldRules" ref="item" v-for="(item,index) in OldForm"
                   class="el-form-style" :inline="true">
            <el-form-item label="合同类型" size="small" prop="type">
              <el-select v-model="item.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  v-show="item.name!='全部'"
                >
                </el-option>
              </el-select>
              <el-button size="small" type="danger" v-show="index > 0" @click="delOldItem(index)">删除</el-button>
            </el-form-item>
            <el-row>
              <el-col class="margin_left_0">
                <el-form-item label="合同编号" size="mini" prop="contractQZ">
                  <el-input v-model="item.contractQZ" placeholder="合同前缀"></el-input>
                </el-form-item>
                <el-form-item size="mini" prop="contractStart">
                  <el-input v-model.number="item.contractStart" placeholder="开始序号"></el-input>
                </el-form-item>
                <span>至</span>
                <el-form-item size="mini" prop="contractEnd">
                  <el-input v-model.number="item.contractEnd" placeholder="结束序号" @blur='testContractNO(item)'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-button size="small" class="add_btn" @click="addOldItem">添加行</el-button>
      </el-row>
      <el-row>
        <span class="margin_left_25px">换领合同:</span>
        <el-col class="width_505">
          <el-form :model="item1" :rules="newRules" ref="item1" v-for="(item1,index) in NewForm"
                   class="el-form-style" :inline="true">
            <el-form-item label="合同类型" size="small" prop="type">
              <el-select v-model="item1.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  v-show="item.name!='全部'"
                >
                </el-option>
              </el-select>
              <el-button size="small" type="danger" v-show="index > 0" @click="delNewItem(index)">删除</el-button>
            </el-form-item>
            <el-row>
              <el-col class="margin_left_0">
                <el-form-item label="合同编号" size="mini" prop="contractQZ">
                  <el-input v-model="item1.contractQZ" placeholder="合同前缀"></el-input>
                </el-form-item>
                <el-form-item size="mini" prop="contractStart">
                  <el-input v-model.number="item1.contractStart" placeholder="开始序号"></el-input>
                </el-form-item>
                <span>至</span>
                <el-form-item size="mini" prop="contractEnd">
                  <el-input v-model.number="item1.contractEnd" placeholder="结束序号" @blur="testContractNO(item1)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-button size="small" class="add_btn" @click="addNewItem">添加行</el-button>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('item','item1')" size='small'>取 消</el-button>
        <el-button type="primary" size='small' @click="changeContract('item','item1')" :loading='confirmLoading'>确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="合同派发" :visible.sync="distributeVisible" width="820px" :show-close='false' center>
      <el-table :data="distributeTable" border height='300' width='700' @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column prop="contractTypeName" label="合同类型" align='center' width='120px'>
        </el-table-column>
        <el-table-column prop="reCount" label="现有合同数" align='center' width='130px'>
          <template slot-scope="scope">
            <span>份数 : </span>{{scope.row.reCount}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="派发合同数量" align='center' width='320px'>
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.sendNumber"></el-input>
            <!-- <el-input v-model="scope.row.fixNo" placeholder="前缀" class='qz' size='mini'></el-input>
            <el-input v-model="scope.row.contractCodeFrom" placeholder="序号" class="tableinput" size='mini'
                      @blur='getQuantity(scope.row)'></el-input>
            <span style='margin:0 5px;'>至</span>
            <el-input v-model="scope.row.contractCodeEnd" placeholder="序号" class="tableinput" size='mini'
                      @blur='getQuantity(scope.row)'></el-input> -->
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="查看派发合同编号" align='center'>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="LookFor(scope.row)">查看</el-button>
            <!-- <span>份数 : </span>{{scope.row.quantity}} -->
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="distributeForm" :rules="distributeRule" ref="distributeForm" label-width='80px'
               style='margin:20px 0 0 100px;'>
        <el-form-item label="派发对象" prop='CompanyInfoID'>
          <el-select
          v-model="distributeForm.CompanyInfoID"
          filterable
          reserve-keyword
          placeholder="请输入关键词选择"
          @change="handleChangeCompanyInfoID"
          :loading="distributeForm.loading">
          <el-option
            v-for="item in distributerList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
          <!-- <el-select v-model="distributeForm.CompanyInfoID" placeholder="请选择" size='small' @change="handleChangeCompanyInfoID">
            <el-option
              v-for="item in distributerList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select> -->
		  <span class="margin_left" v-show="isShowContractCount"><span v-show="contractCount>=0">可以派发的数量：<span class="warning">{{contractCount}}</span></span><span class="danger" v-show="contractCount<0">暂无可派发数量</span></span>
        </el-form-item>
        <el-form-item label="领取人" prop='LendName'>
          <el-input v-model="distributeForm.LendName" size='small'></el-input>
        </el-form-item>
        <el-form-item label="备注" style='width:450px;'>
          <el-input type='textarea' v-model="distributeForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="distributeVisible = false" size='small'>取 消</el-button>
        <el-button type="primary" size='small' @click='handleDistribute' :loading="distribute_load">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="LookForVisible" width="50%" :before-close="handleClose">
      <el-row>
        <span>{{this.LookForList}}</span>
      </el-row>
    </el-dialog>
    <el-dialog title="" :visible.sync="lostVisible" width="30%" :show-close='false'>
      <el-form :model="lostForm" :rules="lostRule" ref="lostForm" style='margin-top:-50px;'>
        <el-form-item label='丢失原因'>
          <el-input type="textarea" :rows="4" v-model="lostForm.lostReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lostVisible = false" size='small'>取 消</el-button>
        <el-button type="primary" size='small' @click='batchLoseContract'>确 定</el-button>
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
        <el-button type="primary" size='small' @click='batchInvalidContract'>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="checkVisible" width="400px" center :show-close='false'>
      <el-row style='margin-top:-50px;'>
        <el-col>
          <span>作废时间</span>{{checkData.time}}
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>作废人</span>{{checkData.person}}
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>作废原因</span>{{checkData.reason}}
        </el-col>
      </el-row>
      <el-button @click="checkVisible = false" size='small' style='margin:10px 0 0 45%;'>取 消</el-button>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .el-input {
    width: 200px;
  }

  .dialog-footer {
    margin-top: -30px;
  }

  .el-row .el-col {
    margin: 15px 10px 10px 15px;
  }

  .el-dialog .el-row .el-col {
    margin: 5px 20px;
  }

  .inline .el-col {
    width: 280px;
  }

  .el-row .el-col .el-select {
    width: 200px;
  }

  .el-row .el-col span {
    display: inline-block;
    width: 60px;
    text-align: right;
    margin-right: 10px;
  }

  .search {
    margin-left: 20px;
  }

  .tableinput {
    width: 60px;
  }

  .qz {
    width: 80px;
    margin-right: 20px;
  }

  .view .el-dialog .el-row .width_505 {
    width: 503px;
    margin-left: 13px;
  }

  .add_btn {
    position: absolute;
    right: 15px;
  }

  .view .el-dialog .el-row .margin_left_0 {
    margin-left: 0px;

  .el-input.el-input--mini {
    width: 100px;
  }

  span {
    width: auto;
    margin-right: 0px;
    margin-left: -10px;
  }

  }
</style>
<script>
  export default {
    data(){
      var checkgetName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('领取人不能为空'));
        } else if (!(/^[^ ]+$/.test(value))) {
          callback(new Error('领取人不能含有空格'))
        } else {
          callback()
        }
      };
      return {
		isShowContractCount:false,
        LookForVisible: false,  //查看派发合同编号
        dis_btn:true,
        tableLoading: false,
        unusedList: [],
        ContractNo: '',
        ContractTypeId: 0,
        UserName: '',
        // 合同派发
        distributeForm: {
          LendName: '',
          CompanyInfoName: '',
          sendName: '',
          desc: '',
          loading:false
        },
        distribute_load: false,
        multipleSelection: [],
        unsendSelections: [],
        distributeTable: [],
        distributerList: [],
        distributeRule: {
          CompanyInfoName: [{type: 'number', required: true, message: '您还没有选择派发对象', trigger: 'change'}],
          LendName: [{required: true, validator: checkgetName, trigger: 'blur'}],
          CompanyInfoID:[{ type: 'number',required: true, message:'请选择派发对象',trigger: 'change'}]
        },
        distributeVisible: false,
        SenderList: [],
        options: [],
        CompanyInfoID: '',
        ChangeName: '',
        CompanyInfoName: '',
        //合同换领
        OldForm: [
          {
            type: '',
            contractQZ: '',
            contractStart: '',
            contractEnd: ''
          }
        ],
        NewForm: [
          {
            type: '',
            contractQZ: '',
            contractStart: '',
            contractEnd: ''
          }
        ],
        oldRules: {
          type: [
            {type: 'number', required: true, message: '请选择合同号类型', trigger: 'change'}
          ],
          contractQZ: [
            {required: true, message: '请输入合同号前缀', trigger: 'blur'}
          ],
          contractStart: [
            {required: true, message: '请输入开始序号'},
            {type: 'number', message: '请输入数字'}
          ],
          contractEnd: [
            {required: true, message: '请输入结束序号'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        newRules: {
          type: [
            {type: 'number', required: true, message: '请选择合同号类型', trigger: 'change'}
          ],
          contractQZ: [
            {required: true, message: '请输入合同号前缀', trigger: 'blur'}
          ],
          contractStart: [
            {required: true, message: '请输入开始序号'},
            {type: 'number', message: '请输入数字'}
          ],
          contractEnd: [
            {required: true, message: '请输入结束序号'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        redemptVisible: false,
        confirmLoading: false,
        //丢失原因
        lostForm: {lostReason: ''},
        lostRule: {},
        lostVisible: false,
        //作废原因
        invalidForm: {invalidReason: ''},
        invalidRule: {},
        invalidVisible: false,
        //查看
        checkVisible: false,
        checkData: {},
        pagination: {
          sizes: [5, 10, 20, 50],
          size: 10,
          currentPage: 1,
          total: 0
        },
        LookForList:[],
		ContractTypeList:[],
		contractCount:''
      }
    },
    mounted(){
      this.getContractSenders();
      this.GetContractType();
      this.GetContractDistributer();
      this.queryData();
    },
    methods: {
      queryData(size, index){
        this.tableLoading = true;
        this.groupHttp.post('/Contract/GetUnSendContractList', {
          ContractTypeId: this.ContractTypeId,
          ContractNo: this.ContractNo,
          UserName: this.UserName,
          PageSize: size ? size : 10,
          PageIndex: index ? index : 1
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.unusedList = res.data.objects;
            this.pagination.total = res.data.total;
            this.tableLoading = false;
          } else {
            this.$message.error(res.data.message)
            setTimeout(() => {
              this.tableLoading = false;
            }, 1000)
          }
        }).catch(e=>{
          console.log(e);
          this.$message.error('加载失败!')
          setTimeout(() => {
            this.tableLoading = false;
          }, 1000)
        })

      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      unsendSelectionChange(val){
        this.unsendSelections = val;
        if(this.unsendSelections.length > 0){
          this.dis_btn = false;
        }else{
          this.dis_btn = true;
        }
      },
      //分页
      sizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      //添加
      addContract(){
        this.$router.push({
          path: '/ContractManage/IncreaseContract'
        })
      },
      //删除合同
      deleteContract(){
        this.$confirm("是否执行丢失操作?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ContractIDs = [];
          this.unsendSelections.forEach( s => {
            ContractIDs.push(s.contractId)
          })
          this.groupHttp.post('Contract/DeleteContract',{
              ContractIDs:ContractIDs
          }).then(res => {
              if(res.data.isSuccess == true){
                  this.$message({
                      type:'success',
                      message:'删除成功!'
                  })
                  this.queryData();
              }else{
                  this.$message({
                      type:'info',
                      message:'出错了!' + res.data.message
                  })
              }
          }).catch(e => {
              console.log(e);
          })
        }).catch(e => {
            console.log(e);
        })
      },
      //修改派发对象获取可派发数量
      handleChangeCompanyInfoID(val){
		  this.groupHttp.get('Contract/GetSurplusContractQuota?companyInfoID='+val).then(res=>{
			  this.contractCount=res.data;
			  this.isShowContractCount=true;
		  }).catch(e=>{
			   console.log(e);
		  })
      },
      initBatchLose(){
        this.lostVisible = true;
        this.lostForm = {lostReason: ''}
      },
      initBatchInvalid(){
        this.invalidVisible = true;
        this.invalidForm = {invalidReason: ''}
      },
      //批量丢失
      batchLoseContract(){
        if(!this.lostForm.lostReason){
          this.$message.error('您还没有填写丢失原因!');
          return;
        }
        this.$confirm("是否执行丢失操作?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ContractIDs = [];
          this.unsendSelections.forEach( s => {
            ContractIDs.push(s.contractId)
          })
          this.groupHttp.post('Contract/BatchLoseContract',{
              ContractIDs:ContractIDs,
              LoseDesc:this.lostForm.lostReason
          }).then(res => {
              console.log(res);
              if(res.data.isSuccess == true){
                  this.$message({
                      type:'success',
                      message:'合同丢失成功!'
                  })
                  this.queryData();
                  this.lostVisible = false;
              }else{
                  this.$message({
                      type:'info',
                      message:'出错了!' + res.data.message
                  })
              }
          }).catch(e => {
              console.log(e);
          })
        }).catch(e => {
            console.log(e);
        })
      },
      //批量作废
      batchInvalidContract(){
        if(!this.invalidForm.invalidReason){
          this.$message.error('您还没有填写作废原因!');
          return;
        }
        this.$confirm("是否执行作废操作?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ContractIDs = [];
          this.unsendSelections.forEach( s => {
            ContractIDs.push(s.contractId)
          })
          this.groupHttp.post('Contract/BatchInvalidContract',{
              ContractIDs:ContractIDs,
              InvalidDesc:this.invalidForm.invalidReason
          }).then(res => {
              console.log(res);
              if(res.data.isSuccess == true){
                  this.$message({
                      type:'success',
                      message:'合同作废成功!'
                  })
                  this.queryData();
                  this.invalidVisible = false;
              }else{
                  this.$message({
                      type:'info',
                      message:'出错了!' + res.data.message
                  })
              }
          }).catch(e => {
              console.log(e);
          })
        }).catch((e) => {
            console.log(e);
        });
      },
      //合同换领 验证
      testContractNO(val){
        if(val.contractStart > val.contractEnd){
            this.$message.error('合同开始编号不能大于结束编号');
            val.contractEnd = '';
        }
      },
      //合同换领
      cancel(item,item1){
        this.redemptVisible = false;
        this.ChangeName = "";
        for (let i = 0; i < this.$refs[item].length; i++) {
          this.$refs[item][i].resetFields()
        };
        for (let i = 0; i < this.$refs[item1].length; i++) {
          this.$refs[item1][i].resetFields()
        };
      },
      getCompanyInfoName(val){
        this.SenderList.forEach(item => {
          if (item.key == val) {
            this.CompanyInfoName = item.value
          }
        })
      },
      //初始化合同派发对话框
      initDistributeDialog(){
		this.distributeTable=[];
		this.isShowContractCount=false;
        this.distributeVisible = true;
        this.initSendItem();
        this.multipleSelection= [];
        this.distributeForm = {
          LendName: '',
          CompanyInfoID: '',
          CompanyInfoName: '',
          sendName: '',
          desc: '',
        };
      },
      //获取分项合同数量
      getQuantity(row){
        if (isNaN(row.contractCodeFrom) || isNaN(row.contractCodeEnd)) {
          this.$message({
            type: 'info',
            message: '合同编号只能是正整数'
          })
          row.quantity = '';
          return;
        }
        row.contractCodeFrom = Number(row.contractCodeFrom);
        row.contractCodeEnd = Number(row.contractCodeEnd);
        if (row.contractCodeFrom > row.contractCodeEnd && row.contractCodeEnd != 0) {
          this.$message({
            type: 'info',
            message: '合同编号起始值不能大于结束值!'
          })
          row.quantity = '';
        } else {
          this.groupHttp.post('/Contract/GetContractSendItemQuantity', {
            dto: {
              contractTypeId: row.contractTypeId,
              contractTypeName: row.contractTypeName,
              fixNo: row.fixNo,
              sendNumber:row.sendNumber,
              contractCodeFrom: row.contractCodeFrom,
              contractCodeEnd: row.contractCodeEnd
            }
          }).then(res => {
            if (res.data.isSuccess == true) {
              row.quantity = res.data.quantity;
            } else {
              this.$message({
                type: 'info',
                message: '出错了!' + res.data.message
              })
              row.quantity = '';
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      changeContract(item, item1){
        let tab1 = false;
        let tab2 = false;
        for (let i = 0; i < this.$refs[item].length; i++) {
          this.$refs[item][i].validate((valid) => {
            if (valid) {
              tab1 = true
            } else {
              return false;
            }
          })
        };
        for (let i = 0; i < this.$refs[item1].length; i++) {
          this.$refs[item1][i].validate((valid) => {
            if (valid) {
              tab2 = true;
            } else {
              return false;
            }
          })
        }
        if( tab1 == true && tab2 == true){
          if (this.ChangeName == "") {
            this.$message.error('请输入换领人')
          } else {
            let oldArr = [];
            let newArr = [];
            this.confirmLoading = true;
            this.OldForm.forEach((item, index) => {
              for (let i = item.contractStart; i <= item.contractEnd; i++) {
                oldArr.push({ContractTypeId: item.type, ContractNo: item.contractQZ + i})
              }
            });
            this.NewForm.forEach((item, index) => {
              for (let i = item.contractStart; i <= item.contractEnd; i++) {
                newArr.push({ContractTypeId: item.type, ContractNo: item.contractQZ + i})
              }
            })
            this.groupHttp.post('/Contract/ChangeContract', {
              CompanyInfoID: this.CompanyInfoID,
              ChangeName: this.ChangeName,
              CompanyInfoName: this.CompanyInfoName,
              Olds: oldArr,
              News: newArr
            }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: 'success',
                  message: '换领成功'
                })
                this.confirmLoading = false;
                cancel(item, item1)
              } else {
                this.$message.error(res.data.message)
                this.confirmLoading = false;
              }
            })
          }
        }
      },
      //合同派发
      handleDistribute(){
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "info",
            message: '您还没有选择要派发的合同类型!'
          })
          return;
        }
        this.distributerList.forEach(val => {
          if (val.key == this.distributeForm.CompanyInfoID) {
            this.distributeForm.CompanyInfoName = val.value;
          }
        });
        this.$refs['distributeForm'].validate(valid => {
          if (valid) {
            this.distribute_load = true;
            this.groupHttp.post('/Contract/AddContractSend', 
            {
                ContractTypes: this.multipleSelection,
                CompanyInfoID:this.distributeForm.CompanyInfoID,
                CompanyInfoName: this.distributeForm.CompanyInfoName,
                LendName: this.distributeForm.LendName,
                desc: this.distributeForm.desc
            }
            ).then(res => {
              if (res.data.isSuccess == true) {
                this.SenderList = res.data.objects;
                this.$message({
                  type: "success",
                  message: '合同派发成功!'
                })
                this.queryData();
                this.distributeVisible = false;
                 this.distribute_load = false;
              }else{
                this.$message({
                  type: "info",
                  message: res.data.message
                })
                
                this.distribute_load = false;
              }
            }).catch(e => {
              this.distribute_load = false;
              console.log(e)
            })
            
          }
        })
      },
      //获取换领对象
      getContractSenders(){
        this.groupHttp.get('/Contract/GetContractSenders?keyword=""').then(res => {
          if (res.data.isSuccess == true) {
            this.SenderList = res.data.objects
            this.CompanyInfoID = this.SenderList[0].key
            this.CompanyInfoName = this.SenderList[0].value
          }
        })
      },
      //获取合同类型
      GetContractType(){
        this.groupHttp.get('/Contract/GetContractTypeNames').then(res => {
          if (res.data.isSuccess == true) {
            this.options = res.data.objects
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      //派发操作初始化
      initSendItem(){
        this.groupHttp.post('/Contract/GetContractSendItem').then(res => {
          if (res.data.isSuccess == true) {
            res.data.list.forEach(v => {
              let obj = {};
              // obj.fixNo = '';
              // obj.contractCodeFrom = 0;
              // obj.contractCodeEnd = 0;
              // obj.quantity = 0;
              obj.contractTypeName = v.contractTypeName;
              obj.reCount = v.reCount;
              obj.contractTypeId = v.contractTypeId;
              obj.sendNumber='';
              this.distributeTable.push(obj);
            })
          }
        })
      },
      //获取派发对象
      GetContractDistributer(keyword=""){
        this.distributeForm.loading=true
        this.groupHttp.get('/Contract/GetContractSenders?keyword='+keyword).then(res => {
          if (res.data.isSuccess == true) {
            this.distributerList = res.data.objects
          } else {
            this.$message.error(res.data.message)
          }
          this.distributeForm.loading=false
        })
      },
      //添加合同
      addOldItem(){
        this.OldForm.push({
          type: '',
          contractQZ: '',
          contractStart: '',
          contractEnd: ''
        })
      },
      addNewItem(){
        this.NewForm.push({
          type: '',
          contractQZ: '',
          contractStart: '',
          contractEnd: ''
        })
      },
      //删除
      delOldItem(index){
        this.OldForm.splice(index, 1)
      },
      delNewItem(index){
        this.NewForm.splice(index, 1)
      },
      LookFor(row){
        this.LookForVisible = true;
        this.groupHttp.get('Contract/GetContractNoList?ContractTypeId='+row.contractTypeId+
        "&Number="+row.sendNumber)
        .then(res =>{
          if(res.data.length>0){
            this.LookForList=res.data
          }else{
            this.LookForList='请输入派发的合同数量';
          }
        })
      },
      handleClose(){
        this.LookForVisible = false;
        this.LookForList =[];
      },
    },
  }
</script>
