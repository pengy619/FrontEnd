<template>
  <div class="view" id="box">
      <h4><span class="vercitals">| </span>线路信息</h4>
        <el-form >
            <el-row :gutter="20">
             <el-col :span="10">
                <el-form-item label="线路名称：" size="small" label-width="120px">
                    <span>内蒙古-西藏-北京-哈尔滨    (线路编号：3121651145dfd31)</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="出团日期：" size="small" label-width="120px">
                    <span>2017-02-02</span>
                </el-form-item>
             </el-col>
            </el-row>
            <el-form-item label="线路类型：" size="small" label-width="120px">
                <span>国内境游</span>
            </el-form-item>
       </el-form>
       <span class="mysapn"><span class="verticals">| </span>客户信息</span>
      <hr/>
       <el-row :gutter="24">
          <el-col :span="20">
            <el-form>
                <el-row :gutter="18">
                    <el-col :span="10" class="elcol">
                        <el-form-item label="客户：" size="small" label-width="120px">
                            <el-input type="text" class="inputs"></el-input>
                            <el-button type="primary" size="small">选用</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="18">
                    <el-col :span="9" class="elcol">
                        <el-form-item label="联系人：" label-width="120px">
                            <el-select size="small" class="inputs">
                            <el-option value="item.branch" label="item.bankName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9"  class="elcol">
                        <el-form-item label="联系电话：" size="small" label-width="120px">
                            <el-input type="text" class="inputs"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12" class="elcol">
                        <el-form-item label="QQ：" size="small" label-width="120px">
                            <el-input type="text" class="inputs"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"  class="elcol">
                        <el-form-item label="Email：" size="small" label-width="120px">
                            <el-input type="text" class="inputs"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="订单日期：" size="small" label-width="120px">
                    <el-input type="text" class="inputs"></el-input>
                </el-form-item>
                <el-form-item label="合同号：" size="small" label-width="120px">
                    <el-radio v-model="radio" label=""></el-radio>
                    <el-input type="text" class="inputs"></el-input>
                    <el-button type="primary" size="small">选用</el-button>
                </el-form-item>
                <el-form-item label="" size="small" label-width="120px">
                    <el-radio v-model="radio" label="1">电子合同</el-radio>
                    <el-button type="primary" size="small">浏览</el-button>
                </el-form-item>
            </el-form>
          </el-col>
      </el-row>
    <h4><span class="verticals">| </span>预订信息</h4> 
        <el-form :inline="true">
            <el-form-item label="主要联系人：" label-width="120px">
                <el-select size="small" class="inputs">
                    <el-option value="item.branch" label="item.bankName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主要联系电话：" size="small" label-width="120px">
                <el-input type="text" class="inputs"></el-input>
                <el-radio v-model="radio" label="">先生</el-radio>
                <el-radio v-model="radio" label="">女士</el-radio>
                <el-checkbox v-model="checked">是否添加为游客</el-checkbox>
            </el-form-item>
            <el-form-item label="主要联系人：" label-width="120px">
                <el-select size="small" class="inputs">
                <el-option value="item.branch" label="item.bankName"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span>附加表</span>
            <el-table  ref="multipleTable" :span-method="arraySpanMethod" :data="price" border max-height="800" tooltip-effect="dark" style="width: 80%">
                <el-table-column prop="priceName" label="价格名称" align="center"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="priceType" label="价格类型" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="rackRate " label="直客销售价" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="number" label="人数" align="center" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <p>
                <el-form :inline="true">
                    <el-form-item label="费用：" label-width="120px">
                        <el-input size="small" type="text" class="inputs"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="优惠：" label-width="120px">
                        <el-input type="text" class="inputs"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="总价：" label-width="120px">
                        <el-input type="text" class="inputs"></el-input>
                    </el-form-item>
                </el-form>
            </p>
        <p><span class="vercitals">| </span>附加费<el-button type="primary" size="mini">添加行</el-button></p>
            <el-table size="small"  ref="multipleTable" :data="cost" border max-height="800"  tooltip-effect="dark" style="width: 100%">
                <el-table-column size="small" prop="sex " type="selection" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="costName " label="姓名" align="center"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="costPrice" label="旅客类型" align="center" show-overflow-tooltip>
                    <el-select size="small" class="inputs">
                        <el-option value="成人" label="1"></el-option>
                    </el-select>
                </el-table-column>
                <el-table-column size="small" prop="sex " label="性别" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="telephone" label="手机号码" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="certificatesType" label="证件类型" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="birthdate" label="出生日期" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="marshalPoint " label="集合点" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="costNo " label="附件" align="center" show-overflow-tooltip>
                </el-table-column>
            </el-table>
    <h4><span class="verticals">| </span>旅客信息</h4>
    <p><el-button type="primary" size="mini">添加行</el-button><el-button type="primary" size="mini">导入</el-button></p>
    <el-table size="small"  ref="multipleTable" :data="cost" border max-height="800"  tooltip-effect="dark" style="width: 100%">
                <el-table-column size="small" prop="costName " label="费用名" align="center"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="costPrice" label="价格" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="costNo " label="数量" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column size="small" prop="explain" label="说明" align="center" show-overflow-tooltip>
                </el-table-column>
            </el-table>

    <h4><span class="verticals">| </span>备注</h4>
    <p>
        <el-input style="max-width:500px" type="textarea" :rows="5" placeholder="请输入内容" v-model="textarea">
        </el-input>
    </p>
    <el-row :gutter="24" style="margin-top:70px">
        <el-col :span="2" :offset="8">
            <el-button size="small" type="primary">保存</el-button>
        </el-col>
        <el-col :span="3">
            <el-button size="small" type="primary" @click="payinfoupdatesave" >保存并开发票</el-button>
        </el-col>
        <el-col :span="3">
            <el-button size="small" type="primary">取消</el-button>
        </el-col>
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
            this.$router.push({path:'/financenter/demandetail'});
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../../style/common.scss";
   #box{
      background: white;
      padding: 20px;
    }
    .mysapn{
        font-weight: bold;
    }
    .verticals{
        font-weight: bold;
        font-size: 20px;
    }
    .inputs{
        width: 200px;
    }
    .elcol{
        width: 400px;
    }
</style>
