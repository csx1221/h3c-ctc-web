<template>
  <div class="addOrUpdata">
    <el-dialog :title="title" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <template>
        <el-form class="main_el_form" label-position="right" ref="dataForm" :model="dataForm" label-width="120px">
          <el-row>
            <template v-for="(item,index) in list">
              <el-col v-if="item.type==='hidden'" :key="index" :span="0" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code">
                  <el-input v-model="dataForm[item.code]"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='input'" :key="index" :span="item.span" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code" :rules="item.rule">
                  <el-input v-model="dataForm[item.code]" placeholder="输入" :disabled="!item.edit"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='select'" :key="index" :span="item.span" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-select v-model="dataForm[item.code]" :dict-type="item.dictType" placeholder="请选择" :disabled="!item.edit"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='open'" :key="index" :span="item.span" class="is_flex">
                <el-form-item v-if="item.code==='organizeId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-project-organize-table v-model="dataForm[item.code]" placeholder="请选择所属机构" :organizeId.sync="dataForm[item.code]"></ctc-project-organize-table>
                </el-form-item>
                <el-form-item v-if="item.code==='personLiable'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-person-liable v-model="dataForm[item.code]" placeholder="请选择责任人" :organizeId.sync="dataForm[item.code]"></ctc-person-liable>
                </el-form-item>
                <el-form-item v-if="item.code==='parentProjectId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-project-info-table v-model="dataForm[item.code]" :projectId="dataForm[item.code]" placeholder="请选择项目"></ctc-project-info-table>
                </el-form-item>
                <el-form-item v-if="item.code==='projectId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-child-project-info-table v-model="dataForm[item.code]" placeholder="请选择子项目" :projectId.sync="dataForm[item.code]" :parentId.sync="dataForm.parentProjectId"></ctc-child-project-info-table>
                </el-form-item>
                <el-form-item v-if="item.code==='userId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-demand-analysis v-model="dataForm[item.code]" :userName.sync="dataForm.userName" placeholder="请选择需求分析人"></ctc-demand-analysis>
                </el-form-item>
                <el-form-item v-if="item.code==='demandId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-associated-requirements v-model="dataForm[item.code]" placeholder="请关联需求" :organizeId.sync="dataForm[item.code]"></ctc-associated-requirements>
                </el-form-item>

                <el-form-item v-if="item.code==='deptId'" :label="item.name" :prop="item.code" :rules="item.rule">
                  <ctc-dept-table v-model="dataForm[item.code]" placeholder="请选择所属部门" :deptId.sync="dataForm[item.code]" :organizeId.sync="dataForm.organizeId" :deptName.sync="dataForm.deptName"></ctc-dept-table>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='textarea'" :key="index" :span="item.span" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code" :rules="item.rule">
                  <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm[item.code]"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='file'" :key="index" :span="item.span" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code">
                  <ctc-file-upload ref="ctcFileUpload" v-model="dataForm[item.code]"></ctc-file-upload>
                </el-form-item>
              </el-col>
              <el-col v-if="item.type==='date'" :key="index" :span="item.span" class="is_flex">
                <el-form-item :label="item.name" :prop="item.code" :rules="item.rule">
                  <el-date-picker v-model="dataForm[item.code]" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </template>

      <template slot="footer" v-if="!isLook">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('dataForm')">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import ctcPersonLiable from '@/components/programmecntre/ctc-person-liable'
