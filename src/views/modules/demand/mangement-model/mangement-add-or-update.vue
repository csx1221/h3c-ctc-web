<template>
  <el-dialog :visible.sync="innerVisible" :title="state=='S' ? $t('seeDevelopment') :state=='U' ?  $t('updateDevelopment'):$t('addDevelopment')" :close-on-click-modal="false" width="60%" class="defect-add-or-update">
    <el-row>
      <el-col :span="24" style="padding-right:15px;">
        <el-form :model="dataForm" ref="dataForm" :rules="state=='S'?null:dataRule" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="需求名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入需求名称" v-if="state!='S'" clearable></el-input>
                <span v-else>{{dataForm.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="expectedCompletionTime" label="期望上线：">
                <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.expectedCompletionTime" clearable :picker-options="pickerOptions" v-if="state!='S'" style="width: 100%;"></el-date-picker>
                <span v-else>{{$moment(dataForm.expectedCompletionTime).format("yyyy-MM-DD")}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="ascription" label="需求来源：">
                <span v-if="state=='S'">{{dataForm.ascription}}</span>
                <el-cascader v-model="dataForm.ascription" :props="props" v-else-if="isShowAscription" ref="cascaderAddr" disabled placeholder="机构/部门/科室(默认,谁提的需求,默认是其所属科室)"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="state=='S'">
              <el-form-item label="需求提出人：" prop="createUserName">
                <span>{{dataForm.createUserName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="state=='S'">
              <el-form-item label="提出日期：" prop="createTime">
                <span>{{$moment(dataForm.createTime).format("yyyy-MM-DD")}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="attachementId" label="需求附件：" ref="attachementId">
                <el-input placeholder="仅支持['.doc', '.docx', '.xls', '.xlsx']上传" v-model="dataForm.attachementId" v-if="state!='S'" readonly clearable>
                  <el-upload slot="append" :headers="paramsHeaders" :action="triggerFileUploadUrl()" name="recordId" :before-upload="uploadHandleChange" accept=".doc,.docx,.xls,.xlsx" :on-success="uploadHandleSuccess" :on-error="uploadHandleError" :show-file-list="false" :http-request="request">上传</el-upload>
                </el-input>
                <a v-else @click="download">{{dataForm.attachementId}}</a>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="state!='S'">
              <el-form-item label="下一步处理人：" prop="nextDealUserName">
                <el-input v-model="dataForm.nextDealUserName" :placeholder="placeholder1" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="demandDescribe" label="需求描述：">
                <el-input v-if="state!='S'" v-model="dataForm.demandDescribe" placeholder="请输入需求描述" :rows="2" type="textarea"></el-input>
                <span v-else>{{dataForm.demandDescribe}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="remarks" label="备注：">
                <el-input v-model="dataForm.remarks" placeholder="请输入" :rows="2" type="textarea" v-if="state!='S'"></el-input>
                <span v-else>{{dataForm.remarks}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row v-if="state!='S'">
      <el-col :span="24" style="text-align:right;">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import Cookies from 'js-cookie'
import ctcUtils from '@/utils/ctc-utils.js'
import mixin from '../../../../mixins/process-module'
import md5 from 'js-md5'
import qs from 'qs'
export default {
  name: 'DefectAddOrUpdate',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixin],
  data () {
    return {
      fileList: [],
      state: 'N', // N:新增 S:查询 U:修改
      isShowAscription: true,
      attachementId: null,
      placeholder1: '请选择需求来源',
      mutiFileId: null, // 用于下载文件的id
      dataForm: {
        id: '',
        name: '',
        demandDescribe: '',
        expectedCompletionTime: '',
        ascription: [],
        remarks: '',
        nextDealUserName: '',
        nextDealUser: '',
        createUser: '',
        createUserName: '',
        attachementId: ''
      },
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    paramsHeaders () {
      let url = '/ctc/oss/mutiFile/uploads'
      let paramsHeaders = this.getPaiWei('post', url, {})
      return paramsHeaders
    },
    dataRule () {
      return {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        expectedCompletionTime: [
          {
            required: true,
            message: '请选择'
          }
        ],
        ascription: [
          {
            type: 'array',
            required: true,
            message: '请选择'
          }
        ],
        // attachementId: [{ required: true, message: '请上传' }],
        nextDealUserName: [
          {
            required: true,
            message: '请选择需求来源',
            trigger: 'blur'
          }
        ],
        demandDescribe: [{ required: true, message: '请输入' }]
      }
    }
  },
  methods: {
    init (r) {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.state === 'N') {
          this.getDepartment([Cookies.get('id')])
          this.attachementId = ''
          this.mutiFileId = ''
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = ''
          })
        } else {
          if (r === 'U') {
            this.getNextDealUserName([Cookies.get('id')])
          }
          this.getDefectInfoById(this.dataForm.id)
        }
      })
    },
    // 文件下载
    download () {
      ctcUtils.customExportGet(
        `/ctc/oss/file/download/${this.mutiFileId}`
      )
    },
    // 获取机构部门科室
    lazyLoad (node, resolve) {
      const level = node.level
      let url = ''
      if (level === 0) {
        url = '/sys/organize/list'
      } else if (level === 1) {
        url = `/sys/deptnew/listByOrganizeId/${node.value}`
      } else if (level === 2) {
        url = `/sys/section/list?deptId=${node.value}`
      }
      this.$http
        .get(url)
        .then(({ data: res }) => {
          let result
          if (level === 0) {
            result = res.data
            result.forEach(item => {
              item.value = item.id
              item.label = item.name
            })
          } else if (level === 1) {
            result = res.data
            result.forEach(item => {
              item.value = item.id
              item.label = item.name
            })
          } else if (level === 2) {
            result = res.data
            result.forEach(item => {
              item.value = item.id
              item.label = item.name
              // 这句代码表示当点击最后一级的时候 label后面不会转圈圈 并把相关值赋值到选择器上
              item.leaf = level >= 1
            })
          }
          resolve(result)
        })
        .catch(() => { })
    },
    // handleChange(v) {
    //   this.dataForm.nextDealUserName = null;
    //   this.dataForm.nextDealUser = null;
    //   v[2] && this.getNextDealUser(v[2], "项目总监");
    // },
    // 文件上传路径
    triggerFileUploadUrl () {
      return (`${window.SITE_CONFIG['apiURL']}/ctc/oss/mutiFile/uploads?token=` + Cookies.get('token'))
    },
    // 获取加密排位
    getPaiWei (type, url, data) {
      data = data || {}
      let convData = ''
      if (type === 'get') {
        convData = qs.stringify(data, { arrayFormat: 'repeat' })
      } else {
        convData = (Object.keys(data).length === 0) ? '' : JSON.stringify(data)
      }
      // 进行md5秘钥加密(token+userId+param)
      let token = Cookies.get('token') || ''
      let secretKey = token + '|' + url + '|' + convData
      let paiWeiMap = { 'panWei': md5(secretKey) }
      return paiWeiMap
    },
    // 文件上传
    request (params) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      var fd = new FormData()
      // 附件回显追加
      fd.append('files', params.file)
      let paiWeiMap = this.getPaiWei('post', '/ctc/oss/mutiFile/uploads', {})
      let url = `${window.SITE_CONFIG['apiURL']}/ctc/oss/mutiFile/uploads?token=` + Cookies.get('token')
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('panWei', paiWeiMap.panWei)
      xhr.send(fd)
      xhr.onload = fd => {
        thisvm.$ctcLoading.close()
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            thisvm.dataForm.attachementId = params.file.name
            thisvm.attachementId = res.data
            thisvm.$message.success('上传成功！')
          }
        } else {
          thisvm.$message.error('上传失败！')
        }
      }
    },
    // 文件上传成功
    uploadHandleSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$message.error('上传失败，' + response.msg)
      } else {
        this.$message.success('上传成功')
        this.$emit('watchChildImport', { type: 'reloadTable' })
        this.innerVisible = false
      }
      this.$refs['file-upload'].clearFiles()
    },
    uploadHandleChange (file, fileList) {
      let fileName = file.name
      let postfixName = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
      let checkFileType = ['.doc', '.docx', '.xls', '.xlsx']
      // 判断上传文件格式
      if (!checkFileType.includes(postfixName)) {
        this.$message.warning('文件格式不符合规范，仅支持【' + checkFileType.join('，') + '】上传')
        return false
      }
    },
    // 文件上传失败
    uploadHandleError (err, file, fileList) {
      this.$message.error(err)
    },
    getDefectInfoById (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      thisvm.$http
        .get('/ctc/demand/getDemandById/' + id)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
            thisvm.$ctcLoading.close()
          } else {
            if (thisvm.state === 'U') {
              for (let i in res.data) {
                if (i !== 'ascription') {
                  thisvm.dataForm[i] = res.data[i]
                }
              }
            } else {
              thisvm.dataForm = res.data
            }
            let attId = res.data.attachementId
            thisvm.attachementId = attId
            thisvm.$http
              .get('/ctc/oss/mutiFile/listFiles', {
                params: { recordId: attId }
              })
              .then(({ data: res }) => {
                thisvm.$ctcLoading.close()
                if (res.code !== 0) {
                  thisvm.$message.error(res.msg)
                } else {
                  thisvm.dataForm.attachementId = res.data[0].fileName
                  thisvm.mutiFileId = res.data[0].id
                }
              })
              .catch(() => { })
          }
        })
        .catch(() => { })
    },
    // 提交
    handleConfirm () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate(
        valid => {
          if (valid) {
            thisvm.$ctcLoading.open()
            let params = { ...thisvm.dataForm }
            params.attachementId = thisvm.attachementId
            params.stateId = 2
            params.ascription = this.$refs['cascaderAddr'].inputValue
            params.expectedCompletionTime = thisvm.$moment(params.expectedCompletionTime).format('yyyy-MM-DD HH:mm:ss')
            params.createTime = thisvm.$moment().format('yyyy-MM-DD HH:mm:ss')
            delete params.nextDealUserName
            delete params.createUserName
            let url = ''
            if (this.state === 'U') {
              url = '/ctc/demand/updateDemand'
            } else {
              url = '/ctc/demand/saveDemand'
              params.createUser = Cookies.get('id')
            }
            thisvm.$http
              .post(url, params)
              .then(({ data: res }) => {
                thisvm.$ctcLoading.close()
                if (res.code !== 0) {
                  thisvm.$message.error(res.msg)
                } else {
                  thisvm.$message({
                    message: thisvm.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                      thisvm.$emit('watchChildPage')
                      thisvm.handleDialogClose()
                    }
                  })
                }
              })
              .catch(() => {
                thisvm.handleDialogClose()
              })
          }
        },
        1000,
        { leading: true, trailing: false }
      )
    },
    // 关闭弹窗
    handleDialogClose () {
      this.innerVisible = false
    },
    // 根据用户id查询用户账号
    getNextDealUserName (id) {
      this.$http
        .post('/sys/user/subadmin/users', id)
        .then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code === 0) {
            let data = res.data[0]
            let actions = `${data.organizeName}-${data.deptName}-${data.sectionName}`
            this.isShowAscription = false
            setTimeout(() => {
              this.dataForm.ascription = [
                data.organizeId,
                data.deptId,
                data.sectionId
              ]
              this.isShowAscription = true
            }, 100)
            this.getNextDealUser(data.sectionId, '项目总监', actions)
          }
        })
        .catch(() => {
          this.$ctcLoading.close()
        })
    }
  }
}
</script>
<style lang="scss">
.defect-add-or-update {
  .el-input-group__append {
    background-color: #46cee0;
    color: white;
  }
  .el-cascader {
    display: block;
  }
  .el-input__inner {
    position: relative;
  }
  .el-upload-list__item-name {
    position: absolute;
    left: -100px;
  }
}
</style>
