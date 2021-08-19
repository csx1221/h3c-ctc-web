<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <el-col :span="24" style="padding-right:15px;">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入缺陷名称" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="parentProjectId" label="所属项目：">
                <el-select v-model="dataForm.parentProjectId" filterable placeholder="请选择项目" @change="chooseParentProject" style="width:100%;" :disabled="dataForm.defectId!=''">
                  <el-option v-for="data in dataParentProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="projectId" label="子项目：" :disabled="validTagMap.hasChildProject">
                <el-select v-model="dataForm.projectId" filterable placeholder="请选择子项目" @change="chooseProject" style="width:100%;" :disabled="validTagMap.hasChildProject || dataForm.defectId!=''">
                  <el-option v-for="data in dataProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="taskId" label="关联任务：">
                <el-select v-model="dataForm.taskId" filterable placeholder="请选择任务" @change="chooseTask" style="width:100%;" :disabled="validTagMap.project">
                  <el-option v-for="data in dataTaskData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关联用例：" prop="caseId">
                <ctc-project-case-table v-model="dataForm.caseId" placeholder="请选择关联用例" :taskId.sync="dataForm.taskId" :parentName.sync="dataForm.projectCaseName" :caseId.sync="echoDataForm.caseId" style="width:100%;" @watchChildPage="triggerParentPage" :disabled="validTagMap.case"></ctc-project-case-table>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="questionCauseType" label="原因分类：">
                <ctc-select v-model="dataForm.questionCauseType" dict-type="question.causeType" placeholder="请选择问题原因分类" style="width:100%;" :disabled="validTagMap.project"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectLevel" label="缺陷级别：">
                <ctc-select v-model="dataForm.defectLevel" dict-type="defectLevel" placeholder="请选择缺陷级别" style="width:100%;" :disabled="validTagMap.project"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectSource" label="缺陷来源：">
                <el-select v-model="dataForm.defectSource" placeholder="请选择缺陷来源" style="width:100%;" :disabled="validTagMap.project">
                  <el-option v-for="(item,index) in defectSourceData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectEnv" label="缺陷环境：">
                <el-select v-model="dataForm.defectEnv" placeholder="请选择缺陷环境" style="width:100%;" :disabled="validTagMap.project">
                  <el-option v-for="(item,index) in defectEnvData" :key="index" :label="item.dictLabel" :value="Number(item.dictValue)">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectType" label="缺陷类型：">
                <el-select v-model="dataForm.defectType" placeholder="请选择缺陷类型" style="width:100%;" @change="defectTypeChange" :disabled="validTagMap.project">
                  <el-option v-for="(item,index) in defectTypeData" :key="index" :label="item.dictLabel" :value="Number(item.dictValue)">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectQuestionType" label="问题类型：">
                <el-select v-model="dataForm.defectQuestionType" placeholder="请选择问题类型" filterable style="width:100%;" :disabled="validTagMap.project">
                  <el-option v-for="(item,index) in defectQuestionTypeData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="expectRepairDate" label="修复时间：">
                <el-date-picker v-model="dataForm.expectRepairDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择修复时间" :picker-options="expectRepairDateOptions" style="width:100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="nowHandler" label="处理人：">
                <ctc-project-case-handler v-model="dataForm.nowHandler" placeholder="请选择处理人" :parentProjectId.sync="dataForm.parentProjectId" :projectId.sync="dataForm.projectId" :caseId.sync="dataForm.caseId" :echoDataForm.sync="echoDataForm" @watchChildPage="triggerParentPage" style="width:100%;" :disabled="validTagMap.project"></ctc-project-case-handler>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="descriptionHtml" label="缺陷描述：">
                <!-- 富文本编辑器, 容器 -->
                <div ref="J_quillEditor" style="height:auto;min-height:300px;"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="repairDescription" label="修复说明：">
                <el-input v-model="dataForm.repairDescription" placeholder="请输入修复情况说明" :autosize="{ minRows:3}" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="attachementId" label="附件：">
                <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId"></ctc-file-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align:right;">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" :disabled="confirmBtn" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import debounce from 'lodash/debounce'
