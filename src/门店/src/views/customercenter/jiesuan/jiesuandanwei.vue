<template>
  <div class="view">
        <el-form :inline="true" :model="table" size="small" label-width="80px">
          <el-form-item label="结算单位">
            <el-input v-model="table.name" placeholder="结算单位" ></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="DisTypeID">
            <el-select v-model="table.DisTypeID" placeholder="请选客户类型"  clearable>
                  <el-option v-for="item in DisTypeIDs" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="table.contanct" placeholder="联系人" class="el-input"></el-input>
          </el-form-item>
          <el-form-item label="结算方式">
            <el-select v-model="table.DictdataValue" placeholder="结算方式"  clearable>
              <el-option v-for="item in Dictionary" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button  type="warning" @click="getSettlementList" icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="setUp()">新建</el-button>
              <!-- <el-button size="small" type="primary">导出Excel</el-button> -->
        </el-row>
        <el-table size="small" v-loading="table.loading" :data="table.SettlementList" tooltip-effect="dark"  style="width: 100%">
          <el-table-column size="small" align="center" label="序号" type="index"></el-table-column>
          <el-table-column size="small" align="center" prop="name" label="结算单位" width="200px"></el-table-column>
          <el-table-column size="small" align="center" prop="contanct" label="联系人"></el-table-column>
          <el-table-column size="small" align="center" prop="mobilePhone" label="联系方式"></el-table-column>
          <el-table-column size="small" align="center" prop="dictdataName" label="结算方式"></el-table-column>
          <el-table-column size="small" align="center" prop="disTypeName" label="类型" ></el-table-column>
          <el-table-column size="small" align="center" prop="address" label="通信地址"></el-table-column>
          <el-table-column size="small" align="center" prop="sourceName" label="客户来源"></el-table-column>
          <el-table-column size="small" prop="operation" label="操作" align="center" fixed="right" width="300px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="convertOrder(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteOrder(scope.row)">删除</el-button>
                <!-- <el-button type="text" size="mini" @click="credited(scope.row)">信用额度</el-button> -->
                <el-button type="text" size="mini" @click="details(scope.row)">查看</el-button>
                <el-button type="text" size="mini" @click="invoicessss(scope.row)">发票信息</el-button>
                <el-button type="text" size="mini" @click="mailAddress(scope.row)">邮寄地址</el-button>
                <el-button type="text" size="mini" @click="bankId(scope.row)">银行账号</el-button>
                <el-button type="text" size="mini" @click="contract(scope.row)">合同附件</el-button>
                  <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
              </template>
            </el-table-column>
        </el-table>
          <el-row class="pagination" :gutter="20" >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageIndex"
            :page-sizes="[5,10,20,50]"
            :page-size="table.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
        </el-row> 
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible:false,
        dialogImageUrl:"",
        table:{
          loading:false,
          pageSize: 10,
          pageIndex: 1,
          total:0,
          name:'',
          DisTypeID: '',
          DictdataValue: '',
          contanct: '',
          SettlementList:[{}]
        },
        DisTypeIDs: [],
        Dictionary:[]
      }
    },
    mounted () {
    this.getSettlementList();
    this.DictionaryList(); //结算方式下拉
    this.disTypeIDs() //客户类型下拉框
    },
    methods: {
      //获取结算列表
      getSettlementList(){
        this.table.loading=true
            this.shopHttp.get("SettleClient/GetSettleClientList?"+
                "pageSize="+this.table.pageSize+
                "&pageIndex="+this.table.pageIndex+
                "&total="+this.table.total+
                "&name="+this.table.name+
                "&contanct="+this.table.contanct+
                "&DisTypeID="+this.table.DisTypeID+
                "&DictdataValue="+this.table.DictdataValue
            ).then(res =>{
              // console.log(res);
                if(res.data.isSuccess == true){
                  this.table.loading=false;
                  this.table.SettlementList =  res.data.objects;
                  this.table.total = res.data.total;
                  this.table.SettlementList.address = res.data.objects.provinceName+res.data.objects.address;
                  console.log(this.table.SettlementList.address)
                }else{
                    this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                    });
                }
            }).catch(e => {
                this.table.loading=false
            }) 
      }, 
      //获取结算方式下拉框
      DictionaryList(){
          this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
            this.Dictionary = res.data.objects;
        }).catch(e => {
              this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                  });
            })       
      },
      //客户类型
      disTypeIDs(){
                  this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                       this.DisTypeIDs = res.data.objects ;
                           }).catch(e => {
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
                 },
      //新建
      setUp(){
        this.$router.push("/customercenter/jiesuandanwei-add")
      },
      convertOrder(row){
        this.$router.push({path:`/customercenter/settleClient-edit/${row.id}`});
      },
      credited(row){
        this.$router.push({path:`/customercenter/jiesuan/setCreditLine`,name:'setCreditLine',params:{DisSettleClientId:row.id}})
      },
      details(row){
        this.$router.push({path:`/customercenter/jiesuan-details/${row.id}`})
      },
      invoicessss(row){
        this.$router.push({path:`/customercenter/jiesuan/invoice/:id`,name:'invoice',params:{id:row.id}})
      },
      mailAddress(row){
        
        this.$router.push({path:`/customercenter/jiesuan/mailingaddress/:DisSettleClientId`,name:'mailingaddress',params:{DisSettleClientId:row.id}})
      },
      bankId(row){
        this.$router.push({path:`/customercenter/jiesuan/setBankList/:DisSettleClientId`,name:'setBankList',params:{DisSettleClientId:row.id}})
      },
      deleteOrder(row){
          //console.log(row)
          this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.shopHttp.post("SettleClient/DeleteSettleClient ",{DisSettleClientId:row.id}).then(res =>{
              this.getSettlementList()
              this.$message({
                type:'success',
                message:'成功，删除结算单位成功'
              })  
            }).catch(e => {
                //console.log(e)
            }) 
        }).catch(() => {
           this.$message({
                    type:'info',
                    message:'已取消'
                })
        });
      },
      handleSizeChange(val) {
          this.table.pageSize = val
          this.getSettlementList()
         //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.table.pageIndex = val;
        this.getSettlementList()
         //console.log(`当前页: ${val}`);
      },
      contract(row){
        this.dialogImageUrl = row.contractAttachmemt;
        this.dialogVisible = true;
      }
    },
  }
</script>
<style scoped lang="scss">
</style>