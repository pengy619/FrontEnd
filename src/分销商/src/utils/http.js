import Vue from "@/main.js"
import axios from "axios"
import qs from "qs"

var fxsHttp = axios.create({
  baseURL: process.env.WEB_API,
  timeout: 10000,
});

fxsHttp.interceptors.request.use(function (config) {
  if (config.method == 'post') {
    config.data = qs.stringify(config.data)
  }
  var token = localStorage.getItem('token');
  if (token) {
    config.headers.common['Authorization'] = token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export {fxsHttp}