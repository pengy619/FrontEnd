<template>
  <div class="view" id="box">
        <h4>员工信息</h4>
        <el-row :gutter="20">
            <el-col :span="8">
                <span>姓名</span>{{this.detail.name}}
            </el-col>
            <el-col :span="8">
                <span>性别</span>{{this.detail.sexDesc}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <span>电话号码</span>{{this.detail.telPhone}}
            </el-col>
            <el-col :span="8">
                <span>QQ</span>{{this.detail.qq}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <span>Email</span>{{this.detail.email}}
            </el-col>
            <el-col :span="8">
                <span>入职日期</span>{{this.detail.joinDate}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <!-- <el-col :span="10">
                <span>部门</span>{{this.detail.department}}
            </el-col> -->
            <el-col :span="8">
                <span>职位</span>{{this.detail.postName}}
            </el-col>
            <el-col :span="8">
                <span>角色</span>{{this.detail.roleDesc[0]}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <span>身份证号</span>{{this.detail.idCard}}
            </el-col>
            <el-col :span="8">
                <span>身份证地址</span>{{this.detail.cardAddress}}
            </el-col>
            <!-- <el-col :span="10">
                <span>出生地</span>{{this.detail.birthPlace}}
            </el-col> -->
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="10">
                <span>职位</span>{{m8}}
            </el-col>
        </el-row> -->
        <el-row :gutter="20">
            <el-col :span="8">
                <span>信用额度</span>{{this.detail.creditDesc}}
            </el-col>
            <el-col :span="8">
                <span>登录账号</span>{{this.detail.account}}
            </el-col>
            <!-- <el-col :span="10">
                <span>密码</span>{{m13}}
            </el-col> -->
        </el-row>
        <el-row :gutter="20" style="height:50px">
            <el-col :span="20">
                <span>备注</span>{{this.detail.desc}}
            </el-col>
        </el-row>
        <!-- <h4>银行信息</h4>
        <el-table  ref="multipleTable" :data="demandtabledata" border tooltip-effect="dark" style="width: 100%">
            <el-table-column align="center" type="selection" width="55">
            </el-table-column>
            <el-table-column prop="feeStatusName" label="银行" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeMethod" label="银行账号" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cashway" label="开户名" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeDateFormat" label="开户行" align="center" show-overflow-tooltip>
            </el-table-column>
        </el-table> -->
        <el-button class="mbackbtn" type="info" icon="el-icon-arrow-left" size="small" @click='goBack' style='margin:60px 0 15px 40%;'>返回</el-button>
  </div>
</template>
<script>
export default {
    data(){
        return {
            detail:{
                name:'',
                sexDesc:'',
                telPhone:'',
                password:'',
                qq:'',
                email:'',
                joinDate:'',
                postName:'',
                idCard:'',
                roleDesc:'',
                desc:'',
                account:'',
                creditDesc:'',
                cardAddress:''
                // department:'',//部门
                // birthPlace:''
            }
        }
    },
    mounted(){
        this.shopHttp.get('Member/GetShopSysAccountDetailDto?ShopSysAccountId=' + this.$route.params.id
        ).then(res =>{
           // console.log(res)
            if(res.data.isSuccess == true){
                this.detail = res.data.objects[0];
            }else{
                this.$message({
                    type:'info',
                    message:'出错了!' + res.data.message
                })
            }
            
        }).catch(() => {

        })
    },
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped lang="scss">
@import "../../../style/common.scss";

    .el-col{
        margin:10px 15px;
    }
    .el-col span{
        display:inline-block;
        text-align:right;
        width:150px;
        margin-right:20px;
    }
</style>
