<template>
    <div class="page" style="margin-top: 0rem;">
        <div class="common-info-wrap" style="padding-top:0.46rem;">
            <AddInvoiceType2 :isEdit="isEdit"></AddInvoiceType2>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import AddInvoiceType2 from './AddInvoiceType2';
export default {
    name:'AddInvoice',
    components:{
        AddInvoiceType2
    },
    data(){
        return{
            activeTab:0,
            isEdit:false
        }
    },
    mounted () {
        this.isEdit=this.$route.query.edit||false
        event.$emit('header',{
            show:true,
            title:this.isEdit?'编辑发票':'新增发票',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        
    }
}
</script>
<style lang="scss" scoped>
    .common-info-wrap{

    }
</style>

