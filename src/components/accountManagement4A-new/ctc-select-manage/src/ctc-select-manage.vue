<template>
  <el-select :value="multiple?value:value" @input="$emit('input', $event)" @visible-change="getDataList" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
    <el-option v-for="role in dataList" :key="role.userId" :label="role.realName" :value="role.userId"></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'CtcSelectManage',
  data () {
    return {
      dataList: []
    }
  },
  props: {
    value: [Number, String, Array],
    placeholder: String,
    multiple: Boolean,
    pid: [Number, String, Array],
    disabled: Boolean,
    type: Number
  },
  created () {
  },
  watch: {
    pid (newVal, oldVal) {
      // console.log(newVal)
      // this.dataList = []
      // this.$emit('input', '')
      // if (newVal) {
      //   this.getDataListByPid()
      // }
    }
  },
  mounted () {
    // this.getDataList()
  },
  methods: {
    getDataList (res) {
      console.log(res)
      if (res && this.dataList.length === 0 && this.pid) {
        let projectId = '1415874218700083202'
        this.$ctcLoading.open()
        this.$http.get('/ctc/project/projectMember/listSubProjectSelectableManagers', {
          params: { 'parentId': projectId }
        }).then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataList = res.data
          }
        }).catch(() => { this.$ctcLoading.close() })
      }
    }
  }
}
</script>
