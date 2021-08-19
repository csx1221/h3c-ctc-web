<template>
  <el-dialog title="引用成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="add-ref-member-group">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="平台名称">
                <el-input v-model="dataForm.name" placeholder="请输入平台名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" :data="leftTableData" border height="455px">
      <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="平台名称" header-align="left" align="left" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column prop="interfaceUserCount" label="接口人数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="testUserCount" label="测试人数量" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前已选成员" prop="selectMemberNum" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{userSelectLengthMap[scope.row.id]?userSelectLengthMap[scope.row.id]:0}}
        </template>
      </el-table-column>
      <el-table-column label="查看成员" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          <el-button @click="handleProjectMemberTree(scope.row,scope.$index)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getLeftUserInfo" style="text-align:left;">
    </el-pagination>
    <!--项目成员树结构-->
    <el-dialog width="25%" title="平台成员架构树" :visible.sync="projectMemTreeVisible" :close-on-click-modal="false" @close='closeProjectMemberTreeDialog' append-to-body>
      <el-tree show-checkbox highlight-current default-expand-all ref="projectMemberTreeData" :data="projectMemberTreeData" :props="defaultProps" :default-checked-keys="checkedKeys" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:平台名称;2成员}-->
          <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
          <span>{{data.nodeName}}</span>
        </span>
      </el-tree>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button size="small" @click="closeProjectMemberTreeDialog">返 回</el-button>
          <el-button size="small" type="primary" @click="doProjectMemberTreeChoose">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-row>
      <el-col :span="24" class="selected">
        <span style="padding-right:15px;">已入库 {{Object.keys(projectMemberDetailMap).length}} 个</span>
        <el-button size="small" type="primary" @click="handleConfirm">提 交</el-button>
      </el-col>
    </el-row>
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
      dataForm: {
        name: '',
        page: 1,
        limit: 7
      },
      echoDataForm: {
        deptId: ''
      },
      total: 0,
      platformId: '',
      projectIdTree: '',
      projectIdTreeIndex: 0,
      leftTableData: [],
      projectMemTreeVisible: false,
      userSelectLengthMap: {}, // 用户操作勾选的数量
      userSelectMemberMap: {}, // 用户操作勾选的用户
      projectMemberDetailMap: {},
      projectMemberTreeData: [],
      checkedKeys: [], // 默认选中节点
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
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
        this.$refs.dataForm.resetFields()
        this.dataForm.page = 1
        this.leftTableData = []
        this.userSelectLengthMap = {}
        this.userSelectMemberMap = {}
        this.projectMemberDetailMap = {}
        this.checkedKeys = []
        this.getMemberTableDataById()
      })
    },
    doResetLeftUserInfo () {
      this.$refs.dataForm.resetFields()
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = thisvm.dataForm
      thisvm.$http.get('/sys/platform/page', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.total = res.data.total
          thisvm.leftTableData = res.data.list
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleProjectMemberTree (row, tableIndex) {
      this.projectMemTreeVisible = true
      this.$nextTick(() => {
        this.projectIdTree = row.id
        this.projectIdTreeIndex = tableIndex
        // 设置默认选中
        let memberData = this.userSelectMemberMap[this.projectIdTree]
        let checkedKeys = []
        if (memberData) {
          memberData.forEach((item, index) => {
            checkedKeys.push(item.id)
          })
        }
        this.checkedKeys = checkedKeys
        this.getProjectMemberTreeData()
      })
    },
    closeProjectMemberTreeDialog () {
      this.projectMemTreeVisible = false
    },
    // 根据项目id，获取已保存的项目成员
    getMemberTableDataById () {
      let params = { 'platformId': this.platformId }
      let url = '/sys/platformUser/listInfo'
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          res.data.forEach((item, index) => {
            this.projectMemberDetailMap[item.id] = item
          })
          this.getLeftUserInfo()
        }
      }).catch(() => { })
    },
    getProjectMemberTreeData () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { 'platformId': thisvm.projectIdTree }
      thisvm.$http.get('/sys/platformUser/listPlatformUserTree', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        // 设置不可选
        let data = res.data
        data[0].children.forEach((item, index) => {
          item.disabled = false
          if (thisvm.projectMemberDetailMap.hasOwnProperty(item.id)) {
            item.disabled = true
          }
        })
        thisvm.projectMemberTreeData = data
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let iconPic = ''
        if (data.nodeType === 1) {
          iconPic = 'sys_icon_2'
        } else if (data.nodeType === 2) {
          iconPic = 'sys_icon_4'
        }
        return require('../../../../../assets/img/' + iconPic + '.png')
      } else {
        let mapInfo = { '1': '平台名称', '2': '成员' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    handleNodeClick (data) {
    },
    // 项目成员树保存
    doProjectMemberTreeChoose () {
      let thisvm = this
      let nodeData = thisvm.$refs.projectMemberTreeData.getCheckedNodes()
      let memberData = []
      nodeData.forEach((item, index) => {
        if (item.nodeType === 2) {
          memberData.push(item)
        }
      })
      thisvm.userSelectMemberMap[this.projectIdTree] = memberData
      // 设置选中数量
      thisvm.$set(thisvm.userSelectLengthMap, this.projectIdTree, memberData.length)
      this.closeProjectMemberTreeDialog()
    },
    // 最终保存入库
    handleConfirm () {
      let thisvm = this
      let data = []
      // 校验是否重复成员
      let repetMemberData = []
      let userSelectMemberMap = thisvm.userSelectMemberMap
      for (let key in userSelectMemberMap) {
        if ({}.hasOwnProperty.call(userSelectMemberMap, key)) {
          let memberData = userSelectMemberMap[key]
          memberData.forEach((item, index) => {
            if (!repetMemberData.includes(item.userId)) {
              item.platformId = thisvm.platformId
              item.userId = item.id
              item.realName = item.nodeName
              // userType(1:测试人员;2:接口人)
              item.userType = 1
              data.push(item)
              repetMemberData.push(item.userId)
            }
          })
        }
      }
      if (data.length > 0) {
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/sys/platformUser', 'reload': true }
        thisvm.$emit('watchChildMethod', { ...params, 'data': data })
      }
      thisvm.handleDialogClose()
    }
  }
}
</script>
<style lang="scss">
.add-ref-member-group {
  .selected {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
