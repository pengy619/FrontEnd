<template>
  <div class="view">
      <h4>收款客户</h4>
      <el-row :gutter="24">
          <el-col :span="5">
              <el-form>
                  <el-form-item label="客户" size="small" label-width="80px">
                      <el-input type="text" class="inputs"></el-input>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
       <h4>客户信息</h4>
       <el-row :gutter="24">
          <el-col :span="20">
            <el-form>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款方式" label-width="80px">
                            <el-select size="small" class="inputs">
                            <el-option value="item.branch" label="item.bankName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                     <el-col :span="7" class="elcol">
                        <el-form-item label="币种" label-width="80px">
                            <el-select size="small" class="inputs">
                                <el-option value="1" label="人民币"></el-option>
                                <el-option value="2" label="欧元"></el-option>
                                <el-option value="3" label="美元"></el-option>
                            </el-select>
                        </el-form-item>
                     </el-col>
                      <el-col :span="7" class="elcol">
                        <el-form-item label="收款流水号" size="small" label-width="90px">
                            <el-input class="inputs"></el-input>
                        </el-form-item>
                      </el-col>
                </el-row>
                
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款金额" size="small" label-width="80px">
                            <el-input type="text" class="inputs"></el-input>
                            <el-button style="margin-left:10px;position:absolute;right:10px;top:1px">计算</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6"  class="elcol">
                        <el-form-item label="收款人" size="small" label-width="80px">
                            <el-input type="text" class="inputs"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5"  class="elcol">
                        <el-form-item label="收款时间" size="small" label-width="90px">
                            <el-input type="text" class="inputs"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="附件"  label-width="80px">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" icon="el-icon-upload" type="primary">点击上传附件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注" label-width="80px">
                    <el-input type="textarea" style="max-width:1010px"></el-input>
                </el-form-item>
            </el-form>
          </el-col>
      </el-row>
    <h4>是否需要发票</h4>
    <el-row :gutter="24">
        <el-col :span="20" :offset="1">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2" style="margin-left:50px">否</el-radio>
        </el-col>
    </el-row>
    <h4>收款订单</h4>
    <el-table  ref="multipleTable" :data="payinfoupdatetabledata" border max-height="800"  size="small" v-loading="loading2"
            @selection-change="getrowdata" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="feeStatusName" label="应收款" size="small" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="feeMethod" label="已收"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cashway" label="未收"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="feeDateFormat" label="订单号"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="feeChannelName" label="团号"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
            <el-table-column prop="feeChannelName" label="客户名称"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="feeNo" label="项目" align="center" size="small" show-overflow-tooltip>
        </el-table-column>
    </el-table>
    <el-row  style="margin-top:70px">
            <el-button size="small" type="primary" @click="savepayinfo">保存</el-button>
            <el-button size="small" type="primary" @click="payinfoupdatesave" >保存并开发票</el-button>
            <el-button size="small" type="primary" @click="backpayinfo">取消</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
    data(){
        return{
            radio:'',
            payinfoupdatetabledata:[{}]
        }
    },
    methods:{
        payinfoupdatesave(){
            this.$router.push({path:'/financenter/demandetail',name:'demandetail',params:{name:'payinfoupdata8YTnr$'}});
        },
        backpayinfo(){
            this.$router.push({path:'/paymanage/payinfo'});
        },
        savepayinfo(){
            this.$message("请先填写正确的保存信息，测试阶段不给你存");
            //this.$router.push({path:'/paymanage/payinfo'});
        }
    }
}
</script>

<style lang="scss" scoped>
    .elcol{
        width: 400px;
    }
   
</style>
