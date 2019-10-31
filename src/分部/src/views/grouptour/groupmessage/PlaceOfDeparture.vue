<template>
  <div class="view">
    <h4>出发设置地</h4>
    <div class="groupTable">
      <el-button type="primary" @click="dialogFormVisible = true" size='small'>设置多出发地</el-button>
      <el-table
        :data="groupTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
        class="margin_top"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="100"
          prop="sortId"
        >
        </el-table-column>
        <el-table-column
          label="出发城市"
          prop="sourceCityName"
        >
        </el-table-column>
        <!-- <el-table-column
          label="同行成人"
          prop="thPrice"
        >
        </el-table-column>
        <el-table-column
          label="直客成人"
          prop="zkPrice"
        >
        </el-table-column> -->
        <el-table-column
          label="直客销售价(元)"
          prop="mdPrice"
        >
        </el-table-column>
        <!-- <el-table-column
          label="内部成人"
          prop="nbPrice"
        >
        </el-table-column> -->
        <!-- <el-table-column
          label="加盟结算价(元)"
          prop="league"
        >
        </el-table-column> -->
        <el-table-column
          label="媒体外卖价(元)"
          prop="zkPrice"
        >
        </el-table-column>
        <el-table-column
          label="同行结算价(元)"
          prop="cost"
        >
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">日历模式
            </el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="listDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data = 'pagination'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>

    <el-dialog title=""  :visible.sync="dialogFormVisible" width="800px">
      <el-form :label-width="formLabelWidth" size="small" :inline="true">
        <el-form-item label="出发地">
          <address-select width="60%" :data-type="AirlineType" @result="addressResult"
                          class="address_width" ref= 'addressSelect'></address-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="currency" placeholder="请选择" @visible-change="seleCurrency">
            <el-option
              v-for="item in currencyOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style='margin-left:130px;width:100%;'>
          <el-tag
            v-for="(tag,index) in CityName"
            :key="index"
            closable
            @close="handleClose(tag,index)"
          >
            {{tag}}
          </el-tag>
        </el-form-item>
      </el-form>
      <el-table :data="PriceList" border style="width: 100%">
        <el-table-column prop="priceName" label="" width="180">
        </el-table-column>
        <el-table-column width="80" align="center">
          <template slot-scope="scope">
            <el-button  size="small" @click="handleCopy(scope.row)">复制</el-button>
            <!-- <el-input v-model="scope.row.Price" size="small"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="成人">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Price" @change="handleChangePrice(scope.row,scope.row.Price,'Price')" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="OldPrice" label="老人">
          <template slot-scope="scope">
            <el-input v-model="scope.row.OldPrice" @change="handleChangePrice(scope.row,scope.row.OldPrice,'OldPrice')"  size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ChildPrice" label="儿童">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ChildPrice" @change="handleChangePrice(scope.row,scope.row.ChildPrice,'ChildPrice')"  size="small"></el-input>
          </template>
        </el-table-column>
        <!--<el-table-column prop="BabyPrice" label="婴儿">
          <template slot-scope="scope">
            <el-input v-model="scope.row.BabyPrice" @change="handleChangePrice(scope.row,scope.row.BabyPrice,'BabyPrice')"  size="small"></el-input>
          </template>
        </el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePrice" :loading='btn_loading'>保存</el-button>
        <el-button @click="cancelAction">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
@import "../../../style/common.scss";
.el-form-item {
  width: 47%;
}
.r_texe {
  text-align: right;
}
.el-cascader--small {
  line-height: 18px;
  display: inline;
}
.el-pagination {
  margin-top: 20px;
}

