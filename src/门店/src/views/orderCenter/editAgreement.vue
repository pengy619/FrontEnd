<template>
  <div class="view" v-if="obj">
    <h3 class="text-center">{{obj.contractTemplateName}}</h3>
    <div class="margin_bottom">
      <el-button size="small" type="primary" @click="addPassenger">添加游客</el-button>
    </div>
    <el-table :data="form.SignerList" border>
      <el-table-column prop="SignerDesc" label="角色" width="150"></el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.OutUserName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.OutMobile"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="deletePassenger(scope.row,scope.$index)"
            v-if="scope.row.canDelete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="margin_top">
      <h4>合同需填信息</h4>
      <el-row>
        <el-form label-width="241px" size="small">
          <el-col
            :span="item.tableJson.InputType!='T'?12:24"
            v-for="(item,index) in obj.templateJsonValList"
            :key="index"
          >
            <el-form-item
              :label="item.tableJson.labelName"
              :label-width="item.tableJson.InputType!='T'?'241px':'80px'"
            >
              <el-input
                v-model="item.tableJson.InputDefaultValue"
                v-if="item.tableJson.InputType=='A'"
                class="input_comm"
              ></el-input>
              <el-date-picker
                v-model="item.tableJson.InputDefaultValue"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                size="small"
                :id="'date'+index"
                v-else-if="item.tableJson.InputType=='D'"
              ></el-date-picker>

              <div v-else-if="item.tableJson.InputType=='T'">
                <div class="margin_bottom">
                  <el-button type="primary" @click="addRow(index)" size="small">新增</el-button>
                </div>
                <el-table :data="item.tableJson.tableArr" border>
                  <el-table-column label="操作" width="50" fixed>
                    <template slot-scope="scope">
                      <el-button type="text" @click="deleteRow(index,scope.$index)" size="mini">删除</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="item2"
                    v-for="(item2,index) in item.tableJson.InputDefaultValue"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row['value'+index]"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="margin_top">
      <el-button @click="submit" :loading="loading">发起</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      obj: null,
      tableArr: [],
      form: {
        OrderNo: "",
        ContractNo: "",
        SignerList: [],
        HgyList: [],
        IsOfflineOrder: false,
        AttrachmentUrl: "",
        IsRemark: false
      }
    };
  },
  mounted() {
    this.form.OrderNo = this.$route.params.id;
    this.getTemplate();
  },
  methods: {
    //添加游客
    addPassenger() {
      let obj = {
        SignerDesc: "游客",
        SignerID: this.passengerId,
        OutUserCode: this.outUserCode,
        OutUserName: "",
        OutIdCardNo: "",
        OutMobile: "",
        canDelete: true
      };
      this.form.SignerList.splice(-1, 0, obj);
    },
    deletePassenger(row, index) {
      this.form.SignerList.splice(index, 1);
    },
    getTemplate() {
      this.shopHttp
        .get("Contract/GetAgreementTemplate", {
          params: {
            OrderNo: this.$route.params.id,
            IsOfflineOrder: false,
            IsRemark: true
          }
        })
        .then(res => {
          if(res.data.isSuccess == false){
            this.$message.error(res.data.message)
          }else{
            let objects = res.data.objects[0];
            this.obj = res.data.objects[0];
            this.obj.templateJsonValList.map(item => {
              item.tableJson = JSON.parse(item.tableJson);
              let len = item.tableJson.InputKey.search(/_\d\d/g);
              if (len > -1) {
                item.tableJson.labelName = item.tableJson.InputKey.substr(
                  len + 3
                );
              }
              if (item.tableJson.InputType == "T") {
                item.tableJson.tableArr = [];
                let newItem = {};
                item.tableJson.InputDefaultValue.forEach((r, i) => {
                  newItem["value" + i] = "";
                });
                item.tableJson.tableArr.push(newItem);
              }
              return item;
            });
            if (objects.signerList.length > 0) {
              objects.signerList.forEach((item, index) => {
                if (index == 0) {
                  this.passengerId = item.signerID;
                  this.outUserCode = item.outUserCode;
                }
                let obj = {
                  SignerDesc: item.signerDesc,
                  SignerID: item.signerID,
                  OutUserCode: item.outUserCode,
                  OutUserName: item.outUserName,
                  OutIdCardNo: item.outIdCardNo,
                  OutMobile: item.outMobile,
                  Email: item.email
                };
                this.form.SignerList.push(obj);
              });
            }
          }
        });
    },
    addRow(i) {
      let newItem = {};
      this.obj.templateJsonValList[i].tableJson.InputDefaultValue.forEach(
        (r, m) => {
          newItem["value" + m] = "";
        }
      );
      this.obj.templateJsonValList[i].tableJson.tableArr.push(newItem);
    },
    deleteRow(row, i) {
      this.obj.templateJsonValList[row].tableJson.tableArr.splice(i, 1);
    },
    submit() {
      this.loading = true;
      let arr = [];
      this.obj.templateJsonValList.forEach(item => {
        let i = {
          InputKey: item.tableJson.InputKey,
          InputValues: []
        };
        if (item.tableJson.InputType == "T") {
          item.tableJson.tableArr.forEach(item2 => {
            let num = 0;
            for (let k in item2) {
              i.InputValues.push(item2["value" + num]);
              num++;
            }
          });
          i.InputValues = JSON.stringify(i.InputValues);
        } else {
          i.InputValues.push(item.tableJson.InputDefaultValue);
        }
        arr.push(i);
      });
      this.form.HgyList = arr;
      let boole;
      this.form.SignerList.forEach(item =>{
        item.OutUserName = item.OutUserName.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
        item.OutMobile = item.OutMobile.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
      })
        this.shopHttp.post("Contract/SignAgreement", this.form).then(res => {
        if (res.data.isSuccess == true) {
          this.loading = false;
          this.$message({
            type: "success",
            message: "合同生成成功"
          });
          this.$router.go(-1);
        } else {
          this.loading = false;
          this.$message.error("出错了:" + res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
