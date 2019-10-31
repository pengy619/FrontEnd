<template>
    <div class="van-nav-bar" id="header" :class="classList" :style="{height:height}" v-if="show">
        <div class="van-nav-bar__left" v-if="left.show" @click="leftBtn">
            <i class="van-icon van-icon-arrow van-nav-bar__arrow"><!----></i>
            <span class="van-nav-bar__text">返回</span>
        </div>
        <transition name="fromRight">
            <div class="van-ellipsis van-nav-bar__title" v-show="titleShow">{{title}}</div>
        </transition>
        <div class="van-nav-bar__right" v-if="right.show" @click="rightBtn">
            <van-icon :name="right.icon" style="font-size:0.18rem"/>
        </div>
    </div>
</template>
<script>
    import event from '../vuex/eventCenter'
    import {mapState} from "vuex"
    export default {
        name: 'myheader',
        data () {
            return {
                show:true,
                title:'',
                titleShow:false,
                height:'0.46rem',
                border:true,
                left:{
                    show:true,
                    text:'返回'
                },
                right:{
                    show:false,
                    icon:'wap-nav'
                },
                onLeftBtn:()=>{
                    this.$router.go(-1)
                },
                onRightBtn:()=>{},
                classList:''
            }
        },
        computed:{
            ...mapState({
                direction: state => state.direction,
                useTransition: state => state.useTransition,
            }) 
        },
        mounted(){
            event.$on('header',(e)=>{
                if(e.title!==undefined){
                    this.titleShow=false
                    setTimeout(() => {
                        this.titleShow=true
                        this.title=e.title?e.title:this.title
                    }, 50);
                }
                
                if(e.show!==undefined){
                    this.show=e.show
                }
                this.height=e.height!==undefined?e.height:this.height
                
                this.right=Object.assign(this.right,e.right)
                this.left=Object.assign(this.left,e.left)
                this.onLeftBtn=e.onLeftBtn||function(){this.$router.go(-1)}
                this.onRightBtn=e.onRightBtn||function(){}
                
                this.border=e.border!==undefined?e.border:this.border

                this.classList=this.border?'van-hairline--bottom':''
                this.classList+=' '+this.direction

                //设置沉浸式状态栏风格
                if(window.api&&this.show&&this.height!==0){
                    api.setStatusBarStyle({
                        style: 'light'
                    });
                }else if(window.api){
                    api.setStatusBarStyle({
                        style: 'dark'
                    });
                }
            })
            
        },
        methods: {
            leftBtn(){
                this.onLeftBtn()
            },
            rightBtn(){
                this.onRightBtn()
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "@/style/theme.scss";
    .van-nav-bar{
        background: linear-gradient(to right, $theme-blue1 , $theme-blue2);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1002;
        width: 100%;
        overflow: hidden;
        transition: height 0.2s linear;
    }
    .van-nav-bar.fixedStatus{
        padding-top:30px;
    }
    .fromRight-enter-active {
        -webkit-transition-duration: .6s;
        transition-duration: .6s;
        -webkit-transition-timing-function: cubic-bezier(.36, .66, .04, 1);
        transition-timing-function: cubic-bezier(.36, .66, .04, 1);
        -webkit-transition-property: opacity, -webkit-transform;
        transition-property: opacity, transform
    }
    .forward .fromRight-enter {
        -webkit-transform: translate3d(20%, 0, 0);
        transform: translate3d(20%, 0, 0);
        opacity: 0;
    }
    .back .fromRight-enter {
        -webkit-transform: translate3d(0%, 0, 0);
        transform: translate3d(0%, 0, 0);
        opacity: 0;
    }
    .fromRight-enter-to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
</style>
