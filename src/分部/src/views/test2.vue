<template>
	<div class="">
		<p>演示GIT操作</p>
	<el-button :plain="true" @click="back">返回</el-button>
	</div>
</template>

<script>
	export default {
		methods:{
			back(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style>
</style>