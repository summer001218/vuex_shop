<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button class="addBtn" type="primary" @click="addCategories">添加分类</el-button>
      <tree-table :data="getCateCassifyList"
                  :columns="columns"
                  border
                  show-index
                  :expand-type="false"
                  :selection-type="false"
                  index-text='#'
                  :show-row-hover="false"
                  class="treeTable">
        <!-- 是否有效插槽 -->
        <template slot="isSlot"
                  slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false"
             class="el-icon-success"
             style="color:lightgreen"></i>
          <i v-else
             class="el-icon-error"
             style="color:red"></i>
        </template>

        <!-- 等级排序插槽 -->
        <template slot="isSort"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level === 0">一级标签</el-tag>
          <el-tag size="mini"
                  type="success"
                  v-else-if="scope.row.cat_level === 1">二级标签</el-tag>
          <el-tag size="mini"
                  type="warning"
                  v-else>三级标签</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="isOperation"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="editBtn(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="delBtn(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :page-sizes="[1, 5, 10, 20]"
                       :page-size="queryInfo.pagesize"
                       :current-page="queryInfo.pagenum"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-card>

<!--    添加分类弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      @close="dialogClosed"
      width="50%">
      <el-form :model="addruleForm" :rules="addruleFormRules" ref="addruleFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addruleForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类:">
          <el-cascader v-model="selectKeys"
                       :options="getCateCassifyList"
                       expand-trigger="hover"
                       clearable
                       :props="parentProps"
                       @change="parentChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategoriesData">确 定</el-button>
  </span>
    </el-dialog>
<!--根据ID编辑商品分类-->
    <el-dialog title="编辑分类"
               :visible.sync="editDialogVisible"
               width="50%">
      <el-form ref="addruleFormRef"
               :rules="addruleFormRules"
               :model="addruleForm"
               label-width="100px">
        <el-form-item label="分类名称:"
                      prop="cat_name">
          <el-input v-model="addruleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="editFormCate(addruleForm)">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      addruleFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择器配置对象
      parentProps: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的ID数组
      selectKeys: [],
      // 树形表格列表配置
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isSlot'
      }, {
        label: '排序',
        type: 'template',
        template: 'isSort'
      }, {
        label: '操作',
        type: 'template',
        template: 'isOperation'
      }]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$store.dispatch('getDataAction', this.queryInfo)
    },
    handleSizeChange (newSize) {
      this.$store.commit('sizeChange', newSize)
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    handleCurrentChange (newPage) {
      this.$store.commit('pageChange', newPage)
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    // 编辑商品分类
    editBtn (id) {
      this.$store.dispatch('editGategories', id)
      this.editDialogVisible = true
    },
    // 删除商品分类
    async delBtn (id) {
      const confirmStr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      await this.$store.dispatch('delDataActon', id)
      this.getData()
    },
    // 监听级联选择器 父级分类change事件
    parentChange () {
      if (this.selectKeys.length > 0) {
        this.addruleForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addruleForm.cat_level = this.selectKeys.length
      } else {
        this.addruleForm.cat_pid = 0
        this.addruleForm.cat_level = 0
      }
    },
    // 添加商品分类 获取父级分类
    addCategories () {
      this.addDialogVisible = true
      this.$store.dispatch('getParentAction')
    },
    // 提交添加的商品分类
    addCategoriesData () {
      this.$store.dispatch('addCategoriesAction', this.addruleForm)
      setTimeout(() => {
        this.getData()
      }, 0)
      this.addDialogVisible = false
    },
    // 添加商品对话框关闭事件
    dialogClosed () {
      this.$refs.addruleFormRef.resetFields()
    },
    // 编辑提交商品分类
    editFormCate (row) {
      this.$store.dispatch('editDataAction', row)
      setTimeout(() => {
        this.getData()
      }, 0)
      this.editDialogVisible = false
    }
  },
  computed: {
    ...mapState(['addruleForm', 'queryInfo', 'total', 'parentLevelList', 'getCateCassifyList'])
  }
}
</script>

<style scoped>
.block {
  margin-top: 20px;
}
.treeTable {
  font-size: 18px;
}
.slotBtn {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
.addBtn{
  margin-bottom: 20px;
}
</style>
