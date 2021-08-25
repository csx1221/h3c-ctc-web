<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="需求编号" prop="demandCode">
                <el-input v-model="dataForm.demandCode" placeholder="请输入需求编号/名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求名称" prop="demandName">
                <el-input v-model="dataForm.demandName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人" prop="creator">
                <ctc-person-liable v-model="dataForm.creator" placeholder="请选择创建人" :organizeId.sync="dataForm.creator"></ctc-person-liable>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
          <el-col :span="12" class="split-line" style="text-align:left;">
            列表展示
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" size="small" @click="createConfig">新 建</el-button>
            <el-button type="primary" size="small" @click="doRefDemand">引 用</el-button>
          </el-col>
        </el-row>
        <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
            <el-table-column v-if="item.code==='demandName'" :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <el-button @click="viewDetails(scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.code==='attachementId'" :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <ctc-download-table :id="scope.row.attachementId"></ctc-download-table>
              </template>
            </el-table-column>
            <el-table-column v-else :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope" v-if="scope.row.deUp === 1">
              <el-button @click="doTableOperate(0,scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="doTableOperate(1,scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
        <add-or-updata-or-look v-if="addOrUpdataOrLookVisible" ref="addOrUpdataOrLook" @refresh="getProjectInfo(1)" @init="addOrUpdataOrLookVisible = false"></add-or-updata-or-look>
        <!--引入需求-->
        <ref-demand ref="refDemand" :visible.sync="refDemand" @watchChildPage="triggerParentMethod"></ref-demand>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import addOrUpdataOrLook from '@/components/programmecntre/add-or-updata-or-look'
import ctcPersonLiable from '@/components/programmecntre/ctc-person-liable'
import RefDemand from './ref-demand'
export default {
  mixins: [mixinViewModule],
  name: 'demand-warehouse',
  components: {
    addOrUpdataOrLook, ctcPersonLiable, RefDemand
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      addOrUpdataOrLookVisible: false,
      dataForm: {
        demandCode: '', // 需求编号
        demandName: '', // 需求名称
        demandSide: '', // 需求方
        creator: '' // 创建人
      },
      titleDataList: [],
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
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectInfo(1)
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
    resetForm (formName) {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      this.dataList = []
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      this.$http.get('/ctc/plan/demand/page', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.titleDataList = res.data.head
          // 判断登录方式(0:云测试平台门户登录;1:4A登录)
          if (this.audit4ASw === '1') {
            this.titleDataList = this.titleDataList.filter((item) => {
              return !['contactPhone'].includes(item.code)
            })
          }
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
      } else if (item.code === 'demandUseScope') {
        columnValue = this.$getDictLabel('scopeOfRequirements', row[item.code])
      } else if (item.code === 'resultTypes') {
        columnValue = row[item.code].join(',')
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
    createConfig () {
      // let list = this.dataListSelections
      // console.log(list)
      this.addOrUpdataOrLookVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdataOrLook.init('demandWarehouse', 'create')
        // this.$refs.addOrUpdataOrLook.init('demandMenagement', 'create')
        // this.$refs.addOrUpdataOrLook.init('demandWarehouse', 'create')
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
