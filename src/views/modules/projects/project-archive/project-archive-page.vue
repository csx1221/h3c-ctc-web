<template>
  <el-row class="project-archive-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="name" label="项目名称">
                <el-input v-model="dataForm.name" placeholder="请输入项目名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="organizeId" label="归属机构">
                <ctc-project-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构"></ctc-project-organize-table>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="category" label="项目类别">
                <ctc-select v-model="dataForm.category" dict-type="project.category" placeholder="请选择项目类别"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item prop="scope" label="项目范围">
                <ctc-select v-model="dataForm.scope" dict-type="project.scope" placeholder="请选择项目范围"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="level" label="项目级别">
                <ctc-select v-model="dataForm.level" dict-type="project.level" placeholder="请选择项目级别"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="managerId" label="项目经理">
                <ctc-project-user-table v-model="dataForm.managerId" placeholder="请选择项目经理" :organizeId.sync="dataForm.organizeId"></ctc-project-user-table>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="createDate" label="创建时间">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="archivedDate" label="归档时间">
                <el-date-picker v-model="dataForm.archivedDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:10px;">
          <el-col :span="12" class="split-line" style="text-align:left;">
            项目归档列表
          </el-col>
          <el-col :span="12" style="padding-left:0px;text-align:right;">
          </el-col>
        </el-row>
        <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" border style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="projectFlag" label="项目标识" header-align="left" align="left" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">{{scope.row.parentId?'三级架构-子项目':'三级架构-项目'}}</span>
              <span v-else>两级架构-项目</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="项目名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="level" label="项目级别" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.level==-1?'':$getDictLabel('project.level', scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column prop="category" label="项目类别" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.category==-1?'':$getDictLabel('project.category', scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="项目范围" header-align="center" align="center">
            <template slot-scope="scope">
              {{ $getDictLabel('project.scope', scope.row.scope) }}
            </template>
          </el-table-column>
          <el-table-column prop="participantCount" label="参测对象" header-align="center" align="center"></el-table-column>
          <el-table-column prop="managerName" label="项目经理" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizeIdName" label="归属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="planTime" label="计划时间" header-align="center" align="center" width="180">
            <template slot-scope="scope">
              {{scope.row.planStartTime}}~{{scope.row.planEndTime}}
            </template>
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" header-align="right" align="right"></el-table-column>
          <el-table-column prop="archivedDate" label="归档时间" header-align="right" align="right"></el-table-column>
          <el-table-column prop="projectTime" label="项目时长（天）" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <!--<el-button @click="doTableOperate('4',scope.row)" type="text" size="small">阶段管理</el-button>-->
              <el-button @click="doTableOperate('6',scope.row)" type="text" size="small">重新启动</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="getProjectInfo">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import CtcProjectUserTable from '@/components/project/ctc-project-user-table'
import { addDynamicRoute } from '@/router'
export default {
  name: 'ProjectArchivePage',
  components: {
    CtcProjectOrganizeTable, CtcProjectUserTable
  },
  data () {
    return {
      radio: '',
      isOpen: false,
      dataForm: {
        name: '', // 项目名称
        category: '', // 项目类别
        scope: '', // 项目范围
        level: '', // 项目级别
        managerId: '', // 项目经理
        organizeId: '', // 归属机构
        createDate: '',
        archivedDate: '',
        page: 1,
        limit: 10
      },
      total: 0,
      projectTableData: []
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
    this.getProjectInfo()
  },
  methods: {
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectInfo()
    },
    getProjectInfo () {
      let params = Object.assign({}, this.dataForm)
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      // 特殊处理创建日期、修改日期
      if (params.archivedDate.length > 0) {
        params.archivedDateStart = params.archivedDate[0]
        params.archivedDateEnd = params.archivedDate[1]
        delete params['archivedDate']
      }
      this.$http.get('/ctc/project/archive/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.projectTableData = res.data.list
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = { 'projectDetailMain': 1, 'projectId': row.projectId || '', 'projectName': row.name }
      // 项目树(4L), 重新启动(6L)
      if (type === '4') {
        path = 'projects/project-new-mgr/project-detail/project-detail-mgr'
        title = '项目归档-阶段管理'
      } else if (type === '6') {
        this.doReloadProject(row)
      }
      this.customAddDynamicRoute(path, title, params)
    },
    doReloadProject (row) {
      this.$confirm('确定重启[项目]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/ctc/project/archive/reboot/' + row.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('项目重启失败')
          } else {
            this.$message.success('项目重启成功')
            this.getProjectInfo()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo()
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
<style lang="scss">
.project-archive-page {
}
</style>
<style lang="scss" scoped>
</style>
