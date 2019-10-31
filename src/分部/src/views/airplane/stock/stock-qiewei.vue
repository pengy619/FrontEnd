<template>
	<div class="view">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="20">
				商品编号： {{this.basicInfo.productNo}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{this.basicInfo.flightType==0?'国内':'国外'}}</el-col>
			<el-col :span="6">航空公司：{{this.basicInfo.airlineName}} </el-col>
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
			<el-col :span="4">目的地：{{this.basicInfo.arriveProvinceName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{this.basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{this.basicInfo.arriveTime}} </el-col>
			<el-col :span="6">飞行时长：{{this.basicInfo.flightDurationHours+'小时'+this.basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{this.basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}} </el-col>
		</el-row>

		<h4>库存信息</h4>
		<el-table ref="stockTable" :data="stockTable" highlight-current-row style="width: 100%">
			<el-table-column prop="type" label="">
			</el-table-column>
			<el-table-column prop="total" label="座位数" align="center">
			</el-table-column>
			<el-table-column prop="kongwei" label="控位" align="center">
			</el-table-column>
			<el-table-column  label="切位" align="center">
				<template slot-scope="scope">
					<el-input-number v-model="qiewei" :min="minQiewei" :max="maxQiewei" style="width: 100px;" size="small" v-if="scope.row.type=='调整后'"></el-input-number>
			        <span v-else>{{scope.row.qiewei}}</span>
			    </template>
			</el-table-column>
			<el-table-column prop="yuwei" label="余位" align="center">
			</el-table-column>
			<el-table-column prop="shuaiwei" label="甩位" align="center">
			</el-table-column>
		</el-table>
		
		<h4>分配账户</h4>
		<el-form  ref="form" :model="form" :rules="rules" label-width="100px" size="small" style="margin-top: 10px;width: 50%;">
			<el-form-item label="分配账户" >
				<span>XXXX账户</span>
				<el-button type="primary" size="small">选择</el-button>
			</el-form-item>
			<el-form-item label="切位数量">
				<el-input style="width: 200px" v-model="inputNumber" :disabled="true" ></el-input>
			</el-form-item>
			<el-form-item label="切位时间" prop="CutDateTime">
				<el-date-picker v-model="form.CutDateTime" type="date" placeholder="选择日期">
    		</el-date-picker>
			</el-form-item>
			<el-form-item label="切位联系人" prop="CutTangentContact">
				<el-input style="width: 200px" v-model="form.CutTangentContact"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="CutContactInformation">
				<el-input style="width: 200px" v-model="form.CutContactInformation"></el-input>
			</el-form-item>
			<el-form-item label="说明">
				<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容" v-model="form.Remark">
					</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :disabled="addBtn" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="onCancel">返回</el-button>
			</el-form-item>
		</el-form>
		
		
	</div>
</template>

<script>
export default {
  data() {
    return {
      inputNumber:0,
      maxQiewei:0,
      minQiewei:0,
      basicInfo: {},
      stockTable: [
        {
          type: "当前",
          total: 0,
          kongwei: 0,
          qiewei: 0,
          yuwei: 0,
          shuaiwei: 0
        },
        {
          type: "调整后",
          total: 0,
          kongwei: 0,
          qiewei: 0,
          yuwei: 0,
          shuaiwei: 0
        }
      ],
      form: {
        PricingSalesId: this.$route.params.id,
        Number: 0,
        BranchID: 1058,
        CutCustomerName: "固定的名字",
        CutTangentContact:"",
        CutContactInformation:"",
        Remark:"",
        CutDateTime:''
      },
      submitLoading: false,
      addBtn: false,
      qiewei: 0,
       currency:[{
		        	label:'人民币',
		        	value:0
		        },{
		        	label:'美元',
		        	value:1
		        },{
		        	label:'港币',
		        	value:2
		        },{
		        	label:'欧元',
		        	value:3
		        }],
      dialogTableVisible: false,
      rules: {
        CutDateTime: [
            { type:'date', required: true, message: '请选择切位时间', trigger: 'change' }
          ],
        Number: [
          {
            required: true,
            message: "请选择切位数量",
            trigger: "blur"
          }
        ],
        CutTangentContact: [
          {
            required: true,
            message: "请输入切位联系人",
            trigger: "blur"
          }
        ],
        CutContactInformation: [
          {
            required: true,
            message: "请选择联系方式",
            trigger: "blur"
          }
        ]
      },
      saleStatus: true
    };
  },
  watch: {
    qiewei: function(val) {
      this.stockTable[1].yuwei = this.stockTable[0].total-this.stockTable[0].kongwei - val;
      this.inputNumber=val-this.stockTable[0].qiewei;
    }
  },
  mounted() {
    this.getBasicInfo();
  },
  methods: {
    getBasicInfo() {
      this.airHttp
        .get(
          "/api/Common/GetDetailsTop?pricingSalesId=" +
            this.$route.params.id +
            "&operatingRecordId=0"
        )
        .then(res => {
         	var restop=res.data.objects[0];
					this.basicInfo=restop;
          this.form.PricingSalesId = res.data.objects[0].pricingSalesId;

          this.stockTable[0].total = res.data.objects[0].quantity; //总座位数
          this.stockTable[0].kongwei = res.data.objects[0].reservedQuantity; //控位数量
          this.stockTable[0].qiewei = res.data.objects[0].saleQuantity; //切位数量
          this.stockTable[0].yuwei = res.data.objects[0].remainingQuantity; //余位数量
          this.stockTable[0].shuaiwei =res.data.objects[0].reductionSaleQuantity; //甩位数量

          this.stockTable[1].total = res.data.objects[0].quantity;
          this.stockTable[1].qiewei = res.data.objects[0].saleQuantity;
          this.stockTable[1].shuaiwei =res.data.objects[0].reductionSaleQuantity;
          this.stockTable[1].kongwei = res.data.objects[0].reservedQuantity; 
          this.stockTable[1].yuwei = res.data.objects[0].remainingQuantity;
          this.qiewei= res.data.objects[0].saleQuantity;
          this.maxQiewei=JSON.parse(JSON.stringify(this.stockTable[0].yuwei-this.stockTable[0].shuaiwei+this.stockTable[0].qiewei));
          this.minQiewei=JSON.parse(JSON.stringify(this.stockTable[0].qiewei));
        });
    },
    onSubmit() {
      this.$confirm("是否确认切位", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log('waiceng')
          this.$refs['form'].validate(valid => {
            if (valid) {
               console.log(111)
              this.submitLoading = true;
              if (this.inputNumber <= 0) {
                this.$message.error("请输入正确的切位数量！");
                this.submitLoading = false;
                return false;
              }
              console.log(113)
              this.form.Number = this.qiewei;
              console.log(2222)
              this.airHttp
                .post("api/products/SaleSave", this.form)
                .then(res => {
                  this.submitLoading = false;
                  if (res.data.isSuccess) {
                    this.$message({
                      message: "保存切位信息成功！",
                      type: "success"
                    });

                    setTimeout(() => {
                      this.$router.push({ name: "stock-list" });
                    }, 1000);
                  }
                });
            } else {
              console.log(233)
              this.$message.error("请确认输入内容是否正确！");
            }
          });
        })
        .catch(() => {
          this.submitLoading = false;
        });
    },
    onCancel() {
      this.$router.push({ name: "stock-list" });
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