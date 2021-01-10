import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'
Vue.use(Vuex)

Message.closeAll()
export default new Vuex.Store({
  state: {
    // 用户数据列表
    usersList: [],
    // 数据总数
    total: 0,
    // 左侧数据列表
    leftDataList: [],
    // 左侧列表图标
    iconObj:
      {
        125: 'iconfont icon-user',
        103: 'iconfont icon-lifangti',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-order',
        145: 'iconfont icon-dianshi'
      },
    // query数据
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 5
    },
    // 添加用户数据源
    usersInfo: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    // 编辑用户数据源
    editUsersInfo: {
      id: '',
      email: '',
      mobile: ''
    },
    // 分配角色数据源
    rolesDataInfo: {},
    // 角色列表数据
    rolesDataInfoList: {},

    // 权限列表数据源
    rightsTableData: [],
    // 角色列表数据源
    roleList: [],
    // 添加角色请求对象
    roleDataObj: {
      roleName: '',
      roleDesc: ''
    },
    // 编辑 根据ID获取到的数据源
    editSoleObj: {},
    // 所有权限数据列表
    allotSoleList: [],
    // 权限选中ID数组
    allotSoleId: [],
    // 订单数据列表
    ordersList: [],
    // 折线图数据
    drawLineDataList: {},
    // 商品列表数据
    goodsTableData: [],
    // 根据ID编辑修改数据
    editGoodsIdData: {},
    // 添加商品表单数据
    goodsRuleForm: {
      goods_name: '',
      goods_price: '0',
      goods_weight: '0',
      goods_number: '0',
      goods_cat: '',
      pics: [],
      quillEditorStr: '',
      goods_introduce: '',
      attrs: []
    },
    // 商品参数
    manyData: [],
    // 商品属性
    onlyData: [],
    // 图片上传地址
    uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
    // 添加分类数据源
    addruleForm: {
      cat_pid: 0,
      cat_name: '',
      cat_level: 0
    },
    // 商品分类表格数据列表源
    tableData: [],
    // 级联选择器数据源
    getCassifyList: [],
    // 添加商品分类的级联选择器数据源
    getAddCassifyList: [],
    // categories 级联选择器商品分类数据源
    getCateCassifyList: [],
    // 父级分类数据列表源
    parentLevelList: [],
    // params 添加form表单数据源
    addForm: {
      attr_name: ''
    },
    // params 编辑表单数据源
    editClassifyForm: {
      attr_name: ''
    }
  },
  mutations: {
    // 获取用户列表数据
    getUserDataList (state, res) {
      state.usersList = res.users
      state.total = res.total
    },
    // 获取左侧菜单数据
    getLeftDataList (state, res) {
      state.leftDataList = res
    },
    // 更新queryInfo数据
    editQuerySize (state, newSize) {
      state.queryInfo.pagesize = newSize
    },
    editQueryPage (state, newPage) {
      state.queryInfo.pagenum = newPage
    },
    // 编辑 根据ID获取数据
    editIdDatalist (state, res) {
      state.editUsersInfo = res
    },
    // 分配角色数据转换
    setData (state, data) {
      state.rolesDataInfo = data
    },
    // 获取角色列表数据
    rolesDataList (state, res) {
      state.rolesDataInfoList = res
    },
    // 重置角色获取列表
    rolesResetList (state, res) {
      state.rolesDataInfoList = res
    },

    // 权限数据列表
    setRightsList (state, res) {
      state.rightsTableData = res
    },
    // 角色数据列表
    setSoleDataList (state, res) {
      state.roleList = res
    },
    // 编辑 根据ID获取数据
    setEditSole (state, res) {
      state.editSoleObj = res
    },
    // 删除角色权限
    tagDelList (state, res) {
      state.roleList.children = res
    },
    // 获取权限数据列表
    setAllotSoleList (state, res) {
      state.allotSoleList = res
    },
    // 对话框关闭 清空数组
    closedEvent (state) {
      state.allotSoleId = []
    },
    // 获取订单列表
    setOrdersDataList (state, res) {
      state.total = res.total
      state.ordersList = res.goods
    },
    // 刷新显示几条数据
    sizeChange (state, newSize) {
      state.queryInfo.pagesize = newSize
    },
    // 刷新当前第几页
    pageChange (state, newPage) {
      state.queryInfo.pagenum = newPage
    },
    // 获取折线图数据
    drawLineData (state, res) {
      state.drawLineDataList = res
    },
    // 获取商品数据列表
    getGoodsList (state, res) {
      state.goodsTableData = res.goods
      state.total = res.total
    },
    // 根据ID获取数据信息 编辑修改
    editGoodsIdData (state, res) {
      state.editGoodsIdData = res
    },
    // 获取商品分类列表
    getAddDataList (state, res) {
      state.getAddCassifyList = res
    },
    // 获取商品参数
    getManyData (state, res) {
      res.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
      state.manyDataList = res
    },
    // 获取商品属性
    getOnlyData (state, res) {
      state.onlyDataList = res
    },
    // 获取父级分类
    setParentData (state, res) {
      state.parentLevelList = res
      console.log(state.parentLevelList)
    },
    // 根据ID获取商品分类 编辑修改
    setEditData (state, res) {
      state.addruleForm = res
    },
    setParamsData (state, res) {
      state.getCassifyList = res
    },
    // Categories商品数据列表渲染
    getCateDataList (state, res) {
      state.getCateCassifyList = res.result
      state.total = res.total
      state.queryInfo.pagesize = res.pagesize
      state.queryInfo.pagenum = res.pagenum
    },
    // params 参数数据获取
    manyDataList (state, res) {
      state.manyData = res
    },
    // Params 属性数据获取
    onlyDataList (state, res) {
      state.onlyData = res
    },
    // Params 编辑获取数据
    editParamsData (state, res) {
      state.editClassifyForm = res
    }
  },
  actions: {
    // 登录数据
    getLoginData (context, step) {
      axios
        .get('login', {
          params: step
        })
        .then(({
          data: res
        }) => {
          if (res.meta.status !== 200) {
            return
          }
          window.sessionStorage.setItem('token', res.data.token)
          router.push('/home')
        })
        .catch(err => err)
    },
    // 用户列表数据获取
    getUserData (context, step) {
      axios
        .get('users', {
          params: step
        })
        .then(({
          data: res
        }) => {
          if (res.meta.status !== 200) {
            return Message({
              message: '获取用户列表失败',
              type: 'error'
            })
          }
          context.commit('getUserDataList', res.data)
        })
    },
    // 获取左侧列表数据
    getLeftData (context, step) {
      axios.get('menus').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取左侧列表失败',
            type: 'error'
          })
        }
        context.commit('getLeftDataList', res.data)
      })
    },
    // 修改用户状态
    tabStatusData (context, step) {
      axios.put(`users/${step.id}/state/${step.mg_state}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '修改状态失败',
            type: 'error'
          })
        }
        Message({
          message: '修改用户状态成功',
          type: 'success'
        })
      })
    },
    // 添加用户信息
    addUsersListAction (context, step) {
      axios.post('users', step).then(({ data: res }) => {
        if (res.meta.status !== 201) {
          return Message({
            message: '创建用户失败',
            type: 'error'
          })
        }
        Message({
          message: '创建新用户成功',
          type: 'success'
        })
      })
    },
    // 根据ID获取用户信息
    editAction (context, step) {
      axios.get('users/' + step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取用户信息失败',
            type: 'error'
          })
        }
        context.commit('editIdDatalist', res.data)
      })
    },
    // 修改用户信息
    editListAction (context, step) {
      axios.put('users/' + step.id, step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '修改信息失败',
            type: 'error'
          })
        }
        Message({
          message: '修改信息成功',
          type: 'success'
        })
      })
    },
    // 删除用户信息
    addUsersList (context, step) {
      axios.delete('users/' + step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '删除用户失败',
            type: 'error'
          })
        }
        Message({
          message: '删除用户成功',
          type: 'success'
        })
      })
    },
    // 用户列表 获取角色信息
    rolesData (context) {
      axios.get('roles').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        Message({
          message: '获取数据成功',
          type: 'success'
        })
        context.commit('rolesDataList', res.data)
      })
    },
    // 角色重置
    rolesReset (context, step) {
      axios.put(`users/${step.id}/role`, {
        rid: step.rid
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '分配角色失败',
            type: 'error'
          })
        }
        Message({
          message: '分配角色成功',
          type: 'success'
        })
        context.commit('rolesResetList', res)
      })
    },

    // 权限列表获取
    getRightsList (context) {
      axios.get('rights/list').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        context.commit('setRightsList', res.data)
      })
    },
    // 获取角色列表
    getSoleDataList (context) {
      axios.get('roles').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        context.commit('setSoleDataList', res.data)
      })
    },
    // 添加角色数据
    addSoleDataAction (context, step) {
      axios.post('roles', step).then(({ data: res }) => {
        if (res.meta.status !== 201) {
          return Message({
            message: '添加数据失败',
            type: 'error'
          })
        }
        Message({
          message: '添加数据成功',
          type: 'success'
        })
      })
    },
    // 编辑 根据ID修改数据
    editSoleAction (context, id) {
      axios.get('roles/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        context.commit('setEditSole', res.data)
      })
    },
    // 编辑 确认修改数据
    setAffirmEditData (context, step) {
      axios.put('roles/' + step.roleId, step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '修改数据失败',
            type: 'error'
          })
        }
        Message({
          message: '修改数据成功',
          type: 'success'
        })
      })
    },
    // 删除角色数据
    delSoleData (context, id) {
      axios.delete('roles/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '',
            type: 'error'
          })
        }
        Message({
          message: '删除数据成功',
          type: 'success'
        })
      })
    },
    // 根据ID删除指定权限
    tagDel (context, step) {
      axios.delete(`roles/${step.roleId}/rights/${step.rightId}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '删除数据失败',
            type: 'error'
          })
        }
        Message({
          message: '删除数据成功',
          type: 'success'
        })
        context.commit('tagDelList', res.data)
      })
    },
    // 获取所有权限列表
    allotSoleAction (context) {
      axios.get('rights/tree').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取权限失败',
            type: 'error'
          })
        }
        context.commit('setAllotSoleList', res.data)
      })
    },
    // 角色添加权限数据
    rolesStrAction (context, step) {
      axios.post(`roles/${step.id}/rights`, step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '分配权限失败',
            type: 'error'
          })
        }
        Message({
          message: '权限分配成功',
          type: 'success'
        })
      })
    },
    // 获取订单数据列表
    ordersListAction (context, step) {
      axios.get('/orders', { params: step }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        context.commit('setOrdersDataList', res.data)
      })
    },
    // 物流信息查询
    expressMessageInquire (context) {
      axios.get('/kuaidi/1106975712662').then(({ data: res }) => {
      })
    },
    // 数据图形数据
    drawLineAction (context) {
      axios.get('reports/type/1').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取折线图数据失败',
            type: 'error'
          })
        }
        context.commit('drawLineData', res.data)
      })
    },
    // 获取商品数据列表
    getGoodsList (context, step) {
      axios.get('goods', {
        params: step
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '获取商品列表失败',
            type: 'error'
          })
        }
        context.commit('getGoodsList', res.data)
      })
    },
    // 编辑 根据ID获取商品信息
    editGoodsData (context, id) {
      axios.get('goods/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取用户信息失败',
            typer: 'error'
          })
        }
        context.commit('editGoodsIdData', res.data)
      })
    },
    // 修改商品数据
    editGoodsAction (context, step) {
      axios.put('goods/' + step.id, step.data).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '修改数据失败',
            type: 'error'
          })
        }
        Message({
          message: '修改数据成功',
          type: 'success'
        })
      })
    },
    // 删除商品
    deleteGoods (context, id) {
      axios.delete('goods/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '删除数据失败',
            type: 'error'
          })
        }
        Message({
          message: '删除商品成功',
          type: 'success'
        })
      })
    },
    // categories 获取商品分类列表
    getDataAction (context, step) {
      axios.get('categories', {
        params: step
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取商品分类列表失败',
            type: 'error'
          })
        }
        console.log(res, '111')
        context.commit('getCateDataList', res.data)
      })
    },
    getAddDataAction (context, step) {
      axios.get('categories', {
        params: step
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取商品分类列表失败',
            type: 'error'
          })
        }
        console.log(res, '111')
        context.commit('getAddDataList', res.data)
      })
    },
    // 获取商品参数
    manyDataAction (context, step) {
      axios.get(`categories/${step.id}/attributes`, {
        params: {
          sel: step.sel
        }
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '获取商品参数失败',
            type: 'error'
          })
        }
        console.log(res.data)
        context.commit('getManyData', res.data)
      })
    },
    // 获取商品属性
    onlyDataAction (context, step) {
      axios.get(`categories/${step.id}/attributes`, {
        params: { sel: step.sel }
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '获取商品属性失败',
            type: 'error'
          })
        }
        context.commit('getOnlyData', res.data)
      })
    },
    // 添加商品
    addGoodsAction (context, step) {
      axios.post('goods', step).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '商品添加失败',
            type: 'error'
          })
        }
        Message({
          message: '商品添加成功',
          type: 'success'
        })
      })
    },
    // 异步获取父级分类数据
    getParentAction (context) {
      axios.get('categories', {
        params: { type: 2 }
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取父级分类失败',
            type: 'error'
          })
        }
        console.log(res.data, '111')
        context.commit('setParentData', res.data)
      })
    },
    // 根据ID编辑商品分类
    editGategories (context, id) {
      axios.get('categories/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '获取数据失败',
            type: 'error'
          })
        }
        context.commit('setEditData', res.data)
      })
    },
    // 提交编辑后数据
    editDataAction (context, step) {
      axios.put('categories/' + step.cat_id, {
        cat_name: step.cat_name
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '',
            type: 'error'
          })
        }
        Message({
          message: '修改商品分类名称成功',
          type: 'success'
        })
      })
    },
    // 根据id获取要删除商品分类数据
    delDataActon (context, id) {
      axios.delete('categories/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '删除数据失败',
            type: 'error'
          })
        }
        Message({
          message: '删除数据成功',
          type: 'success'
        })
      })
    },
    // 添加商品数据
    addCategoriesAction (context, step) {
      axios.post('categories', step).then(({ data: res }) => {
        if (res.meta.status !== 201) {
          return Message({
            message: '添加商品分类失败',
            type: 'error'
          })
        }
        Message({
          message: '添加商品分类成功',
          type: 'success'
        })
      })
    },
    // 获取级联选择器的商品分类数据
    getParamsAction (context) {
      axios.get('categories').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '',
            type: 'error'
          })
        }
        context.commit('setParamsData', res.data)
      })
    },
    // Params获取属性 参数数据
    getParamsDataAction (context, step) {
      axios.get(`categories/${step.id}/attributes`, {
        params: { sel: step.sel }
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '获取属性参数失败',
            type: 'error'
          })
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 给每一行标签添加隐藏显示开关
          item.inputVisible = false
          // 给每一行标签添加双向绑定属性
          item.inputValue = ''
        })
        if (step.sel === 'many') {
          context.commit('manyDataList', res.data)
        } else {
          context.commit('onlyDataList', res.data)
        }
      })
    },
    // 提交添加商品参数属性的数据
    addParamAction (context, step) {
      axios.post(`categories/${step.id}/attributes`, {
        attr_sel: step.attr_sel,
        attr_name: step.attr_name
      }).then(({ data: res }) => {
        if (res.meta.status !== 201) {
          return Message({
            message: '添加商品参数属性失败',
            type: 'error'
          })
        }
        Message({
          message: '添加商品参数属性成功',
          type: 'success'
        })
      })
    },
    // 根据ID获取编辑用的信息
    editParamsAction (context, step) {
      axios.get(`categories/${step.id}/attributes/${step.attr_id}`, {
        params: {
          sel: step.sel
        }
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '',
            type: 'error'
          })
        }
        context.commit('editParamsData', res.data)
      })
    },
    // 提交编辑数据
    submitEditAction (context, step) {
      axios.put(`categories/${step.cat_id}/attributes/${step.attr_id}`, {
        attr_name: step.attr_name,
        attr_sel: step.attr_sel
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          Message({
            message: '提交数据失败',
            type: 'error'
          })
        }
        Message({
          message: '提交数据成功',
          type: 'success'
        })
      })
    },
    // 删除商品参数属性
    delParamsAction (context, step) {
      axios.delete(`categories/${step.id}/attributes/${step.attr_id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '删除数据失败',
            type: 'error'
          })
        }
        Message({
          message: '删除数据成功',
          type: 'success'
        })
      })
    },
    // 保存标签数据
    saveTagAction (context, step) {
      axios.put(`categories/${step.id}/attributes/${step.attr_id}`, {
        attr_name: step.attr_name,
        attr_sel: step.attr_sel,
        attr_vals: step.attr_vals
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return Message({
            message: '修改数据失败',
            type: 'error'
          })
        }
        Message({
          message: '修改数据成功',
          type: 'success'
        })
      })
    }
  },
  getters: {
    queryInfoData: state => {
      return state.queryInfo
    },
    usersListGetter: state => {
      return state.rolesDataInfo
    },
    roleListGetter: state => {
      return state.roleList
    },
    // 编辑用户
    editGoodsIdDataGetter: state => {
      return state.editGoodsIdData
    }
  }
})
