<template>
  <el-dialog title="添加成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="add-member-project">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="organizeType" label="机构类型">
                <el-select v-model="dataForm.organizeType" placeholder="请选择机构类型" @change="chooseOrganizeType">
                  <el-option v-for="data in organizeTypeData" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{data.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="organizeId" label="所属机构">
                <ctc-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构" :organizeType.sync="dataForm.organizeType" :organizeId.sync="echoDataForm.organizeId"></ctc-organize-table>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:center;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="deptId" label="所属部门">
                <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择所属部门" :organizeId.sync="dataForm.organizeId" :deptId.sync="echoDataForm.deptId"></ctc-dept-table>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="sectionId" label="所属科室">
                <ctc-section-table v-model="dataForm.sectionId" placeholder="请选择所属科室" :sectionId.sync="echoDataForm.sectionId" :deptId.sync="dataForm.deptId" :organizeId.sync="dataForm.organizeId"></ctc-section-table>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="username" label="用户账号">
                <el-input v-model="dataForm.username" placeholder="请输入用户账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="realName" label="用户姓名">
                <el-input v-model="dataForm.realName" placeholder="请输入用户姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" :data="leftTableData" @select="handleSelectChange" @select-all="handleSelectAllChange" border height="295">
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column label="用户账号" prop="username" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.username || scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属角色" prop="roleCodes" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="getMemberRoles(scope.row.roleCodes)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="organizeName" label="所属机构 / 部门 / 科室" header-align="left" align="left" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.sectionName"> {{scope.row.organizeName}} / {{scope.row.deptName}} / {{scope.row.sectionName}}</span>
          <span v-else-if="scope.row.deptName"> {{scope.row.organizeName}} / {{scope.row.deptName}}</span>
          <span v-else> {{scope.row.organizeName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getLeftUserInfo" style="text-align:left;">
    </el-pagination>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        organizeType: '',
        organizeId: '',
        deptId: '',
        sectionId: '',
        username: '',
        realName: '',
        page: 1,
        limit: 5
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: '',
        deptId: '',
        sectionId: ''
      },
      platformId: '',
      leftTableData: [],
      userSelectMemberMap: {}, // 用户选择用户成员，支持跨页选择
      projectMemberDetailMap: {},
      total: 0,
      organizeTypeData: this.$getDictDataList('organizeType')
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.echoDataForm.organizeId = 'clear_' + Math.random()
        this.echoDataForm.deptId = 'clear_' + Math.random()
        this.echoDataForm.sectionId = 'clear_' + Math.random()
        this.dataForm.page = 1
        this.leftTableData = []
        this.projectMemberDetailMap = {}
        this.userSelectMemberMap = {}
        this.getMemberTableDataById()
      })
    },
    chooseOrganizeType (item) {
      this.echoDataForm.organizeId = 'clear_' + Math.random()
      this.echoDataForm.deptId = 'clear_' + Math.random()
      this.echoDataForm.sectionId = 'clear_' + Math.random()
    },
    doResetLeftUserInfo () {
      this.$refs.dataForm.resetFields()
      this.echoDataForm.organizeId = 'clear_' + Math.random()
      this.echoDataForm.deptId = 'clear_' + Math.random()
      this.echoDataForm.sectionId = 'clear_' + Math.random()
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = thisvm.dataForm
      thisvm.$http.get('/ctc/project/projectMember/select/userGroupMember', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.total = res.data.total
          thisvm.leftTableData = res.data.list
          // 设置默认选中
          thisvm.$nextTick(() => {
            thisvm.leftTableData.forEach((item, index) => {
              if (thisvm.userSelectMemberMap.hasOwnProperty(item.id)) {
                thisvm.$toggleRowSelectionTable('leftTableObject', item)
              }
            })
          })
        }
      }).catch(() => { })
    },
    handleSelectAllChange (selection) {
      let checkAll = selection.length > 0
      let data = this.leftTableData
      data.forEach((item, index) => {
        if (checkAll) {
          if (!this.userSelectMemberMap.hasOwnProperty(item.id) && !this.projectMemberDetailMap.hasOwnProperty(item.id)) {
            this.userSelectMemberMap[item.id] = item
          }
        } else {
          delete this.userSelectMemberMap[item.id]
        }
      })
    },
    handleSelectChange (selection, item) {
      // 判断当前是否选中
      if (this.userSelectMemberMap.hasOwnProperty(item.id)) {
        delete this.userSelectMemberMap[item.id]
      } else {
        this.userSelectMemberMap[item.id] = item
      }
    },
    // 判断左侧用户是否禁用
    selectable (row, index) {
      let bool = !this.projectMemberDetailMap.hasOwnProperty(row.id)
      return bool
    },
    // 根据项目id，获取已保存的项目成员
    getMemberTableDataById () {
      let params = { 'platformId': this.platformId }
      let url = '/sys/platformUser/listInfo'
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          res.data.forEach((item, index) => {
            this.projectMemberDetailMap[item.userId] = item
          })
          this.doResetLeftUserInfo()
        }
      }).catch(() => { })
    },
    getMemberRoles (roleCodes) {
      let roleNames = []
      roleCodes = roleCodes || []
      roleCodes.forEach((item, index) => {
        let roleName = this.$getDictLabel('roleType', item)
        roleNames.push(roleName)
      })
      return roleNames.join('，')
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      let data = []
      let userSelectMemberMap = thisvm.userSelectMemberMap
      for (let key in userSelectMemberMap) {
        if ({}.hasOwnProperty.call(userSelectMemberMap, key)) {
          let item = userSelectMemberMap[key]
          let titem = {}
          titem.userId = item.id
          titem.userName = item.username
          titem.realName = item.realName
          titem.organizeId = item.organizeId
          titem.organizeName = item.organizeName
          // userType(1:测试人员;2:接口人)
          titem.userType = 1
          titem.platformId = thisvm.platformId
          data.push(titem)
        }
      }
      if (data.length > 0) {
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/sys/platformUser', 'reload': true }
        thisvm.$emit('watchChildMethod', { ...params, 'data': data })
        thisvm.handleDialogClose()
      }
    }
  }
}
</script>
<style lang="scss">
.add-member-project {
  .add-member-filter {
  }
  .selected {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
