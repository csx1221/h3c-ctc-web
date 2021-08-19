<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="value"  v-if="!dataForm.id" label="角色名称">
        <el-select  v-model="dataForm.value" placeholder="请选择" value-key="id">
          <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="roleName" v-if="dataForm.id" label="角色名称">
        <el-input v-model="dataForm.roleName" :disabled="true" :placeholder="$t('role.name')"></el-input>
      </el-form-item>
      <el-form-item prop="roleCode" label="角色标识" >
        <el-input :disabled="inputDisabled" v-model="dataForm.roleCode"></el-input>
      </el-form-item>
      <el-form-item prop="comments" :label="$t('role.remark')">
        <el-input v-model="dataForm.comments" :placeholder="$t('role.remark')"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" :label="$t('role.menuList')">
            <el-tree
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="menuListTree"
              accordion
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
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
      inputDisabled: true,
      menuList: [],
      deptList: [],
      dataForm: {
        id: '',
        roleId: '',
        roleCode: '',
        value: {},
        sysRoleId: '',
        roleName: '',
        rolePermissionList: [],
        orderNumber: 0, // 序列号,暂时没用到
        comments: '',
        applicationId: this.$route.params.applicationId
      }
    }
  },
  watch: {
    'dataForm.value': function (newVal, oldVal) {
      if (this.dataForm.id === undefined) {
        this.inputDisabled = false
        this.dataForm.roleCode = newVal.code
        this.inputDisabled = true
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        Promise.all([
          this.getMenuList(),
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取权限列表
    getMenuList () {
      return this.$http.get(`/ctc/subadmin/permission/auths?ptype=&applicationId=${this.$route.params.applicationId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.menuList = res.data
      }).catch(() => {})
    },
    // 获取角色列表
    getDeptList () {
      return this.$http.get(`/ctc/subadmin/role/roles/${this.$route.params.applicationId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/subadmin/role/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        for (let index = 0; index < res.data.rolePermissionList.length; index++) {
          this.dataForm.rolePermissionList[index] = res.data.rolePermissionList[index].permissionId
        }
        this.dataForm.rolePermissionList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      if (this.dataForm.id === undefined) {
        this.dataForm.roleId = ''
        this.dataForm.roleName = this.dataForm.value.name
        this.dataForm.sysRoleId = this.dataForm.value.id
        this.dataForm.roleCode = this.dataForm.value.code
      }
      this.dataForm.rolePermissionList = [
        ...this.$refs.menuListTree.getCheckedKeys(),
        ...this.$refs.menuListTree.getHalfCheckedKeys()
      ]
      for (let index = 0; index < this.dataForm.rolePermissionList.length; index++) {
        var vate = {}
        vate.permissionId = this.dataForm.rolePermissionList[index]
        this.dataForm.rolePermissionList[index] = vate
      }
      this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/subadmin/role', this.dataForm).then(({ data: res }) => {
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
      }).catch(() => {})
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
