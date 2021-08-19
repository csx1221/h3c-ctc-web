<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-row>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span></el-divider>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-col v-if="lockState===1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="锁定平台：" prop="lockPlatform">
            <ctc-select v-model="dataForm.lockPlatform" dict-type="platform" placeholder="请选择"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col v-if="lockState===1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="锁定时间：" prop="time">
            <el-date-picker
                v-model="dataForm.time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div align="center">
      <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
      <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'numberLockBatch',
  data () {
    return {
      dataForm: {
        lockPlatform: '',
        time: '',
        remarks: ''
      },
      dataRule: {
        lockPlatform: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      // eslint-disable-next-line
      pickerOptions: { //当日之前日期不可选择
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  props: {
    selectData: Array,
    lockState: Number
  },
  computed: {},
  mounted () {},
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
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      params.number = this.selectData
      params.lockState = this.lockState
      if (this.dataForm.time) {
        params.lockTime = this.dataForm.time[0]
        params.lockEndTime = this.dataForm.time[1]
        delete params.time
      }
      thisvm.$http.post('/ctc/resource/lock/manager/batch/lock', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.$message.success('设置成功')
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
