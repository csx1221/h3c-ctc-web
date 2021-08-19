<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-col :span="24">
        <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">文档版本信息</span></el-divider>
        <el-row>
          <el-col :span="24" style="padding-left:35px;padding-bottom:10px;">
            <el-radio-group v-model="chooseVersion" @change="versionChange">
              <el-radio-button :label="item" v-for="(item,index) in versionData" :key="index">V{{item}}.0</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">文档基本信息</span></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否审核：" prop="ifAuth">
              <span>{{$getDictLabel('yesOrNo', dataForm.ifAuth)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="dataForm.ifAuth==1">
            <el-form-item label="审核方式：" prop="authMode">
              <span>{{$getDictLabel('document.authMode', dataForm.authMode)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文档版本：" prop="version">
              <span>V{{dataForm.version}}.0</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文档编码：" prop="name">
              <span>{{dataForm.documentCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文档名称：" prop="name">
              <span>{{dataForm.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文档状态：" prop="documentStatus">
              <span> {{ $getDictLabel('document.documentStatus',dataForm.documentStatus) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人名：" prop="creatorName">
              <span>{{dataForm.creatorName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间：" prop="createDate">
              <span>{{dataForm.createDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="dataForm.pathName!=''">
            <el-form-item prop="pathName" label="归属路径：">
              <div v-html="dataForm.pathName"></div>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="dataForm.ifAuth==1 && dataForm.handlerName!=''">
            <el-form-item label="处理人名：" prop="handlerName">
              <span>{{ dataForm.handlerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="description" label="文档描述：">
              <div v-html="dataForm.description"></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">文档附件信息</span></el-divider>
        <el-row>
          <el-col :span="24" style="padding-left:35px;">
            <el-table :data="originalFileAttaData" stripe border max-height="400px">
              <el-table-column prop="id" label="附件编码" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fileType" label="文件类型" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="150" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button @click="handleDownClick(scope.row)" type="text" size="small">{{isImgType(scope.row.fileType)?'预览':'下载'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-divider content-position="left" v-if="(dataForm.operationList || []).length>0"><span style="color:#26c6da;font-size:15px;">文档处理</span></el-divider>
        <el-row v-if="(dataForm.operationList || []).length>0">
          <el-col :span="24" style="padding-left:35px;">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="operation" label="可选操作：">
                  <el-radio-group v-model="dataForm.operation" size="small">
                    <el-radio v-for="(item,index) in dataForm.operationList" :key="index" :label="item.operation" border @click.native="operationClick(item)">{{item.operationName}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="operationHandlerVisible">
                <el-form-item prop="operationHandler" label="审核人名：">
                  <ctc-project-document-handler v-model="dataForm.operationHandler" placeholder="请选择文档审核人" :projectId.sync="dataForm.projectId" :echoDataForm.sync="echoDataForm" @watchChildPage="triggerParentPage" style="width:100%;"></ctc-project-document-handler>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="operationDirIdVisible">
                <el-form-item prop="operationDirId" label="归属目录：">
                  <ctc-project-document-dir-tree v-model="dataForm.operationDirId" placeholder="请选择文档归属目录" :projectId.sync="dataForm.parentProjectId || dataForm.projectId" @watchChildPage="triggerParentPage"></ctc-project-document-dir-tree>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="operationDesc" label="操作意见：">
                  <el-input v-model="dataForm.operationDesc" placeholder="请输入操作意见" :rows="5" type="textarea"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="documentAttachementId" label="上传附件：">
                  <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.documentAttachementId" style="cursor:pointer;"></ctc-file-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align:center;">
                <el-button-group>
                  <el-button type="primary" plain @click="doOperationBtn(1)"><i class="el-icon-upload2"></i>提交</el-button>
                  <el-button type="primary" plain @click="doOperationBtn(2)"><i class="el-icon-refresh-right"></i>重置</el-button>
                  <el-button type="primary" plain @click="doOperationBtn(3)"><i class="el-icon-close"></i>关闭</el-button>
                </el-button-group>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">文档流转轨迹</span></el-divider>
          </el-col>
          <el-col :span="24" style="padding-left:35px;margin-bottom:54px;" v-if="(documentTrajectoryData || []).length>0">
            <el-table v-if="dataForm.authMode==1" :data="documentTrajectoryData" :expand-row-keys="expandRowKeys" :row-key="getRowKeys" @expand-change="expandChange" stripe border>
              <el-table-column type="expand" label="附 件" width="60">
                <template slot-scope="props">
                  <el-row>
                    <template v-for="(item,index) in  props.row.attachementData">
                      <el-col :span="4" :key="index" style="text-align:center;padding:5px;cursor:pointer;" @click.native="doPreviewImg(item,props.row,props.$index,index)">
                        <img :src="getImgSrc(item)" style="width: 32px; height: 32px" /><br />
                        <span class="demonstration">{{item.fileName}}</span>
                      </el-col>
                    </template>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="dealStatus" label="处理状态" header-align="center" align="center" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                  {{ $getDictLabel('document.dealStatus', scope.row.dealStatus) }}
                </template>
              </el-table-column>
              <el-table-column prop="operationName" label="操作状态" header-align="center" align="center" show-overflow-tooltip width="100"></el-table-column>
              <el-table-column prop="operationDesc" label="处理意见" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createDate" label="工单到达时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
              <el-table-column prop="dealDate" label="工单处理时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
              <el-table-column prop="creatorName" label="处理人" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
              <el-table-column prop="creatorOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
              <el-table-column prop="handlerName" label="下一步处理人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="handlerOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-table v-else :data="documentTrajectoryData" :expand-row-keys="expandRowKeys" :row-key="getRowKeys" @expand-change="expandChange" stripe border>
              <el-table-column type="expand" label="附 件" width="60">
                <template slot-scope="props">
                  <el-row>
                    <template v-for="(item,index) in  props.row.attachementData">
                      <el-col :span="4" :key="index" style="text-align:center;padding:5px;cursor:pointer;" @click.native="doPreviewImg(item,props.row,props.$index,index)">
                        <img :src="getImgSrc(item)" style="width: 32px; height: 32px" /><br />
                        <span class="demonstration">{{item.fileName}}</span>
                      </el-col>
                    </template>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="dealStatus" label="处理状态" header-align="center" align="center" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                  {{ $getDictLabel('document.dealStatus', scope.row.dealStatus) }}
                </template>
              </el-table-column>
              <el-table-column prop="operationName" label="操作状态" header-align="center" align="center" show-overflow-tooltip width="100"></el-table-column>
              <el-table-column prop="operationDesc" label="处理意见" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dealDate" label="工单到达时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
              <el-table-column prop="createDate" label="工单处理时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
              <el-table-column prop="creatorName" label="处理人" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
              <el-table-column prop="creatorOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
              <el-table-column prop="handlerName" label="下一步处理人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="handlerOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-form>
    <!--图片放大功能-->
    <ctc-big-img v-if="ctcBigImg" :ctcBigImgSrc="ctcBigImgSrc" @doCloseBigImg="doCloseBigImg"></ctc-big-img>
  </el-card>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
import { polishingOssHost } from '@/utils/validate'
import { removeCurrentTabsHandle } from '@/router'
import CtcProjectDocumentHandler from '@/components/project/ctc-project-document-handler'
import CtcProjectDocumentDirTree from '@/components/project/ctc-project-document-dir-tree'

export default {
  components: {
    CtcProjectDocumentHandler, CtcProjectDocumentDirTree
  },
  data () {
    return {
      dataForm: {
        documentId: '',
        version: '',
        documentCode: '',
        name: '',
        documentStatus: '',
        ifAuth: '',
        authMode: '',
        handlerName: '',
        creatorName: '',
        createDate: '',
        pathName: '',
        description: '',
        operationList: [],
        operation: '',
        operationDesc: '',
        operationHandler: '',
        operationHandlerName: '',
        operationDirId: '',
        documentAttachementId: ''
      },
      echoDataForm: {
        handler: '',
        handlerName: ''
      },
      chooseVersion: 0,
      versionData: [],
      operationDirData: { 'projectId': '', 'dirId': '', 'pathId': '', 'pathName': '' }, // 文档归属目录
      originalFileAttaData: [], // 文档原始附件信息
      expandRowKeys: [], // 默认展开行Id
      documentTrajectoryData: [],
      defaultFile: require('../../../../assets/img/wenjian.png'),
      defaultImg: require('../../../../assets/img/default_img.png'),
      ctcBigImg: false,
      ctcBigImgSrc: '',
      operationHandlerVisible: false,
      operationDirIdVisible: false
    }
  },
  computed: {
    dataRule () {
      return {
        operation: [
          { required: true, message: '请选择操作状态', trigger: 'blur' },
          { required: true, message: '请选择操作状态', trigger: 'change' }
        ],
        operationHandler: [
          { required: true, message: '请选择审核人', trigger: 'blur' },
          { required: true, message: '请选择审核人', trigger: 'change' }
        ],
        operationDirId: [
          { required: true, message: '请选择归属目录', trigger: 'blur' },
          { required: true, message: '请选择归属目录', trigger: 'change' }
        ],
        operationDesc: [
          { required: true, message: '请输入操作意见', trigger: 'blur' },
          { required: true, message: '请输入操作意见', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.dataForm.documentId = this.$route.params.documentId || ''
    this.chooseVersion = this.$route.params.version || ''
    let maxVersion = this.$route.params.version || ''
    for (let idx = maxVersion; idx > 0; idx--) {
      this.versionData.push(idx)
    }
    this.getDocumentInfo()
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'chooseHandler') {
        this.dataForm.operationHandlerName = message.data
      } else if (message.type === 'chooseDocumentDir') {
        this.operationDirData = message.data
      }
    },
    versionChange (index) {
      this.getDocumentInfo()
    },
    getDocumentInfo () {
      this.$ctcLoading.open()
      let params = { 'documentId': this.dataForm.documentId, 'version': this.chooseVersion }
      this.$http.get('/ctc/project/document/documentInfoById', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm = { ...this.dataForm, ...res.data }
          this.dataForm.operationList = this.dataForm.operationList || []
          // 加载文档轨迹信息
          this.loadDocumentTrajectory()
          this.getOriginalFileAttaData()
          // 默认初始化文件上传组件
          if (this.dataForm.operationList.length > 0) {
            this.$nextTick(() => {
              this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg'] }
              this.$refs.ctcFileUpload.init()
            })
          }
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    loadDocumentTrajectory () {
      let data = this.dataForm.documentDealList
      data.map((item, index) => {
        item.attachementData = []
        item.hasAttachementFlag = false
      })
      this.documentTrajectoryData = data
    },
    // 获取文档原始附件信息
    getOriginalFileAttaData () {
      let attachmentId = this.dataForm.attachementId
      if (attachmentId !== '' && attachmentId !== undefined && attachmentId !== null) {
        let params = { 'recordId': attachmentId }
        this.$http.get('/ctc/oss/mutiFile/listFiles', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.originalFileAttaData = res.data
          }
        }).catch(() => {
        })
      }
    },
    doCloseBigImg () {
      this.ctcBigImg = false
    },
    doPreviewImg (item, row, tableIndex, index) {
      let thisvm = this
      // 判断当前文件类型
      if (thisvm.isImgType(item.fileType)) {
        let hasImgSrc = row.attachementData[index].hasImgSrc || false
        if (hasImgSrc) {
          thisvm.ctcBigImg = true
          thisvm.ctcBigImgSrc = row.attachementData[index].imgSrc
        } else {
          thisvm.execImgPreview(item.id, function (data) {
            // 更新附件图片地址
            let imgSrc = data
            row.attachementData[index].imgSrc = imgSrc
            row.attachementData[index].hasImgSrc = true
            thisvm.documentTrajectoryData[tableIndex] = row
            thisvm.$set(thisvm.documentTrajectoryData, tableIndex, row)
            thisvm.expandRowKeys = [row.documentDealId]
            thisvm.ctcBigImg = true
            thisvm.ctcBigImgSrc = imgSrc
          })
        }
      } else {
        this.handleDownClick(item)
      }
    },
    execImgPreview (id, callback) {
      this.$http.get('/ctc/oss/file/photo/path/' + id).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let picUrl = polishingOssHost(res.data)
          callback && callback(picUrl)
        }
      }).catch((res) => { })
    },
    handleDownClick (item) {
      let thisvm = this
      if (thisvm.isImgType(item.fileType)) {
        thisvm.execImgPreview(item.id, function (data) {
          thisvm.ctcBigImg = true
          thisvm.ctcBigImgSrc = data
        })
      } else {
        let data = {}
        let fileName = item.fileName
        // 特殊处理用例勾选用例，只导出用户勾选用例
        let url = '/ctc/oss/file/download/' + item.id
        ctcUtils.customExportGet(url, data, fileName)
      }
    },
    getImgSrc (item) {
      let imgSrc = ''
      if (item.imgSrc) {
        imgSrc = item.imgSrc
      } else {
        if (this.isImgType(item.fileType)) {
          imgSrc = this.defaultImg
        } else {
          imgSrc = this.defaultFile
        }
      }
      return imgSrc
    },
    // 验证文件是否是图片类型
    isImgType (fileType) {
      let bool = false
      let tfileType = (fileType || '').replace('.', '')
      if (['jpeg', 'jpg', 'png', 'gif', 'bmp'].includes(tfileType.toLowerCase())) {
        bool = true
      }
      return bool
    },
    getRowKeys (row) {
      return row.documentDealId
    },
    expandChange (row, expandedRows) {
      let thisvm = this
      // 判断是否加载过
      let hasAttachementFlag = row.hasAttachementFlag
      if (!hasAttachementFlag && row.attachementId) {
        let params = { 'recordId': row.attachementId }
        this.$http.get('/ctc/oss/mutiFile/listFiles', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            row.attachementData = res.data
            row.hasAttachementFlag = true
            thisvm.documentTrajectoryData.forEach((temp, index) => {
              if (row.documentDealId === temp.documentDealId) {
                thisvm.$set(thisvm.documentTrajectoryData, index, row)
              }
            })
          }
        }).catch(() => { })
      }
    },
    operationClick (item) {
      // 继续审核操作
      this.operationHandlerVisible = (item.operation === 4)
      // 签发操作
      this.operationDirIdVisible = (item.operation === 5)
      // 特殊处理【修改】操作，需要把文档对应附件编码参递給操作附件里
      if (item.operation === 6) {
        this.$refs.ctcFileUpload.echoInit(this.dataForm.attachementId)
      }
    },
    doOperationBtn (type) {
      if (type === 1) {
        // 提交
        this.doSubmitForm()
      } else if (type === 2) {
        // 重置
        this.dataForm.operation = ''
        this.dataForm.operationDesc = ''
        this.dataForm.documentAttachementId = ''
        this.$refs.ctcFileUpload.echoInit('')
      } else if (type === 3) {
        // 关闭
        removeCurrentTabsHandle(this)
      }
    },
    doSubmitForm () {
      let thisvm = this
      // 自动触发缺陷附件上传
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 特殊处理，判断转单必须勾选抓单人员
            let params = {}
            params.documentIds = [thisvm.dataForm.documentId]
            params.operation = thisvm.dataForm.operation
            params.handler = thisvm.dataForm.operationHandler || ''
            params.handlerName = thisvm.dataForm.operationHandlerName || ''
            // 特殊处理，只要签发操作才会有归属目录
            let nodePath = thisvm.operationDirData.nodePath || {}
            let pathId = nodePath.pathId || []
            let pathName = nodePath.pathName || []
            params.projectId = thisvm.operationDirData.projectId || ''
            params.dirId = thisvm.operationDirData.dirId || 100
            params.pathId = pathId.join('/')
            params.pathName = pathName.join('/')
            params.operationDesc = thisvm.dataForm.operationDesc
            params.attachementId = thisvm.dataForm.documentAttachementId
            thisvm.$http.post('/ctc/project/document/deal', params).then(({ data: res }) => {
              if (res.code !== 0) {
                thisvm.$message.error(res.msg)
              } else {
                thisvm.$handTriggerReLoadEvent('documentReload')
                thisvm.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    removeCurrentTabsHandle(thisvm)
                  }
                })
              }
            }).catch(() => { })
          }
        })
      })
    }
  }
}
</script>
