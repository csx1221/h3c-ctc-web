<template>
  <el-dialog :visible.sync="visible" title="转单" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="userItem" label="转单人员">
        <el-select v-model="dataForm.userItem" filterable placeholder="请选择" value-key="userId">
          <el-option v-for="item in options" :key="item.userId" :label="item.userName" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="operateLog" label="转单理由">
        <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.operateLog"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: true,
      dataForm: {
        userItem: '',
        operateLog: ''
      },
      projectId: '',
      orderDealId: [],
      orderType: '',
      handlerType: '',
      options: []
    }
  },
  computed: {},
  watch: {

  },
  mounted () {
  },
  methods: {
    // 初始化
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getProjectMember()
      })
    },
    getProjectMember () {
      // 特殊处理缺陷中心转单
      if (Number(this.orderType) === 8) {
        let params = {}
        this.$http.get('/ctc/project/projectMember/defectTransferOrder/' + this.projectId, params).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            // 遍历项目成员
            res.data.map((item, index) => {
              item.userName = item.realName || item.userName
            })
            this.options = res.data
          }
        }).catch(() => { })
      } else {
        let params = { 'projectId': this.projectId, 'orderType': this.orderType, 'handlerType': this.handlerType }
        this.$http.get('/ctc/project/projectMember/task/transferOrder', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            // 遍历项目成员
            res.data.map((item, index) => {
              item.userId = item.id || item.userId
              item.userName = item.realName || item.userName
            })
            this.options = res.data
          }
        }).catch(() => { })
      }
    },
    // 表单提交
    dataFormSubmitHandle () {
      this.$ctcLoading.open()
      let url = '/ctc/task/orderHandle/transfer'
      let params = { orderDealIds: this.orderDealId, ...this.dataForm }
      // 赋值转单用户信息
      params.userId = params.userItem.userId
      params.userName = params.userItem.userName
      params.realName = params.userItem.realName
      // 转单特殊处理，缺陷中心
      if (Number(this.orderType) === 8) {
        url = '/ctc/defect/base/deal'
        params.defectId = params.orderDealIds
        params.nowHandler = params.userId
        params.handlerName = params.realName
        params.operationDesc = params.operateLog
        params.operation = 9
      }
      this.$http.post(url, params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('转单成功')
          this.visible = false
          this.$emit('refreshDataList')
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    }
  }
}
</script>
<style lang="scss">
</style>
