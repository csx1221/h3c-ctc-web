<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-position="right">
        <el-form-item label="">
          <el-input v-model="dataForm.name" placeholder="请输入应用名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="dataForm.code" placeholder="请输入code" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:application:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="$hasPermission('subadmin:application:list')" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label="应用名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="code" label="code" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" >{{ scope.row.code }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="accessToken" label="Access_Token" header-align="center" align="center"></el-table-column>
        <el-table-column prop="comments" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="系统状态" header-align="center" align="center">
          <template slot-scope="scope">
              <el-switch v-model="scope.row.status" @change="switchStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949"  :active-value=0 :inactive-value=1>
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('subadmin:application:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.applicationId)">修改</el-button>
            <el-button v-if="$hasPermission('subadmin:application:admin')" type="text" size="small" @click="adminSetUp(scope.row, 'system/user', '管理员设置')">管理员设置</el-button>
            <el-button v-if="$hasPermission('subadmin:application:permission')" type="text" size="small" @click="adminSetUp(scope.row, 'system/permissions', '权限设置')">权限设置</el-button>
            <el-button v-if="$hasPermission('subadmin:application:role')" type="text" size="small" @click="adminSetUp(scope.row, 'system/role', '角色管理')">角色管理</el-button>
            <el-button v-if="$hasPermission('subadmin:application:permissiondic')" type="text" size="small" @click="adminSetUp(scope.row, 'system/typeup', '类型配置')">类型配置</el-button>
            <el-button v-if="$hasPermission('subadmin:application:delete')" type="text" size="small" @click="deleteRow(scope.row.applicationId)">删除</el-button>
            <el-button v-if="$hasPermission('subadmin:application:log')" type="text" size="small" @click="adminSetUp(scope.row, 'system/historylog', '历史日志')">历史日志</el-button>
            <!-- <el-button type="text" size="small" @click="goApp(scope.row.applicationId, scope.row.accessToken, scope.row.name)">进入应用</el-button> -->
            <el-button type="text" size="small" @click="adminSetUp(scope.row, 'system/tdapplicationbusinessurl', '关联页面')">关联页面</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './application-add-or-update'
import { appListRouter } from '@/router'
// import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/subadmin/application/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/subadmin/application'
      },
      dataForm: {
        name: '',
        type: null
      },
      dataList: []
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 开关请求
    switchStatus (newbg) {
      this.$http.put(`/ctc/subadmin/application`, { ...newbg }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => {})
    },
    adminSetUp (row, url, name) {
      // 路由参数
      const routeParams = {
        routeName: `${row.name}__${row.applicationId}_${name}`,
        title: `${this.$route.meta.title} - ${row.name} - ${name}`,
        path: url,
        params: {
          applicationId: row.applicationId
        }
      }
      // 动态路由
      appListRouter(routeParams, this.$router)
    },
    // 缺少确认删除判断
    deleteRow (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.delete(`/ctc/subadmin/application`, { 'data': [id] }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    }
    // 进入应用
    // goApp (id, token, name) {
    //   this.$confirm(`是否进入${name}`, '提醒', {
    //     confirmButtonText: this.$t('confirm'),
    //     cancelButtonText: this.$t('cancel'),
    //     type: 'warning'
    //   }).then(() => {
    //     id = id + ''
    //     this.$http.get(`/ctc/subadmin/application/auth/auth?applicationId=${id}`).then(({ data: res }) => {
    //       if (res.code !== 0) {
    //         return this.$message.error(res.msg)
    //       }
    //       if (res.data.applicationDetail.defaultUrl.indexOf('?') !== -1) {
    //         window.open(`${res.data.applicationDetail.defaultUrl}&token=${Cookies.get('token')}&applicationToken=${token}`)
    //         return
    //       }
    //       window.open(`${res.data.applicationDetail.defaultUrl}?token=${Cookies.get('token')}&applicationToken=${token}`)
    //     }).catch(() => {})
    //   }).catch(() => {})
    // }
  }
}
</script>
