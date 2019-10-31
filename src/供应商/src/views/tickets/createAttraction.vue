<template>
  <div class="view">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" size="small">
      <el-form-item label="景点名称" prop="ScenicName">
        <el-input v-model="ruleForm.ScenicName"></el-input>
      </el-form-item>
      <el-form-item label="景点简称" prop="ShortName">
        <el-input v-model="ruleForm.ShortName"></el-input>
      </el-form-item>
      <el-form-item label="景点星级" prop="LevelId">
        <el-select v-model="ruleForm.LevelId" placeholder="选择景点星级">
          <el-option :key="item.id"
                     :label="item.dicdata_Name"
                     :value="item.id+''" v-for="item in attractionStarList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="景点地址" prop='address'>
                    <el-select v-model="ruleForm.ProvinceID" class='addressSel' placeholder="----请选择---- 省" @change="provinceChange">
                        <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="ruleForm.CityID" class='addressSel' placeholder="----请选择---- 市" @change="cityChange">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="ruleForm.DistrictID" class='addressSel' placeholder="----请选择---- 县" @change="districtChange">
                        <el-option
                            v-for="item in districList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="" prop="Address">
            <el-input v-model="ruleForm.Address" class='detail-input'></el-input>
        </el-form-item>
      <el-form-item label="确认规则" prop="ConfirmRule">
        <el-radio-group v-model="ruleForm.ConfirmRule">
          <el-radio :label="item.key" v-for="(item,index) in radioRule" :key='index'>{{item.value}}</el-radio>
          <span v-show="radioRule.length==0">暂无数据</span>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="景点联系人" prop="Contact">
        <el-input v-model="ruleForm.Contact"></el-input>
      </el-form-item>
      <el-form-item label="景点电话" prop="Tel">
        <el-input v-model="ruleForm.Tel"></el-input>
      </el-form-item>
      <el-form-item label="景点类型" prop="ScenicType">
        <el-select v-model="ruleForm.ScenicType" placeholder="选择景点类型">
          <el-option :key="item.id"
                     :label="item.dicdata_Name"
                     :value="item.id+''" v-for="item in attractionTypeList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="景点经度" prop="Longitude">
        <el-input v-model="ruleForm.Longitude"></el-input>
      </el-form-item>
      <el-form-item label="景点纬度" prop="Latitude">
        <el-input v-model="ruleForm.Latitude"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="Pictures">
        <span>（图片格式为jpg/png/bmp，最大为2M，至少上传1张，最多为8张。）</span>
        <div class="upload-list">
          <div class="thumb-img" v-for="(item,index) in ruleForm.Pictures" :key="index">
            <div class="img">
              <img :src="item.Url.includes('http')?item.Url:imgBaseUrl+item.Url" alt="">
            </div>
            <div class="input">
              <div>
                <el-checkbox v-model="item.IsMain">主图</el-checkbox>
                <el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
                <!-- <el-button type="text" @click="handlePictureCardPreview(item.url)">放大</el-button> -->
              </div>
              <el-input v-model="item.Name" size="mini" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <el-upload
            action="/image/upload"
            list-type="picture-card"
            :http-request="imgUpload"
            :show-file-list="false"
            :file-list="ruleForm.Pictures"
            :limit="8"
            :multiple="true"
            accept="image/jpeg,image/png,image/bmp"
            :before-upload="beforeAvatarUpload"
            class="upload-btn"
            v-show="ruleForm.Pictures.length < 8"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="VR视频" prop="VRUrl">
        <el-upload
          class="upload-demo-vedio"
          action="/image/upload" 
          :http-request="videoUpload"
          :on-preview="handleVedioPreview"
          :on-remove="handleVedioRemove"
          :before-remove="beforeVedioRemove"
          :before-upload="beforeVedioUpload"
          :limit="1"
          :on-exceed="handleVedioExceed"
          :file-list="videoList">
          <el-button size="small" type="primary">本地上传</el-button>
          <div slot="tip" class="el-upload__tip dis-inline" >只能上传一个视频，视频文件限制10M一下，格式限定为：AVI/MPEG</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="景点简介" prop="RecommendDesc">
        <editor id="introduction" height="300px" width="700px" :content="ruleForm.introductionDesc" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="introductionChange">
          </editor>
      </el-form-item>
      <el-form-item label="交通指南" prop="RecommendDesc">
         <editor id="traffic" height="300px" width="700px" :content="ruleForm.trafficDesc" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="trafficChange">
          </editor>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="submitForm('ruleForm', false)" :loading='btn_loading' class='btn-save'>保存</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm', true)" :loading='btn_loading' class='btn-save'>保存并提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../style/common.scss";

  .margin_none {
    margin-bottom: 0px;
  }

  .el-textarea {
    width: 55%;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .img_upload {
    margin-bottom: 10px;
  }

  .el-header {
    margin-bottom: 20px;
    /*background: #f5f7fa;*/
  }

  .el-input {
    width: 200px;
  }
  .btn-save.el-button{
      margin:10px 0 0 322px;
  }
  .detail-input.el-input{
      width:400px!important;
  }
  .upload-demo-vedio{
    width:400px;
  }
  .dis-inline{
    display: inline-block;
  }
</style>
<script>
  export default{
    data() {
      var checkText = (rule, value, callback) => {
        if (!value) {
          callback(new Error('内容不能为空'));
        } else if (!/^[^ ]+$/.test(value)) {
          callback(new Error('内容不能含有空格'));
        } else {
          callback()
        }
      }
      var checkAddress = (rule, value, callback) => {
        if(!this.ruleForm.ProvinceID){
          callback(new Error('您还没有选择省'))
        }else if(!this.ruleForm.CityID){
          callback(new Error('您还没有选择市'))
        }else if(!this.ruleForm.DistrictID){
          callback(new Error('您还没有选择县'))
        }else{
          callback()
        }
      }
      var checkDetail = (rule, value, callback) => {
            if (!this.ruleForm.Address) {
                callback(new Error('详细地址不能为空'));
            } else if (!/^[^ ]+$/.test(this.ruleForm.Address)) {
                callback(new Error('详细地址不能含有空格'));
            } else {
                callback()
            }
      }
      var checkVedio = (rule,value,callback) => {
        if(!this.ruleForm.VRUrl){
          callback(new Error('您还没有上传视频'))
        }else{
          callback()
        }
      }
      var checkPhone = (rule,value,callback) => {
        if(!value){
          callback(new Error('您还没有输入手机号码'))
        }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
          callback(new Error('您的手机号码有误'))
        }else{
          callback()
        }
      }
      return {
        btn_loading: false,
        inputValue: '',
        videoList: [
          // {
          //   Name:'',
          //   Url: ''
          // }
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        checkBoxItemType: [],
        GroupLineLabel: [],
        checkBoxItemMode: [],
        checkBoxItemSite: [],
        radioRule: [],
        ruleForm: {
          ScenicName: '',
          ShortName: '',
          LevelId: '',
          LevelName: '',
          ScenicType:'',
          ConfirmRule: '',
          Contact: '',
          Tel:'',
          attractionType:'',
          Longitude:'',
          Latitude:'',
          ProvinceID: '',
          ProvinceName: '',
          CityID: '',
          CityName: '',
          DistrictID: '',
          DistrictName: '',
          Address: '',
          Pictures: [],
          VRUrl: '',
          Intro: '',
          Traffic: ''
        },
        attractionStarList: [],
        attractionTypeList: [],
        // 地址选择
        provinceList: [],
        cityList: [],
        districList: [],
        rules: {
          ScenicName: [
            {required: true, validator: checkText, trigger: 'blur'}
          ],
          LevelId: [
            {required: true, message: '请选择景点星级', trigger: 'change'}
          ],
          address: [
            {required: true, validator: checkAddress, trigger: 'change'}
          ],
          Address: [
            {required: true, validator: checkDetail, trigger: 'blur'}
          ],
          Contact: [
            {required: true, validator: checkText, trigger: 'blur'}
          ],
          Tel:[
              {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          ScenicType: [
            {required: true, message: '请选择景点类型', trigger: 'change'}
          ],
          ConfirmRule: [
            {required: true, message: '请确认规则', trigger: 'change'}
          ],
          Pictures: [
            {required: true, type: 'array', message: '请上传图片', trigger: 'change'}
          ],
          VRUrl: [
            {required: true, validator: checkVedio, trigger: 'change'}
          ]
        }
      };
    },
    mounted(){
      this.comfirmRules();
      this.getAttractionStarList();
      this.getAttractionTypeList();
      //获取省级行政单位
        this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1')
			.then((res)=>{
                if(res.status == 200){
                    this.provinceList = res.data;
                }
			}).catch((e) => {
                console.log(e);
            })
    },
    watch:{
        ruleForm:{
            handler:function (val) {
                let arr =[];
                val.Pictures.forEach((item,index)=>{
                    if(item.IsMain == true){
                        arr.push(item);
                        if(arr.length>1){
                            this.$message.error('您已选择主图')
                            val.Pictures[index].IsMain = false;
                        }
                    }
                })
            },
            deep:true
        }
    },
    methods: {
      //确认规则
      comfirmRules () {
        this.ticketHttp.post('TicketScenic/GetEnumConfirmType').then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.radioRule = res.data;
          }
            
        }).catch((e) => {
            console.log(e)
        });
      },
      //景点等级
      getAttractionStarList () {
        this.ticketHttp.get("DictionaryData/GetDictionaryData?Type=1006").then(res => {
          if (res.data.isSuccess === true) {
            this.attractionStarList = res.data.objects;   
          } else {
            this.$message({
              type: "info",
              message: "获取景点等级出错了: " + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      },
      //获取景点类型
      getAttractionTypeList (){
        this.ticketHttp
        .get("DictionaryData/GetDictionaryData?Type=1005").then(res => {
          if (res.data.isSuccess === true) {
            this.attractionTypeList = res.data.objects;   
          } else {
            this.$message({
              type: "info",
              message: "操作失败: " + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      },
      //地址选择(省)
      provinceChange(val){
      this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
			  .then((res)=>{
                if(res.status == 200){
                    this.cityList = res.data;
                    this.districList = [];
                    this.ruleForm.CityID = '';
                    this.ruleForm.DistrictID = '';
                    this.$refs.ruleForm.validateField("address")
                }
			}).catch((e) => {
                console.log(e);
          })
        },
      //地址选择(市)
      cityChange(val){
        this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val)
			  .then((res)=>{
                if(res.status == 200){
                    this.districList = res.data;
                    this.ruleForm.DistrictID = '';
                    this.$refs.ruleForm.validateField("address")
                }
			}).catch((e) => {
                console.log(e);
            })
        },
      //地址选择(县)
      districtChange () {
        this.$refs.ruleForm.validateField("address")
      },
      introductionChange(data){
        console.log(data)
        this.ruleForm.Intro = data.value
      },
      trafficChange(data){
        console.log(data)
        this.ruleForm.Traffic = data.value
      },
      submitForm(formName, boo){
        this.provinceList.forEach((item) => {
          if(item.id == this.ruleForm.ProvinceID){
            this.ruleForm.ProvinceName = item.name;
          }
        })
        this.cityList.forEach((item) => {
          if(item.id == this.ruleForm.CityID){
            this.ruleForm.CityName = item.name;
          }
        })
        this.districList.forEach((item) => {
          if(item.id == this.ruleForm.DistrictID){
            this.ruleForm.DistrictName = item.name;
          }
        })
        this.attractionStarList.forEach((item) => {
          if(item.id == this.ruleForm.LevelId){
            this.ruleForm.LevelName = item.dicdata_Name;
          }
        })
        this.ruleForm.VRUrl = this.videoList[0].Url;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ticketHttp.post( 'TicketScenic/Save', {
              Dto: this.ruleForm,
              Submit: boo
            }).then( (res) => {
                console.log(res)
              if( res.data.isSuccess === true){
                this.btn_loading = true;
                this.$message({
                  type:'success',
                  message:'保存成功!'
                })
                setTimeout( ()=>{
                  this.btn_loading = false;
                },1500)
              }else{
                this.$message({
                  type:'info',
                  message:'出错了!' + res.data.message
                })
              }
            }).catch( (e) => {
              console.log(e)
            })
          }
        });
      },
      //图片删除
      handleRemove(uid){
        this.ruleForm.Pictures.forEach((item, index) => {
          if (item.uid == uid) {
            this.ruleForm.Pictures.splice(index, 1)
          }
        })
      },
      handlePictureCardPreview(url){
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      },
      imgUpload(val){
          var f = new FormData();
          f.append('FileData', val.file);
          f.append('Category', 'AirTicket');
          f.append('thumbnail', true);
          f.append('Folder', 'Airline');
          this.fileUpload.post(val.action, f)
            .then((res) => {
              this.ruleForm.Pictures.push({
                Name: res.data.formerName,
                Url: res.data.url,
                uid: val.file.uid,
                isMain: false
              })
              if (res.data.state == false) {
                this.$message.error(res.data.message);
              }
            })
        },
//    限制图片
      beforeAvatarUpload(file){
          const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isImg) {
            this.$message.error('上传头像图片只能是 JPG/PNG/BMP 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isImg && isLt2M;
        },
        videoUpload (val) {
            var f = new FormData();
            f.append('FileData', val.file);
            f.append('Category', 'AirTicket');
            f.append('thumbnail', true);
            f.append('Folder', 'Airline');
            this.fileUpload.post(val.action, f).then((res) => {
              console.log(res)
              if(res.data.state == true){
                this.videoList.push({ 
                  Name: res.data.formerName,
                  Url: res.data.url,
                  uid: val.file.uid,
                })
              }
              if(res.data.state == false) {
                this.$message.error(res.data.message);
              }
            })
        },
        handleVedioRemove(file, fileList) {
          this.videoList = [];
        },
        handleVedioPreview(file) {
          console.log(file);
        },
        handleVedioExceed(files, fileList) {
          this.$message.warning(`当前限制上传一个视频`);
        },
        beforeVedioRemove(file, fileList) {
          // return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeVedioUpload(file){
        //   const isVedio = file.type === 'video/avi' || file.type === 'video/mpeg';
        //   const isLt10M = file.size / 1024 / 1024 < 10;
        //   if (!isVedio) {
        //     this.$message.error('上传视频只能是 AVI/MPEG 格式!');
        //   }
        //   if (!isLt10M) {
        //     this.$message.error('上传视频大小不能超过 10MB!');
        //   }
        //   return isVedio && isLt10M;
        }
      }
    }
</script>
