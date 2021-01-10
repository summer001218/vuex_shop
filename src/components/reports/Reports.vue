<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 1000px;height:800px;margin: 0 auto;"></div>
    </el-card>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      const echarts = require('echarts')
      const myChart = echarts.init(document.getElementById('main'))
      this.$store.dispatch('drawLineAction')
      setTimeout(() => {
        myChart.setOption(this.drawLineDataList)
      }, 50)
    }
  },
  computed: {
    ...mapState(['drawLineDataList'])
  }
}
</script>

<style scoped>

</style>
