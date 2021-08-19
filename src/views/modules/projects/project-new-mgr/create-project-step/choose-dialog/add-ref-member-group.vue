<template>
  <el-dialog title="引用成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="75%" class="add-ref-member-group">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="7">
              <el-form-item prop="name" label="项目名称">
                <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="deptId" label="所属部门">
                <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择所属部门" :deptId.sync="echoDataForm.deptId" :organizeId.sync="dataForm.organizeId"></ctc-dept-table>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="managerId" label="项目经理">
                <el-select v-model="dataForm.managerId" clearable filterable placeholder="请选择项目经理">
                  <el-option v-for="item in managerData" :key="item.id" :label="item.realName" :value="item.id">
                    <span style="color: #8492a6; font-size: 13px" :title="item.username"> {{ item.realName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:center;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" :data="leftTableData" border height="455px">
      <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
      <el-table-column label="项目名称" prop="name" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属机构" prop="organizeIdName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="项目经理" prop="managerName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前已选成员" prop="selectMemberNum" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{userSelectLengthMap[scope.row.projectId]?userSelectLengthMap[scope.row.projectId]:0}}
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
    <el-dialog width="25%" title="项目成员架构树" :visible.sync="projectMemTreeVisible" :close-on-click-modal="false" @close='closeProjectMemberTreeDialog' append-to-body>
      <el-tree show-checkbox highlight-current default-expand-all ref="projectMemberTreeData" :data="projectMemberTreeData" :props="defaultProps" :default-checked-keys="checkedKeys" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
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
        organizeId: '',
        deptId: '',
        managerId: '',
        page: 1,
        limit: 7
      },
      echoDataForm: {
        deptId: ''
      },
      managerData: [],
      total: 0,
      projectId: '',
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
        this.echoDataForm.deptId = 'clear_' + Math.random()
        this.dataForm.page = 1
        this.leftTableData = []
        this.userSelectLengthMap = {}
        this.userSelectMemberMap = {}
        this.projectMemberDetailMap = {}
        this.checkedKeys = []
        this.getMemberTableDataById()
        this.getManagerData()
      })
    },
    doResetLeftUserInfo () {
      this.$refs.dataForm.resetFields()
      this.echoDataForm.deptId = 'clear_' + Math.random()
      this.getLeftUserInfo()
    },
    getManagerData () {
      let params = { 'page': 1, 'limit': 999999999 }
      this.$http.get('/sys/project/select/manager', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.managerData = res.data.list
        }
      }).catch(() => {
      })
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = thisvm.dataForm
      params.excludeProjectId = thisvm.projectId
      thisvm.$http.get('/ctc/project/userGroup/pageQuote', {
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
        this.projectIdTree = row.projectId
        this.projectIdTreeIndex = tableIndex
        // 设置默认选中
        let memberData = this.userSelectMemberMap[this.projectIdTree]
        let checkedKeys = []
        if (memberData) {
          memberData.forEach((item, index) => {
            checkedKeys.push(item.userId)
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
      let params = { 'projectId': this.projectId }
      let url = '/ctc/project/projectMember/list'
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          res.data.forEach((item, index) => {
            this.projectMemberDetailMap[item.userId] = item
          })
          this.getLeftUserInfo()
        }
      }).catch(() => { })
    },
    getProjectMemberTreeData () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { 'projectId': thisvm.projectIdTree }
      thisvm.$http.get('/ctc/project/userGroup/listQuoteTree', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        // 设置不可选
        let data = res.data
        data[0].children.forEach((item, index) => {
          item.children.forEach((titem, tindex) => {
            titem.disabled = false
            if (thisvm.projectMemberDetailMap.hasOwnProperty(titem.id)) {
              titem.disabled = true
            }
          })
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
          iconPic = 'icon_1'
        } else if (data.nodeType === 2) {
          iconPic = 'sys_icon_2'
        } else if (data.nodeType === 3) {
          iconPic = 'sys_icon_2'
        } else if (data.nodeType === 4) {
          iconPic = 'sys_icon_4'
        }
        return require('../../../../../../assets/img/' + iconPic + '.png')
      } else {
        let mapInfo = { '1': '项目名称', '2': '项目组名称', '3': '机构名称', '4': '成员' }
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
        if (item.nodeType === 4) {
          memberData.push(item.saveParam)
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
              item.projectId = thisvm.projectId
              item.manager = 0
              data.push(item)
              repetMemberData.push(item.userId)
            }
          })
        }
      }
      if (data.length > 0) {
        let params = { 'type': 'execute', 'executeType': 'projectMember', 'postType': 'post', 'url': '/ctc/project/projectMember', 'reload': true }
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
