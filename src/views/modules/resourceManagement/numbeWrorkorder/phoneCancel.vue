<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-divider content-position="left"
      ><span style="color: #26c6da; font-size: 15px"
        >申请单信息</span
      ></el-divider
    >
    <el-form ref="form" :rules="dataRule" :model="form" label-width="100px" class="biaodan">
      <el-form-item label="申请标题:" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="申请理由:" prop="desc">
        <el-input type="textarea" v-model="form.reason"></el-input>
      </el-form-item>
    </el-form>
    <el-col :span="24" style="margin-top: 24px">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom: 20px">
          <el-col :span="12" class="split-line" style="text-align: left">
            手机列表
          </el-col>
          <el-col :span="12" align="right">
            <el-button
              type="primary"
              size="small"
              @click="createConfig('新增手机', '12')"
              >增加</el-button
            >
            <el-button
              :type="dataListSelections.length > 0 ? 'primary' : 'warning'"
              size="small"
              @click="doTableOperate"
              >批量删除</el-button
            >
          </el-col>
        </el-row>
        <el-table
          stripe
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column
            prop="code"
            label="编号"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="手机名称"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="owner"
            label="负责人"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="manufacturer"
            label="厂商"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="model"
            label="型号"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="serialNo"
            label="设备序号"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="displayRadio"
            label="分辨率"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="mem"
            label="内存"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="owner"
            label="负责人"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="owner"
            label="入库申请人"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createDate"
            label="入库时间"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="descript"
            label="备注"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
            width="220"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div align="center" style="marginTop: 20px">
          <el-button
            type="primary"
            size="middle"
            @click="handleSubmit(form)"
            style="margin: 0px 0 20px 80px;"
            >提交申请</el-button>
          <el-button
            type="primary"
            size="middle"
            @click="handleCancel()"
            style="margin: 0px 0 20px 80px;"
            >取消</el-button>
        </div>
        <add-or-updata
          v-if="addOrUpdataVisible"
          ref="addOrUpdata"
          @refresh="getPhoneData"
          @init="addOrUpdataVisible = false"
        ></add-or-updata>
      </el-card>
    </el-col>
  </el-card>
</template>
<script>
// import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import addOrUpdata from '@/views/modules/resourceManagement/numbeWrorkorder/addOrUpdata'
// import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'numberManagement',
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
      form: {
        title: '', // 手机号码
        reason: ''
      },
      dataList: [],
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
          this.dataList = res.data.mobilephoneList
          this.translateData(res.data)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getPhoneData (data) {
      if (Array.isArray(data)) {
        // this.dataList = this.dataList.concat(data)
        this.dataList = data
      } else {
        this.dataList.push(data)
      }
      // console.log(data)
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    doTableOperate () {
      if (this.dataListSelections.length !== 0) {
        this.dataList = [...this.dataList].filter(x => [...this.dataListSelections].every(y => y !== x))
      } else {
        this.$message.warning('请选择需要移除项！！！')
      }
    },
    deleteOperate (index) {
      this.dataList.splice(index, 1)
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
          if (this.dataList.length === 0) {
            thisvm.$message.warning('数据为空，请至少添加一条数据')
          } else {
            let params = { ...this.form, definitionId: 6, mobilephoneList: this.dataList, taskId: taskId }
            thisvm.$http['post'](code ? '/ctc/resource/activiti/apply/resubmitPhoneLogoutApply' : '/ctc/resource/activiti/apply/addmobilePhoneLogoutApply',
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
        this.$refs.addOrUpdata.selectData = this.dataList
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