.el-form-item__content {
  .el-col-4 {
    text-align: center;
    font-weight: 700;
  }

  .addressinp_width {
    width: 70%;
  }

  .address_width {
    width: 25% !important;
  }

  .el-col-5 {
    text-align: center;
    font-weight: 700;
  }
  .el-tag {
    margin-right: 3px;
  }
}
</style>
<script>
import addressSelect from "@/components/address-select/index";
export default {
  components: { addressSelect },
  data() {
    return {
      btn_loading: false,
      currencyOptions: [],
      AirlineType: "Domestic",
      LineId: this.$route.query.lineId,
      CityId: [],
      CityName: [],
      currency: "",
      groupTable: [],
      tableLoading: false,
      dialogFormVisible: false,
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      PriceList: [ {
          priceName: "直客销售价(元)",
          CurrencyType: "",
          PriceType: 5,
          Price: "",
          OldPrice: "",
          ChildPrice: "",
         
        },{
          priceName: "同行结算价(元)",
          CurrencyType: "",
          PriceType: 1,
          Price: "",
          OldPrice: "",
          ChildPrice: "",
          
        },
         {
          priceName: "媒体外卖价(元)",
          CurrencyType: "",
          PriceType: 2,
          Price: "",
          OldPrice: "",
          ChildPrice: "",
          
        },
        // {
        //   priceName: "同行价(元)",
        //   CurrencyType: "",
        //   PriceType: 3,
        //   Price: "",
        //   OldPrice: "",
        //   ChildPrice: "",
        //   BabyPrice: ""
        // },
        // {
        //   priceName: "内部价(元)",
        //   CurrencyType: "",
        //   PriceType: 6,
        //   Price: "",
        //   OldPrice: "",
        //   ChildPrice: "",
        //   BabyPrice: ""
        // }
      ],
      otherPriceList:[
       {
          priceName: "加盟结算价(元)",
          CurrencyType: "",
          PriceType: 4,
          Price:0,
          OldPrice: 0,
          ChildPrice: 0,
         
        },
        {
          priceName: "同行价(元)",
          CurrencyType: "",
          PriceType: 3,
          Price: 0,
          OldPrice: 0,
          ChildPrice: 0,
          
        },
        {
          priceName: "内部价(元)",
          CurrencyType: 0,
          PriceType: 6,
          Price: 0,
          OldPrice: 0,
          ChildPrice: 0,
         
       }],
      formLabelWidth: "130px"
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    cancelAction() {
      this.btn_loading = false;
      this.dialogFormVisible = false;
      //清空dialog
      this.CityName = [];
      this.CityId = [],
      this.currency = "";
      this.$refs.addressSelect.reset();
      this.PriceList = [
        {priceName: "直客销售价(元)",CurrencyType: "",PriceType: 5,Price: "",OldPrice: "",ChildPrice: ""},
        // {priceName: "加盟结算价(元)",CurrencyType: "",PriceType: 4,Price: "",OldPrice: "",ChildPrice: "",BabyPrice: ""},
        {priceName: "同行结算价(元)",CurrencyType: "",PriceType: 1,Price: "",OldPrice: "",ChildPrice: ""},
        {priceName: "媒体外卖价(元)",CurrencyType: "",PriceType: 2,Price: "",OldPrice: "",ChildPrice: ""},
        // {priceName: "同行价(元)",CurrencyType: "",PriceType: 3,Price: "",OldPrice: "",ChildPrice: "",BabyPrice: ""},
        // {priceName: "内部价(元)",CurrencyType: "",PriceType: 6,Price: "",OldPrice: "",ChildPrice: "",BabyPrice: ""}
      ]
    },

    //删除出发地
    handleClose(tag,index) {
      this.CityName.splice(this.CityName.indexOf(tag), 1);
      this.CityId.splice(index, 1);
    },
    //验证价格
    checkPrice(price) {
      if (!price) {
        return "价格信息还没有填完整";
      } else if (!/^[^ ]+$/.test(price)) {
        return "价格不能含有空格";
      } else if (!/^\d+(?:\.\d{1,2})?$/.test(price) || price < 0) {
        return "价格只能是最多两位小数的正数";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    addressResult(val) {
      if (this.CityName.indexOf(val.second.name) == -1) {
        this.CityName.push(val.second.name);
        this.CityId.push(val.second.id);
      } else {
        this.$message.error("已选择此出发地");
      }
    },
    seleCurrency(open, close) {
      if (open) {
        this.groupHttp
          .post("/GroupLine/GeEnumCurrencyTypeList")
          .then(res => {
            this.currencyOptions = res.data.keyValueList;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    savePrice() {
      var bool = false;
      if (this.CityName.length == 0) {
        this.$message({ type: "info", message: "您还没有设置出发地！" });
        return;
      }
      if (this.currency == "") {
        this.$message({ type: "info", message: "您还没有设置币种！" });
        return;
      }
      for (var i = 0; i < this.PriceList.length; i++) {
        var message =
          this.checkPrice(this.PriceList[i].Price) ||
          this.checkPrice(this.PriceList[i].OldPrice) ||
          this.checkPrice(this.PriceList[i].ChildPrice);
          //this.checkPrice(this.PriceList[i].BabyPrice);
        if (message) {
          this.$message({
            type: "info",
            message: message
          });
          bool = true;
          break;
        }
      }
      if (bool) {
        return;
      }
      this.btn_loading = true;
      let newPriceList=this.otherPriceList.concat(this.PriceList);
      newPriceList.forEach(
        function(item) {
          item.CurrencyType = this.currency;
        }.bind(this)
      );
      this.groupHttp
        .post("/GroupLine/SaveGroupLineProduct", {
          LineId: this.LineId,
          CityIdArr: this.CityId,
          CityNameArr: this.CityName,
          PriceList: newPriceList
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.cancelAction();
            this.btn_loading = false;
            this.queryData(this.pagination.size,this.pagination.currentPage)
          } else {
            this.$message.error("出错了：" + res.data.message);
            setTimeout(() => {
              this.btn_loading = false;
            }, 500);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    queryData(pageSize, pageIndex) {
      this.tableLoading = true;
      this.groupHttp
        .post("/GroupLine/GetGroupLineProductList", {
          LineId: this.LineId,
          PageSize: pageSize || 10,
          PageIndex: pageIndex || 1
        })
        .then(res => {
          this.groupTable = res.data.objects;
          this.pagination.total = res.data.total;
          this.tableLoading = false;
        })
      },
      listDelete(index, data){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupHttp.post('/GroupLine/SourceCityDelete', {ProductId: data.productId}).then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.queryData();
            }
          }).catch(e => {
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCopy(row){
      if(row.Price){
        row.OldPrice=row.Price;
        row.ChildPrice=row.Price;
        //row.BabyPrice=row.Price;
      }
    },
    handleChangePrice(row,price,name){
      if(price!=0){
        row[name]=Number(price)?Number(price).toFixed(2):'';
      }
    }
  }
};
</script>
