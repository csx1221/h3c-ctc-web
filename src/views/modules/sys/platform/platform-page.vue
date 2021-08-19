<template>
  <el-card shadow="never" class="aui-card--fill  platform-page-mgr">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="name" label="业务平台名称">
            <el-input v-model="dataForm.name" placeholder="请输入业务平台名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        业务平台列表
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="blue" size="small" v-if="$hasPermission('sys:platform:add')" @click="doAddOrUpdateHandle('',0)">{{ $t('add') }}</el-button>
        <el-button type="danger" size="small" @click="doDeletePlatform()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="业务平台名称" header-align="left" align="left" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column prop="testUserCount" label="测试人数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="interfaceUserCount" label="接口人数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateDate" label="最后更新时间" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column prop="createName" label="业务平台创建人" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.operate">
            <el-button @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './platform-add-or-update'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'PlatformPage',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/platform/page',
        getDataListIsPage: true,
        deleteURL: '/sys/platform',
        deleteIsBatch: true
      },
      dataForm: {
        name: '' // 机构名称
      }
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    onReset () {
      this.$refs.dataForm.resetFields()
      this.getDataList()
    },
    onSubmit () {
    },
    doTableOperate (type, row) {
      //  查看(0L) 编辑(1L), 删除(2L), 成员管理(6L)
      if (type === '0') {
        this.doAddOrUpdateHandle(row.id, 1)
      } else if (type === '1') {
        this.doAddOrUpdateHandle(row.id, 0)
      } else if (type === '2') {
        this.doDeletePlatform([row])
      } else if (type === '6') {
        this.platformMemberSet(row)
      }
    },
    doAddOrUpdateHandle (id, readOnly) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id || ''
        this.$refs.addOrUpdate.dataForm.readOnly = readOnly // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdate.init()
      })
    },
    platformMemberSet (row) {
      let path = 'sys/platform/platform-member-set'
      let title = '业务平台成员设置'
      let params = {}
      params.platformId = row.id
      params.platformCreator = row.creator
      this.customAddDynamicRoute(path, title, params)
    },
    doDeletePlatform (row) {
      let selection = row || this.$refs.dataList.selection
      if (selection.length > 0) {
        let platformIds = []
        let platformNoDels = []
        selection.forEach((item, index) => {
          if (!item.operate.includes('2')) {
            platformNoDels.push(item.name)
          }
          platformIds.push(item.id)
        })
        if (platformNoDels.length > 0) {
          let msg = '以下业务平台校验不通过，不允许批量删除<br/>' + platformNoDels.join('<br/>')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            showClose: true,
            duration: 15000,
            type: 'warning'
          })
        } else {
          this.$confirm('确定删除[业务平台]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete('/sys/platform', { 'data': platformIds }).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$message.success('用例删除成功')
                this.getDataList()
              }
            }).catch(() => {
            })
          }).catch(() => { })
        }
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
<style lang="scss" scoped>
.platform-page-mgr {
}
</style>
