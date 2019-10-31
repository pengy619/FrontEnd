<template>
  <div class="view">
        <el-form size="small" :inline="true" :model="table"  label-width="80px">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="table.customerName" placeholder="客户名称" ></el-input>
          </el-form-item>
          <el-form-item label="客户类型">
            <el-select v-model="table.disTypeName" placeholder="类型" clearable>
              <el-option v-for="item in DisTypeID" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="table.contanct" placeholder="联系人" ></el-input>
          </el-form-item>
            <el-form-item label="结算方式" prop="dictdataName">
                <el-select v-model="table.dictdataName" placeholder="请选结算方式" clearable>
                  <el-option v-for="item in DictdataName" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="warning" @click="getstraightList()" icon="el-icon-search">查找</el-button>
          </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
              <el-button size="small" type="primary" @click="add()">新建</el-button>
              <!-- <el-button size="small" type="primary">导出</el-button> -->
        </el-row>
          <el-table :data="table.straightList" style="width: 100%" v-loading="table.loading">
            <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="customerName" label="客户名称"></el-table-column>
            <el-table-column align="center" prop="settleClientName" label="结算单位"></el-table-column>
            <el-table-column align="center" prop="dictdataName" label="结算方式"></el-table-column>
            <el-table-column align="center" prop="disTypeName" label="客户类型" ></el-table-column>
            <el-table-column align="center" prop="contanct" label="联系人"></el-table-column>
            <el-table-column align="center" prop="mobilePhone" label="联系方式"></el-table-column>
            <el-table-column align="center" prop="fax" label="传真"></el-table-column>
            <el-table-column align="center" prop="address" label="通信地址"></el-table-column>
            <el-table-column prop="operation" label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="convertOrder(scope.row)">编辑</el-button>
                  <el-button type="text" size="mini" @click="deleteOrder(scope,row)">删除</el-button>           
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
        dialogVisible: false,
        table:{
          loading: false,
          customerName: '',
          disTypeName: '',
          contanct: '',
          dictdataName: '',
          pageSize: 10,
          pageIndex: 1,
          total:0,
          straightList:[{}],
        },
        DictdataName:[],
        DisTypeID:[],
      }
    },
    mounted () {
      this.getstraightList();
      this.getDisTypeID();
      this.getDictdataName();  //获取结算方式
    },
    methods: {
      getstraightList(pageIndex=1){
        this.table.loading=true
        this.shopHttp.get("SettleClient/GetCustomerList?pageSize="+this.table.pageSize 
          +"&pageIndex="+pageIndex
          +"&total="+this.table.total
          +"&customerName="+this.table.customerName
          +"&DisTypeID="+this.table.disTypeName
          +"&contanct="+this.table.contanct
          +"&DictDataValue="+this.table.dictdataName
          ).then(res =>{
          if(res.data.isSuccess == true){
            this.table.loading=false
              this.table.straightList = res.data.objects,
              this.table.total = res.data.total
              //this.table.pageIndex = res.data.pageIndex
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
      //获取客户类型
      getDisTypeID(){
        this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                console.log(res);
              this.DisTypeID = res.data.objects ;
                  }).catch(e => {
                    console.log(e);
                      this.$message({
                                type: 'info',
                                message: "加载失败 ：" + res.data.message
                          });
                    })
      },
      getDictdataName(){
        this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
        this.DictdataName = res.data.objects ;
              }).catch(e => {
                    this.$message({
                          type: 'info',
                          message: "加载失败 ：" + res.data.message
                    });
              })
           },
      //新增
      add(){
        this.$router.push('/customercenter/straight-add')
      },
      //修改
      convertOrder(row){
        console.log(row)
        this.$router.push({path:`/customercenter/straight-edit/${row.disCompanyInfoId}`})
      },
      deleteOrder(row){
          // console.log(row)
          this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.shopHttp.post("SettleClient/DeleteCustomerInformation",{DisCompanyInfoId:row.row.disCompanyInfoId}).then(res =>{
              //console.log(res)
                if(res.data.isSuccess == true){
                    this.getstraightList(this.table.pageIndex);
                    this.$message({
                      type:'success',
                      message:'成功，删除客户信息成功',
                    })
                }else{
                    this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                    });
                }
            }).catch(e => {
                //console.log(e)
            }) 
        }).catch(() => {
                 this.$message({
                   type:'info',
                   message:'取消成功！'
                 })
        });
      },
      handleSizeChange(val) {
         this.table.pageSize = val;
          this.getstraightList(this.table.pageIndex);
      },
      handleCurrentChange(val) {
        this.table.pageIndex = val;
        this.getstraightList(this.table.pageIndex);
      },
    },
  }
</script>
<style scoped lang="scss">
</style>
