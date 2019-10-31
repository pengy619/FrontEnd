<template>
	<div class="view">
		<el-tabs v-model="activeName">
		    <el-tab-pane label="控位列表" name="first">
		    	<kongwei-list></kongwei-list>
		    </el-tab-pane>
		    <el-tab-pane label="切位列表" name="second">
		    	<qiewei-list></qiewei-list>
		    </el-tab-pane>
		    <el-tab-pane label="甩位列表" name="third">
		    	<shuaiwei-list></shuaiwei-list>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import kongweiList from './kongwei-list.vue'
	import qieweiList from './qiewei-list.vue'
	import shuaiweiList from './shuaiwei-list.vue'
	export default {
		components:{
			kongweiList,
			qieweiList,
			shuaiweiList,
		},
	    data () {
	      return {
	        activeName:'first'
	      };
	    }
	  }
</script>

<style>
</style>