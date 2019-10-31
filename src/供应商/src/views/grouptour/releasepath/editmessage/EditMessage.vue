<template>
    <div class="view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="线路信息" name="first">
                <editroutemessage></editroutemessage>
            </el-tab-pane>
            <el-tab-pane label="行程信息" name="second">
                <editjourneymessage :status="activeName"></editjourneymessage>
            </el-tab-pane>
            <el-tab-pane label="小项目" name="third">
                <editsubentrymessage :status="activeName"></editsubentrymessage>
            </el-tab-pane>
            <el-tab-pane label="预订说明" name="fourth">
                <editroutereserve :status="activeName"></editroutereserve>
            </el-tab-pane>
            <el-tab-pane label="上传附件" name="five">
                <editfileupload :status="activeName"></editfileupload>
            </el-tab-pane>
            <el-tab-pane label="特殊人群限制" name="six">
                <editspecialperson :status="activeName"></editspecialperson>
            </el-tab-pane>
            <el-tab-pane label="退款说明" name="seven">
                <editrefund :status="activeName"></editrefund>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style>

</style>
<script>
import editroutemessage from "./editRouteMessage";
import editjourneymessage from './editJourneyMessage';
import editsubentrymessage from './editsubentryMessage';
import editroutereserve from './editRouteReserve'
import editfileupload from './editFileUpload'
import editspecialperson from './editSpecialPerson'
import editrefund from './editRefund'
export default {
  components: {
      editroutemessage,
      editjourneymessage,
      editsubentrymessage,
      editroutereserve,
      editfileupload,
      editspecialperson,
      editrefund,
  },
  data() {
    return {
        activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
     // console.log(tab, event);
    }
  }
};
</script>
