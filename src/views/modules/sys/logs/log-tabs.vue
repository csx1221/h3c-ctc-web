<template>
  <el-card shadow="never" class="aui-card--fill log-tabs">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="登录日志" name="login"></el-tab-pane>
          <el-tab-pane label="操作日志" name="operation"></el-tab-pane>
          <el-tab-pane label="异常日志" name="error"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <log-login v-if="activeName=='login'"></log-login>
        <log-operation v-if="activeName=='operation'"></log-operation>
        <log-error v-if="activeName=='error'"></log-error>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import LogLogin from './log-login'
import LogOperation from './log-operation'
import LogError from './log-error'
export default {
  name: 'LogTabs',
  components: {
    LogLogin, LogOperation, LogError
  },
  data () {
    return {
      activeName: 'login'
    }
  },
  computed: {},
  mounted () { },
  methods: {}
}
</script>
<style  lang="scss" scoped>
.log-tabs {
}
</style>
