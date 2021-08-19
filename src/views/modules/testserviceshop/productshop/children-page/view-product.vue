<template>
  <el-card shadow="never" class="aui-card--fill view-product">
    <el-row>
      <el-col :span="24" class="submit-button-info">
        <el-button type="primary" size="small" @click="doOperate">{{getOperateBtnTxt()}}</el-button>
      </el-col>
      <el-col :span="21">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row id="target1">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">基础信息</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="产品名称：" prop="name">
                    <span>{{dataForm.name}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="productType" label="产品类型：">
                    <span>{{$getDictLabel('productType', dataForm.productType)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="productEnv" label="产品环境：">
                    <span>{{$getDictLabel('productEnv', dataForm.productEnv)}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="linkMan" label="产品联系人：">
                    <span>{{dataForm.linkManName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="audit4ASw==0">
                  <el-form-item prop="linkMan" label="联系人方式：">
                    <span>{{dataForm.contact}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="approvePerson" label="产品审核人：">
                    <span>{{dataForm.approvePersonName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="productDesc" label="产品描述：">
                    <div>{{dataForm.productDesc}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row id="target2">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品应用实例</span></el-divider>
            <el-col :span="24" style="overflow-x:hidden;">
              <el-form-item prop="applicationExample">
                <div v-html="dataForm.applicationExample"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row id="target3">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品场景描述</span></el-divider>
            <el-col :span="24" style="overflow-x:hidden;">
              <el-form-item prop="productSceneDesc">
                <div v-html="dataForm.productSceneDesc"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row id="target4">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品主图Logo</span></el-divider>
            <el-col :span="24" style="padding:15px;padding-left:120px;">
              <img v-if="dataForm.productLogo" :src="dataForm.productLogoPic" style="width:336px;height:192px;" />
            </el-col>
          </el-row>
          <el-row id="target5">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品附件信息</span></el-divider>
            <el-col :span="24" style="padding:50px;padding-top:10px;">
              <ctc-file-upload ref="ctcFileUploadProductDoc" v-model="dataForm.productDoc"></ctc-file-upload>
            </el-col>
          </el-row>
          <!--暂时进行下架处理-->
          <el-row id="target6" v-if="false">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">用户留言</span></el-divider>
            <el-col :span="24">
              <product-message-page :productId="dataForm.productId" :approvePerson="dataForm.approvePerson"></product-message-page>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-timeline :localAnchor="localAnchor" class="el-timeline-footer">
          <el-timeline-item color="#26c6da">
            <el-link @click="doAnchor(1)">基础信息</el-link>
          </el-timeline-item>
          <el-timeline-item color="#26c6da">
            <el-link @click="doAnchor(2)">产品应用实例</el-link>
          </el-timeline-item>
          <el-timeline-item color="#26c6da">
            <el-link @click="doAnchor(3)">产品场景描述</el-link>
          </el-timeline-item>
          <el-timeline-item color="#26c6da">
            <el-link @click="doAnchor(4)">产品主图Logo</el-link>
          </el-timeline-item>
          <el-timeline-item color="#26c6da">
            <el-link @click="doAnchor(5)">产品附件信息</el-link>
          </el-timeline-item>
          <el-timeline-item color="#26c6da" v-if="false">
            <el-link @click="doAnchor(6)">用户留言</el-link>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
    <!--引入产品申请页面-->
    <product-apply ref="productApply" :visible.sync="productApply" @watchChildPage="triggerParentPage"></product-apply>
  </el-card>
</template>
<script>
import Cookies from 'js-cookie'
import ProductApply from './product-apply'
import ProductMessagePage from './product-message-page'
import { removeCurrentTabsHandle, addDynamicRoute } from '@/router'
import { replaceUrlIp, polishingOssHost } from '@/utils/validate'
export default {
  name: 'ViewProduct',
  components: {
    ProductApply, ProductMessagePage
  },
  data () {
    return {
      productApply: false,
      localAnchor: true,
      dataForm: {
        productId: '',
        name: '',
        productType: '',
        linkMan: '',
        linkManName: '',
        contact: '',
        approvePerson: '',
        approvePersonName: '',
        productEnv: '',
        productDesc: '',
        applicationExample: '',
        productSceneDesc: '',
        layoutNum: '1',
        productUrl: '',
        productLogo: '',
        productLogoPic: ''
      },
      audit4ASw: Cookies.get('audit4ASw') // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
    }
  },
  computed: {
    dataRule () {
      return {
      }
    }
  },
  mounted () {
    // 判断是否是修改
    let productId = this.$route.params.productId || ''
    let billId = this.$route.params.billId || ''
    this.dataForm.productId = productId
    this.dataForm.billId = billId
    this.$nextTick(() => {
      // 初始化产品主图上传组件
      // 初始化产品文档上传组件
      this.$refs.ctcFileUploadProductDoc.customUploadParams = { 'maxCount': 100, 'checkFileType': [], isShowUpload: false, 'tableHeight': 'auto' }
      this.$refs.ctcFileUploadProductDoc.init()
      if (productId !== '') {
        this.getProductInfoById()
      }
    })
  },
  methods: {
    doAnchor (type) {
      let activeName = '#target' + type
      document.querySelector(activeName).scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    triggerParentPage () {
      this.getProductInfoById()
    },
    getProductInfoById () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { 'productId': thisvm.dataForm.productId }
      thisvm.$http.get('/ctc/shop/productstore/productinfo', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
          // 获取预览图片
          thisvm.previewUploadPic(thisvm.dataForm.productLogo, function (data) {
            thisvm.dataForm.productLogoPic = data
          })
          // 特殊处理关联平台,不需要权限申请
          if (thisvm.dataForm.applicationId) {
            thisvm.dataForm.applyStatus = 2
          }
          // 附件回显
          thisvm.$refs.ctcFileUploadProductDoc.echoInit(thisvm.dataForm.productDoc)
        }
        thisvm.$ctcLoading.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
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
    doCancel () {
      // 提交成功关闭当前tab
      removeCurrentTabsHandle(this)
    },
    getOperateBtnTxt () {
      let applyStatus = this.dataForm.applyStatus || 0
      let btnTxt = ''
      if (applyStatus === 0) {
        btnTxt = '权限申请'
      } else if (applyStatus === 1) {
        btnTxt = '申请详情(待评审)'
      } else if (applyStatus === 2) {
        btnTxt = '立即使用'
      } else if (applyStatus === 3) {
        btnTxt = '申请详情(不通过)'
      } else if (applyStatus === 4) {
        btnTxt = '申请通过(已失效)'
      }
      return btnTxt
    },
    doOperate () {
      // 根据审核状态进行判断(0:默认状态;1待审核 2审核通过 3审核不通过 4:失效)
      let applyStatus = this.dataForm.applyStatus || 0
      if (applyStatus === 0) {
        this.$refs.productApply.dataForm.productId = this.dataForm.productId
        this.$refs.productApply.dataForm.name = this.dataForm.name
        this.$refs.productApply.init()
      } else if (applyStatus === 1) {
        this.authProductDetail()
      } else if (applyStatus === 2) {
        this.execGotoUrl()
      } else if (applyStatus === 3) {
        this.authProductDetail()
      } else if (applyStatus === 4) {
        this.authProductDetail()
      }
    },
    execGotoUrl () {
      // 特殊处理关联平台跳转
      let productUrl = this.dataForm.productUrl
      if (this.dataForm.applicationId) {
        let params = { 'applicationId': this.dataForm.applicationId }
        this.$http.get('/ctc/subadmin/application/auth/auth', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            // 判断网络内网、外网标识
            let networkFlag = window.SITE_CONFIG['networkFlag'] || 'default'
            productUrl = (networkFlag === 'default') ? res.data.applicationDetail.defaultUrl : res.data.applicationDetail.outerUrl
            // productUrl = this.addParamsToUrl(productUrl, 'token', Cookies.get('token'))
            productUrl = this.addParamsToUrl(productUrl, 'applicationToken', res.data.applicationDetail.accessToken)
            // 特殊处理，生产环境需替换host信息
            if (window.SITE_CONFIG['nodeEnv'] === 'prod') {
              let host = window.location.host
              productUrl = replaceUrlIp(productUrl, host)
            }
            window.open(productUrl, '_blank')
          }
        }).catch(() => { })
      } else {
        productUrl = this.addParamsToUrl(productUrl, 'token', Cookies.get('token'))
        window.open(productUrl, '_blank')
      }
    },
    // 动态追加url参数
    addParamsToUrl (url, key, val) {
      let turl = ''
      if (!val) {
        turl = url
      }
      var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
      var separator = url.indexOf('?') !== -1 ? '&' : '?'
      if (url.match(re)) {
        turl = url.replace(re, '$1' + key + '=' + val + '$2')
      } else {
        turl = url + separator + key + '=' + val
      }
      turl = turl.replace('?&', '?')
      return turl
    },
    // 审核产品详情
    authProductDetail () {
      let params = { 'productId': this.dataForm.productId, 'billId': this.dataForm.billId }
      let path = 'testserviceshop/productshop/children-page/user-auth-product-detail'
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
.view-product {
  margin-bottom: 50px;
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }
  .el-timeline-footer {
    position: fixed;
    top: 45%;
    z-index: 2;
  }
  .submit-button-info {
  }
  .message-list {
    margin-top: 24px;
    padding: 10px;
  }
}
</style>
