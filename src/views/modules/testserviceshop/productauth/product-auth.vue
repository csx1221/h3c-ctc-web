<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="产品名称：" label-position="left" label-width="100px">
            <el-input v-model="dataForm.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="type" label="申请状态：" label-position="left" label-width="100px">
            <ctc-select v-model="dataForm.applyStatus" dict-type="applyStatus" placeholder="请选择申请单状态"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        申请列表
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="primary" size="small" @click="doProductApproval()">批量审批</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" row-key="id" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="billNo" label="申请单号" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applicantName" label="申请人" header-align="left" align="left"></el-table-column>
      <el-table-column prop="productName" label="产品名称" header-align="left" align="left"></el-table-column>
      <el-table-column prop="applyStatus" label="审核状态" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('applyStatus', scope.row.applyStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="applyEnv" label="申请环境" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('productEnv', scope.row.applyEnv) }}
        </template>
      </el-table-column>
      <el-table-column prop="applyDate" label="申请时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="applicantDate" label="申请起止日期" header-align="center" align="center">
        <template slot-scope="scope">
          {{scope.row.effectDate}}-{{scope.row.expireDate}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="doOnlyOneProductApproval(scope.row)">审批</el-button>
          <el-button type="text" size="small" @click="authProductDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <!--引入产品审核页面-->
    <product-approval ref="productApproval" :visible.sync="productApproval" @refreshDataList="getDataList"></product-approval>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { addDynamicRoute } from '@/router'
import ProductApproval from './children-page/product-approval'
export default {
  mixins: [mixinViewModule],
  name: 'ProductAuth',
  components: {
    ProductApproval
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/shop/productapply/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/shop',
        deleteIsBatch: true,
        deleteIsBatchKey: 'billId'
      },
      dataForm: {
        name: '', // 产品名称
        applyStatus: '' // 申请状态
      },
      productApproval: false,
      dataList: []
    }
  },
  computed: {},
  mounted () { },
  methods: {
    onReset () {
      this.dataForm.name = ''
      this.dataForm.applyStatus = ''
      this.getDataList()
    },
    doOnlyOneProductApproval (row) {
      this.$refs.productApproval.dataForm.billIds = [row.billId]
      this.$refs.productApproval.dataForm.applyData = [row]
      this.$refs.productApproval.init()
    },
    doProductApproval () {
      let selection = this.$refs.dataList.selection
      if (selection.length > 0) {
        let billIds = []
        selection.forEach((item, index) => {
          // 1待审核 2审核通过 3审核不通过
          billIds.push(item.billId)
        })
        this.$refs.productApproval.dataForm.billIds = billIds
        this.$refs.productApproval.dataForm.applyData = selection
        this.$refs.productApproval.init()
      } else {
        this.$message.warning('没有选中任何记录！')
      }
    },
    // 审核产品详情
    authProductDetail (row) {
      let params = { 'productId': row.productId, 'billId': row.billId }
      let path = 'testserviceshop/productauth/children-page/auth-product-detail'
      let title = '申请单详情'
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
    }
  }
}
</script>
<style  lang="scss" scoped>
</style>
