<template>
    <div class="view">
      <el-header>
        <el-steps :active="2" align-center class="ui-step">
          <el-step title="线路信息" description=""></el-step>
          <el-step title="行程信息" description=""></el-step>
          <el-step title="小项目" description=""></el-step>
          <el-step title="预订说明" description=""></el-step>
          <el-step title="上传附件" description=""></el-step>
          <el-step title="特殊人群限制" description=""></el-step>
          <el-step title="退款说明"></el-step>
        </el-steps>
      </el-header>
      <el-main  :class="{'button-fixed-padding':isFixed}">
        <!-- <el-button type="warning" class="add_jourmey margin_bottom"  :class="{'fixed-button':isFixed}" @click="addJourney" size="small" icon="el-icon-plus">添加行程</el-button> -->
        <el-form :model="item" :rules="rules" ref="item" label-width="100px" class="demo-journeyForm" size="small" v-for="(item,index) in itemForm">
          <el-form-item>
            <el-input  class="journey_day" :disabled="true" v-model="item.RouteTitle"></el-input>
            <input type="hidden" v-model="item.SortOrder = index">
            <input type="hidden" v-model="item.LineId">
            <!-- <el-button type="danger" @click="removeJourney(index)" v-show="index > 0" icon="el-icon-delete">删除</el-button> -->
          </el-form-item>
          <el-form-item label="行程" prop="RouteName">
            <el-input v-model="item.RouteName" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="交通" prop="TrafficArr">
            <el-checkbox-group v-model="item.TrafficArr">
              <el-checkbox :label="item.key" name="type" v-for="item in traffic">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="用餐" prop="MealInfoArr">
            <el-checkbox-group v-model="item.MealInfoArr">
              <el-checkbox :label="item.key" name="type" v-for="item in mealInfo">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="住宿酒店" prop="Hotels">
            <el-input v-model="item.Hotels"></el-input>
          </el-form-item>
          <el-form-item label="住宿城市" prop="CityName">
            <el-input v-model="item.CityName"></el-input>
          </el-form-item>
          <el-form-item label="行程景点" prop="Tickets">
            <editor :id="'editor_id-'+index" height="300px" width="700px" :content="item.Tickets" uploadJson="/Home/UploadImage"
                    pluginsPath="/static/kindeditor/plugins/"
                    :allowFileManager="false"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    >
            </editor>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>
        <el-button type="primary" class="add_jourmey" @click="saveRoute" :loading = 'btn_loading' size="small">保存,下一步</el-button>
      </el-footer>
    </div>
</template>
<style lang="scss" scoped>
  @import "../../../style/common.scss";
  .l_margin{
    margin-left: -70px;
    margin-right: 200px;
  }
  .journey_day{
    width: 150px;
  }
  .ql-editor p{
    height: 150px;
  }
  .el-form{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
  }
  .el-footer{
    text-align: center;
  }
  .add_jourmey{
    width: 150px;
  }
  .el-form{
    margin-bottom: 20px;
  }
  .textarea_width{
    width: 80%;
  }
  .el-input{
    width: 200px;
  }
  .fixed-button{
    position: fixed;
    top:130px;
    left: 250px;
    z-index: 20;
  }
  .button-fixed-padding{
   padding-top: 67px!important;
  }
