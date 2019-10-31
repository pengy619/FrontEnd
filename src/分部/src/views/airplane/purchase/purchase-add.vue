<template>
	<div class="view">

		<el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="80px" class="demo-form-inline" size="small">
			<el-row>
				<el-col :span="24">
					<el-form-item label="航班类型" style="width: 100%;">
						<el-radio-group v-model="form.FlightType" @change="flightTypeChange">
							<el-radio :label="0" >国内</el-radio>
							<el-radio :label="1" >国际 · 港澳台</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">
					<el-form-item label="航线" prop="AirRoute">
						<el-input v-model="form.AirRoute" placeholder="航线"  :maxlength="20"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="航空公司" prop="AirlineId">
						<el-select v-model="form.AirlineId"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词搜索"
						:remote-method="companySearchMethod"
						:loading="basicInfo.airCompany.loading"
						>
							<el-option
							v-for="item in basicInfo.airCompany.data"
							:key="item.id"
							:label="item.name"
							:value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">
					<el-form-item label="开航日期" prop="StartTime">
						<el-date-picker v-model="form.StartTime" type="date" placeholder="选择日期" :picker-options="startAndEnd.pickerBegin">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="停航日期"  prop="EndTime">
						<el-date-picker v-model="form.EndTime" :disabled="startAndEnd.disableEnd" type="date" placeholder="选择日期" :picker-options="startAndEnd.pickerEnd">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">
					<el-form-item label="航程类型" prop="VoyageType">
						<el-select v-model="form.VoyageType" placeholder="请选择" @change="voyageTypeChange">
							<el-option label="往返" :value="1" ></el-option>
							<el-option label="单程" :value="0"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="机型" prop="PlaneId">
						<el-select v-model="form.PlaneId" filterable  placeholder="请选择" @change="planeModelChange">
							<el-option v-for="(item,index) in basicInfo.airModel.data" :label="item.planeModelName" :value="item.id" :key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="座位数" prop="Quantity">
						<el-input v-model="form.Quantity" placeholder="" :maxlength="20"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">
					<el-form-item label="出发地" prop="DepartProvinceId">
						<el-select v-model="form.DepartProvinceId" filterable remote
						reserve-keyword
						:remote-method="departProvinceSearch"
    					:loading="basicInfo.citys.loading"
     					placeholder="请选择" @change="departProvinceChange">
							<el-option v-for="(item,index) in basicInfo.citys.data" :label="item.name" :value="item.id" :key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="目的地" prop="ArriveProvinceId">
						<el-select v-model="form.ArriveProvinceId" filterable remote
						reserve-keyword
						:remote-method="arriveProvinceSearch"
    					:loading="basicInfo.citys.loading"
						 placeholder="请选择"  @change="arriveProvinceChange">
							<el-option v-for="(item,index) in basicInfo.citys.data" :label="item.name" :value="item.id" :key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="行程天数" prop="NumberOfDays">
						<el-input v-model="form.NumberOfDays" placeholder="" :maxlength="20"></el-input>
					</el-form-item>
				</el-col>
			</el-row>


			<div class="air-info-box" v-for="(trip,type,index) in form.AirTicketFlightInfos" v-bind:key="index">
				<el-alert v-if="type==0" :title="'① 去程：'+ form.DepartProvinceName+' → '+form.ArriveProvinceName" type="success" :closable="false" style="margin-bottom: 20px;">
				</el-alert>
				<el-alert v-if="type==1" :title="'① 返程：'+ form.ArriveProvinceName+' → '+form.DepartProvinceName" type="success" :closable="false" style="margin-bottom: 20px;">
				</el-alert>
				<el-row>
					<el-col :span="7">
						<el-form-item label="航班号" :prop="'FlightNo'+(type+1)">
							<el-input v-model="trip.FlightNo" placeholder="" :maxlength="20"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="起飞机场" :prop="'DepartAirport'+(type+1)">
							<el-select v-model="trip.DepartAirportId" filterable placeholder="请选择">
								<el-option v-for="item in tripBox.boxData[type].airPort1" :key="item.value" :label="item.text" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="到达机场" :prop="'ArriveAirport'+(type+1)">
							<el-select v-model="trip.ArriveAirportId" filterable placeholder="请选择">
								<el-option v-for="item in tripBox.boxData[type].airPort2" :key="item.value" :label="item.text" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="起飞时间"  :prop="'DepartTime'+(type+1)">
							<el-time-picker
								v-model="trip.DepartTime"
								:picker-options="{
								selectableRange: '00:00:00 - 23:59:00',
								format:'HH:mm'
								}"
								placeholder="任意起飞时间" @change="airTimeStart(type)">
							</el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="到达时间" :prop="'ArriveTime'+(type+1)">
							<el-time-picker v-model="trip.ArriveTime"
								:picker-options="{
								selectableRange: '00:00:00 - 23:59:00',
								format:'HH:mm'
								}"
							 placeholder="选择到达时间" @change="airTimeEnd(type)">
							</el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item label="飞行间隔天数" :required="true" class="flight-days">
							<el-col :span="20">
								<el-form-item :prop="'ArriveDays'+(type+1)">
									<el-input  @blur="airArriveDays(type)" v-model="trip.ArriveDays"  placeholder="" class="air-time"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4" style="text-align: center;">
								天
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="飞行时长" :required="true">
							<div style="width: 200px;">
								<el-col :span="9">
									<el-form-item :prop="'FlightDurationHours'+(type+1)">
										<el-input-number :disabled="true" style="width:65px" :controls="false" v-model="trip.FlightDurationHours" :min="0" placeholder="" class="air-time"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="3" style="text-align: center;">
									时
								</el-col>
								<el-col :span="9">
									<el-form-item :prop="'FlightDurationMinutes'+(type+1)">
										<el-input-number :disabled="true" style="width:65px" :controls="false" v-model="trip.FlightDurationMinutes" :min="0" :max="60" placeholder="" class="air-time"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="3" style="text-align: center;">
									分
								</el-col>
							</div>

						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="出发日期" style="width: 100%;">
							<el-radio-group v-if="type==0" v-model="trip.DepartDateType" @change="goDepartDateTypeChange">
								<el-radio :label="0">天天出发</el-radio>
								<el-radio :label="1">按周出发</el-radio>
								<el-radio :label="2">按日期出发</el-radio>
								<el-radio :label="3">按天出发</el-radio>
								<el-radio :label="4">逢期出发</el-radio>
							</el-radio-group>
							<el-radio-group v-if="type==1" v-model="trip.DepartDateType" @change="backDepartDateTypeChange">
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
							<el-form-item label="选择日期" :required="true" v-if="type==0">
								<el-form-item :prop="'DateRange'+(type+1)" >
									<el-date-picker v-model="tripBox.boxData[type].dateRnage" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="goTripDateChange">
									</el-date-picker>
								</el-form-item>
							</el-form-item>
							<el-form-item label="选择日期" :required="true" v-if="type==1">
								<el-form-item :prop="'DateRange'+(type+1)" >
								<el-date-picker v-model="tripBox.boxData[type].dateRnage" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="backTripDateChange">
								</el-date-picker>
								</el-form-item>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="trip.DepartDateType==1">
						<el-col :span="24">
							<el-form-item label="筛选" style="width: 100%;">
								<el-checkbox-group v-if="type==0" v-model="tripBox.boxData[type].week" @change="goTripWeekChange">
									<el-checkbox :label="1">周一</el-checkbox>
									<el-checkbox :label="2">周二</el-checkbox>
									<el-checkbox :label="3">周三</el-checkbox>
									<el-checkbox :label="4" >周四</el-checkbox>
									<el-checkbox :label="5" >周五</el-checkbox>
									<el-checkbox :label="6" >周六</el-checkbox>
									<el-checkbox :label="0" >周日</el-checkbox>
								</el-checkbox-group>
								<el-checkbox-group v-if="type==1" v-model="tripBox.boxData[type].week" @change="backTripWeekChange">
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
								<el-input-number v-model="tripBox.boxData[type].days" :min="0" label=""></el-input-number>
							</el-form-item>
							<el-form-item>
								天
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="small" @click="apartDays(type)">计算</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="trip.DepartDateType==4">
						<el-col :span="24">
							<el-form-item label="逢">
								<el-input-number v-model="tripBox.boxData[type].days2" :min="0" :max="9" label="0-9的数字"></el-input-number>
							</el-form-item>
							<el-form-item>
								出团
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="small" @click="whenDays(type)">计算</el-button>
							</el-form-item>
							<el-form-item>
								<span style="color: #999;">（如：逢8开团，每月的8、18、28号开团）</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-tag
							v-for="tag in tripBox.boxData[type].tagData"
							:key="tag"
							closable
							style="margin:5px"
							@close="tripCloseTag(tag,type)"
							>
							{{tag}}
							</el-tag>

						</el-col>
					</el-row>
				</div>
			</div>


			<el-row>
				<el-col :span="24">
					<el-form-item label="舱位" prop="IsDifferentiateShoppingSpace">
							<el-radio-group v-model="form.IsDifferentiateShoppingSpace">
								<el-radio :label="1">区分舱位</el-radio>
								<el-radio :label="2">不区分舱位</el-radio>
							</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-show="form.IsDifferentiateShoppingSpace=='1'" class="margin">
						<el-table show-summary  :data="form.table" border style="width: 40%">
							<el-table-column prop="SpanceName" label="舱位名称">
								<template slot-scope="scope">
									<el-select size="small"  placeholder="请选择">
										<el-option v-for="item in spanceNames" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column  prop="Quantity" label="座位数">
								<template slot-scope="scope">
									<el-input-number size="small" :controls="false" v-model="form.Quantity" style="width:200px;"></el-input-number>
								</template>
							</el-table-column>
							<el-table-column  prop="" width="40px;">
								<template slot-scope="scope">
									<i v-if="scope.row.IsFirst" class="el-icon-circle-plus-outline" size="small" @click="addSeat"></i>
									<i v-else class="el-icon-circle-close-outline" ></i>
								</template>
							</el-table-column>
						</el-table>
				</el-col>
				<el-col :span="24" v-show="form.IsDifferentiateShoppingSpace=='2'" class="margin">
						<el-table :data="form.table" border style="width: 40%">
							<el-table-column prop="SpanceName" label="舱位名称">
								<template slot-scope="scope">
									<span>——</span>
								</template>
							</el-table-column>
							<el-table-column prop="Quantity" label="座位数">
								<template slot-scope="scope">
									<el-input-number :controls="false" v-model="form.Quantity" size="small" style="width:200px;"></el-input-number>
								</template>
							</el-table-column>
						</el-table>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="总成本" prop="TotalCost">
							<el-input-number :controls="false" :min="0" v-model="form.TotalCost" class="left-input" style="width: 200px;"></el-input-number>
						</el-form-item>
				</el-col>
				<el-col>
					<el-form-item label="飞行航班总次数" label-width="130px">
						<el-input-number v-model="form.FlightFrequency" :controls="false" size="small" style="width:60px;"></el-input-number>
						次 × 利用率
						<el-input-number v-model="form.UseRatio" :controls="false" size="small" style="width:60px;"></el-input-number>
						% = 保底飞行次数
						<el-input-number :disabled="true" v-model="form.MinFlightFrequency" :controls="false" size="small" style="width:60px;"></el-input-number>次
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="供应商" prop="SupplierName">
							<el-input v-model="form.SupplierName" style="width: 200px"></el-input>
						</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="采购日期" prop="ProcurementDate">
							<el-date-picker v-model="form.ProcurementDate" type="date" placeholder="选择日期" >
							</el-date-picker>
						</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="备注">
							<el-input type="textarea" v-model="form.Remark" style="width:600px"></el-input>
						</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item size="small">
							<el-button type="primary" @click="onSubmit" :loading="submitLoading" >确定</el-button>
							<el-button  @click="$router.go(-1)">返回</el-button>
						</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

    <script>
