<template>
    <div class="downTable">
        <span class="projectGroupAdd" v-if="!showName"><el-button @click="openDialog" type="text" size="small" v-html="'点此新增'"></el-button></span>
        <el-input v-else v-model="showName" :placeholder="placeholder" readonly>
            <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
        </el-input>
        <el-dialog :visible.sync="visible" width="55%" :modal="false" title="4A部门/项目组新增" :close-on-click-modal="false" :close-on-press-escape="false">
<!--            {{dataForm}}-->
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="新增类型：" prop="type">
                        <el-radio-group v-model="dataForm.type">
                            <el-radio :label="'0'">添加部门和项目组</el-radio>
                            <el-radio :label="'2'">添加项目组</el-radio>
                            <el-radio :label="'1'">添加部门</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <template v-if="dataForm.type==='0'">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="部门名称：" prop="parentName">
                            <el-input v-model="dataForm.parentName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="部门描述：" prop="parentDesc">
                            <el-input v-model="dataForm.parentDesc" placeholder="请输入" :rows="5" type="textarea" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="项目组名称：" prop="orgName">
                            <el-input v-model="dataForm.orgName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="项目组描述：" prop="orgDesc">
                            <el-input v-model="dataForm.orgDesc" placeholder="请输入" :rows="5" type="textarea" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </template>
                <template v-if="dataForm.type==='2'">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="部门名称：" prop="parentId">
                            <ctc-project-team v-model="dataForm.parentId" :props="{lv:'1'}" backName :organName.sync="dataForm.parentName"></ctc-project-team>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="项目组名称：" prop="orgName">
                            <el-input v-model="dataForm.orgName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="项目组描述：" prop="orgDesc">
                            <el-input v-model="dataForm.orgDesc" placeholder="请输入" :rows="5" type="textarea" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </template>
                <template v-if="dataForm.type==='1'">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="部门名称：" prop="parentName">
                            <el-input v-model="dataForm.parentName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="部门描述：" prop="parentDesc">
                            <el-input v-model="dataForm.parentDesc" placeholder="请输入" :rows="5" type="textarea" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </template>
            </el-form>
            <div align="center">
                <el-button type="primary" size="small" @click="clearOrgInfo">清空</el-button>
                <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import ctcUtils from '@/utils/ctc-utils.js'
// import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'projectGroupAdd',
  data () {
    return {
      visible: false,
      showName: '',
      dataForm: {
        type: '0',
        orgName: '',
        orgDesc: '',
        parentName: '',
        parentId: '',
        parentDesc: ''
      }
    }
  },
  watch: {
    // 申请类型
    'dataForm.type' (newVal, oldVal) {
      console.log(newVal)
      this.dataForm.orgName = ''
      this.dataForm.orgDesc = ''
      this.dataForm.parentName = ''
      this.dataForm.parentId = ''
      this.dataForm.parentDesc = ''

      this.$refs['dataForm'].clearValidate(['orgName'])
      this.$refs['dataForm'].clearValidate(['parentName'])
      this.$refs['dataForm'].clearValidate(['parentId'])
    }
  },
  computed: {
    dataRule () {
      return {
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        orgName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    value: [Object, String],
    placeholder: String,
    disabled: Boolean
  },
  methods: {
    openDialog () {
      this.visible = true
    },
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          thisvm.submitData()
        } else {
          return false
        }
      })
    },
    submitData (val) {
      let dataForm = JSON.parse(JSON.stringify(this.dataForm))
      dataForm.parentId = Array.isArray(this.dataForm.parentId) ? this.dataForm.parentId[this.dataForm.parentId.length - 1] : dataForm.parentId
      this.$emit('input', dataForm)
      let name = ''
      if (this.dataForm.orgName) {
        name = 'H3C/' + this.dataForm.parentName + '/' + this.dataForm.orgName
      } else {
        name = 'H3C/' + this.dataForm.parentName
      }
      this.showName = name
      this.visible = false
    },
    clearOrgInfo () {
      this.$emit('input', '')
      this.showName = ''
      this.$refs.dataForm.resetFields()
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
    .downTable {
        .el-dialog__header {
            text-align: left;
        }
    }
        .el-form-item {
        margin-bottom: 22px;
    }
    .projectGroupAdd{
        position: absolute;
        top: 30px;
    }
</style>
<style lang="scss">
    .is-error .projectGroupAdd{
        position: absolute;
        top: 50px;
    }
</style>
