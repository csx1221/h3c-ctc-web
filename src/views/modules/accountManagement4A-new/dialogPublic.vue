<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="80%" class="add-require" append-to-body>
        <template v-if="type==='1'">
            <!--            账号查看-->
            <org-detail :selectData="selectData" @close="close"></org-detail>
        </template>
    </el-dialog>
</template>
<script>
import orgDetail from '@/views/modules/accountManagement4A-new/accountManagement/accountLook' // 账号查看
export default {
  name: 'AddRequire',
  components: {
    orgDetail
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
