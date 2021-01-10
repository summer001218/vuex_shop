<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon>
    </el-alert>
    <!-- 级联选择器 -->
    <el-row class="block">
      <el-col>
        <span class="demonstration">选择商品分类：</span>
        <el-cascader v-model="selectKeys"
                     :options="getCassifyList"
                     :props="parentProps"
                     clearable
                     @change="classifyChange"></el-cascader>
      </el-col>
    </el-row>
    <el-tabs v-model="paramsFormActive" @tab-click="paramsHandleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isBtnBolen" @click="addDialogVisible = true">添加参数</el-button>
        <!-- 数据表格 -->
        <el-table style="width: 100%"
                  :data="manyData"
                  border>
          <!-- 展开 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="tabClose(i,scope.row)"
                      :type="item.type">
                {{item}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引 -->
          <el-table-column label="#"
                           type="index"
                           width="80px">
          </el-table-column>
          <!-- 名称 -->
          <el-table-column label="参数名称"
                           prop="attr_name">
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="editBtn(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="delBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnBolen" @click="addDialogVisible = true">添加属性</el-button>
        <!-- 数据表格 -->
        <el-table style="width: 100%"
                  :data="onlyData"
                  border>
          <!-- 展开 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="tabClose(i,scope.row)"
                      :type="item.type">
                {{item}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引 -->
          <el-table-column label="#"
                           type="index"
                           width="80px">
          </el-table-column>
          <!-- 名称 -->
          <el-table-column label="属性名称"
                           prop="attr_name">
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="editBtn(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="delBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
<!--   添加参数 属性弹出框-->
  <el-dialog
    :title="'添加' + titleText"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addclosed">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
      <el-form-item :label="titleText + '名称'" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParam">确 定</el-button>
  </span>
  </el-dialog>

  <!-- 编辑修改参数和属性名 -->
  <el-dialog :title="'编辑' + titleText"
             :visible.sync="editclassifyDialogVisible"
             @close="editRef"
             width="50%">
    <el-form :model="editClassifyForm"
             :rules="editClassifyFormRules"
             ref="addClassifyFormRef"
             label-width="100px">
      <el-form-item :label="titleText+'名称：'"
                    prop="attr_name">
        <el-input v-model="editClassifyForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
        <el-button @click="editclassifyDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editcClassifyConfirm(editClassifyForm)">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // 级联选择器配置对象
      parentProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的ID数组
      selectKeys: [],
      // 添加对话框显示与隐藏
      addDialogVisible: false,
      // 编辑对话框
      editclassifyDialogVisible: false,
      // params 选项卡首亮选项
      paramsFormActive: 'many',
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editClassifyFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$store.dispatch('getParamsAction')
  },
  methods: {
    // 级联选择器 change事件
    classifyChange () {
      this.getParamsData()
    },
    // 选项卡 切换触发
    paramsHandleClick () {
      this.getParamsData()
    },
    // 获取数据
    getParamsData () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyData = []
        this.onlyData = []
      }
      const paramsObj = {
        id: this.creatID,
        sel: this.paramsFormActive
      }
      this.$store.dispatch('getParamsDataAction', paramsObj)
    },
    // 关闭 删除标签
    tabClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.getEditData(row)
    },
    // 监听 失焦 键盘 enter事件
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 把input输入的值 传给数组 渲染到页面
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.getEditData(row)
    },
    // 监听添加对话框关闭
    addclosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加标签
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 编辑参数
    editBtn (id) {
      this.editclassifyDialogVisible = true
      const editObj = {
        id: this.creatID,
        attr_id: id,
        sel: this.paramsFormActive
      }
      this.$store.dispatch('editParamsAction', editObj)
    },
    editRef () {
      this.$refs.addClassifyFormRef.resetFields()
    },
    // 提交编辑后的数据
    editcClassifyConfirm (row) {
      console.log(row)
      this.$refs.addClassifyFormRef.validate(valid => {
        if (!valid) return
        this.$store.dispatch('submitEditAction', row)
        this.editclassifyDialogVisible = false
        setTimeout(() => {
          this.getParamsData()
        }, 0)
      })
    },
    // 删除参数
    async delBtn (row) {
      const confirmStr = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      const delObj = {
        id: this.creatID,
        attr_id: row.attr_id
      }
      await this.$store.dispatch('delParamsAction', delObj)
      setTimeout(() => {
        this.getParamsData()
      }, 100)
    },
    // 添加参数 属性
    addParam () {
      const addParamObject = {
        id: this.creatID,
        attr_sel: this.paramsFormActive,
        attr_name: this.addForm.attr_name
      }
      this.$store.dispatch('addParamAction', addParamObject)
      this.addDialogVisible = false
      setTimeout(() => {
        this.getParamsData()
      }, 0)
    },
    // 保存 参数数据
    getEditData (row) {
      const saveTagObj = {
        id: this.creatID,
        attr_id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: this.paramsFormActive,
        attr_vals: row.attr_vals.join(' ')
      }
      this.$store.dispatch('saveTagAction', saveTagObj)
    }
  },
  computed: {
    ...mapState(['getCassifyList', 'manyData', 'onlyData', 'addForm', 'editClassifyForm']),
    isBtnBolen () {
      if (this.selectKeys.length !== 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectKeys = []
        return true
      }
      return false
    },
    creatID () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    titleText () {
      if (this.paramsFormActive === 'many') {
        return '参数'
      }
      return '属性'
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 120px;
}
</style>
