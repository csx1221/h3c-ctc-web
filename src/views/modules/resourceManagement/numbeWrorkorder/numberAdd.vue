<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-divider content-position="left"><span style="color: #26c6da; font-size: 15px"  >申请单信息</span></el-divider>
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
          <el-col :span="12" class="split-line" style="text-align: left">入库申请</el-col>
          <el-col :span="12" align="right">
            <el-button  type="primary"  size="small"  @click="createConfig('新增卡号', '1')"  >增加</el-button>
            <el-button  type="primary"  size="small"  @click="createConfig('批量导入', '5')"  >批量导入</el-button>
            <el-button  :type="dataListSelections.length > 0 ? 'primary' : 'warning'"  size="small"  @click="doTableOperate"  >批量删除</el-button>
          </el-col>
        </el-row>
        <el-table  stripe  v-loading="dataListLoading"  :data="dataForm.clicklist"  border  @selection-change="dataListSelectionChangeHandle"  @sort-change="dataListSortChangeHandle"  style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column type="index" width="60" label="序号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="number" width="140" label="手机号码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operator" width="110" label="运营商" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="$getDictLabel('operators', scope.row.operator)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="cityDefine" width="110" label="地方" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="imsi" width="150" label="IMSI" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="brand" width="150" label="品牌" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="$getDictLabel('brand', scope.row.brand)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="platform" width="110" label="所属平台" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceNo" width="130" label="密码服务" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="monthlyFee" width="130" label="月度资费" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="score" width="130" label="积分" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="owner" width="200" label="负责人" align="center" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="ownerId" width="200" label="负责人联系方式" align="center" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="right" label="操作" header-align="center" align="center" width="100">
                <template slot-scope="scope">
                  <!-- <el-button @click="createConfig(scope.row.number,'2',scope.row)" type="text" size="small">编辑</el-button> -->
                  <el-button @click="del(scope.$index)"  type="text"  size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div align="center" style="marginTop: 20px">
          <el-button  type="primary"  size="middle"  @click="handleSubmit(form)"  style="margin: 0px 0 20px 80px;"  >提交申请</el-button>
          <el-button  type="primary"  size="middle"  @click="handleCancel()"  style="margin: 0px 0 20px 80px;"  >取消</el-button>
        </div>
        <add-or-updata  v-if="addOrUpdataVisible"  ref="addOrUpdata"   @refresh="getNumberData"  @init="addOrUpdataVisible = false"></add-or-updata>
      </el-card>
    </el-col>
  </el-card>
</template>
<script>
// import Cookies from 'js-cookie'
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
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      form: {
        title: '', // 手机号码
        reason: '',
        applyName: this.$store.state.user.realName
      },
      dataForm: {
        clicklist: []
      },
      dataListSelections: '',
      dataRule: {
        title: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted () {
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
    clickchange (val) {
      console.log('^^^^^^^^^', val)
      this.dataForm.clicklist = val
    },
    submitResult (res) {
      if (this.abnormalqQuantity > 0) {
        this.$message.warning('请处理异常列表')
      } else if (this.dataForm.length === 0) {
        this.$message.warning('数据为空，请先添加数据')
      } else {
        this.submitData()
      }
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      thisvm.$http.post('/ctc/resource/activiti/cardnumber/saveBatch', { list: this.dataForm }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.$message.success('提交成功')
        this.$emit('close', res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    // 去重方法
    _uniqueHandle (arr) {
      const res = new Map()
      console.log(res)
      return arr.filter((arr) => !res.has(arr.number) && res.set(arr.number, 1))
    },
    getNumberData (data) {
      console.log(data)
      // console.log('@@@@@@@', this.dataForm.clicklist)
      if (Array.isArray(data)) {
        // this.dataForm.clicklist = this.dataForm.clicklist.concat(data)
        let _ = require('lodash')
        this.dataForm.clicklist = this.dataForm.clicklist.concat(_.uniqBy(data, 'number'))
        this.dataForm.clicklist = this._uniqueHandle(this.dataForm.clicklist)
        console.log('if', this.dataForm.clicklist)
      } else {
        // if (data.obj !== null) {
        //   console.log(data.obj)
        //   this.dataForm.clicklist.splice(data.obj.index, data.obj.index + 1)
        this.dataForm.clicklist.push(data)
        this.dataForm.clicklist = this._uniqueHandle(this.dataForm.clicklist)
        console.log('else', this.dataForm.clicklist)
        // } else {
        //   this.dataForm.clicklist.push(data)
        // }
      }
      console.log(this.dataForm.clicklist)
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    doTableOperate () {
      if (this.dataListSelections.length !== 0) {
        this.$confirm('是否删除选中项?', '提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.clicklist = [...this.dataForm.clicklist].filter(x => [...this.dataListSelections].every(y => y !== x))
        })
      } else {
        this.$message.warning('请选择需要移除项！！！')
      }
    },
    del (index) {
      // 07081016
      this.$confirm('是否删除该条数据?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataForm.clicklist.splice(index, 1)
      })
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
            let params = { ...this.form, definitionId: 1, cardnumberList: this.dataForm.clicklist, taskId: taskId }
            thisvm.$http['post'](code ? '/ctc/resource/activiti/apply/resubmitCardNumberApply' : '/ctc/resource/activiti/apply/addCardNumberApply',
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
      if (type === '1') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '1')
        })
      // if (type === '1' || type === '2') {
      //   this.addOrUpdataVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addOrUpdata.init(title, type)
      //     if (data) {
      //       this.$refs.addOrUpdata.selectData = data
      //     }
      //   })
      // }
      // else if (type === '3') {
      //   this.dels([data.cardNumberId])
      } else if (type === '5') {
        // let params = {}
        // params.accounts = []
        // params.accounts.push({ loginName: data.loginName })
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, '3')
          // this.$refs.addOrUpdata.selectData = params
        })
      // } else if (type === '10') {
      //   this.addOrUpdataVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addOrUpdata.init(title, '10')
      //   })
      // } else if (type === '11') {
      //   this.addOrUpdataVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addOrUpdata.init(title, '11')
      //   })
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
    }
    // dels (id) {
    //   this.$confirm('此操作将永久删除, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.$ctcLoading.open()
    //       this.$http
    //         .delete('/ctc/resource/cardnumber/delBatch', { data: id })
    //         .then(({ data: res }) => {
    //           this.$ctcLoading.close()
    //           if (res.code !== 0) {
    //             this.$message.error(res.msg)
    //           } else {
    //             this.getProjectInfo(1)
    //           }
    //         })
    //         .catch(() => {
    //           this.$ctcLoading.close()
    //         })
    //     })
    //     .catch(() => {})
    // }
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
