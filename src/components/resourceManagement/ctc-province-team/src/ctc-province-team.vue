<template>
    <div>
        <el-select :value="multiple?value:value+''" @input="goClick($event)" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
            <el-option :label="data.name||data.id" v-for="data in dataList" :key="data.id" :value="data.id">{{data.name}}</el-option>
        </el-select>
    </div>
</template>
<script>
export default {
  name: 'CtcProvinceTeam',
  data () {
    return {
      dataList: []
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
      if (newVal) {
        this.getProjectInfo2()
      } else {
        this.$emit('input', '')
      }
    },
    value (newVal, oldVal) {
      if (!newVal) {
        this.$emit('update:name', '')
      }
    }
  },
  methods: {
    showName () {
      this.$emit('input', '')
      this.$emit('update:name', '')
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].id === this.value) {
          this.$emit('input', this.value)
          this.$emit('update:name', this.name)
        }
      }
    },
    getProjectInfo () {
      let thisvm = this
      thisvm.$http.get('/ctc/servicebus/api/v1.0/standard/provinces').then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          this.dataList = res.data
        }
      }).catch(() => {
      })
    },
    getProjectInfo2 () {
      let thisvm = this
      let params = { provinceCode: thisvm.childrenId }
      thisvm.$http.get('/ctc/servicebus/api/v1.0/standard/getCity', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          this.dataList = res.data
          this.showName()
        }
      }).catch(() => {
      })
    },
    goClick ($event) {
      this.$emit('input', $event)
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].id === $event) {
          this.$emit('update:name', this.dataList[i].name)
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
