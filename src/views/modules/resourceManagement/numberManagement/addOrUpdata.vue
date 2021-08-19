<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :width="getTitleWidth()" class="add-require" append-to-body>
        <template v-if="type==='1'||type==='2'">
            <!--            新增与编辑号码-->
            <number-addition :selectData="selectData" @close="close"></number-addition>
        </template>
        <template v-else-if="type==='3'">
            <!--            批量导入-->
            <batch-import :selectData="selectData" @close="close"></batch-import>
        </template>
        <template v-else-if="type==='4'">
            <!--            清理设置-->
            <cleanup-settings :selectData="listId" :operationType="operationType" @close="close"></cleanup-settings>
        </template>
        <template v-else-if="type==='5'">
            <!--            短信详情-->
            <s-m-s-details :selectData="selectData" @close="close"></s-m-s-details>
        </template>
        <template v-else-if="type==='6'">
            <!--            号码查看-->
            <number-detail :selectData="selectData" @close="close"></number-detail>
        </template>
      <template v-else-if="type==='7'">
        <!--            批量锁定-->
        <number-lock-batch :selectData="listId" :lockState="lockState" @close="close"></number-lock-batch>
      </template>
      <template v-else-if="type==='8'">
        <!--            操作历史-->
        <number-operation-history :selectData="selectData" @close="close"></number-operation-history>
      </template>
    </el-dialog>
</template>
<script>
import numberAddition from './numberAddition' // 号码新增编辑
import numberDetail from './numberDetail' // 号码查看
import batchImport from './batchImport' // 批量导入
import cleanupSettings from '../SMSManagement/cleanupSettings' // 清理设置
import SMSDetails from '../SMSManagement/SMSDetails' // 短信详情
import numberLockBatch from '../numberStateManagement/numberLockBatch' // 批量锁定
import numberOperationHistory from '@/views/modules/resourceManagement/numberStateManagement/numberOperationHistory' // 操作历史
export default {
  name: 'AddRequire',
  components: {
    numberAddition,
    batchImport,
    cleanupSettings,
    SMSDetails,
    numberDetail,
    numberLockBatch,
    numberOperationHistory
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
      selectData: {}, // 选中账号
      listId: [],
      lockState: '', // 锁定状态
      operationType: '' // 在清理设置中 1表示单个清理 2表示批量清理
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
    },
    getTitleWidth () {
      console.log(this.type)
      let width = '100%'
      if (this.type === '4') {
        width = '40%'
      } else if (this.type === '7') {
        width = '60%'
      } else {
        width = '80%'
      }
      return width
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
