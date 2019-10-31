<template>
    <div class="view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <editBasicInfo></editBasicInfo>
            </el-tab-pane>
            <el-tab-pane label="酒店房型" name="second">
                <editHotelHouseType :status="activeName"></editHotelHouseType>
            </el-tab-pane>
            <el-tab-pane label="酒店餐厅" name="third">
                <editHotelRestaurant :status="activeName"></editHotelRestaurant>
            </el-tab-pane>
            <el-tab-pane label="酒店美食" name="fourth">
                <editHotelFood :status="activeName"></editHotelFood>
            </el-tab-pane>
            <el-tab-pane label="酒店会议室" name="five">
                <editHotelConferenceRoom :status="activeName"></editHotelConferenceRoom>
            </el-tab-pane>
            <el-tab-pane label="配套设施" name="six">
                <editHotelFacilities :status="activeName"></editHotelFacilities>
            </el-tab-pane>
            <el-tab-pane label="交通路线" name="seven">
                <editTrafficRoutes :status="activeName"></editTrafficRoutes>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style>

</style>
<script>
import editBasicInfo from "./editBasicInfo";
import editHotelHouseType from './editHotelHouseType'
import editHotelRestaurant from './editHotelRestaurant';
import editHotelFood from './editHotelFood'
import editHotelConferenceRoom from './editHotelConferenceRoom'
import editHotelFacilities from './editHotelFacilities'
import editTrafficRoutes from './editTrafficRoutes'
export default {
  components: {
      editBasicInfo,
      editHotelHouseType,
      editHotelRestaurant,
      editHotelFood,
      editHotelConferenceRoom,
      editHotelFacilities,
      editTrafficRoutes,
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
