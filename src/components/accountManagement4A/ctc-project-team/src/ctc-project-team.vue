<template>
    <div @mouseenter="isFocus">
        <el-tooltip class="item" :content="tooltip" placement="top">
            <el-cascader ref="cascaderAddr" :value="value" filterable :props="{ checkStrictly: true, value:'id', label:'orgName' }" :options="options" :disabled="disabled" @change="handleChange" clearable></el-cascader>
        </el-tooltip>
    </div>
</template>
<script>
export default {
  name: 'CtcProjectTeam',
  data () {
    return {
      tooltip: '',
      options: []
    }
  },
  props: {
    value: [Number, String, Array],
    orgId: [Number, String, Array],
    props: Object,
    backName: Boolean,
    disabled: Boolean,
    jurisdiction: Boolean, // 有权限
    accountApp: Boolean // 账号申请
  },
  mounted () {
    this.getProjectInfo()
  },
  watch: {
    // projectId (newVal, oldVal) {
    //   this.echoProjectData()
    // }
  },
  methods: {
    isFocus (event) {
      if (this.$refs['cascaderAddr'].inputValue) {
        this.tooltip = this.$refs['cascaderAddr'].inputValue
      } else {
        this.tooltip = ''
      }
    },
    getProjectInfo () {
      // /account4a/organize/user
      let thisvm = this
      if (this.$store.state.user.id === 0) {
        let params = { page: 1, limit: 99999, ...this.props }
        thisvm.$http.get('/account4a/home/register/acct/list', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            // console.log(res)
            // console.log(this.buildTreeDate(res.data.list, null))
            if (this.props && this.props.lv === '1') {
              res.data.list.push({
                hasChildren: true,
                id: '0',
                lv: 0,
                orgDesc: null,
                // orgName: '中国移动',
                orgName: 'H3C',
                parentId: null,
                disabled: true
              })
            }
            this.options = this.buildTreeDate(res.data.list, null)
          }
        }).catch(() => {
          // thisvm.$ctcLoading.close()
        })
      } else {
        if (this.accountApp) {
          this.getAccountApp()
        } else {
          if (this.jurisdiction) {
            thisvm.$http.get('account4a/organize/user').then(({ data: res }) => {
              if (res.code !== 0) {
                thisvm.$message.error(res.msg)
              } else {
                this.options = this.buildTreeDate1(res.data, null)
              }
            }).catch(() => {
              // thisvm.$ctcLoading.close()
            })
          } else {
            let params = { page: 1, limit: 99999, ...this.props }
            thisvm.$http.get('/account4a/organize/list', { 'params': params }).then(({ data: res }) => {
              if (res.code !== 0) {
                thisvm.$message.error(res.msg)
              } else {
                if (this.props && this.props.lv === '1') {
                  res.data.list.push({
                    hasChildren: true,
                    id: '0',
                    lv: 0,
                    orgDesc: null,
                    // orgName: '中国移动',
                    orgName: 'H3C',
                    parentId: null,
                    disabled: true
                  })
                }
                this.options = this.buildTreeDate(res.data.list, null)
              }
            }).catch(() => {
              // thisvm.$ctcLoading.close()
            })
          }
        }
      }
    },
    getAccountApp () {
      let thisvm = this
      thisvm.$http.get('account4a/apply/account/currentOrg').then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          let data = res.data
          if (data.admin) {
            let params = { page: 1, limit: 99999, ...this.props }
            thisvm.$http.get('/account4a/organize/list', { 'params': params }).then(({ data: res1 }) => {
              if (res1.code !== 0) {
                thisvm.$message.error(res1.msg)
              } else {
                if (thisvm.props && thisvm.props.lv === '1') {
                  res1.data.list.push({
                    hasChildren: true,
                    id: '0',
                    lv: 0,
                    orgDesc: null,
                    // orgName: '中国移动',
                    orgName: 'H3C',
                    parentId: null,
                    disabled: true
                  })
                }
                this.options = this.buildTreeDate(res1.data.list, null)
              }
            }).catch(() => {
              // thisvm.$ctcLoading.close()
            })
          } else {
            // hasChildren: false
            // id: "3008"
            // lv: 1
            // orgDesc: ""
            // orgName: "测试111"
            // parentId: "0"
            let node = {
              hasChildren: false,
              id: data.orgId,
              lv: 2,
              orgDesc: '',
              orgName: data.fullName,
              parentId: null
            }
            thisvm.options = this.buildTreeDate1([node], null)
            thisvm.$emit('input', [data.orgId])
          }
        }
      }).catch(() => {
        // thisvm.$ctcLoading.close()
      })
    },
    buildTreeDate1 (data, pid) {
      let result = []
      if (pid === null && this.findGeng(data)) {
        result = this.buildTreeDateNull(data, pid)
      } else {
        result = this.buildTreeDateNoNull(data, pid)
      }
      return result
    },
    buildTreeDateNull (data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === pid) {
          temp = this.buildTreeDateNull(data, data[i].id)
          if (temp.length > 0) {
            data[i].children = temp
          }
          result.push(data[i])
        }
      }
      return result
    },
    buildTreeDateNoNull (data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === pid) {
          temp = this.buildTreeDateNoNull(data, data[i].id)
          if (temp.length > 0) {
            data[i].children = temp
          }
          result.push(data[i])
        } else {
          result.push(data[i])
        }
      }
      return result
    },
    findGeng (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === null) {
          return true
        }
      }
      return false
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
      // console.log(value)
      // console.log(this.$refs['cascaderAddr'])
      this.$emit('input', value)
      if (this.backName) {
        let name = this.$refs['cascaderAddr'].getCheckedNodes()[0].label
        this.$emit('update:organName', name)
      }
    }
  }
}
</script>
