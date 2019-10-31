<template>
  <div class="view" id="box" v-loading="viewLoading">
    <h4>电子合同信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="合同编号" size="small" label-width="100px">
            <span>{{details.outContractNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="合同名称" size="small" label-width="100px">
            <span>{{details.outContractName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单号" size="small" label-width="100px">
            <span>{{details.orderNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" size="small" label-width="100px">
            <span>{{details.createOn?details.createOn.split('T')[0]:''}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="产品类型名称" size="small" label-width="100px">
            <span>{{details.productTypeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" size="small" label-width="100px">
            <span>{{details.createOn?details.createOn.split('T')[0]:''}}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="是否已签署" size="small" label-width="100px">
            <span>{{details.allSignered?'是':'否'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table ref="information" :data="details.personSignerList" border tooltip-effect="dark">
      <el-table-column prop="signerTypeName" label="签署人" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="outUserName" label="签署人姓名" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="outMobile" label="手机号码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="签署状态" prop="isSignedName" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.isSignedName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="签署时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.signerTime?scope.row.signerTime.split('T')[0]:''}}
        </template>
      </el-table-column>

      <el-table-column prop="vCode" label="验证码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="content" label="短信内容" align="center" label-width="140px">
      </el-table-column>
      <el-table-column label="操作"
                       min-width="70"
                       align="center"
                      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click='resendMessage(scope.row)' v-show='(scope.row.isSignedName != "已签署")'>重发短信</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="margin_top text-center">
      <el-button type="primary" @click="handleDownload" size="small">下载</el-button>
      <!-- <el-button type="primary" @click="$router.go(-1)" size="small">返回</el-button> -->
    </div>
    <div class="margin_top text-left" v-if="details.allSignered">
      <label>完成签署通知&nbsp;:&nbsp;&nbsp;</label>
      <span>{{details.completeMessage}}</span>
    </div>
  </div>
</template>

<script>
  import { dateFmt } from '@/utils/tools'
  export default {
    data() {
      return {
        details: {},
        viewLoading: false,
      }
    },
    mounted() {
      this.initMessage();
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      //初始化信息
      initMessage() {
        this.viewLoading = true;
        let url = "Contract/GetElectronicContract?contractNo=" + this.$route.query.contractNo;
        this.shopHttp.get(url).then(res => {
          // if(res.data.isSuccess){
          this.details = res.data;
          this.viewLoading = false;
          // }else{
          //   this.$message({
          //     type: "error",
          //     message: "出错了!" + res.data.message
          //   });
          // }
        }).catch(e => {
          this.viewLoading = false;
        })
      },
      //下载
      handleDownload() {
        let WEB_API = process.env.WEB_API;
        window.location.href = WEB_API + "/Common/HgyContractDownload?ContractNo=" + this.$route.query.contractNo;
      },
      //重发短信
      resendMessage(row) {
        this.$confirm('您确定要重发短信? \r\n'+row.content, '提示', {
          confirmButtonText: '重发',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shopHttp.post("Contract/ResendMessage", {
            contractUserId: row.id,
            pageSize: 10,
            pageIndex: 1
          }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "发送成功"
                });
                //this.queryData();
              } else {
                this.$message({
                  type: "info",
                  message: "操作失败:" + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e)
            });
        }).catch(() => {
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  .mysapn {
    font-weight: bold;
  }

  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }

  .vercitals {
    font-weight: bold;
    font-size: 20px;
  }

  .view .el-input.width_180px {
    width: 180px;
  }
</style>

