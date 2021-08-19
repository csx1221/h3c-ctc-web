<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
          <el-form-item prop="name" label="产品名称">
            <el-input v-model="dataForm.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item prop="productType" label="产品类型">
            <ctc-select v-model="dataForm.productType" dict-type="productType" placeholder="请选择产品类型"></ctc-select>
          </el-form-item>
          <el-form-item prop="productEnv" label="产品环境">
            <ctc-select v-model="dataForm.productEnv" dict-type="productEnv" placeholder="请选择产品环境"></ctc-select>
          </el-form-item>
          <el-form-item prop="productStatus" label="产品状态">
            <ctc-select v-model="dataForm.productStatus" dict-type="productStatus" placeholder="请选择产品状态"></ctc-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
        <el-button size="small" @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        产品列表<span style="color:#4190f7;padding-left:24px;">说明：产品【创建人、联系人、ADMIN】具有修改删除权限</span>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="primary" size="small" @click="addOrUpdateProduct()">{{ $t('add') }}</el-button>
        <el-button type="primary" size="small" @click="layoutHandle()">布局</el-button>
        <el-button type="primary" size="small" @click="onHandle()">上架</el-button>
        <el-button type="primary" size="small" @click="offHandle()">下架</el-button>
        <el-button type="danger" size="small" @click="doDeleteHandle(1)">删除</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="产品名称" header-align="left" align="left" width="250"></el-table-column>
      <el-table-column prop="productDesc" label="产品描述" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="linkManName" label="联系人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="productStatus" label="产品状态" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('productStatus', scope.row.productStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subscribeNum" label="订阅数" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="doProductOrderPerson(scope.row)">{{scope.row.subscribeNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="layoutNum" label="布局序号" header-align="center" align="center" sortable="custom"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateProduct(1,scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="addOrUpdateProduct(0,scope.row)" :disabled="doValidBtnAuth(scope.row)">{{ $t('update') }}</el-button>
          <el-button type="text" size="small" @click="doDeleteHandle(2,scope.row)" :disabled="doValidBtnAuth(scope.row)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <!--引入产品布局页面-->
    <product-layout ref="productLayout" :visible.sync="productLayout" @refreshDataList="getDataList"></product-layout>
    <!--引入产品下架页面-->
    <product-sole-out ref="productSoleOut" :visible.sync="productSoleOut" @refreshDataList="getDataList"></product-sole-out>
    <ctc-data-tag :visible.sync="visibleDataTag" :tagDataMap="tagDataMap"></ctc-data-tag>
  </el-card>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import ProductLayout from './children-page/product-layout'
import ProductSoleOut from './children-page/product-sole-out'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'ProductMgr',
  components: {
    ProductLayout, ProductSoleOut
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/shop/productinfo/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/shop/productinfo/delete',
        deleteIsBatch: true,
        deleteIsBatchKey: 'productId'
      },
      dataForm: {
        name: '', // 产品名称
        productType: '', // 产品类型
        productStatus: '', // 产品状态
        productEnv: '' // 产品环境
      },
      orderField: 'layout_num',
      order: 'asc',
      productLayout: false,
      productSoleOut: false,
      visibleDataTag: false,
      tagDataMap: {}
    }
  },
  computed: {},
  mounted () { },
  methods: {
    // 产品布局调整
    layoutHandle () {
      this.$refs.productLayout.init()
    },
    doValidBtnAuth (row) {
      let authFlag = true
      let opAuth = [row.creator, row.linkMan]
      // 特殊判断,是否是超级管理员
      if (this.$store.state.user.superAdmin === 1) {
        opAuth.push(this.$store.state.user.id)
      }
      // 判断当前登录账号
      if (opAuth.includes(this.$store.state.user.id)) {
        authFlag = false
      }
      return authFlag
    },
    doProductOrderPerson (item) {
      let params = { 'productId': item.productId }
      this.$http.get('/ctc/shop/productorder/getByProductId', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let tagData = []
          res.data.forEach((item, index) => {
            tagData.push(item.orderPersonName)
          })
          this.visibleDataTag = true
          this.tagDataMap.title = '产品【' + item.name + '】订购人员详情'
          this.tagDataMap.tagData = tagData
        }
      }).catch(() => { })
    },
    // 产品上架
    onHandle () {
      let selection = this.$refs.dataList.selection
      if (selection.length > 0) {
        let productIds = []
        let productNames = []
        selection.forEach((item, index) => {
          // 只有待上架的产品，才可以进行上架操作
          let productStatus = item.productStatus
          if (productStatus === 1 || productStatus === 3) {
            productIds.push(item.productId)
          } else {
            productNames.push(item.name)
          }
        })
        if (productNames.length > 0) {
          this.$message.warning('只有【待上架、临时下架】的产品才可以上架')
        } else {
          this.$confirm('确定进行[产品上架]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.put('/ctc/shop/productinfo/onshelf', productIds).then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg)
              }
              this.$message.success('上架成功')
              this.getDataList()
            }).catch(() => { })
          }).catch(() => {
          })
        }
      } else {
        this.$message.warning('没有选中任何记录！')
      }
    },
    // 产品下架
    offHandle () {
      let selection = this.$refs.dataList.selection
      if (selection.length > 0) {
        let productIds = []
        let productNames = []
        selection.forEach((item, index) => {
          // 只有待上架的产品，才可以进行上架操作
          let productStatus = item.productStatus
          if (productStatus === 2 || productStatus === 3) {
            productIds.push(item.productId)
          } else {
            productNames.push(item.name)
          }
        })
        if (productNames.length > 0) {
          this.$message.warning('只有【已上架、临时下架】的产品，才可以进行下架操作')
        } else {
          this.$refs.productSoleOut.dataForm.offShellType = '3'
          this.$refs.productSoleOut.dataForm.productIds = productIds
          this.$refs.productSoleOut.init()
        }
      } else {
        this.$message.warning('没有选中任何记录！')
      }
    },
    doDeleteHandle (type, row) {
      this.$toggleRowSelectionTable('dataList', row)
      let selection = this.$refs.dataList.selection
      if (type === 2) {
        selection = [row]
      }
      if (selection.length > 0) {
        let productIds = []
        let productNames = []
        selection.forEach((item, index) => {
          // 只有永久删除、待上架的产品，才可以进行删除操作
          let productStatus = item.productStatus
          if (productStatus === 1 || productStatus === 4) {
            productIds.push(item.productId)
          } else {
            productNames.push(item.name)
          }
        })
        if (productNames.length > 0) {
          this.$message.warning('只有[永久下架、待上架】的产品，才可以进行删除操作')
        } else {
          this.$confirm('确定进行[产品删除]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete('/ctc/shop/productinfo', { 'data': productIds }).then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg)
              }
              this.$message.success('删除成功')
              this.getDataList()
            }).catch(() => { })
          }).catch(() => {
          })
        }
      } else {
        this.$message.warning('没有选中任何记录！')
      }
    },
    // 新增、修改产品
    addOrUpdateProduct (readOnly, row) {
      // 0:编辑模式;1:只读模式
      let productId = (row || {}).productId || ''
      let params = { 'productId': productId, 'layoutNum': this.total + 1, 'readOnly': readOnly }
      let path = 'testserviceshop/productmgr/children-page/create-product'
      let title = '新建产品'
      if (productId !== '') {
        title = (readOnly === 1) ? '查看产品' : '修改产品'
        params.layoutNum = row.layoutNum
      }
      this.customAddDynamicRoute(path, title, params)
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    },
    onReset () {
      this.$refs.dataForm.resetFields()
      this.getDataList()
    },
    onSubmit () {
    }
  }
}
</script>
<style  lang="scss" scoped>
</style>
