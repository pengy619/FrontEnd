<template>
  <div class="view">
    <el-button size="small" type="primary" >添加价格规则</el-button>
    <el-form :model="item" :rules="rules" ref="item" label-width="140px" class="demo-priceForm" size="small"
             v-for="(item,index) in priceForm">
      <el-form-item lable="">
        <span>价格规则</span>
        <el-button size="small" type="danger" class="margin_left_255">删除</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="3">
          <el-form-item label="批量设置库存价格" prop="name">
            每日可售
            <el-input v-model="item.name"></el-input>
            张，需提前
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" prop="name" label-width="0px">
            <el-input v-model="item.name"></el-input>
            天预订
          </el-form-item>
        </el-col>
      </el-row>
      <div class="type-date-box">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择日期" label-width="210px" prop="DateRange">
              <el-form-item>
                <el-date-picker v-model="item.trip.dateRange" @change="tripDateChange(item.trip.dateRange,index)"
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
              <el-radio-group v-model="item.trip.DepartDateType" @change="dateTypeChange(index)">
                <el-radio :label="0">天天销售</el-radio>
                <el-radio :label="1">按周销售</el-radio>
                <el-radio :label="2">按日期销售</el-radio>
                <el-radio :label="3">按天销售</el-radio>
                <el-radio :label="4">逢期销售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="item.trip.DepartDateType==1">
          <el-col :span="24">
            <el-form-item label="筛选" style="width: 100%;" label-width="180px">
              <el-checkbox-group v-model="item.trip.week" @change="tripWeekChange(index)">
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
        <el-row v-if="item.trip.DepartDateType==2">
          <el-col :span="24">
            <el-form-item label="每隔" label-width="180px">
              <el-input-number v-model="item.trip.days" :min="0" label=""></el-input-number>
              天
              <el-button type="primary" size="small" @click="apartDays(index)">计算</el-button>
            </el-form-item>
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="item.trip.DepartDateType==4">
          <el-col :span="24">
            <el-form-item label="逢" label-width="175px">
              <el-input-number v-model="item.trip.days2" :min="0" :max="9" label="0-9的数字"></el-input-number>
              出团
              <el-button type="primary" size="small" @click="whenDays(index)">计算</el-button>
              <span class="gray-text">（如：逢8开团，每月的8、18、28号开团）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="tagbox">
          <el-col :span="24">
            <el-tag
              v-for="tag in oldTagData"
              :key="tag"
              type="info"
              style="margin:5px"
            >
              {{tag}}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="tagbox">
          <el-col :span="24">
            <el-tag
              v-for="tag in item.trip.tagData"
              :key="tag"
              closable
              style="margin:5px"
              @close="tripCloseTag(tag)"
            >
              {{tag}}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="tagbox" v-show="oldTagData.length > 0">
          <el-col :span="24">
            <el-tag
              v-for="tag in newTagData"
              :key="tag"
              type="danger"
              style="margin:5px"
            >
              {{tag}}
            </el-tag>
          </el-col>
        </el-row>
      </div>
      <el-table :data="item.PriceList" border style="width: 80%" size="small">
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
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-footer>
      <el-button type="primary" @click="submitForm('priceForm')" size="small">保存</el-button>
    </el-footer>
  </div>
