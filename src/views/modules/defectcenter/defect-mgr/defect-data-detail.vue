<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-col :span="24">
          <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">缺陷基本信息</span></el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="缺陷名称：" prop="name">
                <span>{{dataForm.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称：" prop="parentProjectName">
                <span>{{dataForm.parentProjectName?dataForm.parentProjectName+' / '+dataForm.projectName:dataForm.projectName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="缺陷编号：" prop="defectCode">
                <span>{{dataForm.defectCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷来源：" prop="defectSourceName">
                <span>{{dataForm.defectSourceName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷环境：" prop="defectEnv">
                <span>{{$getDictLabel('defectEnv', dataForm.defectEnv)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷类型：" prop="defectType">
                <span>{{$getDictLabel('defectType', dataForm.defectType)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="问题类型：" prop="defectQuestionType">
                <span>{{dataForm.defectQuestionTypeName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷级别：" prop="defectLevel">
                <span>{{$getDictLabel('defectLevel', dataForm.defectLevel)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷分类：" prop="defectCategory">
                <span>{{$getDictLabel('defectCategory', dataForm.defectCategory)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原因分类：" prop="questionCauseType">
                <span>{{$getDictLabel('question.causeType', dataForm.questionCauseType)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联任务：" prop="taskName">
                <span>{{dataForm.taskName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参测对象：" prop="organizeName">
                <span>{{dataForm.organizeName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试号码：" prop="testPhone">
                <span>{{dataForm.testPhone}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用例编号：" prop="caseCode">
                <span>{{dataForm.caseCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用例名称：" prop="caseName">
                <span>{{dataForm.caseName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块一名：" prop="moduleOneName">
                <span> {{dataForm.moduleOneName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块二名：" prop="moduleTwoName">
                <span> {{dataForm.moduleTwoName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块三名：" prop="moduleThreeName">
                <span> {{dataForm.moduleThreeName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提出人名：" prop="creatorName">
                <span>{{dataForm.creatorName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间：" prop="createDate">
                <span>{{dataForm.createDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="期望时间：" prop="expectRepairDate">
                <span>{{dataForm.expectRepairDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修复时间：" prop="expectRepairDate">
                <span>{{dataForm.repairDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关闭时间：" prop="expectRepairDate">
                <span>{{dataForm.closeDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="驳回次数：" prop="expectRepairDate">
                <span>{{dataForm.rejectCount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="description" label="缺陷描述：">
                <!-- 富文本编辑器, 容器 -->
                <div ref="J_quillEditor" style="height:auto;min-height:300px;"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="repairDescription" label="修复说明：">
                <div v-html="dataForm.repairDescription"></div>
              </el-form-item>
            </el-col>
          </el-row>
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
        </el-col>
        <el-col :span="24" v-if="(dataForm.operationList || []).length>0">
          <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">缺陷处理</span></el-divider>
          <el-row>
            <el-col :span="16">
              <el-form-item prop="operation" label="可选操作：">
                <el-radio-group v-model="dataForm.operation" size="small">
                  <el-radio v-for="(item,index) in dataForm.operationList" :key="index" :label="item.operation" border @click.native="operationClick(item)">{{item.operationName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="dealUserName" label="下一步处理人：">
                <el-input v-model="dataForm.dealUserName" clearable placeholder="请选择下一步处理人" :disabled="dataForm.operation!=9">
                  <template slot="append"><span style="cursor:pointer;" @click="doChooseTransferUser()">选择</span></template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="testPhoneData.length>0 && $store.state.user.id===dataForm.creator">
              <el-form-item prop="operationTestPhone" label="测试号码：">
                <el-select v-model="dataForm.operationTestPhone" placeholder="请选择测试号码" filterable clearable style="width:100%;">
                  <el-option v-for="(item,index) in testPhoneData" :key="index" :label="item.testPhone+'('+item.organizeName+')'" :value="item.testPhone">
                    <span style="float: left">{{ item.testPhone }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{item.organizeName}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="defectCategory" label="缺陷原因分类：" v-if="$store.state.user.id===dataForm.creator">
                <ctc-select v-model="dataForm.defectCategory" dict-type="defectCategory" placeholder="请选择缺陷原因分类"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="operationDesc" label="处理意见：">
                <el-input v-model="dataForm.operationDesc" placeholder="请输入处理意见" :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="defectAttachementId" label="上传附件：">
                <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.defectAttachementId" style="cursor:pointer;"></ctc-file-upload>
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
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">缺陷流转轨迹</span></el-divider>
      </el-col>
      <el-col :span="24" style="padding-left:35px;">
        <el-table :data="defectTrajectoryData" :expand-row-keys="expandRowKeys" :row-key="getRowKeys" @expand-change="expandChange" stripe border>
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
          <el-table-column prop="dealStatus" label="处理状态" header-align="center" align="center" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              {{ $getDictLabel('defectDealStatus', scope.row.dealStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="operationName" label="操作状态" header-align="center" align="center" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column prop="operationDesc" label="处理意见" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-html="scope.row.operationDesc"></div>
            </template>
          </el-table-column>
          <el-table-column prop="arriveDate" label="工单到达时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column prop="createDate" label="工单处理时间" header-align="center" align="center" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column prop="creatorName" label="处理人" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column prop="creatorOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column prop="nextHandlerName" label="下一步处理人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="nextHandlerOrganizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--缺陷工单转单-->
    <defect-transfer-order :visible.sync="defectTransferOrder" ref="defectTransferOrder" @watchChildPage="triggerParentPage"></defect-transfer-order>
    <!--图片放大功能-->
    <ctc-big-img v-if="ctcBigImg" :ctcBigImgSrc="ctcBigImgSrc" @doCloseBigImg="doCloseBigImg"></ctc-big-img>
  </el-card>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
import ctcUtils from '@/utils/ctc-utils.js'
import { polishingOssHost } from '@/utils/validate'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import DefectTransferOrder from './children-page/defect-transfer-order'
export default {
  name: 'DefectDataDetail',
  components: {
    DefectTransferOrder
  },
  data () {
    return {
      J_quillEditor: null,
      quillEditorToolbarOptions: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题字体
        [{ 'font': [] }], // 字体
        ['bold', 'italic', 'underline', 'strike'], // 切换按钮
        [{ 'align': [] }], // 对齐方式
        ['blockquote', 'code-block'], // 文本块/代码块
        [{ 'header': 1 }, { 'header': 2 }], // 用户自定义按钮值
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序/无序列表
        [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
        [{ 'color': [] }, { 'background': [] }], // 主题默认下拉，使用主题提供的值
        ['clean'] // 清除格式
        // ['image'] // 图片 / 链接 / 视频
      ],
      dataForm: {
        defectId: '',
        defectCategory: '',
        operation: '',
        operationDesc: '',
        defectAttachementId: '',
        dealUserId: '',
        defectSourceName: '',
        repairDate: '',
        closeDate: '',
        rejectCount: 0,
        testPhone: '',
        creator: '',
        organizeName: '',
        defectQuestionTypeName: '',
        operationTestPhone: '',
        questionCauseType: '',
        repairDescription: '',
        hasChildProject: true
      },
      // 父页面传递过来缺陷信息
      defectInfo: {
      },
      defectTransferOrder: false,
      originalFileAttaData: [], // 原始附件信息
      expandRowKeys: [], // 默认展开行Id
      defectTrajectoryData: [],
      testPhoneData: [],
      defaultFile: require('../../../../assets/img/wenjian.png'),
      defaultImg: require('../../../../assets/img/default_img.png'),
      ctcBigImg: false,
      ctcBigImgSrc: ''
    }
  },
  computed: {
    dataRule () {
      return {
        operation: [
          { required: true, message: '请选择操作状态', trigger: 'blur' },
          { required: true, message: '请选择操作状态', trigger: 'change' }
        ],
        operationDesc: [
          { required: true, message: '请输入处理意见', trigger: 'blur' },
          { required: true, message: '请输入处理意见', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    let defectId = this.$route.params.defectId || ''
    let defectInfo = this.$route.params.defectInfo || {}
    this.dataForm.defectId = defectId
    this.defectInfo = defectInfo
    if (this.J_quillEditor) {
      this.J_quillEditor.deleteText(0, this.J_quillEditor.getLength())
    } else {
      this.quillEditorHandle()
    }
    this.getDefectInfoById()
    this.loadDefectTrajectory()
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'chooseTransfer') {
        this.dataForm.dealUserId = message.data.id || ''
        this.dataForm.dealUserName = message.data.name || ''
      }
    },
    // 富文本编辑器
    quillEditorHandle () {
      let thisvm = this
      thisvm.J_quillEditor = new Quill(thisvm.$refs.J_quillEditor, {
        modules: {
          toolbar: thisvm.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 设置禁止编辑
      thisvm.J_quillEditor.enable(false)
    },
    getDefectInfoById () {
      let thisvm = this
      thisvm.$http.get('ctc/defect/base/' + thisvm.dataForm.defectId).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
          let descriptionHtml = thisvm.dataForm.descriptionHtml || thisvm.dataForm.description || ''
          descriptionHtml = descriptionHtml.replace(/\n/g, '')
          thisvm.J_quillEditor.root.innerHTML = descriptionHtml
          thisvm.dataForm.defectCategory = thisvm.dataForm.defectCategory || ''
          thisvm.dataForm.caseCode = thisvm.defectInfo.caseCode || ''
          thisvm.dataForm.caseName = thisvm.defectInfo.caseName || ''
          thisvm.dataForm.moduleOneName = thisvm.defectInfo.moduleOneName || ''
          thisvm.dataForm.moduleTwoName = thisvm.defectInfo.moduleTwoName || ''
          thisvm.dataForm.moduleThreeName = thisvm.defectInfo.moduleThreeName || ''
          let imgData = thisvm.J_quillEditor.root.getElementsByTagName('img')
          for (let idx = 0; idx < imgData.length; idx++) {
            let id = imgData[idx].getAttribute('alt')
            if (id) {
              thisvm.execImgPreview(id, function (picUrl) {
                imgData[idx].setAttribute('src', picUrl)
              })
            }
          }
          // 回显缺陷问题类型
          thisvm.getDefectQuestionTypeData()
          // 回显缺陷原始附件信息
          thisvm.getOriginalFileAttaData()
          // 回显缺陷来源
          thisvm.getRelevanceData()
          // 获取测试号码
          thisvm.getTestPhoneData()
          // 默认初始化文件上传组件
          if (thisvm.dataForm.operationList.length > 0) {
            thisvm.$nextTick(() => {
              thisvm.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar', '.mp4'] }
              thisvm.$refs.ctcFileUpload.init()
            })
          }
          // 判断是否有子项目
          if (thisvm.dataForm.parentProjectId) {
            thisvm.dataForm.hasChildProject = true
          } else {
            thisvm.dataForm.hasChildProject = false
          }
        }
      }).catch(() => { })
    },
    getDefectQuestionTypeData () {
      let thisvm = this
      if (thisvm.dataForm.defectQuestionType !== '') {
        let params = {}
        params.projectId = thisvm.dataForm.parentProjectId || thisvm.dataForm.projectId || ''
        params.dictType = 'questionType' + thisvm.dataForm.defectType
        params.isAutoFill = false
        thisvm.$http.get('/ctc/defect/defectConfInfo/getDefectConfInfo', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          } else {
            res.data.forEach((item, index) => {
              if (item.dictValue === thisvm.dataForm.defectQuestionType + '') {
                thisvm.dataForm.defectQuestionTypeName = item.dictLabel
              }
            })
          }
        }).catch(() => { })
      }
    },
    // 获取缺陷原始附件信息
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
    getRelevanceData () {
      this.$http.get('/ctc/project/relaPlatform/list', { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
          let relaPlatformData = defaultData.concat(res.data)
          // 默认缺陷来源是执行中心
          let defectSourceName = '执行中心'
          relaPlatformData.forEach((item, index) => {
            if (item.applicationId === this.dataForm.defectSource) {
              defectSourceName = item.name
            }
          })
          this.dataForm.defectSourceName = defectSourceName
        }
      }).catch(() => { })
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
            thisvm.defectTrajectoryData[tableIndex] = row
            thisvm.$set(thisvm.defectTrajectoryData, tableIndex, row)
            thisvm.expandRowKeys = [row.defectDealId]
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
      return row.defectDealId
    },
    expandChange (row, expandedRows) {
      let thisvm = this
      // 判断是否加载过
      let hasAttachementFlag = row.hasAttachementFlag
      if (!hasAttachementFlag && row.attachementId) {
        let params = { 'recordId': row.attachementId }
        thisvm.$http.get('/ctc/oss/mutiFile/listFiles', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            row.attachementData = res.data
            row.hasAttachementFlag = true
            thisvm.defectTrajectoryData.forEach((temp, index) => {
              if (row.defectDealId === temp.defectDealId) {
                thisvm.$set(thisvm.defectTrajectoryData, index, row)
              }
            })
          }
        }).catch(() => { })
      }
    },
    loadDefectTrajectory () {
      this.$http.get('ctc/defect/base/dealInfo/' + this.dataForm.defectId).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let data = res.data
          data.map((item, index) => {
            item.attachementData = []
            item.hasAttachementFlag = false
          })
          this.defectTrajectoryData = data
        }
      }).catch(() => {
      })
    },
    // 获取测试号码数据
    getTestPhoneData () {
      let thisvm = this
      // 判断当前人是创建人，显示测试号码
      if (thisvm.dataForm.creator === thisvm.$store.state.user.id) {
        let projectId = thisvm.dataForm.projectId
        thisvm.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('获取项目基本信息失败')
          } else {
            let data = res.data
            let testPhoneCode = data.testPhoneCode || ''
            if (testPhoneCode) {
              let organizeId = thisvm.dataForm.organizeId
              let params = { 'testPhoneCode': testPhoneCode, 'organizeId': organizeId, 'page': 1, 'limit': 999999999999 }
              this.$http.get('ctc/project/projectTestPhone/page', { params: params }).then(({ data: res }) => {
                if (res.code !== 0) {
                  return this.$message.error(res.msg)
                } else {
                  this.testPhoneData = res.data.list
                }
              }).catch(() => { })
            }
          }
        }).catch(() => { })
      }
    },
    doChooseTransferUser () {
      if (this.dataForm.operation === 9) {
        this.$refs.defectTransferOrder.defectId = this.dataForm.defectId
        this.$refs.defectTransferOrder.projectId = this.dataForm.projectId
        this.$refs.defectTransferOrder.init()
      }
    },
    operationClick (item) {
      this.dataForm.dealUserId = item.dealUserId
      this.dataForm.dealUserName = item.dealUserName
    },
    doOperationBtn (type) {
      if (type === 1) {
        // 提交
        this.doSubmitForm()
      } else if (type === 2) {
        // 重置
        this.dataForm.operation = ''
        this.dataForm.operationDesc = ''
        this.dataForm.defectAttachementId = ''
        this.dataForm.dealUserId = ''
        this.dataForm.dealUserName = ''
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
            if (thisvm.dataForm.operation === 9 && !thisvm.dataForm.dealUserId) {
              thisvm.$message.warning('转单操作，必须勾选转单人员！')
            } else {
              let params = {}
              params.defectId = [thisvm.dataForm.defectId]
              params.defectCategory = thisvm.dataForm.defectCategory
              params.operation = thisvm.dataForm.operation
              params.attachementId = thisvm.dataForm.defectAttachementId
              params.nowHandler = thisvm.dataForm.dealUserId
              params.handlerName = thisvm.dataForm.dealUserName
              // 测试号码不为空，默认追加到描述里面
              if (thisvm.dataForm.operationTestPhone) {
                params.operationDesc = '测试号码[' + thisvm.dataForm.operationTestPhone + ']<br />' + thisvm.dataForm.operationDesc
                params.testPhone = thisvm.dataForm.operationTestPhone
              } else {
                params.operationDesc = thisvm.dataForm.operationDesc
              }
              // 特殊处理处理意见换行符
              params.operationDesc = params.operationDesc.replace(/\n/g, '<br />')
              thisvm.$http.post('/ctc/defect/base/deal', params).then(({ data: res }) => {
                if (res.code !== 0) {
                  thisvm.$message.error(res.msg)
                } else {
                  thisvm.$handTriggerReLoadEvent('defectReload')
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
          }
        })
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
.defect-data-detail {
  .demonstration {
    white-space: nowrap;
    overflow: hidden;
    max-width: 250px;
    display: block;
  }
}
</style>
