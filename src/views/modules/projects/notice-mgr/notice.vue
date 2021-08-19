<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="title" label="公告标题">
                <el-input v-model="dataForm.title" placeholder="请输入公告标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="projectName" label="项目名称">
                <el-input v-model="dataForm.projectName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right">
              <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
              <el-button size="small" @click="onReset()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row >
          <el-col :span="12" class="split-line" style="text-align:left;">
            公告列表
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button type="primary" size="small" @click="addOrUpdateHandle()">创建公告</el-button>
            <el-button type="primary" size="small" @click="doBatchPublish()">批量发布</el-button>
          </el-col>
        </el-row>
        <div class="mod-demo__sysnotice">
          <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50" :selectable="selectable"></el-table-column>
            <el-table-column prop="title" label="公告名称" header-align="left" align="left" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="viewHandle(scope.row)">{{scope.row.title}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="项目名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="noticeStatus" label="公告状态" header-align="left" align="left">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.noticeStatus === 0" size="small" type="info">{{ $getDictLabel("project.noticeStatus", scope.row.noticeStatus) }}</el-tag>
                <el-tag v-else size="small">{{ $getDictLabel("project.noticeStatus", scope.row.noticeStatus) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="公告内容" header-align="left" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="notcieValidDate" label="失效时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sticky" label="是否置顶" header-align="center" align="center" width="80">
              <template slot-scope="scope">
                {{ $getDictLabel("whether", scope.row.sticky) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="!scope.row.ifEdit" @click="addOrUpdateHandle(scope.row.noticeId)" v-if="scope.row.noticeStatus==0">编辑</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.ifEdit" @click="doOnlyPublish(scope.row)" v-if="scope.row.noticeStatus==0">发布</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.ifEdit" @click="addOrUpdateHandle(scope.row.noticeId)" v-else>修改发布</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.ifEdit" @click="deleteHandle(scope.row.noticeId)">{{ $t('delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './notice-add-or-update'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  components: {
    AddOrUpdate
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/project/projectNotice/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/project/projectNotice',
        deleteIsBatch: true
      },
      dataForm: {
        title: '',
        projectName: ''
      },
      projectData: []
    }
  },
  mounted () {
  },
  methods: {
    viewHandle (row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.noticeId}`,
        title: '公告详情查看',
        path: 'projects/notice-mgr/notice-view',
        params: {
          noticeId: row.noticeId,
          projectId: row.projectId
        }
      }
      // 动态路由
      addDynamicRoute(routeParams, this.$router)
    },
    // 判断表格复选框是否禁用(true:不禁用;false：禁用)
    selectable (row, index) {
      let bool = row.ifEdit
      return bool
    },
    doOnlyPublish (row) {
      let params = { 'noticeIds': [row.noticeId], 'noticeStatus': 1 }
      this.executePublish(params)
    },
    doBatchPublish () {
      let selectionData = this.$refs.dataList.selection
      if (selectionData.length > 0) {
        let noticeIds = []
        let noticeTitles = []
        selectionData.forEach((item, index) => {
          if (item.noticeStatus === 0) {
            noticeIds.push(item.noticeId)
          } else {
            noticeTitles.push(item.title)
          }
        })
        if (noticeTitles.length > 0) {
          this.$message.warning('只允许未发布状态，进行批量发布操作！')
        } else {
          let params = { 'noticeIds': noticeIds, 'noticeStatus': 1 }
          this.executePublish(params)
        }
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    executePublish (params) {
      this.$confirm('确定发布[公告]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/ctc/project/projectNotice/updateNoticeStatus', params).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.getDataList()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    onReset () {
      this.$refs.dataForm.resetFields()
      this.getDataList()
    }
  }
}
</script>
