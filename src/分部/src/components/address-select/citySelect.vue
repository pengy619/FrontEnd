<template>
	<el-cascader v-bind:style="{width:width}" v-model="activeData" :options="addressOptions" @active-item-change="addressItemChange" @change="retunResult" :props="props"></el-cascader>
</template>

<script>
	export default {
		props:{
			dataType:{
				default:'Domestic',
				type:String,
			},
			countryUrl:{
				default:'/AreaAddress/GetCountry?CountryId=',
				type:String,
			},
			provinceUrl:{
				default:'/AreaAddress/GetProvince?CountryId=',
				type:String,
			},
			cityUrl:{
				default:'/AreaAddress/GetCity?ProvinceId=',
				type:String,
			},
			width:{
				default:'100%',
				type:String,
			},
		},
		data() {
			return {
				addressOptions: [],
				props: {
					value: 'id',
					label:'name',
					children: 'children'
				},
				activeData:[]
			}
		},
		watch:{
			'dataType':function(val){
				this.getFirstData(val)
			},
		},
		mounted(){
			this.getFirstData(this.dataType)
		},
		methods:{
			getFirstData(val){
				if(val == 'Domestic') {
					this.groupHttp.post(this.provinceUrl+'1')

					.then((res)=>{
						let data=res.data;
						data.forEach((item)=>{
							item.children=[]
						})
						this.addressOptions=data
					})
				}
				if(val == 'International') {
					this.airHttp.post(this.countryUrl+'International')
					.then((res)=>{
						let data=res.data;
						data.forEach((item)=>{
							item.children=[]
						})
						this.addressOptions=data
					})
				}
			},
			addressItemChange(id){
                console.log(id)
				if(this.dataType=='Domestic'){
					if(id.length==1){
						this.groupHttp.post(this.cityUrl+id[0])
						.then((res)=>{
							let data=res.data;
							this.addressOptions.forEach((item)=>{
								if(item.id==id[id.length-1]){
									item.children=data
								}
							})
						})
					}
				}
				if(this.dataType=='International'){
					if(id.length==1){
						this.groupHttp.post(this.provinceUrl+this.dataType+'&ParentId='+id[id.length-1])
						.then((res)=>{
							let data=res.data;
							data.forEach((item)=>{
								item.children=[]
							})
							this.addressOptions.forEach((item)=>{
								if(item.id==id[id.length-1]){
									item.children=data
								}
							})
						})
					}
					if(id.length==2){
						this.groupHttp.post(this.cityUrl+this.dataType+'&ParentId='+id[id.length-1])
						.then((res)=>{
							let data=res.data.objects
							this.addressOptions.forEach((item)=>{
								item.children.forEach((p)=>{
									if(p.id==id[id.length-1]){
										p.children=data
									}
								})

							})
						})
					}
				}
			},
			retunResult(){
				let firstId=this.activeData[0],secondId=this.activeData[1];
				let first,second,third;
				let firstItem=[];
				let secondTtem=[]
				for(let i=0;i<this.addressOptions.length;i++){
					if(this.addressOptions[i].id==firstId){
						first={
							name:this.addressOptions[i].name,
							id:this.addressOptions[i].id
						}
						firstItem=this.addressOptions[i]
						break
					}

				}
				for(let i=0;i<firstItem.children.length;i++){
					if(firstItem.children[i].id==secondId){
						second={
							name:firstItem.children[i].name,
							id:firstItem.children[i].id
						}
						secondTtem=firstItem.children[i]
						break
					}
				}
				let result={
					first:first,
					second:second
				}
				if(this.dataType=='International'){
					let thirdId=this.activeData[2];
					for(let i=0;i<secondTtem.children.length;i++){
						if(secondTtem.children[i].id==thirdId){
							third={
								name:secondTtem.children[i].name,
								id:secondTtem.children[i].id
							}
							break
						}
					}
					result.third=third
				}

				this.$emit('result',result);
			},
			reset(){
				this.activeData=[]
			}
		}
	}
</script>

<style>
</style>
