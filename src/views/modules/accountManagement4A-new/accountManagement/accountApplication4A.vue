<template>
    <el-row class="project-mgr-page account-4a">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="110px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="4A主账号：" prop="loginName">
                                <el-input v-model="dataForm.loginName" placeholder="请输入（回车可查询）" clearable  @keyup.enter.native="getProjectInfo(1)"></el-input>
                            </el-form-item>
                        </el-col>
<!--                        <el-col :span="6">-->
<!--                            <el-form-item label="手机号：" prop="mobile">-->
<!--                                <el-input v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
                        <el-col :span="16" align="right">
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
                    <el-col :span="6" class="split-line" style="text-align:left;">
                        列表展示
                    </el-col>
                </el-row>
                <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
<!--                    <el-table-column :selectable="selectable" type="selection" width="45"></el-table-column>-->
                    <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                    <template v-for="(item, index) in titleDataList">
                        <template v-if="item.code==='loginName'">
                            <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button @click="createConfig('查看','1',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
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
                </el-table>
<!--                <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">-->
<!--                </el-pagination>-->
                <dialog-public v-if="dialogPublicVisible" ref="dialogPublic" @refresh="getProjectInfo(1)" @init="dialogPublicVisible = false"></dialog-public>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import dialogPublic from '@/views/modules/accountManagement4A-new/dialogPublic'
export default {
  mixins: [mixinViewModule],
  name: 'demand-warehouse',
  components: {
    dialogPublic
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      dialogPublicVisible: false,
      dataForm: {
        loginName: '', // 姓名
        mobile: '' // 手机号
      },
      titleDataList: [
        {
          name: '4A主账号',
          code: 'loginName'
        },
        {
          name: '姓名',
          code: 'name'
        },
        {
          name: '部门/项目组',
          code: 'orgName'
        },
        {
          name: '图形堡垒权限',
          code: 'isGfort'
        },
        {
          name: 'VPN权限',
          code: 'canLoginWay'
        },
        {
          name: '账号类型',
          code: 'sysAcctType'
        },
        {
          name: '所属机构/部门/科室',
          code: 'organName'
        },
        {
          name: '服务机构/部门/科室',
          code: 'serviceOrgName'
        },
        {
          name: '账号角色',
          code: 'roleNames'
        },
        {
          name: '申请人',
          code: 'userName'
        },
        {
          name: '申请时间',
          code: 'createDate'
        }
      ],
      dataList: [],
      selectList: [],
      refDemand: false,
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:集中化测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get('audit4ASw') // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
    }
  },
  computed: {},
  mounted () {
    // this.getProjectInfo()
  },
  methods: {
    selectable (row, index) {
      if (this.dataList.some(el => { return row.status !== 1 })) {
        return false
      } else {
        return true
      }
    },
    // handleSizeChange (val) {
    //   this.page = 1
    //   this.limit = val
    //   this.getProjectInfo()
    // },
    // handleCurrentChange (val) {
    //   this.page = val
    //   this.getProjectInfo()
    // },
    resetForm (formName) {
      // this.dataForm.orgId = []
      this.$refs.dataForm.resetFields()
      this.dataList = []
      // this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let { orgId, ...newDataForm } = this.dataForm
      let params = { orgId: this.dataForm.orgId ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : '', ...newDataForm }
      this.$http.get('/account4a/account/acctInfo', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = [res.data]
          // this.total = res.data.total
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
      } else if (item.code === 'sysAcctType') {
        columnValue = this.$getDictLabel('accTypeNew', row[item.code])
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
      // 1 查看
      if (type === '1') {
        this.dialogPublicVisible = true
        this.$nextTick(() => {
          this.$refs.dialogPublic.init(title, type)
          if (data) {
            this.$refs.dialogPublic.selectData = data
          }
        })
      } else {
        this.dialogPublicVisible = true
        this.$nextTick(() => {
          this.$refs.dialogPublic.init(title, type)
          if (data) {
            this.$refs.dialogPublic.selectData = data
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