import CtcProjectCaseTable from '@/components/project/ctc-project-case-table'
import CtcProjectCaseHandler from '@/components/project/ctc-project-case-handler'
import ctcUtils from '@/utils/ctc-utils.js'
import { polishingOssHost } from '@/utils/validate'
import { removeCurrentTabsHandle } from '@/router'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import Cookies from 'js-cookie'
import md5 from 'js-md5'
export default {
  name: 'DefectAddOrUpdate',
  components: {
    CtcProjectCaseTable, CtcProjectCaseHandler
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
      uploadUrl: '/ctc/oss/file/upload',
      dataForm: {
        defectid: '',
        hasChildProject: false, // 判断有无子项目
        parentProjectId: '',
        projectId: '',
        taskId: '',
        caseId: '',
        name: '',
        defectLevel: '',
        defectType: '',
        defectQuestionType: '',
        defectEnv: '',
        defectSource: '',
        nowHandler: '',
        handlerName: '',
        expectRepairDate: '',
        description: '', // 无html代码描述
        descriptionHtml: '', // 有html代码描述
        descriptionHtmlIds: '',
        attachementId: '',
        questionCauseType: '',
        repairDescription: ''
      },
      echoDataForm: {
        caseId: '',
        nowHandlerIds: '',
        handlerNames: ''
      },
      validTagMap: { 'hasChildProject': true, 'case': true, 'project': true },
      dataParentProjectData: [],
      dataProjectData: [],
      dataTaskData: [],
      defectQuestionTypeData: [],
      defectEnvData: [],
      defectSourceData: [],
      defectTypeData: [],
      expectRepairDateOptions: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            return time.getTime() < dateVal - 86400000
          }
        }
      },
      confirmBtn: false
    }
  },
  watch: {
    'dataForm.defectType' (newVal, oldVal) {
      this.validTagShow()
    }
  },
  computed: {
    dataRule () {
      var validateDescription = (rule, value, callback) => {
        if (this.J_quillEditor.getLength() <= 1) {
          return callback(new Error('缺陷描述不允许为空'))
        }
        callback()
      }
      return {
        name: [
          { required: true, message: '缺陷名称不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷名称不允许为空', trigger: 'change' }
        ],
        parentProjectId: [
          { required: true, message: '所属项目不允许为空', trigger: 'blur' },
          { required: true, message: '所属项目不允许为空', trigger: 'change' }
        ],
        projectId: [
          { required: true, validator: this.validatorOperateLog, message: '子项目不允许为空', trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, message: '子项目不允许为空', trigger: 'change' }
        ],
        defectLevel: [
          { required: true, message: '缺陷级别不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷级别不允许为空', trigger: 'change' }
        ],
        defectType: [
          { required: true, message: '缺陷类型不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷类型不允许为空', trigger: 'change' }
        ],
        nowHandler: [
          { required: true, validator: this.validatorOperateLog, message: '处理人不允许为空', trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, message: '处理人不允许为空', trigger: 'change' }
        ],
        descriptionHtml: [
          { required: true, validator: validateDescription, trigger: 'blur' },
          { required: true, validator: validateDescription, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.dataForm.defectId = this.$route.params.defectId || ''
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.confirmBtn = false
        if (this.J_quillEditor) {
          this.J_quillEditor.deleteText(0, this.J_quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }
        // 默认清空数据
        this.dataForm.parentProjectId = ''
        this.dataForm.projectId = ''
        this.dataForm.taskId = ''
        this.dataForm.attachementId = ''
        this.dataForm.defectEnv = ''
        this.dataForm.defectType = ''
        this.dataForm.defectSource = ''
        // 默认初始化文件上传组件
        this.$refs.ctcFileUpload.echoInit('')
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar', '.mp4'] }
        this.$refs.ctcFileUpload.init()
        this.initDefectPageData()
      })
    },
    triggerParentPage (message) {
      if (message.type === 'chooseHandler') {
        this.dataForm.handlerName = message.data
      } else if (message.type === 'chooseCase') {
        if (message.data.autoPlatformId) {
          this.dataForm.defectSource = message.data.autoPlatformId
        }
        // 获取下一步处理人
        this.getDefectdefaultHandler()
      }
    },
    validatorOperateLog (rule, value, callback) {
      if (value) {
        callback()
      } else {
        if (rule.field === 'projectId') {
          // true:表示禁用
          if (this.validTagMap.hasChildProject) {
            callback()
          } else {
            return callback(new Error(rule.message))
          }
        } else if (rule.field === 'nowHandler') {
          // true:表示禁用
          if (this.validTagMap.project) {
            callback()
          } else {
            return callback(new Error(rule.message))
          }
        }
      }
    },
    // 富文本编辑器
    quillEditorHandle () {
      let thisvm = this
      thisvm.J_quillEditor = new Quill(thisvm.$refs.J_quillEditor, {
        modules: {
          toolbar: thisvm.quillEditorToolbarOptions
        },
        theme: 'snow',
        placeholder: '支持Ctrl+v粘贴图片'
      })
      // 监听描述变化，动态赋值
      thisvm.J_quillEditor.on('text-change', () => {
        thisvm.dataForm.descriptionHtml = thisvm.J_quillEditor.root.innerHTML
        thisvm.dataForm.description = thisvm.J_quillEditor.getText()
      })
      //  自定义粘贴图片功能
      thisvm.J_quillEditor.root.addEventListener('paste', evt => {
        if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
          evt.preventDefault();
          [].forEach.call(evt.clipboardData.files, file => {
            if (file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
              thisvm.doFileUploadService(file, function (resData) {
                var range = thisvm.J_quillEditor.getSelection()
                if (range && resData) {
                  //  在当前光标位置插入图片
                  thisvm.J_quillEditor.insertEmbed(range.index, 'image', resData.picUrl)
                  thisvm.J_quillEditor.formatText(range.index, 1, { 'alt': resData.id })
                  //  将光标移动到图片后面
                  thisvm.J_quillEditor.setSelection(range.index + 1)
                }
              })
            }
          })
        }
      }, false)
    },
    // 支持自动触发上传
    doFileUploadService (file, callback) {
      let thisvm = this
      // 拼接多个文件参数
      let fd = new FormData()
      // 附件回显追加
      fd.append('file', file)
      let paiWeiMap = thisvm.getPaiWei()
      let url = `${window.SITE_CONFIG['apiURL']}${thisvm.uploadUrl}?token=` + Cookies.get('token')
      let xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('panWei', paiWeiMap.panWei)
      xhr.send(fd)
      xhr.onload = () => {
        if (xhr.status === 200) {
          let res = JSON.parse(xhr.responseText)
          if (res.code === 0) {
            this.execImgPreview(res.data, callback)
          }
        }
      }
    },
    // 获取加密排位
    getPaiWei () {
      let convData = ''
      // 进行md5秘钥加密(token+userId+param)
      let token = Cookies.get('token') || ''
      let url = this.uploadUrl
      let secretKey = token + '|' + url + '|' + convData
      let paiWeiMap = { 'panWei': md5(secretKey) }
      return paiWeiMap
    },
    execImgPreview (id, callback) {
      this.$http.get('/ctc/oss/file/photo/path/' + id).then(({ data: res }) => {
        if (res.code === 0) {
          let picUrl = polishingOssHost(res.data)
          let resData = { 'id': id, 'picUrl': picUrl }
          callback && callback(resData)
        }
      }).catch((res) => { })
    },
    // 获取缺陷ID回显数据
    getDefectInfoById () {
      let thisvm = this
      thisvm.$http.get('ctc/defect/base/' + thisvm.dataForm.defectId).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
          for (var i in thisvm.dataForm) {
            if (thisvm.dataForm[i] === null) {
              thisvm.dataForm[i] = ''
            }
          }
          let descriptionHtml = thisvm.dataForm.descriptionHtml || thisvm.dataForm.description || ''
          descriptionHtml = descriptionHtml.replace(/\n/g, '')
          thisvm.J_quillEditor.root.innerHTML = descriptionHtml
          thisvm.dataForm.repairDescription = ctcUtils.strReplace(thisvm.dataForm.repairDescription, '<br>', '')
          thisvm.dataForm.defectQuestionType = thisvm.dataForm.defectQuestionType + ''
          let projectId = thisvm.dataForm.parentProjectId || thisvm.dataForm.projectId
          // 根据项目id，回显缺陷结果配置信息
          thisvm.getDefectConfInfo(projectId)
          // 加载缺陷问题类型
          let dictType = 'questionType' + thisvm.dataForm.defectType
          thisvm.getParentProjectConfData(projectId, dictType, true).then(function (data) {
            thisvm.defectQuestionTypeData = data
          })
          thisvm.echoDataForm.caseId = 'clear_' + Math.random()
          thisvm.echoDataForm.nowHandlerIds = ''
          thisvm.echoDataForm.handlerNames = ''
          thisvm.echoDataForm.caseId = thisvm.dataForm.caseId
          thisvm.echoDataForm.nowHandlerIds = thisvm.dataForm.nowHandler
          thisvm.echoDataForm.handlerNames = thisvm.dataForm.handlerName
          // 获取父项目信息
          if (thisvm.dataForm.parentProjectId) {
            // 回显子项目
            thisvm.loadProjectTaskData(2, { 'id': thisvm.dataForm.parentProjectId, 'nodeType': 1, 'childNodeType': 2 }, false)
            // 回显任务
            thisvm.loadProjectTaskData(4, { 'id': thisvm.dataForm.projectId, 'nodeType': 2, 'childNodeType': 4 }, false)
            thisvm.dataForm.hasChildProject = true
          } else {
            thisvm.dataForm.parentProjectId = thisvm.dataForm.projectId
            thisvm.dataForm.projectId = ''
            // 回显任务
            thisvm.loadProjectTaskData(4, { 'id': thisvm.dataForm.parentProjectId, 'nodeType': 2, 'childNodeType': 4 }, false)
            thisvm.dataForm.hasChildProject = false
          }
          let imgData = thisvm.J_quillEditor.root.getElementsByTagName('img')
          for (let idx = 0; idx < imgData.length; idx++) {
            let id = imgData[idx].getAttribute('alt')
            if (id) {
              thisvm.execImgPreview(id, function (resData) {
                imgData[idx].setAttribute('src', resData.picUrl)
              })
            }
          }
          // 附件回显
          thisvm.$refs.ctcFileUpload.echoInit(thisvm.dataForm.attachementId)
          thisvm.validTagShow()
        }
        thisvm.$ctcLoading.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    validTagShow () {
      this.$nextTick(() => {
        let validTagMap = {}
        validTagMap.hasChildProject = !this.dataForm.hasChildProject
        validTagMap.case = !(this.dataForm.taskId !== '')
        validTagMap.project = !(this.dataForm.projectId || this.dataForm.parentProjectId)
        this.validTagMap = { ...this.validTagMap, ...validTagMap }
      })
    },
    // 父项目联动
    chooseParentProject (id) {
      let item = this.dataParentProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.chooseProjectTask(item)
      // 重置关联用例
      this.dataForm.projectId = ''
      this.dataForm.taskId = ''
      this.echoDataForm.caseId = 'clear_' + Math.random()
      this.echoDataForm.nowHandlerIds = 'clear_' + Math.random()
      this.$refs.dataForm.clearValidate('projectId')
    },
    // 子项目联动
    chooseProject (id) {
      let item = this.dataProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.taskId = ''
      this.chooseProjectTask(item)
      // 重置关联用例
      this.echoDataForm.caseId = 'clear_' + Math.random()
      this.echoDataForm.nowHandlerIds = 'clear_' + Math.random()
    },
    // 任务
    chooseTask (id) {
      let thisvm = this
      let item = thisvm.dataTaskData.filter(function (item) {
        return id === item.id
      })[0]
      this.chooseProjectTask(item)
      // 根据任务id，查询任务关联平台
      this.getRelevanceDataByTaskId()
      // 重置关联用例
      this.echoDataForm.caseId = 'clear_' + Math.random()
      this.echoDataForm.nowHandlerIds = 'clear_' + Math.random()
    },
    chooseProjectTask (item) {
      if (item.id) {
        // nodeType 1:项目2:子项目;4:任务
        let nodeType = item.nodeType
        let childNodeType = item.childNodeType
        // 判断有无子项目
        if (nodeType === 1) {
          if (childNodeType === 2) {
            this.dataForm.hasChildProject = true
          } else {
            this.dataForm.hasChildProject = false
          }
        }
        if (nodeType === 1) {
          // 根据项目id，获取缺陷结果配置
          this.getDefectConfInfo(item.id)
        }
        this.loadProjectTaskData(childNodeType, item, true)
        // 获取下一步处理人
        this.getDefectdefaultHandler()
        // 触发动态标签显示
        this.validTagShow()
      }
    },
    loadProjectTaskData (type, node, isClear) {
      let thisvm = this
      let params = { 'id': node.id, 'nodeType': node.nodeType }
      let url = '/ctc/project/projectDetail/listTreeRoot'
      if (type === 1) {
        url = '/ctc/project/projectDetail/listTreeRoot'
      } else if (type === 2) {
        url = '/ctc/project/projectDetail/listTree'
      } else if (type === 3 || type === 4) {
        url = '/ctc/defect/base/task'
        params.projectId = node.id
      }
      thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataParentProjectData = res.data
            if (isClear) {
              thisvm.dataProjectData = []
              thisvm.dataTaskData = []
              thisvm.dataForm.parentProjectId = ''
              thisvm.dataForm.projectId = ''
              thisvm.dataForm.taskId = ''
              // 修改缺陷-获取缺陷数据
              if (thisvm.dataForm.defectId) {
                thisvm.getDefectInfoById()
              }
            }
          } else if (type === 2) {
            thisvm.dataProjectData = res.data
            if (isClear) {
              thisvm.dataTaskData = []
              thisvm.dataForm.projectId = ''
              thisvm.dataForm.taskId = ''
            }
          } else if (type === 3 || type === 4) {
            thisvm.dataTaskData = res.data
            if (isClear) {
              thisvm.dataForm.taskId = ''
            }
          }
        }
      }).catch(() => { })
    },
    getDefectdefaultHandler () {
      let projectId = this.dataForm.projectId || this.dataForm.parentProjectId || ''
      let taskId = this.dataForm.taskId || ''
      let caseId = this.dataForm.caseId || ''
      let params = {}
      if (projectId) {
        params.projectId = projectId
      }
      if (taskId) {
        params.taskId = taskId
      }
      if (caseId) {
        params.caseId = caseId
      }
      if (Object.keys(params).length > 0) {
        this.$http.get('ctc/project/projectMember/defect/defaultHandler', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let userId = res.data || []
            if (userId && userId.length > 0) {
              this.echoDataForm.nowHandlerIds = userId.join(',')
              this.echoDataForm.handlerNames = ''
            }
          }
        }).catch(() => { })
      }
    },
    getRelevanceDataByTaskId () {
      let taskId = this.dataForm.taskId || ''
      if (taskId) {
        this.$http.get('/ctc/task/base/' + taskId, { params: {} }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let relaPlatformList = res.data.relaPlatformList || []
            if (relaPlatformList.length > 0) {
              this.dataForm.defectSource = relaPlatformList[0].applicationId
            }
          }
        }).catch(() => { })
      }
    },
    initDefectPageData () {
      let thisvm = this
      // 默认加载父项目信息
      thisvm.loadProjectTaskData(1, {}, true)
      thisvm.validTagShow()
    },
    defectTypeChange (dictValue) {
      let thisvm = this
      let projectId = this.dataForm.parentProjectId || this.dataForm.projectId || ''
      let dictType = 'questionType' + dictValue
      // 清空已配置缺陷类型
      this.dataForm.defectQuestionType = ''
      // 加载缺陷问题类型
      thisvm.getParentProjectConfData(projectId, dictType, true).then(function (data) {
        thisvm.defectQuestionTypeData = data
      })
    },
    // 根据项目id，获取缺陷配置信息
    getDefectConfInfo (projectId) {
      let thisvm = this
      // 加载缺陷来源
      thisvm.defectSourceDataByProjectId(projectId)
      // 加载缺陷环境
      thisvm.getParentProjectConfData(projectId, 'defectEnv', true).then(function (data) {
        thisvm.defectEnvData = data
        // 特殊处理，只配置一个缺陷环境默认填充
        if (thisvm.defectEnvData.length === 1) {
          thisvm.dataForm.defectEnv = Number(thisvm.defectEnvData[0].dictValue)
        }
      })
      // 加载缺陷类型
      thisvm.getParentProjectConfData(projectId, 'defectType', true).then(function (data) {
        thisvm.defectTypeData = data
      })
    },
    getParentProjectConfData (projectId, dictType, isAutoFill) {
      return new Promise((resolve, reject) => {
        let params = {}
        params.projectId = projectId
        params.dictType = dictType
        params.isAutoFill = isAutoFill
        this.$http.get('/ctc/defect/defectConfInfo/getDefectConfInfo', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            resolve(res.data)
          }
        }).catch(() => { })
      })
    },
    defectSourceDataByProjectId (projectId) {
      if (projectId) {
        this.$http.get('ctc/project/relaPlatform/getByPjectId', { params: { 'projectId': projectId } }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            // 缺陷来源
            let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
            let data = defaultData.concat(res.data)
            let newData = []
            data.forEach((item, index) => {
              newData.push({ 'dictLabel': item.name, 'dictValue': item.applicationId })
            })
            this.defectSourceData = newData
            // 特殊处理，只配置一个缺陷来源默认填充
            if (this.defectSourceData.length > 0) {
              this.dataForm.defectSource = this.defectSourceData[0].dictValue
            }
          }
        }).catch(() => { })
      }
    },
    handleDialogClose () {
      this.$handTriggerReLoadEvent('defectReload')
      removeCurrentTabsHandle(this)
    },
    handleConfirm: debounce(function () {
      let thisvm = this
      // 自动触发缺陷附件上传
      let descriptionHtmlIds = []
      let imgData = thisvm.J_quillEditor.root.getElementsByTagName('img')
      for (let idx = 0; idx < imgData.length; idx++) {
        let id = imgData[idx].getAttribute('alt')
        descriptionHtmlIds.push(id)
      }
      thisvm.dataForm.descriptionHtmlIds = descriptionHtmlIds.join(',')
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (valid) {
            thisvm.confirmBtn = true
            let params = { ...thisvm.dataForm }
            // 判断无子项目
            if (!params.hasChildProject) {
              params.projectId = params.parentProjectId
              params.parentProjectId = ''
            }
            // 特殊处理描述、原因换行符
            let descriptionHtml = params.descriptionHtml
            descriptionHtml = descriptionHtml.replace(/\s+/g, ' ')
            descriptionHtml = ctcUtils.strReplace(descriptionHtml, '<p> </p>', '')
            params.descriptionHtml = descriptionHtml
            params.repairDescription = params.repairDescription.replace(/\n/g, '<br />')
            // 特殊处理用例保存，手动去除无用参数
            delete params['operationList']
            delete params['testRecords']
            // 新增：post;修改：put
            thisvm.$http[!thisvm.dataForm.defectId ? 'post' : 'put']('ctc/defect/base', params).then(({ data: res }) => {
              thisvm.confirmBtn = false
              if (res.code !== 0) {
                return thisvm.$message.error(res.msg)
              }
              thisvm.$message({
                message: thisvm.$t('prompt.success'),
                type: 'success',
                duration: 500,
                onClose: () => {
                  thisvm.$emit('watchChildPage')
                  thisvm.handleDialogClose()
                }
              })
            }).catch(() => {
              thisvm.handleDialogClose()
            })
          }
        })
      })
    }, 3000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.defect-add-or-update {
}
</style>
