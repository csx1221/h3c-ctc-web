<template>
    <el-dialog title="案例轨迹" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="case-trajectory">
        <el-row>
            <el-col :span="24" style="height:600px;overflow-y:auto;">
                <el-timeline v-if="caseTrajectoryData.length>0">
                    <el-timeline-item :timestamp="item.createDate" v-for="(item,index) in caseTrajectoryData" :key="index" placement="top" :type="getOperateType('timelineType',item)">
                        <el-card class="el-card-case">
                            <el-row>
                                <el-col :span="12">
                                    <h3>{{item.creatorName}}【<span :style="getOperateType('textColor',item)">{{item.operate}}</span>】</h3>
                                </el-col>
                                <el-col v-if="item.attachementId!==null" :span="12" style="text-align:right;cursor:pointer;" title="附件下载"><i @click="handleDownClick(item.attachementId)" class=" el-icon-paperclip"></i></el-col>
                            </el-row>
                            <p>{{item.operate}}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
                <div v-else style="text-align:center;margin-top:20%;">暂无案例轨迹数据</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="selected">
                <div class="grid-content bg-purple-dark"></div>
                <el-button @click="handleDialogClose">关闭</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  name: 'CaseTrajectory',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 节点类型primary / success / warning / danger / info
      caseId: '',
      caseTrajectoryData: []
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
  mounted () {
  },
  methods: {
    init (url) {
      this.$nextTick(() => {
        this.innerVisible = true
        this.caseTrajectoryData = []
        this.loadCaseTrajectory(url)
      })
    },
    getOperateType (type, item) {
      if (type === 'timelineType') {
        if (item.operateType === 1) {
          return 'primary'
        } else if (item.operateType === 2) {
          return 'danger'
        } else if (item.operateType === 3) {
          return 'warning'
        } else if (item.operateType === 4) {
          return 'success'
        }
      } else if (type === 'textColor') {
        if (item.operateType === 1) {
          return { 'color': '#4190f7' }
        } else if (item.operateType === 2) {
          return { 'color': '#F56C6C' }
        } else if (item.operateType === 3) {
          return { 'color': '#E6A23C' }
        } else if (item.operateType === 4) {
          return { 'color': '#67C23A' }
        }
      }
    },
    loadCaseTrajectory (url) {
      this.$http.get(url + this.caseId).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.caseTrajectoryData = res.data.locus
        }
      }).catch(() => {
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.handleDialogClose()
    },
    handleDownClick (row) {
      let data = {}
      // 特殊处理用例勾选用例，只导出用户勾选用例
      let url = '/ctc/oss/file/download/' + row
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>
<style lang="scss" scoped>
    .case-trajectory {
        .selected {
            margin-top: 10px;
            text-align: right;
        }
        .el-card-case {
            i {
                font-size: 20px;
                color: #4190f7;
            }
        }
    }
</style>
