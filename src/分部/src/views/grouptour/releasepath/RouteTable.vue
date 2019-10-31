<template>
  <div class="view">
    <el-form :inline="true" :model="formInPath" class="demo-form-inline">
      <el-form-item label="线路名称">
        <el-input v-model="formInPath.pathName" placeholder="" size='small'></el-input>
      </el-form-item>
      <el-form-item label="线路编号">
        <el-input v-model="formInPath.pathNum" placeholder="" size='small'></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="formInPath.supplierName" placeholder="" size='small'></el-input>
      </el-form-item>
      <el-form-item label="线路类型">
        <el-select v-model="formInPath.pathType" placeholder="请选择" size='small'>
          <el-option
            v-for="item in routeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInPath.status" placeholder="请选择" size='small' clearable>
          <el-option
            v-for="item in statusList" 
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData(pagination.size,1)" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="routerPush">创建详细路线</el-button>
    <el-button type="primary" @click="groupBegin" :disabled="btn_group">开团</el-button>
    <el-button type="primary" @click="setAddress" :disabled="btn_address">设置多出发地</el-button>
    <el-button type="primary" @click="DownSales" :disabled="btn_down">下架</el-button>
    <el-button type="primary" @click="onSales" :disabled="btn_up">上架</el-button>
    <el-button type="primary" @click="pathEdit" :disabled="btn_edit">编辑</el-button>
    <el-button type="primary" @click="copyLineProduct" :disabled="btn_copy">复制</el-button>
    <el-button type="primary" @click="pathDelete" :disabled="btn_delete">删除</el-button>
    <el-table
      class="margin_15"
      v-loading="loading"
      ref="multipleTable"
      :data="pathData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="pathSelectionChange">
      <el-table-column type="selection"
        align="center"
        width="55" fixed>
      </el-table-column>
      <el-table-column
        prop="lineCode"
        label="线路编号"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="fullName"
        label="线路名称"
        align="center"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="enumGroupLineTypeDesc"
        label="线路类型"
        align="center"
       >
      </el-table-column>
      <el-table-column
        prop="enumGroupLineModeDesc"
        label="组团方式"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="tripDays"
        label="行程总天数"
        align="center"
        >
      </el-table-column>
      <el-table-column
        label="推广费"
        align="center" >
        <template slot-scope="scope">
            <span v-if="scope.row.commisionType===1">{{scope.row.commisionValue?(scope.row.commisionValue+'%'):0}}</span>
            <span v-else-if="scope.row.commisionType===2">{{scope.row.commisionValue?scope.row.commisionValue:0}}</span>
            <span v-else-if="scope.row.commisionType===0">
              <div>成人：{{scope.row.commisionValue?scope.row.commisionValue:0}}</div>
              <div>老人：{{scope.row.commisionElderValue?scope.row.commisionElderValue:0}}</div>
              <div>儿童：{{scope.row.commisionChildValue?scope.row.commisionChildValue:0}}</div>
            </span>
                </template>
            </el-table-column>
            <el-table-column
              label="激励"
              align="center" >
              <template slot-scope="scope">
                  <span v-if="scope.row.encourageType===1">{{scope.row.encourageValue?(scope.row.encourageValue+'%'):0}}</span>
            <span v-else-if="scope.row.encourageType===2">{{scope.row.encourageValue?scope.row.encourageValue:0}}</span>
            <div v-else-if="scope.row.encourageType===0">
              <div>成人：{{scope.row.encourageValue?scope.row.encourageValue:0}}</div>
              <div>老人：{{scope.row.encourageElderValue?scope.row.encourageElderValue:0}}</div>
              <div>儿童：{{scope.row.encourageChildValue?scope.row.encourageChildValue:0}}</div>
            </div>
          </template>
       </el-table-column>
       <el-table-column
        prop="statusDesc"
        label="状态"
        align="center"
       >
      </el-table-column>
      <el-table-column label="操作" min-width="100px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goDetail(scope.row)">查看</el-button>
          <el-button size="mini" type="text"  @click="handleSetEncourage(scope.row)" v-if = 'scope.row.statusDesc == "已审核"||scope.row.statusDesc == "已开团" '>修改路线政策</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data = 'pagination'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog title="修改路线政策" :visible.sync="dialogEncourageVisible" width="410px" @close="handleCloseEncourageDialog">
      <el-form :model="form" ref="form"  size="small">
        <el-form-item label="激励金额" label-width="80px" >
          <el-radio-group v-model="form.EncourageType" @change="handleChangeEncourageType">
            <el-radio :label="2">固定金额 <el-input-number :controls="false" :min="0" :max="999999999" v-model="form2.EncourageValue2"  :disabled="form.EncourageType!=2"></el-input-number> 元/单</el-radio>
            <el-radio :label="1">百分比 <el-input-number :controls="false" :min="0" :max="100" v-model="form2.EncourageValue1" :disabled="form.EncourageType!=1"></el-input-number> %/单</el-radio>
            <el-radio :label="0">成人 <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageAdultValue" :min="0" :max="999999999"></el-input-number> 元/人
                <div style="margin:10px 0 0 24px">老人 <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageElderValue" :min="0" :max="999999999"></el-input-number> 元/人</div>
                <div style="margin:10px 0 0 24px">儿童 <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageChildValue" :min="0" :max="999999999"></el-input-number> 元/人</div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
		<el-form-item label="推广费" label-width="80px" class="margin_bottom_0">
          <el-radio-group v-model="form.CommisionType" @change="handleChangeCommisionType">
            <el-radio :label="2">固定金额 <el-input-number :controls="false" :min="0" :max="999999999" v-model="form2.CommisionValue2"  :disabled="form.CommisionType!=2"></el-input-number> 元/单</el-radio>
            <el-radio :label="1">百分比 <el-input-number :controls="false" :min="0" :max="100" v-model="form2.CommisionValue1" :disabled="form.CommisionType!=1"></el-input-number> %/单</el-radio>
            <el-radio :label="0" class="margin_bottom_0">成人 <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionAdultValue" :min="0" :max="999999999"></el-input-number> 元/人
                <div style="margin:10px 0 0 24px">老人 <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionElderValue" :min="0" :max="999999999"></el-input-number> 元/人</div>
                <div style="margin:10px 0 0 24px">儿童 <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionChildValue" :min="0" :max="999999999"></el-input-number> 元/人</div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEncourageVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmitEncourage('form')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="设置激励" :visible.sync="dialogEncourageVisible" width="410px" @close="handleCloseEncourageDialog">
      <el-form :model="encourageForm" ref="encourageForm" :rules="encourageRules" size="small">
        <el-form-item label="激励金额" label-width="80px" prop="EncourageValue">
          <el-radio-group v-model="encourageForm.EncourageType" @change="handleChangeCommisionType">
            <el-radio :label="2">固定金额 <el-input-number :controls="false" :min="0" :max="999999999" v-model="EncourageValue"  :disabled="encourageForm.EncourageType!=2"></el-input-number> 元/单</el-radio>
            <el-radio :label="1">百分比 <el-input-number :controls="false" :min="0" :max="100" v-model="EncouragePercentValue" :disabled="encourageForm.EncourageType!=1"></el-input-number> %/单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEncourageVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmitEncourage('encourageForm')" size="small">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<style lang="scss" scoped>
  @import "../../../style/common.scss";
  .el-button{
    padding:7px 5px;
  }
  .el-form .el-form-item{
    margin-right:25px;
  }
  .margin_15{
    margin-top: 15px;
  }
  
  .el-radio{
    margin-left:20px;
    margin-bottom:10px;
  }
