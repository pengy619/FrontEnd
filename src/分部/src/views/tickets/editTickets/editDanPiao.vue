<template>
  <div class="view">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="门票基本信息" name="first">
        <editTicketsInfo></editTicketsInfo>
      </el-tab-pane>
      <el-tab-pane label="销售设置" name="second">
        <editTicketsMarket :status="activeName"></editTicketsMarket>
      </el-tab-pane>
      <el-tab-pane label="预订环节设置" name="third">
        <editTicketsReserve :status="activeName"></editTicketsReserve>
      </el-tab-pane>
      <el-tab-pane label="验证环节设置" name="fourth">
        <editTicketsVerification :status="activeName"></editTicketsVerification>
      </el-tab-pane>
      <el-tab-pane label="退款设置" name="five">
        <editTicketsRefund :status="activeName"></editTicketsRefund>
      </el-tab-pane>
      <el-tab-pane label="详细资料" name="six">
        <editTicketsMessage :status="activeName"></editTicketsMessage>
      </el-tab-pane>
      <el-tab-pane label="库存价格设置" name="seven">
        <editInventoryPrice :status="activeName"></editInventoryPrice>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>

</style>
<script>
  import editTicketsInfo from "./editTicketsInfo";
  import editTicketsMarket from './editTicketsMarket'
  import editTicketsReserve from './editTicketsReserve'
  import editTicketsVerification from './editTicketsVerification'
  import editTicketsRefund from './editTicketsRefund'
  import editTicketsMessage from './editTicketsMessage'
  import editInventoryPrice from './editInventoryPrice'
  export default {
    components: {
      editTicketsInfo,
      editTicketsMarket,
      editTicketsReserve,
      editTicketsVerification,
      editTicketsRefund,
      editTicketsMessage,
      editInventoryPrice,
    },
    data() {
      return {
        activeName: 'first',
      };
    },
    methods: {
      handleClick(tab, event) {

      }
    }
  };
</script>
