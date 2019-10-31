<template>
	<div class="">
		<p>这是另一个页面</p>
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