</style>
<script>
  import addressSelect from '@/components/address-select/index'
  export default {
    components:{addressSelect},
    data() {
      var checkRouteName = (rule,value,callback) => {
        if(!value){
          callback(new Error('请选择活动区域'));
        }else{
          callback()
        }
      }
      var checkHotels = (rule,value,callback) => {
        if(!value){
          callback(new Error('请输入住宿酒店'));
        }else if(!/^[^ ]+$/.test(value)){
          callback(new Error('住宿酒店不能含有空格'));
        }else{
          callback()
        }
      }
      var checkCityName = (rule,value,callback) => {
        if(!value){
          callback(new Error('请输入住宿城市'));
        }else if(!/^[^ ]+$/.test(value)){
          callback(new Error('住宿城市不能含有空格'));
        }else{
          callback()
        }
      }
      var checkTickets = (rule,value,callback) => {
        value = value.replace(/^\s*|\s*$/g,'');
        if(!value){
          callback(new Error('请输入行程景点'));
        }else{
          callback()
        }
      }
      return {
        btn_loading: false,
        mealInfo:[],
        traffic:[],
        AirlineType: 'Domestic',
        editorOption: { },
        isFixed:false,
        id:'',
        itemForm:[
          {
            LineId:this.$route.query.lineId,
            SortOrder:'',
            RouteName: '',
            MealInfoArr:[],
            TrafficArr:[],
            Hotels: '',
            CityName: '',
            Tickets:'',
            RouteTitle:'第1天'
          }
        ],
        rules: {
          RouteName: [
            {required: true, validator:checkRouteName, trigger: 'blur' }
          ],
          TrafficArr: [
            { type: 'array', required: true, message: '请至少选择一种交通方式', trigger: 'change' }
          ],
//          MealInfoArr:[
//            { type: 'array', required: true, message: '请至少选择一种用餐方式', trigger: 'change' }
//          ],
//          Hotels: [
//            {required: true, validator:checkHotels, trigger: 'blur' }
//          ],
//          CityName: [
//            {required: true, validator:checkCityName, trigger: 'blur' }
//          ],
//          Tickets: [
//            {required: true, validator:checkTickets, trigger: 'blur' }
//          ],
        }
      };
    },
    mounted(){
        this.groupHttp.post('/GroupLine/GetEnumMealType',{}).then((res)=>{
          this.mealInfo = res.data
        }).catch((e)=>{
            console.log(e)
        });
        this.groupHttp.post('/GroupLine/GetEnumTrafficType',{}).then((res)=>{
          this.traffic = res.data
        }).catch((e)=>{
          console.log(e)
        })
        // this.fixedButton();

        let tripDays=this.$route.query.tripDays;
        if(tripDays>1){
          for(let i=1;i<tripDays;i++){
            this.addJourney(i+1)
          }
        }
    },
    methods: {
      onContentChange(data){
          let str = 'editor_id-';
          let index = data.id.replace(str,'');
          this.itemForm[index].Tickets = data.value;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      //添加按钮悬浮
      fixedButton(){
          window.onscroll=(event)=>{
            var scrollTop=document.documentElement.scrollTop;
            if(scrollTop>=115){
              this.isFixed=true;
            }else{
              this.isFixed=false;
            }
          }
      },
      //添加行程
      addJourney(index){
          this.itemForm.push({
            LineId:this.$route.query.lineId,
            SortOrder:'',
            RouteName: '',
            MealInfoArr:[],
            TrafficArr:[],
            Hotels: '',
            CityName: '',
            Tickets:'',
            RouteTitle:`第${index}天`
          })
      },
//      addressResult(val){
//          console.log(val)
//          this.itemForm.CityName=val.second.name
//      },
      //删除行程
      removeJourney(index){
        this.$confirm('此操作将删除该行程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.itemForm.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          setTimeout(() => {
            for(var i = 0;i< this.$refs['item'].length; i++ ){
              this.$refs['item'][i].$children[2].clearValidate();
            }
          },100)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //保存
      saveRoute(){
          var boo = true;
          for(var i = 0;i<this.$refs.item.length;i++){
            this.$refs.item[i].validate((valid) => {
              boo = valid;
            })
          }
          if(!boo){
            return;
          }
          this.btn_loading = true;
          this.groupHttp.post('/GroupLine/RouteSave',{Dto:this.itemForm}).then((res)=>{
              if(res.data.isSuccess == true){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                 this.btn_loading = false;
                 this.$router.push({
                  path: "/grouptour/subentryMessagefb",
                  query: { lineId: this.$route.query.lineId,lineTypeId: this.$route.query.lineTypeId }
                });
                //  setTimeout(()=>{
                //     //this.$router.push({path:'/grouptour/RouteReserve',query: {lineId:this.$route.query.lineId,lineTypeId:this.$route.query.lineTypeId}})
                //     var url = location.href.substring(0,location.href.indexOf('grouptour'));
                //    // location.replace(url + 'grouptour/RouteReserve?lineId='+this.$route.query.lineId + '&lineTypeId=' + this.$route.query.lineTypeId);
                //    location.replace(url + 'grouptour/subentryMessagefb?lineId='+this.$route.query.lineId + '&lineTypeId=' + this.$route.query.lineTypeId);
                //  },500)
              }else{
                this.$message.error('出错了：' + res.data.message)
                setTimeout( () => {
                  this.btn_loading = false;
                },500)
              }
          }).catch((e)=>{
              console.log(e)
          })
      }
    }
  }
</script>


