<template>
  <div class="view">
    <el-dialog title="新增线路标签信息" :visible.sync="GroupLineLabelvisible_add" width="420px">
      <el-form
        :model="addGroupLineLabelForm"
        :rules="GroupLineLebelrules"
        ref="addGroupLineLabelForm"
      >
        <el-form-item label="标签名称" prop="paramName">
          <el-input v-model="addGroupLineLabelForm.paramName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input v-model="addGroupLineLabelForm.sortId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button @click="GroupLineLabelvisible_add = false">取 消</el-button>
        <el-button type="primary" @click="CreateGroupLineLabel('addGroupLineLabelForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改线路标签信息" :visible.sync="GroupLineLabelvisible_Update" width="420px">
      <el-form
        :model="UpdateGroupLineLabelForm"
        :rules="GroupLineLebelrules"
        ref="UpdateGroupLineLabelForm"
      >
        <el-form-item label="标签名称" prop="paramName">
          <el-input v-model="UpdateGroupLineLabelForm.paramName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input v-model="UpdateGroupLineLabelForm.sortId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button @click="GroupLineLabelvisible_Update = false">取 消</el-button>
        <el-button type="primary" @click="ModifyGroupLineLabel('UpdateGroupLineLabelForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增线路分类信息" :visible.sync="dialogFormVisible_add" width="600px">
      <el-form :model="addDialogForm" :rules="rules" ref="addDialogForm">
        <el-form-item label="线路类型" prop="paramName">
          <el-input v-model="addDialogForm.paramName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="selections">
          <div style="margin:10px 0">对应说明范围</div>
          <template>
            <el-checkbox-group
              v-model="addDialogForm.selections"
              v-for="item in bookingInstructions"
              :key="item.id"
            >
              <el-checkbox :label="item.id">{{item.paramName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item prop="supplierAreaTypeId">
          <div style="margin:10px 0">线路范围</div>
          <el-select v-model="addDialogForm.supplierAreaTypeId" placeholder="请选择">
            <el-option
              v-for="item in supplierAreaTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="contractType">
          <div style="margin:10px 0">对应电子合同类型</div>
          <template>
            <el-select v-model="addDialogForm.contractType" placeholder="请选择">
              <!--<el-option :value="0" label="未关联"></el-option>-->
              <el-option
                v-for="item in contractTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-show="item.name !='全部'"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="addRouteType('addDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改线路分类信息" :visible.sync="dialogFormVisible_modify" width="600px">
      <el-form :model="modifyDialogForm" :rules="rules" ref="modifyDialogForm">
        <el-form-item label="线路类型" prop="paramName">
          <el-input v-model="modifyDialogForm.paramName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="selections">
          <div style="margin:10px 0">对应说明范围</div>
          <template>
            <el-checkbox-group
              v-model="modifyDialogForm.selections"
              v-for="(item,index) in bookingInstructions"
              :key="index"
            >
              <el-checkbox :label="index">{{item.paramName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item prop="supplierAreaTypeId">
          <div style="margin:10px 0">线路范围</div>
          <el-select v-model="modifyDialogForm.supplierAreaTypeId" placeholder="请选择">
            <el-option
              v-for="item in supplierAreaTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="contractType">
          <div style="margin:10px 0">对应电子合同类型</div>
          <template>
            <el-select v-model="modifyDialogForm.contractType" placeholder="请选择">
              <!--<el-option :value="0" label="未关联"></el-option>-->
              <el-option
                v-for="item in contractTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-show="item.name !='全部'"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_modify = false">取 消</el-button>
        <el-button type="primary" @click="modifyRouteType('modifyDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-tabs type="border-card">
      <el-tab-pane label="预订说明" style="width:100%">
        <div class="tab-div">
          <el-button type="primary" @click="addFun(3,'预订说明')" icon="el-icon-plus" size="small">添 加</el-button>
          <el-button
            type="danger"
            @click="removeFun(3)"
            :disabled="deleteDisabled3"
            icon="el-icon-delete"
            size="small"
          >删 除</el-button>
          <el-table
            v-loading="loadings[3].loading"
            :data="bookingInstructions"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange3"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="paramName" label="预订说明"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="modifyFun(3,scope.row,'预订说明')"
                  icon="el-icon-edit"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            fixed="right"
            :data="pagination3"
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="pagination3.currentPage"
            :page-sizes="pagination3.sizes"
            :page-size="pagination3.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination3.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="线路分类" style="width:100%">
        <div class="tab-div">
          <el-button type="primary" @click="openDialog_add" icon="el-icon-plus" size="small">添 加</el-button>
          <el-button
            type="danger"
            @click="removeFun(4)"
            :disabled="deleteDisabled4"
            icon="el-icon-delete"
            size="small"
          >删 除</el-button>
          <el-select v-model="SupplierAreaType" placeholder="请选择" size="small">
            <el-option
              v-for="item in supplierAreaTypeList1"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-button type="primary" size="small" @click="queryData(4, 10, 1)">搜索</el-button>
          <el-table
            :data="groupLineType"
            tooltip-effect="dark"
            style="width:100%"
            @selection-change="handleSelectionChange4"
            v-loading="loadings[4].loading"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="paramName" label="线路类型"></el-table-column>
            <el-table-column prop="extend" label="线路范围"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="updateModal(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            fixed="right"
            :data="pagination4"
            @size-change="handleSizeChange4"
            @current-change="handleCurrentChange4"
            :current-page="pagination4.currentPage"
            :page-sizes="pagination4.sizes"
            :page-size="pagination4.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination4.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="线路主题" style="width:100%">
        <div class="tab-div">
          <el-button type="primary" @click="addFun(1,'线路主题')" icon="el-icon-plus" size="small">添 加</el-button>
          <el-button
            type="danger"
            @click="removeFun(1)"
            :disabled="deleteDisabled1"
            icon="el-icon-delete"
            size="small"
          >删 除</el-button>
          <el-table
            v-loading="loadings[1].loading"
            :data="theme"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange1"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="paramName" label="线路主题"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="modifyFun(1,scope.row,'线路主题')"
                  icon="el-icon-edit"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            fixed="right"
            :data="pagination1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="pagination1.currentPage"
            :page-sizes="pagination1.sizes"
            :page-size="pagination1.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination1.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="集合地点" style="width:100%">
        <div class="tab-div">
          <el-button type="primary" @click="addFun(2,'集合地点')" icon="el-icon-plus" size="small">添 加</el-button>
          <el-button
            type="danger"
            @click="removeFun(2)"
            :disabled="deleteDisabled2"
            icon="el-icon-delete"
            size="small"
          >删 除</el-button>
          <el-table
            v-loading="loadings[2].loading"
            :data="range"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange2"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="paramName" label="集合地点"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="modifyFun(2,scope.row,'集合地点')"
                  icon="el-icon-edit"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              fixed="right"
              :data="pagination2"
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="pagination2.currentPage"
              :page-sizes="pagination2.sizes"
              :page-size="pagination2.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination2.total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="线路标签" style="width:100%">
        <div class="tab-div">
          <el-button type="primary" @click="GroupLineLabel_add" icon="el-icon-plus" size="small">添 加</el-button>
          <el-button
            type="danger"
            @click="removeFun(5)"
            :disabled="deleteDisabled5"
            icon="el-icon-delete"
            size="small"
          >删 除</el-button>
          <el-table
            v-loading="loadings[5].loading"
            :data="GroupLineLabel"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange5"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" width="100" label="序号"></el-table-column>
            <el-table-column prop="paramName" label="标签名称"></el-table-column>
            <el-table-column prop="sortId" label="排序"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="UpdateGroupLineLabel(scope.row,'集合地点')"
                  icon="el-icon-edit"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              fixed="right"
              :data="pagination5"
              @size-change="handleSizeChange5"
              @current-change="handleCurrentChange5"
              :current-page="pagination5.currentPage"
              :page-sizes="pagination5.sizes"
              :page-size="pagination5.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination5.total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    var checkName = (rules, value, callback) => {
      if (!value) {
        callback(new Error("输入内容不能为空"));
      } else if (!/^[^ ]+$/.test(value)) {
        callback(new Error("不能含有空格"));
      } else {
        callback();
      }
    };
    var checkSortId = (rules, value, callback) => {
      if (value.length == 0) {
        callback(new Error("输入内容不能为空"));
      } else if (value.length > 10) {
        callback(new Error("长度不能大于10"));
      } else if (!/^[0-9]*$/.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    var checkSelections = (rules, value, callback) => {
      console.log(value);
      if (value.length == 0) {
        callback(new Error("请至少选择一项预订说明"));
      } else {
        callback();
      }
    };

    return {
      SupplierAreaType:'',
      //loading
      loadings: [
        {},
        { loading: false },
        { loading: false },
        { loading: false },
        { loading: false },
        { loading: false }
      ],
      //删除按钮是否禁用
      deleteDisabled1: true,
      deleteDisabled2: true,
      deleteDisabled3: true,
      deleteDisabled4: true,
      deleteDisabled5: true,
      //分页
      pagination1: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      pagination2: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      pagination3: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      pagination4: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      pagination5: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      rules: {
        paramName: [
          { required: true, validator: checkName, trigger: "blur" },
          { max: 20, message: "类型名称不能过长" }
        ],
        selections: [
          {
            type: "array",
            required: true,
            validator: checkSelections,
            trigger: "change"
          }
        ],
        supplierAreaTypeId: [
          {
            required: true,
            message: "请选择线路范围",
            trigger: "change"
          }
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ]
      },
      GroupLineLebelrules: {
        paramName: [
          { required: true, validator: checkName, trigger: "blur" },
          { max: 20, message: "标签名称不能过长" }
        ],
        sortId: [{ required: true, validator: checkSortId, trigger: "blur" }]
      },
      GroupLineContractType: {
        paramName: [
          { required: true, validator: checkName, trigger: "blur" },
          { max: 20, message: "请关联电子合同类型" }
        ],
        selections: [
          {
            type: "array",
            required: true,
            validator: checkSelections,
            trigger: "change"
          }
        ]
      },
      //模态框数据
      dialogFormVisible_add: false,
      GroupLineLabelvisible_add: false,
      dialogFormVisible_modify: false,
      GroupLineLabelvisible_Update: false,
      modify_checkList: [],
      supplierAreaTypeList1: [{key:'',name:'全部'}],
      supplierAreaTypeList: [],
      addDialogForm: {
        paramName: "",
        contractType: "",
        supplierAreaTypeId: "",
        selections: []
      },
      addGroupLineLabelForm: {
        paramName: "",
        sortId: ""
      },
      modifyDialogForm: {
        paramName: "",
        id: "",
        supplierAreaTypeId: "",
        contractType: "",
        selections: []
      },
      //线路分类修改时的 数据备份
      modifyDialogForm1: {
        paramName: "",
        selections: []
      },
      UpdateGroupLineLabelForm: {
        paramName: "",
        id: "",
        sortId: ""
      },
      //线路标签修改时的 数据备份
      UpdateGroupLineLabelForm1: {
        paramName: "",
        sortId: ""
      },
      //表格数据
      groupLineType: [],
      theme: [],
      range: [],
      bookingInstructions: [],
      GroupLineLabel: [],

      multipleSelection: [[], [], [], [], []],

      contractTypes: []
    };
  },
  methods: {
    //分页
    handleSizeChange1(val) {
      this.pagination1.size = val;
      this.pagination1.currentPage = 1;
      this.queryData(1, this.pagination1.size, this.pagination1.currentPage);
    },
    handleCurrentChange1(val) {
      this.pagination1.currentPage = val;
      this.queryData(1, this.pagination1.size, this.pagination1.currentPage);
    },
    handleSizeChange2(val) {
      this.pagination2.size = val;
      this.pagination2.currentPage = 1;
      this.queryData(2, this.pagination2.size, this.pagination2.currentPage);
    },
    handleCurrentChange2(val) {
      this.pagination2.currentPage = val;
      this.queryData(2, this.pagination2.size, this.pagination2.currentPage);
    },
    handleSizeChange3(val) {
      this.pagination3.size = val;
      this.pagination3.currentPage = 1;
      this.queryData(3, this.pagination3.size, this.pagination3.currentPage);
    },
    handleCurrentChange3(val) {
      this.pagination3.currentPage = val;
      this.queryData(3, this.pagination3.size, this.pagination3.currentPage);
    },
    handleSizeChange4(val) {
      this.pagination4.size = val;
      this.pagination4.currentPage = 1;
      this.queryData(4, this.pagination4.size, this.pagination4.currentPage);
    },
    handleCurrentChange4(val) {
      this.pagination4.currentPage = val;
      this.queryData(4, this.pagination4.size, this.pagination4.currentPage);
    },
    handleSizeChange5(val) {
      this.pagination5.size = val;
      this.pagination5.currentPage = 1;
      this.queryData(5, this.pagination5.size, this.pagination5.currentPage);
    },
    handleCurrentChange5(val) {
      this.pagination5.currentPage = val;
      this.queryData(5, this.pagination5.size, this.pagination5.currentPage);
    },
    //获取国内国外
    getSupplierAreaType() {
      this.groupHttp
        .post("/GroupLine/GetSupplierAreaType")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.supplierAreaTypeList = res.data.keyValueList;
            this.supplierAreaTypeList1 = this.supplierAreaTypeList1.concat(res.data.keyValueList)
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //查询线路类型、线路主题、集合地点、预订说明数据
    queryData(type, pageSize, index) {
      this.loadings[type].loading = true;
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: type,
          SupplierAreaType:this.SupplierAreaType,
          pageSize: pageSize,
          pageIndex: index
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.loadings[type].loading = false;
            res.data.objects.forEach(obj => {
              obj.type = type;
            });
            switch (type) {
              case 1:
                this.theme = res.data.objects;
                this.pagination1.total = res.data.total;
                break;
              case 2:
                this.range = res.data.objects;
                this.pagination2.total = res.data.total;
                break;
              case 3:
                this.bookingInstructions = res.data.objects;
                this.pagination3.total = res.data.total;
                break;
              case 4:
                this.groupLineType = res.data.objects;
                this.pagination4.total = res.data.total;
                break;
              case 5:
                this.GroupLineLabel = res.data.objects;
                this.pagination5.total = res.data.total;
                break;
            }
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
    //线路主题、集合地点、预订说明公用的添加函数
    addFun(type, text) {
      text = text || "添加";
      this.$prompt(text, "添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^ ]+$/,
        inputErrorMessage: "不能为空且不能含有空格"
      })
        .then(({ value }) => {
          this.groupHttp
            .post("GroupLine/CreateGroupLineParam", {
              paramType: type,
              paramName: value
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.queryData(type, this["pagination" + type].size, 1);
                this.$message({
                  type: "success",
                  message: "您已经成功添加 " + value
                });
              } else if (res.data.isSuccess == false) {
                var text = "添加失败:" + res.data.message;
                this.addFun(type, text);
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    //线路类型、线路主题、集合地点、预订说明、线路标签公用的删除函数
    removeFun(type) {
      var id_arr = [];
      for (var i = 0; i < this.multipleSelection[type].length; i++) {
        id_arr.push(this.multipleSelection[type][i].id);
      }
      var num = id_arr.length;
      if (num == 0) {
        this.$confirm("您还没有选择要删除的任何一项", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将永久删除这" + num + "项, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("GroupLine/DeleteGroupLineParam", {
              groupLineParamId: id_arr
            })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "您已经成功删除" + num + "项"
                });
                this.queryData(type, this["pagination" + type].size, 1);
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
        })
        .catch(e => {
          console.log(e);
        });
    },
    //线路主题、集合地点、预订说明公用的修改函数
    modifyFun(type, row, text) {
      text = text || "请输入内容";
      var content = row.paramName;
      var type = type;
      var id = row.id;
      var sortId = row.sortId;
      this.$prompt(text, "编辑", {
        inputValue: content,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^ ]+$/,
        dangerouslyUseHTMLString: true,
        inputErrorMessage: "不能为空且不能含有空格"
      })
        .then(({ value }) => {
          if (value == content) {
            var text = "<span style='color:#fa5555;'>您还未做修改!</span>";
            this.modifyFun(type, row, text);
          } else {
            this.groupHttp
              .post("GroupLine/CreateGroupLineParam", {
                paramType: type,
                paramName: value,
                id: id
              })
              .then(res => {
                if (res.data.isSuccess == true) {
                  this.$message({
                    type: "success",
                    message: "修改成功 "
                  });
                  this.queryData(type, this["pagination" + type].size, 1);
                } else {
                  var text =
                    "<span style='color:#fa5555;'>" +
                    res.data.message +
                    "!请重新编辑</span>";
                  this.modifyFun(type, row, text);
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        })
        .catch(() => {});
    },
    //点击添加线路类型按钮时   清空对话框的数据
    openDialog_add() {
      this.dialogFormVisible_add = true;
      if (this.$refs["addDialogForm"]) {
        this.$refs["addDialogForm"].resetFields();
      }
    },
    //点击添加线路类型按钮时   清空对话框的数据
    GroupLineLabel_add() {
      this.GroupLineLabelvisible_add = true;
      //清空验证消息
      if (this.$refs["addGroupLineLabelForm"]) {
        this.$refs["addGroupLineLabelForm"].resetFields();
      }
    },
    //添加线路类型
    addRouteType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.groupHttp
            .post("GroupLine/CreateGroupLineTypeParam", {
              paramType: 4,
              paramName: this.addDialogForm.paramName,
              bookingInstructions: this.addDialogForm.selections,
              ContractTypeId: this.addDialogForm.contractType,
              supplierAreaTypeId: this.addDialogForm.supplierAreaTypeId
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.queryData(4, this.pagination4.size, 1);
                this.$message({
                  type: "success",
                  message: "您已经成功添加 " + this.addDialogForm.paramName
                });
                this.$refs[formName].resetFields();
                this.dialogFormVisible_add = false;
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加线路标签
    CreateGroupLineLabel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.groupHttp
            .post("GroupLine/CreateGroupLineParam", {
              paramType: 5,
              paramName: this.addGroupLineLabelForm.paramName,
              sortId: this.addGroupLineLabelForm.sortId
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.queryData(5, this.pagination5.size, 1);
                this.$message({
                  type: "success",
                  message:
                    "您已经成功添加 " + this.addGroupLineLabelForm.paramName
                });
                //清空 添加模态框 数据
                this.$refs["addGroupLineLabelForm"].resetFields();
                this.GroupLineLabelvisible_add = false;
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //把要修改的数据显示在模态框里面
    updateModal(row) {
      //查询预订说明范围
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 3,
          pageSize: 100,
          pageIndex: 1
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.bookingInstructions = res.data.objects;
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
      this.row = row;
      this.modifyDialogForm.selections = [];
      this.dialogFormVisible_modify = true;
      this.modifyDialogForm.paramName = row.paramName;
      this.modifyDialogForm1.paramName = row.paramName;
      this.modifyDialogForm.id = row.id;
      if (row.extend == "国内供应商") {
        this.modifyDialogForm.supplierAreaTypeId = "1";
      } else if (row.extend == "出境供应商") {
        this.modifyDialogForm.supplierAreaTypeId = "2";
      } else {
        this.modifyDialogForm.supplierAreaTypeId = "";
      }
      this.groupHttp
        .post("GroupLine/GetGroupLineTypeParam", {
          id: this.modifyDialogForm.id
        })
        .then(res => {
          if (res.status == 200) {
            this.modifyDialogForm.contractType = res.data.contractTypeId;
            res.data.bookingInstructions.forEach(id => {
              for (var i = 0; i < this.bookingInstructions.length; i++) {
                if (this.bookingInstructions[i].id == id) {
                  this.modifyDialogForm.selections.push(i);
                }
              }
            });
          } else {
            this.$message({
              type: "info",
              message: "操作失败:"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      this.modifyDialogForm1.selections = this.modifyDialogForm.selections;
    },
    //把要修改的数据显示在模态框里面
    UpdateGroupLineLabel(row) {
      this.row = row;
      this.GroupLineLabelvisible_Update = true;
      this.UpdateGroupLineLabelForm.paramName = row.paramName;
      this.UpdateGroupLineLabelForm1.paramName = row.paramName;
      this.UpdateGroupLineLabelForm.sortId = row.sortId;
      this.UpdateGroupLineLabelForm1.sortId = row.sortId;
      this.UpdateGroupLineLabelForm.id = row.id;
    },
    //修改线路类型
    modifyRouteType(formName) {
      // if(this.modifyDialogForm.paramName == this.modifyDialogForm1.paramName && this.modifyDialogForm.selections == this.modifyDialogForm1.selections){
      //   this.$message({
      //             type: "info",
      //             message: "您还未做任何修改"
      //           });
      //   return;
      // }
      this.$refs[formName].validate(valid => {
        if (valid) {
          var id_arr = [];
          this.modifyDialogForm.selections.forEach(index => {
            id_arr.push(this.bookingInstructions[index].id);
          });
          this.groupHttp
            .post("GroupLine/CreateGroupLineTypeParam", {
              paramType: 4,
              paramName: this.modifyDialogForm.paramName,
              bookingInstructions: id_arr,
              id: this.modifyDialogForm.id,
              SupplierAreaTypeId: this.modifyDialogForm.supplierAreaTypeId,
              ContractTypeId: this.modifyDialogForm.contractType
            })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.dialogFormVisible_modify = false;
                this.modify_checkList = [];
                this.row.paramName = this.modifyDialogForm.paramName;
                this.queryData(
                  4,
                  this.pagination4.size,
                  this.pagination4.currentPage
                );
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    ///修改跟团游标签
    ModifyGroupLineLabel(formName) {
      // if(this.UpdateGroupLineLabelForm.paramName == this.modifyDialogForm1.paramName && this.UpdateGroupLineLabelForm.selections == this.modifyDialogForm1.selections){
      //   this.$message({
      //             type: "info",
      //             message: "您还未做任何修改"
      //           });
      //   return;
      // }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.groupHttp
            .post("GroupLine/CreateGroupLineParam", {
              paramType: 5,
              paramName: this.UpdateGroupLineLabelForm.paramName,
              sortId: this.UpdateGroupLineLabelForm.sortId,
              id: this.UpdateGroupLineLabelForm.id
            })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                (this.GroupLineLabelvisible_Update = false),
                  (this.modify_checkList = []);
                this.row.paramName = this.UpdateGroupLineLabelForm.paramName;
                this.row.sortId = this.UpdateGroupLineLabelForm.sortId;
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSelectionChange1(val) {
      this.multipleSelection[1] = val;
      if (this.multipleSelection[1].length == 0) {
        this.deleteDisabled1 = true;
      } else {
        this.deleteDisabled1 = false;
      }
    },
    handleSelectionChange2(val) {
      this.multipleSelection[2] = val;
      if (this.multipleSelection[2].length == 0) {
        this.deleteDisabled2 = true;
      } else {
        this.deleteDisabled2 = false;
      }
    },
    handleSelectionChange3(val) {
      this.multipleSelection[3] = val;
      if (this.multipleSelection[3].length == 0) {
        this.deleteDisabled3 = true;
      } else {
        this.deleteDisabled3 = false;
      }
    },
    handleSelectionChange4(val) {
      this.multipleSelection[4] = val;
      if (this.multipleSelection[4].length == 0) {
        this.deleteDisabled4 = true;
      } else {
        this.deleteDisabled4 = false;
      }
    },
    handleSelectionChange5(val) {
      this.multipleSelection[5] = val;
      if (this.multipleSelection[5].length == 0) {
        this.deleteDisabled5 = true;
      } else {
        this.deleteDisabled5 = false;
      }
    },
    //删除数组多个元素元素
    deleteEl(arr1, arr2) {
      for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
          if (arr1[i].id == arr2[j]) {
            arr1.splice(i, 1);
            i--;
            break;
          }
        }
      }
    },
    getContractTypeList() {
      this.groupHttp.get("Contract/GetContractTypeNames").then(res => {
        this.contractTypes = res.data.objects;
        //this.addDialogForm.contractType = this.contractTypes[0].id
      });
    }
  },
  mounted() {
    //初始化线路分类列表
    this.queryData(4, 10, 1);
    //初始化线路主题列表
    this.queryData(1, 10, 1);
    //初始化集合地点列表
    this.queryData(2, 10, 1);
    //初始化预订说明列表
    this.queryData(3, 10, 1);
    //初始化线路标签列表
    this.queryData(5, 10, 1);
    //初始化电子合同类型
    this.getContractTypeList();
    //获取国内国外
    this.getSupplierAreaType();
  }
};
</script>

<style scoped lang="scss">
.view {
  padding: 15px;
}
.el-table {
  margin-top: 20px;
}
.el-tab-pane {
  width: 20%;
}
.el-checkbox {
  white-space: normal;
  display: flex;
  margin-bottom: 10px;
}
</style>
