<template>
    <el-row class="project-mgr-page">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工单编号：" prop="workNo">
                                <el-input v-model="dataForm.workNo" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="申请人：" prop="operateAcctName">
                                <el-input v-model="dataForm.operateAcctName" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单类型：" prop="type">
                                <ctc-select v-model="dataForm.type" dict-type="approvalType" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" align="right">
                            <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                            <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
                            <el-button size="small" @click="resetForm()">重置</el-button>
                        </el-col>
                    </el-row>
                    <el-row v-if="isOpen">
                        <el-col :span="6">
                            <el-form-item label="工单状态：" prop="approvalResult">
                                <ctc-select v-model="dataForm.approvalResult" dict-type="approvalResult" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="24" style="margin-top:24px;">
            <el-card shadow="never" class="aui-card--fill">
                <el-row style="margin-bottom:20px;">
                    <el-col :span="12" class="split-line" style="text-align:left;">
                        列表展示  <span>（待审批： {{Pending}} 个）</span>
                    </el-col>
                    <el-col :span="12" align="right">
                        <el-button :type="dataListSelections.length>0?'primary':'warning'" size="small" @click="createConfig('批量审批','3')">批量审批</el-button>
                    </el-col>
                </el-row>
                <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
                    <el-table-column :selectable="selectable" type="selection" width="45"></el-table-column>
                    <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                    <template v-for="(item, index) in titleDataList">
                        <template v-if="item.code==='workNo'">
                            <el-table-column :key="index" :label="item.name" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="createConfig('查看','2',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column :key="index" :label="item.name" align="center">
                                <template slot-scope="scope">
                                    <span v-html="getTableColumnData(scope.row,item)"></span>
                                </template>
                            </el-table-column>
                        </template>
                    </template>
                    <el-table-column label="操作" header-align="center" align="center" width="80">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.approvalResult!==0" @click="createConfig('审批','1',scope.row)" type="text" size="small">审批</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
                <add-or-updata v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="getProjectInfo(1)" @init="addOrUpdataVisible = false"></add-or-updata>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import addOrUpdata from '@/views/modules/accountManagement4A/addOrUpdata'
export default {
  mixins: [mixinViewModule],
  name: 'approvalList',
  components: {
    addOrUpdata
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      Pending: 0,
      dataForm: {
        workNo: '', // 工单编号
        operateAcctName: '', // 申请人
        type: '', // 工单类型
        approvalResult: '' // 工单状态
      },
      titleDataList: [
        {
          name: '工单编号',
          code: 'workNo'
        },
        {
          name: '工单类型',
          code: 'type'
        },
        {
          name: '申请人',
          code: 'operateAcctName'
        },
        {
          name: '创建时间',
          code: 'createDate'
        },
        {
          name: '工单状态',
          code: 'approvalResult'
        }
      ],
      dataList: [],
      refDemand: false,
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get('audit4ASw') // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
    }
  },
  computed: {},
  mounted () {
    this.getProjectInfo()
  },
  methods: {
    handleSizeChange (val) {
      this.page = 1
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
    selectable (row, index) {
      if (this.dataList.some(el => { return row.approvalResult !== 0 })) {
        return false
      } else {
        return true
      }
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      this.$http.get('/account4a/acctApprove/list', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = res.data.list
          this.total = res.data.total
          this.showshenpiNum()
        }
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
        this.total = 0
      })
    },
    showshenpiNum () {
      this.dataListLoading = true
      this.$http.get('/account4a/acctApprove/todo/count').then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.Pending = 0
        } else {
          this.Pending = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
        this.Pending = 0
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'type') {
        columnValue = this.$getDictLabel('approvalType', row[item.code])
      } else if (item.code === 'approvalResult') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    viewDetails (row) {
      this.addOrUpdataOrLookVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdataOrLook.init('demandWarehouse', 'look', row)
      })
    },
    doTableOperate (type, row) {
      if (type === 0) { // 编辑
        this.addOrUpdataOrLookVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdataOrLook.init('demandWarehouse', 'update', row)
        })
      } else if (type === 1) { // 删除
        this.dels(row.demandId)
      }
    },
    createConfig (title, type, data) {
      if (type === '1') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '7')
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      } else if (type === '2') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '10')
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      } else if (type === '3') {
        if (this.dataListSelections.length === 0) {
          this.$message.warning('请选择需要审批的列表！！！')
        } else {
          let params = {}
          params.id = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            params.id.push(this.dataListSelections[i].id)
          }
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(title, '12')
            this.$refs.addOrUpdata.selectData = params
          })
        }
      }
    },
    doDelete (params) {
      this.$prompt('注销原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请填写注销原因'
      }).then(({ value }) => {
        if (!value) {
          return this.$message({ type: 'warning', message: '请填写注销原因！！！' })
        }
        params.yy = value
        this.$http.post('/account4a/account/cancel', params).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            // this.$message.success('项目删除成功')
            this.getProjectInfo()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    doRefDemand () {
      // 引用需求
      this.$refs.refDemand.init()
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctcLoading.open()
        this.$http.delete('/ctc/plan/demand/' + id, {}).then(({ data: res }) => {
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
  }
}
</script>
<style lang="scss" scoped>
</style>
