<template>
  <el-select :value="multiple?value:value+''" @input="$emit('input', $event)" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
    <el-option :label="data.dictLabel||data.state" v-for="data in dataList" :key="data.dictValue||data.code" :value="data.dictValue||data.code">{{data.dictLabel||data.state}}</el-option>
  </el-select>
</template>
<script>
import { getDictDataList } from '@/utils'
export default {
  name: 'CtcSelect',
  data () {
    return {
      dataList: getDictDataList(this.dictType)
    }
  },
  props: {
    value: [Number, String, Array],
    dictType: String,
    placeholder: String,
    multiple: Boolean,
    disabled: Boolean
  },
  created () {
    if (!this.dictType) {
      this.$http.get('/ctc/demand/getAllDemandState').then(({ data: res }) => {
        if (res.code === 0) {
          this.dataList = res.data.filter(
            item => item.code !== '1' && item.code !== '10'
          )
        }
      })
    }
  }
}
</script>
