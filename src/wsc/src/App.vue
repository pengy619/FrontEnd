<template>
	<div id="app" :transition-direction="direction">
		<myHeader ref="myHeader"></myHeader>
		<div class="container">
			<transition :name="useTransition">
				<router-view style="min-height:100%;"/>
			</transition>
		</div>
	</div>
</template>

<script>
import {mapState} from "vuex"
import myHeader from './components/header'
export default {
	name: 'App',
	components:{
		myHeader,
	},
	computed:{
		...mapState({
			direction: state => state.direction,
			useTransition: state => state.useTransition,
		}) 
	},
}
</script>

<style>
img{
	max-width: 100%!important;
}
html,body,#app {
  height: 100%;
}
#app{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.view{
  background: #fff;
}
.container{
	flex: 1;
	position: relative;
	    background: #f5f5f5;
}

.page-enter-active,
.page-leave-active {
	-webkit-transition-duration: .6s;
	transition-duration: .6s;
	-webkit-transition-timing-function: cubic-bezier(.36, .66, .04, 1);
	transition-timing-function: cubic-bezier(.36, .66, .04, 1);
	-webkit-transition-property: opacity, -webkit-transform;
	transition-property: opacity, transform
}



[transition-direction=forward] .page-enter {
	-webkit-transform: translate3d(100%, 0, 0);
	transform: translate3d(100%, 0, 0);
	opacity: 0;
	z-index: 2
}

[transition-direction=forward] .page-enter-active {
	box-shadow: 0 5px 10px rgba(0, 0, 0, .15)
}

[transition-direction=forward] .page-enter-to {
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
	opacity: 1;
	z-index: 2
}

[transition-direction=forward] .page-leave {
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
	opacity: .8;
	z-index: 1
}

[transition-direction=forward] .page-leave-to {
	-webkit-transform: translate3d(-33%, 0, 0);
	transform: translate3d(-33%, 0, 0);
	opacity: 0;
	z-index: 1
}

[transition-direction=back] .page-enter {
	-webkit-transform: translate3d(-33%, 0, 0);
	transform: translate3d(-33%, 0, 0);
	opacity: .5;
	z-index: 1
}

[transition-direction=back] .page-enter-to {
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
	opacity: 1;
	z-index: 1
}

[transition-direction=back] .page-leave {
	-webkit-transform: translateZ(0);
	transform: translateZ(0);
	opacity: 0.5;
	z-index: 2
}

[transition-direction=back] .page-leave-active {
	box-shadow: 0 0 10px rgba(0, 0, 0, .15)
}

[transition-direction=back] .page-leave-to {
	-webkit-transform: translate3d(100%, 0, 0);
	transform: translate3d(100%, 0, 0);
	opacity: 0;
	z-index: 2
}
.page {
  box-sizing:border-box;
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
    overflow: hidden;
    margin-top: .46rem;
}

.iphone-x .van-tabbar--fixed{
  padding-bottom: 30px
}
</style>

