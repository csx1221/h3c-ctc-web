 <template>
  <el-dialog
    :visible.sync="innerVisible"
    :title="assessment?$t('assessment'):$t('workload')"
    :close-on-click-modal="false"
    @close="handleDialogClose"
    width="60%"
    class="defect-add-or-update"
  >
    <el-row>
      <el-col :span="24" style="padding-right:15px;">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="需求名称：" prop="name">
                <span>{{dataForm.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="assessment">
              <el-form-item
                prop="nextDealUser"
                label="选择评估人："
                :rules="{required: true,message: '请选择', trigger: 'blur'}"
              >
                <el-select
                  v-model="dataForm.nextDealUser"
                  placeholder="请选择"
                  multiple
                  style="width:100%"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-else>
              <el-col :span="12">
                <el-form-item
                  prop="workload"
                  label="预估工作量："
                  :rules="{required: true,validator: validator}"
                >
                  <el-input v-model="dataForm.workload" placeholder="xx人天" clearable>
                    <template slot="append">人天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="plannedCompletionTime"
                  label="计划上线日期："
                  :rules="{required: true,message: '请选择', trigger: 'change'}"
                >
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="dataForm.plannedCompletionTime"
                    :picker-options="pickerOptions"
                    clearable
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="completeWorkload"
                  label="已发生工作量："
                  :rules="[{ validator: validator1}]"
                >
                  <el-input v-model="dataForm.completeWorkload" placeholder="xx人天" clearable>
                    <template slot="append">人天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="cosmis" label="cosmic工作量：" :rules="[{ validator: validator1}]">
                  <el-input v-model="dataForm.cosmis" placeholder="xx人天" clearable>
                    <template slot="append">人天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="nextDealUserName"
                  label="下一步处理人："
                  :rules="{required: true,message: '请输入', trigger: 'blur'}"
                >
                  <el-input v-model="dataForm.nextDealUserName" placeholder="请输入" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
            <el-col :span="24">
              <el-form-item prop="remarks" label="备注：">
                <el-input v-model="dataForm.remarks" placeholder="请输入" :rows="2" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align:right;">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import Cookies from 'js-cookie'
import mixin from '../../../../mixins/process-module'
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
      assessment: true, // 判断是选择评估人还是工作量评估
      dataForm: {
        demandId: '',
        name: '',
        remarks: '',
        workload: '',
        cosmis: '',
        attachementId: '',
        demandDescribe: '',
        completeWorkload: '',
        nextDealUserName: '',
        nextDealUser: '',
        plannedCompletionTime: ''
      },
      options: [],
      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  watch: {},
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      if (this.assessment) {
        this.getNextDealUser(
          `/sys/user/getUserInfoByParams?sectionId=${this.$store.state.sectionId}`,
          1
        )
      } else {
        this.getNextDealUser(
          `/sys/user/getUserInfoByParams?sectionId=${this.$store.state.sectionId}&userDuty=项目总监`,
          2
        )
      }
    },
    validator (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入'))
      } else if (/[^0-9]/g.test(value)) {
        callback(new Error('只能输入正整数'))
      } else {
        callback()
      }
    },
    validator1 (rule, value, callback) {
      if (value !== '') {
        if (/[^0-9]/g.test(value)) {
          callback(new Error('只能输入正整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    handleDialogClose () {
      this.$refs.dataForm.resetFields()
      this.innerVisible = false
    },
    // 根据科室，职位查询下一步处理人
    getNextDealUser (url, v) {
      let arr = []
      this.$http
        .get(url)
        .then(({ data: res }) => {
          if (res.code === 0) {
            if (v == 1) { //eslint-disable-line
              res.data.map(item => {
                if (item.userDuty !== '项目总监') {
                  arr.push({ value: item.id, label: item.realName })
                }
              })
              this.options = arr
            } else {
              this.dataForm.nextDealUserName = res.data[0].realName
              this.dataForm.nextDealUser = res.data[0].id
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {})
    },
    handleConfirm () {
      this.$refs['dataForm'].validate(
        valid => {
          if (valid) {
            this.$ctcLoading.open()
            let params = { ...this.dataForm }
            if (this.assessment) {
              params.demandDealInfoDTO = {
                demandId: params.demandId,
                handler: Cookies.get('id'),
                dealTime: this.$moment().format('yyyy-MM-DD HH:mm:ss'),
                nextDealUser: params.nextDealUser.join(','),
                opinion: params.remarks,
                result: '已评估',
                stateId: 4
              }
              params.stateId = 4
              delete params.workload
              delete params.cosmis
              delete params.nextDealUser
              delete params.nextDealUserName
              delete params.completeWorkload
              delete params.plannedCompletionTime
              this.$http
                .post('/ctc/demand/saveEvaluationHistory', params)
                .then(({ data: res }) => {
                  this.$ctcLoading.close()
                  if (res.code === 0) {
                    this.$message({
                      message: this.$t('prompt.success'),
                      type: 'success',
                      duration: 500,
                      onClose: () => {
                        this.$emit('watchChildPage')
                        this.handleDialogClose()
                      }
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  this.$ctcLoading.close()
                  this.handleDialogClose()
                })
            } else {
              params.plannedCompletionTime = this.$moment(
                params.plannedCompletionTime
              ).format('yyyy-MM-DD HH:mm:ss')
              params.dealTime = this.$moment().format(
                'yyyy-MM-DD HH:mm:ss'
              )
              params.handler = Cookies.get('id')
              params.developmentStatusId = 4
              params.stateId = 4
              params.completeWorkload = Number(params.completeWorkload)
              params.workload = Number(params.workload)
              params.cosmis = Number(params.cosmis)
              params.result = `预估${params.workload}人天,计划${this.$moment(
                params.plannedCompletionTime
              ).format('yyyy-MM-DD')}上线`
              delete params.demandDescribe
              delete params.nextDealUserName
              delete params.attachementId
              this.$http
                .post('/ctc/demand/saveAssessment', params)
                .then(({ data: res }) => {
                  this.$ctcLoading.close()
                  if (res.code !== 0) {
                    return this.$message.error(res.msg)
                  }
                  this.$message({
                    message: this.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                      this.$emit('watchChildPage')
                      this.handleDialogClose()
                    }
                  })
                })
                .catch(() => {
                  this.$ctcLoading.close()
                  this.handleDialogClose()
                })
            }
          }
        },
        1000,
        { leading: true, trailing: false }
      )
    }
  }
}
</script>
<style lang="scss">
.defect-add-or-update {
  .el-form-item__content .el-input-group--append {
    width: 100% !important;
  }
  .el-form-item__content .el-date-editor--date {
    width: 100% !important;
  }
  .el-cascader {
    display: block;
  }
}
</style>
