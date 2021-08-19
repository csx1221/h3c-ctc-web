<template>
  <el-dialog :visible.sync="visible" :title="!dataFormAdd.builderId ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" class="organize-add-or-update">
    <el-form :model="dataFormAdd" :rules="dataRule" ref="dataFormAdd" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="projectName" label="所属项目：">
        <el-input v-model="dataFormAdd.projectName" type="text" disabled placeholder="">
        </el-input>
      </el-form-item>
      <el-form-item prop="name" label="构件名称：">
        <el-input v-model="dataFormAdd.name" type="text" placeholder="请输入构件名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="descript" label="备注：">
        <el-input v-model="dataFormAdd.descript" type="textarea" placeholder="请输入备注...">
          <span slot="append">{{dataFormAdd.descript}}</span>
        </el-input>
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
      builderInfoData: {},
      dataFormAdd: {
        builderId: '',
        parentProjectId: '',
        projectId: '',
        projectName: '',
        name: '',
        descript: ''
      }
    }
  },
  watch: {

  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '构件名称不允许为空', trigger: 'blur' },
          { required: true, message: '构件名称不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        // this.$refs['dataFormAdd'].resetFields()
      })
      if (this.dataFormAdd.builderId) {
        this.getBuilderInfo()
      }
    },
    // 获取构件信息
    getBuilderInfo () {
      this.$http.get(`integration/builder/info/${this.dataFormAdd.builderId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.builderInfoData = res.data
          this.dataFormAdd.name = res.data.name
          this.dataFormAdd.descript = res.data.descript
          this.dataFormAdd.projectName = res.data.projectName
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataFormAdd'].validate((valid) => {
        if (!valid) {
          return false
        }
        let params = !this.dataFormAdd.builderId ? {
          name: this.dataFormAdd.name,
          projectId: this.dataFormAdd.parentProjectId ? this.dataFormAdd.parentProjectId : this.dataFormAdd.projectId,
          projectSubId: this.dataFormAdd.parentProjectId ? this.dataFormAdd.projectId : '',
          descript: this.dataFormAdd.descript
        } : {
          name: this.dataFormAdd.name,
          builderId: this.dataFormAdd.builderId,
          descript: this.dataFormAdd.descript
        }
        // 新增：post;修改：put
        this.$http[!this.dataFormAdd.builderId ? 'post' : 'put'](!this.dataFormAdd.builderId ? 'integration/builder/save' : 'integration/builder/update', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('watchChildPage')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style  lang="scss">
.organize-add-or-update {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