import ctcDemandAnalysis from '@/components/programmecntre/ctc-demand-analysis'
import ctcAssociatedRequirements from '@/components/programmecntre/ctc-associated-requirements'
import { isEmail, isMobile } from '@/utils/validate'
import Cookies from 'js-cookie'
export default {
  name: 'add-or-updata-or-look-new',
  data () {
    let validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
      }
      callback()
    }
    let validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        return callback(new Error(this.$t('validate.format', { 'attr': '手机号码' })))
      }
      callback()
    }
    return {
      title: '',
      dialogVisible: false,
      isLook: false,
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      dataForm: {
      },
      list: [],
      // 创建需求or修改需求
      demandList: [
        { name: 'demandId', code: 'demandId', type: 'hidden' },
        { name: 'deptName', code: 'deptName', type: 'hidden' },
        { name: '需求名称', code: 'demandName', span: 12, type: 'input', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '所属机构', code: 'organizeId', span: 12, type: 'open', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '提出部门', code: 'deptId', span: 12, type: 'open', edit: true },
        { name: '提出人', code: 'personLiableName', span: 12, type: 'input', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '提出人手机号', code: 'contactPhone', span: 12, type: 'input', rule: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }], edit: true },
        { name: '提出人邮箱', code: 'contactEmail', span: 12, type: 'input', rule: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateEmail, trigger: 'blur' }], edit: true },
        { name: '期望上线时间', code: 'expectedOnlineTime', span: 12, type: 'date', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '需求描述', code: 'description', span: 24, type: 'textarea', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: false },
        { name: '上传附件', code: 'attachementId', span: 24, type: 'file', edit: false }
      ],
      testDemandList: [
        { name: 'analyzeId', code: 'analyzeId', type: 'hidden' },
        { name: 'locusType', code: 'locusType', type: 'hidden' },
        { name: '所属项目', code: 'parentProjectId', span: 12, type: 'open', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '所属子项目', code: 'projectId', span: 12, type: 'open', edit: true },
        { name: '关联需求', code: 'demandId', span: 12, type: 'open', rule: [{ required: false, message: '请选择', trigger: 'change' }], edit: true },
        { name: '是否需要评审', code: 'review', span: 12, type: 'select', dictType: 'yesOrNo', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '需求分析人', code: 'userId', span: 12, type: 'open', rule: [{ required: true, message: '请输入', trigger: 'change' }], edit: true },
        { name: '需求分析人Name', code: 'userName', type: 'hidden' },
        { name: '分析时间', code: 'analyzeDate', span: 12, type: 'date', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '分析结果', code: 'analyzeResult', span: 24, type: 'textarea', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '上传附件', code: 'attachementId', span: 24, type: 'file', edit: true }
      ],
      testProgrammeList: [
        { name: 'planDesignId', code: 'planDesignId', type: 'hidden' },
        { name: 'locusType', code: 'locusType', type: 'hidden' },
        { name: '所属项目', code: 'parentProjectId', span: 12, type: 'open', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '所属子项目', code: 'projectId', span: 12, type: 'open', edit: true },
        { name: '关联需求分析', code: 'demandId', span: 12, type: 'open', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '是否需要评审', code: 'review', span: 12, type: 'select', dictType: 'yesOrNo', rule: [{ required: true, message: '请选择', trigger: 'change' }], edit: true },
        { name: '方案设计人', code: 'userId', span: 12, type: 'open', rule: [{ required: true, message: '请输入', trigger: 'change' }], edit: true },
        { name: '方案设计人Name', code: 'userName', type: 'hidden' },
        { name: '方案设计时间', code: 'planDesignDate', span: 12, type: 'date', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '设计结果', code: 'planDesignResult', span: 24, type: 'textarea', rule: [{ required: true, message: '请输入', trigger: 'blur' }], edit: true },
        { name: '上传附件', code: 'attachementId', span: 24, type: 'file', edit: true }
      ],
      page: ''
    }
  },
  components: {
    CtcProjectOrganizeTable,
    ctcPersonLiable,
    ctcDemandAnalysis,
    ctcAssociatedRequirements
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (page, type, row) {
      console.log(row)
      if (page === 'demandWarehouse') { // 需求仓库
        this.page = 'demandWarehouse'
        this.list = this.demandList
        if (type === 'create') {
          this.title = '新建'
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          this.initFileUpload()
        } else if (type === 'update') {
          this.title = '编辑'
          this.list.unshift({ name: '需求编号', code: 'demandCode', span: 12, type: 'input', edit: false })
          // 判断登录方式(0:云测试平台门户登录;1:4A登录)
          if (this.audit4ASw === '1') {
            this.list = this.list.filter((item) => {
              return !['contactPhone'].includes(item.code)
            })
          }
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload(row.attachementId)
        } else if (type === 'look') {
          this.title = '查看'
          this.list.unshift({ name: '需求编号', code: 'demandCode', span: 12, type: 'input', edit: false })
          this.isLook = true
          for (let i = 0; i < this.list.length; i++) {
            if (row.hasOwnProperty(this.list[i].code)) {
              this.$set(this.dataForm, this.list[i].code, '')
            }
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload(row.attachementId)
        }
      } else if (page === 'demandMenagement') {
        this.page = 'demandMenagement'
        this.list = this.testDemandList
        if (type === 'create') {
          this.title = '新建'
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].code === 'userId') {
              this.$set(this.dataForm, this.list[i].code, [])
            } else if (this.list[i].code === 'locusType') {
              this.$set(this.dataForm, this.list[i].code, 2)
            } else {
              this.$set(this.dataForm, this.list[i].code, '')
            }
          }
          this.initFileUpload()
        } else if (type === 'update') {
          this.title = '编辑'
          this.list.unshift({ name: '需求分析编号', code: 'analyzeCode', span: 12, type: 'input', edit: false })
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                if (this.list[i].code === 'userId') {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code].split(','))
                } else if (this.list[i].code === 'locusType') {
                  this.$set(this.dataForm, this.list[i].code, 2)
                } else {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
                }
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload()
        } else if (type === 'look') {
          this.title = '查看'
          this.list.unshift({ name: '需求分析编号', code: 'analyzeCode', span: 12, type: 'input', edit: false })
          this.isLook = true
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                if (this.list[i].code === 'userId') {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code].split(','))
                } else if (this.list[i].code === 'locusType') {
                  this.$set(this.dataForm, this.list[i].code, 2)
                } else {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
                }
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload()
        }
      } else if (page === 'programmeManagement') {
        this.page = 'programmeManagement'
        this.list = this.testProgrammeList
        if (type === 'create') {
          this.title = '新建'
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].code === 'userId') {
              this.$set(this.dataForm, this.list[i].code, [])
            } else if (this.list[i].code === 'locusType') {
              this.$set(this.dataForm, this.list[i].code, 2)
            } else {
              this.$set(this.dataForm, this.list[i].code, '')
            }
          }
          this.initFileUpload()
        } else if (type === 'update') {
          this.title = '编辑'
          this.list.unshift({ name: '方案设计编号', code: 'analyzeCode', span: 12, type: 'input', edit: false })
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                if (this.list[i].code === 'userId') {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code].split(','))
                } else if (this.list[i].code === 'locusType') {
                  this.$set(this.dataForm, this.list[i].code, 2)
                } else {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
                }
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload()
        } else if (type === 'look') {
          this.title = '查看'
          this.list.unshift({ name: '方案设计编号', code: 'analyzeCode', span: 12, type: 'input', edit: false })
          this.isLook = true
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.dataForm, this.list[i].code, '')
          }
          setTimeout(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (row.hasOwnProperty(this.list[i].code)) {
                if (this.list[i].code === 'userId') {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code].split(','))
                } else if (this.list[i].code === 'locusType') {
                  this.$set(this.dataForm, this.list[i].code, 2)
                } else {
                  this.$set(this.dataForm, this.list[i].code, row[this.list[i].code])
                }
              } else {
                this.$set(this.dataForm, this.list[i].code, '')
              }
            }
          }, 500)
          this.initFileUpload()
        }
      }
      this.dialogVisible = true
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.page === 'demandWarehouse') {
            this.submit1()
          } else if (this.page === 'demandMenagement') {
            this.submit2()
          } else if (this.page === 'programmeManagement') {
            this.submit3()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submit1 () {
      let thisvm = this
      // 自动触发缺陷附件上传
      thisvm.$refs.ctcFileUpload[0].doFileUploadAction(function () {
        thisvm.$ctcLoading.open()
        let params = { ...thisvm.dataForm }
        thisvm.$http.post('/ctc/plan/demands', params).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            thisvm.$message({
              message: thisvm.title + '成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                thisvm.dialogVisible = false
                thisvm.$emit('refresh')
              }
            })
          }
        }).catch((res) => {
          thisvm.$ctcLoading.close()
        })
      })
    },
    submit2 () {
      this.$ctcLoading.open()
      const { userId, ...newData } = this.dataForm
      let params = { userId: this.dataForm.userId.join(','), ...newData }
      this.$http.post('/ctc/plan/analyze', params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message({
            message: this.title + '成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.dialogVisible = false
              this.$emit('refresh')
            }
          })
        }
      }).catch((res) => {
        this.$ctcLoading.close()
      })
    },
    submit3 () {
      this.$ctcLoading.open()
      const { userId, ...newData } = this.dataForm
      let params = { userId: this.dataForm.userId.join(','), ...newData }
      this.$http.post('/ctc/plan/planDesign', params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message({
            message: this.title + '成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.dialogVisible = false
              this.$emit('refresh')
            }
          })
        }
      }).catch((res) => {
        this.$ctcLoading.close()
      })
    },
    initFileUpload (id) {
      this.$nextTick(() => {
        this.$refs.ctcFileUpload[0].customUploadParams = { 'maxCount': 100, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
        this.$refs.ctcFileUpload[0].init()
        if (id !== undefined) {
          setTimeout(() => {
            this.$refs.ctcFileUpload[0].echoInit(id)
          }, 1500)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.addOrUpdata .el-input-group {
  width: 100% !important;
}
.addOrUpdata {
  /*.file-upload-data .upload_warp_button {*/
  /*  padding-left: 0px;*/
  /*  text-align: center;*/
  /*  .el-button {*/
  /*    padding: 9px 15px;*/
  /*    margin: 10px auto;*/
  /*  }*/
  /*}*/
}
</style>
<style scoped lang="scss">
.el-input,
.el-select {
  width: 100% !important;
}
</style>
