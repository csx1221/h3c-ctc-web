<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="150px">
      <el-form-item prop="userType" label="账号类型">
        <el-select v-model="dataForm.userType" placeholder="请选择账号类型" style="width:100%;" @change="userTypeChange">
          <el-option v-for="(item,index) in userTypeData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构/部门/科室" prop="userInfo">
        <el-cascader v-model="dataForm.userInfo" :options="userInfoOptions" :props="{checkStrictly:true }" :key="isResouceUserInfo" clearable filterable @change="userInfoChange" :disabled="(dataForm.userType || '')==''"></el-cascader>
      </el-form-item>
      <el-form-item label="服务机构/部门/科室" prop="serviceList">
        <el-cascader v-model="dataForm.serviceList" :options="serviceListOptions" :props="{checkStrictly:true }" :key="isResouceServiceList" clearable filterable :disabled="(dataForm.userType || '')==''"></el-cascader>
      </el-form-item>
      <el-form-item prop="username" :label="$t('user.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('user.username')"></el-input>
      </el-form-item>
      <el-form-item prop="realName" :label="$t('user.realName')">
        <el-input v-model="dataForm.realName" :placeholder="$t('user.realName')"></el-input>
      </el-form-item>
      <el-form-item prop="gender" :label="$t('user.gender')">
        <ctc-radio-group v-model="dataForm.gender" dict-type="gender"></ctc-radio-group>
      </el-form-item>
      <el-form-item prop="email" :label="$t('user.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('user.email')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('user.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('user.mobile')"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.organizeId!='' && dataForm.organizeId!='0'" prop="roleIdList" :label="$t('user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple value-key="id" :placeholder="$t('user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userDuty" label="用户岗位" class="role-list">
        <el-input v-model="dataForm.userDuty" placeholder="请输入用户岗位"></el-input>
      </el-form-item>
      <el-form-item prop="status" :label="$t('user.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t('user.status0') }}</el-radio>
          <el-radio :label="1">{{ $t('user.status1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" size="small" :disabled="confirmBtn" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { isEmail, isMobile } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: '',
        userType: '',
        organizeId: '',
        organizeType: '',
        deptId: '',
        username: '',
        sectionId: '',
        realName: '',
        gender: 0,
        email: '',
        mobile: '',
        userDuty: '',
        roleIdList: [],
        status: 1,
        userInfo: [],
        serviceList: []
      },
      isResouceUserInfo: 0,
      isResouceServiceList: 0,
      userInfoOptions: [],
      serviceListOptions: [],
      organizeTreeMap: {},
      userTypeData: this.$getDictDataList('userType'),
      confirmBtn: false
    }
  },
  watch: {
  },
  computed: {
    dataRule () {
      return {
        userType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        realName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        roleIdList: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        email: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ],
        userInfo: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ],
        serviceList: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      let thisvm = this
      thisvm.visible = true
      thisvm.$nextTick(() => {
        thisvm.$refs['dataForm'].resetFields()
        thisvm.confirmBtn = false
        thisvm.roleIdList = []
        thisvm.organizeTreeMap = {}
        // 修改回显
        if (thisvm.dataForm.id) {
          thisvm.getInfo()
        }
      })
    },
    validatorOperateLog (rule, value, callback) {
      let thisvm = this
      if (!value || value.length === 0) {
        return callback(new Error(thisvm.$t('validate.required')))
      }
      if (rule.field === 'email') {
        if (!isEmail(value)) {
          return callback(new Error(thisvm.$t('validate.format', { 'attr': thisvm.$t('user.email') })))
        }
      } else if (rule.field === 'mobile') {
        if (!isMobile(value)) {
          return callback(new Error(thisvm.$t('validate.format', { 'attr': thisvm.$t('user.mobile') })))
        }
      } else if (rule.field === 'userInfo') {
        let organizeId = value[0]
        let organizeItem = thisvm.organizeTreeMap[organizeId] || {}
        let organizeType = organizeItem.organizeType
        if ([0].includes(organizeType)) {
          if (value.length !== 3) {
            return callback(new Error('机构、部门、科室必须选择'))
          }
        } else if ([1, 2].includes(organizeType)) {
          if (value.length < 2) {
            return callback(new Error('机构、部门必须选择'))
          }
        } else if ([3, 5].includes(organizeType)) {
          if (value.length < 1) {
            return callback(new Error('机构必须选择'))
          }
        }
      } else if (rule.field === 'serviceList') {
        let serviceList = thisvm.dataForm.serviceList
        serviceList.forEach((item, index) => {
          let tmpValue = item
          let organizeId = tmpValue[0]
          let organizeItem = thisvm.organizeTreeMap[organizeId] || {}
          let organizeType = organizeItem.organizeType
          if ([0].includes(organizeType)) {
            if (tmpValue.length !== 3) {
              return callback(new Error('机构、部门、科室必须选择'))
            }
          } else if ([1, 2].includes(organizeType)) {
            if (tmpValue.length < 2) {
              return callback(new Error('机构、部门必须选择'))
            }
          } else if ([3, 5].includes(organizeType)) {
            if (value.length < 1) {
              return callback(new Error('机构必须选择'))
            }
          }
        })
      }
      callback()
    },
    userTypeChange (value) {
      ++this.isResouceUserInfo
      ++this.isResouceServiceList
      this.dataForm.userInfo = []
      this.dataForm.serviceList = []
      this.getOrganizeCascader()
    },
    userInfoChange (value) {
      let thisvm = this
      if (value.length > 0) {
        let organizeId = value[0]
        let organizeItem = thisvm.organizeTreeMap[organizeId]
        if (organizeItem) {
          thisvm.dataForm.organizeId = organizeId
          thisvm.dataForm.organizeType = organizeItem.organizeType
          thisvm.dataForm.roleIdList = []
          // 账号类型为“局方”，当所属机构/部门/科室选择完毕后，需将已选择的所属机构/部门/科室自动显示在服务机构/部门/科室显示框内，作为默认值，不允许修改
          if (thisvm.dataForm.userType === '1') {
            thisvm.dataForm.serviceList = []
            thisvm.dataForm.serviceList = thisvm.dataForm.userInfo
          }
          thisvm.getRoleList()
        }
      }
    },
    serviceListChange (data) {
    },
    // 所属机构部门科室
    getOrganizeCascader () {
      let thisvm = this
      if (thisvm.dataForm.userType) {
        let params = {}
        // 1局方 2厂商
        params.userType = thisvm.dataForm.userType
        // 所属机构部门科室;2服务机构部门科室
        params.nodeMode = 1
        thisvm.executeOrganizeTree(params, function (data) {
          thisvm.userInfoOptions = data
        })
        // 所属机构部门科室;2服务机构部门科室
        params.nodeMode = 2
        thisvm.executeOrganizeTree(params, function (data) {
          thisvm.serviceListOptions = data
        })
      }
    },
    executeOrganizeTree (params, callback) {
      let thisvm = this
      let tparams = Object.assign({}, params)
      thisvm.$http.post('/sys/organize/getOrganizeTree', tparams).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let newData = res.data
        newData.forEach((item, index) => {
          if (item.type === 1) {
            thisvm.organizeTreeMap[item.value] = item
          }
        })
        callback && callback(newData)
      }).catch(() => {
      })
    },
    // 获取角色列表
    getRoleList () {
      let params = {}
      if (this.dataForm.organizeId !== '' && this.dataForm.organizeId !== '0') {
        params.organizeId = this.dataForm.organizeId || ''
        params.deptId = this.dataForm.deptId || ''
        params.userId = this.dataForm.id || ''
        return this.$http.get('/sys/role/list', { params: params }).then(({ data: res }) => {
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
        thisvm.dataForm.userType = (thisvm.dataForm.userType || '1') + ''
        // 所属机构
        if (thisvm.dataForm.sectionId) {
          thisvm.dataForm.userInfo = [thisvm.dataForm.organizeId, thisvm.dataForm.deptId, thisvm.dataForm.sectionId]
        } else if (thisvm.dataForm.deptId) {
          thisvm.dataForm.userInfo = [thisvm.dataForm.organizeId, thisvm.dataForm.deptId]
        } else {
          thisvm.dataForm.userInfo = [thisvm.dataForm.organizeId]
        }
        // 服务机构
        if (thisvm.dataForm.serviceSectionId) {
          thisvm.dataForm.serviceList = [thisvm.dataForm.serviceOrganizeId, thisvm.dataForm.serviceDeptId, thisvm.dataForm.serviceSectionId]
        } else if (thisvm.dataForm.serviceDeptId) {
          thisvm.dataForm.serviceList = [thisvm.dataForm.serviceOrganizeId, thisvm.dataForm.serviceDeptId]
        } else {
          thisvm.dataForm.serviceList = [thisvm.dataForm.serviceOrganizeId]
        }
        thisvm.getOrganizeCascader()
        thisvm.getRoleList()
      }).catch(() => { })
    },
    notifyPwdInfo () {
      if (!this.dataForm.id) {
        // 默认密码提示
        this.$notify({
          title: '操作提示',
          message: '你刚创建用户默认密码是：JZH!#2021mima',
          duration: 0
        })
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        thisvm.confirmBtn = true
        let params = Object.assign({}, thisvm.dataForm)
        // 所属机构
        let userInfo = params.userInfo
        if (userInfo.length === 3) {
          params.organizeId = userInfo[0]
          params.deptId = userInfo[1]
          params.sectionId = userInfo[2]
        } else if (userInfo.length === 2) {
          params.organizeId = userInfo[0]
          params.deptId = userInfo[1]
        } else {
          params.organizeId = userInfo[0]
        }
        // 服务机构
        let serviceList = params.serviceList
        if (serviceList.length === 3) {
          params.serviceOrganizeId = serviceList[0]
          params.serviceDeptId = serviceList[1]
          params.serviceSectionId = serviceList[2]
        } else if (serviceList.length === 2) {
          params.serviceOrganizeId = serviceList[0]
          params.serviceDeptId = serviceList[1]
        } else {
          params.serviceOrganizeId = serviceList[0]
        }
        thisvm.$http[!this.dataForm.id ? 'post' : 'put']('/sys/user', params).then(({ data: res }) => {
          thisvm.confirmBtn = false
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          thisvm.$message({
            message: thisvm.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              thisvm.visible = false
              // 触发提示
              thisvm.notifyPwdInfo()
              thisvm.$emit('refreshDataList')
            }
          })
        }).catch(() => {
          thisvm.confirmBtn = false
        })
      })
    }, 3000, { 'leading': true, 'trailing': false })
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
