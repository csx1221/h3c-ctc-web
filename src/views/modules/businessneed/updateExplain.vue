<template>
  <el-dialog :visible.sync="visibleUpdateExplain" @close="closeToast" width="50%" title="修改说明" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="left" :model="dataForm" ref="dataForm">
      <el-form-item prop="content">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.modifyDescription" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'

export default {
  // mixins: [projectView],
  data () {
    return {
      dataForm: {
        id: '',
        modifyDescription: ''
      },
      visibleUpdateExplain: false
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    init () {
      this.visibleUpdateExplain = true
      this.$nextTick(() => {
      })
    },
    closeToast () {
    }
  }
}
</script>
