<template>
  <el-card shadow="never" class="aui-card--fill  product-shop">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品类型" prop="productType">
            <ctc-select v-model="dataForm.productType" dict-type="productType" placeholder="请选择产品类型"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="product-list" :gutter="20">
      <template v-for="(item,index) in productListData">
        <el-col :span="6" :key="index">
          <div class="product-module" :title="item.productDesc" @click="doViewProduct(item)">
            <table>
              <tr>
                <td colspan="3" :style="item.style">
                  <el-image style="width: 104px;height: 72px;position: relative;top: -61px;left: 267px;" :src="getImgTab('src',item)" v-if="getImgTab('if',item)"></el-image>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="product-name">
                  <div class="show">{{item.name}}</div>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="product-desc">{{item.productDesc.length>29?item.productDesc.substring(0,29)+'...':item.productDesc}}</td>
              </tr>
              <tr>
                <td class="product-type"> {{ $getDictLabel('productType', item.productType) }}</td>
                <td class="product-num" title="产品订阅量" @click.stop="doProductOrderPerson(item)"></td>
                <td class="product-detail">查看内容</td>
              </tr>
            </table>
          </div>
        </el-col>
      </template>
    </el-row>
    <el-pagination :current-page="dataForm.page" :page-sizes="[8, 20, 50, 100]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <ctc-data-tag :visible.sync="visibleDataTag" :tagDataMap="tagDataMap"></ctc-data-tag>
  </el-card>
</template>
<script>
import { addDynamicRoute } from '@/router'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'ProductShop',
  data () {
    return {
      dataForm: {
        name: '',
        productType: '',
        productStatus: '2',
        orderField: 'layout_num',
        order: 'asc',
        page: 1,
        limit: 8
      },
      total: 0,
      // 默认商品背景图片
      productDefaultImg: require('../../../../assets/img/product_default.png'),
      // 产品审核状态
      productStatusImg1: require('../../../../assets/img/product_status_1.png'),
      productStatusImg2: require('../../../../assets/img/product_status_2.png'),
      productStatusImg4: require('../../../../assets/img/product_status_4.png'),
      productListData: [
      ],
      visibleDataTag: false,
      tagDataMap: {}
    }
  },
  computed: {},
  mounted () {
    this.getDataList()
  },
  methods: {
    getModuleStyle (type, item) {
      let style = {}
      if (type === 'tab') {
        style.background = 'url(' + this.productStatusImg + ') no-repeat top right'
      }
      return style
    },
    getImgTab (type, item) {
      if (type === 'src') {
        // 1待审核 2审核通过 3审核不通过
        if (item.applyStatus === 1) {
          return this.productStatusImg1
        } else if (item.applyStatus === 2) {
          return this.productStatusImg2
        } else if (item.applyStatus === 4) {
          return this.productStatusImg4
        }
      } else if (type === 'if') {
        return [1, 2, 4].includes(item.applyStatus)
      }
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getDataList()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getDataList()
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
    doViewProduct (item) {
      let productId = item.productId || ''
      let billId = item.billId || ''
      let params = { 'productId': productId, 'billId': billId }
      let path = 'testserviceshop/productshop/children-page/view-product'
      let title = item.name
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
    getDataList () {
      let params = this.dataForm
      this.$http.get('/ctc/shop/productstore/productinfos', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.productListData = res.data.list
          this.total = res.data.total
          this.handDealProductLogoPic()
        }
      }).catch(() => { })
    },
    handDealProductLogoPic () {
      let thisvm = this
      thisvm.productListData.forEach((item, index) => {
        // 获取预览图片
        thisvm.previewUploadPic(item.productLogo, function (data) {
          let productLogo = data || thisvm.productDefaultImg
          let style = {}
          style.height = '200px'
          style.background = 'url(' + productLogo + ') no-repeat center center'
          style.backgroundSize = '100% 100%'
          item.style = style
          thisvm.$set(thisvm.productListData, index, item)
        })
      })
    },
    previewUploadPic (attachementId, callback) {
      if (attachementId) {
        this.$http.get('/ctc/oss/file/photo/path/' + attachementId).then(({ data: res }) => {
          let picUrl = polishingOssHost(res.data)
          callback && callback(picUrl)
        }).catch((res) => { })
      } else {
        callback && callback(null)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.product-shop {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .product-list {
    padding: 24px;
    background: #f5f7fa;
    .product-module {
      height: 320px;
      margin-bottom: 20px;
      cursor: pointer;
      border: 1px solid #f5f7fa;
      table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
        .product-name {
          font-size: 18px;
          font-weight: bold;
          padding-left: 15px;
          height: 35px;
          background: #fff;
          color: #4190f7;
          .show {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .product-desc {
          word-wrap: break-word;
          padding-left: 15px;
          height: 40px;
          line-height: 18px;
          background: #fff;
          color: #999;
        }
        .product-type {
          height: 35px;
          padding-left: 15px;
          background: #fff;
          color: #999;
        }
        .product-num {
          height: 35px;
          text-align: center;
          padding-right: 15px;
          color: #26c6da;
          background: #fff;
        }
        .product-detail {
          height: 35px;
          text-align: right;
          padding-right: 15px;
          color: #4190f7;
          background: #fff;
        }
      }
    }
  }
}
</style>
