'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const webApi= require('./webApi')

let WEB_API
let FileUpload_API
const argv=JSON.parse(process.env.npm_config_argv).remain
if(argv.length==0){
  WEB_API='"'+webApi['default']+'"'
  FileUpload_API = '"'+webApi['FileUpload']+'"'
}else{
  let i=argv[0]
  let f=argv[1]
  WEB_API='"'+webApi[i]+'"'
  if(f){
    FileUpload_API = '"'+webApi[f]+'"'
  }else{
    FileUpload_API = '"'+webApi['FileUpload']+'"'
  }
}
console.log(WEB_API)
console.log(FileUpload_API)
module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  WEB_API:WEB_API,
  FileUpload_API:FileUpload_API
})

