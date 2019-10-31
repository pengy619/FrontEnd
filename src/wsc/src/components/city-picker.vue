<template>
    <Picker @select="handleSelect(arguments)" :data="linkageData" :selected-index="selectedIndex"
          ref="picker" :title="title" @change="handleChange" :cancelTxt="cancelTxt" :confirmTxt="confirmTxt">
    </Picker>
</template>
<script>
import Picker from '@/components/picker.vue';
import { Province, Citys, area } from '@/js/area.js';
export default {
    components:{
        Picker
    },
    props:{
        title:{
            type:String,
            default:'选择省市区',
        },
        cancelTxt:{
            type:String,
            default:'取消',
        },
        confirmTxt:{
            type:String,
            default:'确定',
        },
        selectedIndex: {
            type: Array,
            default: ()=>{
                return [0, 0, 0]
            }
        },
        selectId:{
            type:[String,Number],
            default:1,
        }
    },
    data(){
        return{
            tempIndex: [0, 0, 0],
            data:[Province, Citys, area ],
        }
    },
    computed: {
        linkageData(){
            const [Province, Citys, area ] = this.data
            const provinces = Province
            console.log(provinces[this.tempIndex[0]])
            const cities = Citys[provinces[this.tempIndex[0]].value]
            const areas = area[cities[this.tempIndex[1]].value]
            return [provinces, cities, areas]
        },
    },
    watch: {
        linkageData() {
            this.$refs.picker.refresh()
        }
    },
    mounted(){
        
    },
    methods:{
        show() {
            this.$refs.picker.setData(this.linkageData)
            this.$refs.picker.show()
        },
        handleSelect(args) {
            this.$emit('select', this.selectId,...args)
        },
        handleChange(i, newIndex) {
            if (newIndex !== this.tempIndex[i]) {
                for (let j = 2; j > i; j--) {
                    this.tempIndex.splice(j, 1, 0)
                    this.$refs.picker.scrollTo(j, 0)
                }
                this.tempIndex.splice(i, 1, newIndex)
            }
        }
    }
}
</script>
<style>

</style>