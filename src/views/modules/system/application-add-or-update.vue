<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :inline="false" label-position="right" label-width="120px">
      <el-form-item prop="name" label="应用名称">
        <el-input v-model="dataForm.name" :placeholder="$t('params.paramCode')"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="应用编码">
        <el-input :disabled="!!dataForm.id" v-model="dataForm.code" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="defaultUrl" label="内网地址">
        <el-input v-model="dataForm.defaultUrl" placeholder="请输入内网地址"></el-input>
      </el-form-item>
      <el-form-item prop="outerUrl" label="外网地址">
        <el-input v-model="dataForm.outerUrl" placeholder="请输入外网地址"></el-input>
      </el-form-item>
      <el-form-item prop="accessToken" label="安全登陆码">
        <el-input :disabled="true" v-model="dataForm.accessToken"></el-input>
        <el-button :disabled="!!dataForm.id" @click.prevent="removeDomain()">随机生成</el-button>
      </el-form-item>
      <el-form-item prop="autoFlag" label="自动化">
        <el-select v-model="dataForm.autoFlag" placeholder="请选择自动化状态">
          <el-option label="禁用" value='0'></el-option>
          <el-option label="手工用例" value='1'></el-option>
          <el-option label="自动化用例" value='2'></el-option>
          <el-option label="手自一体用例" value='3'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="smsFlag" label="发送短信">
        <el-radio v-model="dataForm.smsFlag" label="0">否</el-radio>
        <el-radio v-model="dataForm.smsFlag" label="1">是</el-radio>
      </el-form-item>
      <el-form-item prop="status" label="应用状态">
        <el-radio v-model="dataForm.status" label="0">启动</el-radio>
        <el-radio v-model="dataForm.status" label="1">禁用</el-radio>
      </el-form-item>
      <el-form-item prop="comments" label="备注">
        <el-input v-model="dataForm.comments" :placeholder="$t('params.remark')" rows="4" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        applicationId: '',
        name: '',
        defaultUrl: '',
        outerUrl: '',
        code: '',
        accessToken: '',
        comments: '',
        orderNumber: '',
        smsFlag: '0',
        status: '0',
        autoFlag: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        defaultUrl: [
          { required: true, message: '请输入内网地址', trigger: 'blur' }
        ],
        outerUrl: [
          { required: true, message: '请输入外网地址', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入应用编码', trigger: 'blur' }
        ],
        accessToken: [
          { required: true, message: '请输入/生成安全登陆码', trigger: 'blur' }
        ],
        autoFlag: [
          { required: true, message: '请选择是否自动化', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 缺少随机生成数组
    removeDomain () {
      var str = ''
      var char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < 32; i++) {
        str += char[Math.floor(Math.random() * 35)]
      }
      this.dataForm.accessToken = str
    },
    init () {
      this.dataForm.applicationId = ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/subadmin/application/detail/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        res.data.smsFlag = (res.data.smsFlag || '0') + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataForm.autoFlag = this.dataForm.autoFlag.toString()
        console.log(this.dataForm.autoFlag)
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.status = Number(this.dataForm.status)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/subadmin/application', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
