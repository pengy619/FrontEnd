<template>
  <div class="view">
    <el-header>
      <el-steps :active="1" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" class="demo-infoForm" size="small">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="infoForm.name" class="inp_width"></el-input>
      </el-form-item>
      <el-form-item label="产品简称" prop="shortName">
        <el-input v-model="infoForm.shortName" class="inp_width"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="内部编码">
            <el-input v-model="infoForm.nbCoding"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="外部编码">
            <el-input v-model="infoForm.wbCoding"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="产品所在地" prop="address">
        <address-select width="200px" :data-type="AirlineType" @result="addressResult"
                        class="address_width" ref= 'addressSelect'></address-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-select v-model="infoForm.supplier" placeholder="请选择供应商">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="票种" prop="variety">
        <el-select v-model="infoForm.variety" placeholder="请选择票种">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应景点" prop="tags">
        <el-tag
          v-for="tag in infoForm.tags"
          :key="tag"
          closable
          >
          {{tag}}
        </el-tag>
        <el-button  size="small" @click="showTable">添加</el-button>
      </el-form-item>
      <el-form-item label="适用人群" prop="personExplain">
        <el-input type="textarea" v-model="infoForm.personExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="营业时间说明" prop="dateExplain">
        <el-input type="textarea" v-model="infoForm.dateExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="产品包含人数" prop="person">
        成人：<el-input v-model="infoForm.person"></el-input> 人，儿童<el-input v-model="infoForm.children"></el-input>人
        <p class="margin_0px">1件产品对应的人数，例如情侣套餐预订1件对应的是2人。</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('infoForm')">保存，下一步</el-button>
        <!--<el-button @click="resetForm('infoForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
    <el-dialog title="选择产品" :visible.sync="productionVisible" width="800px">
      <span>景点所在地:</span>
      <el-select v-model="provinceId" placeholder="请选择省份" @change="provinceChange" size='small'>
        <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="cityId"  placeholder="请选择地区" size='small'>
        <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-input  v-model="attractionName" placeholder="景点名称" size='small'></el-input>
      <el-button type="primary" size='small' @click='queryData'>查询</el-button>
      <el-table size="mini" :ref='queryTable' border :data="queryTable" class='queryTable' @selection-change="querySelectionChange">
        <el-table-column size="small"  align="center" type="selection" width="55"></el-table-column>
        <el-table-column size="small" prop="productioName" label="产品名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column size="small" prop="supplier" label="供应商" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column size="small" prop="address" label="地址" align="center"  show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          fixed="right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
      <el-button type="primary" size='small' @click='confirmSelect' class='confirmSelect'>确认选择</el-button>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-textarea {
    width: 55%;
  }
  .el-input {
    width: 200px;
  }
  .inp_width.el-input{
    width: 510px;
  }
  .el-col.el-col-5{
    width: 310px;
  }
  .queryTable{
    width:100%;
    margin:15px 0;
  }
  .confirmSelect{
    margin-left:350px;
  }
</style>

<script>
  import addressSelect from "@/components/address-select/index";
  export default {
    components: { addressSelect },
    data() {
      return {
        productionVisible:false,
        provinceList:[],
        provinceId:'',
        cityList:[],
        cityId:'',
        attractionName:'',
        productionTable:[{productioName:'杭州西湖',count:1},{productioName:'广州长隆飞鸟乐园',count:1}],
        queryTable:[],
        AirlineType: "Domestic",
        infoForm: {
          name: '',
          shortName:'',
          nbCoding:'',
          wbCoding:'',
          address:'',
          supplier: '',
          variety: '',
          tags: ['标签一', '标签二', '标签三'],
          personExplain: '',
          dateExplain: '',
          person:'',
          children:0
        },
        options: [{
          value: '选项1',
          label: '黄金糕'
        }],
        inputVisible: false,
        inputValue: '',
        rules: {
          name: [
            {required: true, message: '请输入产品名称', trigger: 'blur'},
          ],
          shortName: [
            {required: true, message: '请输入产品简称', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请选择产品所在地', trigger: 'change'}
          ],
          supplier: [
            {required: true, message: '请选择供应商', trigger: 'change'}
          ],
          variety: [
            {required: true, message: '请选择票种', trigger: 'change'}
          ],
          dynamicTags: [
            { type: 'array', required: true, message: '请选择票种', trigger: 'change'}
          ],
          personExplain: [
            {required: true, message: '请填写适用人群说明', trigger: 'blur'}
          ],
          dateExplain: [
            {required: true, message: '请填写营业时间说明', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '请填写人数', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      addressResult(val) {

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.$router.push({path:'/Tickets/ticketsMarket'})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //标签添加
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      //全选
      querySelectionChange(val){
        this.multipleSelection = val;
      },
      queryData(){

      },
      provinceChange(val){
        this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
          .then((res)=>{
            if(res.status == 200){
              this.cityList = res.data;
              this.cityId = ''
            }
          }).catch((e) => {
          console.log(e);
        })
      },
      //添加产品
      confirmSelect(){
        if(this.multipleSelection.length == 0){
          this.$message({
            type:'info',
            message:'您还未选择产品'
          });
          return;
        }else{
          this.productionTable = this.productionTable.concat(this.multipleSelection);
          this.$message({
            type:'success',
            message:'添加产品成功'
          });
          setTimeout( () => {
            this.productionVisible = false;
          },500)
        }
      },
      showTable() {
        this.productionVisible = true;
//
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>
