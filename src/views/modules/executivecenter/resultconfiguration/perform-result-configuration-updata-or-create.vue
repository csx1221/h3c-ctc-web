<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form class="main_el_form" label-position="right" :rules="rules" ref="dataForm" :model="dataForm" label-width="120px">
        <el-row>
          <el-form-item label="权限级别" prop="authLevel">
            <ctc-select v-model="dataForm.authLevel" dict-type="permissionLevel" placeholder="请选择" disabled></ctc-select>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <ctc-project-info-table v-model="dataForm.projectId" :projectId="dataForm.projectId" placeholder="请选择项目"></ctc-project-info-table>
          </el-form-item>
          <el-form-item label="执行结果" prop="resultType">
            <div class="el-input__inner" style="height: auto;">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="dataForm.resultType" @change="handleCheckedCitiesChange">
                <el-checkbox style="width: 100px" v-for="city in cities" :label="city.dictValue" :key="city.dictValue">{{city.dictLabel}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('dataForm')">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDictDataList } from '@/utils'
export default {
  name: 'perform-result-configuration-updata-or-create',
  data () {
    return {
      title: '',
      dialogVisible: false,
      dataForm: {
        authLevel: '1',
        // parentProjectId: '',
        projectId: '',
        resultType: []
      },
      rules: {
        authLevel: [
          { required: true, message: '请选择权限级别', trigger: 'change' }
        ],
        parentProjectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        resultType: [
          { type: 'array', required: true, message: '请至少选择一个执行结果', trigger: 'change' }
        ]
      },
      checkAll: false,
      cities: getDictDataList('resultDetermination'),
      isIndeterminate: false,
      type: ''
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (type, row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.type = type
        this.title = type === 'create' ? '创建配置' : '修改配置'
        if (row !== undefined) {
          this.dataForm.authLevel = row.authLevel
          this.dataForm.projectId = row.projectId
          // if (row.authLevel === 2) {
          //   this.dataForm.parentProjectId = row.parentProjectId
          //   this.dataForm.projectId = row.projectId
          // } else {
          //   this.dataForm.parentProjectId = row.projectId
          // }
          let types = []
          for (let i = 0; i < row.resultIds.length; i++) {
            types.push(row.resultIds[i].toString())
          }
          if (row.resultIds.length === this.cities.length) {
            this.checkAll = true
          } else {
            this.isIndeterminate = true
          }
          this.dataForm.resultType = types
          this.dataForm.configId = row.configId
        }
      })
    },
    handleCheckAllChange (val) {
      let arrChecked = []
      for (let i = 0; i < this.cities.length; i++) {
        arrChecked.push(
          this.cities[i].dictValue
        )
      }
      this.dataForm.resultType = val ? arrChecked : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addForm()
        } else {
          return false
        }
      })
    },
    addForm () {
      this.$ctcLoading.open()
      this.$http.post('/ctc/exec/result_config/add', this.dataForm).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.dialogVisible = false
            this.$emit('refresh')
          }
        })
      }).catch(() => {
        this.$ctcLoading.close()
      })
    }
  }
}
</script>
<style lang="scss">
.main_el_form {
  .el-form-item__content .el-input-group--append {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.main_el_form {
  .el-select {
    width: 100%;
  }
}
</style>
