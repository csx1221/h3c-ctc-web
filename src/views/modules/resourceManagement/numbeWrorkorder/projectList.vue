<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row style="margin-bottom: 20px">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :inline="false"
        label-position="right"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="项目名称">
              <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="organizeId" label="所属机构">
              <ctc-organize-table v-model="dataForm.organizeId" placeholder="请输入机构名称" :organizeId.sync="dataForm.organizeId"></ctc-organize-table>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="primary" size="small" @click="getProjectListData()"
              >查询</el-button
            >
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" row-key="projectId" border lazy :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <template v-for="(item, index) in projectTableTitleData">
          <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="getTableColumnData(scope.row,item)"></span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-row>
    <div style="text-align: center; margin-top: 20px">
      <el-button type="primary" size="small" @click="submitResult()"
        >确定</el-button
      >
      <el-button type="info" size="small" @click="$emit('close')"
        >取消</el-button
      >
    </div>
  </el-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "batchImport",
  data() {
    return {
      dataListLoading: false,
      dataListSelections: "",
      dataForm: {
        name: '',
        organizeId: '',
				limit: 10,
        page: 1
      },
      projectTableTitleData: [{ 'code': 'name', 'name': '项目名称' }, { 'code': 'projectStatus', 'name': '状态' }, { 'code': 'level', 'name': '级别' }, { 'code': 'scope', 'name': '范围' }, { 'code': 'managerName', 'name': '项目经理' }, { 'code': 'organizeIdName', 'name': '归属机构' }, { 'code': 'createDate', 'name': '创建时间' }],
      projectTableData: [],
      total: 0,
      tableTreeMaps: {},
    };
  },
  props: {
    selectData: Array,
  },
  watch: {

  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
		init () {
      this.$nextTick(() => {
        this.getProjectListData()
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectListData()
    },
    getProjectListData () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = Object.assign({}, thisvm.dataForm)
      thisvm.$http.get('/ctc/project/list/pageProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          // thisvm.projectTableTitleData = res.data.head
          thisvm.projectTableData = res.data.data.list
          thisvm.total = res.data.data.total
          // 回显已勾选的数据
          if (this.selectData) {
            for (let i = 0; i < this.selectData.length; i++) {
              for (let k = 0; k < this.projectTableData.length; k++) {
                if (this.selectData[i].projectId == this.projectTableData[k].projectId) {
                  this.$nextTick(() => {
                    this.$refs.projectTableData.toggleRowSelection(this.projectTableData[k]);
                  })
                }
              }
            }
          }
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
          // this.autoCalcOperateWidth(res.data)
          if (res.data.length === 0) {
            this.$message.warning(tree.name + '，目前还没有建立子项目或直接挂载任务')
          } else {
            // 回显已勾选的数据
            if (this.selectData) {
              for (let i = 0; i < this.selectData.length; i++) {
                for (let k = 0; k < res.data.length; k++) {
                  if (this.selectData[i].projectId == res.data[k].projectId) {
                    this.$nextTick(() => {
                      this.$refs.projectTableData.toggleRowSelection(res.data[k]);
                    })
                  }
                }
              }
            }
          }
        }
      }).catch(() => {
      })
    },
    pageSizeChangeHandle (val) {
      this.tableTreeMaps = {}
      this.dataForm.limit = val
      this.getProjectListData()
    },
    pageCurrentChangeHandle (val) {
      this.tableTreeMaps = {}
      this.dataForm.page = val
      this.getProjectListData()
    },
    getChooseRow (val, row) {
      // console.log(val, row)
      // for (let i = 0; i < this.selectData.length; i++) {
      //   if (row.projectId == this.selectData[i].projectId) {
      //     this.selectData.splice(i, 1)
      //   }
      // }
    },
    submitResult () {
      let arrData = []
      let _ = require('lodash')
      let selectionData = this.$refs.projectTableData.selection
      arrData = selectionData.concat(this.selectData)
      let arr = _.uniqBy(arrData, 'projectId')
      let nArr = arr.filter(item => item !== undefined)
      this.$emit("closeAuth", nArr);
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
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.spanList {
  margin: 0 10px;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
</style>
