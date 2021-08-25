<template>
    <el-row class="project-mgr-page account-4a">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="账号：" label-width="60px" prop="name">
                                <el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="部门/项目组：">
                                <ctc-project-team v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="organId" label="所属机构：">
                                <ctc-project-organize-table v-model="dataForm.organId" :organizeId.sync="dataForm.organId" placeholder="请选择所属机构"></ctc-project-organize-table>
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
                            <el-form-item prop="status" label-width="60px" label="状态：">
                                <ctc-select v-model="dataForm.status" dict-type="accState" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="approvalStatus" label="审批状态：">
                                <ctc-select v-model="dataForm.approvalStatus" dict-type="approvalResult" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="24" style="margin-top:24px;">
            <el-card shadow="never" class="aui-card--fill">
                <el-row style="margin-bottom:20px;">
                    <el-col :span="6" class="split-line" style="text-align:left;">
                        列表展示
                    </el-col>
                    <el-col :span="18" align="right">
                        <el-button type="primary" size="small" @click="createConfig('主从账号申请','1')">主从账号申请</el-button>
                        <el-button type="primary" size="small" @click="createConfig('主从账号批量申请','2')">主从账号批量申请</el-button>
                        <el-button type="primary" size="small" @click="createConfig('主从账号批量变更','3')">主从账号批量变更</el-button>
                        <el-button-group>
                            <el-button :type="selectList.length>0?'primary':'warning'" size="small" @click="createConfig('账号批量注销','6')">账号批量注销</el-button>
                            <el-badge :value="selectList.length" size="mini" class="item"></el-badge>
                            <el-tooltip class="item" effect="light" content="勾选需要注销的列表，单击推送到批量注销列表，双击可清空列表" placement="top">
                                <el-button @click="createConfig('批量选择','10')" @dblclick.native="createConfig('双击清空','11')" size="small" type="primary">
                                    批量选择
                                    <i class="el-icon-plus"></i>
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
                    <el-table-column :selectable="selectable" type="selection" width="45"></el-table-column>
                    <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                    <template v-for="(item, index) in titleDataList">
                        <template v-if="item.code==='loginName'">
                            <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button @click="createConfig('查看','8',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-else-if="item.code==='status'">
                            <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <template v-if="scope.row.status===3||scope.row.status===5">
                                        <span v-html="getTableColumnData(scope.row,item)"></span><br>
                                        <span style="color: red" v-html="scope.row.msg"></span>
                                    </template>
                                    <template v-else>
                                        <template v-if="scope.row.status===2">
                                            <el-tooltip class="item" effect="light" content="4A账号已注销，请重新申请" placement="top">
                                                <span v-html="getTableColumnData(scope.row,item)"></span>
                                            </el-tooltip>
                                        </template>
                                        <template v-else-if="scope.row.status===4">
                                            <el-tooltip class="item" effect="light" content="15分钟后通过正确密码登录即可解锁" placement="top">
                                                <span v-html="getTableColumnData(scope.row,item)"></span>
                                            </el-tooltip>
                                        </template>
                                        <template v-else>
                                            <span v-html="getTableColumnData(scope.row,item)"></span>
                                        </template>
                                    </template>
                                </template>

<!--                                <template slot-scope="scope">-->
<!--                                    <template v-if="scope.row.status===3||scope.row.status===5">-->
<!--                                        <span v-html="getTableColumnData(scope.row,item)"></span><br>-->
<!--                                        <span style="color: red" v-html="scope.row.msg"></span>-->
<!--                                    </template>-->
<!--                                    <template v-else>-->
<!--                                        <span v-html="getTableColumnData(scope.row,item)"></span>-->
<!--                                    </template>-->
<!--                                </template>-->
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
                            <el-button :disabled="scope.row.status===0||scope.row.status===2||scope.row.status===3" @click="createConfig('账号变更','4',scope.row)" type="text" size="small">账号变更</el-button>
                            <el-button :disabled="scope.row.status===0||scope.row.status===2||scope.row.status===3" @click="createConfig('账号注销','5',scope.row)" type="text"  size="small">账号注销</el-button>
