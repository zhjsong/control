<template>
   <el-card class="box-card">
     <my-bread level1='商品管理' level2='商品列表'></my-bread>
     <!-- 输入框 -->
     <el-row class="searchRow">
         <el-col :span='24'>
                <el-input placeholder="请输入内容" v-model="query" class="inputselect">
                <el-button @click="handlesearch()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button  @click="$router.push({name:'goodsadd'})" type="success" plain>添加商品</el-button>
        </el-col>
     </el-row>            
     <!-- 表格 -->
      <el-table
       v-loading="loading"
      class="tables"
    :data="goodlist"
    height="450"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      width="80">
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格(元)">
    </el-table-column>
     <el-table-column
      prop="goods_weight"
      label="商品重量">
    </el-table-column>
     <el-table-column
      prop="add_time"
      label="创建日期">
    </el-table-column>
      <el-table-column
     width="100px"
      label="操作">
       <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
    </el-table-column>
  </el-table>
  <!-- 分页功能 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>
</template>
<script>
export default {
    data(){
        return{
            loading: 'false',
            searchValue:'',
            goodlist:[],
            pagenum:1,
            pagesize:10,
            total:0,
            query:''
            
        }
    },
    created(){
        this.getGoodList()
    },
    methods:{
        // 搜索
         handlesearch(){
            this.pagenum=1
            this.getGoodList()
        },
        // 分页
         handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize=val
        this.pagenum=1
         this.getGoodList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum=val
         this.getGoodList()
      },
        // 获取数据
        async getGoodList(){
            this.loading= true
           const res=await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
           console.log(res)
           this.goodlist=res.data.data.goods
           this.total=res.data.data.total
           this.loading= false
        }
    }
}
</script>
<style>
.searchRow{
    margin-top: 20px;
}
.inputselect {
    
    width: 300px;
}
.tables{
    margin-top: 10px;
}
</style>
