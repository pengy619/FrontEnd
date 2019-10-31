<template>
	<div class='view'>
        <el-row :gutter="20">
            <el-col :span="3" :offset="10" style='font-size:px;'>{{title}}</el-col>
        </el-row>
        <div>
            <h4>发票详细</h4>
            <el-form ref="form" :model="fapiao_form" label-width="100px" id='fapiao_form'>
                <el-form-item label="发票抬头" class='form-inline-input'>
                    <el-input v-model="fapiao_form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址" class='form-inline-input'>
                    <el-input v-model="fapiao_form.address"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" class='form-inline-input'>
                    <el-input v-model="fapiao_form.account"></el-input>
                </el-form-item>
                <el-form-item label="开户行" class='form-inline-input'>
                    <el-select v-model="fapiao_form.bank" placeholder="请选择银行">
                        <el-option label="民生银行" value="minsheng"></el-option>
                        <el-option label="建设银行" value="jianshe"></el-option>
                        <el-option label="工商银行" value="gongshang"></el-option>
                        <el-option label="农业银行" value="nongye"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票内容" class='form-inline-input'>
                    <el-select v-model="fapiao_form.content" placeholder="请选择">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票类型" class='form-inline-input'>
                    <el-select v-model="fapiao_form.type" placeholder="请选择">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票单位" class='form-inline-input'>
                    <el-select v-model="fapiao_form.danwei" placeholder="请选择">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取方式" class='form-inline-input'>
                    <el-radio v-model="fapiao_form.radio" label="1">邮寄</el-radio>
                    <el-radio v-model="fapiao_form.radio" label="2">自取</el-radio>
                </el-form-item>
                <el-form-item label="发票邮寄地址" class='form-inline-input' style='width:100%'>
                    <span class="demonstration">请选择省: </span>
                    <el-select v-model="fapiao_form.type" placeholder="">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                    <span class="demonstration">请选择市: </span>
                    <el-select v-model="fapiao_form.type" placeholder="">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                    <span class="demonstration">请选择县: </span>
                    <el-select v-model="fapiao_form.type" placeholder="">
                        <el-option label="a" value="a"></el-option>
                        <el-option label="b" value="b"></el-option>
                        <el-option label="c" value="c"></el-option>
                        <el-option label="d" value="d"></el-option>
                    </el-select>
                    <div style='margin-top:15px;'>
                        <span class="demonstration">详细地址: </span>
                        <el-input style='width:500px'></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="备注" class='form-inline-input' style='width:60%'>
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="fapiao_form.beizhu"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div style='margin:15px 0;'>
                <h4>发票对应记录</h4>
                <span class="demonstration">发票金额: </span>
                <el-input style='width:20%' ></el-input>
                <span class="demonstration">多开发票金额: </span>
                <el-input style='width:20%' ></el-input>
                <span class="demonstration">发票税费: </span>
                <el-input style='width:20%' ></el-input>
            </div>
            <el-table
                ref="singleTable"
                border
                :data="invoiceList"
                style="width: 100%">
                    <el-table-column
                      type="index"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      property="d1"
                      label="申请金额"
                      >
                    </el-table-column>
                    <el-table-column
                      property="d2"
                      label="已申请"
                      >
                    </el-table-column>
                    <el-table-column
                      property="d3"
                      label="未申请">
                    </el-table-column>
                    <el-table-column
                      property="d4"
                      label="收款订单号"
                      >
                    </el-table-column>
                    <el-table-column
                      property="d5"
                      label="收款客户"
                      >
                    </el-table-column>
                    <el-table-column
                      property="d6"
                      label="收款时间">
                    </el-table-column>
                    <el-table-column
                      property="d7"
                      label="订单号">
                    </el-table-column>
                    <el-table-column
                        property="d8"
                        label="收款人"
                              >
                    </el-table-column>
            </el-table>
        </div>
        <div style="text-align:center;margin-top:15px;">
                <el-button class="button" type='primary' size='small'>保 存</el-button>
                <el-button class="button" type='primary' size='small'>取 消</el-button>
        </div>
	</div>
</template>
<script>
	export default {
  		data() {
    		return {
                title:'XXXXXX客户',
                fapiao_form:{},
                invoiceList:[
                    {
                        d1:'',
                        d2:'',
                        d3:'',
                        d4:'',
                        d5:'',
                        d6:'',
                        d7:'',
                        d8:'',
                    },
                    {
                        d1:'',
                        d2:'',
                        d3:'',
                        d4:'',
                        d5:'',
                        d6:'',
                        d7:'',
                        d8:'',
                    }
                ],
            }
		},
		methods: {},
		mounted() {}
	}
</script>
<style scoped lang="scss">
    @import "../../../style/common.scss";
    .form-inline-input {
        width: 40%;
        float: left;
        padding-right: 5%;
    }
    .form-inline-input .el-input {
        width: 70%;
        margin-right: 5%;
    }
    #fapiao_form::after {
        clear: both;
        content: ".";
        display: block;
        width: 0;
        height: 0;
    }
    .button{
        margin: 0px auto;
    }
</style>