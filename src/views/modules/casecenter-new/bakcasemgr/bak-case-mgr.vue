<template>
  <el-row class="bak-case-mgr">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="caseName" label="用例名称">
                <el-input v-model="dataForm.caseName" placeholder="请输入用例名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="caseType" label="用例类型">
                <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getProjectCase()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="8">
              <el-form-item prop="createDate" label="创建时间">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="updateDate" label="修改时间">
                <el-date-picker v-model="dataForm.updateDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-container style="height:760px;">
        <split-bar>
          <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
            <left-tree @watchChildPage="triggerParentMethod"></left-tree>
          </div>
          <el-container slot='split_right'>
            <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
              <el-card shadow="never" class="aui-card--fill">
                <el-row>
                  <el-col :span="12" class="split-line" style="text-align:left;">
                    用例列表
                  </el-col>
                  <el-col :span="12" style="text-align:right;" v-if="nodeType==-2">
                    <el-button type="blue" size="small" @click="doAddCase()">新增</el-button>
                    <el-button type="blue" size="small" @click="doShareCase()">共享</el-button>
                    <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
                  </el-col>
                </el-row>
                <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="620">
                  <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                  <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="doViewCase(scope.row)">{{scope.row.caseName}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="moduleOneName" label="模块一名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="caseType" label="用例类型" header-align="center" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ $getDictLabel('caseType', scope.row.caseType) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="caseClass" label="用例类别" header-align="center" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ $getDictLabel('caseClass', scope.row.caseClass) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="ifShared" label="共享状态" header-align="center" align="center" v-if="nodeType==-2">
                    <template slot-scope="scope">
                      {{ $getDictLabel('ifShared', scope.row.ifShared) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="updateDate" label="修改时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="quoteNum" label="引用次数" header-align="center" align="center"></el-table-column>
                  <el-table-column label="操作" width="140" v-if="nodeType==-2">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="doOperation(1,scope.row)">修改</el-button>
                      <el-button type="text" size="small" @click="doOperation(2,scope.row)">{{scope.row.ifShared==1?'不共享':'共享'}}</el-button>
                      <el-button type="text" size="small" @click="doOperation(3,scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
                </el-pagination>
                <!--引入新增修改用例页面-->
                <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
                <!--引入共享用例-->
                <case-share ref="caseShare" :visible.sync="caseShare" @watchChildPage="triggerParentMethod"></case-share>
              </el-card>
            </div>
          </el-container>
        </split-bar>
      </el-container>
    </el-col>
  </el-row>
</template>
<script>
import LeftTree from './left-tree'
import AddOrUpdateCase from './children-page/add-or-update-case'
import CaseShare from './children-page/case-share'
export default {
  name: 'BakCaseMgr',
  components: {
    LeftTree, AddOrUpdateCase, CaseShare
  },
  data () {
    return {
      dataForm: {
        creatorName: '',
        caseName: '',
        caseType: '',
        createDate: '',
        updateDate: '',
        page: 1,
        limit: 10
      },
      treeParams: {
      },
      total: 0,
      caseTableData: [],
      isOpen: false,
      caseShare: false, // 共享用例
      addOrUpdateCase: false, // 用例新增修改状态
      nodeType: -2 // -2:我的用例树;-1:共享用例树
    }
  },
  computed: {},
  mounted () {
    this.getProjectCase()
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectCase()
      } else if (message.type === 'treeReloadTable') {
        this.nodeType = message.data.nodeType
        this.treeParams = message.data
        this.getProjectCase()
      }
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectCase()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectCase()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectCase()
    },
    getProjectCase () {
      let params = { ...this.dataForm, ...this.treeParams }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      if (params.updateDate.length > 0) {
        params.updateDateStart = params.updateDate[0]
        params.updateDateEnd = params.updateDate[1]
        delete params['updateDate']
      }
      let url = ''
      params.nodeType = params.nodeType || -2
      if (params.nodeType === -1) {
        url = 'ctc/case/alternative/pageSharedCase'
      } else if (params.nodeType === -2) {
        url = 'ctc/case/alternative/pageUserCase'
      } else {
        url = 'ctc/case/alternative/page'
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    doOperation (type, row) {
      if (type === 1) {
        // 修改用例
        this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.init()
      } else if (type === 2) {
        // 共享用例
        if (row.ifShared === 1) {
          this.$confirm('确定[取消共享]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/ctc/case/alternative/unSharedCase', [row.caseId]).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error('取消共享失败')
              } else {
                this.$message.success('取消共享成功')
                this.getProjectCase()
              }
            }).catch(() => {
            })
          }).catch(() => {
          })
        } else {
          this.$refs.caseShare.init()
          this.$refs.caseShare.caseIds = [row.caseId]
        }
      } else if (type === 3) {
        this.doCaseDelete(row)
      }
    },
    doAddCase () {
      // 新增用例
      this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.dataForm.caseId = ''
      this.$refs.addOrUpdateCase.init()
    },
    doViewCase (row) {
      // 查看用例
      this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
      this.$refs.addOrUpdateCase.init()
    },
    doShareCase () {
      // 共享用例
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        let dataValid = true
        selectionData.forEach((item, index) => {
          if (item.ifShared === 0 && dataValid) {
            caseIds.push(item.caseId)
          } else {
            dataValid = false
          }
        })
        if (dataValid) {
          this.$refs.caseShare.init()
          this.$refs.caseShare.caseIds = caseIds
        } else {
          this.$message.warning('已共享用例，不允许再共享！')
        }
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    // 批量删除
    doBatchDeleteCase () {
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
        })
        this.$confirm('确定删除[用例]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/ctc/case/alternative', { 'data': caseIds }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('用例删除成功')
              this.getProjectCase()
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
      this.$confirm('确定删除[用例]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/case/alternative', { 'data': [row.caseId] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('用例删除成功')
            this.getProjectCase()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss">
.bak-case-mgr {
}
</style>
<style  lang="scss" scoped>
.bak-case-mgr {
}
</style>
