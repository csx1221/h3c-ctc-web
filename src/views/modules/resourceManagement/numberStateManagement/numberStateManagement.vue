<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="手机号码" prop="number">
                <el-input v-model="dataForm.number" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="锁定状态：" prop="lockState">
                <ctc-select v-model="dataForm.lockState" dict-type="lockState" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台：" prop="platform">
                <!--                              <ctc-platform-list v-model="dataForm.platform" :level="'1'" :placeholder="'请选择'"></ctc-platform-list>-->
                <ctc-select v-model="dataForm.platform" dict-type="platform" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
<!--              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>-->
              <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
<!--          <el-row v-if="isOpen">-->
<!--          </el-row>-->
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
            <el-button type="primary" size="small" @click="createConfig('批量锁定','1',1)">批量锁定</el-button>
            <el-button :type="dataListSelections.length>0?'primary':'warning'" size="small" @click="createConfig('批量解锁','4',0)">批量解锁</el-button>
          </el-col>
        </el-row>
        <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
            <template v-if="item.code==='loginName'">
              <el-table-column :key="index" :label="item.name" align="center">
                <template slot-scope="scope">
                  <el-button @click="createConfig('查看','5',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-html="getTableColumnData(scope.row,item)"></span>
                </template>
              </el-table-column>
            </template>
          </template>
          <el-table-column fixed="right" label="操作" header-align="center" align="center" width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.lockState===1" @click="createConfig('解锁','3',scope.row,0)" type="text" size="small">解锁</el-button>
              <el-button v-else @click="createConfig('锁定','2',scope.row,1)" type="text"  size="small">锁定</el-button>
              <el-button @click="createConfig('操作历史','6',scope.row)" type="text"  size="small">操作历史</el-button>
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
import addOrUpdata from '@/views/modules/resourceManagement/numberManagement/addOrUpdata'
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'numberStateManagement',
  components: {
    addOrUpdata,
    CtcProjectOrganizeTable
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      dataForm: {
        number: '', // 发送手机号码
        lockState: '',
        platform: ''
      },
      titleDataList: [
        {
          name: '卡号',
          code: 'number'
        },
        {
          name: '省份',
          code: 'provinceDefine'
        },
        {
          name: '办卡人',
          code: 'handler'
        },
        // {
        //   name: '办卡人联系方式',
        //   code: 'sendProvinceDefine'
        // },
        {
          name: 'IMSI',
          code: 'imsi'
        },
        {
          name: '所属平台',
          code: 'platformDefine'
        },
        {
          name: '锁定状态',
          code: 'lockState'
        },
        {
          name: '被锁定平台',
          code: 'lockPlatform'
        },
        {
          name: '锁定时间',
          code: 'lockTime'
        },
        {
          name: '锁定截至时间',
          code: 'lockEndTime'
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
    this.getProjectInfo(1)
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
      this.dataForm.orgId = []
      this.$refs.dataForm.resetFields()
      this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      this.$http.get('/ctc/resource/lock/manager/page', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = res.data.list
          this.total = res.data.totalCount
        }
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
        this.total = 0
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'lockState') {
        columnValue = this.$getDictLabel('lockState', row[item.code])
      } else if (item.code === 'lockPlatform') {
        columnValue = this.$getDictLabel('platform', row[item.code])
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
    createConfig (title, type, data, state) {
      // 4 清理设置 5 短信详情查看 6操作历史
      if (type === '1' || type === '4') {
        if (this.dataListSelections.length !== 0) {
          let number = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            number.push(this.dataListSelections[i].number)
          }
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(title, '7')
            this.$refs.addOrUpdata.listId = number
            this.$refs.addOrUpdata.lockState = data
          })
        } else {
          this.$message.warning('请选择需要锁定项！！！')
        }
      } else if (type === '2' || type === '3') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '7')
          this.$refs.addOrUpdata.listId = [data.number]
          this.$refs.addOrUpdata.lockState = state
        })
      } else if (type === '6') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '8')
          this.$refs.addOrUpdata.selectData = data
        })
      } else if (type === '7') {
        if (this.dataListSelections.length !== 0) {
          let smsIds = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            smsIds.push(this.dataListSelections[i].smsId)
          }
          this.doExport(smsIds)
        } else {
          this.$message.warning('请选择需要导出项！！！')
        }
      } else if (type === '8') {
        this.delConfig()
      } else if (type === '9') {
        this.dels([data.smsId])
      }
    },
    getNumberDetails (number) {
      this.$ctcLoading.open()
      let params = { page: 1, limit: 10, number: number }
      this.$http.get('/ctc/resource/cardnumber/page', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          console.log(res.data.list)
          let data = res.data.list
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init('号码详情', '6')
            if (data) {
              this.$refs.addOrUpdata.selectData = data[0]
            }
          })
        }
      }).catch(() => {
        this.$ctcLoading.close()
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
    },
    doExport (smsIds) {
      let data = { smsIds: smsIds }
      let url = '/ctc/resource/smsManager/exportBatch'
      ctcUtils.customExportPost(url, data)
    },
    delConfig () {
      if (this.dataListSelections.length !== 0) {
        let id = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          id.push(this.dataListSelections[i].smsId)
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
        this.$http.delete('/ctc/resource/smsManager/delBatch', { 'data': id }).then(({ data: res }) => {
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
