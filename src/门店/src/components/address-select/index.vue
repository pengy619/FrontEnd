<template>
	<el-cascader v-bind:style="{width:width}" v-model="activeData" :options="addressOptions" @active-item-change="addressItemChange" @change="retunResult" :props="props" clearable></el-cascader>
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
			districtUrl:{
				default:'/AreaAddress/GetDistrict?CityId=',
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
					this.addressHttp.post(this.provinceUrl+'1')
					.then((res)=>{
						let data=res.data;
						data.forEach((item)=>{
							item.children=[]
						})
						this.addressOptions=data
					})
				}
				if(val == 'International') {
					this.addressHttp.post(this.countryUrl+'International')
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
				console.log(this.activeData)
				if(this.dataType=='Domestic'){
					if(id.length == 1){
						this.addressHttp.post(this.cityUrl+id)
						.then((res)=>{
							let data=res.data
							this.addressOptions.forEach((item)=>{
								item.children = [];
								if(item.id==id){
									item.children = data
									console.log(data)
								}
							})
						})
					}
					if(id.length == 2){
						this.addressHttp.post(this.districtUrl+id[1])
						.then((res)=>{
							let data=res.data
							this.addressOptions[this.activeData[0]].forEach((item)=>{
								if(item.id==id[1]){
									console.log(data);
									item.children=data
								}
							})
						})
					}
				}
				// if(this.dataType=='International'){
				// 	if(id.length==1){
				// 		this.addressHttp.post(this.provinceUrl+id)
				// 		.then((res)=>{
				// 			let data=res.data
				// 			data.forEach((item)=>{
				// 				item.children=[]
				// 			})
				// 			this.addressOptions.forEach((item)=>{
				// 				if(item.id==id[id.length-1]){
				// 					item.children=data
				// 				}
				// 			})
				// 		})
				// 	}
				// 	if(id.length==2){
				// 		this.airHttp.get(this.cityUrl+this.dataType+'&ParentId='+id[id.length-1])
				// 		.then((res)=>{
				// 			let data=res.data.objects
				// 			this.addressOptions.forEach((item)=>{
				// 				item.children.forEach((p)=>{
				// 					if(p.id==id[id.length-1]){
				// 						p.children=data
				// 					}
				// 				})

				// 			})
				// 		})
				// 	}
				// }
			},
			retunResult(){
				let firstId=this.activeData[0],secondId=this.activeData[1],thirdId = this.activeData[2];
				let first,second,third;
				let firstItem=[];
				let secondItem=[];
				let thirdItem = []
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
				let result={
					first:first
				}
				for(let i=0;i<firstItem.children.length;i++){
					if(firstItem.children[i].id==secondId){
						second={
							name:firstItem.children[i].name,
							id:firstItem.children[i].id
						}
						secondItem=firstItem.children[i]
						console.log(secondItem)
						break
					}
				}
				result.second = second;
				if(this.activeData.length > 2){
					console.log(this.activeData);
					console.log(secondItem);
					for(let i=0;i<secondItem.children.length;i++){
						if(secondItem.children[i].id==thirdId){
							third={
								name:secondItem.children[i].name,
								id:secondItem.children[i].id
							}
							thirdItem=secondItem.children[i]
							break
						}
					}
					result.third = third;
				}
				if(this.dataType=='International'){
					let fourthId=this.activeData[3];
					for(let i=0;i<secondItem.children.length;i++){
						if(secondItem.children[i].id==thirdId){
							third={
								name:secondItem.children[i].name,
								id:secondItem.children[i].id
							}
							break
						}
					}
					result.fourth=fourth
				}
				console.log(result)
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
