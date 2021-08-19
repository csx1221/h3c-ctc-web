<template>
    <div>
        <div class="el-input el-input-group el-input-group--append">
            <div class="el-input__inner dib" v-if="nameList.length>0">
                <template v-for="(item,index) in nameList">
                    <el-tag v-if="item.disable" class="eltag" :key="index" type="info">{{item.realName+'（'+item.username+'）'}}</el-tag>
                    <el-tag v-else class="eltag" :key="index" closable @close="handleClose(item)">{{item.realName+'（'+item.username+'）'}}</el-tag>
                </template>
            </div>
            <el-input v-else :placeholder="placeholder"></el-input>
            <div class="el-input-group__append" @click="openDialog">
                <el-button icon="el-icon-search" @click="openDialog"></el-button>
            </div>
        </div>
        <el-dialog :visible.sync="visibleUser" width="55%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row style="margin-bottom:10px;">
                <el-form :model="dataForm" ref="dataForm" label-width="90px">
                    <el-col :span="20">
                        <el-form-item label="4A主账号：">
                            <el-input v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="text-align:right">
                        <el-button type="primary" size="small" @click="getUserList">查询</el-button>
                        <el-button size="small" @click="doResetGetUserList">重置</el-button>
                    </el-col>
                </el-form>
            </el-row>
            <el-table ref="tableObject" border :data="userList" @selection-change="getChooseUserRow" :row-key="getRowKeys" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="60" :reserve-selection="true"></el-table-column>
<!--                <el-table-column prop="demandCode" label="4A主账号" header-align="center" align="center"></el-table-column>-->
                <el-table-column prop="username" label="集中化从账号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
                <el-table-column prop="userRoleNames" label="所属角色" header-align="center" align="center"></el-table-column>
                <el-table-column prop="organizeName" label="所属机构/部门/项目组" header-align="center" align="center"></el-table-column>
            </el-table>
<!--            <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getUserList" style="text-align:left;">-->
<!--            </el-pagination>-->
            <template slot="footer">
                <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
                <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'CtcOrganHandler',
  data () {
    return {
      visibleUser: false,
      userList: [],
      showUserName: '',
      nameList: [],
      dataForm: {
        loginName: '' // 姓名
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectData: [],
      userRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0,
      temporaryStorageData: []
    }
  },
  props: {
    value: [Array, String, Object],
    taskId: String,
    deptId: String,
    userId: String,
    placeholder: String,
    taskData: Object,
    nameList1: Array
  },
  watch: {
    taskId (newVal, oldVal) {
      console.log(9999)
      this.echoUserData()
    }
  },
  mounted () {
    if (this.nameList1) {
      // this.echoUserData()
      this.selectData = this.nameList1
      this.nameList = this.nameList1
    }
  },
  methods: {
    getRowKeys (row) {
      return row.id
    },
    handleClose (tag) {
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      // this.selectData.splice(this.selectData.indexOf(tag), 1)
      let node = this.nameList
      let list = []
      for (let i = 0; i < node.length; i++) {
        list.push(
          {
            loginName: node[i].loginName,
            userId: node[i].id
          }
        )
      }
      this.$emit('input', list)
    },
    openDialog () {
      this.visibleUser = true
      this.searchName = ''
      this.page = 1
      // this.getUserList()
      this.$nextTick(() => {
        this.$refs.tableObject.clearSelection()
        if (this.nameList.length !== 0) {
          this.nameList.forEach(rows => {
            this.$refs.tableObject.toggleRowSelection(rows)
          })
        } else {
          this.$refs.tableObject.clearSelection()
        }
      })
    },
    getChooseUserRow (val) {
      this.selectData = val
    },
    echoUserData () {
      if (this.taskId !== '') {
        let params = { 'taskId': this.taskId }
        this.$http.get('/ctc/task/relation/show', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            console.log(res)
            let demand = res.data.demand
            this.selectList = demand
            let id = []
            let name = []
            for (let i = 0; i < demand.length; i++) {
              id.push(demand[i].id)
              name.push({ demandId: demand[i].id, demandName: demand[i].name })
            }
            this.$emit('input', id)
            this.nameList = name
            if (this.taskData.baseInfo.taskStatus === 1) {
              this.temporaryStorageData = id
              let newNameList = []
              name.forEach(item => {
                newNameList.push({ disable: true, ...item })
              })
              this.nameList = newNameList
            }
          }
        }).catch(() => { })
      } else {
        this.nameList = []
      }
    },
    doResetGetUserList () {
      this.dataForm.loginName = ''
      this.getUserList()
    },
    getUserList () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      this.userList = []
      // '/account4a/organize/manager/user/list'
      let url = '/account4a/organize/manager/sub/user/list'
      this.$http.get(url, {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.dataForm
        }
      }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
        // this.total = res.data.total
      }).catch(() => { thisvm.$ctcLoading.close() })
    },
    cancelHandle () {
      this.visibleUser = false
      this.userList = []
    },
    commitHandle () {
      const node = this.selectData
      if (node.length === 0) {
        this.$message.warning(this.placeholder)
        return
      }
      let id = []
      let name = []
      for (let i = 0; i < node.length; i++) {
        id.push(
          {
            loginName: node[i].loginName,
            userId: node[i].id
          }
        )
        name.push(node[i])
      }
      this.$emit('input', id)
      this.nameList = name
      this.visibleUser = false
    }
  }
}
</script>
