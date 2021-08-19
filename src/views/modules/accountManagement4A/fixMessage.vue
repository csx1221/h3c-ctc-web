<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%" class="add-require" append-to-body>
       <div>{{msg}}</div>
    </el-dialog>
</template>
<script>
export default {
  name: 'fixMessage',
  components: {
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
      msg: ''
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
    init (title, msg) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.msg = msg
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
