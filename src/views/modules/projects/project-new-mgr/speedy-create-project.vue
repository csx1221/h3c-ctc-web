<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="24" style="text-align:right;">
          <el-button type="warning" size="medium" @click="doSaveSpeedyCreateProject()">保存</el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">基本信息（说明：联调平台项目建议选择三级架构[项目/子项目/任务]）</span></el-divider>
      <el-row>
        <el-col :span="8" style="padding-left:35px;">
          <el-radio v-model="dataForm.type" label="0" border>{{ $getDictLabel('project.framework','0') }}</el-radio>
          <el-radio v-model="dataForm.type" label="1" border>{{ $getDictLabel('project.framework','1') }}</el-radio>
          <span style="color:#4190f7;padding-left:24px;"></span>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="name" label="项目名称：">
            <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dataForm.type==1">
        <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">子项目信息</span></el-divider>
        <el-col :span="24" style="padding-left:35px;max-height:400px;overflow-y:auto;">
          <el-col :span="7" v-for="(item,index) in childrenProjectNames" :key="index" style="margin-bottom:20px;margin-right:10px;">
            <el-form-item :prop="item.projectId" label="">
              <el-input v-model="dataForm[item.projectId]" clearable placeholder="请输入子项目名称">
                <template slot="append"><span style="cursor:pointer;" @click="removeChildrenProject(item)">X</span></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-button type="primary" icon="el-icon-plus" circle @click="addChildrenProject()"></el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">添加成员（说明：有子项目时，所添加的成员自动同步到子项目里）</span></el-divider>
      <el-row>
        <el-col :span="24" style="text-align:right;">
          <el-button type="blue" size="small" @click="doAddProjectMember(1,'addMember')">添加成员</el-button>
          <el-button type="blue" size="small" @click="doAddProjectMember(2,'addRefMemberGroup')">引用成员</el-button>
        </el-col>
        <el-col :span="24" style="padding-left:35px;margin-top:10px;">
          <el-table stripe :data="projectMemberTableData" border height="450">
            <el-table-column prop="userName" label="成员名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realName" label="成员姓名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleRemoveMemberClick(scope.row)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <add-member :visible.sync="addMember" ref="addMember" @watchChildMethod="triggerParentMethod"></add-member>
    <add-ref-member-group :visible.sync="addRefMemberGroup" ref="addRefMemberGroup" @watchChildMethod="triggerParentMethod"></add-ref-member-group>
  </el-card>
</template>
<script>
import { getUUID } from '@/utils'
import ctcUtils from '@/utils/ctc-utils.js'
import AddMember from './create-project-step/choose-dialog/add-member'
import AddRefMemberGroup from './create-project-step/choose-dialog/add-ref-member-group'
import { addDynamicRoute, removeCurrentTabsHandle } from '@/router'
export default {
  name: 'SpeedyCreateProject',
  components: {
    AddMember, AddRefMemberGroup
  },
  data () {
    return {
      dataForm: {
        type: '1',
        name: '',
        managerId: '-1',
        organizeId: '-1',
        organizeType: '0',
        deptId: '-1',
        scope: '0',
        subProjectType: '',
        planStartTime: ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 0),
        planEndTime: ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 730)
      },
      dataRule: {
        name: [
          { required: true, message: '项目名称不允许为空', trigger: 'blur' },
          { required: true, message: '项目名称不允许为空', trigger: 'change' }
        ]
      },
      childrenProjectNames: [],
      projectMemberTableData: [],
      addMember: false,
      addRefMemberGroup: false
    }
  },
  mounted () {
    // 特殊处理自动填充机构信息
    let userInfo = this.$store.state.user
    // 02:平台项目经理;03:总部项目经理;08:专业公司项目经理;09:省项目项目经理
    if (['02', '03', '08', '09'].includes(userInfo.roleType)) {
      this.dataForm.organizeId = userInfo.organizeId
      this.dataForm.managerId = userInfo.id
    }
  },
  methods: {
    triggerParentMethod (message) {
      let thisvm = this
      if (message.type === 'execute') {
        // 过滤重复数据
        message.data.forEach((item, index) => {
          let filterMember = thisvm.projectMemberTableData.filter(function (titem) {
            return item.userId === titem.userId
          })
          if (filterMember.length === 0) {
            thisvm.projectMemberTableData.push(item)
          }
        })
      }
    },
    removeChildrenProject (item) {
      let thisvm = this
      thisvm.childrenProjectNames = thisvm.childrenProjectNames.filter(function (titem) {
        return item.projectId !== titem.projectId
      })
    },
    addChildrenProject () {
      let thisvm = this
      let formKey = getUUID()
      thisvm.childrenProjectNames.push({ 'projectId': formKey, 'projectName': '' })
      let formRules = [
        { required: true, message: '子项目名称不允许为空', trigger: 'blur' },
        { required: true, message: '子项目名称不允许为空', trigger: 'change' }
      ]
      this.$set(this.dataForm, formKey, '')
      this.$set(this.dataRule, formKey, formRules)
    },
    doAddProjectMember (type, refsType) {
      this.$refs[refsType].projectId = '-1'
      this.$refs[refsType].init()
    },
    handleRemoveMemberClick (item) {
      let thisvm = this
      thisvm.projectMemberTableData = thisvm.projectMemberTableData.filter(function (titem) {
        return item.userId !== titem.userId
      })
    },
    doSaveSpeedyCreateProject () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let message = ['参测对象']
          if (thisvm.dataForm.type === '1' && thisvm.childrenProjectNames.length === 0) {
            message.push('子项目')
          }
          if (thisvm.projectMemberTableData.length === 0) {
            message.push('项目成员')
          }
          thisvm.$confirm('[' + message.join('、') + ']等信息未填写，请确认是否提交', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = { ...thisvm.dataForm }
            params.projectMembers = thisvm.projectMemberTableData
            let childrenProjectNames = []
            thisvm.childrenProjectNames.forEach((item, index) => {
              let projectName = thisvm.dataForm[item.projectId]
              childrenProjectNames.push(projectName)
            })
            params.childrenProjectNames = childrenProjectNames
            thisvm.$http.post('/ctc/project/projectBase/speedyCreateProject', params).then(({ data: res }) => {
              if (res.code !== 0) {
                thisvm.$message.error('保存失败：' + res.msg)
              } else {
                thisvm.$message.success('保存成功')
                thisvm.$handTriggerReLoadEvent('projectReload')
                removeCurrentTabsHandle(thisvm)
              }
            }).catch(() => { })
          })
        }
      }, 2000, { 'leading': true, 'trailing': false })
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
<style lang="scss" scoped>
</style>
