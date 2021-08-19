<template>
    <el-select :value="multiple?value:value+''" @input="$emit('input', $event)" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
        <el-option v-for="item in dataList" :key="item.userId" :label="item.realName+' ( '+item.userName+' ) '" :value="item.userId"></el-option>
    </el-select>
</template>
<script>
export default {
  name: 'ctc-next-step-handler',
  data () {
    return {
      dataList: []
    }
  },
  props: {
    value: [Number, String, Array],
    placeholder: String,
    multiple: Boolean,
    disabled: Boolean,
    urlType: {
      type: String,
      default () {
        return '1'
      }
    },
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.getProjectInfo()
  },
  watch: {
  },
  methods: {
    getProjectInfo (data) {
      let url = ''
      let orgId = {}
      let type = 'get'
      // 1 为4A测管理员  2 为集测管理员  3当前登录用户所在项目组项目经理  4申请人所在项目组的项目经理 5免登录通用工单 6免登陆账号申请工单（根据选择的所属项目组和所属机构有关）
      if (this.urlType === '1') {
        url = '/account4a/handle/user/admin4A'
      } else if (this.urlType === '2') {
        url = '/account4a/user/handler/ctc/admin'
      } else if (this.urlType === '3') {
        url = '/account4a/user/handler/manager'
      } else if (this.urlType === '4') {
        url = '/account4a/user/handler/manager/handler'
      } else if (this.urlType === '5') {
        url = '/account4a/home/register/acct/ctc/admin'
      } else if (this.urlType === '6') {
        if (data) {
          url = '/account4a/home/register/acct/handle/user'
          orgId = data
        } else {
          this.dataList = []
          this.$emit('input', '')
          return
        }
      } else if (this.urlType === '7') {
        if (data) {
          type = 'post'
          url = '/account4a/user/handler/account/update'
          orgId = data
        } else {
          this.dataList = []
          this.$emit('input', '')
          return
        }
      }
      let params
      if (type === 'get') {
        params = { params: { ...this.formData, ...orgId } }
      } else {
        params = { ...this.formData, ...orgId }
      }
      this.$http[type](url, params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.dataList = []
          this.$emit('input', '')
          return this.$message.error(res.msg)
        } else {
          if (res.data) {
            this.dataList = res.data
          } else {
            this.dataList = []
            this.$emit('input', '')
          }
        }
      }).catch(() => { })
    },
    handleChange (value) {
      // console.log(value.pop())
      this.$emit('input', value)
    }
  }
}
</script>
