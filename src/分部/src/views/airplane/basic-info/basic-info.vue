<template>
	<div class="view">
		<el-tabs v-model="activeName">
		    <el-tab-pane label="机场设置" name="first">
		    	<airport></airport>
		    </el-tab-pane>
		    <el-tab-pane label="机型设置" name="second">
		    	<airtype></airtype>
		    </el-tab-pane>
				<el-tab-pane label="舱位设置" name="third">
		    	<airspace></airspace>
		    </el-tab-pane>
		    <el-tab-pane label="退票规则" name="fouth">
		    	<refundrule></refundrule>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import airport from './airport-setting.vue'
	import airtype from './airtype-setting.vue'
	import airspace from './airspace-setting.vue'
	import refundrule from './refundrule-setting.vue'
	export default {
		components:{
			airport,
			airtype,
			airspace,
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