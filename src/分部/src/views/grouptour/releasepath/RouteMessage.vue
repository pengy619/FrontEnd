<template>
  <div class="view">
    <el-header>
      <el-steps :active="1" align-center class="ui-step">
        <el-step title="线路信息" description></el-step>
        <el-step title="行程信息" description></el-step>
        <el-step title="小项目" description></el-step>
        <el-step title="预订说明" description></el-step>
        <el-step title="上传附件" description></el-step>
        <el-step title="特殊人群限制" description></el-step>
        <el-step title="退款说明"></el-step>
      </el-steps>
    </el-header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="demo-ruleForm"
      size="small"
    >
      <el-form-item label="线路名称" prop="FullName">
        <el-input
          type="textarea"
          autosize
          v-model="ruleForm.FullName"
          class="input_comm"
          :maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="keyWordO" class="input"></el-input>
        <el-input v-model="keyWordT" class="input"></el-input>
        <el-input v-model="keyWordS" class="input"></el-input>
      </el-form-item>
      <el-form-item label="线路简称" prop="ShortName">
        <el-input v-model="ruleForm.ShortName"></el-input>
      </el-form-item>
      <el-form-item label="线路类型" prop="EnumGroupLineType">
        <el-select v-model="ruleForm.EnumGroupLineType" placeholder="选择线路类型">
          <el-option
            :key="item.id"
            :label="item.paramName"
            :value="item.id+''"
            v-for="item in checkBoxItemType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组团方式" prop="EnumGroupLineMode">
        <el-select v-model="ruleForm.EnumGroupLineMode" placeholder="选择组团方式">
          <el-option
            :label="item.name"
            :value="item.key+''"
            v-for="item in checkBoxItemMode.keyValueList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择供应商" prop="SupplierId">
        <el-select v-model="ruleForm.SupplierId" placeholder="选择供应商">
          <el-option :label="item.name" :value="item.id" v-for="item in supplierList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行程总天数" prop="TripDays">
        <el-input v-model="ruleForm.TripDays"></el-input>
      </el-form-item>
      <el-form-item label="确认规则" prop="ConfirmType">
        <el-radio-group v-model="ruleForm.ConfirmType">
          <el-radio :label="item.key" v-for="item in radioRule">{{item.value}}</el-radio>
          <span v-show="radioRule.length==0">暂无数据</span>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="集合地点" prop="GatherAddressDescArr">
        <el-select
          v-model="ruleForm.GatherAddressDescArr"
          multiple
          filterable
          allow-create
          remote
          placeholder="请选择集合地点"
          style="min-height:41px"
        >
          <el-option
            v-for="item in checkBoxItemSite"
            :key="item.id"
            :label="item.paramName"
            :value="item.paramName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路主题" prop="ThemesArr">
        <el-checkbox-group v-model="ruleForm.ThemesArr">
          <el-checkbox :label="item.id" v-for="item in checkBoxItemTheme.objects">{{item.paramName}}</el-checkbox>
        </el-checkbox-group>
        <span v-show="checkBoxItemTheme.length==0">暂无数据</span>
      </el-form-item>
      <el-form-item label="标签设置" prop="GroupLineLabelDrop">
        <el-select v-model="ruleForm.GroupLineLabelDrop" multiple placeholder="请选择标签">
          <el-option
            v-for="item in GroupLineLabel"
            :key="item.id"
            :label="item.paramName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" prop="ImageList">
        <span>（图片格式为jpg/png/bmp，最大为2M，至少上传1张，最多为8张。）</span>
        <div class="upload-list">
          <div class="thumb-img" v-for="(item,index) in ruleForm.ImageList" :key="item.url">
            <div class="img">
              <img :src="item.url.includes('http')?item.url:imgBaseUrl+item.url" alt>
            </div>
            <div>
              <div>
                <el-checkbox v-model="item.isMain">主图</el-checkbox>
                <el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
                <el-button type="text" @click="handlePictureCardPreview(item.url)">放大</el-button>
              </div>
              <el-input class="width_full" v-model="item.name" size="mini" placeholder="请输入内容"></el-input>
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
            accept="image/jpeg, image/png, image/bmp"
            :before-upload="beforeAvatarUpload"
            class="upload-btn"
            v-show="ruleForm.ImageList.length < 8"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="产品经理推荐" prop="RecommendDesc">
        <el-input type="textarea" v-model="ruleForm.RecommendDesc" :rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="btn_loading">保存，下一步</el-button>
        <!--<el-button @click="resetForm('ruleForm')">取消</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
