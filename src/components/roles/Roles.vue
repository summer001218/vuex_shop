<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
    <el-row>
      <el-button type="primary"
                 @click="roleBtn">添加角色</el-button>
    </el-row>
<!--     列表区域-->
    <el-table border
              stripe
              :data="roleListGetter">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['bottombor',i===0?'topbor':'']"
                  v-for="(item,i) in scope.row.children"
                  :key="item.id"
                  class="centerFlex">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag closable>
                {{item.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级 三级权限 -->
            <el-col :span="18">
              <el-row :class="[i1 === 0 ? '':'topbor','centerFlex']"
                      v-for="(item1,i1) in item.children"
                      :key="item1.id">
                <el-col :span="5">
                  <el-tag type="success"
                          closable>
                    {{item1.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="13">
                  <el-col>
                    <el-tag v-for="item2 in item1.children"
                            :key="item2.id"
                            closable
                            @close="tagDel(scope.row,item2.id)"
                            type="warning">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"
                       label="#">
      </el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称">
      </el-table-column>
      <el-table-column prop="roleDesc"
                       label="角色描述">
      </el-table-column>
      <el-table-column label="操作"
                       class="roleBtnSize">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-edit"
                     @click="editSole(scope.row.id)">编辑</el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     @click="delSole(scope.row.id)">删除</el-button>
          <el-button type="warning"
                     size="small"
                     icon="el-icon-setting"
                     class="setSole"
                     @click="allotSole(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

<!--  添加角色弹出框-->
  <el-dialog
    title="添加角色"
    :visible.sync="addSoleDialogVisible"
    @close="addreset"
    width="50%">
    <el-form :model="roleDataObj" :rules="roleDataObjRules" ref="roleDataObjRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleDataObj.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="roleDataObj.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addSoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSoleData">确 定</el-button>
  </span>
  </el-dialog>

<!--  编辑角色弹出框-->
  <el-dialog
    title="编辑角色"
    :visible.sync="editDialogVisible"
    width="50%">
    <el-form :model="editSoleObj" :rules="editSoleObjRules" ref="editSoleObjRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editSoleObj.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editSoleObj.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="affirmEditData">确 定</el-button>
  </span>
  </el-dialog>

<!--  分配权限弹出框-->
  <el-dialog
    title="分配权限"
    :visible.sync="authorityDialogVisible"
    @close="dialogClosed"
    width="50%">
    <el-tree :data="allotSoleList"
             :props="allotSoleDefaultProps"
             :default-checked-keys="allotSoleId"
             show-checkbox
             node-key='id'
             ref="allotSoleRef"
             default-expand-all></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="authorityDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="roleRightsData">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      // 添加角色弹出框
      addSoleDialogVisible: false,
      // 编辑角色弹出框
      editDialogVisible: false,
      // 分配权限弹出框
      authorityDialogVisible: false,
      // 添加角色效验
      roleDataObjRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 编辑角色效验
      editSoleObjRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 权限模式
      allotSoleDefaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 添加权限的角色ID
      roleId: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取角色数据列表
    getData () {
      this.$store.dispatch('getSoleDataList')
    },
    // 添加角色
    roleBtn () {
      this.addSoleDialogVisible = true
    },
    // 添加角色数据
    addSoleData () {
      this.$store.dispatch('addSoleDataAction', this.roleDataObj)
      this.addSoleDialogVisible = false
      setTimeout(() => {
        this.getData()
      }, 300)
    },
    // 监听关闭事件 根据ID删除指定权限
    tagDel (row, id) {
      const tagObj = {
        roleId: row.id,
        rightId: id
      }
      this.$store.dispatch('tagDel', tagObj)
      setTimeout(() => {
        this.getData()
      }, 100)
    },
    // 编辑 根据ID获取数据
    editSole (id) {
      this.editDialogVisible = true
      this.$store.dispatch('editSoleAction', id)
    },
    // 确认编辑数据
    affirmEditData () {
      this.$store.dispatch('setAffirmEditData', this.editSoleObj)
      this.editDialogVisible = false
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    // 删除
    async delSole (id) {
      const confirmStr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      this.$store.dispatch('delSoleData', id)
      setTimeout(() => {
        this.getData()
      }, 300)
    },
    // 分配权限
    allotSole (row) {
      this.roleId = row.id
      this.$store.dispatch('allotSoleAction')
      this.getRecursive(row, this.allotSoleId)
      this.authorityDialogVisible = true
    },
    // 添加角色框 重置事件
    addreset () {
      this.$refs.roleDataObjRef.resetFields()
    },
    // 递归函数
    getRecursive (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getRecursive(item, arr)
      })
    },
    // 对话框关闭事件
    dialogClosed () {
      this.$store.commit('closedEvent')
    },
    // 给角色添加权限
    roleRightsData () {
      const rolesArr = [
        ...this.$refs.allotSoleRef.getCheckedKeys(),
        ...this.$refs.allotSoleRef.getHalfCheckedKeys()
      ]
      const rolesStr = rolesArr.join(',')
      const rolesObj = {
        id: this.roleId,
        rids: rolesStr
      }
      this.$store.dispatch('rolesStrAction', rolesObj)
      this.authorityDialogVisible = false
      setTimeout(() => {
        this.getData()
      }, 0)
    }
  },
  computed: {
    ...mapState(['roleList', 'roleDataObj', 'editSoleObj', 'allotSoleList', 'allotSoleId']),
    ...mapGetters(['roleListGetter'])
  }
}
</script>

<style scoped>
.topbor {
  border-top: 1px solid #eee;
}
.bottombor {
  border-bottom: 1px solid #eee;
}
.roleBtn {
  width: 150px;
  height: 50px;
  font-size: 20px;
}
.el-col {
  margin: 7px;
}
.el-tag {
  margin: 7px;
  font-size: 16px;
}
.centerFlex {
  display: flex;
  align-items: center;
}
</style>
