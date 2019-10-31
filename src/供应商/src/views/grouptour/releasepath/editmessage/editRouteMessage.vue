<template>
  <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="260px" class="demo-ruleForm" size="small">
      <el-form-item label="线路名称" prop="FullName">
        <el-input v-model="ruleForm.FullName" type="textarea" autosize class="input_comm" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="线路简称" prop="ShortName">
        <el-input v-model="ruleForm.ShortName"></el-input>
      </el-form-item>
      <el-form-item label="线路类型" prop="EnumGroupLineType">
        <template v-if="!editType">
          <span>{{linetype}}</span>
          <el-button size="mini" @click="newLineType">修改</el-button>
        </template>
        <el-select v-model="ruleForm.EnumGroupLineType" placeholder="选择线路类型"
                   v-if="editType">
          <el-option :key="item.id"
                     :label="item.paramName"
                     :value="item.id" v-for="item in checkBoxItemType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组团方式" prop="EnumGroupLineMode">
        <template v-if="!editMode">
          <span>{{linemode}}</span>
          <el-button size="mini" @click="newLineMode">修改</el-button>
        </template>
        <el-select v-model="ruleForm.EnumGroupLineMode" placeholder="选择组团方式" v-if="editMode">
          <el-option :label="item.name" :value="Number(item.key)" v-for="item in checkBoxItemMode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行程总天数" prop="TripDays">
        <el-input v-model="ruleForm.TripDays" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="确认规则" prop="ConfirmType">
        <el-radio-group v-model="ruleForm.ConfirmType">
          <el-radio :label="item.key" v-for="item in radioRule"  :disabled="item.value!='三方确认'">{{item.value}}</el-radio>
          <span v-show="radioRule.length==0">暂无数据</span>
        </el-radio-group>
        <span v-show="radioRule.length==0"></span>
      </el-form-item>
      <el-form-item label="集合地点" prop="GatherAddressDescArr">
        <template v-if="!editAddress">
          <span>{{lineaddress}}</span>
          <el-button size="mini" @click="newAddress">修改</el-button>
        </template>
        <el-select 
          v-model="ruleForm.GatherAddressDescArr"   
          multiple
          placeholder="请选择集合地点"
          filterable
          allow-create
          remote
          v-if="editAddress">
          <el-option
            v-for="item in checkBoxItemSite"
            :key="item.id"
            :label="item.paramName"
            :value="item.paramName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路主题" prop="ThemesArr">
        <el-checkbox-group v-model="ruleForm.ThemesArr">
          <el-checkbox :label="item.id+''" v-for="item in checkBoxItemTheme">{{item.paramName}}</el-checkbox>
        </el-checkbox-group>
        <span v-show="checkBoxItemTheme.length==0">暂无数据</span>
      </el-form-item>
      <el-form-item label="标签设置">
        <el-select
          v-model="ruleForm.TagArr"
          multiple placeholder="请选择标签"
        filterable
          remote>
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.paramName"
            :value="item.paramName">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="标签设置" prop="label">
        <el-input
          class="input-new-tag"
          inputVisible="true"
          v-model="inputValue"
          ref="saveTagInput"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button class="button-new-tag" @click="showInput" type="primary" icon="el-icon-plus">添加</el-button>
      </el-form-item>
      <el-form-item class="margin_none">
        <el-tag
          :key="tag"
          v-for="tag in ruleForm.TagArr"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
      </el-form-item> -->
       <el-form-item label="上传图片" prop="ImageList">
        <span>（图片格式为jpg/png/bmp，最大为2M，至少上传1张，最多为8张。）</span>
        <div class="upload-list">
          <div class="thumb-img" v-for="item in ruleForm.ImageList" :key="item.url">
            <div class="img">
              <img :src="item.url.includes('http')?item.url:imgBaseUrl+item.url" alt="">
            </div>
            <div class="input">
              <div><el-checkbox v-model="item.isMain">主图</el-checkbox><el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button><el-button type="text" @click="handlePictureCardPreview(item.url)">放大</el-button></div>
              <el-input v-model="item.name" size="mini" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <el-upload
            action="/image/upload"
            list-type="picture-card"
            :http-request="imgUpload"
            :show-file-list="false"
            :file-list="ruleForm.ImageList"
            :limit="8"
            :multiple="true"
            accept="image/jpeg,image/png,image/bmp"
            :before-upload="beforeAvatarUpload"
            class="upload-btn"
            v-show="ruleForm.ImageList.length < 8"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="产品经理推荐" prop="RecommendDesc">
        <el-input type="textarea" v-model="ruleForm.RecommendDesc" :rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading='btn_loading'>保存</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .margin_none {
    margin-bottom: 0px;
  }

  .el-textarea {
    width: 55%;
  }

  .el-input {
    width: 200px;
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
</style>
<script>
  export default{
    data() {
      var checkTripDays = (rule, value, callback) => {
        if (!value) {
          callback(new Error('行程天数不能为空'));
        } else if (Number(value)>40) {
          callback(new Error('行程天数不能大于40'));
        } else if (toString(value).indexOf('.') > 0 || !Number.isInteger(Number(value))) {
          callback(new Error('行程天数只能输入整数'));
        } else if (value == 0) {
          callback(new Error('行程天数至少为1天'))
        } else {
          callback()
        }
      }
      var checkFullName = (rule, value, callback) => {
        value = value.replace(/^\s*|\s*$/g, '');
        if (!value) {
          callback(new Error('线路名称不能为空'));
        }
        //  else if (!/^[^ ]+$/.test(value)) {
        //   callback(new Error('线路名称不能含有空格'));
        // }
         else {
          callback()
        }
      }
      var checkRecommendDesc = (rule, value, callback) => {
        value = value.replace(/^\s*|\s*$/g, '');
        if (!value) {
          callback(new Error('推荐不能为空'));
        } else {
          callback()
        }
      }
      var checkLabel = (rule, value, callback) => {
        if (this.ruleForm.TagArr.length == 0) {
          callback(new Error('请添加标签'));
        } else {
          callback()
        }
      }
      return {
        editType: false,
        editMode: false,
        editAddress: false,
        fullscreenLoading:false,
        linemode: '',
        linetype: '',
        lineaddress: '',
        btn_loading: false,
        inputValue: '',
        dialogImageUrl: '',
        dialogVisible: false,
        checkBoxItemType: [],
        checkBoxItemMode: [],
        checkBoxItemTheme: [],
        checkBoxItemSite: [],
        tagList: [],
        radioRule: [],
        supplierList: [],
        ruleForm: {
          Id:this.$route.query.lineId,
          FullName: '',
          ShortName: '',
          EnumGroupLineType: '',
          EnumGroupLineMode: '',
          TripDays: '',
          ConfirmType: '',
          RecommendDesc: '',
          TagArr: [],
          ThemesArr: [],
          label: '',
          GatherAddressArr: [],
          GatherAddressDescArr: [],
          ImageList: [
          ],
        },
        rules: {
          FullName: [
            {required: true, validator: checkFullName, trigger: 'blur'}
          ],
          EnumGroupLineType: [
            {type: 'number', required: true, message: '请选择线路类型', trigger: 'change'}
          ],
          EnumGroupLineMode: [
            {type: 'number', required: true, message: '请选择组团方式', trigger: 'change'}
          ],
          TripDays: [
            {required: true, validator: checkTripDays, trigger: 'blur'}
          ],
          GatherAddressDescArr: [
            {type: 'array', required: true, message: '请输入地点', trigger: 'blur'}
          ],
          ThemesArr: [
            {type: 'array', required: true, message: '请至少选择一个主题', trigger: 'change'}
          ],
          ConfirmType: [
            {required: true, message: '请确认规则', trigger: 'change'}
          ],
          RecommendDesc: [
            {required: true, validator: checkRecommendDesc, trigger: 'blur'}
          ],
          ImageList: [
            {required: true, type: 'array', required: true, message: '请上传图片', trigger: 'change'}
          ]
        }
      };
    },
    watch:{
      ruleForm:{
        handler:function (val) {
          let arr =[];
          val.ImageList.forEach((item,index)=>{
            if(item.isMain == true){
              arr.push(item)
              if(arr.length>1){
                this.$message.error('您已选择主图')
                val.ImageList[index].isMain = false;
              }
            }
          })

        },
        deep:true
      }
    },
    mounted(){
      this.groupHttp.post('/GroupLine/GetEnumConfirmType').then((res) => {
        this.radioRule = res.data;
      }).catch((e) => {
        console.log(e)
      });
      this.groupHttp.post('/GroupLine/GetGroupLineParamList', {ParamType: 1})
        .then((res) => {
          this.checkBoxItemTheme = res.data.objects;
        }).catch((e) => {
        console.log(e)
      })
      this.getLineInfo();
      this.getImgList()
      this.getTagList()
      this.TypeAjax(2);
      this.ModeAjax();
      this.getGroupLineTypeList();
    },
    methods: {
      //获取图片
      getImgList(){
        this.groupHttp.get('/GroupLine/LineInfoPicture?LineId=' + this.$route.query.lineId).then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach((item, index) => {
              this.ruleForm.ImageList = res.data.objects
              this.ruleForm.ImageList[index].url = item.path 
              this.ruleForm.ImageList[index].key = item.path 
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(e => {

        })
      },
      getLineInfo(){
        this.fullscreenLoading = true;
        this.groupHttp.post('/GroupLine/LineInfo', {LineId: this.$route.query.lineId}).then(res => {
          if (res.data.isSuccess == true) {
            this.ruleForm.FullName = res.data.dtoObject.fullName
            this.ruleForm.ShortName = res.data.dtoObject.shortName
            this.ruleForm.EnumGroupLineType = res.data.dtoObject.enumGroupLineType;
            this.linetype = res.data.dtoObject.enumGroupLineTypeDesc;
            this.ruleForm.EnumGroupLineMode = res.data.dtoObject.enumGroupLineMode
            this.linemode = res.data.dtoObject.enumGroupLineModeDesc
            this.ruleForm.TripDays = res.data.dtoObject.tripDays
            this.ruleForm.ConfirmType = JSON.stringify(res.data.dtoObject.confirmType)
            this.ruleForm.RecommendDesc = res.data.dtoObject.recommendDesc
            if(res.data.dtoObject.tag ==null || res.data.dtoObject.tag== ""){
              this.ruleForm.TagArr = [];
            }else{
              this.ruleForm.TagArr = res.data.dtoObject.tag.split(',');
            }
            this.ruleForm.GatherAddressArr = res.data.dtoObject.gatherAddress.split(',');
            this.ruleForm.GatherAddressDescArr = res.data.dtoObject.gatherAddressDesc.split(',');
            this.lineaddress = res.data.dtoObject.gatherAddressDesc;
            this.ruleForm.ThemesArr = res.data.dtoObject.themes.split(',');
            this.fullscreenLoading = false;
          } 
        }).catch(e=>{
            this.fullscreenLoading = false;
        })
      },
      newLineType(){
        this.editType = true;
        this.ruleForm.EnumGroupLineType = '';
      },
      newLineMode(){
        this.editMode = true;
        this.ruleForm.EnumGroupLineMode = '';
      },
      newAddress(){
        this.editAddress = true;
        this.ruleForm.GatherAddressDescArr = [];
        this.ruleForm.GatherAddressArr = [];
      },
      onContentChange (data) {
        this.ruleForm.RecommendDesc = data.value
      },
      getTagList(){
        this.groupHttp.post('/GroupLine/GetGroupLineParamList', {ParamType: 5})
              .then((res) => {
                this.tagList = res.data.objects;
              }).catch((e) => {
              console.log(e)
            })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btn_loading = true;
            if (this.editAddress == true) {
              this.checkBoxItemSite.forEach((item, index) => {
                if (this.ruleForm.GatherAddressArr.indexOf(item.id) > -1 && this.ruleForm.GatherAddressDescArr.indexOf(item.paramName)==-1) {
                  this.ruleForm.GatherAddressDescArr.push(item.paramName)
                }
              })
            }
            var mainImg = false;//是否有主图
            this.ruleForm.ImageList.forEach((item, index) => {//循环判断是否选择了主图
              if (item.isMain == true) {
                mainImg = true;
                return false;
              }
            })
            if (mainImg == false) {//如果没有选择主图则默认选择第一张图为主图
              this.ruleForm.ImageList[0].isMain = true;
            }
             
            this.groupHttp.post('/GroupLine/Save', {IsInsert: false, Dto: this.ruleForm}).then((res) => {
              if (res.data.isSuccess == true) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.btn_loading = false;
              } else {
                this.$message.error(res.data.message)
                setTimeout(() => {
                  this.btn_loading = false;
                }, 3000)
              }
            }).catch((e) => {
              console.log(e)
            })

          } else {
            return false;
          }
        });
      },
      goBack() {
        this.$router.push({
          path: '/grouptour/RouteTable'
        })
      },
      handleClose(tag) {
        this.ruleForm.TagArr.splice(this.ruleForm.TagArr.indexOf(tag), 1);
      },

      showInput() {
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue.replace(/^\s*|\s*$/g, '');
        ;
        if (inputValue.length > 5) {
          this.$message({
            type: 'info',
            message: '标签不能过长'
          })
        } else if (inputValue.length > 0) {
          this.ruleForm.TagArr.push(inputValue);
        }
        this.inputValue = '';
      },
      //图片删除
      handleRemove(uid) {
        this.ruleForm.ImageList.forEach((item, index) => {
          if (item.uid == uid) {
            this.ruleForm.ImageList.splice(index, 1)
          }
        })
      },
      handlePictureCardPreview(url) {
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
            this.ruleForm.ImageList.push({
              name: res.data.formerName,
              key: res.data.url,
              url: res.data.url
            })
            if (res.data.state == false) {
              this.$message.error(res.data.message);
            }
          })
      },
//      限制图片
      beforeAvatarUpload(file) {
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
      //基本信息接口
        getGroupLineTypeList() {
        this.groupHttp
          .post("/GroupLine/GetGroupLineTypeList")
          .then(res => {
            if (res.data.isSuccess == true) {
              this.checkBoxItemType = res.data.objects;
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      ModeAjax(open, close){
        this.groupHttp.post('/GroupLine/GetEnumGroupLineModeList', {})
          .then((res) => {
            this.checkBoxItemMode = res.data.keyValueList;
          }).catch((e) => {
          console.log(e)
        })
      },
      TypeAjax(type) {
          this.groupHttp
            .post("/GroupLine/GetGroupLineParamList", { ParamType: type })
            .then(res => {
              this.checkBoxItemSite = res.data.objects;
            })
            .catch(e => {
              console.log(e);
            });
        }
    }
  }
</script>
