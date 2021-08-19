<template>
<!--  <el-select :value="multiple?value:value" @input="$emit('input', $event)" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>-->
<!--    <el-option :label="data.name" v-for="data in dataList" :key="data.id" :value="data.id">{{data.name}}</el-option>-->
<!--  </el-select>-->
  <el-select :value="multiple?value:value" @input="$emit('input', $event)" :disabled="disabled" :multiple="multiple" :placeholder="placeholder" clearable>
    <el-option v-for="role in dataList" :key="role.id" :label="role.name" :value="role.id"></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'CtcSelectRole',
  data () {
    return {
      dataList: [],
      roleList: [
        {
          id: 1,
          name: '超级管理员'
        },
        {
          id: 2,
          name: '平台项目经理'
        },
        {
          id: 3,
          name: '总部项目经理'
        },
        {
          id: 4,
          name: '专业公司管理员'
        },
        {
          id: 5,
          name: '省管理员'
        },
        {
          id: 6,
          name: '地市管理员'
        },
        {
          id: 7,
          name: '厂商管理员'
        },
        {
          id: 8,
          name: '专业公司项目经理'
        },
        {
          id: 9,
          name: '省项目经理'
        },
        {
          id: 10,
          name: '厂商项目经理'
        },
        {
          id: 11,
          name: '委托方'
        },
        {
          id: 12,
          name: '测试人员'
        },
        {
          id: 13,
          name: '开发经理'
        },
        {
          id: 14,
          name: '开发人员'
        },
        {
          id: 15,
          name: '配置人员'
        }
      ]
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
      console.log(newVal)
      this.dataList = []
      this.$emit('input', '')
      if (newVal) {
        this.getDataListByPid()
      }
    }
  },
  mounted () {
    // this.getDataList()
    this.getDataListByPid()
  },
  methods: {
    getDataListByPid () {
      let params = {}
      if (this.pid !== '' && this.pid !== '0' && this.pid.length > 0) {
        if (Array.isArray(this.pid)) {
          params.organizeId = this.pid[0] || ''
        } else {
          params.organizeId = this.pid || ''
        }
        // params.organizeId = '1407235346972884993'
        let url
        if (this.type === 0) {
          // url = '/account4a/home/register/acct/role/list'
          url = '/account4a/role/listByOrganize'
        } else {
          url = '/account4a/role/listByOrganize'
          // params.userId = this.$store.state.user.id
        }
        return this.$http.get(url, {
          params: params
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataList = res.data
        }).catch(() => { })
      }
    },
    getDataList () {
      // 0局方 1厂商
      if (this.pid) {
        if (this.pid === '0') {
          this.dataList = this.getRoleList([3, 12, 14, 13, 15, 9, 8])
        } else if (this.pid === '1') {
          this.dataList = this.getRoleList([10, 12, 13, 14, 15])
        }
      } else {
        this.dataList = []
      }
    },
    getRoleList (list) {
      let roleList = this.roleList
      return roleList.filter(item =>
        list.includes(item.id)
      )
    }
  }
}
</script>
