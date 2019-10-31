<template>
  <div id="box">
      <div class="margin">
        角色名称
        <el-autocomplete size="small" placeholder="角色名称" :fetch-suggestions="querySearchAsync" v-model="Name" style="width:20%;margin-right:30px;margin-left:10px"></el-autocomplete>
        <el-button type="primary" size="small" @click="selecetEvent">保存</el-button>
      </div>
      <div class="margin">
        角色启用
         <el-checkbox v-model="IsDeleted" style="width:20%;margin-right:30px;margin-left:10px">勾选以启用选项</el-checkbox>
      </div>
      <div class="margin" style="margin-bottom:80px">
          选择功能 
              <el-table class="margin" size="small" :data="oneObj" :show-header='false' border style="width: 100%">  
                <el-table-column size="small" prop="name" align="center" width="300">
                    <template slot-scope="scope">
                        <el-checkbox style="margin-right:10px;margin-left:20%"  v-model="scope.row.isChecked"  @change="selectFixdata(scope.row)" :label="scope.row.name"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column size="small" align="center">
                    <template slot-scope="scope">
                        <el-table size="small" :show-header='false' border :data="scope.row.childrenobj" style="width:100%">
                             <el-table-column size="small" align="left">
                                 <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.isChecked" style="margin-right:10px;margin-left:35%" @change="selectFixdata(scope.row)" :label="scope.row.name"></el-checkbox>
                                 </template>
                             </el-table-column>
                             <el-table-column size="small" align="left">
                                  <template slot-scope="scope">
                                    <el-checkbox v-for="itemthrd in scope.row.kidsobj" :key="itemthrd.id" style="margin-left:24%;min-width:110px"  v-model="itemthrd.isChecked"  @change="selectFixdata(scope.row)" :label="itemthrd.name"></el-checkbox>
                                 </template>
                             </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
      </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
        Name:'',
        //checked:false,
        IsDeleted:true,
        Functions:[],
        tableData3: [{}],
        pageSize:100,
        pageIndex:1,
        oneObj:[],
        twoobj:[],
        threobj:[],
        mname:'',
        children:["childrenobj","kidsobj"],
        ID:'',
        updataObj: {},//声明一个对象键值对
        isHad:[]
      }
  },methods:{
      querySearchAsync(str,cb){
          var _this = this;
          _this.isHad.length = 0;
          if(_this.Name != ''){
                    let url = '/ShopRoles/GetRoleName?Name='+_this.Name;
                    if(_this.ID !=null && _this.ID != ''){
                        url = url+"&shopRolesId="+_this.ID;
                    } 
                     _this.shopHttp.get(url).then(res=>{
                        _this.isHad.push(res.data);
                        cb(_this.isHad);
                        if(!res.data){
                            _this.$message({type:'error',message:'该用户名已存在'});
                        }
                           // console.log(res.data);
                        }).catch(err=>{
                            console.log(err);
                            // cb(isHad.push(res));
                        })
                    
          }
         
      },
      getID(){
        // console.log(this.$route.query.editd);
         this.ID = this.$route.query.editd;
         if(this.ID!="" && this.ID !=null && this.ID != undefined){
             this.getOLDdata();
         }
      },
      getOLDdata(){
          //如果存在ID，，说明是编辑功能
            var _this=this;
            _this.shopHttp.get("/ShopRoles/GetShopRolesPageList?Id="+_this.ID).then(res=>{
                //console.log(res);
                if(res.data.isSuccess){
                   _this.Name = res.data.objects[0].name;
                   _this.IsDeleted = res.data.objects[0].isDeleted;
                }
            }).catch(err=>{
                console.log(err);
            });          
      },
     getShopFunctionList(){
         var _this =this;
         let url = '/ShopRoles/GetShopSystemFunctionList?PageSize='+_this.pageSize+"&PageIndex="+_this.pageIndex;
         if(this.ID!="" && this.ID !=null && this.ID != undefined){
           url = url+"&Id="+this.ID;
         }
         _this.shopHttp.get(url).then(res=>{
             //console.log(res);
              if(res.data.isSuccess){
                this.tableData3 = res.data.objects;
                _this.fixList(res.data.objects);
              }
         }).catch(err=>{
             console.log(err);
         })
     },
     fixList(rolelist){
         for(let i=0;i<rolelist.length;i++){
             if(rolelist[i].parentID === 0){
                this.oneObj.push(rolelist[i]);//取出第一列的所有行数据
             }else{
                this.twoobj.push(rolelist[i]);//把非第一列的所有数据全部放到另一个数组中
             }
         }
         for(var i=0;i<this.oneObj.length;i++){
             //外层循环 循环每一行数据
             let lsArray = [];
             for(var j=0;j<this.twoobj.length;j++){
                 // 组装第二层级数据
                 if(this.oneObj[i].id === this.twoobj[j].parentID){
                     //this.oneObj[i][this.children[0]+j] = this.twoobj[j];
                     lsArray.push(this.twoobj[j]);
                 }
             }
            
            
            for(let k= 0;k<lsArray.length;k++){//组装第三层数据
                let thlsArray = [];
                for(let i=0;i<this.twoobj.length;i++){
                    if(this.twoobj[i].parentID === lsArray[k].id){
                        thlsArray.push(this.twoobj[i]);
                    }
                }
                lsArray[k][this.children[1]] = thlsArray;//组装第二层的数据 包含第三层
            }
            this.oneObj[i][this.children[0]] = lsArray;//组装第一层数据 包含第二层数据
         }
       // console.log(this.oneObj);
     },
     getCheck(row){
       // console.log(row);
        if(row.isChecked){
           //如果是选中状态，，还要看有没有历史数据，没有则新加一条，有就不管
           if(this.Functions.length>0){
               var isHad = false;
              for(let i=0;i<this.Functions.length;i++){
                  if(this.Functions[i] === row.id){
                    //如果有历史数据，就改变量为true,就不加
                    isHad = true;
                  }else{
                      isHad = false;
                  }
              }
              if(!isHad){
                 this.Functions.push(row.id);
              }
           }else{
               this.Functions.push(row.id);
           }
        }else{ //如果是非选中状态，就完全不管
           for(let i=0;i<this.Functions.length;i++){
               //判断有没有历史数据与非选中状态的数据一样，，有的删掉
               if(this.Functions[i] === row.id){
                   this.Functions.splice(i,1);
               }
           }
        }
       // console.log(this.Functions);
     },
      createAddshoproles(){
          //新增数据
          var _this = this;
          if( _this.getAfterFixdata()){
          if(this.Name==""){
             this.$message({type:'error',message:"请输入名称"});
             return;
          }
           if(!this.isHad[0]){
                _this.$message({type:'error',message:'该用户名已存在'});
                return;
            }
          if(this.Functions.length<=0){
             this.$message({type:'error',message:"请选择至少一个权限"});
             return;
          }
          _this.shopHttp.post("/ShopRoles/AddShopRoles",{
              Name:_this.Name,
              IsDeleted:_this.IsDeleted,
              Functions:_this.Functions
          }).then(res=>{
              //console.log(res);
              if(res.data.isSuccess){
                   _this.$message({type:'success',message:"新增成功"});
                   _this.$router.go(-1);
              }else{
                   _this.$message({type:'error',message:"新增失败"});
              }
          }).catch(err=>{
              console.log(err);
               _this.$message({type:'error',message:"新增失败"});
          })
        }
      },
      updatashoproles(){
           var _this = this;
        if( _this.getAfterFixdata()){
          if(this.Name==""){
             this.$message({type:'error',message:"请输入名称"});
             return;
          }
         // console.log(this.isHad[0]);
           if(!this.isHad[0] && this.isHad[0] != undefined){
                _this.$message({type:'error',message:'该用户名已存在'});
                return;
            }
          if(this.Functions.length<=0){
             this.$message({type:'error',message:"请选择至少一个权限"});
             return;
          }
         // console.log(this.oneObj);
         
          _this.shopHttp.post("/ShopRoles/UpdateShopRoles",{
              Name:_this.Name,
              IsDeleted:_this.IsDeleted,
              Functions:_this.Functions,
              Id:_this.ID
          }).then(res=>{
             // console.log(res);
              if(res.data.isSuccess){
                   _this.$message({type:'success',message:"修改成功"});
                   _this.$router.go(-1);
              }else{
                   _this.$message({type:'error',message:"修改失败"});
              }
          }).catch(err=>{
              console.log(err);
               _this.$message({type:'error',message:"修改失败"});
          })
        }
      },
      selecetEvent(){
          if(this.ID!="" && this.ID !=null && this.ID != undefined){
                this.updatashoproles();
          }else{
              this.createAddshoproles();
          }
      },
      fixAllData(row){
        //处理历史数据与新数据结合
        //获取到每一次的点击，将每次点击的数据放到updataObj里面
        this.updataObj[row.id] = row.isChecked;
        //console.log(this.updataObj);//获取到所有点击操作数据
      },
      getAfterFixdata(){
         //应该在最后提交修改数据的时候再做这个判断，提升性能
        let datalength = this.tableData3.length;
        for(let i=0;i<datalength;i++){
           //通过循环总数据，，判断出 历史数据是否被点击操作
           if(!this.updataObj){
                for(let key in this.updataObj){
                    if(this.tableData3[i].id===key){//说明点击操作的数据中 有 历史纪录数据相冲突，取新数据替代历史数据
                        if(this.updataObj[key]){
                            // 最后需要保存的是 新数据中 所有为true条件的
                            this.Functions.push(key);
                        }
                    }else{
                        //否则就是点击操作数据中 未包含有历史数据信息，需要将历史数据为true的数据提取出来
                        if(this.tableData3[i].isChecked){
                            // 最后需要保存的是 历史数据中 所有为true条件的
                            this.Functions.push(this.tableData3[i].id);
                        }
                    }
                }
           }else{
              if(this.tableData3[i].isChecked){
                  this.Functions.push(this.tableData3[i].id);
              }
           }
          
        }
        //双重循环会导致 出现重复数据，，需要数据去重
        var temporaryobj = {};
        var temporaryarr = [];
        for(let i=0;i<this.Functions.length;i++){
             if(!temporaryobj[this.Functions[i]]){
                 temporaryobj[this.Functions[i]] = 1;
                 temporaryarr.push(this.Functions[i]);
             }
        }
        this.Functions.length = 0;
        this.Functions = temporaryarr;
       // console.log(temporaryarr);
        return true; 
      },
      selectFixdata(row){
          if(row.isChecked){
             for(let i=0;i<this.oneObj.length;i++){
                if(row.parentID === this.oneObj[i].id){
                    this.oneObj[i].isChecked = true;
                }
            }
            if(row.parentID === 0){
                for(let k = 0;k<row.childrenobj.length;k++){
                    row.childrenobj[k].isChecked=true;
                    let obj=row.childrenobj[k];
                    for(let i=0;i<obj.kidsobj.length;i++){
                        obj.kidsobj[i].isChecked = true;
                    }
                }
            }
          }else{
              
                 if(row.parentID === 0){
                     //console.log("说明是第一层级");
                    //  for(let k = 0;k<row.childrenobj.length;k++){
                    //       if(row.childrenobj[k].isChecked){
                    //          row.isChecked = true;
                    //       }
                    //  }
                     if(row.isChecked){
                        for(let k = 0;k<row.childrenobj.length;k++){
                            row.childrenobj[k].isChecked=true;
                            let obj=row.childrenobj[k];
                            for(let i=0;i<obj.kidsobj.length;i++){
                                obj.kidsobj[i].isChecked = true;
                            }
                        }
                     }else{
                         for(let k = 0;k<row.childrenobj.length;k++){
                            row.childrenobj[k].isChecked=false;
                            let obj=row.childrenobj[k];
                            for(let i=0;i<obj.kidsobj.length;i++){
                                obj.kidsobj[i].isChecked = false;
                            }
                        }
                     }
                 }else{
                    for(let i=0;i<row.kidsobj.length;i++){
                        if(row.kidsobj[i].parentID === row.id){
                            if(row.kidsobj[i].isChecked){
                                row.isChecked = true;
                                if(row.isChecked){//第二层级可以这样写
                                    //row.isChecked = true;
                                    for(let i=0;i<this.oneObj.length;i++){
                                        if(row.parentID === this.oneObj[i].id){
                                            this.oneObj[i].isChecked = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                 }
          }
          
          
          if(this.ID!="" && this.ID !=null && this.ID != undefined){
                this.fixAllData(row);//如果不等于空就是修改
          }else{
              this.getCheck(row);
          }
      }
  },mounted:function(){
      this.getID();
      this.getShopFunctionList();
  }
}
</script>

<style scoped lang=scss>
  @import "../../style/common.scss";
  .table{
        margin-top: 40px;
    }
    .margin{
        margin-top: 2%;
    }
    mytablemargin{
        margin-right:10px;
    }
    .colorcls{
        color: red;
    }
</style>