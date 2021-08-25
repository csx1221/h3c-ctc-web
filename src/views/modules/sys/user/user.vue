<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户账号" prop="username">
              <el-input v-model="dataForm.username" placeholder="请输入用户账号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="dataForm.realName" placeholder="请输入用户姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="organizeId" label="所属机构">
              <ctc-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构" :organizeId.sync="echoDataForm.organizeId"></ctc-organize-table>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属部门">
              <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择所属部门" :organizeId.sync="dataForm.organizeId" :deptId.sync="echoDataForm.deptId"></ctc-dept-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="margin-bottom:20px;">
        <el-col :span="24" style="padding-left:0px;text-align:right;">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
        <el-col :span="24" style="padding-left:0px;text-align:left;">
          <el-button type="primary" size="small" @click="addOrUpdateHandle()" v-if="loginSw==0">{{ $t('add') }}</el-button>
          <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
          <el-button type="primary" size="small" @click="doImportHandle()" v-if="loginSw==0">导入</el-button>
          <el-button type="warning" size="small" @click="doExportHandle()" v-if="loginSw==0 || $store.state.user.superAdmin==1">{{ $t('export') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row :data="dataList" ref="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="username" label="用户账号" sortable="custom" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="用户姓名" sortable="custom" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userType" label="账号类型" sortable="custom" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('userType', scope.row.userType) }}
          </template>
        </el-table-column>
        <el-table-column prop="userRoleNames" label="所属角色" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organizeNameList" label="所属机构/部门/科室" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="serviceNameList" label="服务机构/部门/科室" header-align="left" align="left" width="300" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('user.status0') }}</el-tag>
            <el-tag v-else size="small" type="success">{{ $t('user.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('user.createDate')" sortable="custom" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="loginSw==0 && validIsShowButton('sys:user:update',scope.row)" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="validIsShowButton('sys:user:delete',scope.row)" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row)">{{ $t('delete') }}</el-button>
            <el-button v-if="loginSw==1 && $hasPermission('sys:user:roleauth')" type="text" size="small" @click="doUserRoleAuth4A(scope.row)">角色授权</el-button>
            <el-button v-if="loginSw==0" type="text" size="small" @click="doResetPwd(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 4A账号角色授权 -->
      <user-role-auth4A v-if="userRoleAuth4A" ref="userRoleAuth4A" @refreshDataList="getDataList"></user-role-auth4A>
      <!--引入文件导入-->
      <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-file-import>
    </div>
  </el-card>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
import UserRoleAuth4A from './user-role-auth4A'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  mixins: [mixinViewModule],
  components: {
    AddOrUpdate, UserRoleAuth4A
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/page',
        getDataListIsPage: true,
        deleteURL: '/sys/user',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
      ctcFileImport: false,
      userRoleAuth4A: false,
      dataForm: {
        username: '',
        realName: '',
        organizeId: '',
        deptId: ''
      },
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      echoDataForm: {
        organizeId: '',
        deptId: ''
      }
    }
  },
  watch: {
    'dataForm.organizeId': {
      handler (newName, oldName) {
        if (newName !== '') {
          this.echoDataForm.deptId = 'clear_' + Math.random()
        }
      }
    }
  },
  methods: {
    validIsShowButton (type, row) {
      let bool = true
      bool = this.$hasPermission(type)
      if (bool) {
        if (row.isOrganizeAdmin === 1) {
          bool = false
        }
      }
      return bool
    },
    onReset () {
      this.dataForm.username = ''
      this.dataForm.realName = ''
      this.dataForm.gender = ''
      this.dataForm.organizeId = ''
      this.dataForm.deptId = ''
      this.echoDataForm.organizeId = 'clear_' + Math.random()
      this.echoDataForm.deptId = 'clear_' + Math.random()
      this.getDataList()
    },
    triggerParentPage () {
      this.onReset()
    },
    doExportHandle () {
      let data = { ...this.dataForm }
      data.fileName = '用户账号'
      delete data['page']
      delete data['limit']
      // 特殊处理用例勾选用例，只导出用户勾选用例
      let selectionData = this.$refs.dataList.selection
      if (selectionData.length > 0) {
        let userIds = []
        selectionData.forEach((item, index) => {
          userIds.push(item.id)
        })
        data.userIds = userIds.join(',')
      }
      let url = '/sys/user/export'
      ctcUtils.customExportPost(url, data)
    },
    doImportHandle () {
      let templateData = { 'fileName': '账号导入模板下载' }
      let uploadData = {}
      let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
      fileImportParams.templateUrl = '/sys/user/exportUserTemplate'
      fileImportParams.uploadUrl = '/sys/user/import'
      this.$refs.ctcFileImport.fileImportParams = { ...this.$refs.ctcFileImport.fileImportParams, ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    doResetPwd (row) {
      this.$toggleRowSelectionTable('dataList', row)
      this.$confirm('确定重置[密码]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/sys/user/resetPassword',
          { 'userId': row.id },
          { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('用户密码重置失败')
          } else {
            this.$message.success('用户密码重置成功')
            this.getProjectInfo()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    doUserRoleAuth4A (row) {
      this.userRoleAuth4A = true
      this.$nextTick(() => {
        this.$refs.userRoleAuth4A.dataForm.id = row.id
        this.$refs.userRoleAuth4A.init()
      })
    }
  }
}
</script>
