<template>
  <el-dialog width="88%" :visible.sync="visible" @close="closeToast" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-scrollbar style="height:480px;">
      <el-table :header-cell-style="getRowClass" max-height="480" v-loading="dataListLoading" :data="getLabelList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" width="55" type="index" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="name" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column width="100" prop="parentProjectName" label="所属项目" header-align="center" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column :render-header="resetTableHead" prop="projectStatus" label="项目状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text">{{ $getDictLabel('project.projectStatus',scope.row.projectStatus) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="项目范围" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">{{ $getDictLabel('project.scope', scope.row.scope) }}</template>
        </el-table-column>
        <el-table-column prop="category" label="项目类别" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">{{ $getDictLabel('project.category', scope.row.category) }}</template>
        </el-table-column>
        <el-table-column prop="level" label="项目级别" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text">{{ $getDictLabel('project.level', scope.row.level) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column :render-header="resetTableHead" prop="organizeName" label="参测省份/机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="participantCount" label="参测对象(数量)" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="planCyle" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column width="100" :render-header="resetTableHead" prop="actualCyle" label="实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column> -->
      </el-table>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      getLabelList: [],
      dataListLoading: false,
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false
      },
      visible: false,
      title: '标签详情',
      dataForm: {
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    getInfo () {
      this.dataListLoading = true
      this.$http.get(`/ctc/project/projectBase/getListByLabelId/${this.dataForm.labelId}`).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.getLabelList = res.data
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    closeToast () {
      this.dataForm = {}
      this.getLabelList = []
    }
  }
}
</script>

<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
