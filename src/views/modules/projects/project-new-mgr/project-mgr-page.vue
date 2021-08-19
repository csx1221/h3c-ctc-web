<template>
  <el-row class="project-new-mgr-page">
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
              <el-form-item prop="projectStatus" label="项目状态">
                <ctc-select v-model="dataForm.projectStatus" dict-type="project.projectStatus" placeholder="请选择项目状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="organizeId" label="归属机构">
                <ctc-project-organize-table v-model="dataForm.organizeId" :organizeId.sync="echoDataForm.organizeId" placeholder="请选择所属机构"></ctc-project-organize-table>
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
              <el-form-item prop="managerId" label="项目经理">
                <el-select v-model="dataForm.managerId" filterable placeholder="请选择项目经理">
                  <el-option v-for="item in managerData" :key="item.id" :label="item.realName" :value="item.id">
                    <span style="color: #8492a6; font-size: 13px" :title="item.username">{{ item.realName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
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
              <el-form-item prop="category" label="项目类别">
                <ctc-select v-model="dataForm.category" dict-type="project.category" placeholder="请选择项目类别"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="createDate" label="创建时间">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row>
          <el-col :span="12" class="split-line" style="text-align:left;">
            项目列表
          </el-col>
          <el-col :span="12" style="padding-left:0px;text-align:right;">
            <el-button type="blue" size="small" @click="doCreateProject()" v-if="$hasPermission('projects:list:add')">创建项目</el-button>
            <el-button type="blue" size="small" @click="doSpeedyCreateProject()" v-if="$hasPermission('projects:list:add')">快捷创建</el-button>
            <el-button type="warning" size="small" @click="doBatchArchiveProject()" v-if="$hasPermission('projects:list:archive')">归档项目</el-button>
            <el-button type="success" size="small" @click="doBatchCopyProject()" v-if="$hasPermission('projects:list:copy')">复制项目</el-button>
          </el-col>
        </el-row>
        <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" row-key="projectId" border lazy :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @row-click="tableRowClick" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <template v-for="(item, index) in projectTableTitleData">
            <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" :width="getTableColumnWidth(item)" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" :width="operateColWidth">
            <template slot-scope="scope">
              <template v-for="(item, index) in scope.row.operate">
                <el-button v-if="!([2,4].includes(scope.row.projectStatus) && ['1','2','11','18','19'].includes(item))" @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
              </template>
              <el-button v-if="[2,4].includes(scope.row.projectStatus)" @click="doTableOperate('25',scope.row)" type="text" size="small">{{ $getDictLabel('operateType','25') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[10,100,500,1000]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
        </el-pagination>
        <!--调整周期-->
        <modify-project-date :visible.sync="modifyProjectDate" ref="modifyProjectDate" @watchChildMethod="triggerParentMethod"></modify-project-date>
        <!--复制项目-重设周期-->
        <copy-project-modify-date :visible.sync="copyProjectModifyDate" ref="copyProjectModifyDate" @watchChildMethod="triggerParentMethod"></copy-project-modify-date>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import CtcProjectUserTable from '@/components/project/ctc-project-user-table'
import { addDynamicRoute } from '@/router'
import ModifyProjectDate from './modify-project-date'
import CopyProjectModifyDate from './copy-project-modify-date'
export default {
  name: 'ProjectmgrPage',
  components: {
    CtcProjectOrganizeTable, CtcProjectUserTable, ModifyProjectDate, CopyProjectModifyDate
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
        projectStatus: '', // 项目状态
        managerId: '', // 项目经理
        organizeId: '', // 归属机构
        createDate: '',
        page: 1,
        limit: 10
      },
      echoDataForm: {
        organizeId: ''
      },
      total: 0,
      projectTableTitleData: [{ 'code': 'name', 'name': '项目名称' }, { 'code': 'projectStatus', 'name': '状态' }, { 'code': 'level', 'name': '级别' }, { 'code': 'category', 'name': '类别' }, { 'code': 'scope', 'name': '范围' }, { 'code': 'managerName', 'name': '项目经理' }, { 'code': 'participantCount', 'name': '参测对象' }, { 'code': 'planPeriod', 'name': '计划周期' }, { 'code': 'organizeIdName', 'name': '归属机构' }, { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'operate', 'name': '操作' }],
      projectTableData: [],
      operateColWidth: 150,
      tableTreeMaps: {},
      tableOperateRows: [], // 存放3级架构父项目编码
      managerData: [],
      modifyProjectDate: false,
      copyProjectModifyDate: false
    }
  },
  computed: {
  },
  mounted () {
    let thisvm = this
    thisvm.getManagerData()
    window.addEventListener('handReLoadEvent', function (event) {
      if (event.key === 'projectReload') {
        thisvm.getProjectInfo()
      }
    })
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'modifyProjectDate') {
        this.getProjectInfo()
      } else if (message.type === 'copyProjectModifyDate') {
        this.executeCopyProject(message.data)
      }
    },
    getTableColumnWidth (item) {
      let width = 'auto'
      if (['name'].includes(item.code)) {
        width = 250
      } else if (['projectTime'].includes(item.code)) {
        width = 120
      }
      return width
    },
    autoCalcOperateWidth (data) {
      // 特殊处理是否展示操作列
      if (data.length > 0) {
        let maxWidth = 0
        data.forEach((item, index) => {
          let operateArr = item.operate || []
          let operateNameArr = []
          operateArr.forEach((item, index) => {
            operateNameArr.push(this.$getDictLabel('operateType', item))
          })
          let operateColWidth = operateNameArr.join(',').length * 15
          if (maxWidth < operateColWidth) {
            maxWidth = operateColWidth
          }
        })
        if (maxWidth > 150 && this.operateColWidth < maxWidth) {
          this.operateColWidth = maxWidth
        }
      }
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      let bool = 'projectStatus,level,category,scope'.includes(item.code)
      if (bool) {
        columnValue = this.$getDictLabel('project.' + item.code, row[item.code])
        columnValue = columnValue === -1 ? '' : columnValue
      } else {
        columnValue = row[item.code]
      }
      // 特殊处理计划周期
      if (item.code === 'planPeriod') {
        columnValue = row.planStartTime + '~' + row.planEndTime
      }
      // 判断是否追加空格,保持项目名称对齐
      if (!row.hasChildren && item.code === 'name') {
        columnValue = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + columnValue
      }
      return columnValue
    },
    currentPageChangeHandle (val) {
      this.tableTreeMaps = {}
      this.tableOperateRows = []
      this.getProjectInfo()
    },
    pageSizeChangeHandle (val) {
      this.tableTreeMaps = {}
      this.tableOperateRows = []
      this.dataForm.limit = val
      this.getProjectInfo()
    },
    getProjectInfo () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = Object.assign({}, thisvm.dataForm)
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('/ctc/project/list/pageProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectTableTitleData = res.data.head
          thisvm.projectTableData = res.data.data.list
          thisvm.total = res.data.data.total
          thisvm.operateColWidth = 150
          thisvm.autoCalcOperateWidth(res.data.data.list)
          // 自动触发子项目加载
          thisvm.refreshLoadTree()
          thisvm.$ctcLoading.close()
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    subTableload (tree, treeNode, resolve) {
      let params = { 'parentId': tree.projectId }
      // 将当前选中节点数据存储到maps中
      this.tableTreeMaps[tree.projectId] = { tree, treeNode, resolve }
      this.$http.get('/ctc/project/list/subProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          resolve(res.data)
          this.autoCalcOperateWidth(res.data)
          if (res.data.length === 0) {
            this.$message.warning(tree.name + '，目前还没有建立子项目或直接挂载任务')
          }
        }
      }).catch(() => {
      })
    },
    getManagerData () {
      let params = { 'page': 1, 'limit': 999999999 }
      this.$http.get('/sys/project/select/manager', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.managerData = res.data.list
          this.getProjectInfo()
        }
      }).catch(() => {
      })
    },
    refreshLoadTree () {
      let thisvm = this
      thisvm.tableOperateRows.forEach((parentId, index) => {
        // 根据父级id取出对应节点数据
        try {
          const { tree, treeNode, resolve } = thisvm.tableTreeMaps[parentId]
          if (tree) {
            thisvm.$set(thisvm.$refs.projectTableData.store.states.lazyTreeNodeMap, parentId, [])
            thisvm.subTableload(tree, treeNode, resolve)
          }
        } catch (error) {
        }
      })
    },
    tableRowClick (row, column, event) {
      let selection = this.$refs.projectTableData.selection
      let currSelectRows = selection.filter(function (item) {
        return item.projectId === row.projectId
      })
      if (currSelectRows.length === 1) {
        this.$refs.projectTableData.toggleRowSelection(row, false)
      } else {
        this.$refs.projectTableData.toggleRowSelection(row, true)
      }
    },
    doCreateProject () {
      this.doTableOperate('-1', {})
    },
    doSpeedyCreateProject () {
      this.doTableOperate('-2', {})
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = { 'parentId': row.parentId || '', 'projectId': row.projectId || '', 'projectName': row.name, 'type': row.type }
      // 兼容其他功能父项目键值不统一
      params.parentProjectId = params.parentId || params.projectId
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '项目管理', 'id': '', 'type': '' }
      // 判断项目是否创建完成
      if (row.projectStatus === -1 && ['11', '18', '19'].includes(type)) {
        this.$message.warning('项目还未配置完成，请继续配置！')
        return
      }
      // 记录操作选中行数据
      if (params.type === 1) {
        if (!this.tableOperateRows.includes(params.parentProjectId)) {
          this.tableOperateRows.push(params.parentProjectId)
        }
      }
      // 创建(-1L)  查看(0L) 编辑(1L), 删除(2L), 归档(3L), 项目树(4L), 设置接口人(5L),设置参测对象成员(6L)
      if (type === '-1') {
        path = 'projects/project-new-mgr/create-project-page'
        title = '创建项目'
        params.operationType = 'add'
        params.readOnly = 0 // 0:编辑模式;1:只读模式
      } else if (type === '-2') {
        path = 'projects/project-new-mgr/speedy-create-project'
        title = '快捷创建项目'
        params.operationType = 'add'
        params.readOnly = 0 // 0:编辑模式;1:只读模式
      } else if (type === '0') {
        if (row.type === 0) {
          // 项目架构==项目/任务
          path = 'projects/project-new-mgr/create-project-page'
          title = '查看项目'
          params.operationType = 'update'
          params.readOnly = 1 // 0:编辑模式;1:只读模式
        } else {
          // 项目架构==项目/子项目/任务
          if (params.parentId === '') {
            // 查看父项目
            path = 'projects/project-new-mgr/create-project-page'
            title = '查看项目'
            params.operationType = 'update'
            params.readOnly = 1 // 0:编辑模式;1:只读模式
          } else {
            // 查看子项目项目
            path = 'projects/project-new-mgr/create-child-project-page'
            title = '查看子项目'
            params.operationType = 'update'
            params.activeIndex = 0
            params.readOnly = 1 // 0:编辑模式;1:只读模式
            // 设置当前路径参数
            pagePathParams.type = 'project'
            pagePathParams.id = params.projectId
          }
        }
      } else if (type === '1') {
        if (params.parentId !== '') {
          path = 'projects/project-new-mgr/create-child-project-page'
          title = '编辑子项目'
          params.operationType = 'update'
          params.activeIndex = 0
          params.readOnly = 0 // 0:编辑模式;1:只读模式
          // 设置当前路径参数
          pagePathParams.type = 'project'
          pagePathParams.id = params.projectId
        } else {
          path = 'projects/project-new-mgr/create-project-page'
          title = '修改项目'
          params.operationType = 'update'
          params.readOnly = 0 // 0:编辑模式;1:只读模式
        }
      } else if (type === '2') {
        this.doDeleteProject(row)
      } else if (type === '3') {
        this.doProjectArchive(row)
      } else if (type === '4') {
        path = 'projects/project-new-mgr/project-detail/project-detail-mgr'
        title = '项目管理-项目树'
        params.projectDetailMain = '0'
      } else if (type === '5') {
        path = 'projects/project-new-mgr/set-interface-user'
        title = '设置接口人'
      } else if (type === '6') {
        path = 'projects/project-new-mgr/set-test-object-member'
        title = '成员管理'
      } else if (type === '11') {
        path = 'projects/task-mgr/create-task-step'
        title = '创建任务'
        params.projectStageId = ''
        params.operationType = 'add'
        // 设置当前路径参数
        pagePathParams.type = 'project'
        pagePathParams.id = params.projectId
      } else if (type === '18') {
        path = 'projects/task-mgr/task-mgr-page'
        title = '任务管理'
      } else if (type === '19') {
        path = 'projects/project-new-mgr/create-child-project-page'
        title = '创建子项目'
        params.parentId = params.projectId
        params.projectId = ''
        params.operationType = 'add'
        params.activeIndex = 0
        // 设置当前路径参数
        pagePathParams.type = 'project'
        pagePathParams.id = params.parentId
      } else if (type === '25') {
        // 调整周期
        this.$refs.modifyProjectDate.parentId = params.parentId
        this.$refs.modifyProjectDate.projectId = row.projectId
        this.$refs.modifyProjectDate.dataForm.planStartTime = row.planStartTime
        this.$refs.modifyProjectDate.dataForm.planEndTime = row.planEndTime
        this.$refs.modifyProjectDate.init()
      }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, title, params)
    },
    doDeleteProject (row) {
      this.$confirm('确定删除[项目]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/ctc/project/projectBase/deleteProject/' + row.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('项目删除成功')
            this.getProjectInfo()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    doBatchArchiveProject () {
      let selection = this.$refs.projectTableData.selection
      if (selection.length > 0) {
        this.$confirm('确定进行[项目归档]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let projectIds = []
          selection.forEach((item, index) => {
            let parentId = item.parentId || ''
            let projectId = item.projectId || ''
            if (parentId) {
              if (!this.tableOperateRows.includes(parentId)) {
                this.tableOperateRows.push(parentId)
              }
            }
            projectIds.push(projectId)
          })
          this.$http.post('/ctc/project/archive/batch', projectIds).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('项目归档成功')
              this.getProjectInfo()
            }
          }).catch(() => { })
        }).catch(() => { })
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    },
    doBatchCopyProject () {
      let selection = this.$refs.projectTableData.selection
      if (selection.length > 0) {
        let validCode = true
        let validMsg = ''
        let validProjectMap = { 'level2': 0, 'level3': 0, 'level2Data': [], 'level3Data': [], 'projectStatus': 0 }
        let projectIds = []
        selection.forEach((item, index) => {
          let parentId = item.parentId || ''
          let projectId = item.projectId || ''
          if (parentId) {
            validProjectMap['level3'] = validProjectMap['level3'] + 1
            validProjectMap['level3Data'].push(parentId + '=' + projectId)
            // 子项目复制，需要判断项目状态
            if ([2, 4].includes(item.projectStatus)) {
              validProjectMap['projectStatus'] = validProjectMap['projectStatus'] + 1
            }
          } else {
            validProjectMap['level2'] = validProjectMap['level2'] + 1
            validProjectMap['level2Data'].push(projectId)
          }
          projectIds.push(projectId)
        })
        // 开始校验项目勾选情况
        if (validCode && validProjectMap['projectStatus'] > 0) {
          validCode = false
          validMsg = '不允许复制【正常完成、延期完成】状态项目，如需操作请先调整周期'
        }
        if (validCode && validProjectMap['level2'] > 0 && validProjectMap['level3'] > 0) {
          validCode = false
          validMsg = '不支持跨项目复制或父子项目同时复制'
        }
        let repetProjectMap = {}
        if (validCode && validProjectMap['level2'] === 0 && validProjectMap['level3'] > 0) {
          let level3Data = validProjectMap['level3Data']
          level3Data.forEach((item, index) => {
            let parentId = item.split('=')[0]
            if (!repetProjectMap.hasOwnProperty(parentId)) {
              repetProjectMap[parentId] = parentId
            }
          })
        }
        if (validCode && Object.keys(repetProjectMap).length > 1) {
          validCode = false
          validMsg = '不支持跨项目复制子项目'
        }
        if (validCode) {
          this.$confirm('确定进行[项目复制]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 特殊处理，复制成功自动加载数据,判断是否复制父项目
            let hasChildProject = false
            selection.forEach((item, index) => {
              let parentId = item.parentId || ''
              if (parentId) {
                if (!this.tableOperateRows.includes(parentId)) {
                  this.tableOperateRows.push(parentId)
                }
                hasChildProject = true
              }
            })
            let params = { 'projectIds': projectIds }
            if (hasChildProject) {
              this.executeCopyProject(params)
            } else {
              // 复制项目-重设周期
              this.$refs.copyProjectModifyDate.dataForm.projectIds = projectIds
              this.$refs.copyProjectModifyDate.dataForm.planStartTime = ''
              this.$refs.copyProjectModifyDate.dataForm.planEndTime = ''
              this.$refs.copyProjectModifyDate.init()
            }
          })
        } else {
          this.$message.error(validMsg)
        }
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    },
    executeCopyProject (params) {
      this.$ctcLoading.open()
      this.$http.post('/ctc/project/projectBase/copyProject', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('项目复制成功')
          this.getProjectInfo()
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doProjectArchive (row) {
      // 判断项目归档状态(2:正常完成;4:延期完成)
      this.$confirm('确定进行[项目归档]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/ctc/project/archive/' + row.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('项目归档成功')
            this.getProjectInfo()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.echoDataForm.organizeId = 'clear_' + Math.random()
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
.project-new-mgr-page {
}
</style>
<style lang="scss" scoped>
</style>
