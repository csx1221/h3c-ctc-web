<template>
  <el-dialog
    :visible.sync="innerVisible"
    :title="$t('development')"
    :close-on-click-modal="false"
    @close="handleDialogClose"
    width="65%"
    class="defect-add-or-update"
  >
    <el-row>
      <el-col :span="24" style="padding-right:15px;">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="9">
              <el-form-item label="需求名称：" prop="name">
                <span>{{dataForm.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="需求来源：" prop="ascription" :rules="{required: true}">
                <span>{{dataForm.ascription}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="developmentStatusId" label="开发处理：" :rules="{required: true}">
                <el-radio-group v-model="dataForm.developmentStatusId" @change="change">
                  <el-radio label="5">开发中(默认)</el-radio>
                  <el-radio label="7">已完成</el-radio>
                  <el-radio label="9">中止开发(手动)</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="workload"
                label="预估工作量："
                :rules="[{ required: true, validator: validator}]"
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
                :rules="{required: true,message: '请选择'}"
              >
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="dataForm.plannedCompletionTime"
                  :picker-options="pickerOptions"
                  style="width: 100%;"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="completeWorkload"
                label="已发生工作量："
                :rules="[{ required: false,trigger: 'change',validator: validator1}]"
              >
                <el-input v-model="dataForm.completeWorkload" placeholder="xx人天" clearable>
                  <template slot="append">人天</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="cosmis"
                ref="cosmis"
                :label="dataForm.developmentStatusId==7?'剩余工作量：':'cosmic工作量：'"
                :rules="[{ required: dataForm.developmentStatusId==7?true:false,trigger: 'change',validator: dataForm.developmentStatusId==7?validator:validator1}]"
              >
                <el-input v-model="dataForm.cosmis" placeholder="xx人天" clearable>
                  <template slot="append">人天</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="nextDealUserName"
                label="下一步处理人："
                :rules="{required:dataForm.developmentStatusId==5?true:false,message: '请输入'}"
              >
                <el-input v-model="dataForm.nextDealUserName" :placeholder='dataForm.developmentStatusId==5?"请输入":""' disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="dataForm.developmentStatusId!=9">
              <el-form-item prop="remarks" label="备注：">
                <el-input v-model="dataForm.remarks" placeholder="请输入" :rows="2" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item prop="opinion" label="说明：" :rules="{required: true,message: '请输入'}">
                <el-input v-model="dataForm.opinion" placeholder="请输入" :rows="2" type="textarea"></el-input>
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
export default {
  name: 'DefectAddOrUpdate',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        demandId: '',
        name: '',
        developmentStatusId: '5',
        cosmis: '',
        workload: '',
        plannedCompletionTime: '',
        completeWorkload: '',
        attachementId: '',
        demandDescribe: '',
        result: '开发中',
        nextDealUser: Cookies.get('id'),
        nextDealUserName: this.$store.state.user.realName,
        remarks: '',
        opinion: '',
        ascription: ''
      },
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
      if (value != '') {   //eslint-disable-line
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
    handleConfirm () {
      this.$refs['dataForm'].validate(
        valid => {
          if (valid) {
            this.$ctcLoading.open()
            let params = { ...this.dataForm }
            params.plannedCompletionTime = this.$moment(
              params.plannedCompletionTime
            ).format('yyyy-MM-DD HH:mm:ss')
            params.dealTime = this.$moment().format(
              'yyyy-MM-DD HH:mm:ss'
            )
            if(params.developmentStatusId != 9){ //eslint-disable-line
              params.opinion = params.remarks
            }
            params.handler = Cookies.get('id')
            params.completeWorkload = Number(params.completeWorkload)
            params.workload = Number(params.workload)
            params.cosmis = Number(params.cosmis)
            params.developmentStatusId = Number(params.developmentStatusId)
            params.stateId = params.developmentStatusId
            delete params.remarks
            delete params.createUser
            delete params.createUserName
            delete params.nextDealUserName
            delete params.demandDescribe
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
        },
        1000,
        { leading: true, trailing: false }
      )
    },
    // 切换单选按钮
    change (l) {
      if (l == 7) { //eslint-disable-line
        this.dataForm.result = '开发完成'
        this.dataForm.nextDealUserName = ''
        this.dataForm.nextDealUser = ''
      } else if (l == 5) { //eslint-disable-line
        this.dataForm.result = '开发中'
        this.dataForm.nextDealUserName = this.$store.state.user.realName
        this.dataForm.nextDealUser = Cookies.get('id')
      } else {
        this.dataForm.result = '终止开发'
        this.dataForm.nextDealUserName = ''
        this.dataForm.nextDealUser = ''
      }
      this.$refs['cosmis'].resetField()
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
}
</style>
b
