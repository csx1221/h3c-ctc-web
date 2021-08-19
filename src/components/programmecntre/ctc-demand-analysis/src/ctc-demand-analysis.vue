<template>
    <div>
        <el-select :value="value" multiple filterable :placeholder="placeholder" @input="setData($event)">
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
            >
<!--                <span style="float: left">{{ item.realName }}</span>-->
<!--                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>-->
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
  name: 'ctc-demand-analysis',
  data () {
    return {
      options: []
    }
  },
  props: {
    value: [Array, String],
    placeholder: String
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.get('/ctc/plan/demand/liable', {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.options = res.data.data.list
      }).catch(() => { })
    },
    setData (e) {
      this.$emit('input', e)
      let useName = []
      for (let i = 0; i < this.options.length; i++) {
        for (let j = 0; j < e.length; j++) {
          if (this.options[i].id === e[j]) {
            useName.push(this.options[i].realName)
          }
        }
      }
      this.$emit('update:userName', useName.join(','))
    }
  }
}
</script>

<style scoped lang="scss">
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
        content: "";
    }
    .el-select{
        width: 100%;
    }
</style>
