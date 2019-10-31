<template>
    <div class="view">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" id="form" size="small" :inline="true">
            <el-row>
                <el-form-item label="供应商名称"  prop="SupplierName">
                    <el-input v-model="form.SupplierName"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="联系人"  prop="LinkName">
                    <el-input v-model="form.LinkName"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="联系方式"  prop="LinkPhone">
                    <el-input v-model="form.LinkPhone"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col style="width:355px;padding-right:0">
                    <el-form-item label="联系地址" prop="ProvinceID">
                        <el-select v-model="form.ProvinceID" placeholder="请选择省" @change="provinceChange">
                            <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col style="width:230px;margin-bottom:0;">
                    <el-form-item label="" prop="CityID">
                        <el-select v-model="form.CityID" placeholder="请选择市" @change="cityChange">
                                <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col style="width:230px;margin-bottom:0;">
                    <el-form-item label="" prop="DistrictID">
                        <el-select v-model="form.DistrictID" placeholder="请选择区（县）">
                                <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="详细地址"  prop="Address">
                    <el-input v-model="form.Address"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item  label="资质上传" size="small" required prop="Qualifications">
                    <span>（图片格式为jpg/png/bmp，最大为2M，最多为5张。）</span>
                    <el-upload
                        action="/image/upload"
                        list-type="picture-card"
                        :http-request="imgUpload"
                        :show-file-list="true"
                        :limit="5"
                        :multiple="true"
                        accept="image/jpeg,image/png,image/bmp"
                        :on-remove="handleRemoveQualifications"
                        :before-upload="beforeUpload"
                        class="upload-btn"
                        :file-list="qualificationsList"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label=" " label-width="50px">
                    <el-button size="small" type="primary" :loading="loading" @click="submit()">保存</el-button>
                    <el-button size="small" @click="$router.go(-1)">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>    
    </div>
