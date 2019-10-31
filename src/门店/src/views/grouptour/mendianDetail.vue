<template>
  <div id="box" class="view">
      <h4><span class="vercitals">| </span>门店信息</h4>
          <el-row>
             <el-col>
                    <span>门店编号</span>{{data.companyCode}}
             </el-col>
          </el-row>
          <el-row>
             <el-col>
                    <span>门店分类</span>{{data.enumDistributorTypeString}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                    <span>门店名称</span>{{data.name}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                    <span>负责人</span>{{data.contanct}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                    <span>门店联系地址</span>{{data.address}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                    <span>联系电话</span>{{data.mobilePhone}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                     <span>传真</span>{{data.fax}}
             </el-col>
         </el-row>
         <el-row>
             <el-col>
                    <span>信用等级:</span>{{data.creditName}}
             </el-col>
         </el-row>
      <h4><span class="vercitals">| </span>登录账号</h4>
         <el-row>
             <el-col>
                    <span>登录账号:</span>{{data.account}}
             </el-col>
         </el-row>
      <h4><span class="vercitals">| </span>备注</h4>
     
      <el-row>
             <el-col>
                    <span style='display:inline-block;width:200px;height:22px;'></span><span style='display:inline-block;width:600px;text-align:left;word-break:break-all;'>{{data.descs}}</span>
             </el-col>
         </el-row>
    </div>
    </template>
<script>
    export default {
        data(){
            return{
                data:{
                    address:"",cityName:"",contanct:"",creditName:"",descs:'',
                    districtName:"",enumDistributorType:0,fax:'',account:'',companyCode:'',
                    mobilePhone:"",name:"",provinceName:""
                }
            }
        },
        mounted () {
            this.shopHttp.get("Member/GetShopDetails"
                        ).then(res =>{
                            //console.log(res)
                            if(res.data.isSuccess == true){
                                this.data = res.data;
                            }else{
                                this.$message({
                                    type:'info',
                                    message:'出错了!' + res.data.message
                                })
                            }
                        }).catch(e => {
                            
                        })
        },
        methods: {
            
        }
    }
</script>

<style scoped lang="scss">
    @import "../../style/common.scss";
   .box{
      background: white;
      padding: 20px;
    }
    .el-row{
        margin:25px 0;
    }
    .el-row span{
        display:inline-block;
        width:200px;
        text-align:right;
        margin-right:100px;
    }    
</style>
