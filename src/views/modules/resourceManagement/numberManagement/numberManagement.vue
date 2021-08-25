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
                            <el-form-item label="省份：" prop="province">
                                <ctc-province-team v-model="dataForm.province" :level="'1'"  :placeholder="'请选择'"></ctc-province-team>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="运营商：" prop="operator">
                                <ctc-select v-model="dataForm.operator" dict-type="operators" placeholder="请选择"></ctc-select>
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
                            <el-form-item label="品牌：" prop="brand">
                                <ctc-select v-model="dataForm.brand" dict-type="brand" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="IMSI" prop="imsi">
                                <el-input v-model="dataForm.imsi" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="办卡人" prop="handler">
                                <el-input v-model="dataForm.handler" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="isOpen">
                        <el-col :span="6">
                            <el-form-item label="创建人" prop="creatorName">
<!--                              <ctc-person-liable v-model="dataForm.creator" placeholder="请选择" :organizeId.sync="dataForm.creator"></ctc-person-liable>-->
                                <el-input v-model="dataForm.creatorName" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="createDate" label="创建时间">
                                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                      <el-col :span="6">
                        <el-form-item label="在线状态：" prop="lineState">
                          <ctc-select v-model="dataForm.lineState" dict-type="lineState" placeholder="请选择"></ctc-select>
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
                        列表展示
                    </el-col>
                    <el-col :span="12" align="right">
                        <el-button type="primary" size="small" @click="createConfig('新增号码','1')">新增号码</el-button>
                        <el-button type="primary" size="small" @click="createConfig('批量导入','5')">批量导入</el-button>
                        <el-button :type="dataListSelections.length>0?'primary':'warning'" size="small" @click="createConfig('批量导出','6')">批量导出</el-button>
                        <el-button :type="dataListSelections.length>0?'primary':'warning'" size="small" @click="createConfig('批量删除','4')">批量删除</el-button>
                      <el-button :type="dataListSelections.length>0?'primary':'warning'" size="small" @click="createConfig('批量清理设置','10')">批量清理设置</el-button>
                    </el-col>
                </el-row>
                <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
                    <el-table-column type="selection" width="45"></el-table-column>
                    <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                    <template v-for="(item, index) in titleDataList">
                        <template v-if="item.code==='number'">
                            <el-table-column :key="index" :label="item.name" align="center" width="110">
                                <template slot-scope="scope">
                                    <el-button @click="createConfig('查看','8',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
                                </template>
                            </el-table-column>
                        </template>
                      <template v-else-if="item.code==='serviceNo'">
                        <el-table-column :key="index" :label="item.name" align="center">
                          <template slot-scope="scope">
                            <span v-html="scope.row.serviceNo"></span>
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
                    <el-table-column fixed="right" label="操作" header-align="center" align="center" width="220">
                        <template slot-scope="scope">
                            <el-button v-if="!$route.params.number" @click="createConfig(scope.row.number,'2',scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="createConfig('删除','3',scope.row)" type="text"  size="small">删除</el-button>
                            <el-button v-if="!$route.params.number" @click="createConfig('历史短信'+scope.row.number,'7',scope.row)" type="text"  size="small">历史短信</el-button>
                          <el-button @click="createConfig('清理设置','9',scope.row)" type="text"  size="small">清理设置</el-button>
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
import ctcPersonLiable from '@/components/programmecntre/ctc-person-liable'
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'numberManagement',
  components: {
    addOrUpdata,
    CtcProjectOrganizeTable,
    ctcPersonLiable
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      dataForm: {
        number: '', // 手机号码
        province: '',
        operator: '', // 运营商
        brand: '', // 品牌
        imsi: '', // imsi
        handler: '', // 办卡人
        creatorName: '', // 创建人
        createDate: [], // 创建时间区间
        lineState: '' // 在线状态
      },
      titleDataList: [
        {
          name: '手机号码',
          code: 'number'
        },
        {
          name: '省份',
          code: 'provinceDefine'
        },
        {
          name: '运营商',
          code: 'operator'
        },
        {
          name: 'IMSI',
          code: 'imsi'
        },
        {
          name: '所属平台',
          code: 'platformDefine'
        },
        {
          name: '品牌',
          code: 'brand'
        },
        {
          name: '服务密码',
          code: 'serviceNo'
        },
        {
          name: '办卡人',
          code: 'handler'
        },
        {
          name: '在线状态',
          code: 'lineState'
        },
        {
          name: '锁定状态',
          code: 'lockState'
        },
        {
          name: '锁定平台',
          code: 'lockPlatform'
        },
        {
          name: '状态',
          code: 'state'
        },
        {
          name: '创建人',
          code: 'creatorName'
        },
        {
          name: '创建时间',
          code: 'createDate'
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
    if (this.$route.params.number) {
      this.dataForm.number = this.$route.params.number
    }
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
    // 去重方法
    _uniqueHandle (arr) {
      const res = new Map()
      console.log(res)
      return arr.filter((arr) => !res.has(arr.number) && res.set(arr.number, 1))
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let params1 = Object.assign({}, this.dataForm)
      // 特殊处理创建日期、修改日期
      if (params1.createDate.length > 0) {
        params1.createStartDate = params1.createDate[0]
        params1.createFinishDate = params1.createDate[1]
        delete params1['createDate']
      }
      let params = { page: this.page, limit: this.limit, ...params1 }
      this.$http.get('/ctc/resource/cardnumber/page', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        console.log(res.data.list)
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = this._uniqueHandle(res.data.list)
          this.total = res.data.totalCount
        }
        console.log(this.dataList)
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
        this.total = 0
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'perators') {
        columnValue = this.$getDictLabel('platform', row[item.code])
      } else if (item.code === 'state') {
        columnValue = this.$getDictLabel('numberStatus', row[item.code])
      } else if (item.code === 'brand') {
        columnValue = this.$getDictLabel('brand', row[item.code])
      } else if (item.code === 'operator') {
        columnValue = this.$getDictLabel('operators', row[item.code])
      } else if (item.code === 'lineState') {
        columnValue = this.$getDictLabel('lineState', row[item.code])
      } else if (item.code === 'lockState') {
        columnValue = this.$getDictLabel('lockState', row[item.code])
      } else if (item.code === 'lockPlatform') {
        columnValue = this.$getDictLabel('lockPlatform', row[item.code])
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
      // 1 新增号码  2 编辑号码 3删除 4批量删除 5批量导入 6 批量导出 7 历史短信 8查看 9清理设置
      if (type === '1' || type === '2') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, type)
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      } else if (type === '3') {
        this.dels([data.cardNumberId])
      } else if (type === '4') {
        this.delConfig()
      } else if (type === '5') {
        // let params = {}
        // params.accounts = []
        // params.accounts.push({ loginName: data.loginName })
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '3')
          // this.$refs.addOrUpdata.selectData = params
        })
      } else if (type === '6') {
        if (this.dataListSelections.length !== 0) {
          let cardNumberIds = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            cardNumberIds.push(this.dataListSelections[i].cardNumberId)
          }
          this.doExport(cardNumberIds)
        } else {
          this.$message.warning('请选择需要导出项！！！')
        }
      } else if (type === '7') {
        let path = 'resourceManagement/SMSManagement/SMSManagement'
        let childrenTitle = title
        let params = {}
        params.number = data.number || ''
        this.customAddDynamicRoute(path, childrenTitle, params)
      } else if (type === '8') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '6')
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      } else if (type === '9') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '4')
          this.$refs.addOrUpdata.listId = [data.number]
          this.$refs.addOrUpdata.operationType = '1'
        })
      } else if (type === '10') {
        if (this.dataListSelections.length !== 0) {
          let number = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            number.push(this.dataListSelections[i].number)
          }
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(title, '4')
            this.$refs.addOrUpdata.listId = number
            this.$refs.addOrUpdata.operationType = '2'
          })
        } else {
          this.$message.warning('请选择需要设置项！！！')
        }
      }
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
    doExport (cardNumberIds) {
      let data = { cardNumberIds: cardNumberIds }
      let url = '/ctc/resource/cardnumber/exportBatch'
      ctcUtils.customExportPost(url, data)
    },
    delConfig () {
      if (this.dataListSelections.length !== 0) {
        let id = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          id.push(this.dataListSelections[i].cardNumberId)
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
        this.$http.delete('/ctc/resource/cardnumber/delBatch', { 'data': id }).then(({ data: res }) => {
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
