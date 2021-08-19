<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-sys__params">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="请输入用户账号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionBay" @sort-change="dataListSortChangeHandle" ref="multipleTable" style="width: 100%;">
          <el-table-column :selectable="checkSelectable" type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="realName" :label="$t('user.username')" sortable="custom" header-align="center" align="center"></el-table-column>
          <el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[5, 10, 20, 50]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
      </div>
    </el-card>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      order: '',
      orderField: '',
      page: 1,
      limit: 5,
      total: 0,
      dataListSelections: [],
      dataListLoading: false,
      dataForm: {
        id: '',
        userName: ''
      },
      getList: [], // 提交列表多选数据改造
      dataList: [],
      fristList: [],
      roleList: []
    }
  },
  methods: {
    // 禁止选中
    checkSelectable (row, index) {
      if (row.isHidden === 1) {
        return false
      } else {
        return true
      }
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        // 数据返回再请求
        this.getInfo()
      })
    },
    // 获取信息
    getInfo () {
      this.dataListLoading = true
      this.$http.get(`/ctc/subadmin/applicationadmin/user/page`, {
        params: {
          order: this.order,
          orderField: this.orderField,
          sidx: this.sidx,
          page: this.page,
          limit: this.limit,
          ...this.dataForm
        }
      }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.fristList = res.data.list
        this.total = res.data.totalCount
        this.getRoleList()
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getRoleList () {
      let thisvm = this
      thisvm.$http.get(`/ctc/subadmin/applicationadmin/page?userName=&deptId=&order=${thisvm.order}&orderField=${thisvm.orderField}&page=1&limit=100&applicationId=${thisvm.$route.params.applicationId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.roleList = res.data.list
        for (let index = 0; index < thisvm.roleList.length; index++) {
          for (let i = 0; i < thisvm.fristList.length; i++) {
            if (thisvm.roleList[index].userId === thisvm.fristList[i].id) {
              thisvm.fristList[i].isHidden = 1
              break
            }
          }
        }
        thisvm.dataList = thisvm.fristList
        thisvm.$refs.multipleTable.clearSelection()
      }).catch(() => { })
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getInfo()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getInfo()
    },
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getInfo()
    },
    dataListSelectionBay (val) {
      this.dataListSelections = val
    },
    getDataList: function () {
      this.page = 1
      this.getInfo()
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      for (let index = 0; index < this.dataListSelections.length; index++) {
        var vate = {}
        vate.userId = this.dataListSelections[index].id
        vate.applicationId = this.$route.params.applicationId
        this.dataListSelections[index] = vate
      }
      console.log(this.dataListSelections)
      this.$http['post']('/ctc/subadmin/applicationadmin', this.dataListSelections).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => { })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
