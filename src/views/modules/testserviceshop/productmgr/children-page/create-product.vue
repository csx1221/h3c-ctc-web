<template>
  <el-card shadow="never" class="aui-card--fill create-product">
    <el-row>
      <el-col :span="24" class="submit-button-info" v-if="dataForm.readOnly==0">
        <el-button size="small" @click="doCancel">取消</el-button>
        <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
      </el-col>
      <el-col :span="21">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" :disabled="dataForm.readOnly==1">
          <el-row id="target1">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">基础信息</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="productType" label="产品类型：">
                    <ctc-select v-model="dataForm.productType" dict-type="productType" placeholder="请选择产品类型" @change="productTypeChange"></ctc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dataForm.productType=='2'">
                  <el-form-item prop="relaPlatformIds" label="关联平台：">
                    <el-select v-model="dataForm.relaPlatformIds" placeholder="请选择关联平台" value-key="applicationId" @change="relaPlatformChange">
                      <el-option v-for="item in relaPlatformData" :key="item.applicationId" :label="item.name" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产品名称：" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入产品名称"></el-input>
                    <el-input v-model="dataForm.applicationId" placeholder="请输入关联平台Id" v-show="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="productEnv" label="产品环境：">
                    <ctc-select v-model="dataForm.productEnv" dict-type="productEnv" placeholder="请选择产品环境"></ctc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="linkMan" label="产品联系人：">
                    <ctc-user-table v-model="dataForm.linkMan" placeholder="请选择产品联系人" :userId.sync="echoDataForm.linkMan" :type="1" @watchChildPage="triggerParentPage"></ctc-user-table>
                    <el-input v-model="dataForm.linkManName" v-show="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="contact" label="联系方式：">
                    <el-input v-model="dataForm.contact" placeholder="请输入联系方式"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="approvePerson" label="产品审核人：">
                    <ctc-user-table v-model="dataForm.approvePerson" placeholder="请选择产品审核人" :userId.sync="echoDataForm.approvePerson" :type="2" @watchChildPage="triggerParentPage"></ctc-user-table>
                    <el-input v-model="dataForm.approvePersonName" v-show="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="layoutNum" label="布局序号：">
                    <el-input-number v-model="dataForm.layoutNum" :min="1" label="描述文字"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="dataForm.productType=='1'">
                  <el-form-item prop="productUrl" label="产品URL：">
                    <el-input v-model="dataForm.productUrl" placeholder="请输入产品URL访问地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="productDesc" label="产品描述：">
                    <el-input v-model="dataForm.productDesc" placeholder="请输入产品描述" :rows="4" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row id="target2">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品应用实例</span></el-divider>
            <el-col :span="24">
              <el-form-item prop="applicationExample">
                <!-- 富文本编辑器, 容器 -->
                <div id="j_applicationExample" style="height:600px;"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row id="target3">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品场景描述</span></el-divider>
            <el-col :span="24">
              <el-form-item prop="productSceneDesc">
                <!-- 富文本编辑器, 容器 -->
                <div id="j_productSceneDesc" style="height:600px;"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row id="target4">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品主图Logo</span></el-divider>
            <el-col :span="8" style="padding:15px;padding-left:120px;">
              <img v-if="dataForm.productLogo" :src="dataForm.productLogoPic" style="width:336px;height:192px;" />
              <div v-else style="border:1px solid #ccc;width:336px;height:192px;"></div>
            </el-col>
            <el-col :span="4" style="padding-top:175px;text-align:center;height:227px;">
              <el-button size="small" type="primary" @click="productLogoUpload">更换产品主图</el-button>
            </el-col>
          </el-row>
          <el-row id="target5">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">产品附件信息</span></el-divider>
            <el-col :span="24" style="padding:50px;padding-left:120px;">
              <ctc-file-upload ref="ctcFileUploadProductDoc" v-model="dataForm.productDoc"></ctc-file-upload>
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
        </el-timeline>
      </el-col>
    </el-row>
    <!--引入产品主图logo-->
    <product-picture-upload ref="productPictureUpload" :visible.sync="productPictureUpload" @watchChildPage="triggerParentPage"></product-picture-upload>
  </el-card>
