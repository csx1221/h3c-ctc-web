<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标签名称">
              <el-input v-model="dataForm.labelName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker unlink-panels clearable value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" @change="onDateTime" v-model="dateTimeArr" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button type="primary" size="small" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-row type="flex" align="middle">
        <!-- 标题 -->
        <el-col :span="12" class="split-line" style="text-align:left;">标签库列表</el-col>
        <el-col :span="12" style="text-align: right;padding-right:10px;">
          <el-button type="primary" size="small" @click="tagEditHandle()">{{ $t('add') }}</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-row>
        <el-col>
          <el-table max-height="620" v-loading="dataListLoading" :data="tagDataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column prop="labelName" label="标签名称" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="tagDetailHandle(scope.row.labelId)">{{ scope.row.labelName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="tagStatisticHandle(scope.row.labelId)">{{ scope.row.count }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
            <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="tagEditHandle(scope.row.labelId)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteRow(scope.row.labelId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="tagTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-col>
      </el-row>
      <tagDetailHandle v-if="showTagDetail" ref="tagDetail"></tagDetailHandle>
      <tagStatistic v-if="showTagStatistic" ref="tagStatistic"></tagStatistic>
      <tagEditComponent v-if="showTagEdit" ref="tagEdit" @refreshDataList="getDataList"></tagEditComponent>
    </div>
  </el-card>
</template>

<script>
import tagEditComponent from '@/views/modules/visualcenter/mytaglibrary/tag-add-or-update'
import tagStatistic from '@/views/modules/visualcenter/mytaglibrary/tagStatistic'
import tagDetailHandle from '@/views/modules/visualcenter/mytaglibrary/tagDetail'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/project/projectLabel/getProjectLabelList',
        getDataListIsPage: true
      },
      dataForm: {
        name: '',
        type: null
      },
      tagDataList: [], // 标签页列表
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  components: {
    tagDetailHandle,
    tagStatistic,
    tagEditComponent
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.startTime = ''
          this.endTime = ''
        }
      }
    }
  },
  methods: {
    // 重置初始条件状态
    resetSelectInfo () {
      this.dateTimeArr = ''
      this.startTime = ''
      this.endTime = ''
      this.dataForm.labelName = ''
      this.getDataList()
    },
    // 缺少确认删除判断
    deleteRow (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.get(`/ctc/project/projectLabel/deleteLabel/${id}`).then(({ data: res }) => {
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
</style>
