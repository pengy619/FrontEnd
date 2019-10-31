<template>
  <div class="view">
    <el-header>
      <el-steps :active="5" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="refundForm" :rules="rules" ref="refundForm" label-width="120px" class="demo-refundForm" size="small">
      <el-form-item label="退款设置" prop="setRefund">
        <el-radio-group v-model="refundForm.setRefund">
          <el-radio label="1">不支持退款</el-radio>
          <el-radio label="2">免费退款</el-radio>
          <el-radio label="3">有条件退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="refund1" v-show="refundForm.setRefund == 3">
          <el-checkbox label="1" v-model="refundForm.refund1">支持生成通知单后，有效日期前(未验证情况下)退款</el-checkbox>
        <el-button size="mini" @click='addRule1'>添加退款规则</el-button>
      </el-form-item>
      <el-row v-for="(item,index) in refundForm.list1" v-show="refundForm.setRefund == 3">
        <el-col :span="6">
          <el-form-item label="" prop="days">
            有效日期前<el-input v-model="item.days"></el-input>天
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="0px" prop="time">
           <el-time-picker
            v-model="item.time"
            placeholder="选择时间">
          </el-time-picker>前，可退
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="-100px" prop="refundWay">
            <el-select v-model="item.refundWay" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="" label-width="-255px" prop="refundValue">
            定价的<el-input v-model="item.refundValue"></el-input>%
            <el-button class="lmargin_10" type="danger" v-show='index>0' @click="delMethod1(index)">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="" prop="refund2" v-show="refundForm.setRefund == 3">
        <el-checkbox label="1" v-model="refundForm.refund2">支持有效日期后(未验证情况下)退款</el-checkbox>
        <el-button size="mini"  @click='addRule2'>添加退款规则</el-button>
      </el-form-item>
      <el-row v-for="(item,index) in refundForm.list2" v-show="refundForm.setRefund == 3">
        <el-col :span="6">
          <el-form-item label="" prop="days">
            有效日期前<el-input v-model="item.days"></el-input>天
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="0px" prop="time">
            <el-time-picker
              v-model="item.time"
              placeholder="选择时间">
            </el-time-picker>前，可退
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="-100px" prop="refundWay">
            <el-select v-model="item.refundWay" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="" label-width="-255px" prop="refundValue">
            定价的<el-input v-model="item.refundValue"></el-input>%
            <el-button class="lmargin_10" type="danger" v-show='index>0' @click="delMethod2(index)">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="退款说明" prop="desc">
        <el-input type="textarea" v-model="refundForm.desc" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="goBack">上一步</el-button>
        <el-button type="primary" @click="SaveRefundSettings('refundForm')" :loading="loading">保存，下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
.el-input {
  width: 100px;
}
.el-textarea {
  width: 55%;
}
.el-col.el-col-6 {
  width: 305px;
}
.view .el-date-editor.el-input,
.view .el-date-editor input {
  width: 145px;
}
.view .el-select .el-input,
.view .el-select input {
  width: 145px;
}
</style>
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      loading:false,
      refundForm: {
        refund1: false,
        refund2: false,
        setRefund: "1",
        list1: [
          {
            productId: this.$route.query.productId,
            RuleType:1,
            days: "",
            time: new Date(0, 0, 0, 24, 0),
            refundWay: "",
            refundValue: ""
          }
        ],
        list2: [
          {
            productId: this.$route.query.productId,
            RuleType:2,
            days: "",
            time: new Date(0, 0, 0, 24, 0),
            refundWay: "",
            refundValue: ""
          }
        ],
        desc:'',
      },
      options: [
        {
          value: "1",
          label: "固定比例"
        },
        {
          value: "2",
          label: "固定金额"
        }
      ],
      rules: {
        // setRefund: [
        //   { required: true, message: '请选择退款设置', trigger: 'change' }
        // ],
        // days: [
        //   { required: true, message: '请输入天数', trigger: 'blur' }
        // ],
        // date: [
        //    {
        //   type: "date",
        //   required: true,
        //   message: "请输入时间",
        //   trigger: "blur"
        // }
        // ],
        // type: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        // price: [
        //   { required: true, message: '请选择活动资源', trigger: 'blur' }
        // ]
      }
    };
  },
  mounted() {
  },
  methods: {
    SaveRefundSettings() {
      this.loading = true;
      let list1 = this.refundForm.list1
      let list2 = this.refundForm.list2
      let refundRuleList = [...list1,...list2]
      refundRuleList.forEach(item=>{
          item.time = dateFmt(item.time,'hh:mm')
      })
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
          this.ticketHttp.post('TicketProduct/SaveTicketRefundSettings',{
            ProductId: this.$route.query.productId,
            RefundType:this.refundForm.setRefund,
            RefundInfo:this.refundForm.desc,
            RefundRules:refundRuleList,
          }).then(res=>{
              if(res.data.isSuccess == true){
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.$router.push({ path: "/Tickets/ticketsMessage",query:{productId: this.$route.query.productId}});
              }else{
              this.loading = false;
              this.$message.error(res.data.message)
            }
          }).catch(e=>{
            this.loading = false;
            console.log(e)
          })
      //   // } else {
      //   //   console.log("error submit!!");
      //   //   return false;
      //   // }
      // });
    },
    addRule1() {
      this.refundForm.list1.push({
        productId: this.$route.query.productId,
        RuleType:1,
        days: "",
        time: new Date(0, 0, 0, 24, 0),
        refundWay: "",
        refundValue: ""
      });
    },
     addRule2() {
      this.refundForm.list2.push({
        productId: this.$route.query.productId,
        RuleType:2,
        days: "",
        time: new Date(0, 0, 0, 24, 0),
        refundWay: "",
        refundValue: ""
      });
    },
    delMethod1(index){
      this.refundForm.list1.splice(index,1)
    },
    delMethod2(index){
      this.refundForm.list2.splice(index,1)
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
