<template>
  <div class="bcw shortcuts">
    <el-row class="shortcuts-top">
      <el-col :span="12" class="split-line" style="text-align:left;">
        测试服务商店
      </el-col>
    </el-row>
    <el-row class="shortcuts-bottom">
      <div class="vcenter">
        <el-carousel trigger="click" type="card" indicator-position="none" :interval="8000" :autoplay="true">
          <el-carousel-item v-for="(item,index) in shopList" :key="index">
            <div @click="doViewProduct(item)" style="height:100%;">
              <el-col :span="24">
                <el-image style="width: 100%;height:250px;" :src="getImgTab('src',item)" fit="cover" @click="initBodyStyle"></el-image>
                <div class="shop-content">
                  <h3>{{item.name}}</h3>
                </div>
              </el-col>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { addDynamicRoute } from '@/router'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'testShop',
  data () {
    return {
      // 默认商品背景图片
      productDefaultImg: require('@/assets/img/product_default.png'),
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      shopList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    initBodyStyle () {
      document.body.style.overflow = 'auto'
    },
    getDataList () {
      let params = { page: 1, limit: 9999, productStatus: '2' }
      this.$http.get('/ctc/shop/productstore/productinfos', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let shopList = res.data.list
          this.handDealProductLogoPic(shopList)
        }
      }).catch(() => { })
    },
    handDealProductLogoPic (shopList) {
      let thisvm = this
      shopList.forEach((item, index) => {
        // 获取预览图片
        thisvm.previewUploadPic(item.productLogo, function (data) {
          item.productLogo = data || thisvm.productDefaultImg
          if ((index + 1) >= shopList.length) {
            thisvm.shopList = shopList
          }
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
    },
    getImgTab (type, item) {
      let productLogo = item.productLogo || this.productDefaultImg
      return productLogo
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
    }
  }
}
</script>
<style lang="scss">
.shortcuts {
  .el-carousel__arrow {
    background-color: rgba(31, 45, 61, 0.5);
  }
  .el-carousel__arrow:hover {
    background-color: rgba(31, 45, 61, 0.7);
  }
}
</style>
<style scoped lang="scss">
.shortcuts {
  display: flex;
  flex-flow: column;
  padding: 10px;
  .vcenter {
    display: flex;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
    height: 100%;
    width: 100%;
    .el-carousel {
      width: 100%;
    }
  }
  .shortcuts-bottom {
    flex: 1;
    .el-col {
      height: 100%;
    }
  }
  .shop-content {
    position: absolute;
    top: 0px;
    right: 10px;
    color: #fff;
  }
}
</style>
