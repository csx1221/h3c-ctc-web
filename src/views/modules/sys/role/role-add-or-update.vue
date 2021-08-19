<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" class="mod-sys__role">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="ifOpen" label="是否开放：">
        <ctc-select v-model="dataForm.ifOpen" dict-type="yesOrNo" placeholder="请选择是否开放"></ctc-select>
      </el-form-item>
      <el-form-item prop="code" label="角色类型：">
        <ctc-select v-model="dataForm.code" dict-type="roleType" placeholder="请选择角色类型"></ctc-select>
      </el-form-item>
      <el-form-item prop="name" label="角色名称：">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="角色备注：">
        <el-input v-model="dataForm.remark" placeholder="请输入角色备注" :rows="4" type="textarea"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" :label="$t('role.menuList')">
            <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree" :check-strictly="false" accordion show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="false">
          <el-form-item size="mini" :label="$t('role.deptList')">
            <el-tree :data="deptList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="deptListTree" :check-strictly="false" accordion show-checkbox>
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
      menuList: [],
      deptList: [],
      quoteRoleData: [],
      dataForm: {
        id: '',
        name: '',
        menuIdList: [],
        deptIdList: [],
        remark: '',
        code: '',
        ifOpen: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色类型不允许为空', trigger: 'blur' },
          { required: true, message: '角色类型不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        this.$refs.deptListTree.setCheckedKeys([])
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
    // 获取菜单列表
    getMenuList () {
      return this.$http.get('/sys/menu/select').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.menuList = res.data
      }).catch(() => { })
    },
    // 获取部门列表
    getDeptList () {
      return this.$http.get('/sys/deptnew/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => { })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/role/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
        this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList)
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.menuIdList = [
          ...this.$refs.menuListTree.getCheckedKeys(),
          ...this.$refs.menuListTree.getHalfCheckedKeys()
        ]
        this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys()
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/role', this.dataForm).then(({ data: res }) => {
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
.mod-sys__role {
  .el-select {
    width: 100%;
  }
}
</style>
