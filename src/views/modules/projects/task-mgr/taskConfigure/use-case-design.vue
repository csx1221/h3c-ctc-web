<template>
  <el-dialog width="60%" :visible.sync="visible" :title="$t('task.useCaseDesign')" :close-on-click-modal="false" :close-on-press-escape="false" :modal="false">
    <el-form :model="dataForm" ref="dataForm" label-width="120px" class="clearfix">
      <el-form-item prop="useCaseDesignCause" :label="$t('task.useCaseDesignCause')">
        <el-radio-group v-model="useCaseDesignCauseRadio">
          <el-radio disabled :label="0">需求变更</el-radio>
          <el-radio disabled :label="1">新需求</el-radio>
          <el-radio :label="2">用例更新</el-radio>
          <el-radio disabled :label="3">单纯设计用例</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="useCaseDesignType" :label="$t('task.useCaseDesignType')">
        <el-radio-group v-model="useCaseDesignTypeRadio">
          <el-radio :label="0">手工用例</el-radio>
          <el-radio :label="1">自动化用例</el-radio>
          <el-radio disabled :label="2">手自一体用例</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-table
        v-loading="useCaseDataListLoading"
        :data="useCaseDataList"
        border
        @selection-change="useCaseDataListSelectionChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" :label="$t('project.name')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="subProject" label="子项目" header-align="center" align="center"></el-table-column>
        <el-table-column prop="module" label="模块" header-align="center" align="center"></el-table-column>
        <el-table-column prop="function" label="功能" header-align="center" align="center"></el-table-column>
        <el-table-column prop="functionPoint" label="功能点" header-align="center" align="center"></el-table-column>
        <el-table-column prop="testFunctionPoint" label="测试功能点" header-align="center" align="center"></el-table-column>
        <el-table-column prop="useCase" label="用例" header-align="center" align="center"></el-table-column>
      </el-table>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      useCaseDataListLoading: false,
      useCaseDataList: [
        {
          id: 1001,
          name: '任务一',
          subProject: '子项目1',
          module: '模块1',
          function: '功能1',
          functionPoint: '功能点1.1',
          testFunctionPoint: '测试功能点1',
          useCase: 'TC001 用例'
        },
        {
          id: 1002,
          name: '任务一',
          subProject: '子项目1',
          module: '模块1',
          function: '功能1',
          functionPoint: '功能点1.1',
          testFunctionPoint: '测试功能点1',
          useCase: 'TC001 用例'
        },
        {
          id: 1003,
          name: '任务一',
          subProject: '子项目1',
          module: '模块1',
          function: '功能1',
          functionPoint: '功能点1.1',
          testFunctionPoint: '测试功能点1',
          useCase: 'TC001 用例'
        },
        {
          id: 1004,
          name: '任务一',
          subProject: '子项目1',
          module: '模块1',
          function: '功能1',
          functionPoint: '功能点1.1',
          testFunctionPoint: '测试功能点1',
          useCase: 'TC001 用例'
        }
      ],
      visible: false,
      useCaseDesignCauseRadio: 2,
      useCaseDesignTypeRadio: 0,
      useCaseDataListSelections: [], // 数据列表，多选项
      dataForm: {
        useCaseDesignCause: '',
        useCaseDesignType: '',
        useCaseDesignSelections: []
      }
    }
  },
  computed: {
  },
  methods: {
    init () {
      this.visible = true
    },
    // 多选
    useCaseDataListSelectionChangeHandle (val) {
      this.useCaseDataListSelections = val
    },
    submitHandle () {
      this.dataForm.useCaseDesignCause = this.useCaseDesignCauseRadio
      this.dataForm.useCaseDesignType = this.useCaseDesignTypeRadio
      this.dataForm.useCaseDesignSelections = this.useCaseDataListSelections
      if (this.dataForm.useCaseDesignSelections.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择至少一条用例',
          type: 'warning'
        })
        return false
      }
      this.visible = false
      this.$emit('submitConfigureData', this.dataForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-project__task {
  .task-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
</style>
