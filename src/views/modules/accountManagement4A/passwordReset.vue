<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-row>
      <div class="isTips">
<!--        <span>备注说明:</span>-->
<!--        <span>1、是否已有主账号为"否"时，申请4A主账号及云测试平台从账号</span>-->
<!--        <span>2、是否已有主账号为"是"时，申请云测试平台从账号；</span>-->
      </div>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span></el-divider>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="主账号用户账号：" prop="loginName">
            <el-input v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="身份证号：" prop="cardValue">
            <el-input v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div align="center">
      <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
      <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
    </div>
  </el-card>
</template>

<script>
import { isIDCard } from '@/utils/validate'
export default {
  name: 'passwordReset',
  components: {},
  props: {
    selectData: [Object, String]
  },
  data () {
    let validateID = (rule, value, callback) => {
      if (!isIDCard(value)) {
        return callback(new Error(this.$t('validate.format', { 'attr': '身份证号码' })))
      }
      callback()
    }
    return {
      isHasOrgId: false,
      organId: '',
      dataForm: {
        loginName: '',
        name: '',
        cardValue: ''
      },
      dataRule: {
        loginName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        cardValue: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      console.log(params)
      thisvm.$http.post('/account4a/home/register/acct/reset/pass', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        if (res.data) {
          this.open(res.data)
        } else {
          this.$message.success('提交成功，待审批')
        }
        this.$emit('close', 'refresh')
        console.log(res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    open (msg) {
      this.$alert(msg, '提交成功，待审批', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.accStyle{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
}
.isTips{
  color: red;
  span{
    display: block;
  }
}
</style>
