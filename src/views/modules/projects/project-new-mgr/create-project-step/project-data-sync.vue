<template>
  <el-dialog :title="syncType=='projectMember'?'【项目成员】同步策略设置':'【参测对象】同步策略设置'" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="project-data-sync">
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="24" v-if="projectData.length>0">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">是否同步到子项目</span></el-divider>
            <el-table ref="projectData" :data="projectData" border height="300px">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="子项目名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">是否同步到任务工单</span></el-divider>
            <el-checkbox v-model="fullSync">是否同步到任务工单</el-checkbox>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProjectDataSync',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      syncType: '1', // type同步类型(1:参测对象;2:项目成员)
      type: '0', // 项目架构
      projectId: '',
      projectData: [],
      projectDataSyncConfig: { 'subProjectIds': [], 'fullSync': false }, // 同步策略参数
      fullSync: false
    }
  },
  watch: {
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.fullSync = this.projectDataSyncConfig.fullSync
        this.getChildrenProject()
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    getChildrenProject () {
      if (this.projectId) {
        let params = { 'parentId': this.projectId }
        this.$http.get('/ctc/project/list/subProject', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.projectData = res.data
            this.$nextTick(() => {
              this.projectData.forEach((item, index) => {
                let subProjectIds = this.projectDataSyncConfig.subProjectIds
                if (subProjectIds.includes(item.projectId)) {
                  this.$toggleRowSelectionTable('projectData', item)
                }
              })
            })
          }
        }).catch(() => { })
      }
    },
    handleConfirm () {
      let projectDataSyncConfig = { 'subProjectIds': [], 'fullSync': this.fullSync }
      if (this.$refs.projectData) {
        let selection = this.$refs.projectData.selection
        selection.forEach((item, index) => {
          projectDataSyncConfig.subProjectIds.push(item.projectId)
        })
      }
      let params = { 'type': 'executeProjectSyncData', 'syncType': this.syncType, 'data': projectDataSyncConfig }
      this.$emit('watchChildMethod', params)
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.project-data-sync {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
