<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="80%" class="add-require" append-to-body>
        <template v-if="type==='1'">
<!--            账号申请-->
            <account-application :selectData="selectData" @close="close"></account-application>
        </template>
        <template v-if="type==='2'||type==='3'">
<!--            账号批量申请-->
            <account-application-batch :type="type" @close="close"></account-application-batch>
        </template>
<!--        <template v-if="type==='3'">-->
<!--&lt;!&ndash;            账号批量变更&ndash;&gt;-->
<!--            <account-change-batch :selectionList="selectionList" @close="close"></account-change-batch>-->
<!--        </template>-->
        <template v-if="type==='4'">
<!--            账号变更-->
            <account-change :selectData="selectData" @close="close"></account-change>
        </template>
        <template v-if="type==='5'||type==='6'">
<!--            账号注销-->
            <account-cancellation-application :selectData="selectData" @close="close"></account-cancellation-application>
        </template>
        <template v-if="type==='7'||type==='10'||type==='12'">
            <!--            账号审批-->
            <account-approval :type="type" :selectData="selectData" @close="close"></account-approval>
        </template>
        <template v-if="type==='8'">
            <!--            账号查看-->
            <org-detail :selectData="selectData" @close="close"></org-detail>
        </template>
        <template v-if="type==='9'">
            <!--            关联从账号-->
            <second-account-list :selectData="selectData" @close="close"></second-account-list>
        </template>
      <template v-if="type==='11'">
        <!--            忘记密码-->
        <password-reset :selectData="selectData" @close="close"></password-reset>
      </template>
    </el-dialog>
</template>
<script>
import accountApplication from './accountApplication' // 账号申请
import accountApplicationBatch from './accountApplicationBatch' // 账号批量申请
import accountChangeBatch from './accountChangeBatch' // 账号批量变更
import accountChange from './accountChange' // 账号变更
import accountCancellationApplication from './accountCancellationApplication' // 账号注销
import accountApproval from './accountApproval' // 账号审批
import orgDetail from './orgDetail' // 账号查看
import secondAccountList from './secondAccountList' // 关联从账号
import passwordReset from '@/views/modules/accountManagement4A/passwordReset' // 密码重置
export default {
  name: 'AddRequire',
  components: {
    accountApplication,
    accountApplicationBatch,
    accountChangeBatch,
    accountChange,
    accountCancellationApplication,
    accountApproval,
    orgDetail,
    secondAccountList,
    passwordReset
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      title: '',
      type: '',
      selectionList: [], // 选中账号列表
      selectData: ''// 选中账号
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (title, type) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.type = type
    },
    close (res) {
      this.dialogVisible = false
      if (res === 'refresh') {
        this.$emit('refresh')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .add-require {
        .selected {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