</template>
<style lang="scss" scoped>
  .el-col.el-col-3 {
    width: 375px;
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
  .margin_left_255{
    margin-left: 255px;
  }
</style>
<script>
  import {dateFmt} from '@/utils/tools'
  export default {
    data() {
      return {
        oldTagData: [],
        newTagData: [],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }],
        priceForm: [
          {
            name: '',
            trip: {
              DepartDateType: 0,
              dateRange: '',
              rangeAlldate: [],
              tagData: [],
              week: [1, 2, 3, 4, 5, 6, 0],
              days: 0,
              dyas2: 0,
              GoBackTime: "",
            },
            PriceList: [
              {
                priceName: "来价",
                currency: "",
                PriceType: 1,
                Price: "",
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
              },
              {
                priceName: "窗口价(元)",
                currency: "",
                PriceType: 8,
                Price: ""
              }
            ]
          },
          {
            name: '',
            trip: {
              DepartDateType: 0,
              dateRange: '',
              rangeAlldate: [],
              tagData: [],
              week: [1, 2, 3, 4, 5, 6, 0],
              days: 0,
              dyas2: 0,
              GoBackTime: "",
            }
          }
        ],
        StartDisableDate: {
          disabledDate: (date) => {
            return date.getTime() < Date.now();
          }
        },
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        }
      };
    },
    mounted(){
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //当日期筛选类型变化时
      dateTypeChange(index){
        if (this.priceForm[index].trip.dateRange) {
          this.priceForm[index].trip.tagData = []
          this.tripDateChange(this.priceForm[index].trip.dateRange, index)
        }
      },
      //当出发时间范围变化时
      tripDateChange(val, index){
        if (!val) {
          this.priceForm[index].trip.rangeAlldate = []
          this.priceForm[index].trip.tagData = []
          return false
        }
        this.newTagData = [];
        let s = dateFmt(val[0], 'yyyy-MM-dd'), e = dateFmt(val[1], 'yyyy-MM-dd')
        let startTime = new Date(s), endTime = new Date(e), allDate = []
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          let dateStr = dateFmt(startTime, 'yyyy-MM-dd')
          allDate.push(dateStr)
          startTime.setDate(startTime.getDate() + 1);
        }
        this.priceForm[index].trip.rangeAlldate = allDate
        this.priceForm[index].trip.tagData = allDate
        this.priceForm[index].trip.tagData.forEach((item, index) => {
          if (this.oldTagData.indexOf(item) == -1) {
            this.newTagData.push(item)
          }
        })
        switch (this.priceForm[index].trip.DepartDateType) {
          case 1:
            this.tripWeekChange(index)
            break;
          case 2:
            this.apartDays(index)
            break;
          case 4:
            this.whenDays(index)
            break;
        }
      },
      //当星期几变化时,按周几计算
      tripWeekChange(index){
        if (this.priceForm[index].trip.rangeAlldate.length > 0) {
          this.priceForm[index].trip.tagData = []
          this.newTagData = []
          this.priceForm[index].trip.rangeAlldate.forEach((d) => {
            let w = new Date(d).getDay()
            if (this.priceForm[index].trip.week.indexOf(w) != -1) {
              this.priceForm[index].trip.tagData.push(d)
            }
          })
          this.priceForm[index].trip.tagData.forEach((item, index) => {
            if (this.oldTagData.indexOf(item) == -1) {
              this.newTagData.push(item)
            }
          })
        }
      },
      //按隔天计算
      apartDays(index){
        if (this.priceForm[index].trip.days !== '' && this.priceForm[index].trip.rangeAlldate.length > 0) {
          this.priceForm[index].trip.days = parseInt(this.priceForm[index].trip.days)
          this.priceForm[index].trip.tagData = []
          this.newTagData = []
          for (let i = 0; i < this.priceForm[index].trip.rangeAlldate.length; i += this.priceForm[index].trip.days + 1) {
            this.priceForm[index].trip.tagData.push(this.priceForm[index].trip.rangeAlldate[i])
          }
          this.priceForm[index].trip.tagData.forEach((item, index) => {
            if (this.oldTagData.indexOf(item) == -1) {
              this.newTagData.push(item)
            }
          })
        }
      },
      //按逢天计算
      whenDays(index){
        if (this.priceForm[index].trip.days2 !== '' && this.priceForm[index].trip.rangeAlldate.length > 0) {
          this.priceForm[index].trip.days2 = parseInt(this.priceForm[index].trip.days2)
          this.priceForm[index].trip.tagData = []
          this.newTagData = []
          this.priceForm[index].trip.rangeAlldate.forEach((item) => {
            var day = item.slice(9)
            if (day.indexOf(this.priceForm[index].trip.days2) != -1) {
              this.priceForm[index].trip.tagData.push(item)
            }
          })
          this.priceForm[index].trip.tagData.forEach((item, index) => {
            if (this.oldTagData.indexOf(item) == -1) {
              this.newTagData.push(item)
            }
          })
        }
      },
    }
  }
</script>
