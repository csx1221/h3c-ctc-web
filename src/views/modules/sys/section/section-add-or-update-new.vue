<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="organizeId" label="所属机构" class="dept-list">
        <ctc-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构" :organizeId.sync="echoDataForm.organizeId"></ctc-organize-table>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门" class="dept-list">
        <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择所属部门" :deptId.sync="echoDataForm.deptId" :organizeId.sync="dataForm.organizeId"></ctc-dept-table>
      </el-form-item>
      <el-form-item prop="name" :label="$t('dept.name')">
        <el-input v-model="dataForm.name" placeholder="请输入科室名称"></el-input>
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
      deptList: [],
      deptListVisible: false,
      dataForm: {
        id: '',
        name: '',
        organizeId: '',
        deptId: ''
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: '',
        deptId: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        organizeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        deptId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        let thisvm = this
        thisvm.dataForm.organizeId = ''
        thisvm.dataForm.deptId = ''
        thisvm.$refs['dataForm'].resetFields()
        thisvm.echoDataForm.organizeId = 'clear_' + Math.random()
        if (this.dataForm.id !== '' && this.dataForm.id !== undefined) {
          setTimeout(function () { thisvm.getSectionInfo(thisvm.dataForm.id) }, 400)
        }
      })
    },
    // 获取信息
    getSectionInfo (id) {
      this.$http.get(`/sys/section/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm.name = res.data.name
          this.dataForm.organizeId = res.data.organizeId
          this.dataForm.deptId = res.data.deptId

          // 回显表单数据
          this.echoDataForm.organizeId = this.dataForm.organizeId
          this.echoDataForm.deptId = this.dataForm.deptId
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/section', this.dataForm).then(({ data: res }) => {
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

<style lang="scss">
</style>
