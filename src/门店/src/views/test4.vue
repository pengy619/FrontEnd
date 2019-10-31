<template>
	<div>
		<el-form ref="form">
			<el-table
			:data="tableData"
			style="width: 100%">
				<el-table-column label="列1">
					<template slot-scope="scope">
						<el-form-item class="is-required" :class="{'is-error':!scope.row.input1.validate}">
							<el-input v-model="scope.row.input1.value"></el-input>
							<div class="el-form-item__error" v-if="!scope.row.input1.validate">
								{{scope.row.input1.message}}
							</div>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="列2">
					<template slot-scope="scope">
						<el-form-item class="is-required" :class="{'is-error':!scope.row.input2.validate}">
							<el-input v-model="scope.row.input2.value"></el-input>
							<div class="el-form-item__error" v-if="!scope.row.input2.validate">
								{{scope.row.input2.message}}
							</div>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="列3">
					<template slot-scope="scope">
						<el-form-item class="is-required" :class="{'is-error':!scope.row.input3.validate}">
							<el-input v-model="scope.row.input3.value"></el-input>
							<div class="el-form-item__error" v-if="!scope.row.input3.validate">
								{{scope.row.input3.message}}
							</div>
						</el-form-item>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<el-button @click="submit">测试</el-button>
	</div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
		  input1:{
			  value:'',
			  validate:true,
			  message:'a不能为空'
		  },
		  input2:{
			  value:'',
			  validate:true,
			  message:'b不能为空'
		  },
		  input3:{
			  value:'',
			  validate:true,
			  message:'c不能为空'
		  },
	  },{
		  input1:{
			  value:'',
			  validate:true,
			  message:'d不能为空'
		  },
		  input2:{
			  value:'',
			  validate:true,
			  message:'e不能为空'
		  },
		  input3:{
			  value:'',
			  validate:true,
			  message:'f不能为空'
		  },
	  },{
		  input1:{
			  value:'',
			  validate:true,
			  message:'g不能为空'
		  },
		  input2:{
			  value:'',
			  validate:true,
			  message:'h不能为空'
		  },
		  input3:{
			  value:'',
			  validate:true,
			  message:'i不能为空'
		  },
	  }],
	 
    };
  },
  watch: {
	tableData: {
		handler: function (newVal) {
			this.validate()
			this.tableData.forEach((item,index)=>{
			  for(let k in item){
				    if(item[k].value!==""){
						item[k].validate=true
					}
			  }
		   })
		},
		deep: true
	}
  },
  methods: {
	  validate(){
		  let validate=[]
		  this.tableData.forEach((item,index)=>{
			  for(let k in item){
				    if(item[k].value==""){
						item[k].validate=false
					}else{
						item[k].validate=true
					}
				    validate.push(item[k].validate)
			  }
		  })
		  return validate.indexOf(false)==-1
	  },
	  submit(){
		  if(this.validate()){
			  alert('提交')
		  }
	  }
  }
};
</script>
