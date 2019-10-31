import Vue from "@/main.js"
import axios from "axios"
import qs from "qs"
import app from '../main'
//判断当前运行环境
var isBuild = process.env.NODE_ENV === 'production';

var promiseFinally = require('promise.prototype.finally');
promiseFinally.shim();
// console.log(process.env.WEB_API)
// const checkLogout=(error)=>{
//   let status=error.response?error.response.status:''
//   if(status===401&&isBuild){
//     location.href="/Login?ReturnUrl=%2F"
//   }
// }
//http请求拦截器
var http = axios.create({
    baseURL: process.env.WEB_API,
    timeout: 99000,
});
http.interceptors.request.use(function(config) {
    if(config.method=='post'){
        config.data=qs.stringify(config.data)
    }
    var token=localStorage.getItem('token');
    if(token){
        config.headers.common['authorization'] = token;
    }
    return config;
}, function(error) {
	return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1){
        setTimeout(() => {
            app.$toast('请求超时')
        }, 300);
    }else if(error.response){
        app.$toast(error.response.data.error_description||'未知错误')
    }else{
        app.$toast('服务器错误')
    }
    return Promise.reject(error);
});

export default http
