<template>
    <div class="add-invoice">
    <cube-scroll :style="{height:options.height+'px'}" :scroll-events="['scroll']"  ref="scroll">
        <van-cell-group>
            <van-field
                v-model="form.ToName"
                label="发票收件人"
                icon="clear"
                placeholder="请输入发票收件人"
                
                @click-icon="form.ToName = ''"
            />
            <van-field
                v-model="form.ToMobile"
                label="手机号码"
                icon="clear"
                placeholder="请输入收件人手机号"
                
                @click-icon="form.ToMobile = ''"
            />
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>选择地址</span></div>
                <div class="van-cell__value" @click="openCitypicker(1)">
                    <div style="text-align:left">{{ToShowAddress}}</div>
                </div>
            </div>
            <van-field v-model="form.ToAddress" placeholder="详细地址" />
        </van-cell-group>
        <div style="color:red;padding:0.15rem;">
            (注：发票邮寄，快递费到付)
        </div>

        <van-cell-group>
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>发票类型</span></div>
                <div class="van-cell__value">
                    <select class="van-field__control" v-model="form.InvoiceTypeId">
                        <option v-for="item in selectOptions" :key="item.id" :value="item.id">{{item.typeName}}</option>
                    </select>
                </div>
            </div>
            <van-field
                v-model="form.InvoiceTitle"
                label="发票抬头"
                icon="clear"
                placeholder="请输入发票抬头"
                @click-icon="form.InvoiceTitle = ''"
            />
            <van-field
                v-model="form.TaxNumber"
                label="公司税号"
                icon="clear"
                placeholder="请输入公司税号"
                @click-icon="form.TaxNumber = ''"
            />
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>公司地址</span></div>
                <div class="van-cell__value" @click="openCitypicker(2)">
                    <div style="text-align:left">{{ShowAddress}}</div>
                </div>
            </div>
            <van-field
                v-model="form.Address"
                icon="clear"
                placeholder="公司详细地址"
                @click-icon="form.Address = ''"
            />
            <!-- <van-field
                v-model="form.name1"
                label="公司电话"
                icon="clear"
                placeholder="请输入公司电话"
                @click-icon="form.name1 = ''"
            /> -->
            <van-field
                v-model="form.OpeningBank"
                label="开户银行"
                icon="clear"
                placeholder="请输入开户银行"
                @click-icon="form.OpeningBank = ''"
            />
            <van-field
                v-model="form.BankAccount"
                label="银行账户"
                icon="clear"
                placeholder="请输入银行账户"
                @click-icon="form.BankAccount = ''"
            />
        </van-cell-group>

        <div class="button-wrap" style="padding-bottom:0.5rem">
            <button class="ui-button orange full" :checked="selectOptions.length==0" @click="submit">保存</button>
        </div>
    
    </cube-scroll>
    <cityPicker ref="cityPicker" :selectId="selectId" @select="handleSelect(arguments)" ></cityPicker><!--selectedIndex:[0,0,0]默认选中-->
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui';
import cityPicker from '@/components/city-picker.vue';
export default {
    name:'AddInvoiceType2',
    components:{
        cubeScroll:Scroll,
        cityPicker
    },
    props:{
        isEdit:false
    },
    data(){
        return{
            form:{
                InvoiceTypeId:'',
                InvoiceTitle:'',
                TaxNumber:'',
                OpeningBank:'',
                ProvinceID:'18',
                ProvinceName:'湖南省',
                CityID:'233',
                CityName:'长沙市',
                DistrictID:'1561',
                DistrictName:'天心区',
                Address:'',
                ToName:'',
                ToMobile:'',
                ToProvinceID:'18',
                ToProvinceName:'湖南省',
                ToCityID:'233',
                ToCityName:'长沙市',
                ToDistrictID:'1561',
                ToDistrictName:'天心区',
                ToAddress:'',
                BankAccount:'',
                
            },
            ToShowAddress:'',
            ShowAddress:'',
            selectId:1,
            selectOptions:[],
            options:{
                height:''
            }
        }
    },
    mounted () {
        //计算滚动区域高度
        this.options.height=document.body.offsetHeight-document.querySelector('#header').offsetHeight
        this.$refs.scroll.refresh()
        this.getInvoiceType()
        if(this.isEdit){
            this.getInvoiceInfo()
        }
    },
    watch:{
        isEdit(val){
            this.getInvoiceInfo()
        }
    },
    methods:{
        getInvoiceType(){
            this.http.get('Invoice/GetInvoiceTypeH5')
            .then(res=>{
                if(res.data.isSuccess){
                    
                    this.selectOptions=res.data.objects
                    this.form.InvoiceTypeId=res.data.objects[0].id
                }
            })
        },
        submit(){
            for(let k in this.form){
                if(this.form[k]==''){
                    this.$toast('请填写完所有的表单')
                    return false
                }
            }
            
            if(!this.form.ToMobile.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)){
                this.$toast('请填写正确的手机号')
                return false
            }
            if(this.form.TaxNumber.length<15){
                this.$toast('请填写正确的税号')
                return false
            }
            if(!this.form.BankAccount.match(/^([1-9]{1})(\d{14}|\d{18})$/)){
                this.$toast('请填写正确的银行卡号')
                return false
            }
            
            this.$toast.loading({
                mask: true,
                message: this.isEdit?'提交修改':'正在添加'
            });
            var url=this.isEdit?'Invoice/CommonInvoiceEdit':'Invoice/CommonInvoiceAdd'
            this.http.post(url,this.form)
            .then(res=>{
                if(res.data.isSuccess){
                    this.$toast.success(this.isEdit?'修改成功':'添加成功');
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000);
                }else{
                    this.$toast.fail(res.data.message||'未知错误');
                }
            })
            .finally(()=>{

            })
        },
        getInvoiceInfo(){
            this.$toast.loading({
                mask: true,
                message: '加载中...'
            });
            this.http.get('Invoice/GetCommonInvoice?commonInvoiceId='+this.isEdit)
            .then(res=>{
                if(res.data.isSuccess){
                    var info=res.data.objects[0]
                    this.ToShowAddress=info.toProvinceName+' '+info.toCityName+' '+info.toDistrictName
                    this.ShowAddress=info.provinceName+' '+info.cityName+' '+info.districtName
                    
                    var newInfo={}
                    for(let k in info){
                        var m = k.substring(0,1).toUpperCase()+k.substring(1);
                        newInfo[m]=info[k]
                    }
                    this.form=newInfo
                    
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
            })
        },
        openCitypicker(id){
            this.selectId=id
            this.$refs.cityPicker.show()
        },
        handleSelect(args) {
            console.log(args[0])
            if(args[0]==1){
                this.ToShowAddress=args[3].join(' ')
                this.form.ToProvinceID=args[1][0]
                this.form.ToCityID=args[1][1]
                this.form.ToDistrictID=args[1][2]
                this.form.ToProvinceName=args[3][0]
                this.form.ToCityName=args[3][1]
                this.form.ToDistrictName=args[3][2]
            }
            if(args[0]==2){
                this.ShowAddress=args[3].join(' ')
                this.form.ProvinceID=args[1][0]
                this.form.CityID=args[1][1]
                this.form.DistrictID=args[1][2]
                this.form.ProvinceName=args[3][0]
                this.form.CityName=args[3][1]
                this.form.DistrictName=args[3][2]
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .button-wrap{
        margin: 0.3rem 0.2rem;
    }
</style>
