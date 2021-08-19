<template>
  <el-dialog
    :visible.sync="innerVisible"
    :title="$t('review')"
    :close-on-click-modal="false"
    width="60%"
    @close="handleDialogClose"
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
            <el-col :span="12">
              <el-form-item prop="result" label="评审结果：" :rules="{required: true}">
                <el-radio-group v-model="dataForm.result" @change="change">
                  <el-radio label="1">通过</el-radio>
                  <el-radio label="2">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="nextDealUserName"
                label="下一步处理人："
                :rules="{required: true,message: '请输入', trigger: 'blur'}"
              >
                <el-input v-model="dataForm.nextDealUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="dataForm.result==1">
              <el-form-item prop="remarks" label="备注：">
                <el-input v-model="dataForm.remarks" placeholder="请输入" :rows="2" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item
                prop="opinion"
                label="说明："
                :rules="{required: true,message: '请输入', trigger: 'blur'}"
              >
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
      dataForm: {
        name: '',
        result: '1',
        demandId: null,
        remarks: '',
        opinion: '',
        nextDealUser: '',
        nextDealUserName: '',
        attachementId: '',
        stateId: 3,
        demandDescribe: '',
        createTime: ''
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
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.getNextDealUser(this.$store.state.sectionId, '项目总监')
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
            params.demandDealInfoDTO = {
              demandId: params.demandId,
              handler: Cookies.get('id'),
              dealTime: this.$moment().format('yyyy-MM-DD HH:mm:ss'),
              nextDealUser: params.nextDealUser,
              stateId: params.stateId
            }
            if (params.result == 1) { //eslint-disable-line
              params.demandDealInfoDTO.result = '通过'
              params.demandDealInfoDTO.opinion = params.remarks
            } else {
              params.demandDealInfoDTO.result = '不通过'
              params.demandDealInfoDTO.opinion = params.opinion
            }
            delete params.result
            delete params.opinion
            delete params.remarks
            delete params.createUser
            delete params.nextDealUser
            delete params.nextDealUserName
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
          }
        },
        1000,
        { leading: true, trailing: false }
      )
    },
    // 切换单选按钮
    change (l) {
      if (l == 1) { //eslint-disable-line
        this.dataForm.stateId = 3
        this.getNextDealUser(this.$store.state.sectionId, '项目总监')
      } else {
        this.dataForm.nextDealUser = this.dataForm.createUser
        this.dataForm.nextDealUserName = this.dataForm.createUserName
        this.dataForm.stateId = 6
      }
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
