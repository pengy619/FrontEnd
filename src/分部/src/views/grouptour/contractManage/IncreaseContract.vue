<template>
  <div class="view">
    <el-form :model="contractForm" :rules="rules" ref="contractForm" class="demo-ruleForm">
       <el-form-item prop="ContractCategoryId" label="合同类别" size="small" label-width="100px" >
        <el-select v-model="contractForm.ContractCategoryId" placeholder="请选择">
          <el-option
            :key="1"
            label="纸质合同"
            :value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ContractTypeId" label="合同类型" size="small" label-width="100px" >
        <el-select v-model="contractForm.ContractTypeId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-show="item.name !='全部'"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="AddType" label="合同编号" label-width="100px">
        <el-radio-group v-model="contractForm.AddType">
          <el-radio label="1">录入连续的合同号</el-radio>
          <el-radio label="2">录入单个合同号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row v-show="contractForm.AddType == 1">
        <el-col :span="5" style="width: 250px">
          <el-form-item prop="FixNo" label-width="100px" >
            <el-input v-model="contractForm.FixNo" size="small" placeholder="合同号前缀" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="ht_input_width" style="margin: 0px 10px">
          <el-form-item prop="ContractNoFrom">
            <el-input :controls="false" v-model="contractForm.ContractNoFrom" :min="0" size="small" placeholder="开始序号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="ht_input_width">
          <el-form-item prop="ContractNoTo">
            <el-input v-model="contractForm.ContractNoTo" size="small" placeholder="结束序号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="contractForm.AddType == 2">
        <el-col :span="5" style="margin-right: 10px;width: 250px">
          <el-form-item prop="FixNo" label-width="100px" >
            <el-input v-model="contractForm.FixNo" size="small" placeholder="合同号前缀"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="ht_input_width">
          <el-form-item prop="ContractNo">
            <el-input v-model ="contractForm.ContractNo" size="small" placeholder="合同序号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="100px">
        <el-button type="primary" size="small" @click="addContract" :loading='add_loading'>确定</el-button>
        <el-button type="info" size="small" @click='goBack'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>

</style>
<script>
  export default {
    data(){
       var contractNos = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入合同序号'));
        } else if(!(/^\d/.test(value))) {
          callback(new Error('您输入的序号有误'))
          }
          callback();
        };
        var ContractNoFroms = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入合同编号'));
        } else if(!(/^\d/.test(value))) {
          callback(new Error('您输入的编号有误'))
          }
          callback();
        }
      return {
        add_loading:false,
        contractForm: {
          ContractCategoryId:1,
          ContractTypeId: '',
          AddType: '1',
          ContractNoFrom: '',
          ContractNoTo: '',
          ContractNo: '',
          FixNo:''
        },
        options: [],
        rules: {
          ContractCategoryId:[
            { type:'number',message: '请输入活动名称', trigger: 'change'}
          ],
          ContractTypeId: [
            { type:'number',message: '请输入合同类型', trigger: 'change'}
          ],
          ContractNoFrom: [
            { required: true, validator:contractNos,type: 'string',},
          ],
          FixNo: [
            {required: true, message: '请输入合同号前缀', trigger: 'blur'}
          ],
          ContractNoTo: [
             { required: true, validator:contractNos,type: 'string',},
          ],
          ContractNo: [
            { required: true, validator:contractNos,type: 'string'}
          ]
        },
        contractTypeList:[]
      }
    },
    mounted(){
        this.GetContractType()
        //获取合同类别
        // this.groupHttp.get('/Contract/GetContractCategoryList').then(res=>{
        //      if(res.data.isSuccess == true){
        //        this.contractTypeList=res.data.list;
        //      }else{
        //        this.$message.error(res.data.message);
        //      }
        //   })
    },
    methods: {
      goBack(){
        this.$router.go(-1)
      },
      GetContractType(){
         this.groupHttp.get('/Contract/GetContractTypeNames').then(res=>{
            if(res.data.isSuccess == true){
                this.options = res.data.objects
            }else{
                this.$message.error(res.data.message)
            }
         })
     },
      //保存新增合同
      addContract(){
        this.add_loading = true
          this.groupHttp.post('/Contract/AddContract',{Dto:this.contractForm}).then(res=>{
             if(res.data.isSuccess == true){
               this.$message({
                 message: '保存成功',
                 type: 'success'
               })
               this.add_loading = false;
               this.$router.push('/ContractManage/unusedContract')
             }else{
               this.$message.error(res.data.message);
               this.add_loading = false;
             }
          })
      }
    }
  }
</script>
