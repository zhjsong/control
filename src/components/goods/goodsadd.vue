<template>
    <el-card class="box-card">
        <my-bread level1='商品管理' level2='添加商品'></my-bread>
        <!-- 警告条 -->
         <el-alert title="添加商品信息" center type="success" show-icon class="icons"></el-alert>
         <!-- 步骤条 -->
          <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
            <el-step title="基本信息" ></el-step>
            <el-step title="商品参数" ></el-step>
            <el-step title="商品属性" ></el-step>
            <el-step title="商品图片" ></el-step>
            <el-step title="商品内容" ></el-step>
          </el-steps>
          <!-- tab标签切换 -->
          <!-- 由于有value属性,推断此为表单元素,所以需要绑定,又因为需要跟步骤条相关,联动所以一下方法 -->
          <!-- 添加表单 -->
          <el-form :model="form" label-width="80px" style="height:400px;overflow:auto" label-position="top">
           <el-tabs  @tab-click='tabChange()' v-model='active' tab-position="left">
             <el-tab-pane name="1" label="基本信息">
                 <el-form-item label="商品名称">
                   <el-input v-model="form.goods_name"></el-input>
                 </el-form-item>
                  <el-form-item label="商品价格">
                   <el-input v-model="form.goods_price"></el-input>
                 </el-form-item>
                  <el-form-item label="商品重量">
                   <el-input v-model="form.goods_weight"></el-input>
                 </el-form-item>
                  <el-form-item label="商品数量">
                   <el-input v-model="form.goods_number"></el-input>
                 </el-form-item>
                 <!-- 级联选择器 -->
                <el-form-item label="商品分类">
                  <el-cascader
                      expand-trigger="hover"
                      :options="selectedOptions"  
                      :props='defaultProps'
                       v-model="selectedOptions2"
                      @change="handleChange">
                  </el-cascader>
                 </el-form-item>
             </el-tab-pane>
             <el-tab-pane name="2" label="商品参数">
                  <el-form-item :label="item1.attr_name" v-for='(item1,i) in arrDy' :key='i'>
                     <el-checkbox-group v-model="item1.attr_vals">
                     <el-checkbox  border :label="item2" v-for='(item2,i) in item1.attr_vals' :key='i'></el-checkbox>
                     </el-checkbox-group>
                 </el-form-item>   
             </el-tab-pane>
             <el-tab-pane name="3" label="商品属性">
                   <el-form-item :label="item.attr_name" v-for='(item,i) in arrJt' :key='i'>
                      <el-input v-model="item.attr_vals"></el-input>
                   </el-form-item>
             </el-tab-pane>
             <el-tab-pane name="4" label="商品图片">
                 <el-upload
                    action="http://localhost:8888/api/private/v1/upload"
                    :headers="headers"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>                  
             </el-tab-pane>
             <el-tab-pane name="5" label="商品内容">
                <el-form-item>
                 <el-button type="primary" @click='addGood()'>添加商品</el-button>
                  <quill-editor></quill-editor>
                </el-form-item>
             </el-tab-pane>
           </el-tabs> 
         </el-form>        
    </el-card>
</template>
<script>
// 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
     components: {
    quillEditor
  },
    data(){
        return {
            active:'1',
            form:{
              goods_name:'',	
              goods_cat:'',	
              goods_price:'',	
              goods_number:'',
              goods_weight:'',
              goods_introduce:'',
              pics:[],	
              attrs:'',             
            },
            // 三级分类获取数据源
            selectedOptions:[],
            // 级联选择器v-model的数组
            selectedOptions2:[],
            // 配置选项
            defaultProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 数组接收
            arrDy:[],
            // 静态参数
            arrJt:[],
            headers:{
                Authorization:localStorage.getItem("token")
            }
        }
    },
    created(){
        this.getGoodsCateList()
    },
    methods:{
        // 添加商品按钮
       async addGood(){
            // 处理 goods_cat:''数据
            this.form.goods_cat=this.selectedOptions2.join(',')
            // 处理pics,图片上传路径
            // attrs的处理
            let arr1=this.arrDy.map((item)=>{
                return {attr_id:item.attr_id,attr_value:item.attr_vals}
            })
            let arr2=this.arrJt.map((item)=>{
                return {attr_id:item.attr_id,attr_value:item.attr_vals}
            })
            let arr=[...arr1,...arr2]
            this.form.attrs=arr
           const res = await this.$http.post('goods',this.form)
              console.log(res)
              this.$router.push({name:'goods'})
        }
        ,
        // 图片上传
         handleRemove(file, fileList) {
           let index=this.form.pics.findIndex((item)=>{
                 return item.pic===file.response.data.tmp_path
           })
           console.log(index)
           this.form.pics.splice(index,1)
           console.log( this.form.pics)
       },
         handleSuccess(file){
            //  上传成功时,将临时路径存入pics中
             this.form.pics.push({
                 pic:file.data.tmp_path
             })
         },
        // tab切换触发事件
        async tabChange(){
              //    判断是否有三级分类
            if(this.selectedOptions2.length!==3){
                this.$message.warning('请先选择三级分类')
                return
            }
        //    如果判断是第二个tab,触发事件
           if(this.active==='2'){
          const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
          console.log(res)
          this.arrDy=res.data.data
        //   遍历arrDy动态数组中每个字符串
          this.arrDy.forEach((item)=>{
              item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.trim().split(',')
          })
        }else if(this.active==='3') {
             const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
              console.log(res)
              this.arrJt=res.data.data
        }
        },
        // 级联选择器的改变触发的change事件
        handleChange(){},
        async getGoodsCateList(){
            const res = await this.$http.get('categories?type=3')
            // console.log(res)
            this.selectedOptions=res.data.data
        }
    }
}
</script>
<style>
.icons {
    margin-top: 20px;
}
  .ql-editor {
      min-height: 300px;
  }
</style>

