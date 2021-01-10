<template>
  <el-container class="homeContainer">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>宇宙科技有限公司管理系统</span>
      </div>
      <div>
        <el-button type="info" class="blackBtn" @click="blackBtn">后退</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'50px':'300px'">
        <el-row class="tac">
          <div class="tabBtn">
            <div @click="tabBtn">|||</div>
          </div>
          <el-col :span="24">
            <el-menu
              :default-active="activePath"
              background-color="#545c64"
              text-color="#fff"
              :collapse-transition ='false'
              :collapse="isCollapse"
              unique-opened
              router
              active-text-color="#ffd04b">
              <!-- 一级菜单 -->
              <el-submenu :index="item.id + ''" v-for="item in leftDataList" :key = "item.id">
                <template slot="title">
                  <i style="font-size: 28px; color: #f95" :class="iconObj[item.id]"></i>
                  <span style="font-size: 24px;" class="iconSpan">{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item-group id="font_s" v-for="ele in item.children" :key="ele.id">
                  <el-menu-item style="font-size:18px" @click="btnPush('/' + ele.path)" :index="'/' + ele.path">
                    <i class="el-icon-menu"></i>
                    {{ele.authName}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isCollapse: false,
      // 首亮第几个菜单
      activePath: ''
    }
  },
  created () {
    this.$store.dispatch('getLeftData')
    this.activePath = window.sessionStorage.getItem('activePathTo')
  },
  methods: {
    blackBtn () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    tabBtn () {
      this.isCollapse = !this.isCollapse
    },
    btnPush (path) {
      console.log('111', path)
      window.sessionStorage.setItem('activePathTo', path)
      this.activePath = path
    }
  },
  computed: {
    ...mapState(['leftDataList', 'iconObj'])
  }
}
</script>
<style scoped>
.homeContainer {
  height: 100%;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: left;
  border: 0;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
.tabBtn {
  height:25px;
  text-align: center;
  line-height: 25px;
}
.tabBtn div {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
  letter-spacing: 0.2em;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-submenu {
  margin-top: 20px
}
.el-menu-item{
  margin: 25px 0;
}
img{
  width: 50px;
  height: 40px;
  vertical-align:middle;
  margin-right: 15px;
}
span{
  font-size: 18px;
  color: #fff;
}
.el-menu{
  border: none !important;
}
.el-menu-item{
  font-size: 16px;
}
.iconSpan{
  margin-left: 10px;
}
</style>
