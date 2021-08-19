<template>
  <div class="project-case-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="platform" label="来源平台">
                  <el-select v-model="dataForm.platform" clearable filterable placeholder="请选择来源平台" value-key="moduleId" @change="chooseModule">
                    <!-- 联调:1;用户模拟：2 -->
                    <el-option key="1" label="接口联调" value="1">接口联调</el-option>
                    <el-option key="2" label="用户模拟" value="2">用户模拟</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item prop="caseName" label="所属构件">
                  <el-input v-model="dataForm.caseName" placeholder="请输入构件名称"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="16" style="text-align:right;">
                <el-button type="primary" size="small" @click="getCaseset()">查询</el-button>
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
              设定列表
            </el-col>
            <el-col :span="21" style="text-align:right;">
              <el-button type="blue" size="small" @click="doAddCase()">新增</el-button>
              <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="casesetTableData" ref="casesetTableData" border height="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="builderCaseId" label="用例ID" header-align="left" align="left" width="190" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('builderCaseId', scope.row.builderCaseId) }}
              </template>
            </el-table-column>
            <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('caseName', scope.row.caseName) }}
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="来源平台" header-align="center" align="center" show-overflow-tooltip>
              <!-- 1：接口联调 2：用户模拟 3：APP -->
              <template slot-scope="scope">
                {{ $getDictLabel('platform', scope.row.platform) }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="caseClass" label="所属项目" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('caseClass', scope.row.caseClass) }}
              </template>
            </el-table-column> -->
            <el-table-column prop="builderName" label="所属构件" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('builderName', scope.row.builderName) }}
              </template>
            </el-table-column>
            <el-table-column prop="execUserName" label="执行人" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="createDate" label="加入时间" header-align="right" align="right" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('createDate', scope.row.createDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="操作人" header-align="right" align="right" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('creator', scope.row.creator) }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <template v-for="(item, index) in casesetOperateType">
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
import AddOrUpdate from './caseset-add-or-update'
export default {
  name: 'CasesetListPage',
  components: {
    AddOrUpdate
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        platform: '',
        caseName: ' ',
        limit: 10,
        page: 1
      },
      orderId: '',
      total: 0,
      casesetTableData: [],
      dataModuleOneData: [],
      addOrUpdate: false,
      casesetOperateType: [
        {
          type: 1,
          name: '上移'
        },
        {
          type: 2,
          name: '下移'
        },
        {
          type: 3,
          name: '删除'
        }
      ]
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.projectData.builderId) {
          this.getCaseset()
        }
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getCaseset()
  },
  activated () {
  },
  methods: {
    chooseModule () {

    },
    triggerParentMethod (message) {
      this.getCaseset()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getCaseset()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getCaseset()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getCaseset()
    },
    getCaseset () {
      this.$ctcLoading.open()
      let params = { ...this.dataForm, builderId: this.projectData.builderId }
      this.$http.get('integration/buildercase/page/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.casesetTableData = res.data.list
          this.total = res.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doAddCase () {
      // 新增用例设定
      if (this.projectData.builderId) {
        this.$refs.addOrUpdate.builderId = this.projectData.builderId
        this.$refs.addOrUpdate.projectId = this.projectData.projectId
        this.$refs.addOrUpdate.execUserNo = ''
        this.$refs.addOrUpdate.init()
      } else {
        this.$message.warning('请先在左侧项目树中选择构件！')
      }
    },
    doOperation (type, row) {
      if (type === 1) {
        // 上移用例设定
        this.doCaseMove(1, row)
      } else if (type === 2) {
        // 下移用例设定
        this.doCaseMove(2, row)
      } else if (type === 3) {
        // 删除用例设定
        this.doCaseDelete(row)
      }
    },
    doCaseMove (type, row) {
      this.$toggleRowSelectionTable('casesetTableData', row)
      let params = {
        builderId: row.builderId,
        builderCaseId: row.builderCaseId
      }
      this.$http.put(type === 1 ? `/integration/buildercase/moveUp` : `/integration/buildercase/moveDown`, params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success(type === 1 ? '用例设定上移成功' : '用例设定下移成功')
          this.getCaseset()
        }
      }).catch(() => {
      })
    },
    doBatchDeleteCase () {
      let selectionData = this.$refs.casesetTableData.selection
      if (selectionData.length > 0) {
        let casesetIds = []
        selectionData.forEach((item, index) => {
          casesetIds.push(item.builderCaseId)
        })
        this.$confirm('确定删除[用例设定]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('integration/buildercase/delete', { 'data': casesetIds }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('用例设定删除成功')
              this.getCaseset()
            }
          }).catch(() => {
          })
        }).catch(() => { })
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    doCaseDelete (row) {
      this.$toggleRowSelectionTable('casesetTableData', row)
      this.$confirm('确定删除[用例设定]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/integration/buildercase/delete', { 'data': [row.builderCaseId] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('用例设定删除成功')
            this.getCaseset()
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
