<template>
  <el-dialog :append-to-body="true" width="76%" :visible.sync="visible" title="新增项目" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="20">
          <el-form-item prop="name" label="项目名称">
            <el-input v-model="dataForm.name" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align:right;">
          <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table stripe highlight-current-row :header-cell-style="getRowClass" :data="projectTableData" @selection-change="dataListSelectionChangeHandle" :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" ref="projectTableData" row-key="projectId" border lazy height="480" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <template v-for="(item, index) in projectTableTitleData">
        <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="getTableColumnData(scope.row,item)"></span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination background :page-sizes="[9, 20, 50]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle" style="text-align:right;">
    </el-pagination>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button size="small" type="primary" @click="carryParamList()">{{ $t('add') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      visible: false,
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/project/list/pageProject',
        getDataListIsPage: true
      },
      dataForm: {
        name: '', // 项目名称
        page: 1,
        limit: 9
      },
      total: 0,
      projectTableTitleData: [{ 'code': 'name', 'name': '项目名称' }, { 'code': 'projectStatus', 'name': '状态' }, { 'code': 'level', 'name': '级别' }, { 'code': 'category', 'name': '类别' }, { 'code': 'scope', 'name': '范围' }, { 'code': 'managerName', 'name': '项目经理' }, { 'code': 'participantCount', 'name': '参测对象' }, { 'code': 'planPeriod', 'name': '计划周期' }, { 'code': 'organizeIdName', 'name': '归属机构' }, { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'operate', 'name': '操作' }],
      projectTableData: []
    }
  },
  methods: {
    init () {
      this.dataForm.projectBaseinfoDtos = []
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
        this.getProjectInfo()
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      let bool = 'projectStatus,level,category,scope'.includes(item.code)
      if (bool) {
        columnValue = this.$getDictLabel('project.' + item.code, row[item.code])
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
      this.dataForm.page = val
      this.getProjectInfo()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectInfo()
    },
    getProjectInfo () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = Object.assign({}, thisvm.dataForm)
      thisvm.$http.get('/ctc/project/list/pageProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectTableTitleData = res.data.head
          thisvm.projectTableData = res.data.data.list
          thisvm.total = res.data.data.total
          thisvm.$ctcLoading.close()
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    subTableload (tree, treeNode, resolve) {
      let params = { 'parentId': tree.projectId }
      this.$http.get('/ctc/project/list/subProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          resolve(res.data)
          if (res.data.length === 0) {
            this.$message.warning(tree.name + '，目前还没有建立子项目或直接挂载任务')
          }
        }
      }).catch(() => {
      })
    },
    carryParamList () {
      let selection = this.dataListSelections
      let validCode = true
      let validMsg = ''
      let validProjectMap = { 'level2': 0, 'level3': 0, 'level2Data': [], 'level3Data': [] }
      selection.forEach((item, index) => {
        let parentId = item.parentId || ''
        let projectId = item.projectId || ''
        if (parentId) {
          validProjectMap['level3'] = validProjectMap['level3'] + 1
          validProjectMap['level3Data'].push(parentId + '=' + projectId)
        } else {
          validProjectMap['level2'] = validProjectMap['level2'] + 1
          validProjectMap['level2Data'].push(projectId)
        }
      })
      // 开始校验项目勾选情况
      if (validCode && validProjectMap['level2'] > 0 && validProjectMap['level3'] > 0) {
        let level2Data = validProjectMap['level2Data']
        let level3Data = validProjectMap['level3Data']
        level3Data.forEach((item3, index3) => {
          let parentId = item3.split('=')[0]
          if (validCode && level2Data.includes(parentId)) {
            validCode = false
            validMsg = '不支持父子项目同时勾选'
          }
        })
      }
      if (validCode) {
        this.$emit('ListChangeHandle', this.dataListSelections)
        this.visible = false
      } else {
        this.$message.warning(validMsg)
      }
    }
  }
}
</script>
