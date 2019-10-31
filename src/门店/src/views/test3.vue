<template>
	<div>
		<!--<router-link :to="">123</router-link>-->
		<p v-for="item in list"><router-link to="/test4">{{item.name}}</router-link></p>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		mounted(){
			this.http.post('/api/Demo/GetAccount').then((res)=>{
						this.list=res.data.objects
					}).catch((err)=>{
						
					})
			
		},
		methods: {
			
		}
	}
</script>

<style>
</style>