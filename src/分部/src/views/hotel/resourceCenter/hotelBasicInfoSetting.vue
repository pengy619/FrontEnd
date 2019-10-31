<template>
    <div class="view">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="酒店主题" name="first">
                <hotelThemes></hotelThemes>
            </el-tab-pane>
            <el-tab-pane label="酒店设施" name="second">
                <hotelFacilities :status="activeName"></hotelFacilities>
            </el-tab-pane>
            <el-tab-pane label="房型设置" name="third">
                <houseTypeSetting :status="activeName"></houseTypeSetting>
            </el-tab-pane>
            <el-tab-pane label="房间设施" name="fourth">
                <roomFacilities :status="activeName"></roomFacilities>
            </el-tab-pane>
            <el-tab-pane label="床型设置" name="five">
                <bedSetting :status="activeName"></bedSetting>
            </el-tab-pane>
            <el-tab-pane label="床尺寸设置" name="six">
                <bedSizeSetting :status="activeName"></bedSizeSetting>
            </el-tab-pane>
            <el-tab-pane label="含餐设置" name="seven">
                <mealSetting :status="activeName"></mealSetting>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style>

</style>
<script>
import hotelThemes from "./hotelThemes";
import hotelFacilities from './hotelFacilities'
import houseTypeSetting from './houseTypeSetting';
import roomFacilities from './roomFacilities'
import bedSetting from './bedSetting'
import bedSizeSetting from './bedSizeSetting'
import mealSetting from './mealSetting'
export default {
  components: {
      hotelThemes,
      hotelFacilities,
      houseTypeSetting,
      roomFacilities,
      bedSetting,
      bedSizeSetting,
      mealSetting,
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
