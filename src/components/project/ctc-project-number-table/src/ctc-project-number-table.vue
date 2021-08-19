<template>
  <div>
    <div class="el-input el-input-group el-input-group--append">
      <div class="el-input__inner dib" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList">
          <el-tag v-if="item.disable" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
          <el-tag v-else class="eltag" :key="index" closable @close="handleClose(item)">{{item.name}}</el-tag>
        </template>
      </div>
      <el-input v-else :placeholder="placeholder"></el-input>
      <div class="el-input-group__append">
        <el-button icon="el-icon-search" @click="userDialog"></el-button>
      </div>
    </div>
    <!--    <el-input :value="value" style="display: none"></el-input>-->
    <el-dialog :visible.sync="visibleUser" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <el-input v-model="searchName" placeholder="请输入用户账号"></el-input>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" border :data="userList" style="width: 100%;height:340px;" @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" header-align="center" align="center" width="60" :reserve-selection="true" :selectable="selectable"></el-table-column>
        <el-table-column prop="userName" label="用户账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" label="部门" header-align="center" align="center"></el-table-column>
        <el-table-column prop="organizeName" label="机构" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getUserList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectNumberTable',
  data () {
    return {
      visibleUser: false,
      userList: [],
      showUserName: '',
      nameList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: [],
      userRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0,
      temporaryStorageData: []
    }
  },
  props: {
    value: Array,
    taskId: String,
    taskData: Object,
    taskType: [Number, String],
    placeholder: String,
    numberData: Array
  },
  watch: {
    taskId (newVal, oldVal) {
      this.echoUserData()
    },
    'taskData.operationType' (newVal, oldVal) {
      if (newVal === 'add' && this.taskData.projectStageId) {
        this.defaultData()
      }
    },
    'taskData.projectStageId' (newVal, oldVal) {
      if (this.taskData.operationType === 'add' && newVal) {
        this.defaultData()
      }
    }
  },
  mounted () {
    if (this.taskData.projectStageId && this.taskData.operationType === 'add') {
      this.defaultData()
    }
  },
  methods: {
    getRowKeys (row) {
      return row.userId
    },
    defaultData () {
      this.$http.get('/ctc/task/member/member', {
        params: {
          taskType: this.taskType,
          projectId: this.taskData.projectId,
          projectStageId: this.taskData.projectStageId,
          userName: this.searchName,
          page: this.page,
          limit: 9999
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let list = res.data.data.list
          // this.selectList = list
          // this.total = res.data.data.total

          if (list.length > 0) {
            let lists = []
            let dataArr = []
            for (let i = 0; i < list.length; i++) {
              dataArr.push({ id: list[i].userId, name: list[i].realName })
              let obj = {}
              obj.userId = list[i].userId
              obj.userName = list[i].realName
              lists.push(obj)
            }
            this.nameList = dataArr
            this.$emit('input', lists)
          }
        }
      }).catch(() => { })
    },
    handleClose (tag) {
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      let node = this.nameList
      let list = []
      for (let i = 0; i < node.length; i++) {
        let obj = {}
        obj.userId = node[i].id
        obj.userName = node[i].name
        list.push(obj)
      }
      this.$emit('input', list)
    },
    selectable (row, index) {
      if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
        for (let i = 0; i < this.temporaryStorageData.length; i++) {
          if (this.temporaryStorageData[i].userId === row.userId) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    handleSelectionChange (val) {
      this.selectRowData = val
    },
    userDialog () {
      this.visibleUser = true
      this.page = 1
      this.getUserList()
      this.$nextTick(() => {
        this.$refs.tableObject.clearSelection()
        if (this.value.length !== 0) {
          this.value.forEach(rows => {
            this.$refs.tableObject.toggleRowSelection(rows)
          })
        } else {
          this.$refs.tableObject.clearSelection()
        }
      })
    },
    getChooseUserRow (index, row) {
      this.selectRowData = row
    },
    echoUserData () {
      if (this.taskId !== '') {
        this.$http.get('/ctc/task/member/list', {
          params: {
            taskId: this.taskId
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            console.log(res)
            let list = res.data
            let lists = []
            let dataArr = []
            for (let i = 0; i < list.length; i++) {
              dataArr.push({ id: list[i].userId, name: list[i].userName })
              let obj = {}
              obj.userId = list[i].userId
              obj.userName = list[i].userName
              lists.push(obj)
            }
            this.nameList = dataArr
            this.$emit('input', lists)
            if ([1, 2].includes(this.taskData.baseInfo.taskStatus) || this.taskData.readOnly === 1) {
              this.temporaryStorageData = lists
              let newNameList = []
              dataArr.forEach(item => {
                newNameList.push({ disable: true, ...item })
              })
              this.nameList = newNameList
            }
            // this.userList = res.data.data.list
            // this.total = res.data.data.total
          }
        }).catch(() => { })
      } else {
        this.nameList = []
      }
    },
    doResetGetUserList () {
      this.searchName = ''
      this.getUserList()
    },
    getUserList () {
      this.$http.get('/ctc/task/member/member', {
        params: {
          taskType: this.taskType,
          projectId: this.taskData.projectId,
          projectStageId: this.taskData.projectStageId,
          userName: this.searchName,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.userList = res.data.data.list
          this.total = res.data.data.total
        }
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleUser = false
      this.userList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (node.length === 0) {
        this.$message.warning(this.placeholder)
        return
      }
      let dataArr = []
      let list = []
      for (let i = 0; i < node.length; i++) {
        let realName = node[i].realName || node[i].userName
        dataArr.push({ id: node[i].userId, name: realName })
        let obj = {}
        obj.userId = node[i].userId
        obj.userName = realName
        list.push(obj)
      }
      this.nameList = dataArr
      this.$emit('input', list)
      if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
        for (let i = 0; i < dataArr.length; i++) {
          for (let j = 0; j < this.temporaryStorageData.length; j++) {
            if (this.temporaryStorageData[j].userId === dataArr[i].id) {
              dataArr[i].disable = true
            }
          }
        }
        this.nameList = dataArr
      }
      this.visibleUser = false
    }
  }
}
</script>