</template>
<script>
import CtcProjectUserTable from '@/components/project/ctc-project-user-table'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { removeCurrentTabsHandle } from '@/router'
import ProductPictureUpload from './product-picture-upload'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'CreateProduct',
  components: {
    CtcProjectUserTable, ProductPictureUpload
  },
  data () {
    return {
      // 产品应用实例
      j_applicationExample: null,
      // 产品场景描述
      j_productSceneDesc: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        ['image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      dataForm: {
        relaPlatformIds: '',
        productId: '',
        name: '',
        productType: '2',
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
        productLogoPic: '',
        productDoc: '',
        applicationId: '',
        readOnly: ''
      },
      echoDataForm: {
        linkMan: '',
        approvePerson: ''
      },
      localAnchor: true,
      relaPlatformData: [],
      productPictureUpload: false,
      defaultProductUrl: require('../../../../../assets/img/product_default.png')
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '产品名称不允许为空', trigger: 'blur' },
          { required: true, message: '产品名称不允许为空', trigger: 'change' }
        ],
        productType: [
          { required: true, message: '产品类型不允许为空', trigger: 'blur' },
          { required: true, message: '产品类型不允许为空', trigger: 'change' }
        ],
        linkMan: [
          { required: true, message: '产品联系人不允许为空', trigger: 'blur' },
          { required: true, message: '产品联系人不允许为空', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '联系方式不允许为空', trigger: 'blur' },
          { required: true, message: '联系方式不允许为空', trigger: 'change' }
        ],
        approvePerson: [
          { required: true, message: '产品审核人不允许为空', trigger: 'blur' },
          { required: true, message: '产品审核人不允许为空', trigger: 'change' }
        ],
        productEnv: [
          { required: true, message: '产品环境不允许为空', trigger: 'blur' },
          { required: true, message: '产品环境不允许为空', trigger: 'change' }
        ],
        layoutNum: [
          { required: true, message: '产品布局序号不允许为空', trigger: 'blur' },
          { required: true, message: '产品布局序号不允许为空', trigger: 'change' }
        ],
        productDesc: [
          { required: true, message: '产品描述不允许为空', trigger: 'blur' },
          { required: true, message: '产品描述不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // 产品应用实例
    if (this.j_applicationExample) {
      this.j_applicationExample.deleteText(0, this.j_applicationExample.getLength())
    } else {
      this.quillApplicationExampleEditorHandle()
    }
    // 产品场景描述
    if (this.j_productSceneDesc) {
      this.j_productSceneDesc.deleteText(0, this.j_productSceneDesc.getLength())
    } else {
      this.quillProductSceneDescEditorHandle()
    }
    // 判断是否是修改
    let productId = this.$route.params.productId || ''
    let layoutNum = this.$route.params.layoutNum || ''
    // 0:编辑模式;1:只读模式
    let readOnly = this.$route.params.readOnly || 0
    this.dataForm.productId = productId
    this.dataForm.layoutNum = layoutNum
    this.dataForm.readOnly = readOnly
    this.$nextTick(() => {
      // 加载关联平台数据
      this.getRelevanceData()
      // 初始化产品主图上传组件
      // 初始化产品文档上传组件
      this.$refs.ctcFileUploadProductDoc.customUploadParams = { 'maxCount': 100, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUploadProductDoc.init()
    })
  },
  methods: {
    triggerParentPage (message) {
      let thisvm = this
      let type = message.type
      let data = message.data
      if (type === 1) {
        thisvm.dataForm.linkManName = data.realName
        thisvm.dataForm.contact = data.mobile
      } else if (type === 'productLogo') {
        thisvm.dataForm.productLogo = message.data
        // 获取预览图片
        thisvm.previewUploadPic(thisvm.dataForm.productLogo, function (data) {
          thisvm.dataForm.productLogoPic = data
        })
      } else {
        thisvm.dataForm.approvePersonName = data.realName
      }
    },
    productTypeChange (type) {
      this.dataForm.name = ''
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
    getRelevanceData () {
      this.$http.get('/ctc/project/relaPlatform/list', {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.relaPlatformData = res.data
          if (this.dataForm.productId !== '') {
            this.getProductInfoById()
          }
        }
      }).catch(() => { })
    },
    relaPlatformChange (item) {
      this.dataForm.name = item.name
      this.dataForm.productUrl = item.defaultUrl
      this.dataForm.productDesc = item.comments
      this.dataForm.applicationId = item.applicationId
    },
    productLogoUpload () {
      this.$refs.productPictureUpload.init()
    },
    doAnchor (type) {
      let activeName = '#target' + type
      document.querySelector(activeName).scrollIntoView({ behavior: 'smooth', block: 'end' })
    },
    // 产品应用实例富文本编辑器
    quillApplicationExampleEditorHandle () {
      this.j_applicationExample = new Quill('#j_applicationExample', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 监听内容变化，动态赋值
      this.j_applicationExample.on('text-change', () => {
        this.dataForm.applicationExample = this.j_applicationExample.root.innerHTML
      })
    },
    // 产品应用场景描述富文本编辑器
    quillProductSceneDescEditorHandle () {
      this.j_productSceneDesc = new Quill('#j_productSceneDesc', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 监听内容变化，动态赋值
      this.j_productSceneDesc.on('text-change', () => {
        this.dataForm.productSceneDesc = this.j_productSceneDesc.root.innerHTML
      })
    },
    getProductInfoById () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { 'productId': thisvm.dataForm.productId }
      thisvm.$http.get('/ctc/shop/productinfo/info', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
          // 获取预览图片
          thisvm.previewUploadPic(thisvm.dataForm.productLogo, function (data) {
            thisvm.dataForm.productLogoPic = data
          })
          thisvm.echoDataForm.linkMan = thisvm.dataForm.linkMan
          thisvm.echoDataForm.approvePerson = thisvm.dataForm.approvePerson
          // 产品应用实例
          thisvm.j_applicationExample.root.innerHTML = thisvm.dataForm.applicationExample
          // 产品场景描述
          thisvm.j_productSceneDesc.root.innerHTML = thisvm.dataForm.productSceneDesc
          // 附件回显
          thisvm.$refs.ctcFileUploadProductDoc.echoInit(thisvm.dataForm.productDoc)
          // 回显关联平台
          thisvm.relaPlatformData.forEach((item, index) => {
            if (thisvm.dataForm.applicationId === item.applicationId) {
              this.dataForm.relaPlatformIds = item
            }
          })
        }
        thisvm.$ctcLoading.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    doCancel () {
      // 提交成功关闭当前tab
      removeCurrentTabsHandle(this)
    },
    doSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = this.dataForm
          // 新增：post;修改：put
          this.$http[!this.dataForm.productId ? 'post' : 'put']('/ctc/shop/productinfo', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
            this.doCancel()
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style  lang="scss" scoped>
.create-product {
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
    position: fixed;
    right: 15px;
    bottom: 0;
    left: 245px;
    z-index: 2;
    padding-top: 0;
    padding-right: 48px;
    padding-bottom: 0;
    width: auto;
    height: 60px;
    line-height: 60px;
    text-align: right;
    background: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }
}
</style>
