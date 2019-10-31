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
      <el-form-item label="选择关联产品">
        <el-button  size="small" @click="initDialog" type='primary' class='select-btn'>选 择</el-button>
        <el-table size="mini" :ref='productionTable' border :data="productionTable" class='productionTable'>
            <el-table-column size="small" prop="productioName" label="名称" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" label="包含数量" align="center" show-overflow-tooltip>
                <template slot-scope='scope'>
                    <span>包含<el-input v-model="scope.row.count" class="count-input" size='mini'></el-input>件</span>
                </template>
            </el-table-column>
            <el-table-column size="small" label="操作" align="center" show-overflow-tooltip>
                <template slot-scope='scope'>
                    <el-button  type='text' size="small" @click="deleteProduction(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="infoForm.name" class="inp_width"></el-input>
      </el-form-item>
      <el-form-item label="产品简称" prop="name">
        <el-input v-model="infoForm.name" class="inp_width"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="内部编码">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="外部编码">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="产品所在地">
        <address-select width="200px" :data-type="AirlineType" @result="addressResult"
                        class="address_width" ref= 'addressSelect'></address-select>
      </el-form-item>
      <el-form-item label="供应商" prop="region">
        <el-select v-model="infoForm.region" placeholder="请选择活动区域">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="票种" prop="region">
        <el-select v-model="infoForm.region" placeholder="请选择活动区域">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应景点">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="适用人群" prop="desc">
        <el-input type="textarea" v-model="infoForm.desc" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="营业时间说明" prop="desc">
        <el-input type="textarea" v-model="infoForm.desc" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="产品包含人数">
        成人：<el-input></el-input> 人，儿童<el-input></el-input>人
        <p class="margin_0px">1件产品对应的人数，例如情侣套餐预订1件对应的是2人。</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('infoForm')">保存，下一步</el-button>
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
                :data = 'pagination'
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.sizes"
                :page-size="pagination.size"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total">
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
  .select-btn{
      width:80px;
      margin: 0 10px 15px 0px;
  }
  .productionTable{
      width:700px;
  }
  .queryTable{
      width:100%;
      margin:15px 0;
  }
  .count-input{
      width:80px!important;
      margin:0 10px;
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
          region: '',
          desc: ''
        },
        options: [{
          value: '选项1',
          label: '黄金糕'
        }],
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        },
        pagination:{
            sizes:[5,10,20,50],
            size:5,
            currentPage: 1,
            total:0
        },
        multipleSelection:[]
      };
    },
    methods: {
        //初始化选择产品dialog
        initDialog(){
            this.productionVisible = true;
            this.multipleSelection = [];
            this.provinceId = '';
            this.cityId = '';
            this.attractionName = '';
            this.queryData();
        },
        //省改变时
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
        querySelectionChange(val){
            this.multipleSelection = val;
        },
        //查询产品
        queryData(){
            //写死的！！！！！！！！！！！！！！！！！！！！！！记得调接口
            //写死的！！！！！！！！！！！！！！！！！！！！！！记得调接口
            //写死的！！！！！！！！！！！！！！！！！！！！！！记得调接口
            this.queryTable = [
                {productioName:'张家界天门山森林公园1',supplier:'张家界花谷有限公司1',address:'张家界张家界永定区万和天琴1'},
                {productioName:'张家界天门山森林公园2',supplier:'张家界花谷有限公司2',address:'张家界张家界永定区万和天琴2'},
                {productioName:'张家界天门山森林公园3',supplier:'张家界花谷有限公司3',address:'张家界张家界永定区万和天琴3'},
                {productioName:'张家界天门山森林公园4',supplier:'张家界花谷有限公司4',address:'张家界张家界永定区万和天琴4'},
                {productioName:'张家界天门山森林公园5',supplier:'张家界花谷有限公司5',address:'张家界张家界永定区万和天琴5'}
            ];
        },
        //删除产品
        deleteProduction(row){
            this.productionTable.splice(this.productionTable.indexOf(row),1)
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

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //分页
      sizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      }
    },
    mounted(){
        this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1')
		    .then((res)=>{
                if(res.status == 200){
                    this.provinceList = res.data;
                }
			}).catch((e) => {
                console.log(e);
            })
        }
   }
</script>
