<template>
  <div class="view">
    <el-header>
      <el-steps :active="7" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="priceForm" :rules="rules" ref="priceForm" label-width="140px" class="demo-priceForm" size="small"
            >
      <el-form-item lable="">
        <span>价格规则</span>
      </el-form-item>
        <el-form-item label="批量设置库存价格" prop="TotalNum">
          每日可售 <el-input v-model="priceForm.TotalNum"></el-input>
          张
        </el-form-item>
      <div class="type-date-box">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择日期" label-width="210px" prop="DateRange">
              <el-form-item>
                <el-date-picker v-model="trip.dateRange" @change="tripDateChange"
                                type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="StartDisableDate">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="出发日期" style="width: 100%;" label-width="210px">
              <el-radio-group v-model="trip.DepartDateType" @change="dateTypeChange()">
                <el-radio :label="0">天天销售</el-radio>
                <el-radio :label="1">按周销售</el-radio>
                <el-radio :label="2">按日期销售</el-radio>
                <el-radio :label="3">按天销售</el-radio>
                <el-radio :label="4">逢期销售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="trip.DepartDateType==1">
          <el-col :span="24">
            <el-form-item label="筛选" style="width: 100%;" label-width="180px">
              <el-checkbox-group v-model="trip.week" @change="tripWeekChange()">
                <el-checkbox :label="1">周一</el-checkbox>
                <el-checkbox :label="2">周二</el-checkbox>
                <el-checkbox :label="3">周三</el-checkbox>
                <el-checkbox :label="4">周四</el-checkbox>
                <el-checkbox :label="5">周五</el-checkbox>
                <el-checkbox :label="6">周六</el-checkbox>
                <el-checkbox :label="0">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="trip.DepartDateType==2">
          <el-col :span="24">
            <el-form-item label="每隔" label-width="180px">
              <el-input-number v-model="trip.days" :min="0" label=""></el-input-number>
              天
              <el-button type="primary" size="small" @click="apartDays()">计算</el-button>
            </el-form-item>
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="trip.DepartDateType==4">
          <el-col :span="24">
            <el-form-item label="逢" label-width="175px">
              <el-input-number v-model="trip.days2" :min="0" :max="9" label="0-9的数字"></el-input-number>
              出团
              <el-button type="primary" size="small" @click="whenDays()">计算</el-button>
              <span class="gray-text">（如：逢8开团，每月的8、18、28号开团）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="tagbox">
          <el-col :span="24">
            <el-tag
              v-for="tag in trip.tagData"
              :key="tag"
              closable
              style="margin:5px"
              @close="tripCloseTag(tag)"
            >
              {{tag}}
            </el-tag>
          </el-col>
        </el-row>
      </div>
      <el-table :data="PriceList" border style="width: 80%" size="small">
        <el-table-column prop="priceName" label="价格" width="180" align="center">
        </el-table-column>
        <el-table-column prop="Price" label="价格" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Price" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="currency" label="币种" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currency" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="margin_top_20px" label-width="0px">
        <el-button type="primary" @click="savePriceForm('priceForm')" size="small" :loading="loading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.el-col.el-col-3 {
  width: 375px;
}
.margin_top_20px {
  margin-top: 20px;
}
.el-input {
  width: 100px;
}

.tagbox.el-row {
  margin-left: 145px;
}

.el-form {
  border: 1px dashed #999999;
  width: 850px;
  padding: 10px 20px;
  margin: 10px 0px;
}

