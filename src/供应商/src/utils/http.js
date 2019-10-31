import Vue from "@/main.js"
import axios from "axios"
import qs from "qs"

//判断当前运行环境
var isBuild = process.env.NODE_ENV === 'production';

const checkLogout=(error)=>{
  let status=error.response?error.response.status:''
  if(status===401&&isBuild){
    location.href="/Login?ReturnUrl=%2F"
  }
}
//跟团游http请求拦截器
var groupHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 50000,
});
groupHttp.interceptors.request.use(function(config) {
  if(config.method=='post'){
    config.data=qs.stringify(config.data)
  }
  var token=localStorage.getItem('token');
  if(token){
    config.headers.common['Authorization'] = token;
  }
  return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
//门票http实例
var ticketHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 10000
});
ticketHttp.interceptors.request.use(function(config) {
  if(config.method=='post'){
    config.data=qs.stringify(config.data)
  }
  var token=localStorage.getItem('token');
  if(token){
    config.headers.common['Authorization'] = token;
  }
  return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
//包机http实例
var airHttp = axios.create({
  baseURL: process.env.WEB_API,
	timeout: 10000,
});
airHttp.interceptors.request.use(function(config) {
  if(config.method=='post'){
    config.data=qs.stringify(config.data)
  }
  var token=localStorage.getItem('token')
  if(token){
    config.headers.common['Authorization'] = token;
  }
  return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
// 统一错误提示
airHttp.interceptors.response.use(function (response) {
    // if(response.data.message&&!response.data.isSuccess){
    // 	Vue.$message.error(response.data.message);
    // }
    if(response.data.method!=='OPTIONS'){
      return response;
    }
 }, function (error) {
   //检测是否需要重新登录
   checkLogout(error)
   if(error.response&&error.response.data.message){ //error.request
    Vue.$message.error(error.response.data.message);
   }else if(error.message){
    Vue.$message.error('请求超时，请重新刷新页面！');
    // Vue.$message.error(error.message);
   }
    return Promise.reject(error);
});

//附件上传专用
var fileUpload = axios.create({
  baseURL: process.env.FileUpload_API,
	timeout: 9999999,
});


var addressHttp = axios.create({
	baseURL: process.env.WEB_API,
	timeout: 10000,
});

addressHttp.interceptors.request.use(function (config) {
	if (config.method == 'post') {
		config.data = qs.stringify(config.data)
	}
	var token = localStorage.getItem('token')
	if (token) {
		config.headers.common['Authorization'] = token;
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});

export {airHttp,groupHttp,fileUpload,ticketHttp,addressHttp}
