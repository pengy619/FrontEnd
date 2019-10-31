<template>
  <div class="view">
    <h4>开团信息：</h4>
    <el-form :model="groupForm" ref="groupForm" :rules="groupRules" label-width="150px" class="demo-ruleForm" size="small">
      <p class="lmargin_75"><span>线路名称</span><span class="lmargin_20">{{groupForm.LineName}}</span></p>
      <!--<el-form-item label="出团前" prop="SalesPreposeTime">
        <el-input v-model="groupForm.SalesPreposeTime" style="width:350px"></el-input> <span class="gray-text"> 天报名</span>
      </el-form-item>
      <el-form-item label="出团前" prop="SalesStopDays">
        <el-input v-model="groupForm.SalesStopDays" style="width:350px"></el-input>
        <span class="gray-text"> 天停售</span>
      </el-form-item>-->
      <el-form-item label="计划出团人数">
        <el-radio-group v-model="groupForm.GoDumpling" @change = "dumplingChange" >
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">自定义人数 </el-radio>
        </el-radio-group>
        <el-input type="text" v-model="groupForm.FoundNumberCount" :disabled = "groupForm.GoDumpling == 1 ? false : true" style='width:170px;'></el-input>
      </el-form-item>
      <el-form-item label="最低成团人数" prop="FoundNumberLess">
        <el-input v-model="groupForm.FoundNumberLess"  style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="紧急联系电话" prop="PhoneNumber">
        <el-input v-model="groupForm.PhoneNumber" style="width:350px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型" prop="AirlineType">
        <el-select v-model="groupForm.AirlineType" placeholder="请选择类型" @change="handleChangeAirlineType">
          <el-option label="国内" value="Domestic"></el-option>
          <el-option label="国外" value="International"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="目的地" prop="TargetCityName">
        <!-- <template v-if="!editAdress">
          <span>{{adress}}</span>
          <el-button size="mini" @click="editAdress=!editAdress">修改</el-button>
        </template> -->
        <el-input v-model="groupForm.TargetCityName" style="width:350px"></el-input>
        <!-- <address-select v-if="editAdress" ref="addressSelect" :data-type="groupForm.AirlineType" @result="addressResult" style="width:350px"></address-select> -->
      </el-form-item>
      <el-form-item label="出发-返回时间" prop='GoBackTime'>
        <el-time-picker
          is-range
          v-model="trip.GoBackTime"
          range-separator="至"
          start-placeholder="出发时间"
          end-placeholder="返回时间"
          placeholder="选择时间范围" class="time-range">
        </el-time-picker>
      </el-form-item>

      <el-form-item label="销售权限" prop='DistributionChannelIdList'>
        <el-checkbox-group
          v-model="groupForm.DistributionChannelIdList">
          <el-checkbox v-for="item in checkedList" :label="item.key" :key="item.key">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <!--<span v-show="checkedList.length==0">暂无数据</span>-->
      </el-form-item>
      <!-- <el-form-item label="佣金设置" >
        <el-row style="margin-bottom:10px;">
            <el-checkbox v-model="commission.isCommision">分部佣金</el-checkbox>
            <el-radio-group v-model="commission.CommisionType" v-if="commission.isCommision" class="margin_left">
              <el-radio :label="0" ><el-input-number :disabled="commission.CommisionType==1" :controls="false" v-model="commission.CommisionValue1" :min="0" :max="99999999"></el-input-number> 元/人</el-radio>
              <el-radio :label="1" ><el-input-number :disabled="commission.CommisionType==0" :controls="false" v-model="commission.CommisionValue2" :min="0" :max="99999999"></el-input-number> %/单</el-radio>
           </el-radio-group>
        </el-row>
        <el-row>
            <el-checkbox v-model="commission.isEncourage">销售激励</el-checkbox>
            <el-radio-group v-model="commission.EncourageType" v-if="commission.isEncourage" class="margin_left">
              <el-radio :label="0" ><el-input-number :disabled="commission.EncourageType==1" :controls="false" v-model="commission.EncourageValue1" :min="0" :max="99999999"></el-input-number> 元/人</el-radio>
              <el-radio :label="1" ><el-input-number :disabled="commission.EncourageType==0" :controls="false" v-model="commission.EncourageValue2" :min="0" :max="99999999"></el-input-number> %/单</el-radio>
           </el-radio-group>
        </el-row>
      </el-form-item> -->
      <!-- <el-form-item label="推广费" >
        <el-radio-group v-model="commission.CommisionType" @change="handleChangeCommisionType">
          <el-radio :label="2" ><el-input-number :disabled="commission.CommisionType!=2" :controls="false" v-model="commission.CommisionValue1" :min="0" :max="999999999"></el-input-number> 元/人</el-radio>
          <el-radio :label="1" ><el-input-number :disabled="commission.CommisionType!=1" :controls="false" v-model="commission.CommisionValue2" :min="0" :max="100"></el-input-number> %/单</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-row>
					<el-col :span="24">
						<el-form-item label="出发日期" style="width: 100%;">
							<el-radio-group v-model="trip.DepartDateType" @change="dateTypeChange">
								<el-radio :label="0">天天出发</el-radio>
								<el-radio :label="1">按周出发</el-radio>
								<el-radio :label="2">按日期出发</el-radio>
								<el-radio :label="3">按天出发</el-radio>
								<el-radio :label="4">逢期出发</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
        <div class="type-date-box">
					<el-row>
						<el-col :span="24">
							<el-form-item label="选择日期" label-width="140px"  prop="DateRange">
								<el-form-item >
									<el-date-picker v-model="trip.dateRange" @change="tripDateChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="StartDisableDate">
									</el-date-picker>
								</el-form-item>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="trip.DepartDateType==1">
						<el-col :span="24">
							<el-form-item label="筛选" style="width: 100%;">
								<el-checkbox-group v-model="trip.week" @change="tripWeekChange">
									<el-checkbox :label="1">周一</el-checkbox>
									<el-checkbox :label="2">周二</el-checkbox>
									<el-checkbox :label="3">周三</el-checkbox>
									<el-checkbox :label="4" >周四</el-checkbox>
									<el-checkbox :label="5" >周五</el-checkbox>
									<el-checkbox :label="6" >周六</el-checkbox>
									<el-checkbox :label="0" >周日</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="trip.DepartDateType==2">
						<el-col :span="24">
							<el-form-item label="每隔">
								<el-input-number v-model="trip.days" :min="0" label=""></el-input-number> 天 <el-button type="primary" size="small" @click="apartDays()">计算</el-button>
							</el-form-item>
							<el-form-item>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="trip.DepartDateType==4">
          <el-col :span="24">
            <el-form-item label="逢" >
              <el-input-number v-model="trip.days2" :min="0" :max="9" label="0-9的数字"></el-input-number> 出团 <el-button type="primary" size="small" @click="whenDays(type)">计算</el-button> 	<span class="gray-text">（如：逢8开团，每月的8、18、28号开团）</span>
            </el-form-item>
          </el-col>
        </el-row>
          <el-row class="tagbox">
            <el-col :span="24" >
              <el-tag
                v-for="tag in oldTagData"
                :key="tag" closable
                type="info"
                style="margin:5px"
							@close="tripCloseTag(tag,'old')"
              >
                {{tag}}
              </el-tag>
            </el-col>
          </el-row>
            <el-row class="tagbox">
						<el-col :span="24">
							<el-tag
							v-for="tag in trip.tagData"
							:key="tag"
							closable
							style="margin:5px"
							@close="tripCloseTag(tag,'new')"
							>
							{{tag}}
							</el-tag>
						</el-col>
					</el-row>
          <el-row class="tagbox" v-show="oldTagData.length > 0">
            <el-col :span="24" >
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
    </el-form>
    <el-footer class="c_text">
      <el-button type="primary" @click="onSubmit('groupForm')" size="small" :loading='btn_loading1' :disabled="disabled1">保存</el-button>
      <el-button type="primary" @click="onSubmit('groupForm','jump')" size="small" :loading = 'btn_loading2' :disabled="disabled2">保存并设置多出发地</el-button>
      <el-button  size="small" @click="goBack">返回</el-button>
    </el-footer>
  </div>
