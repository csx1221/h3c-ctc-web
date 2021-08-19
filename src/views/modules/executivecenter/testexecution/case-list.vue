<template>
  <el-card shadow="never" class="aui-card--fill  project-mgr-page">
    <el-form class="main_el_form" ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用例名称" prop="caseName">
            <el-input v-model="dataForm.caseName" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结果断定" prop="result">
            <ctc-select v-model="dataForm.result" dict-type="resultDetermination" placeholder="请选择"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行人" prop="executor">
            <el-input v-model="dataForm.executor" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:10px;margin-top:10px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        列表展示
      </el-col>
      <el-col :span="12" align="right">
        <el-button type="warning" size="small" @click="resultE(2)">批量录入</el-button>
        <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
        <!--<el-button type="danger" size="small" @click="delUseCase()">批量删除</el-button>-->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tree highlight-current ref="organizeTreeData" :data="organizeTreeData" default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={1:项目;2子项目;}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.name}}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-table stripe :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
            <el-table-column v-if="item.code!='caseName'" :key="index" :label="item.name" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)"></span>
              </template>
            </el-table-column>
            <el-table-column v-else :key="index" :label="item.name" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="useCase(scope.row)" style="color: #4190f7;cursor:pointer;">{{getTableColumnData(scope.row,item)}}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" header-align="center" align="center" width="120px">
            <template slot-scope="scope">
              <el-button @click="doTableOperate(0,scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="doTableOperate(1,scope.row)" type="text" size="small">结果录入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-row>
    <!--结果录入-->
    <result-entry ref="resultEntry" v-if="resultEntryVisible" @refresh="getProjectInfo()" @init="resultEntryVisible = false"></result-entry>
    <!--查看用例详情-->
    <use-case-details v-if="useCaseDetailsVisible" ref="useCaseDetails" @init="useCaseDetailsVisible = false"></use-case-details>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import resultEntry from '@/views/modules/executivecenter/testexecution/result-entry'
import useCaseDetails from '@/views/modules/executivecenter/testexecution/use-case-details'
export default {
  mixins: [mixinViewModule],
  name: 'case-list',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      resultEntryVisible: false,
      useCaseDetailsVisible: false,
      dataForm: {
        caseName: '',
        result: '',
        orderType: '',
        organizeId: '',
        executor: ''
      },
      titleDataList: [
        {
          'code': 'caseCode',
          'name': '用例编号'
        },
        {
          'code': 'caseName',
          'name': '用例名称'
        },
        {
          'code': 'organizeName',
          'name': '机构名称'
        },
        {
          'code': 'result',
          'name': '结果断定'
        },
        {
          'code': 'defectCount',
          'name': '缺陷数'
        },
        {
          'code': 'executeName',
          'name': '执行人'
        },
        {
          'code': 'executeDate',
          'name': '执行时间'
        },
        {
          'code': 'remark',
          'name': '备注'
        }
      ],
      dataList: [],
      orderId: '',
      handlerType: '',
      orderDealId: '',
      organizeTreeData: [],
      defaultProps: {
        children: 'list',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.orderId = this.$route.params.rows.orderId
      this.handlerType = this.$route.params.rows.handlerType
      this.orderDealId = this.$route.params.rows.orderDealId
      this.organizeId = this.$route.params.rows.organizeId
      this.getOrganizeTreeData()
      this.getProjectInfo()
    },
    getOrganizeTreeData () {
      let params = { orderId: this.orderId, handlerType: this.handlerType, organizeId: this.organizeId }
      this.$http.get('/ctc/task/participant/listByParams', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let list = res.data
        let newData = []
        for (let i = 0; i < list.length; i++) {
          let node = {}
          let nodeList = []
          node.name = list[i].organizeTypeName
          node.nodeType = 1
          for (let j = 0; j < list[i].list.length; j++) {
            nodeList.push({ nodeType: 2, ...list[i].list[j] })
          }
          node.list = nodeList
          newData.push(node)
        }
        this.organizeTreeData = newData
      }).catch(() => { })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'sys_icon_1'
        } else if (data.nodeType === 2) {
          icon = 'sys_icon_4'
        } else if (data.nodeType === 4) {
          icon = 'sys_icon_4'
        }
        return require('../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '2': '参测对象', '4': '项目成员' }
        if (mapInfo[data.nodeType]) {
          return mapInfo[data.nodeType] + '：' + data.name
        } else {
          return data.name
        }
      }
    },
    handleNodeClick (data) {
      if (data.nodeType === 2) {
        this.dataForm.organizeId = data.id
        this.getProjectInfo()
      }
    },
    handleSizeChange (val) {
      this.limit = val
      this.getProjectInfo()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getProjectInfo()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.dataForm.organizeId = ''
      this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      this.page = val || this.page || 1
      this.dataListLoading = true
      if (this.handlerType !== 1) {
        this.dataForm.organizeId = this.organizeId
      }
      let params = { page: this.page, limit: this.limit, orderId: this.orderId, handlerType: this.handlerType, orderDealId: this.orderDealId, ...this.dataForm }
      this.$http.get('/ctc/exec/caseList', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          // this.titleDataList = res.data.head
          this.dataList = res.data.data.list
          this.total = res.data.data.total
        }
      }).catch(() => {
        this.dataListLoading = false
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'result') {
        columnValue = this.$getDictLabel('resultDetermination', row[item.code])
      } else if (item.code === 'remark') {
        columnValue = row.notTestReason || row.remark
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doTableOperate (type, row) {
      if (type === 0) { // 查看
        this.useCase(row)
      } else if (type === 1) { // 结果录入
        this.resultEntryVisible = true
        this.$nextTick(() => {
          this.$refs.resultEntry.init(1, row.caseId, row)
        })
      }
    },
    resultE (type) {
      if (this.dataListSelections.length !== 0) {
        this.resultEntryVisible = true
        let ids = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ids.push(this.dataListSelections[i].caseId)
        }
        this.$nextTick(() => {
          this.$refs.resultEntry.init(type, ids.join(','), this.dataListSelections[0])
        })
      } else {
        this.$message.warning('请选择需要录入的用例！！！')
      }
    },
    useCase (row) {
      this.useCaseDetailsVisible = true
      this.$nextTick(() => {
        this.$refs.useCaseDetails.init(row)
      })
    },
    delUseCase () {
      if (this.dataListSelections.length !== 0) {
        this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            params.push(this.dataListSelections[i].caseId)
          }
          this.$ctcLoading.open()
          this.$http.delete('/ctc/exec/case', { 'data': params }).then(({ data: res }) => {
            this.$ctcLoading.close()
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.getProjectInfo(1)
            }
          }).catch(() => {
            this.$ctcLoading.close()
          }).finally(() => {
            this.$ctcLoading.close()
          })
        }).catch(() => {
        })
      } else {
        this.$message.warning('请选择需要删除的用例！！！')
      }
    }
  },
  components: {
    resultEntry,
    useCaseDetails
  }
}
</script>
<style lang="scss" scoped>
.main_el_form {
  .el-select {
    width: 100%;
  }
}
</style>
