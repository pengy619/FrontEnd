<template>
  <div class="view">
            <el-form v-loading="fbsubloading">
                <el-form-item label='小项目币种' label-width='100px'>
                        <el-select placeholder="请选择" v-model="enumcurrency"  size="small" class="inputs" clearable >
                              <el-option v-for="item in enumcurrencyobj" :key="item.key" :label="item.name" :value="item.key"></el-option>
                        </el-select>
                </el-form-item>
                <el-row :gutter="24" style="width:1000px" v-for="(item,index) in subentrylist" :key="index">
                    <el-col :span="24">
                        <el-checkbox size='small' v-model="item.isCheck" @change="getsubentrydata"  :label="item.isCheck">{{item.smallItemsName}}</el-checkbox>
                    </el-col>
                    <el-row :gutter="24" style="margin:35px 0 0 40px;">
                        <el-col :span="6" v-if="item.isCheck">
                            <el-form-item label='媒体外卖价'  label-width='120px'>
                                <el-input-number size='small'  :controls="false" :min="0" :max="99999"   type='number' v-model="item.customerPrice" :disabled="false">50</el-input-number>
                            </el-form-item>
                            <el-form-item label='直客销售价' label-width='120px'>
                                <el-input-number size='small'  :controls="false" :min="0" :max="99999"   type='number' v-model="item.marketPrice" :disabled="false">50</el-input-number>
                            </el-form-item> 
                        </el-col>
                        <el-col :span="6" v-else>
                            <el-form-item label='媒体外卖价' label-width='120px'>
                                <el-input-number size='small'   :controls="false" :min="0" :max="99999"   :disabled="true">50</el-input-number>
                            </el-form-item>
                            <el-form-item label='直客销售价' label-width='120px'>
                                <el-input-number size='small'   :controls="false" :min="0" :max="99999"   :disabled="true">50</el-input-number>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6" v-if="item.isCheck">
                            <el-form-item label='同行结算价' label-width='120px'>
                                <el-input-number size='small'  :controls="false" :min="0" :max="99999"   type='number' v-model.number="item.toPrice" :disabled="false">50</el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-else>
                            <el-form-item label='同行结算价' label-width='120px'>
                                <el-input-number size='small'  :controls="false" :min="0" :max="99999"   :disabled="true">50</el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
                <el-form-item label='小项目说明' label-width='100px'>
                    <el-input type='textarea' v-model="instructions" size='small'></el-input>
                </el-form-item>
            </el-form>
            <el-row class="text-center">
                <el-button size='small' type="primary" @click="saveSubentrymessage">保存</el-button>
                <el-button size='small' type="" @click="goBack">返回</el-button>
            </el-row>
  </div>
</template>

<script>
export default {
  data(){
      return{
         enumcurrency:'',
         instructions:'',
         enumcurrencyobj:[],
         subentrylist:[],
         fbsubloading:false,
      }
  },mounted:function(){
      this.getEnumTypelist();
      this.getSubentrylist();
  },methods:{
       getEnumTypelist(){//获取币种
           var _this = this;
           _this.groupHttp.post('/GroupLine/GeEnumCurrencyTypeList',{}).then(res=>{
               //console.log(res);
               if(res.data.isSuccess){
                  _this.enumcurrencyobj = res.data.keyValueList;
               }
           }).catch(err=>{
               console.log(err);
           })
       },
       getSubentrylist(){
           //获取小项目名称
           var _this = this;
           _this.fbsubloading = true;
           _this.groupHttp.get('/GroupLineSmallItemSupplier/SmallItemPriceList?Id=0&pageSize=99999&LineId='+_this.$route.query.lineId).then(res=>{
               if(res.data.isSuccess){
                  // console.log(res);
                    _this.subentrylist = res.data.objects;
                      _this.instructions= res.data.instructions;
                     _this.enumcurrency = res.data.strCurrencyType;    
               }else{
                   _this.$message({type:'info',message:'出错了'});
               }
               _this.fbsubloading = false;
           }).catch(err=>{
               console.log(err);
               _this.fbsubloading = false;
               _this.$message({type:'error',message:'请求失败'});
           })
       },
       getsubentrydata(){
           console.log(this.subentrylist);
       },
       saveSubentrymessage(){
           let SmallItemPriceList = [];
           let subentrylistlength = this.subentrylist.length;
            for(let i=0;i<subentrylistlength;i++){
                if(this.subentrylist[i].isCheck){
                    this.subentrylist[i].franchiseSettlementPrice=0;
                    this.subentrylist[i].peerPrice=0;
                    this.subentrylist[i].internalPrice=0;
                    SmallItemPriceList.push(this.subentrylist[i]);
                }
            }
                var _this = this;
                if(_this.enumcurrencyobj.length > 0){
                         for(let i=0;i<_this.enumcurrencyobj.length;i++){
                                if(_this.enumcurrency == _this.enumcurrencyobj[i].name){
                                    _this.enumcurrency =  _this.enumcurrencyobj[i].key;
                                }
                         }
                    }
                _this.groupHttp.post('/GroupLineSmallItemSupplier/SmallItemPriceSaveOrUpdate',{
                    Instructions:_this.instructions,
                    CurrencyType:_this.enumcurrency,
                    LineId:_this.$route.query.lineId,
                    //LineId:'1099',//暂时写死
                    SmallItemPriceList:SmallItemPriceList
                }).then(res=>{
                    if(res.data.isSuccess){
                        _this.$message({type:'success',message:'保存成功'});
                    }else{
                        _this.$message({type:'info',message:res.data.message});
                    }
                    
                    
                }).catch(err=>{
                    console.log(err);
                    _this.$message({type:'error',message:'请求失败'});
                });
       },
       goBack(){
        this.$router.push({path: '/grouptour/RouteTable'})
      },
  }
}
</script>

