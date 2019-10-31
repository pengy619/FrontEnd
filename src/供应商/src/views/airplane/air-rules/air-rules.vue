<template>
	<div class="view">
		<el-form ref="form" :model="form" label-width="80px" size="small" style="margin-top: 10px;width: 50%;">
			<el-form-item label="定价规则">
				<el-radio-group v-model="radio2">
				    <el-radio :label="3">财务付款才能定价</el-radio>
				    <el-radio :label="6">财务不付款才能定价</el-radio>
				  </el-radio-group>

			</el-form-item>
			
			<el-form-item>
				<el-button type="primary">保存</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
	    data () {
	      return {
	        radio2: 3
	      };
	    }
	  }
</script>

<style>
</style>