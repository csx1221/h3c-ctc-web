<template>
  <el-row class="framework-step">
    <el-col :span="24" style="padding-top:10px;padding-left:5px;">
      <marquee behavior="alternate" direction="right">
        <span style="color:#4190f7;font-size:20px;font-weight:bold;">说明：联调平台项目只能选择三级架构（项目/子项目/任务）</span>
      </marquee>
    </el-col>
    <el-col :span="24" class="choose-type">
      <el-radio v-model="projectData.type" label="0" :disabled="disabledStatus" border>{{ $getDictLabel('project.framework','0') }}</el-radio>
      <el-radio v-model="projectData.type" label="1" :disabled="disabledStatus" border>{{ $getDictLabel('project.framework','1') }}</el-radio>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'FrameworkStepPage',
  props: {
    projectData: Object
  },
  data () {
    return {
      disabledStatus: false
    }
  },
  watch: {
    'projectData': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.setRadioDisabled()
      }
    }
  },
  computed: {},
  mounted () {
    this.setRadioDisabled()
  },
  methods: {
    setRadioDisabled () {
      if (this.projectData.operationType === 'update' || this.projectData.projectId !== '') {
        this.disabledStatus = true
      } else {
        this.disabledStatus = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.framework-step {
  .choose-type {
    text-align: center;
    padding-top: 10%;
    .el-radio {
      margin-right: 200px;
      width: 180px;
      height: 180px;
      line-height: 155px;
    }
    .el-radio__input.is-disabled + span.el-radio__label {
      color: #606266;
    }
    .el-radio.is-bordered.is-disabled {
      border: 1px solid #c0c4cc;
    }
  }
}
</style>
