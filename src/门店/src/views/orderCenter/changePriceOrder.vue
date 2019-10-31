<template>
  <div id="box" class="view">
    <div>
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline" label-width="120px">
        <el-form-item label="申请时间">
          <el-date-picker v-model="order.datePick"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='状态'>
          <el-select v-model="order.Status" placeholder="请选择">
          <el-option
            label="全部"
            value=""></el-option>
          <el-option
            label="待审核"
            :value="0">
          </el-option><el-option
            label="审核通过"
            :value="1">
          </el-option>  <el-option
            label="已拒绝"
            :value="2">
          </el-option>
        </el-select>
        </el-form-item>
        <br>
        <el-form-item label="供应商名称">
          <el-input v-model="order.supplierName" size='small'></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="order.orderNo" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--<div class="margin_bottom">
      <el-button size="small" @click="handleExport">导出</el-button>
    </div>-->
    <div class="table">
      <el-table size="small" algin="center" :data="order.table" style="width: 100%" :loading='table_loading'>
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column size="small" align="center" prop="orderNo" label="订单编号"> </el-table-column>
        <el-table-column size="small" align="center" prop="supCompanyName" label="供应商"></el-table-column>
        <el-table-column size="small" align="center" label="改前应付" prop="oldReceiveAmount"></el-table-column>
        <el-table-column size="small" align="center" label="改后应付" prop="newReceiveAmount"></el-table-column>
        <el-table-column size="small" align="center" prop="createOn" label="申请时间"></el-table-column>
        <el-table-column size="small" align="center" prop="shopConfirmTime" label="处理时间"></el-table-column>
        <el-table-column size="small" align="center" prop="statusTxt" label="状态"></el-table-column>
        <el-table-column size="small" align="center" label="操作" fixed="right" width='150'>
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.showCheckBtn&&scope.row.shopConfirmed==false" @click="OpenCheckForm(scope.row)">处理审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination fixed="right"
                     :data='pagination'
                     @size-change="sizeChange"
                     @current-change="currentPageChange"
                     :current-page="pagination.currentPage"
                     :page-sizes="pagination.sizes"
                     :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.total">
      </el-pagination>
    </div>

    <el-dialog title="处理审核" :visible.sync="showCheckForm" center>
      <el-form :model="checkPriceDto">
        <el-form-item label="是否通过" prop="checkPriceDto.IsPass">
          <el-radio-group v-model="checkPriceDto.IsPass">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="Reason" v-if="!checkPriceDto.IsPass">
          <el-input type="textarea" v-model="checkPriceDto.Reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCheckForm=false">取 消</el-button>
        <el-button type="primary" @click="handleCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { dateFmt } from "@/utils/tools.js";
  export default {
    data() {
      return {
        btn_disabled: true,
        table_loading: false,

        //审核表单
        showCheckForm: false,
        checkPriceDto: { RecordId: '', IsPass: true, Reason: '' },
        order: {
          //搜索表单
          datePick: "",
          orderNo: "",
          supplierName: '',
          Status:'',
          //列表数据
          table: []
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
    methods: {
      //查询数据
      queryData(size, index) {
        this.table_loading = true;

        let beginDate = '', endDate = '';
        if (this.order.datePick) {
          beginDate = dateFmt(this.order.datePick[0], "yyyy-MM-dd") || "";
          endDate = dateFmt(this.order.datePick[1], "yyyy-MM-dd") || "";
        }
        size = size || 10;
        index = index || 1;
        this.shopHttp
          .get("/GroupLine/ChangePriceOrderList?OrderNo=" + this.order.orderNo +
          "&CreateTimeBegin=" + beginDate + '&CreateTimeEnd=' + endDate
          + "&SupCompanyName=" + this.order.supplierName
          + "&PageSize=" + size + "&PageIndex=" + index + '&Status='+this.order.Status)
          .then(res => {
            if (res.data.isSuccess == true) {
              //处理时间格式
              res.data.objects.forEach(obj => {
                let data1 = new Date(obj.createOn);
                obj.createOn = dateFmt(data1, "yyyy-MM-dd");
                if (obj.shopConfirmTime != null && obj.shopConfirmTime != '') {
                  let data2 = new Date(obj.shopConfirmTime);
                  obj.shopConfirmTime = dateFmt(data2, "yyyy-MM-dd");
                }
              });
              this.order.table = res.data.objects;
              this.table_loading = false;
              this.pagination.total = res.data.total;
            } else {
              this.$message({
                type: "info",
                message: "出错了!" + res.data.message
              });
              setTimeout(() => {
                this.table_loading = false;
              }, 500);
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      OpenCheckForm(row) //审核处理弹窗
      {
        this.checkPriceDto.RecordId = row.id;
        this.checkPriceDto.IsPass = true;
        this.checkPriceDto.Reason = '';
        this.showCheckForm = true;
      },
      handleCheck(row) { //处理审核

        this.shopHttp.post('/GroupLine/CheckChangePrice', { 'RecordId': this.checkPriceDto.RecordId, 'IsPass': this.checkPriceDto.IsPass, 'Reason': this.checkPriceDto.Reason })
          .then(res => {
            if (res.data.isSuccess) {
              this.$message({
                type: 'success',
                message: '已成功处理',
              });

              this.showCheckForm = false;
              this.queryData(this.pagination.size, this.pagination.currentPage);
            }
            else {
              this.$message.error(res.data.message);

            }

          });
      },


      //分页
      sizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      }
    },
    mounted() {
      this.queryData();
    }
  };
</script>

<style scoped lang=scss>
  /* .table{
        margin-top: 30px;
    } */
  .input {
    width: 200px;
  }
</style>