</style>
<script>
  export default {
    data() {
      return {
        lineIds:[],
        dialogEncourageVisible:false,
        btn_address: true,
        btn_group: true,
        btn_down: true,
        btn_up: true,
        btn_edit: true,
        btn_copy: true,
        btn_delete: true,
        pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
          },
        formInPath: {
          pathName: '',
          pathNum: '',
          pathType:'',
          supplierName:'',
          status:''
        },
        loading:false,
        pathData: [

        ],
        multipleSelection: [],
        routeTypeOptions:[
          {
            label:'不限',
            value:''
          }
       ],
        statusList:[],
        form:{
          LineId:'',
          SupplierId:'',
          CommisionType:'',
          CommisionValue:'',
          CommisionElderValue:'',
          CommisionChildValue:'',
          EncourageType:'',
          EncourageValue:'',
          EncourageElderValue:'',
          EncourageChildValue:''
        },
        form2:{
          CommisionValue1:'',
          CommisionValue2:'',
          CommisionAdultValue:'',
          CommisionElderValue:'',
          CommisionChildValue:'',
          EncourageValue1:'',
          EncourageValue2:'',
          EncourageAdultValue:'',
          EncourageElderValue:'',
          EncourageChildValue:'',
        }
      }
    },
    mounted(){
      // var a='sdf5896_06sdfs';
      // console.log(a.search(/_\d\d/g))

      //获取线路类型  赋值给routeTypeOptions
      this.groupHttp.post("GroupLine/GetGroupLineParamList", {
        paramType: 4,
        PageSize:100,
        PageIndex:1
      }).then(res => {
        if(res.data.isSuccess == true){
              res.data.objects.forEach(val =>{
                var obj = {};
                obj.label = val.paramName;
                obj.value = val.id;
                this.routeTypeOptions.push(obj);
              })
            }else {
              this.$message({
                type: "info",
                message: "加载失败: " + res.data.message
              });
            }
      }).catch(e => {
        console.log(e);
      })

      //获取线路状态
      this.groupHttp.post("GroupLine/GetEnumGroupLineStatus", {})
      .then(res => {
        if(res.data.isSuccess){
               this.statusList=res.data.objects;
            }else {
              this.$message({
                type: "info",
                message: "加载失败: " + res.data.message
              });
            }
      }).catch(e => {
        console.log(e);
      })
      //初始化数据
      this.queryData();
    },
    methods: {
      queryData(size,index) {
          this.loading = true;
          this.groupHttp.post("GroupLine/LineList", {
            LineCode:this.formInPath.pathNum,
            lineName:this.formInPath.pathName,
            enumGroupLineType:this.formInPath.pathType,
            pageSize:size || 10,
            pageIndex:index || 1,
            supplierName:this.formInPath.supplierName,
            status:this.formInPath.status,
          }).then(res => {
            if(res.data.isSuccess == true){
              this.pathData = res.data.objects;
              this.pagination.currentPage = index || 1;
              this.pagination.total = res.data.total;
              this.loading = false;
            }else {
              this.$message({
                type: "info",
                message: "出错了！ " + res.data.message
              });
            }
          }).catch(e => {
            console.log(e);
          });
      },
      
      handleChangeCommisionType(val){
        if(val==1){
          this.EncourageValue=''
        }else if(val==2){
          this.EncouragePercentValue=''
        }
      },
      routerPush(){
       this.$router.push({path:'/grouptour/RouteMessage'})
      },
      //上架
      onSales(){
        this.groupHttp.get("GroupLine/GroupLineOnSales",{
                params:{lineIds:this.lineIds}
            }).then(res => {
            if(res.data.isSuccess == true){
              this.$message({
                type: "success",
                message: "上架成功"
              });
              this.queryData(this.pagination.size,1);
            }else {
              this.$message({
                type: "info",
                message: "操作失败: " + res.data.message
              });
            }
          }).catch(e => {
            console.log(e);
          });
      },
      //下架
      DownSales(index,data){
        this.groupHttp.get("GroupLine/GroupLineDownSales" ,{
                params:{lineIds:this.lineIds}
            }).then(res => {
            if(res.data.isSuccess == true){
              this.$message({
                type: "success",
                message: "下架成功"
              });
              this.queryData(this.pagination.size,1);
            }else {
              this.$message({
                type: "info",
                message: "操作失败: " + res.data.message
              });
            }
          }).catch(e => {
            console.log(e);
          });
      },
      //复制
      copyLineProduct(index,data){
        this.$prompt('请输入路线名称', '路线', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[^ ]+$/,
          inputErrorMessage: '线路类型名称不能为空 且不能含有空格'
        }).then(({ value }) => {
          this.groupHttp.post('/GroupLine/CopyLineProduct',{LineId:this.multipleSelection[0].lineId,LineName:value}).then(res=>{
            if(res.data.isSuccess == true){
              this.$message({
              type: 'success',
              message: '你的路线是: ' + value
               });
              this.queryData(this.pagination.size,1);
            }
          }).catch(e=>{

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        })
      },
      //设置激励
      // handleSetEncourage(row){
      //   this.encourageForm.LineId=row.lineId;
      //   this.encourageForm.SupplierId=row.supplierId;
      //   // this.encourageForm.BranchId=row.enumGroupLineType;
      //   this.encourageForm.EncourageType=row.encourageType||'';
      //   if(row.encourageType==2){
      //     this.EncourageValue=row.encourageValue;
      //   }else if(row.encourageType==1){
      //     this.EncouragePercentValue=row.encourageValue;
      //   }
      //   this.dialogEncourageVisible=true;
      // },
      // handleCloseEncourageDialog(){

      // },
      //改变推广费类型
      handleChangeCommisionType(){
          if(this.form.CommisionType===0){
              this.form2.CommisionValue1=''
              this.form2.CommisionValue2=''
          }else if(this.form.CommisionType===1){
              this.form2.CommisionValue2=''
              this.form2.CommisionAdultValue=''
              this.form2.CommisionElderValue=''
              this.form2.CommisionChildValue=''
          }else if(this.form.CommisionType===2){
              this.form2.CommisionValue1=''
              this.form2.CommisionAdultValue=''
              this.form2.CommisionElderValue=''
              this.form2.CommisionChildValue=''
          }
      },
      //改变激励金类型
      handleChangeEncourageType(){
          if(this.form.EncourageType===0){
              this.form2.EncourageValue1=''
              this.form2.EncourageValue2=''
          }else if(this.form.EncourageType===1){
              this.form2.EncourageValue2=''
              this.form2.EncourageAdultValue=''
              this.form2.EncourageElderValue=''
              this.form2.EncourageChildValue=''
          }else if(this.form.EncourageType===2){
              this.form2.EncourageValue1=''
              this.form2.EncourageAdultValue=''
              this.form2.EncourageElderValue=''
              this.form2.EncourageChildValue=''
          }
      },
      //设置激励
      handleSetEncourage(row){
        this.form.LineId=row.lineId;
        this.form.SupplierId=row.supplierId;
        this.form.EncourageType=row.encourageType;
        this.form.CommisionType=row.commisionType;
        if(row.encourageType===2){
         	this.form2.EncourageValue2=row.encourageValue;
        }else if(row.encourageType===1){
         	this.form2.EncourageValue1=row.encourageValue;
        }else if(row.encourageType===0){
          this.form2.EncourageAdultValue=row.encourageValue;
                this.form2.EncourageElderValue=row.encourageElderValue;
                this.form2.EncourageChildValue=row.encourageChildValue;
        }
        if(row.commisionType===2){
              this.form2.CommisionValue2=row.commisionValue;
            }else if(row.commisionType===1){
              this.form2.CommisionValue1=row.commisionValue;
            }else if(row.commisionType===0){
          this.form2.CommisionAdultValue=row.commisionValue;
                this.form2.CommisionElderValue=row.commisionElderValue;
                this.form2.CommisionChildValue=row.commisionChildValue;
        }

        this.dialogEncourageVisible=true;
      },
      handleCloseEncourageDialog(){
        this.form2={
          CommisionValue1:'',
          CommisionValue2:'',
          CommisionAdultValue:'',
          CommisionElderValue:'',
          CommisionChildValue:'',
          EncourageValue1:'',
          EncourageValue2:'',
          EncourageAdultValue:'',
          EncourageElderValue:'',
          EncourageChildValue:'',
        }
      },
      onSubmitEncourage(form){
         if(this.form.CommisionType===0){
              this.form.CommisionValue=this.form2.CommisionAdultValue;
              this.form.CommisionElderValue=this.form2.CommisionElderValue;
              this.form.CommisionChildValue=this.form2.CommisionChildValue;
            }else if(this.form.CommisionType==1){
              this.form.CommisionValue=this.form2.CommisionValue1;
            }else if(this.form.CommisionType==2){
              this.form.CommisionValue=this.form2.CommisionValue2;
            }
            if(this.form.EncourageType===0){
              this.form.EncourageValue=this.form2.EncourageAdultValue;
              this.form.EncourageElderValue=this.form2.EncourageElderValue;
              this.form.EncourageChildValue=this.form2.EncourageChildValue;
            }else if(this.form.EncourageType==1){
              this.form.EncourageValue=this.form2.EncourageValue1;
            }else if(this.form.EncourageType==2){
              this.form.EncourageValue=this.form2.EncourageValue2;
            }
          this.$refs[form].validate(valid => {
           if(valid){
              this.groupHttp.post('/GroupLine/EditGrouplineCommision',this.form)
              .then(res=>{
                if(res.data.isSuccess == true){
                  this.$message({
                    type: 'success',
                    message: '设置激励成功'
                  });
                  this.dialogEncourageVisible = false;
                  this.queryData(this.pagination.size,1);
                }else{
                  this.$message({
                    type: 'info',
                    message: '出错了!' + res.data.message
                  });
                }
              }).catch(e=>{

              })
           }
         })
      },
      //编辑
      pathEdit() {
          this.$router.push({path:'/grouptour/Editmessage',query:{lineId:this.multipleSelection[0].lineId}})
      },
      //查看
      goDetail(row){
        this.$router.push({path:'/grouptour/linedetails',query:{lineId:row.lineId}})
      },
      //删除
      pathDelete() {
        this.$confirm('此操作将永久删除改线路, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupHttp.get("GroupLine/DeleteGroupLine?lineId=" + this.multipleSelection[0].lineId,{

          }).then(res => {
            if(res.data.isSuccess == true){
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.queryData(this.pagination.size,1);
            }else {
              this.$message({
                type: "info",
                message: "操作失败: " + res.data.message
              });
            }
          }).catch(e => {
            console.log(e);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //全选
      pathSelectionChange(val) {
        this.lineIds=[];
        this.multipleSelection = val;
        if(this.multipleSelection.length ==0){
            this.btn_address = true;
            this.btn_group = true;
            this.btn_down = true;
            this.btn_up = true;
            this.btn_edit = true;
            this.btn_copy = true;
            this.btn_delete = true;
        }else if(this.multipleSelection.length ==1){
            this.btn_address = !(this.multipleSelection[0].showSetProduct);
            this.btn_group = !(this.multipleSelection[0].showTeamSet);
            this.btn_down = !(this.multipleSelection[0].showDownSales);
            this.btn_up = !(this.multipleSelection[0].showUpSales);
            this.btn_edit = !(this.multipleSelection[0].showModify);
            this.btn_copy = !(this.multipleSelection[0].showCopy);
            this.btn_delete = !(this.multipleSelection[0].showDelete);
            this.lineIds.push(val[0].lineId)
        }else{
            this.btn_down = false;
            this.btn_up = false;
            val.forEach(item=>{
                if(!item.showDownSales){
                    this.btn_down = true;
                }
                if(!item.showUpSales){
                    this.btn_up = true;
                }
                this.lineIds.push(item.lineId)
            })
        }
      },
      handleSizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      //开团
      groupBegin(){
        this.$router.push({path:'/grouptour/GroupMessage',query:{lineId:this.multipleSelection[0].lineId,fullName:this.multipleSelection[0].fullName}})
      },
      //设置多出发地
      setAddress(){
        this.$router.push({path:'/grouptour/PlaceOfDeparture',query:{lineId:this.multipleSelection[0].lineId}})
      }
    }
  }
</script>