<!--                            <el-button :disabled="scope.row.status!==1" @click="createConfig('账号变更','4',scope.row)" type="text" size="small">账号变更</el-button>-->
<!--                            <el-button :disabled="scope.row.status!==1" @click="createConfig('账号注销','5',scope.row)" type="text"  size="small">账号注销</el-button>-->
                            <el-button :disabled="scope.row.status!==3" @click="createConfig('重新申请','7',scope.row)" type="text"  size="small">重新申请</el-button>
                            <el-button :disabled="scope.row.status!==1" @click="createConfig('关联从账号','9',scope.row)" type="text"  size="small">关联从账号</el-button>
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
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
export default {
  mixins: [mixinViewModule],
  name: 'demand-warehouse',
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
        name: '', // 姓名
        orgId: [],
        organId: '',
        status: '',
        approvalStatus: '' // 审批状态
      },
      titleDataList: [
        {
          name: '账号',
          code: 'loginName'
        },
        {
          name: '姓名',
          code: 'name'
        },
        // {
        //   name: '姓名全拼',
        //   code: 'fullPinyinName'
        // },
        {
          name: '项目组',
          code: 'orgName'
        },
        {
          name: '所属机构',
          code: 'organName'
        },
        // {
        //   name: '申请人',
        //   code: 'creatorName'
        // },
        // {
        //   name: '申请时间',
        //   code: 'createDate'
        // },
        {
          name: '状态',
          code: 'status'
        },
        // {
        //   name: '审批状态',
        //   code: 'approvalStatus'
        // }
        {
          name: 'VPN权限',
          code: 'canLoginWay'
        },
        {
          name: '图形堡垒权限',
          code: 'isGfort'
        },
        {
          name: 'VPN开始时间',
          code: 'vpnEffectTime'
        },
        {
          name: 'VPN结束时间',
          code: 'vpnExpireTime'
        }
      ],
      dataList: [],
      selectList: [],
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
    selectable (row, index) {
      if (this.dataList.some(el => { return row.status !== 1 })) {
        return false
      } else {
        return true
      }
    },
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
      let { orgId, ...newDataForm } = this.dataForm
      let params = { page: this.page, limit: this.limit, orgId: this.dataForm.orgId ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : '', ...newDataForm }
      this.$http.get('/account4a/account/list', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = res.data.list
          this.total = res.data.total
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
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accState', row[item.code])
      } else if (item.code === 'approvalStatus') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else if (item.code === 'canLoginWay') {
        columnValue = this.$getDictLabel('VPNPermission', row[item.code])
      } else if (item.code === 'isGfort') {
        columnValue = this.$getDictLabel('isGfort', row[item.code])
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
      if (type === '5') {
        // let params = {}
        // params.accounts = []
        // params.accounts.push({ loginName: data.loginName })
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, type)
          this.$refs.addOrUpdata.selectData = [data]
        })
      } else if (type === '6') {
        if (this.selectList.length === 0) {
          this.$message.warning('请选择需要注销的列表！！！')
        } else {
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(title, type)
            this.$refs.addOrUpdata.selectData = this.selectList
          })
        }
      } else if (type === '7') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '1')
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      } else if (type === '10') {
        // this.openLock()
        for (let i = 0; i < this.dataListSelections.length; i++) {
          if (this.dataListSelections[i].status !== 1) {
            return this.$message.warning('请选择状态为正常列表！！！')
          }
        }
        let newList = this.selectList.concat(this.dataListSelections)
        let obj = {}
        let peon = newList.reduce((cur, next) => {
          // eslint-disable-next-line no-unused-expressions
          obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
          return cur
        }, []) // 设置cur默认类型为数组，并且初始值为空的数组
        this.selectList = peon
      } else if (type === '11') {
        console.log(1)
        this.selectList = []
      } else {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, type)
          if (data) {
            this.$refs.addOrUpdata.selectData = data
          }
        })
      }
    },
    openLock (id) {
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
    .account-4a{
        .el-button-group {
            vertical-align: bottom;
            margin-left: 10px;
            .el-button--primary:last-child{
                height: 32px;
            }
        }
    }
</style>
