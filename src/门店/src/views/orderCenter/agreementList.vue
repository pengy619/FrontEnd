<template>
  <div class="view">
    <el-button type="primary" size="small" style="margin-bottom:10px" @click="addAgreement">发起</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="outContractNo" label="合同编号"></el-table-column>
      <el-table-column prop="outContractName" label="合同名称" width="180"></el-table-column>
      <el-table-column prop="travelerNames" label="被担保人" width="180"></el-table-column>
      <el-table-column prop="createOn" label="创建时间"></el-table-column>
      <el-table-column prop="allSignered" label="是否已签署">
          <template slot-scope="scope">
              {{scope.row.allSignered ? '是':'否'}}
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.shopHttp
        .get(
          `Contract/GetDisclaimerAgreementList?orderNo=${this.$route.params.id}`)
        .then(res => {
            res.data.forEach(obj => {
              let data = new Date(obj.createOn);
              obj.createOn = dateFmt(data, "yyyy-MM-dd hh:mm:ss")
            });
            this.tableData = res.data
        });
    },
    addAgreement() {
      this.$router.push("/orderCenter/editAgreement/" + this.$route.params.id);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
