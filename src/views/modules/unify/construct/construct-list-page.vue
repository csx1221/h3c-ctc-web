<template>
  <div class="project-case-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="name" label="构件名称">
                  <el-input v-model="dataForm.name" placeholder="请输入用例名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="createDate" label="创建时间">
                  <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="primary" size="small" @click="getConstructList()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="3" class="split-line" style="text-align:left;">
              构件列表
            </el-col>
            <el-col :span="21" style="text-align:right;">
              <el-button type="blue" size="small" @click="addConstruct()">新增</el-button>
              <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="builderId" label="单号" header-align="left" align="left" width="190" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="构件名称" header-align="left" align="left" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="projectName" label="所属项目" header-align="center" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="number" label="用例数量" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="batch" label="执行次数" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="right" align="right" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" header-align="right" align="right" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <template v-for="(item, index) in constructOperateType">
                  <el-button @click="doOperation(item.type, scope.row)" :key="index" type="text" size="small">{{ item.name }}</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-card>
      </el-col>
      <!--引入新增修改用例页面-->
      <add-or-update ref="addOrUpdate" :visible.sync="addOrUpdate" @watchChildPage="triggerParentMethod"></add-or-update>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import AddOrUpdate from './construct-add-or-update'
export default {
  name: 'ConstructListPage',
  components: {
    AddOrUpdate
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        name: '',
        createDate: '',
        limit: 10,
        page: 1
      },
      orderId: '',
      total: 0,
      caseTableData: [],
      addOrUpdate: false,
      constructOperateType: [
        {
          type: 1,
          name: '编辑'
        },
        {
          type: 2,
          name: '删除'
        }
      ]
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.projectData.projectId) {
          this.getConstructList()
        }
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getConstructList()
  },
  activated () {
  },
  methods: {
    triggerParentMethod () {
      this.$emit('watchChildTree')
      this.getConstructList()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getConstructList()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getConstructList()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getConstructList()
    },
    getConstructList () {
      this.$ctcLoading.open()
      let params = {
        ...this.dataForm,
        projectId: this.projectData.parentProjectId ? this.projectData.parentProjectId : this.projectData.projectId,
        projectSubId: this.projectData.parentProjectId ? this.projectData.projectId : ''
      }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.startTime = params.createDate[0]
        params.endTime = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('integration/builder/page/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.totalCount
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    addConstruct () {
      // 新增构件
      if (this.projectData.projectId) {
        if (this.projectData.projectId === 1) {
          this.$message.warning('请先创建子项目，只允许在子项目中创建构件！')
        } else {
          this.$refs.addOrUpdate.dataFormAdd.parentProjectId = this.projectData.parentProjectId
          this.$refs.addOrUpdate.dataFormAdd.builderId = ''
          this.$refs.addOrUpdate.dataFormAdd.projectId = this.projectData.projectId
          this.$refs.addOrUpdate.dataFormAdd.projectName = this.projectData.projectName
          this.$refs.addOrUpdate.dataFormAdd.name = ''
          this.$refs.addOrUpdate.dataFormAdd.descript = ''
          this.$refs.addOrUpdate.init()
        }
      } else {
        this.$message.warning('请先在左侧项目树中选择项目或子项目！')
      }
    },
    doOperation (type, row) {
      if (type === 1) {
        // 编辑用例
        this.$refs.addOrUpdate.dataFormAdd.builderId = row.builderId

        // this.$refs.addOrUpdate.dataFormAdd.projectId = row.projectId
        // this.$refs.addOrUpdate.dataFormAdd.projectName = row.projectId
        // this.$refs.addOrUpdate.dataFormAdd.name = row.name
        // this.$refs.addOrUpdate.dataFormAdd.descript = row.descript
        this.$refs.addOrUpdate.init()
      } else if (type === 2) {
        // 删除用例
        this.doCaseDelete(row)
      }
    },
    doBatchDeleteCase () {
      let selectionData = this.$refs.caseTableData.selection
      console.log(selectionData)
      if (selectionData.length > 0) {
        let constructIds = []
        selectionData.forEach((item, index) => {
          constructIds.push(item.builderId)
        })
        this.$confirm('确定删除[构件]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('integration/builder/delete', { 'data': constructIds }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('构件删除成功')
              this.$emit('watchChildTree')
              this.getConstructList()
            }
          }).catch(() => {
          })
        }).catch(() => { })
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    doCaseDelete (row) {
      this.$toggleRowSelectionTable('caseTableData', row)
      this.$confirm('确定删除[构件]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/integration/builder/delete', { 'data': [row.builderId] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('构件删除成功')
            this.$emit('watchChildTree')
            this.getConstructList()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
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
.el-col {
}
</style>
