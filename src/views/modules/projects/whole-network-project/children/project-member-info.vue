<template>
  <el-row class="setmember-setp-page">
    <el-row style="margin-bottom:10px;">
      <el-col :span="10">
        <el-input placeholder="请输入成员名称" v-model="searchname" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getMemberTableData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="14" style="padding-top:10px;padding-left:5px;">
        <span style="color:#4190f7;">说明：项目组成员可参与项目的各个阶段，参测对象成员只能参与项目的用例执行阶段</span>
      </el-col>
    </el-row>
    <el-col :span="24" class="el-tabls-group">
      <el-tabs v-model="activeGroup" type="border-card" @tab-click="handleSwitchGroupClick">
        <el-tab-pane label="项目组成员" name="1">
          <el-radio-group v-model="projectMemberView" size="small" style="margin-bottom:5px;" @change="projectMemberViewChange">
            <el-radio-button label="1">列表视图</el-radio-button>
            <el-radio-button label="2">概览视图</el-radio-button>
          </el-radio-group>
          <el-table stripe :data="projectTableData" border height="600" v-if="activeGroup==1 && projectMemberView==1">
            <el-table-column prop="userName" label="成员名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realName" label="成员姓名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="projectRoleName" label="成员角色" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="所属部门" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="手机号码" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="email" label="Email" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-col :span="24" v-if="activeGroup==1 && projectMemberView==2" style="height: 500px;overflow-y:auto;padding-top:15px;">
            <template v-for="(value,key) in overviewDataMap">
              <div :key="key" class="defect-province-div">
                {{key}}（{{value.length}}个）：{{value.length>0?value.join('、'):''}}
              </div>
            </template>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="参测对象成员" name="2" v-if="scope!=1">
          <el-table stripe :data="testObjectTableData" border height="600" v-if="activeGroup==2">
            <el-table-column prop="organizeName" label="机构名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="organizeType" label="机构类型" header-align="left" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.organizeType==6">业务平台</span>
                <span v-else> {{ $getDictLabel('organizeType', scope.row.organizeType) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="participantInterfaceUsers" label="接口人" header-align="left" align="left" show-overflow-tooltip width="600">
              <template slot-scope="scope">
                <span v-html="getParticipantInterfaceUsers(scope.row.participantInterfaceUsers)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="projectParticipantMembers" label="机构成员" header-align="left" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getProjectParticipantMembers(scope.row.projectParticipantMembers)"></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'ProjectMemberInfo',
  components: {
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      projectId: '',
      scope: '1',
      searchname: '',
      activeGroup: '1',
      projectMemberView: '1', // 项目成员视图切换
      overviewDataMap: {},
      projectTableData: [], // 项目组成员
      testObjectTableData: [], // 参测对象成员
      matchCacheData: {
        memeberDataMap: {},
        testObjectDataMap: {}
      }
    }
  },
  computed: {},
  mounted () {
    this.projectId = this.$route.params.projectId || ''
    this.scope = this.$route.params.scope || ''
    this.getMemberTableData()
  },
  methods: {
    projectMemberViewChange (item) {
      // 概览视图
      if (item === '2') {
        let overviewDataMap = {}
        let overviewData = Object.assign([], this.projectTableData)
        overviewData.forEach((item, index) => {
          let key = item.projectRoleName || '其他'
          if (!overviewDataMap.hasOwnProperty(key)) {
            overviewDataMap[key] = []
          }
          overviewDataMap[key].push(item.realName)
        })
        this.overviewDataMap = overviewDataMap
      }
    },
    // 获取项目成员数据
    getMemberTableData () {
      this.$ctcLoading.open()
      let params = { 'projectId': this.projectId, 'userName': this.searchname, 'realName': this.searchname }
      let url = '/ctc/project/projectMember/list'
      if (this.activeGroup === '2') {
        url = '/ctc/project/projectParticipant/list'
        params.organizeName = this.searchname
        delete params['userName']
      }
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          let dataMap = {}
          let data = res.data
          if (this.activeGroup === '1') {
            data.forEach((item, index) => {
              dataMap[item.userId] = item
            })
            this.projectTableData = data
            this.matchCacheData.memeberDataMap = dataMap
          } else {
            data.forEach((item, index) => {
              dataMap[item.organizeId] = item
            })
            this.testObjectTableData = data
            this.matchCacheData.testObjectDataMap = dataMap
          }
        }
        this.$nextTick(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getParticipantInterfaceUsers (participantInterfaceUsers) {
      let dataHtml = []
      participantInterfaceUsers = participantInterfaceUsers || []
      participantInterfaceUsers.forEach((item, index) => {
        let data = item.interfaceUserName + '（手机：' + (item.interfaceUserMobile || '--') + '，邮箱：' + (item.interfaceUserEmail || '--') + '）'
        dataHtml.push(data)
      })
      return dataHtml.join('<br/>')
    },
    getProjectParticipantMembers (projectParticipantMembers) {
      let dataHtml = []
      projectParticipantMembers = projectParticipantMembers || []
      projectParticipantMembers.forEach((item, index) => {
        dataHtml.push(item.participantUserName)
      })
      return dataHtml.join('，')
    },
    handleSwitchGroupClick (tab, event) {
      this.getMemberTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
.setmember-setp-page {
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
