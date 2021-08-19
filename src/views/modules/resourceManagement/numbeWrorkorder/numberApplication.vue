<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-divider content-position="left"><span style="color: #26c6da; font-size: 15px">申请单信息</span></el-divider>
    <el-form ref="form" :rules="dataRule" :model="form" label-width="100px" class="biaodan">
      <el-form-item label="申请标题:" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="申请人:">
        <el-input disabled v-model="form.applyName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请理由:" prop="desc">
        <el-input type="textarea" v-model="form.reason"></el-input>
      </el-form-item>
    </el-form>
    <el-col :span="24" style="margin-top: 24px">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom: 20px">
          <el-col :span="12" class="split-line" style="text-align: left">
            卡号列表
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" size="small"  @click="addclick = true">增加</el-button>
            <el-button  :type="dataListSelections.length > 0 ? 'primary' : 'warning'"  size="small"  @click="doTableOperate"  >批量删除</el-button>
          </el-col>
        </el-row>
        <el-table  v-loading="dataListLoading"  :data="dataForm.clicklist" @selection-change="dataListSelectionChangeHandle"  border  style="width: 100%">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column  prop="number"  label="卡号"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="platformDefine"  label="省份"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="cityDefine"  label="城市"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="imsi"  label="IMSI"  header-align="center"  align="center"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="brandDefine"  label="品牌"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="platformDefine"  label="所属平台"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="owner"  label="负责人"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <!-- <el-table-column  prop="contract"  label="负责人联系方式"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column> -->
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template>
              <el-button  @click="del"  type="text"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <add-or-updata  v-if="addOrUpdataVisible"  ref="addOrUpdata"  @refresh="getPhoneData"  @init="addOrUpdataVisible = false"></add-or-updata>
        <div  align="center" style="margintop: 20px">
          <el-button  type="primary"  size="middle"  @click="handleSubmit(form)">提交申请</el-button>
          <el-button  type="primary"  size="middle"  @click="handleCancel()">取消</el-button>
        </div>
      </el-card>
    </el-col>
    <!-- 显示增加的按钮 -->
    <el-dialog  title="信息"  :visible.sync="addclick"  width="80%">
    <el-col :span="24" style="margin-top:24px;">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="卡号" prop=" number ">
                                <el-input v-model="dataForm.number" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="省份：" prop="provinceDefine">
                                <el-input v-model="dataForm.provinceDefine" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" align="right">
                            <el-button type="primary" size="small" @click="queryClick">查询</el-button>
                            <el-button size="small" @click="resetForm()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
    </el-col>
    <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
            <el-col :span="12" class="split-line" style="text-align:left;">
                卡号列表
            </el-col>
        </el-row>
        <el-table stripe v-loading="dataListLoading" :data="cardnumberList" border ref="numberTable"  @selection-change="clickchange" style="width: 100%;">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <template v-for="(item, index) in titlecardnumberList">
                <template v-if="item.code==='number'">
                    <el-table-column :key="index" :label="item.name" align="center" width="110">
                        <template slot-scope="scope">
                            <span  size="small">{{getTableColumnData(scope.row,item)}}</span>
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
        </el-table>
        <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
        <add-or-updata v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="getProjectInfo(1)" @init="addOrUpdataVisible = false"></add-or-updata>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addclick = false">取 消</el-button>
      <el-button type="primary" @click="listAdd">确 定</el-button>
    </span>
    </el-dialog>
  </el-card>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import addOrUpdata from '@/views/modules/resourceManagement/numbeWrorkorder/addOrUpdata'
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import ctcPersonLiable from '@/components/programmecntre/ctc-person-liable'
// import ctcUtils from '@/utils/ctc-utils.js'
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
      titlecardnumberList: [
        {
          name: '卡号',
          code: 'number'
        },
        {
          name: '省份',
          code: 'provinceDefine'
        },
        {
          name: '运行商',
          code: 'operatorDefine'
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
          name: '办卡人',
          code: 'handler'
        }
      ],
      multipleSelection: [],
      cardnumberList: [],
      addclick: false,
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      form: {
        number: '', // 申请标题号码
        provinceDefine: '', // 省份
        applyName: this.$store.state.user.realName,
        reason: ''
      },
      dataForm: {
        clicklist: [],
        number: '',
        provinceDefine: ''
      },
      dataListSelections: '',
      dataRule: {
        title: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      list: []
    }
  },
  computed: {},
  mounted () {
    if (this.$route.params.number) {
      this.dataForm.number = this.$route.params.number
    }
    this.getProjectInfo(1)
    console.log(this.$route.params)
    if (this.$route.params.code) {
      this.getDetailData()
    }
  },
  methods: {
    translateData (data) {
      let thisvm = this
      Object.keys(data).forEach(function (key) {
        Object.keys(thisvm.form).forEach(function (key1) {
          if (key === key1) {
            if (data[key] === null) {
              thisvm.form[key1] = ''
            } else {
              thisvm.form[key1] = data[key]
            }
          }
        })
      })
    },
    getDetailData () {
      let code = this.$route.params.code
      this.$http.get(`/ctc/resource/activiti/apply/applyDetail/${code}`).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataForm.clicklist = res.data.cardnumberList
          this.translateData(res.data)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    del (index) {
      this.$confirm('是否删除该条数据?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('11111111111', this.dataForm.clicklist)
        // this.clicklist.remove(0)
        this.dataForm.clicklist.splice(index, 1)
        this.list.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    listAdd () {
      this.addclick = false
      let _ = require('lodash')
      this.dataForm.clicklist = _.uniqBy(this.list, 'cardNumberId')
      // this.listval=[]
      // this.listval = this._uniqueHandle(this.List)
      this.$refs.numberTable.clearSelection()
      console.log('this.list', this.List)
      console.log('this.dataForm.clicklist', this.dataForm.clicklist)
    },
    clickchange (val) {
      this.list.push(...val)
      console.log(val, this.list)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.cardnumberListLoading = true
      let params1 = Object.assign({}, this.dataForm)
      let params = { page: this.page, total: this.dataTotal, limit: this.limit, ...params1 }
      this.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: res }) => {
        this.cardnumberListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.cardnumberList = []
          // this.total = 0
          this.total = res.data.totalCount
          this.limit = res.data.pageSize
        } else {
          this.cardnumberList = res.data.list
          this.cardnumberList2 = res.data.list
          this.total = res.data.totalCount
          this.limit = res.data.pageSize
        }
      }).catch(() => {
        this.cardnumberListLoading = false
        this.cardnumberList = []
        // this.total = 0
        // eslint-disable-next-line
        // this.total = res.data.totalCount
      })
    },
    handleCurrentChange (val) {
      this.dataForm.page = val
      this.getProjectInfo()
    },
    handleSizeChange (val) {
      // this.page = 1
      this.dataForm.limit = val
      this.getProjectInfo()
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      let bool = 'projectStatus,level,category,scope'.includes(item.code)
      if (bool) {
        columnValue = this.$getDictLabel(
          'project.' + item.code,
          row[item.code]
        )
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
    queryClick () {
      let thisvm = this
      let params = {
        number: this.dataForm.number,
        provinceDefine: this.dataForm.provinceDefine,
        page: this.page,
        limit: this.limit,
        total: this.total
      }
      thisvm.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: re }) => {
        console.log(re.data, '=====')
        if (re.code === 0) {
          // this.multipleSelection = []
          this.limit = re.data.pageSize
          this.cardnumberList = re.data.list
          this.total = re.data.totalCount
        } else {
          this.limit = re.data.pageSize
          this.cardnumberList = re.data.list
          this.total = re.data.totalCount
        }
      }).catch(() => {
        // console.log('失败')
      })
    },
    resetForm () {
      this.dataForm.number = ''
      this.dataForm.provinceDefine = ''
      let thisvm = this
      let params = {
        page: this.page,
        limit: this.limit
      }
      thisvm.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: re }) => {
        console.log(re.data, '=====')
        if (re.code === 0) {
          this.multipleSelection = []
          this.cardnumberList = re.data.list
          this.limit = re.data.pageSize
          this.total = re.data.totalCount
        } else {
          this.limit = re.data.pageSize
          this.cardnumberList = re.data.list
          this.total = re.data.totalCount
        }
      }).catch(() => {
        // console.log('失败')
        this.cardnumberListLoading = false
        this.cardnumberList = []
        this.total = 0
      })
    },
    handleSelectionChange (val) {
      console.log('**********', val)
      this.multipleSelection = val
    },
    getPhoneData (data) {
      console.log(data)
      if (Array.isArray(data)) {
        this.dataForm.clicklist =
          this.dataForm.clicklist.concat(data)
      }
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    doTableOperate () {
      if (this.dataListSelections.length !== 0) {
        this.$confirm('是否删除该条数据?', '提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.clicklist = [...this.dataForm.clicklist].filter(x => [...this.dataListSelections].every(y => y !== x))
          this.list = [...this.list].filter(x => [...this.dataListSelections].every(y => y !== x))
          this.$message.success('删除成功')
        })
      } else {
        this.$message.warning('请选择需要移除项！！！')
      }
    },
    deleteOperate (index) {
      this.dataForm.clicklist.splice(index, 1)
      this.list.splice(index, 1)
    },
    // 关闭当前窗口
    closeCurrentTab () {
      var tabName = this.$store.state.contentTabsActiveName
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({ name: this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1].name })
      }
    },
    handleCancel () {
      this.closeCurrentTab()
    },
    handleSubmit () {
      let thisvm = this
      let code = this.$route.params.code
      let taskId = this.$route.params.taskId
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dataForm.clicklist.length === 0) {
            thisvm.$message.warning('数据为空，请至少添加一条数据')
          } else {
            let params = { ...this.form, definitionId: 3, cardnumberList: this.dataForm.clicklist, taskId: taskId }
            thisvm.$http['post'](code ? '/ctc/resource/activiti/apply/resubmitCardLogoutApply' : '/ctc/resource/activiti/apply/CardNumberLogoutApply',
              params
            ).then(({ data: res }) => {
              if (res.code !== 0) {
                return thisvm.$message.error(res.msg)
              } else {
                thisvm.$message.success(
                  code ? '修改成功' : '创建成功'
                )
                thisvm.closeCurrentTab()
              }
            }).catch(() => {
            })
          }
        } else {
          return false
        }
      })
    },
    createConfig (title, type, data) {
      this.addOrUpdataVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdata.init(title, '12')
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
    dels (id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$ctcLoading.open()
          this.$http
            .delete('/ctc/resource/cardnumber/delBatch', { data: id })
            .then(({ data: res }) => {
              this.$ctcLoading.close()
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.getProjectInfo(1)
              }
            })
            .catch(() => {
              this.$ctcLoading.close()
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.biaodan {
  width: 700px;
}
.from {
  display: flex;
  justify-content: flex-start;
}
</style>
