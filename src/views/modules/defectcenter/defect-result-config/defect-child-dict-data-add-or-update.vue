<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="dictValue" label="问题类型编码">
        <el-input v-model.number="dataForm.dictValue" placeholder="请输入问题类型编码(只允许输入数值)"></el-input>
      </el-form-item>
      <el-form-item prop="dictLabel" label="问题类型名称">
        <el-input v-model="dataForm.dictLabel" placeholder="请输入问题类型名称"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="问题类型排序">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('dict.sort')"></el-input-number>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
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
        id: '',
        dictTypeId: '',
        dictLabel: '',
        dictValue: '',
        sort: 0,
        remark: ''
      },
      dataList: []
    }
  },
  watch: {
    'dataForm.dictValue' (newVal, oldVal) {
      if (newVal) {
        this.dataForm.dictValue = (newVal + '').replace(/[^\d]/g, '')
      }
    }
  },
  computed: {
    dataRule () {
      return {
        dictLabel: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
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
      this.$http.get(`/ctc/defect/defectConfInfo/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      // 校验问题类型编码是否重复
      let repeatIndex = 0
      this.dataList.forEach((item, index) => {
        if (item.dictValue === (this.dataForm.dictValue + '')) {
          repeatIndex++
        }
      })
      if (repeatIndex > 0) {
        return this.$message.warning('问题类型编码重复，请修改!')
      }
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let url = null
        let data = null
        if (this.dataForm.id) {
          data = this.dataForm
          url = '/ctc/defect/defectConfInfo/updateDefectConfInfo'
        } else {
          data = [this.dataForm]
          url = '/ctc/defect/defectConfInfo/insertDefectConfInfo'
        }
        this.$http['post'](url, data).then(({ data: res }) => {
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
