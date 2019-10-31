<template>
  <div class="view">
    <el-header>
      <el-steps :active="1" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" class="demo-infoForm" size="small">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="infoForm.name" class="inp_width"></el-input>
      </el-form-item>
      <el-form-item label="产品简称" prop="shortName">
        <el-input v-model="infoForm.shortName" class="inp_width"></el-input>
      </el-form-item>
          <el-form-item label="内部编码">
            <el-input v-model="infoForm.nbCoding"></el-input>
          </el-form-item>
      <el-form-item label="产品所在地" prop="address">
        <address-select width="200px" :data-type="AirlineType" @result="addressResult"
                        class="address_width" ref="addressSelect"></address-select>
      </el-form-item>
      <el-form-item label="票种" prop="variety">
        <el-select v-model="infoForm.variety" placeholder="请选择票种">
          <el-option
            v-for="item in ticketType"
            :key="item.id"
            :label="item.dicdata_Name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应景点" prop="tags">
        <el-tag
          v-for="tag in infoForm.tags"
          :key="tag.key"
          closable
          @close="handleClose(tag.key)"
          >
          {{tag.value}}
        </el-tag>
        <el-button  size="small" @click="showTable">添加</el-button>
      </el-form-item>
      <el-form-item label="适用人群" prop="personExplain">
        <el-input type="textarea" v-model="infoForm.personExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="营业时间说明" prop="dateExplain">
        <el-input type="textarea" v-model="infoForm.dateExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="产品包含人数" prop="person">
        成人：<el-input v-model="infoForm.person"></el-input> 人，儿童<el-input v-model="infoForm.children"></el-input>人
        <p class="margin_0px">1件产品对应的人数，例如情侣套餐预订1件对应的是2人。</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveInfo('infoForm')" :loading="loading">保存，下一步</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择景点" :visible.sync="productionVisible" width="800px">
      <span>景点所在地:</span>
        <address-select width="200px" :data-type="AirlineType" @result="addressResult1"
                        class="address_width el-input--small"></address-select>
      <el-input  v-model="scenicName" placeholder="景点名称" size='small'></el-input>
      <el-button type="primary" size='small' @click='queryData'>查询</el-button>
      <el-table size="mini" ref='queryTable' border :data="queryTable" class='queryTable' @selection-change="querySelectionChange">
        <el-table-column size="small"  align="center" type="selection" width="55"></el-table-column>
        <el-table-column size="small" prop="scenicName" label="景点名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column size="small" prop="tel" label="联系电话" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column size="small" prop="address" label="地址" align="center"  show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          fixed="right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5,10, 20, 30]"
          :page-size='pageSize'
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-button type="primary" size='small' @click='confirmSelect()' class='confirmSelect'>确认选择</el-button>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-textarea {
  width: 55%;
}
.el-input {
  width: 200px;
}
.inp_width.el-input {
  width: 510px;
}
.el-col.el-col-5 {
  width: 310px;
}
.queryTable {
  width: 100%;
  margin: 15px 0;
}
.confirmSelect {
  margin-left: 350px;
}
</style>

<script>
import addressSelect from "@/components/address-select/index";
export default {
  components: { addressSelect },
  data() {
    let checkAdress = (rule, value, callback) => {
      console.log(value);
      if (value === "") {
        return callback(new Error("请选择地址"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      productionVisible: false,
      provinceId: "",
      cityId: "",
      pageSize: 5,
      pageIndex: 1,
      total: "",
      scenicName: "",
      multipleSelection: [],
      scenicsArr:[],
      queryTable: [],
      AirlineType: "Domestic",
      infoForm: {
        productId: 0,
        name: "",
        shortName: "",
        nbCoding: "",
        provinceID: "",
        provinceName: "",
        address: "",
        cityname: "",
        variety: "",
        tags: [],
        personExplain: "",
        dateExplain: "",
        person: "",
        children: 0
      },
      ticketType: [],
      inputVisible: false,
      inputValue: "",
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        shortName: [
          { required: true, message: "请输入产品简称", trigger: "blur" }
        ],
        address: [
          { required: true, validator: checkAdress, trigger: "change" }
        ],
        variety: [{ required: true, message: "请选择票种", trigger: "change" }],
        dynamicTags: [
          {
            type: "array",
            required: true,
            message: "请选择票种",
            trigger: "change"
          }
        ],
        personExplain: [
          { required: true, message: "请填写适用人群说明", trigger: "blur" }
        ],
        dateExplain: [
          { required: true, message: "请填写营业时间说明", trigger: "blur" }
        ],
        person: [{ required: true, message: "请填写人数", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.queryData();
    //获取票种
    this.ticketHttp
      .get("DictionaryData/GetDictionaryData?Type=1004")
      .then(res => {
        if (res.data.isSuccess == true) {
          this.ticketType = res.data.objects;
        } else {
          this.$message.error(res.data.message);
        }
      })
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    addressResult({ first, second }) {
      this.infoForm.address = second.id;
      this.infoForm.cityName = second.name;
      this.infoForm.provinceID = first.id;
      this.infoForm.provinceName = first.name;
    },
    addressResult1({ first, second }) {
      this.cityId = second.id;
      this.provinceID = first.id;
    },
    saveInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let classifyName = "";
          this.ticketType.forEach(item => {
            if (item.id == this.infoForm.variety) {
              classifyName = item.dicdata_Name;
            }
          });
          this.ticketHttp
            .post("TicketProduct/SaveProductBaseInfo", {
              ProductId: this.infoForm.productId,
              ProductName: this.infoForm.name,
              ShortName: this.infoForm.shortName,
              InternalNo: this.infoForm.nbCoding,
              ProductClassify: this.infoForm.variety,
              scenics: this.scenicsArr,
              ProductType: 1,
              ProvinceID: this.infoForm.provinceID,
              ProvinceName: this.infoForm.provinceName,
              CityID: this.infoForm.address,
              CityName: this.infoForm.cityName,
              ForPeople: this.infoForm.personExplain,
              BusinessHours: this.infoForm.dateExplain,
              AdultNum: this.infoForm.person,
              ChildNum: this.infoForm.children,
              ClassifyName: classifyName
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.infoForm.productId = res.data.productId;
                this.$router.push({
                  path: "/Tickets/ticketsMarket",
                  query: { productId: res.data.productId }
                });
              } else {
                this.loading = false;
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              this.loading = false;
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //全选
    querySelectionChange(val) {
      this.multipleSelection = val;
    },
    queryData() {
      this.ticketHttp
        .get("TicketScenic/GetScenicPageList", {
          params: {
            ScenicName: this.scenicName,
            ProvinceID: this.provinceID,
            CityID: this.cityId,
            PageSize: this.pageSize,
            PageIndex: this.pageIndex
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.total = res.data.total;
            this.queryTable = res.data.objects;
          }
        });
    },
    //添加产品
    confirmSelect() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "您还未选择产品"
        });
        return;
      } else {
        this.multipleSelection.forEach((item, index) => {
        this.infoForm.tags[index] = {
          key: item.scenicId,
          value: item.scenicName
        };
        this.scenicsArr[index] = item.scenicId;
      });
        setTimeout(() => {
          this.productionVisible = false;
        }, 500);
      }
    },
    //删除标签
    handleClose(key){
      this.scenicsArr.forEach((item,index)=>{
        if(item == key){
          this.scenicsArr.splice(index,1)
          this.infoForm.tags.splice(index,1)
        }
      })
    },
    showTable() {
      this.productionVisible = true;
      this.infoForm.tags = [];
      this.multipleSelection = [];
      this.$refs.queryTable.clearSelection();
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.queryData()
    }
  }
};
</script>
