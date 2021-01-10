<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="searchClosed">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
      </el-row>

      <el-table
        :data="goodsTableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="700">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
        width="120">
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
        width="100">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
        width="100">
        </el-table-column>
        <el-table-column
          label="创建时间"
        width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="商品编辑" :enterable="false" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGoodsData(scope.row.goods_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="商品删除" :enterable="false" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-delete" @click="deleteGoodsData(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 30, 50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
<!--    编辑对话框-->
    <el-dialog
      title="商品编辑"
      :visible.sync="allDialogVisible"
      width="50%">
      <el-form ref="editFormRef"
               :model="editGoodsIdData"
               label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editGoodsIdData.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input type="number" v-model="editGoodsIdData.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input type="number" v-model="editGoodsIdData.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input type="number" v-model="editGoodsIdData.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="editGoodsIdData.upd_time">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="allDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoodsBtn">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      allDialogVisible: false,
      // 编辑信息ID
      editGoodsId: ''
    }
  },
  created () {
    this.goodsTableDataList()
  },
  methods: {
    // 获取商品列表数据
    goodsTableDataList () {
      this.$store.dispatch('getGoodsList', this.queryInfo)
    },
    // 搜索框关闭
    searchClosed () {
      this.goodsTableDataList()
    },
    // 点击搜索
    searchBtn () {
      this.goodsTableDataList()
    },
    // 获取最新显示几天信息
    handleSizeChange (newSize) {
      this.$store.commit('sizeChange', newSize)
      setTimeout(() => {
        this.goodsTableDataList()
      }, 0)
    },
    // 获取最新显示第几页
    handleCurrentChange (newPage) {
      this.$store.commit('pageChange', newPage)
      setTimeout(() => {
        this.goodsTableDataList()
      }, 0)
    },
    // 根据ID获取商品信息 编辑修改
    editGoodsData (id) {
      this.editGoodsId = id
      this.$store.dispatch('editGoodsData', id)
      this.allDialogVisible = true
    },
    // 确认修改信息
    editGoodsBtn () {
      const goodsObj = {
        id: this.editGoodsId,
        data: this.editGoodsIdData
      }
      this.$store.dispatch('editGoodsAction', goodsObj)
      this.allDialogVisible = false
      setTimeout(() => {
        this.goodsTableDataList()
      }, 0)
    },
    // 根据ID删除商品
    async deleteGoodsData (id) {
      const confirmStr = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      await this.$store.dispatch('deleteGoods', id)
    },
    // 添加商品
    addGoods () {
      this.$router.push('/addGoods')
    }
  },
  computed: {
    ...mapState(['queryInfo', 'goodsTableData', 'total', 'editGoodsIdData', 'editGoodsIdData'])
    // ...mapGetters(['editGoodsIdDataGetter'])
  }
}
</script>

<style scoped>
.addBtn{
  margin-left: 20px;
}
</style>
