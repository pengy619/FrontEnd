import Vue from "@/main.js"
import axios from 'axios'
import qs from 'qs'

//判断当前运行环境
var isBuild = process.env.NODE_ENV === 'production';
var shopHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 50000,
});


shopHttp.interceptors.request.use(function (config) {
  if (config.method == 'post'&&!config.jsonData) {
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

var addressHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 10000,
});

var uploadHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 999999,
});
uploadHttp.interceptors.request.use(function (config) {
  var token = localStorage.getItem('token')
  if (token) {
    config.headers.common['Authorization'] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
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
//图片上传专用
var fileUploadUrl = process.env.FileUpload_API;
var fileUpload = axios.create({
  baseURL: process.env.FileUpload_API,
  timeout: 9999999,
});

//统一的错误提示
shopHttp.interceptors.response.use(function (response) {
  // if(response.data.message&&!response.data.isSuccess){
  //   Vue.$message.error(response.data.message);
  // }
  if (response.data.method !== 'OPTIONS') {
    return response;
  }
}, function (error) {
  if(error.response.data.message =="已拒绝为此请求授权。" && error.response.status == 401){
    Vue.$message.error('token失效，请重新登录')
    setTimeout(Vue.$router.push({path:'/login'}),100)
  }
  //如果error_uri有值，说明要跳转审核
  if (error.response.data.error_uri != '' && error.response.data.error_uri != '0') {   
  }
  else if (error.response.status == 400) {
    Vue.$message.error(error.response.data.error_description)
  
  }
  return Promise.reject(error);
})
export { shopHttp, fileUpload, addressHttp, fileUploadUrl,uploadHttp }

