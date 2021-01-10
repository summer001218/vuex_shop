<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfoData.query"
                    @clear="this.getOrdersData"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 数据列表区 -->
      <el-table :data="ordersList"
                border
                stripe
                style="width: 100%"
                :row-style="iRowStyle"
                :cell-style="iCellStyle"
                :header-row-style="iHeaderRowStyle"
                :header-cell-style="iHeaderCellStyle">
        <el-table-column type="index"
                         label="#"
                         width="60">
        </el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"
                         width="580">
        </el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"
                         width="100">
        </el-table-column>
        <el-table-column prop="pay_status"
                         label="是否付款"
                         width="100">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货"
                         width="100">
        </el-table-column>
        <el-table-column label="订单时间"
                         width="300">
          <template slot-scope="scope">
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size='medium'
                       class="btnRight"
                       @click="editBtn"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size='medium'
                       @click="expressageBtn"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfoData.pagenum"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="queryInfoData.pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-card>
<!--    编辑地址-->
    <el-dialog title="修改地址"
               :visible.sync="editVisible"
               width="50%"
               @close="addressClosed">
      <el-form ref="editFormRef"
               :model="editForm"
               :rules="editFormRules"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader v-model="editForm.address1"
                       :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

<!--    快递信息-->
    <el-dialog
      title="快递信息"
      :visible.sync="expressDialogVisible"
      width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="expressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="expressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import cityData from './citydata'
export default {
  data () {
    return {
      editVisible: false,
      editForm: {
        address1: '',
        address2: ''
      },
      editFormRules: {
        address1: [{ required: true, message: '请输入省市区', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData,
      expressDialogVisible: false
    }
  },
  created () {
    this.getOrdersData()
  },

  methods: {
    // 获取数据列表
    getOrdersData () {
      this.$store.dispatch('ordersListAction', this.queryInfoData)
    },
    // 搜索确认
    getGoodsOrders () {
      this.getOrdersData()
    },
    // 修改表单样式
    iRowStyle: function ({ row, rowIndex }) {
      return 'height:30px'
    },
    iHeaderRowStyle: function ({ row, rowIndex }) {
      return 'height:30px'
    },
    iCellStyle: function ({ row, column, rowIndex, columnIndex }) {
      return 'padding:20px 0'
    },
    iHeaderCellStyle: function ({ row, column, rowIndex, columnIndex }) {
      return 'padding:20px 0'
    },
    // 编辑
    editBtn () {
      this.editVisible = true
    },
    // 物流信息
    expressageBtn () {
      this.expressDialogVisible = true
      this.$store.dispatch('expressMessageInquire')
    },
    // 获取最新显示几页
    handleSizeChange (newSize) {
      this.$store.commit('sizeChange', newSize)
      setTimeout(() => {
        this.getOrdersData()
      })
    },
    // 获取最新 当前页面
    handleCurrentChange (newPage) {
      this.$store.commit('pageChange', newPage)
      setTimeout(() => {
        this.getOrdersData()
      })
    },
    // 对话框关闭事件
    addressClosed () {
      this.$refs.editFormRef.resetFields()
    }
  },
  computed: {
    ...mapState(['ordersList', 'total']),
    ...mapGetters(['queryInfoData'])
  }
}
</script>

<style scoped>

</style>
