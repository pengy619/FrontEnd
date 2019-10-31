<template>
  <div class='view'>
    <div class="block">
      <span class="demonstration">线路名称: </span>
      <el-input style='width:150px;' size='small'></el-input>
      <span class="demonstration">出团日期: </span>
      <el-date-picker
        style="width:500px"
        v-model="value6"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size='small'
        >
      </el-date-picker>
      <span class="demonstration">线路类型: </span>
      <el-select v-model="routeType" placeholder="请选择" size='small'>
        <el-option v-for="item in typeSelects"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="small">查找</el-button>
    </div>
    <div>
        <div>
          <el-button type="primary">报名</el-button>
          <el-button type="primary">预留</el-button>
          <el-button type="primary">查看线路订单</el-button>
        </div>
        <div id='table'>
            <el-table
              border
              :data="tableData"
              style="width: 100%">
                  <el-table-column
                    prop="index"
                    label="序号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="watchword"
                    label="团号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    label="状态"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="routeName"
                    label="线路名称"
                     min-width="150"
                   >
                  </el-table-column>
                  <el-table-column
                    prop="days"
                    label="天数"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="routeType"
                    label="线路类型"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="groupDate"
                    label="出团日期"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="departPlace"
                    label="出发地"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="planNum"
                    label="计划人数"
                    >
                  </el-table-column>
                  <el-table-column
                     prop="signNum"
                     label="已报名"
                     >
                  </el-table-column>
                  <el-table-column
                    prop="reverseNum"
                    label="预留位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="overplusNum"
                    label="余位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="supplier"
                    label="供应商"
                    >
                  </el-table-column>
                  <el-table-column 
                    label="行程下载"
                    >
                    <template slot-scope="scope">
                      <el-button type="text" size="mini">附件</el-button>
                    </template>
                  </el-table-column>
            </el-table>
            <div>
                <div class="pagination">
                    <el-pagination
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
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  data() {
    return {
      typeSelects: [
        {
          value: "选项1",
          label: "国内游"
        },
        {
          value: "选项2",
          label: "国际游"
        },
        {
          value: "选项3",
          label: "周边游"
        }
      ],
      routeType: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value6: "",
      tableData: [
        {
          index: "1",
          watchword: "H220001",
          state: "未转换",
          routeName: "内蒙古-西藏-北京-哈尔滨",
          days: "5",
          routeType: "国内游",
          groupDate: "2017-01-01",
          departPlace: "长沙",
          planNum: "30",
          signNum: "100",
          reverseNum: "2",
          overplusNum: "55",
          supplier: "自营"
        },
        {
          index: "",
          state: "",
          watchword: "",
          routeName: "",
          groupDate: "",
          customerName: "",
          contactWay: "",
          reverseNum: "",
          distribtionChannel: "",
          reverseDate: "",
          remark: "",
          operation: ""
        },
        {
          index: "",
          state: "",
          watchword: "",
          routeName: "",
          groupDate: "",
          customerName: "",
          contactWay: "",
          reverseNum: "",
          distribtionChannel: "",
          reverseDate: "",
          remark: "",
          operation: ""
        },
        {
          index: "",
          state: "",
          watchword: "",
          routeName: "",
          groupDate: "",
          customerName: "",
          contactWay: "",
          reverseNum: "",
          distribtionChannel: "",
          reverseDate: "",
          remark: "",
          operation: ""
        }
      ],
      pagination: {
        sizes: [5, 10, 20],
        size: 10,
        currentPage1: 1,
        total: 0
      }
    };
  }
};
</script>
<style scoped lang="scss">
#table {
  margin-top: 15px;
}
div {
  margin-bottom: 20px;
}
</style>
