<template>
  <div class="view">
    <el-tabs type="border-card">
      <el-tab-pane label="预订说明">
        <lineexplain></lineexplain>
      </el-tab-pane>
      <el-tab-pane label="线路分类">
        <linetype></linetype>
      </el-tab-pane>
      <el-tab-pane label="线路主题">
        <linetheme></linetheme>
      </el-tab-pane>
      <el-tab-pane label="集合地点">
        <lineaddress></lineaddress>
      </el-tab-pane>
      <el-tab-pane label="线路标签">
        <linelabel></linelabel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import linetype from "./type-setting.vue";
import linetheme from "./theme-setting.vue";
import lineaddress from "./address-setting.vue";
import lineexplain from "./explain-setting.vue";
import linelabel from "./label-setting.vue";
export default {
  components: {
    linetype,
    linetheme,
    lineaddress,
    lineexplain,
    linelabel
  }
};
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
}
</style>
