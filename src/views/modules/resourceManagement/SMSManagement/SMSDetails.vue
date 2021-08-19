<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
<!--            {{dataForm}}-->
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="平台：" prop="platform">
                        <ctc-select disabled v-model="dataForm.platform" dict-type="platform" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="类型：" prop="smsType">
                        <ctc-select disabled v-model="dataForm.smsType" dict-type="smsType" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="发送号码：" prop="number">
                        <el-input disabled v-model="dataForm.number" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="发送省份：" prop="sendProvince">
                      <ctc-province-team disabled v-model="dataForm.sendProvince" :level="'1'" :placeholder="'请选择'"></ctc-province-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="接收号码：" prop="receive">
                        <el-input disabled v-model="dataForm.receive" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="接收省份：" prop="receiveProvince">
                      <ctc-province-team disabled v-model="dataForm.receiveProvince" :level="'1'" :placeholder="'请选择'"></ctc-province-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="短信内容：" prop="content">
                        <el-input disabled type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.content"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
<!--        <div align="center">-->
<!--            <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>-->
<!--            <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>-->
<!--        </div>-->
    </el-card>
</template>

<script>
export default {
  name: 'numberAddition',
  data () {
    return {
      dataForm: {
        platform: '',
        smsType: '',
        number: '',
        sendProvince: '',
        receive: '',
        receiveProvince: '',
        content: ''
      },
      dataRule: {}
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    let thisvm = this
    if (this.selectData) {
      Object.keys(thisvm.selectData).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (thisvm.selectData[key] === null) {
              thisvm.dataForm[key1] = ''
            } else {
              thisvm.dataForm[key1] = thisvm.selectData[key]
            }
          }
        })
      })
    }
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
      // this.submitData()
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let accounts = []
      let { fileId, ...account } = this.dataForm
      account.orgId = this.dataForm.orgId ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : account.orgId
      accounts.push(account)
      let params = { accounts: accounts, fileId: this.dataForm.fileId }
      console.log(params)
      thisvm.$http.post('/account4a/account/add', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.$message.success('创建成功')
        this.$emit('close', 'refresh')
        console.log(res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
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
</style>
