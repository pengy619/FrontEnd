<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']"  ref="scroll" class="blue-scroll">
            <div class="order-info-wrap">
                <div class="section-header">
                    <div class="header-card">
                        <div class="title-row">
                            <span class="text-title">{{orderInfo.lineName}}</span>
                        </div>
                        <div class="info-row">
                            <div class="row">
                               <span>出发日期：{{orderInfo.startDate?orderInfo.startDate.split('T')[0]:''}}</span>
                               <span>返程日期：{{orderInfo.returnDate?orderInfo.returnDate.split('T')[0]:''}}</span>
                            </div>
                            <div class="row">
                                <span>出发城市：{{orderInfo.sourceCityName}}</span>
                                <span>目的城市：{{orderInfo.targetCityName}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <van-cell-group>
                    <van-cell title="合同签署人"  />
                    <div v-for="(item,index) in info.SignerList" :key="'Signer'+index" style="position:relative;">
                        <div class="grey-gap" v-if="index>0"> </div>
                        <van-icon name="close" v-if="index>0" class="close-icon" @click="handleDeleteSigner(index)"/>
                        <van-field v-model="item.SignerName" label="联系人" required placeholder="请填写联系人" />
                        <van-field v-model="item.MobilePhone" label="联系方式" required placeholder="请填写联系方式" />
                        <div class="van-cell  van-hairline van-field van-field--has-icon" required>
                            <div class="van-cell__title">证件类型</div>
                            <div class="van-cell__value">
                                <select class="van-field__control" v-model="item.CertificateType">
                                    <option :value="item.key" v-for="item in IDCardTypeList">{{item.value}}</option>
                                </select>
                            </div>
                        </div>
                        <van-field v-model="item.IDCardNO" label="证件号码" required placeholder="请填写证件号码" />
                    </div>
                    <van-cell title='' class="add-signer-box">
                        <span slot="right-icon" class="add-signer" @click="handleAddSigner">
                            <van-icon name="add-o" /> 添加签署人
                        </span>
                    </van-cell>
                </van-cell-group>
                <van-cell-group class="mar-t">
                    <van-cell>
                        <template slot="title">
                            <span class="van-cell-text">旅客信息<span class="warn-tips">（以下为非必填项）</span></span>
                        </template>
                    </van-cell>
                    <div class="van-cell van-hairline van-field van-field--has-icon tour-list" v-for="item in guestList">
                        <div class="van-cell__title"><span>旅客</span></div>
                        <div class="tour-right">
                            <div style="display:flex;flex:1;padding-bottom:.1rem;">
                                <div class="van-cell__value">
                                    <input class="van-field__control" type="text" v-model="item.GuestName"  placeholder="姓名"/>
                                </div>
                                <div class="van-cell__value">
                                    <select class="van-field__control" v-model="item.CertificateType"  placeholder="请选择">
                                        <option :value="card.key" v-for="card in IDCardTypeList">{{card.value}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="van-cell__value cer-number">
                                <input type="text" placeholder="证件号码"  v-model="item.IDCardNO" class="van-field__control"/>
                            </div>
                            <van-icon name="arrow" class="choice-tour" @click="hanldeChoiceTour(item)"/>
                        </div>
                    </div>
                </van-cell-group>
                <div class="confirm-warn">{{orderInfo.comfirmValidTimeMessage}}</div>
            </div>
        </cube-scroll>
        <div class="bottom-wrap">
            <div class="left-price">
                订单总额：<span class="price">￥{{info.PriceSum}}</span>
                <span class="view-detail" @click="handleShowDetail">明细</span>
            </div>
            <div class="right-btn">
                <button class="ui-button orange full" @click="handleSubmit"  :loading="btnLoading">{{orderInfo.enumConfirmType==1||orderInfo.enumConfirmType==4?'去支付':'提交订单'}}</button>
                <!-- <button class="ui-button orange full" @click="handleSubmit"  :loading="btnLoading">提交订单</button> -->
            </div>
        </div>
        <van-popup v-model="isShow" position="bottom" :overlay="true">
            <div class="price-detail">
                <div class="price-item" v-if="info.Number>0">
                    <div class="item1">成人</div>
                    <div class="item1">X {{info.Number}}</div>
                    <div class="item1 price">￥{{info.Price}}</div>
                </div>
                <div class="price-item" v-if="info.OldNumber>0">
                    <div class="item1">老人</div>
                    <div class="item1">X {{info.OldNumber}}</div>
                    <div class="item1 price">￥{{info.OldPrice}}</div>
                </div>
                <div class="price-item" v-if="info.ChildNumber>0">
                    <div class="item1">儿童</div>
                    <div class="item1">X {{info.ChildNumber}}</div>
                    <div class="item1 price">￥{{info.ChildPrice}}</div>
                </div>
                <div class="price-item" v-for="item in info.SmallItemOrderList">
                    <div class="item1">{{item.SmallItemsName}}</div>
                    <div class="item1">X {{item.Quantity}}</div>
                    <div class="item1 price">￥{{item.SmallitemAmount}}</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import {mapState} from "vuex"
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui'
export default {
    name:'OrderDetail',
    components:{
        cubeScroll:Scroll,
    },
    data(){
        return {
            data:{
                list:[],
                loading: false,
                finished: false
            },
            options:{},
            info:{
                TeamNo:'',
                TargetCityName:'',
                PriceSum:0,
                Number:0,
                OldNumber:0,
                ChildNumber:0,
                SignerList:[{
                    SignerName:'',
                    CertificateType:1,
                    CertificateTypeName:'身份证',
                    IDCardNO:'',
                    MobilePhone:'',
                }],
                GuestList:[]
            },
            guestList:[{
                GuestName:'',
                CertificateType:1,
                CertificateTypeName:'身份证',
                IDCardNO:'',
                // EnumGuestType:1,
                GuestType:1,
                GuestGenderName:'男',
                // GuestTypeName:'成人',
                GuestGender:0,
                Id:'',
                GuestId:'guest0'
            }],
            btnLoading:false,
            isShow:false,
            personCount:0,
            passengerList:[],
            orderInfo:{},
            IDCardTypeList:[
                {
                value:'身份证',
                key:1
                },{
                    value:'护照',
                    key:2
                },{
                    value:'驾照',
                    key:3
                },{
                    value:'回乡证',
                    key:4
                },{
                    value:'其它',
                    key:5
                }
            ]
        }
    },
    mounted () {
        // this.getPassengers();
        event.$emit('header',{
            show:true,
            title:'填写资料',
            left:{
                show:true
            },
            right:{
                show:false
            },
            border:false
        })
        
        let orderData=JSON.parse(localStorage.getItem('orderData'));
        this.personCount=(orderData.Number||0)+(orderData.OldNumber||0)+(orderData.ChildNumber||0);
        for(let i=1;i<this.personCount;i++){
            this.guestList.push({
                GuestName:'',
                CertificateType:1,
                CertificateTypeName:'身份证',
                IDCardNO:'',
                // EnumGuestType:1,
                GuestType:1,
                GuestGenderName:'男',
                // GuestTypeName:'成人',
                GuestGender:0,
                Id:'',
                GuestId:'guest'+i
            })
        }
        let selectTraveller=JSON.parse(localStorage.getItem('selectTraveller'));
        if(orderData){
            this.info=Object.assign(this.info,orderData)
            this.getOrderInfo();
        }
        this.info=JSON.parse(localStorage.getItem('info'))||this.info;
        if(selectTraveller){
            this.guestList=JSON.parse(localStorage.getItem('guestList'))||this.guestList;
            this.guestList.forEach(item=>{
                if(item.GuestId==selectTraveller.mark){
                    item.GuestName=selectTraveller.data.chineseName
                    item.CertificateType=selectTraveller.data.enumIDCardType
                    item.IDCardNO=selectTraveller.data.documentsID
                    item.GuestType=selectTraveller.data.enumPassengersType
                    item.GuestGender=selectTraveller.data.sex
                    item.Id=selectTraveller.data.id
                    item.MobilePhone=selectTraveller.data.phone
                }
            })
        }
        var branchAndShop={
            BranchId:this.$route.query.BranchId,
            CommunityShopId:this.$route.query.CommunityShopId
        }
        localStorage.setItem('branchAndShop',JSON.stringify(branchAndShop))
    },
    methods: {
        handleAddSigner(){
            this.info.SignerList.push({
                SignerName:'',
                CertificateType:1,
                CertificateTypeName:'身份证',
                IDCardNO:'',
                MobilePhone:'',
            })
        },
        handleDeleteSigner(index){
            this.info.SignerList.splice(index,1)
        },
        getPassengers(){
            this.http.post("/H5Account/Passengers")
            .then(res=>{
                if(res.data.isSuccess){
                    this.passengerList=res.data.objects;
                }else{
                    this.$toast(res.data.message);
                }
            })
            .catch(err=>{

            })
            
        },
        getOrderInfo(){
            this.http.get("/GroupLine/GetLineProductH5",{
                params:{
                    BranchId:this.info.BranchId,
                    CommunityShopId:this.info.CommunityShopId,
                    LineId:this.info.LineId,
                    StartDate:this.info.StartDate,
                    SourceCityId:this.info.SourceCityId,
                    SourceCityName:this.info.SourceCityName,
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.orderInfo=res.data.objects[0];
                    this.info.TeamNo=this.orderInfo.teamNo;
                    this.info.TargetCityName=this.orderInfo.targetCityName;
                }else{
                    this.$toast(res.data.message);
                }
            })
            .catch(err=>{

            })
            
        },
        hanldeChoiceTour(item){
            localStorage.setItem('info',JSON.stringify(this.info));
            localStorage.setItem('guestList',JSON.stringify(this.guestList));
            this.$router.push({
                name:'CommonInfo',
                query:{
                    mark:item.GuestId,
                    type:'selectTraveller'
                }
            })
        },
        handleShowDetail(){
            this.isShow=true;
        },
        handleSubmit(){
            if(this.btnLoading)return false
            this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在提交'
            });
            let canSubmit=true;

            localStorage.setItem('info',JSON.stringify(this.info));

            this.IDCardTypeList.forEach(item => {
                this.info.SignerList.forEach((item1,index1) => {
                    if(item.key==item1.CertificateType){
                        this.info.SignerList[index1].CertificateTypeName=item.value;
                    }
                    for(var k in item1){
                        if(item1[k]==''){
                            canSubmit=false;
                            this.$toast('请填写完整的合同签署人信息');
                            return false;
                        }
                    }
                });
                let arr=[];
                this.guestList.forEach((item1,index1) => {
                    if(item1.GuestName!=''){
                        arr.push(item1);
                    }else if(item.key==item1.CertificateType){
                        item1.CertificateTypeName=item.value;
                    }
                });
                this.info.GuestList=arr;
            });
            if(!canSubmit){
                return false;
            }
            this.btnLoading=true;
            this.http.post("/GroupLine/CreateGroupLineOrderH5",this.info)
            .then(res=>{
                if(res.data.isSuccess){
                    this.$router.push('/My/OrderDetail/'+res.data.orderId)
                    this.$toast.clear();
                }else{
                    this.$toast(res.data.message);
                }
                this.btnLoading=false;
            })
            .catch(err=>{
                this.$toast.clear();
            })
            
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .order-info-wrap{
        margin-bottom: 1rem;
        .section-header{
            padding: 0.15rem;
            background: linear-gradient(to right, $theme-blue1 , $theme-blue2);
            .header-card{
                padding: 0.15rem;
                background: #fff;
                border-radius: 4px;
                .title-row{
                    display: flex;
                    padding-bottom: .1rem;
                    border-bottom:1px solid #f7f7f7;
                    .text-title{
                        flex: 1;
                        font-size: 0.14rem;
                    }
                }
                .title-info{
                    margin: 0 -0.15rem;
                    font-size: 0.14rem;
                    color: $gray-text;
                    padding: 0.1rem 0.15rem;
                }
                .info-row{
                    color: $normal-text;
                    font-size: 0.14rem;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        margin-top: 0.1rem;
                    }
                }
            }
        }
        .close-icon{
            position: absolute;
            top: .15rem;
            right: .1rem;
            z-index: 1;
        }
        .warn-tips{
            color: #999;
            font-size: .12rem;
        }
        .add-signer-box{
            border-top: 1px solid #f5f5f5;
            .add-signer{
                color: $theme-blue1;
            }
        }
        .grey-gap{
            height: .08rem;
            background: #f7f7f7
        }
        .tour-list{
            .van-cell__title{
                display: flex;
                align-items: center;
            }
            .cer-number{
                padding-top:.1rem;
                border-top:1px solid #f5f5f5;
            }
            .tour-right{
                display:flex;
                position: relative;
                flex:1;
                flex-direction:column;
                padding-right:.2rem;
                .choice-tour{
                    position: absolute;
                    right: 0;
                    top: .3rem;
                    font-size: .16rem;
                }
            }
        }
        .confirm-warn{
            padding: .1rem .15rem .6rem;
            color: $theme-red1;
        }
    }
    .bottom-wrap{
        position: fixed;
        left: 0;
        bottom: 0;
        display: flex;
        width: 100%;
        padding-left:.15rem;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        z-index:2;
        .ui-button{
            border-radius: 0;
        }
        .price{
            font-size: .18rem;
        }
        .view-detail{
            margin-left: .1rem;
            color: $theme-blue1;
        }
    }
    .price-detail{
        .price-item{
            display: flex;
            margin: .15rem .15rem;
            .item1{
                flex: 40% 0 0;
                &:nth-child(3){
                    flex: 20% 0 0;
                }
            }
        }
    }
</style>

