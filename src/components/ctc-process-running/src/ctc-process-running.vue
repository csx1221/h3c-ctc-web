<template>
  <div>
    <el-button type="primary" @click="completeTask()">{{ $t('process.completeTask') }}</el-button>
    <el-button type="warning" @click="rejectTask()">{{ $t('process.rejectTask') }}</el-button>
    <el-button type="success" @click="rollbackTask()">{{ $t('process.doBackRollback') }}</el-button>
    <el-button type="info" @click="entrustTask()">{{ $t('process.entrustTask') }}</el-button>
    <el-button type="danger" @click="terminationTask()">{{ $t('process.terminationTask') }}</el-button>
    <ctc-task-back v-if="ctcTaskBackVisible" ref="ctcTaskBack"></ctc-task-back>
    <ctc-task-entrust v-if="ctcTaskEntrustVisible" ref="ctcTaskEntrust"></ctc-task-entrust>
    <ctc-task-handle v-if="ctcTaskHandleVisible" ref="ctcTaskHandle"></ctc-task-handle>
  </div>
</template>

<script>
import CtcTaskBack from './ctc-task-back'
import CtcTaskEntrust from './ctc-task-entrust'
import CtcTaskHandle from './ctc-task-handle'
export default {
  name: 'CtcProcessRunning',
  data () {
    return {
      // 是否显示退回窗口
      ctcTaskBackVisible: false,
      ctcTaskEntrustVisible: false,
      ctcTaskHandleVisible: false,
      parentObj: null,
      dataForm: {
        taskId: '',
        businessKey: '',
        processDefinitionKey: '',
        processInstanceId: ''
      },
      // 回调函数
      callbacks: {
        taskHandleSuccessCallback: null,
        taskHandleErrorCallback: null
      }
    }
  },
  components: {
    CtcTaskBack,
    CtcTaskEntrust,
    CtcTaskHandle
  },
  created () {
    this.$nextTick(() => {
    })
  },
  props: {
  },
  watch: {
  },
  methods: {
    completeTask () {
      this.ctcTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.ctcTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.ctcTaskHandle.callbacks = this.callbacks
        this.$refs.ctcTaskHandle.handleType = 'complete'
        this.$refs.ctcTaskHandle.init()
      })
    },
    rejectTask () {
      this.ctcTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.ctcTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.ctcTaskHandle.callbacks = this.callbacks
        this.$refs.ctcTaskHandle.handleType = 'reject'
        this.$refs.ctcTaskHandle.init()
      })
    },
    rollbackTask () {
      this.ctcTaskBackVisible = true
      this.$nextTick(() => {
        this.$refs.ctcTaskBack.dataForm.taskId = this.dataForm.taskId
        this.$refs.ctcTaskBack.dataForm.processInstanceId = this.dataForm.processInstanceId
        this.$refs.ctcTaskBack.callbacks = this.callbacks
        this.$refs.ctcTaskBack.init()
      })
    },
    entrustTask () {
      this.ctcTaskEntrustVisible = true
      this.$nextTick(() => {
        this.$refs.ctcTaskEntrust.dataForm.taskId = this.dataForm.taskId
        this.$refs.ctcTaskEntrust.callbacks = this.callbacks
        this.$refs.ctcTaskEntrust.init()
      })
    },
    terminationTask () {
      this.ctcTaskHandleVisible = true
      this.$nextTick(() => {
        this.$refs.ctcTaskHandle.dataForm.taskId = this.dataForm.taskId
        this.$refs.ctcTaskHandle.callbacks = this.callbacks
        this.$refs.ctcTaskHandle.handleType = 'termination'
        this.$refs.ctcTaskHandle.init()
      })
    }
  }
}
</script>