</template>
<script>
import * as utils from '@/utils/tools';
  export default {
    data() {
        let QualificationsCheck=(rule,value,callback)=>{
            if(this.qualificationsList.length==0){
                callback(new Error('请上传供应商资质'))
            }else{
                callback();
            }
        }
        let TelPhoneCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入手机号码'))
              }else if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))){
                callback(new Error('您的手机号码格式不正确'))
              }else{
                callback();
              }
         }
        return {
            form:{
                SupplierName:'',
                LinkName:'',
                LinkPhone:'',
                ProvinceID:'',
                ProvinceName:'',
                CityID:'',
                CityName:'',
                DistrictID:'',
                DistrictName:'',
                Address:'',
                Qualifications:''
            },
            rules:{
                SupplierName:[
                    { required: true,message:'请输入供应商名称', trigger: 'blur' }
                ],
                LinkName:[
                    { required: true,message:'请输入联系人', trigger: 'blur' }
                ],
                LinkPhone:[
                    { required: true,validator:TelPhoneCheck, trigger: 'blur' }
                ],
                ProvinceID:[
                    { required: true,message:'请选择省份', trigger: 'change' }
                ],
                CityID:[
                    { required: true,message:'请选择城市', trigger: 'change' }
                ],
                DistrictID:[
                    { required: true,message:'请选择区域', trigger: 'change' }
                ],
                Address:[
                    { required: true,message:'请输入详细地址', trigger: 'blur' }
                ],
                Qualifications:[
                    { required: true,validator:QualificationsCheck, message:'请上传供应商资质',trigger: 'blur' }
                ]
            },
            ProvinceList:[],
            CityList:[],
            DistrictList:[],
            qualificationsList:[],
            loading:false,
        }
    },
    mounted () {
        this.getCountryID()
        if(this.$route.query.id){
            this.getSupplier()
        }
    },
    methods: {
        getSupplier(){
            this.shopHttp.get('/SupplierManage/OftenSupplier?SupplierId='+this.$route.query.id)
            .then(res=>{
                if(res.data.isSuccess){
                    for(let k in res.data.objects[0]){
                        var K=utils.transfromCase(k,'up')
                        this.form[K]=res.data.objects[0][k]
                    }
                    if(res.data.objects[0].qualifications.indexOf(',')!=-1){
                        this.form.Qualifications=res.data.objects[0].qualifications.split(',')
                    }else{
                        this.form.Qualifications=[res.data.objects[0].qualifications]
                    }
                    this.form.Qualifications.forEach(item=>{
                        var img={
                            uid:this.RndNum(10),
                            url:item
                        }
                        this.qualificationsList.push(img)
                    })
                    this.provinceChange(this.form.ProvinceID,'keep')
                    this.cityChange(this.form.CityID,'keep')
                }
            })
        },
        getCountryID(){
            this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                this.ProvinceList = res.data;
            })
        },
        provinceChange(val,keep){
            this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
                this.CityList = res.data;
                if(!keep){
                    this.form.CityID = '';
                    this.form.DistrictID = '';
                }
            })
        },
        cityChange(val,keep){
            this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
                this.DistrictList = res.data;
                if(!keep){
                    this.form.DistrictID = '';
                }
            })
	    },
        beforeUpload(file){
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImg) {
                this.$message.error('上传头像图片只能是 JPG/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isImg && isLt2M;
        },
        handleRemoveQualifications(file){
            //删除供应商资质集合中所选中的元素
            if (this.qualificationsList) {
                for (var i = 0; i < this.qualificationsList.length; i++) {
                    if (this.qualificationsList[i].uid == file.uid) {
                        this.qualificationsList.splice(i, 1);
                        break;
                    }
                }
            }
            this.createQualifications()
        },
        imgUpload(val){
            var f = new FormData();
            f.append('FileData', val.file);
            f.append('Category', 'AirTicket');
            f.append('thumbnail', true);
            f.append('Folder', 'Airline');
			this.fileUpload.post(val.action, f)
			.then((res) => {
				if (res.data.state == false) {
                    this.$message.error(res.data.message);
                }else {
                    //资质uid和rul
                    var qualification = {
                        uid: val.file.uid,
                        url: res.data.url
                    }; 
                    this.qualificationsList.push(qualification);
                    this.createQualifications()
                }
			})
        },
        createForm(){
            var Province=this.ProvinceList.find(item=>{
                return this.form.ProvinceID==item.id
            })
            this.form.ProvinceName=Province.name
            var City=this.CityList.find(item=>{
                return this.form.CityID==item.id
            })
            this.form.CityName=City.name
            var District=this.DistrictList.find(item=>{
                return this.form.DistrictID==item.id
            })
            this.form.DistrictName=District.name
        },
        createQualifications(){
            if(this.qualificationsList.length==0){
                this.form.Qualifications=""
                return false
            }
            this.form.Qualifications=this.qualificationsList.map(item=>{
                return item.url
            })
            this.form.Qualifications=this.form.Qualifications.join(',')  
        },
        submit(){
            this.$refs.form.validate((valid) =>{
                if(valid){
                    this.createQualifications()
                    this.createForm()
                    this.loading=true
                    var url=this.$route.query.id?'SupplierManage/OftenSupplierEdit':'SupplierManage/OftenSupplierAdd'
                    this.shopHttp.post(url,this.form)
                    .then(res=>{
                        if(res.data.isSuccess){
                            this.$message.success('保存成功');
                            this.$router.go(-1)
                        }else{
                            this.$message.error(res.data.message);
                        }
                        this.loading=false
                    })
                    .catch(e=>{
                        this.$message.error('保存失败，请重试！');
                        this.loading=false
                    })
                }
            })
        },
        RndNum(n){
            var rnd="";
            for(var i=0;i<n;i++)
                rnd+=Math.floor(Math.random()*10);
            return rnd;
        },
    },
  }
</script>
<style scoped lang="scss">
</style>
