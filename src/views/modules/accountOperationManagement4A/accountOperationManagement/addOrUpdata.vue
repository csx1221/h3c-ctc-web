<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%" class="add-require" append-to-body>
        <template v-if="type==='1'">
<!--            免登陆通用工单-->
            <general-work-order-application :selectData="selectData" @close="close"></general-work-order-application>
        </template>
      <template v-else-if="type==='2'">
        <!--            免登陆4A账号申请工单-->
        <account-application-work-order :selectData="selectData" @close="close"></account-application-work-order>
      </template>
    </el-dialog>
</template>
<script>
import generalWorkOrderApplication from './../workOrderType/generalWorkOrder/noLoginApplication' // 免登陆通用工单
import accountApplicationWorkOrder from './../workOrderType/accountApplicationWorkOrder/noLoginApplication' // 免登陆4A账号申请工单
export default {
  name: 'AddRequire',
  components: {
    generalWorkOrderApplication, accountApplicationWorkOrder
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