import　{dateFmt}　from　'@/utils/tools'
export default {
  	data() {
		let checkQuantity = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('请填写座位数'));
			}else if(isNaN(Number(value))){
				return callback(new Error('座位数必须填写数字'));
			}else if(Number(value)<0){
				return callback(new Error('座位数必须大于0'));
			}else if(value.toString().indexOf('.')>-1){
				return callback(new Error('座位数必须为整数'));
			}else{
				callback();
			}
		};
		let checkNumberOfDays = (rule, value, callback) => {
			if (value==='') {
				return callback(new Error('请填写行程天数'));
			}else if(isNaN(Number(value))){
				return callback(new Error('行程天数必须填写数字'));
			}else if(Number(value)<0){
				return callback(new Error('行程天数必须大于0'));
			}else if(value.toString().indexOf('.')>-1){
				return callback(new Error('行程天数必须为整数'));
			}else{
				callback();
			}
		};
		let checkFlightNo1 = (rule, value, callback) => {
			if (this.form.AirTicketFlightInfos[0].FlightNo === '') {
				return callback(new Error('请填写航班号'));
			}else{
				callback();
			}
		};
		let checkFlightNo2 = (rule, value, callback) => {
			if (this.form.AirTicketFlightInfos[1].FlightNo === '') {
				return callback(new Error('请填写航班号'));
			}else{
				callback();
			}
		};
		let checkDepartAirportId1 = (rule, value, callback) => {
			if (!this.form.AirTicketFlightInfos[0].DepartAirportId) {
				return callback(new Error('请选择起飞机场'));
			}else{
				callback();
			}
		};
		let checkDepartAirportId2 = (rule, value, callback) => {
			if (!this.form.AirTicketFlightInfos[1].DepartAirportId) {
				return callback(new Error('请选择起飞机场'));
			}else{
				callback();
			}
		};
		let checkArriveAirportId1 = (rule, value, callback) => {
			if (!this.form.AirTicketFlightInfos[0].ArriveAirportId) {
				return callback(new Error('请选择到达机场'));
			}else{
				callback();
			}
		};
		let checkArriveAirportId2 = (rule, value, callback) => {
			if (!this.form.AirTicketFlightInfos[1].ArriveAirportId) {
				return callback(new Error('请选择到达机场'));
			}else{
				callback();
			}
		};
		let checkDepartTime1 = (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[0].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[0].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[0].ArriveTime;
			if (!departTime) {
				return callback(new Error('请选择起飞时间'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改起飞时间'));
			}else{
				callback();
			}
		};
		let checkDepartTime2 = (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[1].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[1].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[1].ArriveTime;
			if (!departTime) {
				return callback(new Error('请选择起飞时间'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改起飞时间'));
			}else{
				callback();
			}
			// if (!this.form.AirTicketFlightInfos[1].DepartTime) {
			// 	return callback(new Error('请选择起飞时间'));
			// }else{
			// 	callback();
			// }
		};
		let checkArriveTime1 = (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[0].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[0].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[0].ArriveTime;
			if (!arriveTime) {
				return callback(new Error('请选择到达时间'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改到达时间'));
			}else{
				callback();
			}
			// if (!this.form.AirTicketFlightInfos[0].ArriveTime) {
			// 	return callback(new Error('请选择到达时间'));
			// }else{
			// 	callback();
			// }
		};
		let checkArriveTime2 = (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[1].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[1].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[1].ArriveTime;
			if (!arriveTime) {
				return callback(new Error('请选择到达时间'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改到达时间'));
			}else{
				callback();
			}
			// if (!this.form.AirTicketFlightInfos[1].ArriveTime) {
			// 	return callback(new Error('请选择到达时间'));
			// }else{
			// 	callback();
			// }
		};
		let  fligthHours1= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[0].FlightDurationHours
			if (v==='') {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else{
				callback();
			}
		};
		let  fligthHours2= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[1].FlightDurationHours
			if (v==='') {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else{
				callback();
			}
		};
		let  fligthMinutes1= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[0].FlightDurationMinutes
			if (v==='') {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else{
				callback();
			}
		};
		let  fligthMinutes2= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[1].FlightDurationMinutes
			if (v==='') {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else{
				callback();
			}
		};
		let  arriveDays1= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[0].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[0].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[0].ArriveTime;
			if (!v) {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改间隔天数'));
			}else{
				callback();
			}
		};
		let  arriveDays2= (rule, value, callback) => {
			var v=this.form.AirTicketFlightInfos[1].ArriveDays;
			var departTime=this.form.AirTicketFlightInfos[1].DepartTime;
			var arriveTime=this.form.AirTicketFlightInfos[1].ArriveTime;
			if (!v) {
				return callback(new Error('请填写'));
			}else if(isNaN(Number(v))){
				return callback(new Error('必须填写数字'));
			}else if(Number(v)<0){
				return callback(new Error('必须大于0'));
			}else if(v.toString().indexOf('.')>-1){
				return callback(new Error('必须为整数'));
			}else if(arriveTime&&departTime&&arriveTime<departTime&&v==0){
				return callback(new Error('起飞时间大于到达时间，请修改间隔天数'));
			}else{
				callback();
			}
		};

		let  dateRange1= (rule, value, callback) => {
			var v=this.tripBox.boxData[0].dateRnage
			if (!v) {
				return callback(new Error('请选择日期'));
			}else{
				callback();
			}
		};
		let  dateRange2= (rule, value, callback) => {
			var v=this.tripBox.boxData[1].dateRnage
			if (!v) {
				return callback(new Error('请选择日期'));
			}else{
				callback();
			}
		};
		return {
			form: {
				FlightType: 0,
				AirRoute:'',
				AirlineId:null,
				StartTime:'',
				EndTime:'',
				VoyageType:1,
				PlaneId:null,
				Quantity:null,
				DepartProvinceId:null,
				DepartProvinceName:'',
				ArriveProvinceId:null,
				ArriveProvinceName:'',
				NumberOfDays:'',
				AirTicketFlightInfos:[{
					SellType: 0,
					FlightNo: "",
					DepartTime: "",
					ArriveTime: "",
					FlightDurationHours: 0,
					FlightDurationMinutes: 0,
					DepartDateType: 0,
					DepartDate: "",
					StartDate: "",
					EndDate: "",
					DepartAirportId: null,
					ArriveAirportId: null,
					ArriveDays:null
				},{
					SellType: 1,
					FlightNo: "",
					DepartTime: "",
					ArriveTime: "",
					FlightDurationHours: 0,
					FlightDurationMinutes: 0,
					DepartDateType: 0,
					DepartDate: "",
					StartDate: "",
					EndDate: "",
					DepartAirportId: null,
					ArriveAirportId: null,
					ArriveDays:null
				}],
				TotalCost:'',
				SupplierName:'',
				ProcurementDate:'',
				Remark:'',
				IsDifferentiateShoppingSpace: 2,
				table:[{
					SeatName: '',
					Quantity: '',
					IsFirst:true,
				}],
				FlightFrequency: '',
				UseRatio: '',
				MinFlightFrequency: '',
			},

			value2:'',
			value3:'',
			rules:{
				AirRoute:[{
					required: true,
					message: '请输入航线',
					trigger: 'blur'
				}],
				AirlineId:[{
					required: true,
					type:'number',
					message: '请选择航空公司',
					trigger: 'change'
				}],
				StartTime:[{
					required: true,
					type:'date',
					message: '请选择开航日期',
					trigger: 'change'
				}],
				EndTime:[{
					required: true,
					type:'date',
					message: '请选择停航日期',
					trigger: 'change'
				}],
				VoyageType:[{
					type:'number',
					required: true,
					message: '请选择航程类型',
					trigger: 'change'
				}],
				PlaneId:[{
					required: true,
					type:'number',
					message: '请选择机型',
					trigger: 'change'
				}],
				Quantity:[{
					required: true,
					validator:checkQuantity,
					trigger: 'change'
				}],
				DepartProvinceId:[{
					required: true,
					type:'number',
					message: '请选择出发地',
					trigger: 'change'
				}],
				ArriveProvinceId:[{
					required: true,
					type:'number',
					message: '请选择目的地',
					trigger: 'change'
				}],
				NumberOfDays:[{
					required: true,
					validator:checkNumberOfDays,
					trigger: 'change'
				}],
				TotalCost:[{
					required: true,
					type:'number',
					message: '请输入总成本',
					trigger: 'blur'
				}],
				SupplierName:[{
					required: true,
					message: '请输入供应商',
					trigger: 'blur'
				}],
				ProcurementDate:[{
					required: true,
					type:'date',
					message: '请选择采购日期',
					trigger: 'change'
				}],
				FlightNo1:[{
					required: true,
					validator:checkFlightNo1,
					trigger: 'blur'
				}],
				FlightNo2:[{
					required: true,
					validator:checkFlightNo2,
					trigger: 'blur'
				}],
				DepartAirport1:[{
					required: true,
					validator:checkDepartAirportId1,
					trigger: 'change'
				}],
				DepartAirport2:[{
					required: true,
					validator:checkDepartAirportId2,
					trigger: 'change'
				}],
				ArriveAirport1:[{
					required: true,
					validator:checkArriveAirportId1,
					trigger: 'change'
				}],
				ArriveAirport2:[{
					required: true,
					validator:checkArriveAirportId2,
					trigger: 'change'
				}],
				DepartTime1:[{
					required: true,
					validator:checkDepartTime1,
					trigger: 'change'
				}],
				DepartTime2:[{
					required: true,
					validator:checkDepartTime2,
					trigger: 'change'
				}],
				ArriveTime1:[{
					required: true,
					validator:checkArriveTime1,
					trigger: 'change'
				}],
				ArriveTime2:[{
					required: true,
					validator:checkArriveTime2,
					trigger: 'change'
				}],
				FlightDurationHours1:[{
					required: true,
					validator:fligthHours1,
					trigger: 'blur'
				}],
				FlightDurationHours2:[{
					required: true,
					validator:fligthHours2,
					trigger: 'blur'
				}],
				FlightDurationMinutes1:[{
					required: true,
					validator:fligthMinutes1,
					trigger: 'blur'
				}],
				FlightDurationMinutes2:[{
					required: true,
					validator:fligthMinutes2,
					trigger: 'blur'
				}],
				DateRange1:[{
					validator:dateRange1,
					trigger: 'change'
				}],
				DateRange2:[{
					validator:dateRange2,
					trigger: 'change'
				}],
				ArriveDays1:[{
					required: true,
					validator:arriveDays1,
					trigger: 'blur'
				}],
				ArriveDays2:[{
					required: true,
					validator:arriveDays2,
					trigger: 'blur'
				}],
				IsDifferentiateShoppingSpace:[{
					required: true,
					message:"请选择是否区分舱位",
					trigger:'change'
				}],
				SpanceName:[{
					required: true,
				}]
			},
			formTemp:{
				SellType: 1,
				FlightNo: "",
				DepartTime: "",
				ArriveTime: "",
				FlightDurationHours: null,
				FlightDurationMinutes: null,
				DepartDateType: 0,
				DepartDate: "",
				StartDate: "",
				EndDate: "",
				DepartAirportId: '',
				ArriveAirportId: '',
				ArriveDays:null
			},
			basicInfo:{
				airCompany:{
					data:[],
					loading:false,
				},
				airModel:{
					data:[],
					loading:false,
				},
				citys:{
					data:[],
					loading:false,
				},
			},
			startAndEnd:{
				pickerBegin:{
					disabledDate:(time)=> {
						this.startAndEnd.disableEnd=false
						return time.getTime() < Date.now();
					}
				},
				pickerEnd:{
					disabledDate:(time)=> {
						let beginDateVal = this.form.StartTime;
						if (beginDateVal!='') {
							return time.getTime() < beginDateVal;
						}
					}
				},
				disableEnd:true,
			},
			rangeDate:{
				goTripRange:'',
				backTripRange:'',
			},
			tripBox: {
				boxData:[{
					dateRnage:'',
					week:[1,2,3,4,5,6,0],
					days:"",
					days2:"",
					airPort1:[],
					airPort2:[],
					rangeAlldate:[],
					tagData:[]
				},{
					dateRnage:'',
					week:[1,2,3,4,5,6,0],
					days:"",
					days2:"",
					airPort1:[],
					airPort2:[],
					rangeAlldate:[],
					tagData:[]
				}]
			},
			submitLoading:false,
			spanceNames: [],
		};
	  },
	  watch: {
		'form.StartTime':function(val){
			this.form.EndTime=''
		},
		'form.EndTime':function(val){
			if(this.form.StartTime!=''&&val!=''){
				let days  =  parseInt(Math.abs(this.form.EndTime  -  this.form.StartTime)  /  1000  /  60  /  60  /24)
				this.form.NumberOfDays=days
			}
		},
	  },
	  mounted () {
		  this.getAirCompany()
		  this.getAirModel()
		  this.getCitys()
		  this.getSeatNames()
	  },
	methods: {
		//获取所有航空公司
		getAirCompany(keyword){
			keyword=keyword||''
			this.airHttp.get('/api/airline/list?PageSize=10&PageIndex=1&Name=' + keyword)
			.then((res)=>{
				this.basicInfo.airCompany.data = res.data.objects
			})
		},
		//获取所有机型
		getAirModel(keyword){
			keyword=keyword||''
			this.airHttp.get('/api/Common/GetAirTicketPlaneModelListItem?id=0')
			.then((res)=>{
				this.basicInfo.airModel.data = res.data.objects
			})
		},
		//获取所选城市所有机场
		getAirPort(city,type){
			this.airHttp.get('/api/Common/GetAirportsListItem?CityId='+city)
			.then((res)=>{
				let airPort='airPort'+type
				this.tripBox.boxData[0][airPort] = res.data.objects
				if(type==1){
					this.tripBox.boxData[1]['airPort2'] = res.data.objects
				}
				if(type==2){
					this.tripBox.boxData[1]['airPort1'] = res.data.objects
				}

			})
		},
		//当机型选项变化时
		planeModelChange(val){
			this.basicInfo.airModel.data.forEach((item)=>{
				if(item.id==val){
					this.form.Quantity=item.planeSeat
				}
			})
		},
		//当切换航班类型时
		flightTypeChange(type){
			this.form.DepartProvinceId=null,
			this.form.ArriveProvinceId=null,
			this.getCitys(type)
		},
		//根据航班类型获取城市数据
		getCitys(type,keyword){
			type=type||this.form.FlightType
			keyword=keyword||''
			this.basicInfo.citys.loading=true
			this.basicInfo.citys.data=[]
			this.airHttp.get('/api/Common/GetCitys?flightType='+type+'&cityName='+keyword)
			.then((res)=>{
				this.basicInfo.citys.data = res.data.objects
				this.basicInfo.citys.loading=false
			})
		},
		//航空公司下拉搜索
		companySearchMethod(key){
			this.getAirCompany(key)
		},
		//出发地城市下拉搜索
		departProvinceSearch(key){
			this.getCitys(this.form.flightType,key)
		},
		//目的地城市下拉搜索
		arriveProvinceSearch(key){
			this.getCitys(this.form.flightType,key)
		},
		//出发地变化时
		departProvinceChange(id){
			if(this.form.VoyageType==0){
				this.form.AirTicketFlightInfos[0].DepartAirportId='';
			}else{
				this.form.AirTicketFlightInfos[0].DepartAirportId='';
				this.form.AirTicketFlightInfos[1].DepartAirportId='';
			}
			this.basicInfo.citys.data.forEach((item)=>{
				if(item.id==id){
					this.form.DepartProvinceName=item.name
				}
			})
			this.getAirPort(id,1)
		},
		//目的地变化时
		arriveProvinceChange(id){
			if(this.form.VoyageType==0){
				this.form.AirTicketFlightInfos[0].ArriveAirportId='';
			}else{
				this.form.AirTicketFlightInfos[0].ArriveAirportId='';
				this.form.AirTicketFlightInfos[1].ArriveAirportId='';
			}
			this.basicInfo.citys.data.forEach((item)=>{
				if(item.id==id){
					this.form.ArriveProvinceName=item.name
				}
			})
			this.getAirPort(id,2)
		},
		//航程类型变化时
		voyageTypeChange(type){
			if(type==0){
				this.form.AirTicketFlightInfos.splice(this.form.AirTicketFlightInfos.length-1,1)
			}else if(type==1){
				this.form.AirTicketFlightInfos.push(this.formTemp)
			}
		},
		//起飞时间变化时
		airTimeStart(type){
			let timeStart=this.form.AirTicketFlightInfos[type].DepartTime,
				timeEnd=this.form.AirTicketFlightInfos[type].ArriveTime,
				arriveDays=this.form.AirTicketFlightInfos[type].ArriveDays;
			if(timeStart!==''&&timeEnd!==''&&arriveDays!==''){
				let mins  =  parseInt(arriveDays*24*60+(timeEnd.getTime()  -  timeStart.getTime())  /  1000  /  60 )
				let hours = parseInt(Math.abs(mins/60))
				mins=Math.abs( mins % 60);
				this.form.AirTicketFlightInfos[type].FlightDurationHours=hours
				this.form.AirTicketFlightInfos[type].FlightDurationMinutes=mins
			}
		},
		//到达时间变化时
		airTimeEnd(type){
			let timeStart=this.form.AirTicketFlightInfos[type].DepartTime,
				timeEnd=this.form.AirTicketFlightInfos[type].ArriveTime,
				arriveDays=this.form.AirTicketFlightInfos[type].ArriveDays;
			if(timeStart!==''&&timeEnd!==''&&arriveDays!==''){
				let mins  =  parseInt(arriveDays*24*60+(timeEnd.getTime()  -  timeStart.getTime())  /  1000  /  60 )
				let hours = parseInt(Math.abs(mins/60))
				mins=Math.abs( mins % 60);
				this.form.AirTicketFlightInfos[type].FlightDurationHours=hours
				this.form.AirTicketFlightInfos[type].FlightDurationMinutes=mins
			}
		},
		airArriveDays(type){
			let timeStart=this.form.AirTicketFlightInfos[type].DepartTime,
				timeEnd=this.form.AirTicketFlightInfos[type].ArriveTime,
				arriveDays=this.form.AirTicketFlightInfos[type].ArriveDays;
			if(timeStart!==''&&timeEnd!==''&&arriveDays!==''){
				let mins  =  parseInt(arriveDays*24*60+(timeEnd.getTime()  -  timeStart.getTime())  /  1000  /  60 )
				let hours = parseInt(Math.abs(mins/60))
				mins=Math.abs( mins % 60);
				this.form.AirTicketFlightInfos[type].FlightDurationHours=hours
				this.form.AirTicketFlightInfos[type].FlightDurationMinutes=mins
			}
		},
		//去程出发日期类型变化
		goDepartDateTypeChange(){
			if(this.tripBox.boxData[0].dateRnage){
				this.tripBox.boxData[0].tagData=[]
				this.goTripDateChange(this.tripBox.boxData[0].dateRnage)
			}

		},
		//回程出发日期类型变化
		backDepartDateTypeChange(){
			if(this.tripBox.boxData[0].dateRnage){
			this.tripBox.boxData[1].tagData=[]
			this.backTripDateChange(this.tripBox.boxData[1].dateRnage)
			}
		},
		//去程日期所有天数
		goTripDateChange(val){
			let s=dateFmt(val[0],'yyyy-MM-dd'),e=dateFmt(val[1],'yyyy-MM-dd')
			let startTime=new Date(s),endTime=new Date(e),allDate=[]
			while((endTime.getTime()-startTime.getTime())>=0){
				let dateStr=dateFmt(startTime,'yyyy-MM-dd')
				allDate.push(dateStr)
				startTime.setDate(startTime.getDate()+1);
			}
			this.tripBox.boxData[0].rangeAlldate=allDate
			this.tripBox.boxData[0].tagData=allDate
			switch(this.form.AirTicketFlightInfos[0].DepartDateType)
				{
				case 1:
					this.goTripWeekChange()
				break;
				case 2:
					this.apartDays(0)
				break;
				case 4:
					this.whenDays(0)
				break;
				}
		},
		//回程日期所有天数
		backTripDateChange(val){
			let s=dateFmt(val[0],'yyyy-MM-dd'),e=dateFmt(val[1],'yyyy-MM-dd')
			let startTime=new Date(s),endTime=new Date(e),allDate=[]
			while((endTime.getTime()-startTime.getTime())>=0){
				let dateStr=dateFmt(startTime,'yyyy-MM-dd')
				allDate.push(dateStr)
				startTime.setDate(startTime.getDate()+1);
			}
			this.tripBox.boxData[1].rangeAlldate=allDate
			this.tripBox.boxData[1].tagData=allDate
			switch(this.form.AirTicketFlightInfos[1].DepartDateType)
				{
				case 1:
					this.backTripWeekChange()
				break;
				case 2:
					this.apartDays(1)
				break;
				case 4:
					this.whenDays(1)
				break;
				}
		},
		//去程按周计算
		goTripWeekChange(){
			if(this.tripBox.boxData[0].rangeAlldate.length>0){
				this.tripBox.boxData[0].tagData=[]
				this.tripBox.boxData[0].rangeAlldate.forEach((d)=>{
					let w=new Date(d).getDay()
					if(this.tripBox.boxData[0].week.indexOf(w)!=-1){
						this.tripBox.boxData[0].tagData.push(d)
					}
				})
			}
		},
		//回程按周计算
		backTripWeekChange(){
			if(this.tripBox.boxData[1].rangeAlldate.length>0){
				this.tripBox.boxData[1].tagData=[]
				this.tripBox.boxData[1].rangeAlldate.forEach((d)=>{
					let w=new Date(d).getDay()
					if(this.tripBox.boxData[1].week.indexOf(w)!=-1){
						this.tripBox.boxData[1].tagData.push(d)
					}
				})
			}
		},
		//按隔天计算
		apartDays(type){
			if(this.tripBox.boxData[type].days!==''&&this.tripBox.boxData[type].rangeAlldate.length>0){
				this.tripBox.boxData[type].days=parseInt(this.tripBox.boxData[type].days)
				this.$set(this.tripBox.boxData, type, this.tripBox.boxData[type]);
				this.tripBox.boxData[type].tagData=[]
				for(let i=0;i<this.tripBox.boxData[type].rangeAlldate.length;i+=this.tripBox.boxData[type].days+1){
					this.tripBox.boxData[type].tagData.push(this.tripBox.boxData[type].rangeAlldate[i])
				}
			}
		},
		//按逢天计算
		whenDays(type){
			if(this.tripBox.boxData[type].days2!==''&&this.tripBox.boxData[type].rangeAlldate.length>0){
				this.tripBox.boxData[type].days2=parseInt(this.tripBox.boxData[type].days2)
				this.$set(this.tripBox.boxData, type, this.tripBox.boxData[type]);
				this.tripBox.boxData[type].tagData=[]
				this.tripBox.boxData[type].rangeAlldate.forEach((item)=>{
					var day=item.slice(9)
					if(day.indexOf(this.tripBox.boxData[type].days2)!=-1){
						this.tripBox.boxData[type].tagData.push(item)
					}
				})
			}
		},
		//删除计算出的所有日期的某一项
		tripCloseTag(tag,type){
			this.tripBox.boxData[type].tagData.splice(this.tripBox.boxData[type].tagData.indexOf(tag), 1);
		},
		//提交前进行的数据组装
		beforeSubmit(){
			this.form.AirTicketFlightInfos[0].StartDate=this.tripBox.boxData[0].dateRnage[0]
			this.form.AirTicketFlightInfos[0].EndDate=this.tripBox.boxData[0].dateRnage[1]
			this.form.AirTicketFlightInfos[0].DepartDate=this.tripBox.boxData[0].tagData.join(',')
			if(this.form.VoyageType==1){
				this.form.AirTicketFlightInfos[1].StartDate=this.tripBox.boxData[1].dateRnage[0]
				this.form.AirTicketFlightInfos[1].EndDate=this.tripBox.boxData[1].dateRnage[1]
				this.form.AirTicketFlightInfos[1].DepartDate=this.tripBox.boxData[1].tagData.join(',')
			}

		},
		//新增舱位
		addSeat(){
			this.form.table.push({
				SpanceName: "",
				Quantity: "",

			})
		},
		//获取仓位名称下拉框
		getSeatNames(){
			this.airHttp.get('/api/Common/GetShoppingSpaceListItem')
			.then((res)=>{
				this.form.spanceNames = res.data.objects
			})
		},
		//提交
		onSubmit(){
			this.beforeSubmit()
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.$confirm('确定提交本次操作？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
						}).then(() => {
							this.form.AirTicketFlightInfos.forEach((item,index) =>{
								var startTime=item.DepartTime;
								var endTime=item.ArriveTime;
								var d=dateFmt(startTime,'yyyy-MM-dd');
								var t=dateFmt(startTime,'hh:mm:ss');
								var d1=dateFmt(endTime,'yyyy-MM-dd');
								var t1=dateFmt(endTime,'hh:mm:ss');
								this.form.AirTicketFlightInfos[index].DepartTime=d+'T'+t;
								this.form.AirTicketFlightInfos[index].ArriveTime=d1+'T'+t1;
							})
							this.submitLoading = true
							this.airHttp.post('api/Procurement/AddRoEdit', this.form)
							.then((res) => {
								this.submitLoading = false
								if(res.data.isSuccess) {
									this.$message({
										message: '添加添加采购单成功！',
										type: 'success'
									});
									this.$refs['form'].resetFields();
									setTimeout(()=>{
										this.$router.push({name:'purchase'})
									},2000)
								}
							})
						}).catch(() => {

						});

				}else{
					return false;
				}
			})
		}
	}
};
</script>

<style >
.info-row {
  margin: 10px 0;
}

.air-info-box {
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px;
}

.type-date-box {
  border: 1px dashed #ddd;
  padding: 10px;
}
.flight-days label{
	width: auto!important;
}
.margin{
	margin-bottom: 20px;
	margin-left: 80px;
}
</style>
