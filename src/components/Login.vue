<template>
<div id="login">
  <h1>宇宙科技有限公司电商管理系统</h1>
  <div class="loginBox">
    <el-form :model="loginData" ref="loginDataRef" :rules="loginDataRules" label-width="100px" >
      <el-form-item label="users" prop="username">
        <el-input v-model="loginData.username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="loginData.password"></el-input>
      </el-form-item>
      <el-form-item class="login_btn">
        <el-button type="primary" @click="loginUp">登录</el-button>
        <el-button @click="loginRef">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 登录数据名与密码
      loginData: {
        username: '',
        password: ''
      },
      loginDataRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    loginUp () {
      this.$refs.loginDataRef.validate(valid => {
        if (!valid) return this.$message.error('用户名或密码不能为空')
        this.$store.dispatch('getLoginData', this.loginData)
      })
    },
    loginRef () {
      this.$refs.loginDataRef.resetFields()
    }
  },
  computed: {

  }
}
</script>

<style scoped>
#login{
  width: 100%;
  height: 100%;
  background: #2b4b6b;
}
.loginBox{
  width: 450px;
  height: 300px;
  background:#fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
}
.el-form{
  width: 90%;
  margin-top: 50px;
}
.login_btn{
  position: absolute;
  right: 45px;
}
h1{
  font-size:60px;
  color: #f90;
  text-align: center;
  padding-top:100px;
}
</style>
