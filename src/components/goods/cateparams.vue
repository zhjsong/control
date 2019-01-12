<template>
  <el-card>
      <my-bread level1="商品管理" level2="分类参数"></my-bread>
      <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>
      <!-- 级联选择器 -->
      <el-form  label-width="80px">
       <el-form-item label="商品分类" class="params">
         <el-cascader
             clearable
             :show-all-levels="false"
             expand-trigger="hover"
             :options="selectedOptions"  
             :props='defaultProps'
              v-model="selectedOptions2"
             @change="handleChange">
         </el-cascader>
         </el-form-item>
         <!-- tab选项卡 -->
          <el-tabs v-model="active" type="card" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <el-button type="danger">设置动态参数</el-button>
                <!-- 表格 -->
                <el-table
                 :data="arrDy"
                  style="width: 100%">
                 <el-table-column type="expand" label="#">
                  <template slot-scope="scope">
                  <el-tag
                       :key="tag"
                       v-for="tag in scope.row.attr_vals"
                       closable
                       :disable-transitions="false"
                       @close="handleClose(scope.row,tag)">
                       {{tag}}
                     </el-tag>
                     <el-input
                       class="input-new-tag"
                       v-if="inputVisible"
                       v-model="inputValue"
                       ref="saveTagInput"
                       size="small"
                       @keyup.enter.native="handleInputConfirm( scope.row)"
                       @blur="handleInputConfirm(scope.row)"
                     >
                      </el-input>
                       <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                </template>
                 </el-table-column>
                <el-table-column label="属性名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                   <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                   <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                </template>
             </el-table-column>
             </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button type="danger">设置静态参数</el-button>
                <!-- 表格 -->
                <el-table
                    :data="arrJt"
                     style="width: 100%">
                <el-table-column
                  type="index"
                  label="#"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="属性名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="attr_vals"
                  label="属性值">
                </el-table-column>
                 <el-table-column
                  label="操作">
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
      </el-form>
  </el-card>
</template>
<script>
export default {
    data(){
        return {
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
            arrDy:[],
            active:'1',
            inputVisible: false,
            inputValue: ''
           
        }
    },
      created(){
           this.getParams()
        },
    methods:{
        // 标记
        async handleClose(attr,tag) {
       attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
    //    发送请求
       const res =await this.$http.delete(`categories/${this.selectedOptions2[2]}/attributes/${attr.attr_id}`)
       console.log(res)
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue);
        }
        const res=await this.$http.post(`categories/${this.selectedOptions2[2]}/attributes`,{
            attr_name:attr.attr_name,
            attr_sel:'many',
            attr_vals:attr.attr_vals.join(',')
        })
        console.log(res)
        this.inputVisible = false;
        this.inputValue = '';
      },
        // 选项卡
       async handleClick(){
            // 静态参数
            if(this.active==='2') {
                if(this.selectedOptions2.length===3){
                    const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                    console.log(res)
                    this.arrJt=res.data.data
                }
            
        }
        },
       async handleChange(){
            if(this.selectedOptions2.length===3){
                 const res = 
                 await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
                  this.arrDy=res.data.data
                  console.log(res)
                  this.arrDy.forEach((item)=>{
                      item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.trim().split(',')
                  })
            }
        },
      
        // 发送请求获取数据
        async getParams(){
            const res = await this.$http.get('categories?type=3')
            // console.log(res)
            this.selectedOptions=res.data.data
        }
    }
}
</script>
<style>
.alert{
    margin-top: 20px;
}
.params{
    margin-top: 20px;
}
/* 样式 */

.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

