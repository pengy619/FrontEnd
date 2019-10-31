<template>
  <div class='view'>
	  <div>
		  <h4>收款客户</h4>
		  <span style='display:inline-block;width:75px;text-align: right;padding-right:8px;'>客户名称: </span>
		  <el-input style='width:150px;' size='small' :nodel='customerName'></el-input>
	  </div>
	  <div>
		  <h4>客户信息</h4>
      <div>
        <el-form ref="form" :model="infoList" id="infoList" label-width="80px">
        
          <el-form-item label="收款方式" class="form-inline-input">
            <el-select v-model="infoList.type" placeholder="全部">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="微信" value="微信"></el-option>
              <el-option label="支付宝" value="支付宝"></el-option>
              <el-option label="银联" value="银联"></el-option>
              <el-option label="转账" value="转账"></el-option>
              <el-option label="现金" value="现金"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款金额" class="form-inline-input">
            <el-input v-model="infoList.number"></el-input>
            <el-button type="primary">计算器</el-button>
          </el-form-item>
          <el-form-item label="收款人" class="form-inline-input">
            <el-input v-model="infoList.people"></el-input>
          </el-form-item>
          <el-form-item label="收款时间" class="form-inline-input">
            <el-input v-model="infoList.time"></el-input>
          </el-form-item>
          <el-form-item label="附件" class="form-inline-input">
            <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          
          </el-form-item>
          <el-form-item label="备注" class="form-inline-input" style="width:100%">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="infoList.desc"></el-input>
          </el-form-item>
          </el-form>
      </div>
	  </div>
	  <div>
		  <h4>是否需要发票</h4>
      <div>
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
      </div>
	  </div>
	  <div>
		  <h4>收款订单</h4>
      <div>
        <el-table
          border
        :data="accountList"
        style="width: 100%">
          <el-table-column
            prop="account"
            label="应收款"
            >
          </el-table-column>
          <el-table-column
            prop="received"
            label="已收"
            >
          </el-table-column>
          <el-table-column
            prop="unreceived"
            label="未收"
            >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="订单号"
            >
          </el-table-column>
          <el-table-column
            prop="groupNum"
            label="团号"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="客户名称">
          </el-table-column>
          <el-table-column
            prop="xiangmu"
            label="项目">
          </el-table-column>
        </el-table>
        <div style='margin:15px 0;text-align:center'>
          <el-button size="small" type="primary" :disabled='this.radio == 2 ? false : true'>保 存</el-button>
          <el-button size="small" type="primary" :disabled='this.radio == 1 ? false : true' @click="nextStep">保存并开发票</el-button>
          <el-button size="small" type="primary">取 消</el-button>
        </div>
      </div>
	  </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
          customerName:'',
          infoList:{
                  type:'全部',
                  number:'',
                  people:'',
                  time:'',
                  attachment:'',
                  desc:''
          },
          radio:'2',
          radio1:'',
          accountList:[{
                  account:'1000',
                  unreceived:'0',
                  received:'100',
                  orderNum:'H20001',
                  groupNum:'TB001',
                  name:'宝中旅游',
                  xiangmu:'酒店'
              },{
                  account:'',
                  unreceived:'',
                  received:'',
                  orderNum:'',
                  groupNum:'',
                  name:'',
                  xiangmu:''
              },{
                  account:'',
                  unreceived:'',
                  received:'',
                  orderNum:'',
                  groupNum:'',
                  name:'',
                  xiangmu:''
              },{
                  account:'',
                  unreceived:'',
                  received:'',
                  orderNum:'',
                  groupNum:'',
                  name:'',
                  xiangmu:''
              },{
                  account:'',
                  unreceived:'',
                  received:'',
                  orderNum:'',
                  groupNum:'',
                  name:'',
                  xiangmu:''
              }
          ],
          modalList:{
                name:'',
                taxNum:'',
                address_province:'',
                address_city:'',
                address_district:'',
                address_detail:'',
                phone:'',
                bankAccount:'',
                depositBank:'',
            }
        }
    },
    methods: {
      nextStep(){
        this.$router.push({path:'/grouptour/kaifapiao'})
      }
    }
  }
</script>
<style scoped lang="scss">
	@import '../../../style/common.scss';
  .form-inline-input {
      width:40%;
      float:left;
      padding-right:5%;
  }
  .form-inline-input .el-input {
      width: 200px;
      margin-right:5%;
    }
  #infoList::after {
      clear: both;
      content: '.';
      display: block;
      width: 0;
      height: 0;
    }
</style>