@import "../../../style/common.scss";

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
.el-input__inner {
  height: 41px;
}

.el-input {
  width: 200px;
}
.input {
  width: 65px;
}
// .element style{
//   top: 680px;
// }
</style>
<script>
export default {
  data() {
    var checkTripDays = (rule, value, callback) => {
      if (!value) {
        callback(new Error("行程天数不能为空"));
      } else if (Number(value) > 40) {
        callback(new Error("行程天数不能大于40"));
      } else if (value.indexOf(".") > 0 || !Number.isInteger(Number(value))) {
        callback(new Error("行程天数只能输入整数"));
      } else if (value == 0) {
        callback(new Error("行程天数至少为1天"));
      } else {
        callback();
      }
    };
    var checkFullName = (rule, value, callback) => {
      value = value.replace(/^\s*|\s*$/g, "");
      if (!value) {
        callback(new Error("线路名称不能为空"));
      }
      //  else if (!/^[^ ]+$/.test(value)) {
      //   callback(new Error('线路名称不能含有空格'));
      // }
      else {
        callback();
      }
    };
    //var checkRecommendDesc = (rule, value, callback) => {
    //  value = value.replace(/^\s*|\s*$/g, '');
    //  if (!value) {
    //    callback(new Error('推荐不能为空'));
    //  } else {
    //    callback()
    //  }
    // }
    // var checkLabel = (rule, value, callback) => {
    //   if (this.ruleForm.TagArr.length == 0) {
    //     callback(new Error('请添加标签'));
    //   } else {
    //     callback()
    //   }
    // }
    return {
      filterable: true,
      keyWordO: "",
      keyWordT: "",
      keyWordS: "",
      btn_loading: false,
      inputValue: "",
      supplierList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      checkBoxItemType: [],
      GroupLineLabel: [],
      checkBoxItemMode: [],
      checkBoxItemTheme: [],
      checkBoxItemSite: [],
      radioRule: [],
      ruleForm: {
        SupplierId: "",
        FullName: "",
        ShortName: "",
        EnumGroupLineType: "",
        EnumGroupLineMode: "",
        TripDays: "",
        ConfirmType: "",
        RecommendDesc: "",
        TagArr: [],
        ThemesArr: [],
        GatherAddressArr: [],
        GatherAddressDescArr: [],
        ImageList: [],
        KeyWords: []
      },
      rules: {
        FullName: [
          { required: true, validator: checkFullName, trigger: "blur" }
        ],
        EnumGroupLineType: [
          { required: true, message: "请选择线路类型", trigger: "change" }
        ],
        EnumGroupLineMode: [
          { required: true, message: "请选择组团方式", trigger: "change" }
        ],
        TripDays: [
          { required: true, validator: checkTripDays, trigger: "blur" }
        ],
        GatherAddressDescArr: [
          {
            type: "array",
            required: true,
            message: "请输入地点",
            trigger: "change"
          }
        ],
        ThemesArr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个主题",
            trigger: "change"
          }
        ],
        SupplierId: [
          {
            type: "number",
            required: true,
            message: "请选择供应商",
            trigger: "change"
          }
        ],
        ConfirmType: [
          { required: true, message: "请确认规则", trigger: "change" }
        ],
        ImageList: [
          {
            required: true,
            type: "array",
            required: true,
            message: "请上传图片",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.groupHttp
      .post("GroupLine/GetEnumConfirmType")
      .then(res => {
        this.radioRule = res.data;
      })
      .catch(e => {
        console.log(e);
      });
    this.groupHttp
      .post("/GroupLine/GetGroupLineParamList", { ParamType: 1 })
      .then(res => {
        this.checkBoxItemTheme = res.data;
        console.log(this.checkBoxItemTheme);
      })
      .catch(e => {
        console.log(e);
      });
    this.GetSelfSupplier();
    this.TypeAjax(5);
    this.TypeAjax(2);
    this.getGroupLineTypeList();
    this.ModeAjax(); //组团方式
  },
  watch: {
    ruleForm: {
      handler: function(val) {
        let arr = [];
        val.ImageList.forEach((item, index) => {
          if (item.isMain == true) {
            arr.push(item);
            if (arr.length > 1) {
              this.$message.error("您已选择主图");
              val.ImageList[index].isMain = false;
            }
          }
        });
      },
      deep: true
    }
  },
  methods: {
    //获取供应商
    GetSelfSupplier() {
      this.groupHttp
        .post("/Supplier/GetSelfSupplierList")
        .then(res => {
          this.supplierList = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    onContentChange(data) {
      this.ruleForm.RecommendDesc = data.value;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.KeyWords = [
            this.keyWordO,
            this.keyWordT,
            this.keyWordS
          ];
          this.btn_loading = true;
          this.GroupLineLabel.forEach((item, index) => {
            if (this.ruleForm.GroupLineLabelDrop.indexOf(item.id) > -1) {
              this.ruleForm.TagArr.push(item.paramName);
            }
          });
          if (this.ruleForm.TagArr.length == 0) {
            this.ruleForm.TagArr = null;
          }
          // this.checkBoxItemSite.forEach((item, index) => {
          //   if (this.ruleForm.GatherAddressDescArr.indexOf(item.id) > -1) {
          //     this.ruleForm.GatherAddressDescArr.push(item.paramName)
          //   }
          // });

          var mainImg = false; //是否有主图
          this.ruleForm.ImageList.forEach((item, index) => {
            //循环判断是否选择了主图
            if (item.isMain == true) {
              mainImg = true;
              return false;
            }
          });
          if (mainImg == false) {
            //如果没有选择主图则默认选择第一张图为主图
            this.ruleForm.ImageList[0].isMain = true;
          }

          this.groupHttp
            .post("/GroupLine/Save", { IsInsert: true, Dto: this.ruleForm })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.btn_loading = false;
                setTimeout(() => {
                  //this.$router.push({path:'/grouptour/JourneyMessage/',query: { lineId: res.data.lineId,lineTypeId:this.ruleForm.EnumGroupLineType}})
                  var url = location.href.substring(
                    0,
                    location.href.indexOf("grouptour")
                  );
                  location.replace(
                    url +
                      "grouptour/JourneyMessage?lineId=" +
                      res.data.lineId +
                      "&lineTypeId=" +
                      this.ruleForm.EnumGroupLineType +
                      "&tripDays=" +
                      this.ruleForm.TripDays
                  );
                  location.reload();
                }, 500);
              } else {
                this.$message.error(res.data.message);
                setTimeout(() => {
                  this.btn_loading = false;
                }, 500);
              }
            })
            .catch(e => {
              console.log(e);
            });
        } else {
          return false;
        }
      });
    },
    handleClose(tag) {
      this.ruleForm.TagArr.splice(this.ruleForm.TagArr.indexOf(tag), 1);
    },
    showInput() {
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //图片删除
    handleRemove(uid) {
      this.ruleForm.ImageList.forEach((item, index) => {
        if (item.uid == uid) {
          this.ruleForm.ImageList.splice(index, 1);
        }
      });
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    imgUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      f.append("Category", "AirTicket");
      f.append("thumbnail", true);
      f.append("Folder", "Airline");
      this.fileUpload.post(val.action, f).then(res => {
        this.ruleForm.ImageList.push({
          name: res.data.formerName,
          key: res.data.url,
          url: res.data.url,
          uid: val.file.uid,
          isMain: false
        });
        if (res.data.state == false) {
          this.$message.error(res.data.message);
        }
      });
    },
    //      限制图片
    beforeAvatarUpload(file) {
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    //基本信息接口
    ModeAjax() {
      this.groupHttp
        .post("/GroupLine/GetEnumGroupLineModeList", {})
        .then(res => {
          this.checkBoxItemMode = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取线路分类
    getGroupLineTypeList() {
      this.groupHttp
        .post("/GroupLine/GetGroupLineTypeList")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.checkBoxItemType = res.data.objects;
            console.log(this.checkBoxItemType);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    TypeAjax(type) {
      this.groupHttp
        .post("/GroupLine/GetGroupLineParamList", { ParamType: type })
        .then(res => {
          if (type == 2) {
            this.checkBoxItemSite = res.data.objects;
          }
          if (type == 5) {
            this.GroupLineLabel = res.data.objects;
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