</template>
<style lang="scss" scoped>

  .lmargin_20 {
    margin-left: 20px;
  }

  .lmargin_75 {
    margin-left: 75px;
  }

  .c_text {
    text-align: center;
    margin-top: 20px;
  }

  .width_textarea {
    width: 500px;
  }

  .width_200px {
    width: 200px;
  }
  .r_margin{
    margin-right: 10px;
  }
  .type-date-box {
  border: 1px dashed #ddd;
  padding: 10px;
}
.type-date-box .tagbox{
  padding: 0 50px
}
  .text_center{
    width: 140px;
    text-align: center;
  }
</style>
<script>
  import addressSelect from '@/components/address-select/index'
  import　{dateFmt}　from　'@/utils/tools'
  export default{
    components:{addressSelect},
    data(){
      var checkInt = (rule,value,callback) => {
        if(!value && value!=0){
          callback(new Error('输入内容不能为空'));
        }else if(!/^[^ ]+$/.test(value)){
          callback(new Error('输入内容不能含有空格'));
        //}else if(toString(this.groupForm.SalesPreposeTime).indexOf('.') >0 || !Number.isInteger(Number(this.groupForm.SalesPreposeTime)) || this.groupForm.SalesPreposeTime < 0){
        //  callback(new Error('只能输入正整数'));
        }else{
          callback()
        }
      }
      var checkPhone = (rule,value,callback) => {
        if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))){
          callback(new Error('手机号码不正确'))
        }else{
          callback()
        }
      }
      var checkGoTime = (rule,value,callback) => {
          if(this.groupForm.GoHours == '' || this.groupForm.GoMinutes == ''){
            callback(new Error('您还没有选择完整的出发时间'))
          }else{
            callback()
          }
      }

      var checkBackTime = (rule,value,callback) => {
          if(this.groupForm.BackHours == '' || this.groupForm.BackHours == ''){
            callback(new Error('您还没有选择完整的返回时间'))
          }else{
            callback()
          }
      }
       var checkGoBackTime = (rule,value,callback) => {
          if(this.trip.GoBackTime === ''){
            callback(new Error('您还没有选择出发和返回时间'))
          }else{
            callback()
          }
      }
      var checkDateRange= (rule,value,callback) => {
          if(this.oldTagData.length == 0){
            if(!this.trip.dateRange){
              callback(new Error('您还没有选择出发日期'))
            }else{
              callback()
            }
          }else{
            callback()
          }
      }
      var checkFoundNumberCount = (rule,value,callback) => {
        if(!this.groupForm.FoundNumberCount){
          callback(new Error('人数不能为空'));
        }else if(!/^[^ ]+$/.test(this.groupForm.FoundNumberCount)){
          callback(new Error('人数不能含有空格'));
        }else if(this.groupForm.FoundNumberCount.indexOf('.') >0 || !Number.isInteger(Number(this.groupForm.FoundNumberCount)) || this.groupForm.FoundNumberCount < 1){
          callback(new Error('计划出团人数必须为正整数'));
        }else{
          callback()
        }
      }
      return {
        btn_loading1 :false,
        btn_loading2 :false,
        disabled1:false,
        disabled2:false,
        currentPage: 1,
        checkedList: [],
        data:'',
        adress:'',
        editAdress:false,
        oldTagData:[],
        newTagData:[],
        radioList: [
          {key: 1, value: '每周一'},
          {key: 2, value: '每周二'},
          {key: 3, value: '每周三'},
          {key: 4, value: '每周四'},
          {key: 5, value: '每周伍'},
          {key: 6, value: '每周六'},
          {key: 7, value: '每周日'},
        ],
        StartDisableDate:{
            disabledDate:(date)=>{
              return date.getTime() < Date.now();
            }
        },
        //小包子留下的痕迹
        trip:{
          DepartDateType:0,
          dateRange:'',
          rangeAlldate:[],
          tagData:[],
          week:[1,2,3,4,5,6,0],
          days:0,
          dyas2:0,
          GoBackTime:"",
        },
        commission:{
          isCommision:false,
          isEncourage:false,
          CommisionType:'',
          CommisionValue:0,
          CommisionValue1:0,
          CommisionValue2:0,
          EncourageType:0,
          EncourageValue:0,
          EncourageValue1:0,
          EncourageValue2:0,
        },
        groupForm: {
          LineId:this.$route.query.lineId,
          LineName: this.$route.query.fullName,
          //SalesPreposeTime:'',
          //SalesStopDays: '',
          GoDumpling:'0',
          FoundNumberCount: '',
          FoundNumberLess: '',
          PhoneNumber:'',
          // AirlineType:'',
          TargetCityId:0,
          TargetCityName: '',
          GoHours: '',
          GoMinutes: '',
          BackHours: '',
          BackMinutes: '',
          DistributionChannelIdList: [],

        },
        dialogFormVisible: false,
        groupTimeForm: {
          DateFrom: '',
          DateTo: '',
          RuleType:"1",
          IntValue:null,
          Value:[],
        },
        formLabelWidth: '80px',
        groupRules:{
          //SalesPreposeTime:[
          //  {required: true,validator:checkInt, trigger: 'blur'}
          //],
          //SalesStopDays: [
          //  { required: true, validator: checkInt, trigger: 'blur' }
          //],
          FoundNumberCount:[
            {required:true,validator:checkFoundNumberCount, trigger: 'blur'}
          ],
          FoundNumberLess:[
            {required: true,validator:checkInt, trigger: 'blur'}
          ],
          PhoneNumber:[
            {required: true,validator:checkPhone, trigger: 'blur'}
          ],
          TargetCityName:[
            {required: true,message:'请选择目的地', trigger: 'change'}
          ],
          GoTime:[
            {required: true,validator:checkGoTime, trigger: 'blur'}
          ],
          BackTime:[
            {required: true,validator:checkBackTime, trigger: 'blur'}
          ],
//          GoBackTime:[
//            {required: true,validator:checkGoBackTime, trigger: 'change'}
//          ],
          DateRange:[
            {required: true,validator:checkDateRange, trigger: 'change'}
          ],
          DistributionChannelIdList:[
            {type:'array',required: true, message: '请至少选择一种销售权限', trigger: 'change'}
          ],
         
        }
      }
    },
    mounted(){
      this.channelList();
      this.getGroupLinePlan();
    },
    methods: {
      handleChangeCommisionType(val){
        if(val==1){
          this.commission.CommisionValue1=''
        }else if(val==2){
          this.commission.CommisionValue2=''
        }
      },
      // handleChangeAirlineType(){
      //   this.editAdress=true;
      //   this.groupForm.TargetCityId = ''
      //   this.groupForm.TargetCityName = ''
      //   this.$refs.addressSelect.reset()
      // },
      getGroupLinePlan(){
        this.groupHttp.get('/GroupLine/GetGroupLinePlan?lineId='+this.groupForm.LineId).then(res=>{
            if(res.data.isSuccess == true){
              this.groupForm.PhoneNumber = res.data.dto.phoneNumber
              this.groupForm.FoundNumberCount = res.data.dto.foundNumberCount
              this.groupForm.FoundNumberLess = res.data.dto.foundNumberLess
              //this.groupForm.SalesStopDays = res.data.dto.salesStopDays
              //this.groupForm.SalesPreposeTime = res.data.dto.salesPreposeTime;
              this.groupForm.GoDumpling = res.data.dto.goDumpling;
              // this.groupForm.AirlineType=res.data.dto.airlineType||'Domestic';
              if(res.data.dto.distributionChannel == null){
              }else{
                this.groupForm.DistributionChannelIdList = res.data.dto.distributionChannel.split(',');
              }
              // if(res.data.dto.targetCityName!=null){
              //   this.editAdress = false;
              //   this.adress = res.data.dto.targetCityName
              // }else{
              //   this.editAdress = true;
              // }
              if(res.data.dto.commisionType){
                this.commission.CommisionType=res.data.dto.commisionType;
                if(this.commission.CommisionType==2){
                  this.commission.CommisionValue1=res.data.dto.commisionValue;
                }else if(this.commission.CommisionType==1){
                  this.commission.CommisionValue2=res.data.dto.commisionValue;
                }
              }
              
              let goHours = res.data.dto.goHours
              let goMinutes = res.data.dto.goMinutes
              let backHours = res.data.dto.backHours
              let backMinutes = res.data.dto.backMinutes
              // this.groupForm.TargetCityId = res.data.dto.targetCityId
              this.groupForm.TargetCityName = res.data.dto.targetCityName
              if(res.data.dto.lineDateList.length > 0){
                this.oldTagData = res.data.dto.lineDateList
                this.oldTagData.forEach((item,index)=>{
                    let date =  new Date(item)
                    this.oldTagData[index] = dateFmt(date,'yyyy-MM-dd');
                })

              }
              if(goHours !=null && goMinutes!=null && backHours!=null && backMinutes!=null){
                this.trip.GoBackTime = [new Date(0,0,0,goHours,goMinutes), new Date(0,0,0,backHours,backMinutes)]
              }
            }
        })
      },
      dumplingChange(){
        if(this.groupForm.GoDumpling=='0'){
          this.groupForm.FoundNumberCount = '';
        }
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      channelList(){
        this.groupHttp.post('/GroupLine/GetDistributionChannelList').then((res) => {
          this.checkedList = res.data.keyValueList
        }).catch((e) => {
          console.log(e)
        })
      },
      goBack(){
        this.$router.go(-1)
      },
      handleClick(tab, event) {
        console.log(tab)
      },
      onSubmit(formName,type){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(type == 'jump'){
                this.btn_loading2 = true;
                this.disabled1 = true;
              }else{
                this.btn_loading1 = true;
                this.disabled2 = true;
              }
            this.beforeSubmit();
            this.groupHttp.post('/GroupLine/SaveGroupLinePlan',{
              Dto:this.groupForm,
              PlanDateRuleDto:this.groupTimeForm,
              CommisionType:this.commission.CommisionType,
              CommisionValue:this.commission.CommisionValue,
              EncourageType:this.commission.EncourageType,
              EncourageValue:this.commission.EncourageValue,
            }).then(res=>{
              if(res.data.isSuccess == true){
                  this.$message({
                    type:'success',
                    message:'保存成功'
                  })
                  if(type == 'jump'){
                    this.btn_loading2 = false;
                    setTimeout(()=>{
                        this.$router.push({path:'/grouptour/PlaceOfDeparture',query:{lineId:this.$route.query.lineId}})
                    },500)
                  }else {
                    this.btn_loading1 = false;
                    setTimeout(()=>{
                      this.$router.push({path:'/grouptour/RouteTable'})
                    },500)
                  }
              }else{
                  this.$message.error('保存失败：'+ res.data.message);
                  setTimeout(()=>{
                      this.btn_loading = false;
                  },500)
              }
            }).catch(e=>{

            })
          }
        })
      },
      // addressResult(val){
      //   this.groupForm.TargetCityName = val.second.name;
      //   this.groupForm.TargetCityId = val.second.id
      // },
      //数组去重
      arrUnique(arr){
        let x=new Set(arr);
        return [...x]
      },
      //小包子留个痕迹
      //提交前处理特殊字段
      beforeSubmit(){
        let arr=[];
        arr=arr.concat(this.oldTagData,this.newTagData);
        arr.sort();
        this.groupTimeForm.Value = arr
        if(this.trip.GoBackTime){
          this.groupForm.GoHours=dateFmt(this.trip.GoBackTime[0],'hh')
          this.groupForm.GoMinutes=dateFmt(this.trip.GoBackTime[0],'mm')
          this.groupForm.BackHours=dateFmt(this.trip.GoBackTime[1],'hh')
          this.groupForm.BackMinutes=dateFmt(this.trip.GoBackTime[1],'mm')
        }
        this.groupTimeForm.RuleType=this.trip.DepartDateType
        this.groupTimeForm.DateFrom=this.trip.dateRange[0]
        this.groupTimeForm.DateTo=this.trip.dateRange[1]
        // if(this.newTagData.length == 0){
        //   if(this.trip.tagData.length == 0){
        //     this.groupTimeForm.Value = this.oldTagData
        //   }else{
        //     this.groupTimeForm.Value=this.trip.tagData
        //   }
        // }else{
        //   this.groupTimeForm.Value=this.newTagData
        // }
        if(this.commission.CommisionType==2){
          this.commission.CommisionValue=this.commission.CommisionValue1;
        }else if(this.commission.CommisionType==1){
          this.commission.CommisionValue=this.commission.CommisionValue2;
        }
        if(this.commission.EncourageType==0){
          this.commission.EncourageValue=this.commission.EncourageValue1;
        }else{
          this.commission.EncourageValue=this.commission.EncourageValue2;
        }

      },
      //当日期筛选类型变化时
      dateTypeChange(){
        if(this.trip.dateRange){
          this.trip.tagData=[]
          this.tripDateChange(this.trip.dateRange)
        }
      },
      //当出发时间范围变化时
      tripDateChange(val){
        if(!val){
          this.trip.rangeAlldate=[]
          this.trip.tagData=[]
          return false
        }
        this.newTagData=[];
        let s=dateFmt(val[0],'yyyy-MM-dd'),e=dateFmt(val[1],'yyyy-MM-dd')
        let startTime=new Date(s),endTime=new Date(e),allDate=[]
        while((endTime.getTime()-startTime.getTime())>=0){
          let dateStr=dateFmt(startTime,'yyyy-MM-dd')
          allDate.push(dateStr)
          startTime.setDate(startTime.getDate()+1);
        }
        this.trip.rangeAlldate=allDate
        this.trip.tagData=allDate
        this.trip.tagData.forEach((item,index)=>{
           if(this.oldTagData.indexOf(item) == -1){
               this.newTagData.push(item)
           }
        })
        switch(this.trip.DepartDateType)
          {
          case 1:
            this.tripWeekChange()
          break;
          case 2:
            this.apartDays()
          break;
          case 4:
            this.whenDays()
          break;
          }
      },
      //当星期几变化时,按周几计算
      tripWeekChange(){
        if(this.trip.rangeAlldate.length>0){
          this.trip.tagData=[]
          this.newTagData=[]
          this.trip.rangeAlldate.forEach((d)=>{
            let w=new Date(d).getDay()
            if(this.trip.week.indexOf(w)!=-1){
              this.trip.tagData.push(d)
            }
          })
          this.trip.tagData.forEach((item,index)=>{
            if(this.oldTagData.indexOf(item) == -1){
              this.newTagData.push(item)
            }
          })
        }
      },
      //按隔天计算
      apartDays(){
        if(this.trip.days!==''&&this.trip.rangeAlldate.length>0){
          this.trip.days=parseInt(this.trip.days)
          this.trip.tagData=[]
          this.newTagData = []
          for(let i=0;i<this.trip.rangeAlldate.length;i+=this.trip.days+1){
            this.trip.tagData.push(this.trip.rangeAlldate[i])
          }
          this.trip.tagData.forEach((item,index)=>{
            if(this.oldTagData.indexOf(item) == -1){
              this.newTagData.push(item)
            }
          })
        }
      },
      //按逢天计算
		whenDays(){
			if(this.trip.days2!==''&&this.trip.rangeAlldate.length>0){
				this.trip.days2=parseInt(this.trip.days2)
				this.trip.tagData=[]
        this.newTagData = []
				this.trip.rangeAlldate.forEach((item)=>{
					var day=item.slice(9)
					if(day.indexOf(this.trip.days2)!=-1){
						this.trip.tagData.push(item)
					}
				})
        this.trip.tagData.forEach((item,index)=>{
          if(this.oldTagData.indexOf(item) == -1){
            this.newTagData.push(item)
          }
        })
			}
		},
		//删除计算出的所有日期的某一项
		tripCloseTag(tag,type){
      if(type=='new'){
        this.trip.tagData.splice(this.trip.tagData.indexOf(tag), 1);
        this.newTagData.forEach((item,index)=>{
            if(item == tag){
              this.newTagData.splice(this.newTagData.indexOf(tag), 1);
            }
        })
      }else if(type=='old'){
        this.oldTagData.splice(this.oldTagData.indexOf(tag), 1);
        this.newTagData.forEach((item,index)=>{
            if(item == tag){
              this.newTagData.splice(this.newTagData.indexOf(tag), 1);
            }
        })
      }
			
		},
    }

  }
</script>
