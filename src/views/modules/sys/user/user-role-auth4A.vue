<template>
  <el-dialog :visible.sync="visible" title="角色赋权" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="organizeId" label="所属机构">
        <ctc-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构" :organizeId.sync="echoDataForm.organizeId" @watchChildPage="triggerParentPage" :disabled="true"></ctc-organize-table>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门">
        <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择所属部门" :deptId.sync="echoDataForm.deptId" :organizeId.sync="dataForm.organizeId"></ctc-dept-table>
      </el-form-item>
      <el-form-item prop="sectionId" label="所属科室">
        <ctc-section-table v-model="dataForm.sectionId" placeholder="请选择所属科室" :sectionId.sync="echoDataForm.sectionId" :deptId.sync="dataForm.deptId" :organizeId.sync="dataForm.organizeId"></ctc-section-table>
      </el-form-item>
      <el-form-item prop="userDuty" label="岗位名称">
        <el-input v-model="dataForm.userDuty" placeholder="请输入岗位名称"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.organizeId!='' && dataForm.organizeId!='0'" prop="roleIdList" :label="$t('user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple value-key="id" :placeholder="$t('user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role"></el-option>
        </el-select>
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
  name: 'UserRoleAuth4A',
  data () {
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: '',
        organizeId: '',
        organizeType: '',
        deptId: '',
        sectionId: '',
        userDuty: '',
        roleIdList: []
      },
      // 选择机构信息
      selectOrganize: {
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: '',
        deptId: '',
        sectionId: ''
      }
    }
  },
  watch: {
    'dataForm.organizeId': {
      handler (newName, oldName) {
        if (newName !== '') {
          this.getRoleList()
        }
      }
    },
    'dataForm.deptId': {
      handler (newName, oldName) {
        if (newName !== '') {
          this.getRoleList()
        }
      }
    }
  },
  computed: {
    dataRule () {
      return {
        organizeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        roleIdList: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm.deptId = ''
      this.$nextTick(() => {
        let thisvm = this
        thisvm.echoDataForm.organizeId = 'clear_' + Math.random()
        thisvm.echoDataForm.deptId = 'clear_' + Math.random()
        thisvm.echoDataForm.sectionId = 'clear_' + Math.random()
        thisvm.$refs['dataForm'].resetFields()
        this.roleIdList = []
        this.getRoleList()
        // 修改回显
        if (this.dataForm.id) {
          setTimeout(function () { thisvm.getInfo() }, 400)
        }
      })
    },
    triggerParentPage (message) {
      this.selectOrganize = message.data
      this.dataForm.organizeType = message.data.type
      this.dataForm.roleIdList = []
      this.getRoleList()
    },
    // 获取角色列表
    getRoleList () {
      let params = {}
      if (this.dataForm.organizeId !== '' && this.dataForm.organizeId !== '0') {
        params.organizeId = this.dataForm.organizeId || ''
        params.deptId = this.dataForm.deptId || ''
        params.userId = this.dataForm.id || ''
        return this.$http.get('/sys/role/list', {
          params: params
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.roleList = res.data
        }).catch(() => { })
      }
    },
    // 获取信息
    getInfo () {
      let thisvm = this
      thisvm.$http.get(`/sys/user/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.dataForm = { ...thisvm.dataForm, ...res.data, roleIdList: res.data.roleIdList }
        // 回显表单数据
        thisvm.echoDataForm.organizeId = thisvm.dataForm.organizeId || ''
        thisvm.echoDataForm.deptId = thisvm.dataForm.deptId || ''
        thisvm.echoDataForm.sectionId = thisvm.dataForm.sectionId || ''
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let roleIds = []
        thisvm.dataForm.roleIdList.forEach((item, index) => {
          roleIds.push(item.id)
        })
        let params = {}
        params.deptId = thisvm.dataForm.deptId
        params.sectionId = thisvm.dataForm.sectionId
        params.userDuty = thisvm.dataForm.userDuty
        params.userId = thisvm.dataForm.id
        params.roleIds = roleIds
        thisvm.$http.post('/sys/user/userRefRoleBy4A', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          thisvm.$message({
            message: thisvm.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              thisvm.visible = false
              thisvm.$emit('refreshDataList')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
.mod-sys__user {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  .el-select {
    width: 100%;
  }
}
</style>