.margin_left_255 {
  margin-left: 255px;
}
</style>
<script>
import { dateFmt } from "@/utils/tools";
export default {
  data() {
    var checkDateRange = (rule, value, callback) => {
      if (!this.trip.dateRange) {
        callback(new Error("您还没有选择出发日期"));
      } else {
        callback();
      }
    };
    return {
      loading:false,
      options: [],
      priceForm: {
        TotalNum: ""
      },
      trip: {
        DepartDateType: 0,
        dateRange: "",
        rangeAlldate: [],
        tagData: [],
        week: [1, 2, 3, 4, 5, 6, 0],
        days: 0,
        dyas2: 0,
        GoBackTime: ""
      },
      PriceList: [
        {
          priceName: "来价",
          currency: "",
          PriceType: 1,
          Price: ""
        },
        {
          priceName: "媒体外卖价(元)",
          currency: "",
          PriceType: 2,
          Price: ""
        },
        {
          priceName: "同行价(元)",
          currency: "",
          PriceType: 3,
          Price: ""
        },
        {
          priceName: "加盟结算价(元)",
          currency: "",
          PriceType: 4,
          Price: ""
        },
        {
          priceName: "直客销售价(元)",
          currency: "",
          PriceType: 5,
          Price: ""
        },
        {
          priceName: "内部价(元)",
          currency: "",
          PriceType: 6,
          Price: ""
        },
        {
          priceName: "团体价(元)",
          currency: "",
          PriceType: 7,
          Price: ""
        }
      ],
      StartDisableDate: {
        disabledDate: date => {
          return date.getTime() < Date.now();
        }
      },
      rules: {
        TotalNum: [{ required: true, message: "请输入票数", trigger: "blur" }],
        DateRange: [
          { required: true, validator: checkDateRange, trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.GetCurrency()
  },
  methods: {
    //获取币种
    GetCurrency(){
      this.ticketHttp.get('TicketProduct/GetCurrency').then(res=>{
        if(res.data.isSuccess == true){
          this.options = res.data.objects;
        }else{
          this.$message.error(res.data.message);
        }
      }).catch(e=>{
        console.log(e)
      })
    },
    savePriceForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.ticketHttp
            .post("TicketProduct/SaveTicketPrice", {
              ProductId: this.$route.query.productId,
              Dates:this.trip.tagData,
              TotalNum:this.priceForm.TotalNum,
              PriceList:this.PriceList
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                 this.loading = false;
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                 this.$router.push({ path: "/Tickets/singleTicketList" });
              }else{
                this.loading = false;
                 this.$message.error(res.data.message);
              }
            }).catch(e=>{
              this.loading = false;
              console.log(e)
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //当日期筛选类型变化时
    dateTypeChange() {
      if (this.trip.dateRange) {
        this.trip.tagData = [];
        this.tripDateChange(this.trip.dateRange);
      }
    },
    //当出发时间范围变化时
    tripDateChange(val) {
      if (!val) {
        this.trip.rangeAlldate = [];
        this.trip.tagData = [];
        return false;
      }
      let s = dateFmt(val[0], "yyyy-MM-dd"),
        e = dateFmt(val[1], "yyyy-MM-dd");
      let startTime = new Date(s),
        endTime = new Date(e),
        allDate = [];
      while (endTime.getTime() - startTime.getTime() >= 0) {
        let dateStr = dateFmt(startTime, "yyyy-MM-dd");
        allDate.push(dateStr);
        startTime.setDate(startTime.getDate() + 1);
      }
      this.trip.rangeAlldate = allDate;
      this.trip.tagData = allDate;
      switch (this.trip.DepartDateType) {
        case 1:
          this.tripWeekChange();
          break;
        case 2:
          this.apartDays();
          break;
        case 4:
          this.whenDays();
          break;
      }
    },
    //当星期几变化时,按周几计算
    tripWeekChange() {
      if (this.trip.rangeAlldate.length > 0) {
        this.trip.tagData = [];
        this.newTagData = [];
        this.trip.rangeAlldate.forEach(d => {
          let w = new Date(d).getDay();
          if (this.trip.week.indexOf(w) != -1) {
            this.trip.tagData.push(d);
          }
        });
      }
    },
    //按隔天计算
    apartDays() {
      if (this.trip.days !== "" && this.trip.rangeAlldate.length > 0) {
        this.trip.days = parseInt(this.trip.days);
        this.trip.tagData = [];
        this.newTagData = [];
        for (
          let i = 0;
          i < this.trip.rangeAlldate.length;
          i += this.trip.days + 1
        ) {
          this.trip.tagData.push(this.trip.rangeAlldate[i]);
        }
      }
    },
    //按逢天计算
    whenDays() {
      if (this.trip.days2 !== "" && this.trip.rangeAlldate.length > 0) {
        this.trip.days2 = parseInt(this.trip.days2);
        this.trip.tagData = [];
        this.newTagData = [];
        this.trip.rangeAlldate.forEach(item => {
          var day = item.slice(9);
          if (day.indexOf(this.trip.days2) != -1) {
            this.trip.tagData.push(item);
          }
        });
      }
    },
    //删除计算出的所有日期的某一项
    tripCloseTag(tag) {
      this.trip.tagData.splice(this.trip.tagData.indexOf(tag), 1);
    }
  }
};
</script>
