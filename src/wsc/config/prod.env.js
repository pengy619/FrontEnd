'use strict'
const webApi= require('./webApi')
let WEB_API
let argv=JSON.parse(process.env.npm_config_argv).cooked
if(!argv||argv.length<3){
  WEB_API='"'+webApi['default']+'"'
}else{
  argv=argv[2].replace('--','')
  WEB_API='"'+webApi[argv]+'"'
}
module.exports = {
  NODE_ENV: '"production"',
  WEB_API:WEB_API
}
