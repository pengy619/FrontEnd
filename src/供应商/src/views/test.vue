<template>
	<div>
		<h3>内容页面</h3>
		<p>提示测试</p>
		<el-button :plain="true" @click="open2">成功</el-button>
		<el-button :plain="true" @click="open3">警告</el-button>
		<el-button :plain="true" @click="open">消息</el-button>
		<el-button :plain="true" @click="open4">错误</el-button>
		<p>日期选择器测试</p>
		<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
		</el-date-picker>
		<el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
		</el-date-picker>
		<p>跳转测试</p>
		<el-button :plain="true" @click="goPage">进入下一页</el-button>
		<p>完整文档</p>
		<a href="http://element-cn.eleme.io/#/zh-CN/guide/design" target="_blank">Element UI 2.0</a>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				value1:'',
				value6: ''
			}
		},
		methods: {
			open() {
				this.$message('这是一条消息提示');
			},
			open2() {
				this.$message({
					message: '恭喜你，这是一条成功消息',
					type: 'success'
				});
			},

			open3() {
				this.$message({
					message: '警告哦，这是一条警告消息',
					type: 'warning'
				});
			},

			open4() {
				this.$message.error('错了哦，这是一条错误消息');
			},
			goPage(){
				this.$router.push('test2')
			}
		}
	}
</script>

<style>
	.el-date-editor .el-range-separator{
		width: auto!important;
	}
</style>