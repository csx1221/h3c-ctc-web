<template>
    <div>
        <el-select :value="multiple?value:value+''" @input="goClick" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
            <el-option v-for="item in relaPlatformData" :key="item.applicationId" :label="item.name" :value="item.applicationId"></el-option>
        </el-select>
    </div>
</template>
<script>
export default {
  name: 'CtcPlatformList',
  data () {
    return {
      relaPlatformData: []
    }
  },
  props: {
    value: [Number, String, Array],
    childrenId: String,
    level: [Number, String],
    placeholder: String,
    multiple: Boolean,
    disabled: Boolean,
    name: String
  },
  mounted () {
    if (this.level === '1') {
      this.getProjectInfo()
    }
  },
  watch: {
    childrenId (newVal, oldVal) {
      this.$emit('input', '')
      this.getProjectInfo()
    },
    value (newVal, oldVal) {
      if (!newVal) {
        this.$emit('update:name', '')
      }
    }
  },
  methods: {
    getProjectInfo () {
      this.$http.get('/ctc/subadmin/application/getSMSApplications', {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.relaPlatformData = res.data
        }
      }).catch(() => { })
    },
    goClick ($event) {
      this.$emit('input', $event)
      for (let i = 0; i < this.relaPlatformData.length; i++) {
        if (this.relaPlatformData[i].applicationId === $event) {
          this.$emit('update:name', this.relaPlatformData[i].name)
        }
      }
    },
    buildTreeDate (data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === pid) {
          temp = this.buildTreeDate(data, data[i].id)
          if (temp.length > 0) {
            data[i].children = temp
          }
          result.push(data[i])
        }
      }
      return result
    },
    handleChange (value) {
      // console.log(value.pop())
      this.$emit('input', value)
    }
  }
}
</script>
