<template>
  <el-row class="platform-member-set">
    <el-col :span="8">
      <el-input placeholder="请输入成员账号/成员名称" v-model="searchname" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getMemberTableData"></el-button>
      </el-input>
    </el-col>
    <el-col :span="16" style="text-align:right;">
      <el-button type="primary" plain size="small" @click="doAddUserClick(1,'addMember')">添加成员</el-button>
      <el-button type="primary" plain size="small" @click="doAddUserClick(2,'addRefMemberGroup')">引用成员</el-button>
      <!--<el-button type="primary" plain size="small" @click="batchHandleSetRoleClick()">设置角色</el-button>-->
      <el-button type="primary" plain size="small" @click="handleBatchRemoveClick()" :disabled="doValidBtnAuth()">删除成员</el-button>
      <el-radio-group v-model="projectMemberView" size="small" style="margin-left:10px;margin-bottom:5px;" @change="projectMemberViewChange">
        <el-radio-button label="1">列表视图</el-radio-button>
        <el-radio-button label="2">概览视图</el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col :span="24" class="el-tabls-group" style="margin-top:15px;">
      <el-table stripe :data="projectTableData" ref="projectTableData" border height="650" v-if="projectMemberView==1">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="userName" label="成员账号" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="成员姓名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userType" label="平台角色" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.userType==1?'测试人员':'接口人员'}}
          </template>
        </el-table-column>
        <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleRemoveClick(scope.row)" type="text" size="small" :disabled="doValidBtnAuth(scope.row)">移除</el-button>
            <el-button @click="handleSetRoleClick(scope.row)" type="text" size="small" :disabled="doValidBtnAuth(scope.row)">设置角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" v-if="projectMemberView==2" style="height: 500px;overflow-y:auto;padding-top:15px;">
        <template v-for="(value,key) in overviewDataMap">
          <div :key="key" class="defect-province-div">
            {{key}}（{{value.length}}个）：{{value.length>0?value.join('、'):''}}
          </div>
        </template>
      </el-col>
    </el-col>
    <add-member :visible.sync="addMember" ref="addMember" @watchChildMethod="triggerParentMethod"></add-member>
    <add-ref-member-group :visible.sync="addRefMemberGroup" ref="addRefMemberGroup" @watchChildMethod="triggerParentMethod"></add-ref-member-group>
    <set-role :visible.sync="setRole" ref="setRole" @watchChildMethod="triggerParentMethod"></set-role>
  </el-row>
</template>
<script>
import AddMember from './choose-dialog/add-member'
import AddRefMemberGroup from './choose-dialog/add-ref-member-group'
import SetRole from './choose-dialog/set-role'
export default {
  name: 'PlatformMemberSet',
  components: {
    AddMember, AddRefMemberGroup, SetRole
  },
  data () {
    return {
      platformId: '',
      platformCreator: '',
      projectMemberView: '1',
      searchname: '',
      projectTableData: [],
      overviewDataMap: {},
      matchCacheData: {
        memeberDataMap: {},
        testObjectDataMap: {}
      },
      addMember: false,
      addRefMemberGroup: false,
      setRole: false
    }
  },
  computed: {

  },
  mounted () {
    this.platformId = this.$route.params.platformId || ''
    this.platformCreator = this.$route.params.platformCreator || ''
    this.getMemberTableData()
  },
  methods: {
    triggerParentMethod (message) {
      // 判断是否是函数执行
      if (message.type === 'execute') {
        this.executeMethod(message)
      } else if (message.type === 'reloadTable') {
        this.getMemberTableData()
      }
    },
    doValidBtnAuth () {
      let thisvm = this
      let authFlag = true
      let opAuth = [thisvm.platformCreator]
      // 特殊判断,是否是超级管理员
      if (thisvm.$store.state.user.superAdmin === 1) {
        opAuth.push(thisvm.$store.state.user.id)
      }
      // 判断当前登录账号
      if (opAuth.includes(thisvm.$store.state.user.id)) {
        authFlag = false
      }
      return authFlag
    },
    getMemberTableData () {
      this.$ctcLoading.open()
      let params = { 'platformId': this.platformId, 'userName': this.searchname, 'realName': this.searchname }
      let url = '/sys/platformUser/list'
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          let dataMap = {}
          let data = res.data
          data.forEach((item, index) => {
            dataMap[item.userId] = item
          })
          this.projectTableData = data
          this.matchCacheData.memeberDataMap = dataMap
        }
        this.$nextTick(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    projectMemberViewChange (item) {
      // 概览视图
      if (item === '2') {
        let overviewDataMap = {}
        let overviewData = Object.assign([], this.projectTableData)
        overviewData.forEach((item, index) => {
          let userTypeName = (item.userType === 1) ? '测试人员' : '接口人员'
          let key = userTypeName
          if (!overviewDataMap.hasOwnProperty(key)) {
            overviewDataMap[key] = []
          }
          overviewDataMap[key].push(item.realName)
        })
        this.overviewDataMap = overviewDataMap
      }
    },
    // 执行服务
    executeMethod (message) {
      if (message.postType === 'get') {
        this.$http.get(message.url, { params: { ...message.data } }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.data.reload) {
              this.getMemberTableData()
            }
          }
        }).catch(() => {
        })
      } else {
        // 支持[put,post,delete]
        this.$http[message.postType](message.url, message.data).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.reload) {
              this.getMemberTableData()
            }
          }
        }).catch(() => {
        })
      }
    },
    handleRemoveClick (row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        data.data = [row.id]
        let params = { 'type': 'execute', 'postType': 'delete', 'url': '/sys/platformUser', 'reload': true }
        let saveParams = { ...params, 'data': data }
        this.executeMethod(saveParams)
      }).catch(() => {
      })
    },
    doAddUserClick (type, refsType) {
      this.$refs[refsType].platformId = this.platformId
      this.$refs[refsType].init()
    },
    batchHandleSetRoleClick () {
      let selection = this.$refs.projectTableData.selection
      if (selection.length > 0) {
        let platformMemberIds = []
        selection.forEach((item, index) => {
          platformMemberIds.push(item.id)
        })
        this.$refs.setRole.dataForm.userType = '1'
        this.$refs.setRole.platformMemberIds = platformMemberIds
        this.$refs.setRole.init()
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    },
    handleSetRoleClick (row) {
      this.$refs.setRole.dataForm.userType = row.userType + ''
      this.$refs.setRole.platformMemberIds = [row.id]
      this.$refs.setRole.init()
    },
    handleBatchRemoveClick () {
      let selection = this.$refs.projectTableData.selection
      if (selection.length > 0) {
        this.$confirm('确定进行[删除]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let platformMemberIds = []
          selection.forEach((item, index) => {
            platformMemberIds.push(item.id)
          })
          let data = {}
          data.data = platformMemberIds
          let params = { 'type': 'execute', 'postType': 'delete', 'url': '/sys/platformUser', 'reload': true }
          let saveParams = { ...params, 'data': data }
          this.executeMethod(saveParams)
        }).catch(() => { })
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.platform-member-set {
}
</style>
