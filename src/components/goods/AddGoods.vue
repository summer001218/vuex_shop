<template>
 <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>添加商品</el-breadcrumb-item>
   </el-breadcrumb>

   <el-card class="box-card">
     <el-steps :active="activeIndex-0"
               align-center
               finish-status="success">
       <el-step title="基本信息"></el-step>
       <el-step title="商品参数"></el-step>
       <el-step title="商品属性"></el-step>
       <el-step title="商品图片"></el-step>
       <el-step title="商品内容"></el-step>
       <el-step title="完成"></el-step>
     </el-steps>
     <el-form :model="goodsRuleForm"
              :rules="goodsRuleFormRules"
              label-position="top"
              ref="goodsRuleFormRef">
       <el-tabs :tab-position="tabPosition"
                :before-leave="tabBeforeLeave"
                @tab-click="tabGoodsData"
                v-model="activeIndex">
         <el-tab-pane label="基本信息"
                      name="0">
           <el-form-item label="商品名称"
                         prop="goods_name">
             <el-input v-model="goodsRuleForm.goods_name"></el-input>
           </el-form-item>
           <el-form-item label="商品价格"
                         prop="goods_price">
             <el-input v-model="goodsRuleForm.goods_price"
                       type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品重量"
                         prop="goods_weight">
             <el-input v-model="goodsRuleForm.goods_weight"
                       type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品数量"
                         prop="goods_number">
             <el-input v-model="goodsRuleForm.goods_number"
                       type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品分类"
                         prop="goods_cat">
             <el-cascader v-model="goodsRuleForm.goods_cat"
                          :options="getAddCassifyList"
                          :props="getValue"
                          clearable
                          expandTrigger="hover"
                          @change="handleChange"></el-cascader>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品参数"
                      name="1">
           <el-form-item :label="item.attr_name"
                         v-for="item in manyDataList"
                         :key='item.attr_id'>
             <el-checkbox-group v-model="item.attr_vals">
               <el-checkbox :label="ele"
                            border
                            v-for="(ele,i) in item.attr_vals"
                            :key="i"></el-checkbox>
             </el-checkbox-group>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品属性"
                      name="2">
           <el-form-item :label="item.attr_name"
                         v-for="item in onlyDataList"
                         :key="item.attr_id">
             <el-input v-model="item.attr_vals"></el-input>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品图片"
                      name="3">
           <el-upload :action="uploadUrl"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :headers="headersToken"
                      :on-success="successObj"
                      list-type="picture">
             <el-button size="small"
                        type="primary">点击上传</el-button>
           </el-upload>
         </el-tab-pane>
         <el-tab-pane label="商品内容"
                      name="4">
           <quill-editor :v-model="goodsRuleForm.quillEditorStr"></quill-editor>
           <el-button type="primary"
                      class="addGoods"
                      @click="addGoods">添加商品</el-button>
         </el-tab-pane>
       </el-tabs>
     </el-form>
   </el-card>
   <!-- 图片预览框 -->
   <el-dialog title="图片预览"
              :visible.sync="fileVisible"
              width="50%">
     <img :src="fileUrl"
          alt=""
          class="fileImg">
   </el-dialog>
 </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  data () {
    return {
      // tab选择器 位置定位
      tabPosition: 'left',
      // 步骤条位置
      activeIndex: '0',
      // 表单验证
      goodsRuleFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }

        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }

        ]
      },
      // 级联选择器 样式
      getValue: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 上传请求头 请求token
      headersToken: {
        Authorization: window.sessionStorage.getItem('token')
      },
      fileUrl: '',
      fileVisible: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$store.dispatch('getAddDataAction')
    },
    // 利用钩子 禁用tab切换
    tabBeforeLeave (activeName, oldActiveName) {
      // console.log(activeName, '去哪')
      // console.log(oldActiveName, '哪来')
      // console.log(this.goodsRuleForm, "ooo")
      if (oldActiveName === '0' && this.goodsRuleForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 选中触发TAB事件
    tabGoodsData () {
      if (this.activeIndex === '1') {
        const addGoodsObj = {
          id: this.cateId,
          sel: 'many'
        }
        this.$store.dispatch('manyDataAction', addGoodsObj)
      } else if (this.activeIndex === '2') {
        const addGoodsObj = {
          id: this.cateId,
          sel: 'only'
        }
        this.$store.dispatch('onlyDataAction', addGoodsObj)
      }
    },
    // 级联选择器change事件 监听是否为第三级分类
    handleChange () {
      if (this.goodsRuleForm.goods_cat.length !== 3) {
        this.goodsRuleForm.goods_cat = []
      }
    },
    // 图片已上传钩子函数 预览功能
    handlePreview (file) {
      this.fileVisible = true
      this.fileUrl = file.response.data.url
    },
    // 移除图片文件功能
    handleRemove (file) {
      const remPath = file.response.data.tmp_path
      const index = this.goodsRuleForm.pics.findIndex(ele => {
        // eslint-disable-next-line no-unused-expressions
        ele.pic === remPath
      })
      this.goodsRuleForm.pics.splice(index, 1)
    },
    // 文件上传成功的钩子函数
    successObj (response) {
      // 获取响应数据图片地址 改变成对象
      const successInfo = { pic: response.data.tmp_path }
      // 把对象地址Push进数组
      this.goodsRuleForm.pics.push(successInfo)
    },
    // 添加商品
    addGoods () {
      this.$refs.goodsRuleFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请完整添加表单！')
        }
        const formData = _.cloneDeep(this.goodsRuleForm)
        formData.goods_cat = formData.goods_cat.join(',')

        // 动态数组转换
        this.manyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.goodsRuleForm.attrs.push(newInfo)
        })

        // 静态数组转换
        this.onlyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.goodsRuleForm.attrs.push(newInfo)
        })

        formData.attrs = this.goodsRuleForm.attrs
        this.$store.dispatch('addGoodsAction', formData)
        this.activeIndex = '5'
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    ...mapState(['goodsRuleForm', 'getAddCassifyList', 'manyDataList', 'onlyDataList', 'uploadUrl']),
    cateId () {
      return this.goodsRuleForm.goods_cat[2]
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.fileImg {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>
