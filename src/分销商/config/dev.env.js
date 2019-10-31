'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const webApi= require('./webApi')

let WEB_API
const argv=JSON.parse(process.env.npm_config_argv).remain
if(argv.length==0){
  WEB_API='"'+webApi['default']+'"'
}else{
  let i=argv[0]
  WEB_API='"'+webApi[i]+'"'
}
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WEB_API:WEB_API
})
