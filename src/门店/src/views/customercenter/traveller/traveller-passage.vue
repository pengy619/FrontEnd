<template>
  <div class="view">
       <el-form size="small" :inline="true" :model="table" label-width="80px">
          <el-form-item label="旅客姓名">
            <el-input v-model="table.name" ></el-input>
          </el-form-item>
          <el-form-item label="英文名">
            <el-input v-model="table.englishName" ></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="table.credentialNo" ></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="table.mobile" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="warning" @click="getList()" icon="el-icon-search">查找</el-button>
          </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
              <el-button size="small" type="primary" @click="add()">新建</el-button>
              <!-- <el-button size="small" type="primary">导出</el-button> -->
        </el-row>
          <el-table v-loading="table.loading" :data="table.travellerList" style="width: 100%">
            <el-table-column align="center" prop="number" label="序号" type="index" width="50px"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名"></el-table-column>
            <el-table-column align="center" prop="englishName" label="英文名"></el-table-column>
            <el-table-column align="center" prop="sexDesc" label="性别" width="50px"></el-table-column>
            <el-table-column align="center" prop="maritalStatusDesc" label="婚姻状况" ></el-table-column>
            <el-table-column align="center" prop="ageGroupDesc" label="人群"></el-table-column>
            <el-table-column align="center" prop="birthdate" label="出生日期" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="credentialTypeDesc" label="证件类型"></el-table-column> -->
            <el-table-column align="center" prop="credentialNo" label="身份证号"></el-table-column>
            <el-table-column align="center" prop="expireDate" label="证件有效期"></el-table-column>
            <el-table-column align="center" prop="birthPlace" label="出生地"></el-table-column>
            <el-table-column align="center" prop="mobile" label="电话号码"></el-table-column>
            <!-- <el-table-column align="center" prop="birthPlace" label="通信地址" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="operation" label="操作" align="center" width='150px' fixed="right">
                <template slot-scope="scope" >
                            <el-button type="text" size="mini" @click="convertOrder(scope.row)">编辑</el-button>
                            <el-button type="text" size="mini"  @click="checkOrder(scope.row)" >查看</el-button> 
                            <el-button type="text" size="mini" @click="deleteOrder(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageIndex"
            :page-sizes="[5,10,20,50]"
            :page-size="table.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
      </div>  
  </div>
</template>
<script>
  import {dateFmt} from '@/utils/tools.js'
  export default {
    data() {
      return {
        dialogVisible: false,
        table:{
          loading: false,
          name: '',
          englishName:'',
          credentialNo:'',
          mobile: '',
          pageSize: 10,
          pageIndex: 1,
          total:0,
          travellerList:[{}],
        }
      };    
    },
    mounted () {
      this.getList()
    },
    methods: {
      getList(pageIndex=1){
        this.table.loading=true
        this.shopHttp.post("CustomerBasicData/GetPassengerPageList",{
            pageSize: this.table.pageSize,
            pageIndex: pageIndex,
            total: this.table.total,
            mobile:this.table.mobile,
            name:this.table.name,
            EnglishName:this.table.englishName,
            CredentialNo:this.table.credentialNo,
      }).then(res =>{
       // console.log(res)
          if(res.data.isSuccess == true){
             this.table.loading=false ;
             res.data.objects.forEach( obj => {
               obj.birthdate = dateFmt(new Date(obj.birthdate),'yyyy-MM-dd');
               obj.expireDate = dateFmt(new Date(obj.expireDate),'yyyy-MM-dd');
             })
              this.table.travellerList = res.data.objects;
              this.table.total = res.data.total;
              this.table.pageIndex = res.data.pageIndex;
              this.table.birthPlace =res.data.objects[0].provinceName+ res.data.objects[0].birthPlace
              console.log(this.table.birthPlace)
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
      add(){
        this.$router.push('/customercenter/traveller-add')
      },
      convertOrder(row){
       // console.log(row)
        this.$router.push({path:`/customercenter/traveller-edit/${row.id}`})
      },
      checkOrder(row){
       // console.log(row)
        this.$router.push({name:'travellerDetailes',query:{val:row}})
      },
      deleteOrder(row){
          //console.log(row)
          this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.shopHttp.post("CustomerBasicData/DeletePassenger",{PassengerId:row.id}).then(res =>{
                if(res.data.isSuccess == true){
                    this.getList(this.table.pageIndex);
                    this.$message({
                      type:'success',
                      message:'成功，删除游客信息成功!',
                    })
                }else{
                    this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                    });
                }
            }).catch(e => {
                console.log(e)
            }) 
        }).catch(() => {
                 this.$message({
                    type:'info',
                    message:'取消成功!'
                 })
        });
      },
      handleSizeChange(val) {
         this.table.pageSize = val;
          this.getList(this.table.pageIndex);
      },
      handleCurrentChange(val) {
        this.table.pageIndex = val;
        this.getList(this.table.pageIndex);
      },
    },
  }
</script>
<style scoped lang="scss">
    #dialog-padding{
      padding: 10px 20px;
      font-size: 16px;
    }
</style>

