<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false" class="membergroup-dialog" width="80%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="userGroupName" label="成员组名称：">
        <el-input v-model="dataForm.userGroupName" placeholder="请输入成员组名称"></el-input>
      </el-form-item>
      <el-tabs v-model="activeGroup" type="card" @tab-click="handleClick">
        <el-tab-pane label="开发组" name="1">
        </el-tab-pane>
        <el-tab-pane label="测试组" name="2">
        </el-tab-pane>
      </el-tabs>
      <transition name="el-zoom-in-center">
        <el-row v-if="tableVisible" class="choose-member-data">
          <el-col :span="11" style="border:1px solid #ccc;padding-left:0px;">
            <el-table ref="leftTableObject" :data="leftTableData" style="width: 100%;height:350px;">
              <el-table-column width="55" type="selection" :selectable="selectable">
              </el-table-column>
              <el-table-column label="姓名" prop="realName"></el-table-column>
              <el-table-column align="left" width="280">
                <template slot="header">
                  <el-input v-model="leftSearchName" size="mini" placeholder="输入用户名搜索" style="float:left;width:150px;" />
                  <el-button type="primary" style="float: left;height: 30px;line-height: 3px;margin-left: 9px;" @click="getLeftUserInfo">查询</el-button>
                </template>
                <template slot-scope="scope">
                  <span>机构：{{scope.row.organizeName}}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" @current-change="getLeftUserInfo" style="text-align:left;">
            </el-pagination>
          </el-col>
          <el-col :span="2" style="height:400px;text-align:center;">
            <el-col :span="24">
              <el-button size="mini" style="margin-top: 200px;" type="primary" @click="executeSelectUser(2)">右 移</el-button>
            </el-col>
            <el-col :span="24">
              <el-button size="mini" style="margin-top:15px;" type="primary" @click="executeSelectUser(1)">左 移</el-button>
            </el-col>
          </el-col>
          <el-col :span="11" style="height:400px;border:1px solid #ccc;">
            <el-table ref="rightTableObject" :data="rightTableData.filter(data => !rightSearchName || data.userName.toLowerCase().includes(rightSearchName.toLowerCase()))" style="width:100%;height:400px;overflow-y:auto;">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="userName" label="姓名" width="180">
              </el-table-column>
              <el-table-column align="center">
                <template slot="header">
                  <el-input v-model="rightSearchName" size="mini" placeholder="输入用户名搜索" />
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="managerRadio" :label="scope.row.userId" v-if="activeGroup=='2' && scope.row.isManager=='1'">项目经理</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </transition>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        userGroupName: ''
      },
      tableVisible: true,
      activeGroup: '1',
      devMemberGroup: [], // 开发组成员
      devMemberSelectMap: {}, // 开发组已选成员
      devManagerRadio: '', // 标识开发组项目经理
      testMemberGroup: [], // 测试组成员
      testMemberSelectMap: {}, // 测试组已选成员
      testManagerRadio: '', // 标识测试组项目经理
      leftSearchName: '', // 左表格过滤条件
      rightSearchName: '', // 右表格过滤条件
      leftTableData: [],
      rightTableData: [],
      rightTableSelectMap: {}, // 右表格选中的值
      managerRadio: '', // 标识项目经理
      page: 1,
      limit: 6,
      total: 0
    }
  },
  computed: {
    dataRule () {
      return {
        userGroupName: [
          { required: true, message: '成员组名称不允许为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.activeGroup = '1'
        this.devMemberGroup = []
        this.devMemberSelectMap = {}
        this.devManagerRadio = '-1'
        this.testMemberGroup = []
        this.testMemberSelectMap = {}
        this.testManagerRadio = '-1'
        this.leftTableData = []
        this.rightTableData = []
        this.rightTableSelectMap = {}
        this.managerRadio = '-1'
        if (this.dataForm.id !== '' && this.dataForm.id !== undefined) {
          Promise.all([
            this.getMemberGroupById(),
            this.getLeftUserInfo()
          ]).then((result) => {
          })
        } else {
          this.getLeftUserInfo()
        }
      })
    },
    handleClick (tab, event) {
      if (tab.name === '1') {
        // 切换到开发组，默认先把右边表格已选的数据，同步给测试组
        this.testMemberGroup = this.rightTableData
        this.testMemberSelectMap = this.rightTableSelectMap
        this.testManagerRadio = this.managerRadio
        // 下一步:把开发组数据同步给右边表格
        this.rightTableData = this.devMemberGroup
        this.rightTableSelectMap = this.devMemberSelectMap
        this.managerRadio = this.devManagerRadio
      } else {
        // 切换到测试组，默认先把右边表格已选的数据，同步给开发组
        this.devMemberGroup = this.rightTableData
        this.devMemberSelectMap = this.rightTableSelectMap
        this.devManagerRadio = this.managerRadio
        // 下一步:把测试组数据同步给右边表格
        this.rightTableData = this.testMemberGroup
        this.rightTableSelectMap = this.testMemberSelectMap
        this.managerRadio = this.testManagerRadio
      }
      let thisvm = this
      // 重新加载数据
      thisvm.getLeftUserInfo()
      thisvm.tableVisible = false
      setTimeout(function () {
        thisvm.tableVisible = true
      }, 200)
    },
    getMemberGroupById () {
      this.$http.get(`/ctc/project/userGroup/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          // 设置成员组名称
          this.dataForm.userGroupName = res.data.userGroupName
          // 设置右边[开发组]已选用户信息
          let devMemberGroup = []
          res.data.userGroupDevMembers.forEach((item, index) => {
            devMemberGroup.push(item)
            this.devMemberSelectMap[item.userId] = item
            // 设置项目经理
            if (item.manager === 1) {
              this.devManagerRadio = item.userId
            }
          })
          this.devMemberGroup = devMemberGroup

          let testMemberGroup = []
          res.data.userGroupTestMembers.forEach((item, index) => {
            testMemberGroup.push(item)
            this.testMemberSelectMap[item.userId] = item
            // 设置项目经理
            if (item.manager === 1) {
              this.testManagerRadio = item.userId
            }
          })
          this.testMemberGroup = testMemberGroup
          // 默认选中开发组
          this.rightTableData = this.devMemberGroup
          this.rightTableSelectMap = this.devMemberSelectMap
          this.managerRadio = this.devManagerRadio
        }
      }).catch(() => { })
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      this.$http.get(`sys/project/select/userGroupMember`, {
        params: {
          order: '',
          orderField: '',
          username: this.leftSearchName,
          memberType: this.activeGroup,
          sidx: 1,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.total = res.data.total
          this.leftTableData = res.data.list
        }
      }).catch(() => { })
    },
    // 判断左侧用户是否禁用
    selectable (row, index) {
      let dataMap = this.activeGroup === '1' ? this.testMemberSelectMap : this.devMemberSelectMap
      if (dataMap.hasOwnProperty(row.id)) {
        return false
      } else {
        return true
      }
    },
    // 左移、友移
    executeSelectUser (type) {
      if (type === 1) {
        // 左移
        let tableData = []
        let selectionData1 = this.$refs.rightTableObject.selection
        this.rightTableData.forEach((titem, index) => {
          let bool = false
          selectionData1.forEach((item, index) => {
            if (titem.userId === item.userId) {
              bool = true
            }
          })
          // 判断是否存在,存在移除掉键值Map
          if (bool) {
            delete this.rightTableSelectMap[titem.userId]
          } else {
            tableData.push(titem)
          }
        })
        this.rightTableData = tableData
      } else {
        // 右移
        let selectionData2 = this.$refs.leftTableObject.selection
        selectionData2.forEach((item, index) => {
          item.userId = item.id
          item.userName = item.realName
          item.manager = 0
          if (!this.rightTableSelectMap.hasOwnProperty(item.userId)) {
            this.rightTableData.push(item)
            this.rightTableSelectMap[item.userId] = item
          }
        })
      }
    },
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        // 把当前操作数据，赋给当前对象
        if (this.activeGroup === '1') {
          this.devMemberGroup = this.rightTableData
          this.devMemberSelectMap = this.rightTableSelectMap
          this.devManagerRadio = this.managerRadio
        } else {
          this.testMemberGroup = this.rightTableData
          this.testMemberSelectMap = this.rightTableSelectMap
          this.testManagerRadio = this.managerRadio
        }

        // 开发组成员
        let userGroupMembers = []
        this.devMemberGroup.forEach((titem, index) => {
          if (this.devManagerRadio === titem.userId) {
            userGroupMembers.push({ 'memberType': 1, 'userGroupMemberId': titem.userGroupMemberId, 'userGroupId': this.dataForm.id, 'userId': titem.userId, 'userName': titem.userName, 'manager': '1' })
          } else {
            userGroupMembers.push({ 'memberType': 1, 'userGroupMemberId': titem.userGroupMemberId, 'userGroupId': this.dataForm.id, 'userId': titem.userId, 'userName': titem.userName, 'manager': '0' })
          }
        })
        // 测试组成员
        let userGroupTestMembers = []
        this.testMemberGroup.forEach((titem, index) => {
          if (this.testManagerRadio === titem.userId) {
            userGroupTestMembers.push({ 'memberType': 2, 'userGroupMemberId': titem.userGroupMemberId, 'userGroupId': this.dataForm.id, 'userId': titem.userId, 'userName': titem.userName, 'manager': '1' })
          } else {
            userGroupTestMembers.push({ 'memberType': 2, 'userGroupMemberId': titem.userGroupMemberId, 'userGroupId': this.dataForm.id, 'userId': titem.userId, 'userName': titem.userName, 'manager': '0' })
          }
        })
        this.dataForm.userGroupId = this.dataForm.id
        this.dataForm.userGroupDevMembers = userGroupMembers
        this.dataForm.userGroupTestMembers = userGroupTestMembers
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/project/userGroup', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.membergroup-dialog {
  .el-tabs {
    margin-left: 20px;
  }
  .choose-member-data {
    margin-left: 20px;
  }
  .el-dialog__footer {
  }
}
</style>
