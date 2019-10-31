<template>
    <div class='view'>
        <el-tabs type="border-card">
          <el-tab-pane label="票种设置">
                <ticketType></ticketType>   
            </el-tab-pane>
            <el-tab-pane label="景点类型">
                <attractionType></attractionType>   
            </el-tab-pane>
            <el-tab-pane label="景点等级">
                <attractionLevel></attractionLevel>   
            </el-tab-pane>
            <!-- <el-tab-pane label="客户必填信息">
                <necessaryInfo></necessaryInfo>   
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>
<script>
import ticketType from "./ticket-type.vue";
import attractionType from "./attraction-type.vue";
import attractionLevel from "./attraction-level.vue";
// import necessaryInfo from "./necessary-info.vue";
export default {
  components: {
    ticketType,
    attractionType,
    attractionLevel
    //necessaryInfo
  },
  data () {
      return {
          msg: ''
      }
  },
  mounted () {
      this.groupHttp.get('DictionaryData/GetDictionaryData?Type=1004')
      .then( (res) => {
          console.log(res)
      }).catch( (err) => {
          console.log(err)
      })
  }
};
</script>

<style scoped lang="scss">
.el-tabs {
  margin-top: 20px;
}
</style>
