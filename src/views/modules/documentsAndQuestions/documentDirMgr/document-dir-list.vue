<template>
  <div class="document-dir-List">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-row style="margin-bottom:10px;">
            <el-col :span="10">
              <el-input placeholder="请输入名称" v-model="searchname" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getMemberTableData"></el-button>
              </el-input>
            </el-col>
            <el-col :span="14" style="text-align:right;">
              <span style="color:#ec3208;font-size:18px;" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==0">你无权限操作该目录</span>
              <el-button type="blue" size="small" v-if="activeGroup==1 && projectData && projectData.dirLevel>0 && projectData.ifAdmin==1" @click="doAddMemberAndOrganize(1)">添加账号</el-button>
              <el-button type="blue" size="small" v-if="activeGroup==2 && projectData && projectData.dirLevel>0 && projectData.ifAdmin==1" @click="doAddMemberAndOrganize(2)">添加参测</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-tabs v-model="activeGroup" type="border-card" @tab-click="handleSwitchGroupClick">
            <el-tab-pane label="按账号配置" name="1">
              <el-radio-group v-model="projectMemberView" size="small" style="margin-bottom:5px;" @change="projectMemberViewChange">
                <el-radio-button label="1">列表视图</el-radio-button>
                <el-radio-button label="2">概览视图</el-radio-button>
              </el-radio-group>
              <el-table stripe :data="projectTableData" border height="600" v-if="activeGroup==1 && projectMemberView==1">
                <el-table-column prop="userName" label="成员名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="realName" label="成员姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="memberType" label="成员类型" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.memberType==1">项目成员</span>
                    <span v-else>参测成员</span>
                  </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ifRead" label="目录浏览权限" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.ifRead==1" style="color:#409eff;">可以浏览</span>
                    <span v-else>不可浏览</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ifWrite" label="目录上传权限" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.ifWrite==1" style="color:#409eff;">可以上传</span>
                    <span v-else>不可上传</span>
                    <i class="el-icon-s-tools" @click="handleSetDirAuthClick('ifWrite',scope.row)" style="margin-left:5px;cursor:pointer;" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==1"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="ifAdmin" label="目录编辑权限" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.ifAdmin==1" style="color:#409eff;">可以编辑</span>
                    <span v-else>不可编辑</span>
                    <i class="el-icon-s-tools" @click="handleSetDirAuthClick('ifAdmin',scope.row)" style="margin-left:5px;cursor:pointer;" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==1"></i>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==1">
                  <template slot-scope="scope">
                    <el-button @click="handleRemoveClick(scope.row)" type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span="24" v-if="activeGroup==1 && projectMemberView==2" style="height: 500px;overflow-y:auto;padding-top:15px;">
                <template v-for="(value,key) in overviewDataMap">
                  <div :key="key" class="defect-province-div">
                    {{key}}（{{value.length}}个）：{{value.length>0?value.join('、'):''}}
                  </div>
                </template>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="按参测对象配置" name="2">
              <el-table stripe :data="testObjectTableData" border height="600" v-if="activeGroup==2">
                <el-table-column prop="organizeName" label="机构名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column prop="organizeType" label="机构类型" header-align="left" align="left" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.organizeType==6">业务平台</span>
                    <span v-else> {{ $getDictLabel('organizeType', scope.row.organizeType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ifRead" label="目录浏览权限" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.ifRead==1" style="color:#409eff;">可以浏览</span>
                    <span v-else>不可浏览</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ifWrite" label="目录上传权限" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.ifWrite==1" style="color:#409eff;">可以上传</span>
                    <span v-else>不可上传</span>
                    <i class="el-icon-s-tools" @click="handleSetDirAuthClick('ifWrite',scope.row)" style="margin-left:5px;cursor:pointer;" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==1"></i>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" v-if="projectData && projectData.dirLevel>0 && projectData.ifAdmin==1">
                  <template slot-scope="scope">
                    <el-button @click="handleRemoveTestObjectClick(scope.row)" type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <!--设置目录权限-->
          <set-dir-auth :visible.sync="setDirAuth" ref="setDirAuth" @watchChildMethod="triggerParentMethod"></set-dir-auth>
          <!--添加成员和参测机构-->
          <add-member-and-organize :visible.sync="addMemberAndOrganize" ref="addMemberAndOrganize" @watchChildMethod="triggerParentMethod"></add-member-and-organize>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import SetDirAuth from './choose-dialog/set-dir-auth'
import AddMemberAndOrganize from './choose-dialog/add-member-and-organize'
export default {
  name: 'DocumentDirList',
  components: {
    SetDirAuth, AddMemberAndOrganize
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      searchname: '',
      activeGroup: '1',
      addMember: false, // 添加成员
      projectMemberView: '1', // 项目成员视图切换
      addOrganize: false, // 添加机构
      overviewDataMap: {},
      projectTableData: [], // 项目组成员
      testObjectTableData: [], // 参测对象成员
      setDirAuth: false, // 权限设置
      addMemberAndOrganize: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getMemberTableData()
      }
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
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
    // 获取项目成员数据
    getMemberTableData () {
      if (this.projectData && this.projectData.dirId) {
        this.$ctcLoading.open()
        let params = { 'dirId': this.projectData.dirId, 'userName': this.searchname, 'realName': this.searchname }
        let url = '/ctc/project/docDirManage/listMemberAuth'
        if (this.activeGroup === '2') {
          url = '/ctc/project/docDirManage/listParticipantAuth'
          params.organizeName = this.searchname
          delete params['userName']
        }
        this.$http.get(url, { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('查询数据失败：' + res.msg)
          } else {
            let data = res.data
            if (this.activeGroup === '1') {
              this.projectTableData = data
            } else {
              this.testObjectTableData = data
            }
            this.$nextTick(() => {
              this.$ctcLoading.close()
            })
          }
        }).catch(() => {
          this.$ctcLoading.close()
        })
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
    projectMemberViewChange (item) {
      // 概览视图
      if (item === '2') {
        let overviewDataMap = { '可浏览人员': [], '可上传文档人员': [], '可编辑目录人员': [] }
        let overviewData = Object.assign([], this.projectTableData)
        overviewData.forEach((item, index) => {
          if (item.ifRead === 1) {
            overviewDataMap['可浏览人员'].push(item.realName)
          }
          if (item.ifWrite === 1) {
            overviewDataMap['可上传文档人员'].push(item.realName)
          }
          if (item.ifAdmin === 1) {
            overviewDataMap['可编辑目录人员'].push(item.realName)
          }
        })
        this.overviewDataMap = overviewDataMap
      }
    },
    handleRemoveClick (row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = [row.memberAuthId]
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/docDirManage/deleteMemberAuth', 'reload': true }
        let saveParams = { ...params, 'data': data }
        this.executeMethod(saveParams)
      }).catch(() => {
      })
    },
    handleRemoveTestObjectClick (row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = [row.participantAuthId]
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/docDirManage/deleteParticipantAuth', 'reload': true }
        let saveParams = { ...params, 'data': data }
        this.executeMethod(saveParams)
      }).catch(() => {
      })
    },
    handleSetDirAuthClick (authType, row) {
      this.$refs.setDirAuth.authType = authType
      this.$refs.setDirAuth.projectId = this.projectData.projectId
      this.$refs.setDirAuth.activeGroup = this.activeGroup
      this.$refs.setDirAuth.objectData = row
      this.$refs.setDirAuth.init()
    },
    doAddMemberAndOrganize () {
      this.$refs.addMemberAndOrganize.projectData = this.projectData
      this.$refs.addMemberAndOrganize.activeGroup = this.activeGroup
      if (this.activeGroup === '1') {
        this.$refs.addMemberAndOrganize.userSelectData = this.projectTableData
      } else {
        this.$refs.addMemberAndOrganize.userSelectData = this.testObjectTableData
      }
      this.$refs.addMemberAndOrganize.init()
    },
    handleSwitchGroupClick (tab, event) {
      this.getMemberTableData()
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
<style lang="scss">
.document-dir-List {
  .el-tabls-group {
    .el-tab-pane {
      padding: 10px;
    }
  }
  .defect-province-div {
    padding: 0px 15px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 650;
    line-height: 20px;
    letter-spacing: 2px;
  }
}
</style>
