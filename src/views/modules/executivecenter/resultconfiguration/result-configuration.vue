<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="dataForm.projectName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18" align="right">
              <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange" style="margin:0px 5px;">全选</el-checkbox>
              <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row>
          <el-col :span="12" class="split-line" style="text-align:left;">
            列表展示
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" size="small" @click="createConfig">新建</el-button>
            <el-button type="danger" size="small" @click="delConfig">删除</el-button>
          </el-col>
        </el-row>
        <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" max-height="600" style="width: 100%;">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
            <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button @click="doTableOperate(0,scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="doTableOperate(1,scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50,50000]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
        <perform-result-configuration-updata-or-create v-if="performResultConfigurationUpdataOrCreateVisible" ref="performResultConfigurationUpdataOrCreate" @refresh="getProjectInfo(1)" @init="performResultConfigurationUpdataOrCreateVisible = false"></perform-result-configuration-updata-or-create>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import performResultConfigurationUpdataOrCreate from '@/views/modules/executivecenter/resultconfiguration/perform-result-configuration-updata-or-create'
export default {
  mixins: [mixinViewModule],
  name: 'result-configuration',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      performResultConfigurationUpdataOrCreateVisible: false,
      dataForm: {
        projectName: '', // 工单名称
        authLevel: '', // 权限级别
        resultType: '' // 执行结果
      },
      batchCheckAll: false,
      titleDataList: [],
      dataList: []
    }
  },
  computed: {},
  mounted () {
    this.getProjectInfo()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      this.getProjectInfo()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getProjectInfo()
    },
    resetForm (formName) {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo(1)
    },
    batchCheckAllChange (item) {
      if (item) {
        this.limit = 50000
      } else {
        this.limit = 10
      }
      this.getProjectInfo()
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      this.$http.get('/ctc/exec/result_config/list', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.titleDataList = res.data.head
          this.dataList = res.data.data.list
          this.total = res.data.data.total
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'authLevel') {
        columnValue = this.$getDictLabel('permissionLevel', row[item.code])
      } else if (item.code === 'resultTypes') {
        columnValue = row[item.code].join(',')
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doTableOperate (type, row) {
      if (type === 0) { // 编辑
        this.performResultConfigurationUpdataOrCreateVisible = true
        this.$nextTick(() => {
          this.$refs.performResultConfigurationUpdataOrCreate.init('updata', row)
        })
      } else if (type === 1) { // 删除
        this.dels([row.configId])
      }
    },
    createConfig () {
      // let list = this.dataListSelections
      // console.log(list)
      this.performResultConfigurationUpdataOrCreateVisible = true
      this.$nextTick(() => {
        this.$refs.performResultConfigurationUpdataOrCreate.init('create')
      })
    },
    delConfig () {
      if (this.dataListSelections.length !== 0) {
        let id = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          id.push(this.dataListSelections[i].configId)
        }
        this.dels(id)
      } else {
        this.$message.warning('请选择需要删除项！！！')
      }
    },
    dels (id) {
      this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctcLoading.open()
        this.$http.delete('/ctc/exec/result_config/deleteBatch', { 'data': id }).then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.getProjectInfo(1)
          }
        }).catch(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
      })
    }
  },
  components: {
    performResultConfigurationUpdataOrCreate
  }
}
</script>
<style lang="scss" scoped>
</style>
