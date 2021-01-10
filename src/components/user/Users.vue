<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入用户名"
          v-model="queryInfoData.query"
          @clear="this.getData"
          clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addUsers">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table border :data="usersList" stripe>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-switch
            change="scope.row.mg_state"
            @change="tabStatus(scope.row)"
            v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="用户编辑" placement="top" :enterable="false">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip content="用户删除" placement="top" :enterable="false">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="revomeUsers(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="tabRoles(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfoData.pagesize"
        :current-page="queryInfoData.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-card>

<!--  // 添加用户弹出框-->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    @close = 'resetData'
    width="50%">
    <el-form :model="usersInfo" ref="usersInfoRef" :rules="usersInfoRules" label-width="100px">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="usersInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="usersInfo.password"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="usersInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="usersInfo.email"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUsersList">确 定</el-button>
  </span>
  </el-dialog>

<!--  编辑用户信息-->
  <el-dialog
    title="修改用户"
    :visible.sync="editDialogVisible"
    @close = 'editResetData'
    width="50%">
    <el-form :model="editUsersInfo" ref="editUsersInfoRef" :rules="editUsersInfoRules" label-width="100px">
      <el-form-item label="用户名称" prop="username">
        <el-input :disabled="true" v-model="editUsersInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="editUsersInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUsersInfo.email"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUsersList(editUsersInfo)">确 定</el-button>
  </span>
  </el-dialog>

<!--  角色修改弹出框-->
  <el-dialog
    title="分配角色"
    :visible.sync="rolesDialogVisible"
    width="50%">
     <p>当前的用户：{{ usersListGetter.username }}</p>
     <p>当前的角色：{{ usersListGetter.role_name }}</p>
     <p>分配新角色：  <el-select v-model="rolesId" placeholder="请选择" clearable>
       <el-option
         v-for="item in rolesDataInfoList"
         :key="item.id"
         :label="item.roleName"
         :value="item.id">
       </el-option>
     </el-select></p>
    <span slot="footer" class="dialog-footer">
    <el-button @click="rolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="rolesDataBtn(usersListGetter)">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 添加用户弹出框隐藏与显示开关
      addDialogVisible: false,
      // 编辑用户弹出框显示与隐藏开关
      editDialogVisible: false,
      // 分配角色弹出框
      rolesDialogVisible: false,
      // 角色ID
      rolesId: '',
      // 添加用户 效验input
      usersInfoRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户 效验
      editUsersInfoRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取数据渲染列表
    this.getData()
  },
  methods: {
    // 获取用户列表数据
    getData () {
      this.$store.dispatch('getUserData', this.queryInfoData)
    },
    // 获取最新页数
    handleSizeChange (newSize) {
      this.$store.commit('editQuerySize', newSize)
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    // 获取最新当前页
    handleCurrentChange (newPage) {
      this.$store.commit('editQueryPage', newPage)
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    // 搜索用户名
    searchBtn () {
      this.getData()
    },
    // 添加用户 弹出对话框
    addUsers () {
      this.addDialogVisible = true
    },
    // 确认添加用户信息
    addUsersList () {
      this.$refs.usersInfoRef.validate(valid => {
        if (!valid) {
          return
        }
        this.$store.dispatch('addUsersListAction', this.usersInfo)
        this.addDialogVisible = false
        setTimeout(() => {
          this.getData()
        }, 0)
      })
    },
    // 监听对话框关闭事件 重置对话框
    resetData () {
      this.$refs.usersInfoRef.resetFields()
    },
    // 切换用户装态
    tabStatus (newStatus) {
      this.$store.dispatch('tabStatusData', newStatus)
    },
    // 编辑框弹出
    edit (id) {
      this.editDialogVisible = true
      this.$store.dispatch('editAction', id)
    },
    // 监听编辑对话框关闭
    editResetData () {
      this.$refs.editUsersInfoRef.resetFields()
    },
    // 编辑用户信息 确认
    editUsersList (row) {
      this.$refs.editUsersInfoRef.validate(valid => {
        if (!valid) {
          return this.$message.info('请输入正确的信息')
        }
        this.$store.dispatch('editListAction', row)
        this.editDialogVisible = false
        setTimeout(() => {
          this.getData()
        }, 0)
      })
    },
    // 删除用户信息
    async revomeUsers (id) {
      const confirmStr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmStr !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      this.$store.dispatch('addUsersList', id)
      setTimeout(() => {
        this.getData()
      }, 0)
    },
    // 分配角色
    tabRoles (row) {
      this.rolesDialogVisible = true
      this.$store.commit('setData', row)
      this.$store.dispatch('rolesData')
    },
    // 角色分配完成
    rolesDataBtn () {
      if (!this.rolesId) {
        return this.$message.error('请重新选择角色')
      }
      const solesObj = {
        id: this.usersListGetter.id,
        rid: this.rolesId
      }
      this.$store.dispatch('rolesReset', solesObj)
      this.rolesDialogVisible = false
      setTimeout(() => {
        this.getData()
      }, 0)
    }
  },
  computed: {
    ...mapState(['usersList', 'total', 'usersInfo', 'editUsersInfo', 'rolesDataInfoList']),
    ...mapMutations(['getUserDataList']),
    ...mapGetters(['queryInfoData', 'usersListGetter'])
  }
}
</script>

<style scoped>
.block{
  margin-left: 0;
}
.el-dialog p{
  margin-bottom: 15px;
  font-size: 18px;
}
</style>
