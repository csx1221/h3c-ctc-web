<template>
  <el-dialog :visible.sync="visibleOnlineProvince" @close="closeToast" width="50%" title="已上线省份" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="left" :model="dataForm" ref="dataForm">
      <el-form-item prop="content">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.content" :disabled="true"></el-input>
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
        content: '',
        id: ''
      },
      provinceList: '',
      visibleOnlineProvince: false
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
      this.visibleOnlineProvince = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          // console.log(this.dataForm.id)
          this.getTestProvince(this.dataForm.id)
        }
      })
    },
    closeToast () {
    },
    getTestProvince (id) {
      this.dataListLoading = true
      let params = { 'orderCode': id, 'type': 1 }
      this.$http.get('/ctc/plan/commodityOrderInfo/codeToString', { 'params': params }).then(({ data: res }) => {
        if (res.code === 0 && res.data.length > 0) {
          this.dataForm.content = res.data.join(',')
        } else {
          this.dataForm.content = ''
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    }
  }
}
</script>
