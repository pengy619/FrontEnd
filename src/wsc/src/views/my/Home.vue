<template>
    <div class="page" style="margin-top:0px">
        <div class="my-wrap">
            <div class="top-section" >
                <van-icon name="arrow-left back-btn" @click="$router.go(-1)"/>
                <div class="top-box">
                    <div class="avatar">
                        <img :src="info.avatar" alt="">
                    </div>
                    <div class="name">
                        {{info.name?info.name:'未设置'}}
                    </div>
                    <div class="phone">
                        <i class="iconfont icon-shouji"></i> {{info.mobilePhone}}
                    </div>
                </div>
                <i class="iconfont icon-shezhi right-top-btn" @click="$router.push('/My/Setting')"></i>
            </div>
            <div class="cell-section">
                <van-cell-group :border="false">
                    <van-cell title="我的订单" clickable is-link @click="$router.push('/My/OrderList')">
                        <i class="iconfont icon-wodedingdan" style="color:#feb469;margin-right:0.1rem" slot="icon"></i>
                    </van-cell>
                    <van-cell title="常用信息" clickable is-link @click="$router.push('/My/CommonInfo')">
                        <i class="iconfont icon-changyong" style="color:#8dbdf2;margin-right:0.1rem" slot="icon"></i>
                    </van-cell>
                    <van-cell title="发票记录" clickable is-link @click="$router.push('/My/TicketHistory')">
                        <i class="iconfont icon-fapiao" style="color:#f4d54c;margin-right:0.1rem" slot="icon"></i>
                    </van-cell>
                </van-cell-group>
            </div>
            <div class="logout-section" @click="logout">
                退出登录
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex"
import event from '@/vuex/eventCenter';
export default {
    name: 'myHome',
    data () {
        return {
            options: {
                preventDefault:false,
            },
            info:{
                name:'',
                mobilePhone:'',
                avatar:'http://120.76.20.11:8004/ImageUpload/AirTicket/Airline/20180419/565c3c9b9f96488fbe0cddb049e4aaa7.jpg'
            }
        }
    },
    computed:{
    },
    mounted(){
        event.$emit('header',{
            show:false
        })
        this.getMyinfo()
    },
    methods:{
        getMyinfo(){
            this.http.post('H5Account/MyCenter')
            .then(res=>{
                this.info=Object.assign(this.info,res.data.object)
            })
        },
        logout(){
            this.$dialog.confirm({
                title: '提示',
                message: '确认退出登录吗？'
            }).then(() => {
                // on confirm
                localStorage.removeItem('token')
                this.$router.replace('/login')
            }).catch(() => {
                // on cancel
            });
            
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "@/style/theme.scss";
    .my-wrap{
        min-height: 100%;
        .top-section{
            height: 2.5rem;
            background-image: url(../../assets/my_topbg.jpg);
            background-repeat: no-repeat;
            background-size:100% 100%;
            @include flex-center;
            flex-direction: column;
            position: relative;
            .top-box{
                @include flex-center;
                flex-direction: column;
            }
            .avatar{
                width: 0.65rem;
                height: 0.65rem;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
            .name{
                font-size: 0.18rem;
                margin-top: 0.24rem;
                color: #fff;
                margin-bottom: 0.1rem;
            }
            .phone{
                color: #fff;
            }
            .right-top-btn{
                font-size: 0.24rem;
                color: #fff;
                top: 0.2rem;
                right: 0.2rem;
                position: absolute;
            }
            .back-btn{
                position: absolute;
                left: 0.1rem;
                top: 0.2rem;
                color: #fff;
                font-size: 0.18rem;
            }
        }
        
        
        .logout-section{
            height: 0.5rem;
            line-height: 0.5rem;
            text-align: center;
            color: $theme-blue1;
            background: #fff;
            margin-top: 0.1rem;
        }
    }
</style>
