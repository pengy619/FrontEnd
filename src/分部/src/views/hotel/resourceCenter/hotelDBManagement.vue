<template>
    <div class="view">
        <el-form size="small" :inline="true" :model="infoForm"  label-width="100px">
            <el-form-item label="酒店类型">
                <el-select v-model="infoForm.HotelsType" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in hotelTypeList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="酒店状态">
                <el-select v-model="infoForm.HotelStatus" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in hotelStatusList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="房型状态">
                <el-select v-model="infoForm.HotelRoomStatus" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in roomStatusList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属城市">
                <el-input v-model="infoForm.CityName" ></el-input>
            </el-form-item>
            <el-form-item label="酒店名称">
                <el-input v-model="infoForm.HotelName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click='queryData'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
            <el-button size="small" type="primary"  @click="handleAddHotel(0)" >添加国内酒店</el-button>
            <el-button size="small" type="primary"  @click="handleAddHotel(1)" >添加港澳台酒店</el-button>
            <el-button size="small" type="primary"  @click="handleAddHotel(2)" >添加国外酒店</el-button>
        </el-row>
        <el-row v-loading ='tableLoading'>
            <el-row class="no-product" v-if="tableList.length<=0">
                没有酒店商品，去发布吧~
            </el-row>   
            <el-row v-else class="margin_bottom" v-for="(item,index) in tableList" :key="'m'+index">
                <el-row type="flex">
                    <img :src="item.hotelPictures[0].path" class="main-img"/>
                    <div class="margin_left right-hotel">
                        <div class="p1">
                            <span class="title cursor" @click="handleViewDetail(item.id)">{{item.hotelName}} </span>
                            <span class="title margin_left_10" v-if="item.englishHotelName">{{item.englishHotelName}} </span>
                            <span class="margin_left_10">
                                <el-rate
                                style="display:inline"
                                v-model="item.starRated"
                                disabled>
                                </el-rate>
                            </span>
                            <span class="margin_left_10" v-bind:class="item.status==3?'ylt-notinfo':'ylt-notinfo1'">{{item.statusString}}</span>
                        </div>
                        <div class="p2" v-if="item.hotelsType==2">
                            <i class="icon iconfont icon-dingwei"></i>{{item.countryName+item.provinceName+item.cityName+item.address}}
                        </div>
                        <div class="p2" v-else>
                            <i class="icon iconfont icon-dingwei"></i>{{item.countryName+item.provinceName+item.cityName+item.districtName+item.address}}
                        </div>
                        <div class="hotel-operation">
                            <el-button size="small" type="primary"  @click="handleAddRoomType(item)" :disabled="item.supplierID&&item.status!=3">添加房型</el-button>
                            <el-button size="small" type="primary"  @click="handleEditHotel(item)" :disabled="item.supplierID" >编辑酒店</el-button>
                            <el-button size="small" type="primary"  @click="handleAuditHotel(item)"  v-if="item.status==1">审核酒店</el-button>
                        </div>
                    </div>
                </el-row>
                <el-row v-show="item.isShow" class="margin_top">
                    <el-table :data="item.hotelRooms">
                        <el-table-column  prop="roomNO" label="房型ID" > </el-table-column>
                        <el-table-column  prop="roomName" label="房型名称" > </el-table-column>
                        <el-table-column  prop="number" label="房间数量" width="80" > </el-table-column>
                        <el-table-column  label="房型信息" >
                            <template slot-scope="scope">
                                {{roomTypeInfo(scope.row)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="房间设施" > 
                            <template slot-scope="scope">
                                {{roomFacilities(scope.row)}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="statusName" label="审核状态" width="80">
                        </el-table-column>
                        <el-table-column  label="操作" fixed="right" width='150'>
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleEditRoomType(scope.row)" >编辑</el-button>
                                <el-button type="text" size="mini" @click="handleDeleteRoomType(scope.row)">删除</el-button>
                                <el-button type="text" size="mini" @click="handleAuditRoomType(scope.row)" v-if="scope.row.status==1">审核</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div class="text-center margin_top view-room"  @click="handleShowHideRooms(index)">{{item.isShow?'收起':'查看房型'}}</div>
            </el-row>
        </el-row>
        <el-pagination
            class="pagination"
            fixed="right"
            :data = 'pagination'
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>

        <el-dialog title="添加房型" :visible.sync="dialogVisible" width="800px" @close="handleClose">
			<el-form :model="roomForm" :rules="rules" ref="roomForm" label-width="80px" class="demo-ruleForm" size="small">
				<el-form-item label="房型名称" prop="hotelRoomNameId">
					<el-select v-model="roomForm.hotelRoomNameId" placeholder="请选房型">
						<el-option :key="item.key"
								:label="item.name"
								:value="Number(item.key)" v-for="item in roomTypeList"></el-option>
					</el-select>
				</el-form-item>
				<el-row type="flex">
					<el-form-item label="房间数量" prop="number">
						共 <el-input-number :controls="false" :min="0" v-model="roomForm.number" style="width:100px;" ></el-input-number> 室
					</el-form-item>
					<el-form-item label="可住" prop="livingCount" label-width="70px">
						<el-input-number :controls="false" :min="0"  v-model="roomForm.livingCount"  style="width:100px;" ></el-input-number> 人
					</el-form-item>
				</el-row>
				<el-row type="flex" v-for="(item,index) in roomForm.hotelRoomBeds">
					<el-form-item :label="'床型'+(index+1)" 
						:prop="'hotelRoomBeds.' + index +'.bedTypeId'"
						:rules="{
							required: true, message: '请选择床型', trigger: 'change'
						}"
					>
						<el-select v-model="item.bedTypeId" placeholder="请选择床型" >
							<el-option :key="item.key"
									:label="item.name"
									:value="Number(item.key)" v-for="item in bedTypeList"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="20px"
						:prop="'hotelRoomBeds.' + index +'.bedSizeId'"
						:rules="{
							required: true, message: '请选择床尺寸', trigger: 'change'
						}"
					>
						<el-select v-model="item.bedSizeId" placeholder="请选择床尺寸" >
							<el-option :key="item.key"
									:label="item.name"
									:value="Number(item.key)" v-for="item in bedSizeList"></el-option>
						</el-select> m
					</el-form-item>
					<el-form-item label="共" label-width="50px"
						:prop="'hotelRoomBeds.' + index +'.bedNumber'"
						:rules="[{
							required: true,validator:checkNumber, trigger: 'blur'
						}]"
					>
						<el-input-number :controls="false" :min="0" v-model="item.bedNumber"  style="width:100px;" ></el-input-number> 张 
						<el-button size="small" class="margin_left_10" type="" v-if="index>0" @click="handleDeleteRoomBeds(index)">删除</el-button>
					</el-form-item>
						
				</el-row>
				<el-form-item label=""  >
					<el-button size="small" type="primary" @click="handleAddRoomBeds">添加床型</el-button>
				</el-form-item>
				<el-form-item label="建筑面积" prop="area" >
					<el-input  v-model="roomForm.area" class="input_comm" ></el-input> m²
				</el-form-item>
				<el-form-item label="楼层" prop="floor" >
					<el-input  v-model="roomForm.floor" class="input_comm"  ></el-input> 层
				</el-form-item>
				<el-form-item label="床型备注"  >
					<el-input v-model="roomForm.remark" class="input_comm"  ></el-input>
				</el-form-item>
				<el-form-item label="是否有窗" prop="hasWindows">
					<el-radio-group v-model="roomForm.hasWindows">
						<el-radio :label="0">有窗</el-radio>
						<el-radio :label="1">无窗</el-radio>
						<el-radio :label="2">内窗</el-radio>
						<el-radio :label="3">部分无窗</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="有无宽带" prop="hasNetwork">
					<el-radio-group v-model="roomForm.hasNetwork">
						<el-radio :label="true">有</el-radio>
						<el-radio :label="false">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="有无WIFI" prop="hasWiFi">
					<el-radio-group v-model="roomForm.hasWiFi">
						<el-radio :label="true">有</el-radio>
						<el-radio :label="false">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="房间设施" prop="facilitiesArr">
					<el-checkbox-group v-model="roomForm.facilitiesArr" v-if="roomfacilitiesList.length>0">
						<el-checkbox :label="item.key" v-for="item in roomfacilitiesList">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="图片" prop="hotelPicture">
					<span>（图片限2M以下，建议尺寸为885*487，格式为：jpg/png，数量限制10张，可自由设置主图有且仅有1张。）</span>
					<div class="upload-list">
					<div class="thumb-img" v-for="(item,index) in roomForm.hotelPicture" :key="item.path+index">
						<div class="img">
							<img :src="item.path.includes('http')?item.path:imgBaseUrl+item.path" alt="">
						</div>
						<div>
							<div>
								<el-checkbox v-if="index==0&&!isEditRoomType" v-model="item.isMain" checked>主图</el-checkbox>
								<el-checkbox v-else v-model="item.isMain">主图</el-checkbox>
								<el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
							</div>
							<el-input class="width_full" v-model="item.name" size="mini" placeholder="请输入内容"></el-input>
						</div>
					</div>
					<el-upload
						action="/image/upload"
						list-type="picture-card"
						:http-request="imgUpload"
						:show-file-list="false"
						:file-list="roomForm.hotelPicture"
						:limit="10"
						:multiple="true"
						accept="image/jpeg,image/png"
						:before-upload="beforeAvatarUpload"
						class="upload-btn"
						v-show="roomForm.hotelPicture.length < 10"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="handleSubmit('roomForm')" :disabled="(!roomForm.canEdit&&isEditRoomType)" :loading="btnLoading">确 定</el-button>
			</span>
		</el-dialog>
        <el-dialog title="房型审核" :visible.sync="auditVisible"  width="30%" >
            <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="120px" class="demo-ruleForm" size="small">
				<el-form-item label="审核状态" :prop="auditType==1?'HotelStatus':'HotelRoomStatus'">
					<el-radio-group v-model="auditForm.HotelStatus" v-if="auditType==1">
                        <el-radio :label="3">通过</el-radio>
                        <el-radio :label="6">拒绝</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="auditForm.HotelRoomStatus" v-else-if="auditType==2">
                        <el-radio :label="3">通过</el-radio>
                        <el-radio :label="6">拒绝</el-radio>
                    </el-radio-group>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitAuditResult" :loading="btnLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        let checkNumber=(rule, value, callback) => {
            if(value!=0&&!value){
                return callback(new Error('不能为空'));
            }else if ((value+'').indexOf('.')>-1) {
                return callback(new Error('请输入正整数'));
            }else {
                callback();
            }
        }
        return {
            checkNumber:checkNumber,
            infoForm:{
                HotelsType:'',
                HotelStatus:'',
                HotelRoomStatus:'',
                CityName:'',
                Status:'',
                HotelName:'',
                PageSize:10,
                PageIndex:1,
            },
            auditType:1,
            hotelTypeList:[],
            hotelStatusList:[{key:3,value:'已上架'},{key:1,value:'待审核'},{key:6,value:'已拒绝'},{key:0,value:'草稿'}],
            roomStatusList:[{key:3,value:'已上架'},{key:1,value:'待审核'},{key:6,value:'已拒绝'}],
            tableList:[],
            isEditRoomType:false,
            tableLoading:false,
            auditForm:{
                HotelRoomId:'',
                HotelId:'',
                HotelRoomStatus:3,
                HotelStatus:3,
            },
            auditVisible:false,

            dialogVisible:false,
            roomTypeList:[],
            bedTypeList:[],
            bedSizeList:[],
            roomfacilitiesList:[],
            btnLoading:false,
            roomForm: {
                hotelRoomNameId:'',
                roomName:'',
                number:'',
                livingCount:'',
                area:'',
                floor:'',
                remark:'',
                hasWindows:'',
                hasNetwork:'',
                hasWiFi:'',
                facilitiesArr:[],
                facilitiesList:[],
                hotelRoomBeds:[{
                    bedTypeId:'',
                    bedTypeName:'',
                    bedNumber:'',
                    bedSizeId:'',
                    bedSizeName:'',
                }],
                hotelPicture:[],
                hotelID:'',
                id:0,
            },
            roomFormTemp:{},
            rules: {
                hotelRoomNameId: [
                    {required: true, message: '请选择房型名称', trigger: 'change'}
                ],
                number: [
                    {required: true, trigger: 'blur',validator:checkNumber},
                ],
                livingCount: [
                    {required: true, trigger: 'blur',validator:checkNumber},
                ],
                area:[
                    {required: true, message: '请输入建筑面积', trigger: 'blur'},
                ],
                floor:[
                    {required: true, message: '请输入楼层', trigger: 'blur'},
                ],
                hasWindows:[{ type:'number',required: true, message: '请选择窗户类型', trigger: 'change'}],
                hasNetwork:[{ type:'boolean',required: true, message: '请选择宽带', trigger: 'change'}],
                hasWiFi:[{  type:'boolean',required: true, message: '请选择WIFI', trigger: 'change'}],
                facilitiesArr:[{  type:'array',required: true, message: '请选择房间设施', trigger: 'change'}],
                hotelPicture: [
                    {required: true, type: 'array', required: true, message: '请上传图片', trigger: 'change'}
                ]
            },
            auditRules: {
                HotelStatus: [
                    {type:'number',required: true, message: '请选择审核操作', trigger: 'change'}
                ],
                HotelRoomStatus: [
                    {type:'number',required: true, message: '请选择审核操作1', trigger: 'change'}
                ],
            },
            //分页
            pagination: {
                sizes: [5, 10, 20, 50],
                size: 10,
                currentPage: 1,
                total: 0
            }
        };
    },
    mounted(){
        this.getHotelType();
        this.getRoomTypeSelect();
        this.getBedTypeSelect();
        this.getBedSizeSelect();
        this.getRoomFacilities();
        this.roomFormTemp=JSON.parse(JSON.stringify(this.roomForm))
        this.queryData();
    },
    watch:{
        roomForm:{
            handler:function (val) {
                let arr =[];
                val.hotelPicture.forEach((item,index)=>{
                    if(item.isMain == true){
                        arr.push(item)
                        if(arr.length>1){
                            this.$message.error('您已选择主图')
                            val.hotelPicture[index].isMain = false;
                        }
                    }
                })
            },
            deep:true
        }
    },
    methods: {
        handleViewDetail(id){
            this.$router.push('/hotel/hotelDetail/'+id)
        },
        //编辑房型
        handleEditRoomType(row){
			this.isEditRoomType=true;
            this.groupHttp.get('/Hotel/GetHotelRoomForEdit',{
                params:{
                    RoomId:row.id
                }
            })
            .then((res) => {
                if(res.data.isSuccess){
                    let object=res.data.object;
                    let arr=[];
                    object.facilitiesList.forEach(item=>{
                        this.roomfacilitiesList.forEach(item1=>{
                            if(item.key==item1.key){
                                arr.push(item1.key);
                            }
                        })
                    })
                    this.roomForm.facilitiesArr=arr;
					this.roomForm=Object.assign(this.roomForm,object);
                    this.dialogVisible=true;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //删除房型
        handleDeleteRoomType(row){
            this.$confirm('删除房型?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.groupHttp.post('/Hotel/DeleteHotelRoom',{
                    RoomId:row.id
                })
                .then((res) => {
                    if(res.data.isSuccess){
                        this.$message({
                            type:'success',
                            message:'删除房型成功！'
                        });
                        this.queryData();
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch((e) => {
                    console.log(e)
                })
            })
        },
        //添加床型
        handleAddRoomBeds(){
            let obj={
                bedTypeId:'',
                bedTypeName:'',
                bedNumber:'',
                bedSizeId:'',
                bedSizeName:'',
            }
            this.roomForm.hotelRoomBeds.push(obj)
        },
        //删除床型
        handleDeleteRoomBeds(index){
            this.roomForm.hotelRoomBeds.splice(index,1)
        },
        //提交床型
        handleSubmit(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.btnLoading=true;
                    this.roomTypeList.forEach(item=>{
                        if(item.key==this.roomForm.hotelRoomNameId){
                            this.roomForm.roomName=item.name;
                        }
                    })
                    this.roomForm.hotelRoomBeds.forEach(item=>{
                        this.bedTypeList.forEach(item1=>{
                            if(item1.key==item.bedTypeId){
                                item.bedTypeName=item1.name;
                            }
                        })
                        this.bedSizeList.forEach(item1=>{
                            if(item1.key==item.bedSizeId){
                                item.bedSizeName=item1.name;
                            }
                        })
                    })
                    this.roomForm.facilitiesList=[];
                    this.roomForm.facilitiesArr.forEach(item=>{
                        this.roomfacilitiesList.forEach(item1=>{
                            if(item==item1.key){
                                this.roomForm.facilitiesList.push({
                                    key:item1.key,
                                    name:item1.name
                                });
                            }
                        })
                    })
                    if(this.roomForm.hotelPicture.length>0){
                        var mainImg = false;//是否有主图
                        this.roomForm.hotelPicture.forEach((item, index) => {//循环判断是否选择了主图
                            if (item.isMain == true) {
                                mainImg = true;
                                return false;
                            }
                        })
                        if (mainImg == false) {//如果没有选择主图则默认选择第一张图为主图
                            this.roomForm.hotelPicture[0].isMain = true;
                        }
                    }
                    this.groupHttp.post('/Hotel/CreateOrEditHotelRoom',this.roomForm)
                    .then((res) => {
                        if(res.data.isSuccess){
                            this.$message({
                                type:'success',
                                message:'保存房型成功！'
                            });
                            this.dialogVisible=false;
                            this.queryData();
                        }else{
                            this.$message.error(res.data.message);
                        }
                        this.btnLoading=false;
                    }).catch((e) => {
                        this.btnLoading=false;
                    })
                }
            })
        },
        //获取房型名称下拉框
        getRoomTypeSelect(){
            this.groupHttp.get('/Hotel/GetroomNameSelect')
            .then((res) => {
                if(res.data.isSuccess){
                    this.roomTypeList = res.data.keyValueList;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //获取床型类型下拉框
        getBedTypeSelect(){
            this.groupHttp.get('/Hotel/GetBedTypeSelect')
            .then((res) => {
                if(res.data.isSuccess){
                    this.bedTypeList = res.data.keyValueList;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //获取床型尺寸下拉框
        getBedSizeSelect(){
            this.groupHttp.get('/Hotel/GetBedSizeSelect')
            .then((res) => {
                if(res.data.isSuccess){
                    this.bedSizeList = res.data.keyValueList;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //获取房型设施
        getRoomFacilities(){
            this.groupHttp.get('/Hotel/GetRoomFacilities')
            .then((res) => {
                if(res.data.isSuccess){
                    this.roomfacilitiesList = res.data.keyValueList;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //显示隐藏房型
        handleShowHideRooms(index){
            this.$set(this.tableList,index, this.tableList[index])
            this.tableList[index].isShow = !this.tableList[index].isShow;
        },
        //查询数据
        queryData(){
            this.tableLoading=true;
            this.groupHttp.get("/Hotel/GetHotelLibraryPageList",{params:this.infoForm})
            .then(res => {
                if (res.data.isSuccess == true) {
                    this.tableList = res.data.objects;
                    this.pagination.total=res.data.total;
                } else {
                    this.$message.error(res.data.message);
                }
                this.tableLoading=false;
            });
        },
        //列表房型信息
        roomTypeInfo(row){
            let str='面积：'+row.area+'m²，位于：'+row.floor+'层，共：'+row.number+'间，可住：'+row.livingCount+'人';
            return str
        },
        //房间设施
        roomFacilities(row){
            if(row){
                let str='';
                row.hotelRoomBeds.forEach(item=>{
                    str+=item.bedTypeName+'，'+item.bedNumber+'张，'+item.bedSizeName+'米，'
                })
                str+=row.hasNetworkString +'，'+row.hasWiFiString +'，'+row.hasWindowsString ;
                return str;
            }
        },
        //新增酒店
        handleAddHotel(type){
            this.$router.push({name:'basicInfo',query:{hotelsType:type}})
        },
        //添加房型
        handleAddRoomType(item){
			this.roomForm.id=0;
			this.isEditRoomType=false;
            this.dialogVisible=true;
            this.roomForm.hotelID=item.id;
        },
        handleEditHotel(row){
            this.$router.push({name:'editHotel',query:{hotelId:row.id}})
        },
        //审核酒店
        handleAuditHotel(row){
            this.auditType=1;
            this.auditVisible=true;
            this.auditForm.HotelId=row.id;
            this.auditForm.HotelRoomId='';
        },
        //审核房型
        handleAuditRoomType(row){
            this.auditType=2;
            this.auditVisible=true;
            this.auditForm.HotelId='';
            this.auditForm.HotelRoomId=row.id;
        },
        //提交审核结果  type=1 审核酒店；  type=2审核房型
        handleSubmitAuditResult(){
            this.$refs['auditForm'].validate(valid => {
                if (valid) {
                    this.btnLoading=true;
                    let url,str;
                    if(this.auditType==1){
                        url="/Hotel/AuditHotel";
                        str='酒店';
                    }else if(this.auditType==2){
                        url="/Hotel/AuditHotelRoom";
                        str='房型';
                    }
                    this.groupHttp.post(url,this.auditForm)
                    .then(res => {
                        if (res.data.isSuccess == true) {
                            this.$message({
                                type: 'success',
                                message: str+'审核成功!'
                            });
                            this.queryData();
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.auditVisible=false;
                        this.btnLoading=false;
                    }).catch(res=>{
                        this.btnLoading=false;
                    })
                }
            })
        },
        getHotelType(){
            this.groupHttp.get("/Hotel/GetHotelType")
            .then(res => {
                if (res.data.isSuccess == true) {
                    this.hotelTypeList = res.data.objects;
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        //关闭弹窗
        handleClose(){
            this.$refs['roomForm'].resetFields();
            // this.roomForm.remark=''
            this.roomForm=JSON.parse(JSON.stringify(this.roomFormTemp))
        },
        //图片删除
        handleRemove(uid){
            this.roomForm.hotelPicture.forEach((item, index) => {
                if (item.uid == uid) {
                    this.roomForm.hotelPicture.splice(index, 1)
                }
            })
        },
        imgUpload(val){
            var f = new FormData();
            f.append('FileData', val.file);
            f.append('Category', 'AirTicket');
            f.append('thumbnail', true);
            f.append('Folder', 'Airline');
            this.fileUpload.post(val.action, f)
            .then((res) => {
                this.roomForm.hotelPicture.push({
                    name: res.data.formerName,
                    path: res.data.url,
					hotelID: this.roomForm.hotelID,
                    uid: val.file.uid,
                    isMain: false,
                    type:1,
                })
                if (res.data.state == false) {
                    this.$message.error(res.data.message);
                }
            })
        },
        //限制图片
        beforeAvatarUpload(file){
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImg) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isImg && isLt2M;
        },
        //分页
        sizeChange(val) {
            this.pagination.size = val;
            this.pagination.currentPage = 1;
            this.infoForm.PageSize = val;
            this.infoForm.PageIndex = 1;
            this.queryData();
        },
        currentPageChange(val) {
            this.pagination.currentPage = val;
            this.infoForm.PageIndex = val;
            this.queryData();
        }
    }
};
</script>
<style scoped>
    .view-room{
        padding: 5px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        cursor: pointer;
    }
    .right-hotel{
        position: relative;
    }
    .hotel-operation{
        position: absolute;
        left: 0;
        bottom: 0;
        white-space: nowrap;
    }
    .main-img{
        width: 205px;
        height: 115px;
    }
    .p1 .title{
        font-size: 16px;
        color: #3bb4f2;
    }
    .cursor{
        cursor: pointer;
    }
    .p2{
        margin-top: 5px;
        color: #999;
    }
    .p2 .iconfont{
        color: #3bb4f2;
    }
    .ylt-notinfo {
        border-radius: 30px;
        background-color: #e9f8f3;
        color: #40dba1;
        padding: 2px 10px;
    }

    .ylt-notinfo1 {
        border-radius: 30px;
        background-color: #FFFAF4;
        color: #F37B1D;
        padding: 2px 10px;
    }
    .no-product{
        font-size: 18px;
        text-align: center;
        padding:15px;
    }
</style>