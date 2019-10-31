<template>
	<div class="view">
		<el-tabs v-model="activeName">
		    <el-tab-pane label="机场设置" name="first">
		    	<airport></airport>
		    </el-tab-pane>
		    <el-tab-pane label="机型设置" name="second">
		    	<airtype></airtype>
		    </el-tab-pane>
		    <el-tab-pane label="退票规则" name="third">
		    	<refundrule></refundrule>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import airport from './airport-setting.vue'
	import airtype from './airtype-setting.vue'
	import refundrule from './refundrule-setting.vue'
	export default {
		components:{
			airport,
			airtype,
			refundrule
		},
	    data () {
	      return {
	        radio2: 3,
	        activeName:'first'
	      };
	    }
	  }
</script>

<style>
</style>