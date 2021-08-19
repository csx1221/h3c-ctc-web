<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24">
                    <el-form-item label="清理周期（天）：" prop="cleanUpDay">
                        <ctc-select v-model="dataForm.cleanUpDay" dict-type="cleanUpDay" placeholder="请选择"></ctc-select>
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
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
export default {
  name: 'numberAddition',
  components: {
    CtcProjectOrganizeTable
  },
  data () {
    return {
      dataForm: {
        cleanUpDay: ''
      },
      dataRule: {
        cleanUpDay: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    selectData: Array,
    operationType: String
  },
  computed: {},
  mounted () {
    // let thisvm = this
    // if (this.selectData) {
    //   Object.keys(thisvm.selectData).forEach(function (key) {
    //     Object.keys(thisvm.dataForm).forEach(function (key1) {
    //       if (key === key1) {
    //         if (thisvm.selectData[key] === null) {
    //           thisvm.dataForm[key1] = ''
    //         } else {
    //           thisvm.dataForm[key1] = thisvm.selectData[key]
    //         }
    //       }
    //     })
    //   })
    // }
    if (this.operationType === '1') {
      this.getCleanDay()
    }
  },
  methods: {
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.operationType === '1') {
            this.submitData()
          } else {
            this.submitDataList()
          }
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
      let params = { ...this.dataForm, number: thisvm.selectData[0] }
      console.log(params)
      thisvm.$http.post('/ctc/resource/sms/clean/saveSetting', params).then(({ data: res }) => {
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
    },
    submitDataList () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm, numbers: thisvm.selectData }
      console.log(params)
      thisvm.$http.post('/ctc/resource/sms/clean/saveBatchSetting', params).then(({ data: res }) => {
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
    },
    getCleanDay () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      thisvm.$http.get('/ctc/resource/sms/clean/setting?number=' + thisvm.selectData[0]).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.dataForm.cleanUpDay = res.data.cleanUpDay
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
