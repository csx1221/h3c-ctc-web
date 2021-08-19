<template>
  <el-card shadow="never" class="aui-card--fill  project-mgr-page">
    <el-row v-if="showUpload && superAdmin==1">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="title" label="文档标题:">
              <el-input v-model="dataForm.title" placeholder="请输入文档标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="attachementId" label="上传附件:">
              <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId" style="cursor:pointer;"></ctc-file-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button-group>
              <el-button type="primary" plain @click="doOperationBtn(1)"><i class="el-icon-upload2"></i>提交</el-button>
              <el-button type="primary" plain @click="doOperationBtn(3)"><i class="el-icon-close"></i>关闭</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="margin-top:24px;">
      <el-col :span="24" style="text-align:right;margin-bottom:10px;" v-if="superAdmin==1">
        <el-button type="blue" size="small" @click="doAddUploadFile()">新增</el-button>
      </el-col>
      <el-col :span="24">
        <el-table :data="documentData" ref="documentData" :expand-row-keys="expandRowKeys" :row-key="getRowKeys" @expand-change="expandChange" stripe border>
          <el-table-column type="expand" label="帮助文档" width="80">
            <template slot-scope="props">
              <el-row>
                <template v-for="(item,index) in  props.row.attachementData">
                  <el-col :span="4" :key="index" style="text-align:center;padding:5px;cursor:pointer;height:80px;overflow:hidden;" @click.native="doDownLoad(item,props.row,props.$index,index)">
                    <img :src="getImgSrc(item)" style="width: 32px; height: 32px" /><br />
                    <span class="demonstration">{{item.fileName}}</span>
                  </el-col>
                </template>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="文档标题" width="400" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updaterName" label="修改人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateDate" label="修改时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="120" v-if="superAdmin==1">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doUpdateUploadFile(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="doDeleteDocument(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  name: 'HelpDocuments',
  components: {
  },
  data () {
    return {
      dataForm: {
        id: '',
        title: '',
        attachementId: ''
      },
      // 判断当前用户是否是管理员
      superAdmin: this.$store.state.user.superAdmin,
      showUpload: false,
      defaultFile: require('../../../assets/img/wenjian.png'),
      defaultImg: require('../../../assets/img/default_img.png'),
      documentData: [],
      expandRowKeys: [] // 默认展开行Id
    }
  },
  computed: {
    dataRule () {
      return {
        title: [
          { required: true, message: '请输入文档标题', trigger: 'blur' },
          { required: true, message: '请输入文档标题', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    let thisvm = this
    thisvm.$nextTick(() => {
      thisvm.getDocumentInfo()
    })
  },
  methods: {
    doOperationBtn (type) {
      if (type === 1) {
        // 提交
        this.doSubmitForm()
      } else if (type === 3) {
        // 关闭
        removeCurrentTabsHandle(this)
      }
    },
    doSubmitForm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = this.dataForm
          this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/document', params).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.showUpload = false
              this.getDocumentInfo()
            }
          }).catch(() => { })
        }
      })
    },
    doAddUploadFile () {
      this.showUpload = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1000, 'checkFileType': ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.txt', '.zip', '.rar', '.mp4'], 'checkFileSize': 1.07374e10 }
        this.$refs.ctcFileUpload.init()
        this.$refs.ctcFileUpload.echoInit('')
        this.dataForm.id = ''
        this.dataForm.attachementId = ''
      })
    },
    doUpdateUploadFile (row) {
      this.showUpload = true
      this.$nextTick(() => {
        this.dataForm = { ...this.dataForm, ...row }
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1000, 'checkFileType': ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.txt', '.zip', '.rar', '.mp4'], 'checkFileSize': 1.07374e10 }
        this.$refs.ctcFileUpload.init()
        setTimeout(() => {
          this.$refs.ctcFileUpload.echoInit(row.attachementId)
        }, 500)
      })
    },
    getDocumentInfo () {
      let params = {}
      this.$http.get('/sys/document', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let data = res.data
          data.map((item, index) => {
            item.attachementData = []
            item.hasAttachementFlag = false
          })
          this.documentData = data
        }
      }).catch((res) => {
      })
    },
    getRowKeys (row) {
      return row.id
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
    doDeleteDocument (row) {
      this.$toggleRowSelectionTable('documentData', row)
      this.$confirm('确定删除[文档]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/sys/document', { 'data': [row.id] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('文档删除失败')
          } else {
            this.$message.success('文档删除成功')
            this.getDocumentInfo()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    doDownLoad (item, row, tableIndex, index) {
      let data = {}
      let fileName = item.fileName
      // 特殊处理用例勾选用例，只导出用户勾选用例
      let url = '/ctc/oss/file/download/' + item.id
      ctcUtils.customExportGet(url, data, fileName)
    },
    expandChange (row, expandedRows) {
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
          }
        }).catch(() => { })
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
