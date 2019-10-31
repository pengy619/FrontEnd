<template>
	<div>
		<!--<router-link :to="">123</router-link>-->
		<p v-for="item in list"><router-link to="/test4">{{item}}</router-link></p>
		
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
			this.getList()
		},
		methods: {
			getList(){
				this.airHttp.get('api/refundrule/refundruleList?Id=0&PageSize=10&PageIndex=1')
				.then(()=>{
					alert(11)
				})
			}
		}
	}
</script>

<style>
</style>