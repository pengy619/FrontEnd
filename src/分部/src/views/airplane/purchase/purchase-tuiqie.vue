<template>
	<div class="view" v-loading="viewLoading">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				商品编号： {{this.basicInfo.productNo}} 
			</el-col>
			<el-col :span="6">航空公司：{{this.basicInfo.airlineName}} </el-col>
			<el-col :span="6">航班类型：{{this.basicInfo.flightType==0?'国内':'国外'}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{this.basicInfo.flightNo}}   
			</el-col>
			<el-col :span="6">出发日期：{{basicInfo.departDate?basicInfo.departDate.split('T')[0]:''}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{this.basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{this.basicInfo.arriveProvinceName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{this.basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{this.basicInfo.arriveTime}} </el-col>
			<el-col :span="8">飞行时长：{{this.basicInfo.flightDurationHours+'小时'+this.basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{this.basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}} </el-col>
		</el-row>
		
		<h4>退切信息</h4>
		<el-form  ref="form" :model="form" :rules="rules" label-width="100px" size="small" style="margin-top: 10px;width: 50%;">
			<el-form-item label="供应商">
				<span>{{basicInfo.supplierName}}</span>
			</el-form-item>
			<el-form-item label="退回库存数" prop="ReturnNumber">
				<el-input-number style="width: 200px" :min="0" :controls="false" v-model="form.ReturnNumber"  class="left-input" @blur="handleChangeReturnNumber"></el-input-number>
			</el-form-item>
			<el-form-item label="库存单价" prop="Price">
				<el-input-number v-model="form.Price"  style="width: 200px;" :min="0" :max="99999999" class="left-input" placeholder="库存单价" :controls="false"  @blur="handleChangePrice">
    		</el-input-number>
			</el-form-item>
			<el-form-item label="库存总金额" prop="TotalPrice">
				<el-input-number v-model="form.TotalPrice"  style="width: 200px;" :min="0" :max="99999999" class="left-input" placeholder="库存总金额" :controls="false">
    		</el-input-number>
			</el-form-item>
			<el-form-item label="备注">
				<el-input
					  type="textarea"
					  prop="Remark"
					  :rows="2"
					  placeholder="请输入内容" v-model="form.Remark">
					</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="onCancel">返回</el-button>
			</el-form-item>
		</el-form>
		
		
	</div>
</template>

<script>
export default {
  data() {
    let checkNumber = (rule, value, callback) => {
				let num=this.basicInfo.remainingQuantity-this.basicInfo.reductionSaleQuantity;
				if(value.toString().indexOf('.')>-1){
					return callback(new Error('预留数量必须为整数'));
				}else if(value>num){
					return callback(new Error(`预留数量必须需小于等于${num}`));
				}else{
					callback();
				}
			};
    return {
      basicInfo: {},
      form: {
        ReturnNumber:null,
        Price: null,
        TotalPrice:null,
        Remark:"",
        PricingSalesId:null,
      },
      submitLoading: false,
      dialogTableVisible: false,
      viewLoading:false,
      rules: {
        ReturnNumber: [{
            required: true,
            validator:checkNumber,
            trigger: "blur"
        }],
        Price: [{
            required: true,
            type:"number",
            message: "库存单价",
            trigger: "blur"
        }],
        TotalPrice: [{
            required: true,
            type:"number",
            message: "库存总金额",
            trigger: "blur"
        }],
      },
    };
  },
  mounted() {
    this.getBasicInfo();
  },
  methods: {
    getBasicInfo() {
      this.viewLoading=true;
      this.airHttp
        .get(
          "/api/Common/GetDetailsTop?pricingSalesId=" +
            this.$route.params.id +
            "&operatingRecordId=0"
        )
        .then(res => {
          this.viewLoading=false;
           var objects=res.data.objects[0];
            this.basicInfo=objects;
            this.form.PricingSalesId = objects.pricingSalesId;
        });
    },
    onSubmit() {
      this.$confirm("是否确认退切", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs['form'].validate(valid => {
            if (valid) {
              this.submitLoading = true;
              this.airHttp
                .post("api/products/returncutoff", this.form)
                .then(res => {
                  this.submitLoading = false;
                  if (res.data.isSuccess) {
                    this.$message({
                      message: "保存退切信息成功！",
                      type: "success"
                    });

                    setTimeout(() => {
                      this.$router.go(-1);
                    }, 1000);
                  }
                });
            } else {
              this.$message.error("请确认输入内容是否正确！");
            }
          });
        })
        .catch(() => {
          this.submitLoading = false;
        });
    },
    onCancel() {
      this.$router.go(-1);
    },
    handleChangePrice(){
         this.form.TotalPrice = this.form.ReturnNumber * this.form.Price||0;
    },
    handleChangeReturnNumber(){
         this.form.TotalPrice = this.form.ReturnNumber * this.form.Price||0;
    }
  }
};
</script>

<style scoped>
.info-row {
  margin: 10px 0;
}

.air-info-box {
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px;
}
</style>