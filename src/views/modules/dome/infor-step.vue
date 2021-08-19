<template>
    <el-form ref="ruleForm" :rules="rules" :model="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="180px">
      <!-- 项目名称不许重名,发给后台请求 -->
      <!-- 未连接数字字典,options为下拉列表的数据绑定,建议使用人人框架的select组件 -->
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="项目名称">
            <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目级别" prop="level">
            <ctc-select style="width: 100%;" v-model="dataForm.level" dict-type="project_level" placeholder="请选择项目级别"></ctc-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 请求数据 -->
      <el-col :span="12">
        <el-form-item label="项目范围" prop="scope">
          <ctc-select style="width: 100%;" v-model="dataForm.scope" dict-type="project_scope" placeholder="请选择项目范围"></ctc-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目类别" prop="category">
          <ctc-select style="width: 100%;" v-model="dataForm.category" dict-type="project_category" placeholder="请选择项目类别"></ctc-select>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="开始日期" prop="planStartTime">
          <el-date-picker style="width: 100%;" v-model="dataForm.planStartTime" format="yyyy 年 MM 月 dd 日" :picker-options="updateTime" value-format="yyyy-MM-dd h:mm:ss" type="date" placeholder="请选择开始日期" >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <!-- 前置文档未添加,需要在提交部分判断是否未生产类 -->
      <el-col :span="12">
        <el-form-item label="结束日期" prop="planEndTime">
          <el-date-picker style="width: 100%;" v-model="dataForm.planEndTime" format="yyyy 年 MM 月 dd 日" :picker-options="actStartTime" value-format="yyyy-MM-dd h:mm:ss" type="date" placeholder="请选择结束日期" >
          </el-date-picker>
        </el-form-item>
      </el-col>
      </el-row>
      <!-- 默认为项目经理所在的公司 -->
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="归属机构" prop="institutions">
            <el-cascader style="width: 100%;" v-model="dataForm.organizationId" :options="dataForm.institutions" placeholder="请选择归属机构" filterable>
            </el-cascader>
          </el-form-item> -->
          <el-form-item label="归属机构">
            <el-select style="width: 100%;" v-model="dataForm.organizationId" clearable   placeholder="请选择归属机构">
              <el-option v-for="item in institutionsArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
          </el-form-item>
        </el-col>
      <!-- 前端已实现模糊搜索,人员信息需请求 -->
        <el-col :span="12">
          <el-form-item label="项目经理" prop="pop">
            <el-select style="width: 100%;" v-model="dataForm.managerId" clearable  placeholder="请选择项目经理">
              <el-option v-for="item in projectmanages" :key="item.id" :label="item.username" :value="item.id">
              </el-option>
          </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="需求来源" prop="source">
          <el-cascader style="width: 100%;" allow-create=true placeholder="请选择需求来源" filterable>
          </el-cascader>
         </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- 不确认需求联系人 -->
        <el-form-item allow-create=true label="需求联系人">
          <el-cascader style="width: 100%;" placeholder="请选择联系人" filterable>
          </el-cascader>
        </el-form-item>
      </el-col>
      </el-row>
      <el-form-item style="width: 100%;" prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-row style='width: 90%;margin-top: 20px;text-align: center;'>
        <el-form-item size="large">
          <el-button v-if="!modify" type="primary" @click="twoPrevious()">上一步</el-button>
          <el-button v-if="modify" type="primary" @click="dataFormSubmitHandle()">保存提交</el-button>
          <el-button v-if="!modify" type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-row>
    </el-form>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  props: {
    modify: {
      type: Boolean
    },
    dataForm: {
      type: Object
    },
    currentRow: {
      type: Object
    }
  },
  data () {
    return {
      visible: false,
      updateUserId: 1,
      projectmanages: [],
      institutionsArr: [],
      updateTime: { // 开始日期小于结束日期
        disabledDate: time => {
          let endDateVal = this.dataForm.planEndTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      actStartTime: { // 结束日期
        disabledDate: time => {
          let beginDateVal = this.dataForm.planStartTime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      rules: {
        name: [
          { required: true, message: this.$t('请输入项目名称'), trigger: 'blur' }
        ],
        level: [
          { required: true, message: this.$t('请选择项目级别'), trigger: 'blur' }
        ],
        category: [
          { required: true, message: this.$t('请选择项目范围'), trigger: 'change' }
        ],
        scope: [
          { required: true, message: this.$t('请选择项目类别'), trigger: 'blur' }
        ],
        // pop: [
        //   { required: true, message: this.$t('请选择项目经理'), trigger: 'blur' }
        // ],
        planStartTime: [
          { required: true, message: this.$t('请选择开始时间'), trigger: 'change' }
        ],
        planEndTime: [
          { required: false, message: this.$t('请选择结束时间'), trigger: 'change' }
        ]
        // institutions: [
        //   { required: true, message: this.$t('请选择归属机构'), trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    // 生命周期
  },
  watch: {
    'dataForm.category': function (newVal, oldVal) {
      if (newVal === '0') {
        this.rules.planEndTime[0].required = true
      } else {
        this.rules.planEndTime[0].required = false
      }
    },
    'dataForm.organizationId': function (newVal, oldVal) {
      this.getprojectmanages(newVal)
    }
  },
  methods: {
    // 表单验证
    submitForm (formName) {
      this.dataForm.source = '0'
      this.dataForm.projectStatus = '1'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 深拷贝数据
          var dataFormdist = {}
          dataFormdist = JSON.parse(JSON.stringify(this.dataForm))
          dataFormdist.managerId = Number(dataFormdist.managerId)
          if (this.currentRow) {
            dataFormdist.type = this.currentRow.projectType
            dataFormdist.parentId = this.currentRow.projectId
            dataFormdist.parentUuid = this.currentRow.projectUuidz
          }
          dataFormdist.organizationId = parseFloat(dataFormdist.organizationId)
          // 表单提交
          this.$http.post('/ctc/project/base/project/one', dataFormdist).then(({ data: res }) => {
            this.dataForm.projectUuid = res.data
            this.dataForm.projectId = res.data1
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.$emit('refreshDataList')
              }
            })
            this.$emit('giveDataForm', this.dataForm)
          }).catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上一步
    twoPrevious () {
      this.$emit('toPre', this.dataForm)
    },
    // 保存设置
    saveSubmit () {
      this.$emit('visible', true)
      // this.$parent.toGiveForm()
    },
    // 获取信息
    // 请求项目经理
    // deptID  选择的归属机构参数  sys/project/select/manager/{deptId}
    getprojectmanages (deptId) {
      this.$http.get(`/sys/dept/managers?deptId=${deptId}`).then(({ data: res }) => {
        this.projectmanages = [
          ...res
        ]
      }).catch(() => {})
    },
    // 请求归属机构
    getinstitutions () {
      this.$http.get(`/sys/dept/userdept`).then(({ data: res }) => {
        this.institutionsArr = [
          ...res
        ]
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.post('/ctc/project/base/project/one', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  },
  mounted () {
    this.getinstitutions()
  },
  activated () {
    this.getinstitutions()
  }
}
</script>
