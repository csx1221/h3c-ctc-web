<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="联系组名称">
              <el-input v-model="dataForm.contactGroupName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-button size="small" type="primary" @click="reportEditHandle()">{{ $t('add') }}</el-button>
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table max-height="660" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column width="140" prop="contactGroupName" label="联系组名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mailContentBegin" label="邮件正文开头" header-align="center" align="center"></el-table-column>
        <el-table-column prop="acceptAccounts" label="收件人邮箱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="acceptCount" label="收件人数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="copyAccounts" label="抄送人邮箱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="copyCount" label="抄送人数量" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="reportEditHandle(scope.row.contactGroupId)">编辑</el-button>
            <el-button type="text" size="small" @click="reportDelHandle(scope.row.contactGroupId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
    <reportEditComponent v-if="showReportEdit" ref="reportEdit" @refreshDataList="getDataList"></reportEditComponent>

  </el-card>
</template>

<script>

import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import reportEditComponent from '@/views/modules/visualcenter/reportContactGroup/report-contact-group-add'

export default {
  mixins: [projectView],
  data () {
    return {
      optionProps: {
        expandTrigger: 'hover',
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'list'
      },
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/contactGroupPage',
        // getDataListURL: '/ctc/visualization/reportcontact/getreportcontactList',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        contactGroupName: ''
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      showReportEdit: false

    }
  },
  components: {
    reportEditComponent
  },
  watch: {

  },
  methods: {
    // 重置初始条件状态
    resetSelectInfo () {
      this.dataForm.contactGroupName = ''
      this.getDataList()
    },
    // 编辑页面
    reportEditHandle (id) {
      this.showReportEdit = true
      this.$nextTick(() => {
        this.$refs.reportEdit.dataForm.contactGroupId = id
        this.$refs.reportEdit.init()
      })
    },
    // 删除
    reportDelHandle (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/visualization/report/contactGroupDelete', { 'data': [id] }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => { })
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
/deep/ .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
  margin: 0 1px;
}
</style>
