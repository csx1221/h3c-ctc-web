<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%" class="add-require" append-to-body>
        <template v-if="type==='1'||type==='2'||type==='2-2'">
            <!--            账号申请-->
            <add-or-updata :reviewData="data" :type="type" @close="close"></add-or-updata>
        </template>
<!--        <template v-else-if="type==='2-2'">-->
<!--            &lt;!&ndash;            账号申请&ndash;&gt;-->
<!--            <add-or-updata :reviewData="data" :type="type"  @close="close"></add-or-updata>-->
<!--        </template>-->
    </el-dialog>
</template>
<script>
import addOrUpdata from './addOrUpdata' // 账号申请
export default {
  name: 'AddRequire',
  components: {
    addOrUpdata
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
      data: ''
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
    init (title, type, row) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.type = type
      if (row) {
        this.data = row
      }
    },
    close (res, pid) {
      this.dialogVisible = false
      if (res === 'refresh') {
        if (pid) {
          this.$emit('refresh', pid)
        } else {
          this.$emit('refresh')
        }
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
