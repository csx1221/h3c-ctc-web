<template>
  <el-dialog title="工单派发" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" width="75%" class="add-member-group">
    <el-row class="add-member-filter">
      <el-col :span="20" style="padding-left:10px;">
        <el-input v-model="leftSearchName" placeholder="过滤左侧表格成员名称"></el-input>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" size="small" @click="getLeftUserInfo">查询</el-button>
        <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="13" style="border:1px solid #ccc;padding-left:0px;">
        <el-table ref="leftTableObject" :data="leftTableData" style="width: 100%;height:470px;overflow-y:auto;">
          <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
          <el-table-column label="姓名" prop="participantUserName" show-overflow-tooltip></el-table-column>
          <el-table-column label="归属机构" prop="organizeName" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="2" style="height:520px;text-align:center;">
        <el-col :span="24">
          <el-button size="mini" style="margin-top: 200px;" type="primary" @click="executeSelectUser(2)">右 移</el-button>
        </el-col>
        <el-col :span="24">
          <el-button size="mini" style="margin-top:15px;" type="primary" @click="executeSelectUser(1)">左 移</el-button>
        </el-col>
      </el-col>
      <el-col :span="9" style="height:520px;border:1px solid #ccc;">
        <el-table ref="rightTableObject" :data="rightTableData.filter(data => !rightSearchName || data.userName.toLowerCase().includes(rightSearchName.toLowerCase()))" style="width:100%;height:520px;overflow-y:auto;">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="userName" label="用户账号" width="180">
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <el-input v-model="rightSearchName" size="mini" placeholder="输入用户账号搜索" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div :span="24" class="selected">
      <el-button @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      projectId: '',
      orderDealId: '',
      orderId: '',
      leftSearchName: '', // 左表格过滤条件
      rightSearchName: '', // 右表格过滤条件
      leftTableData: [],
      rightTableData: [],
      rightTableSelectMap: {} // 右表格选中的值
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.leftSearchName = ''
        this.leftTableData = []
        this.rightSearchName = ''
        this.rightTableData = []
        this.rightTableSelectMap = {}
        this.doResetLeftUserInfo()
      })
    },
    doResetLeftUserInfo () {
      this.leftSearchName = ''
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      this.$http.get('/ctc/task/todo/participantuser', {
        params: {
          order: '',
          projectId: this.projectId,
          orderId: this.orderId,
          orderDealId: this.orderDealId,
          userName: this.leftSearchName
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.leftTableData = res.data.list
        }
      }).catch(() => { })
    },
    // 判断左侧用户是否禁用(返回true 即为可以勾选)
    selectable (row, index) {
      let bool = (row.isFree === 0)
      return bool
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
          item.userId = item.participantUserId
          item.userName = item.participantUserName
          item.projectId = this.projectId
          item.orderId = this.orderId
          item.parentOrderDealId = this.orderDealId
          if (!this.rightTableSelectMap.hasOwnProperty(item.userId)) {
            this.rightTableData.push(item)
            this.rightTableSelectMap[item.userId] = item
          }
        })
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let data = this.rightTableData
      if (data.length > 0) {
        this.$http.post('/ctc/task/todo/save', data).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('工单派发失败')
          } else {
            this.$message.success('工单派发成功')
            this.handleDialogClose()
          }
        }).catch(() => { })
      } else {
        this.$message.warning('请选择要派单的成员')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-member-group {
  .add-member-filter {
    margin-bottom: 10px;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
