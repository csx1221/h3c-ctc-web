<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="parentProjectId" label="所属项目：">
            <el-select v-model="dataForm.parentProjectId" filterable placeholder="请选择项目" @change="chooseParentProject" style="width:100%;">
              <el-option v-for="data in dataParentProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="validTagShow('childrenProject')">
          <el-form-item prop="projectId" label="子项目：">
            <el-select v-model="dataForm.projectId" filterable placeholder="请选择子项目" style="width:100%;" @change="chooseProject">
              <el-option v-for="data in dataProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告标题：" prop="title">
            <el-input v-model="dataForm.title" :placeholder="$t('notice.title')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否置顶：" prop="sticky">
            <ctc-select v-model="dataForm.sticky" dict-type="whether" placeholder="请选择是否置顶" style="width:100%;"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效期：" prop="">
            <el-radio-group v-model="dataForm.noticeValidPeriod">
              <el-radio :label="-1">永久</el-radio>
              <el-radio :label="1">一年</el-radio>
              <el-radio :label="2">半年</el-radio>
              <el-radio :label="3">三个月</el-radio>
              <el-radio :label="4">一个月</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公告内容：" prop="content">
            <!-- 富文本编辑器, 容器 -->
            <div id="J_quillEditor" style="height:400px"></div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="attachementId" label="附件：">
            <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId"></ctc-file-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button size="small" ype="danger" @click="dataFormSubmitHandle(0)" v-if="this.dataForm.noticeStatus!=1">保存草稿</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle(1)">发布通告</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
export default {
  data () {
    return {
      visible: false,
      J_quillEditor: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        // ['image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      dataForm: {
        noticeId: '',
        id: '',
        title: '',
        sticky: 0,
        content: '',
        hasChildProject: false, // 判断有无子项目
        parentProjectId: '',
        projectId: '',
        name: '',
        noticeStatus: '0',
        noticeValidPeriod: -1,
        creator: '',
        createDate: '',
        attachementId: ''
      },
      dataParentProjectData: [],
      dataProjectData: []
    }
  },
  computed: {
    dataRule () {
      var validateContent = (rule, value, callback) => {
        if (this.J_quillEditor.getLength() <= 1) {
          return callback(new Error('公告内容不允许为空'))
        }
        callback()
      }
      return {
        parentProjectId: [
          { required: true, message: '所属项目不允许为空', trigger: 'blur' },
          { required: true, message: '所属项目不允许为空', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '子项目不允许为空', trigger: 'blur' },
          { required: true, message: '子项目不允许为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '公告标题不允许为空', trigger: 'blur' },
          { required: true, message: '公共标题不允许为空', trigger: 'change' }
        ],
        content: [
          { required: true, validator: validateContent, trigger: 'blur' },
          { required: true, validator: validateContent, trigger: 'change' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.J_quillEditor) {
          this.J_quillEditor.deleteText(0, this.J_quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }
        this.$refs['dataForm'].resetFields()
        this.dataForm.projectId = ''
        this.dataProjectData = []
        this.dataForm.noticeStatus = '0'
        this.dataForm.noticeId = this.dataForm.id
        // 默认初始化文件上传组件
        this.$refs.ctcFileUpload.echoInit('')
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 100, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
        this.$refs.ctcFileUpload.init()
        this.loadProjectTaskData(1, {}, false)
        this.getNoticeInfo()
      })
    },
    validTagShow (type) {
      let bool = true
      if (type === 'childrenProject') {
        bool = this.dataForm.hasChildProject
      }
      return bool
    },
    // 父项目联动
    chooseParentProject (id) {
      let item = this.dataParentProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.name = item.nodeName
      this.dataForm.projectId = ''
      this.chooseProjectTask(item)
    },
    // 子项目联动
    chooseProject (id) {
      let item = this.dataProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.name = item.nodeName
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
        this.loadProjectTaskData(childNodeType, item, true)
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
      }
      thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataParentProjectData = res.data
            if (isClear) {
              thisvm.dataProjectData = []
              thisvm.dataForm.parentProjectId = ''
              thisvm.dataForm.projectId = ''
            }
          } else if (type === 2) {
            thisvm.dataProjectData = res.data
            if (isClear) {
              thisvm.dataForm.projectId = ''
            }
          }
        }
      }).catch(() => { })
    },
    // 富文本编辑器
    quillEditorHandle () {
      this.J_quillEditor = new Quill('#J_quillEditor', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 监听内容变化，动态赋值
      this.J_quillEditor.on('text-change', () => {
        this.dataForm.content = this.J_quillEditor.root.innerHTML
      })
    },
    getNoticeInfo () {
      let noticeId = this.dataForm.noticeId || this.dataForm.id
      if (noticeId) {
        this.$http.get('ctc/project/projectNotice/' + noticeId).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataForm = { ...this.dataForm, ...res.data }
            // 公告内容
            this.J_quillEditor.root.innerHTML = this.dataForm.content
            // 附件回显
            this.$refs.ctcFileUpload.echoInit(this.dataForm.attachementId)
            // 获取父项目信息
            if (this.dataForm.parentProjectId) {
              // 回显子项目
              this.loadProjectTaskData(2, { 'id': this.dataForm.parentProjectId, 'nodeType': 1, 'childNodeType': 2 }, false)
              this.dataForm.hasChildProject = true
            } else {
              this.dataForm.parentProjectId = this.dataForm.projectId
              this.dataForm.projectId = ''
              this.dataForm.hasChildProject = false
            }
          }
        }).catch(() => { })
      }
    },
    deleteUserProjectNoticeRead () {
      // 修改发布，需要清空成员已读状态
      if (this.dataForm.noticeId) {
        let data = [this.dataForm.noticeId]
        this.$http.delete('/ctc/project/userProjectNoticeRead', { 'data': data }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          }
        }).catch(() => { })
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function (noticeStatus) {
      let thisvm = this
      // 自动触发缺陷附件上传
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          thisvm.dataForm.noticeId = thisvm.dataForm.id
          thisvm.dataForm.noticeStatus = noticeStatus
          let params = Object.assign({}, thisvm.dataForm)
          // 判断无子项目
          if (!params.hasChildProject) {
            params.projectId = params.parentProjectId
            delete params['parentProjectId']
          }
          thisvm.$http[!params.id ? 'post' : 'put']('/ctc/project/projectNotice', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            }
            // 特殊处理发布，发布要清空已读状态
            if (params.id && params.noticeStatus === 1) {
              thisvm.deleteUserProjectNoticeRead()
            }
            thisvm.$message({
              message: thisvm.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                thisvm.visible = false
                thisvm.$emit('refreshDataList')
              }
            })
          }).catch(() => { })
        })
      })
    }, 1500, { 'leading': true, 'trailing': false })
  }
}
</script>
