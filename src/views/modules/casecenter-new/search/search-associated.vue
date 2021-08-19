<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__log-operation">
      <!-- <button @click="dialogVisible = true">弹窗</button>
      <el-dialog
      title="全局搜索"
      :visible.sync="dialogVisible"
      width="80%">
      <ctc-associated-search :dialog="dialogOff" @valueItem='getMsgFormSon'></ctc-associated-search>
      </el-dialog> -->
      <ctc-associated-search></ctc-associated-search>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/subadmin/log/page',
        getDataListIsPage: true,
        exportURL: '/ctc/subadmin/log'
      },
      // dialogVisible: false,
      // dialogOff: true,
      dataForm: {
        moduleName: '',
        status: ''
      }
    }
  }
}
</script>
