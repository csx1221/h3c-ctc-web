<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-autocomplete v-model="name" placeholder="姓名查询" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPop()">添加成员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="referenceGroup()">引用成员组</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="disabled" type="primary" @click="getDataList()">生成成员组</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="poptable" :data="dataList" border @selection-change="selection" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userId" label="角色" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-show="scope.$index === 0">项目经理</span>
            <span v-show="scope.$index !== 0">{{scope.row.manager ? scope.row.manager : '测试成员'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptId" label="机构" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- <span v-show="scope.$index !== 0">{{scope.row.deptName}}</span> -->
            <span>河北省公司</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button :disabled="scope.$index === 0" type="text" size="small" @click.native.prevent="deletPop(scope.$index, dataList)">移除</el-button>
            <el-button :disabled="scope.$index === 0" type="text" size="small" @click="deleteHandle(scope.row, scope.$index)">设置角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-sizes="[10, 20, 50, 100]">
      </el-pagination>
    </div>
    <el-dialog width="60%" title="添加成员" :visible.sync="innerVisible" append-to-body>
      <el-row style="">
        <select-control :dataTree='groupArr' ref="poplist"></select-control>
      </el-row>
      <el-row style='margin: 30px auto;text-align: center;'>
        <el-button type="primary" @click="givePopId()">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog width="60%" title="引用成员组" :visible.sync="innerVisibleGroup" append-to-body>
      <select-control addgroup=ture ref="poplist"></select-control>
      <el-row style="text-align: center;margin-top: 30px;">
        <el-button @click="popReset()">重置</el-button>
        <el-button type="primary" @click="givePopId()">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog width="30%" title="生成成员组" :visible.sync="innerVisibleGenerate" append-to-body>
      <div style="text-align: center;">
        <el-input v-model="groupName" placeholder="请输入成员组名称"></el-input>
        <el-button type="primary" style='margin: 30px auto;' @click="generate()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="选择角色" :visible.sync="roleDialog" append-to-body>
      <div style="text-align: center;">
        <el-select v-model="roleChoose" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.groupRoleId" :label="item.roleName" :value="item.roleName">
          </el-option>
        </el-select>
        <div style='margin: 30px auto;'>
          <el-button type="primary" @click="generate()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-row style='margin: 20px;text-align: center;'>
      <el-button v-if="!modify" type="primary" @click="twoPrevious()">上一步</el-button>
      <el-button v-if="modify" type="primary" @click="addOrUpdateHandle()">保存提交</el-button>
      <el-button v-if="!modify" type="primary" @click="submitForm">下一步</el-button>
    </el-row>
  </el-card>
  <!-- 选人控件添加处 -->
</template>

<script>
export default {
  props: {
    modify: {
      type: Boolean
    },
    dataFormGiv: {
      type: Object
    }
  },
  data () {
    return {
      name: '',
      innerVisible: false, // 内嵌dialog
      innerVisibleGroup: false, // 设置成员组
      innerVisibleGenerate: false, // 生成成员组
      roleDialog: false, // 设置角色
      restaurants: [], // 请求人员模糊搜索
      groupName: '',
      disabled: true, // 生成成员组
      dataForm: {
        name: ''
      },
      dataList: [],
      roleList: [],
      groupArr: [],
      indexRole: null,
      roleChoose: null
    }
  },
  methods: {
    // 模糊查询
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 添加人员先请求,再跳转
    addPop () {
      // id: "1245906867817820162"pid: "1245909684527837186"
      this.$http.get(`sys/dept/depts/pid?deptId=${this.dataFormGiv.organizationId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        const copeData = JSON.parse(JSON.stringify(res.data))
        copeData[0].username = copeData[0].name
        for (let index = 0; index < copeData[0].children.length; index++) {
          copeData[0].children[index].username = copeData[0].children[index].name
          if (copeData[0].children[index].children.length > 0) {
            for (let t = 0; t < copeData[0].children[index].children.length; t++) {
              copeData[0].children[index].children[t].username = copeData[0].children[index].children[t].name
            }
          }
        }
        this.groupArr = [
          ...copeData
        ]
        this.innerVisible = true
      }).catch(() => { })
    },
    // 清空状态值,防止弹窗bug
    pupopWindow () {
      this.innerVisible = false
      this.innerVisibleGroup = false
      this.innerVisibleGenerate = false
      this.roleDialog = false
    },
    givePopId () {
      this.dataList.push(...this.$refs.poplist.poptree)
      this.pupopWindow()
    },
    // 角色确定
    generate (data) {
      // 及时渲染页面
      this.$set(this.dataList[this.indexRole], 'manager', this.roleChoose)
      this.pupopWindow()
    },
    // 生成成员组确定
    generates () {
      this.pupopWindow()
    },
    deletPop (index, rows) {
      rows.splice(index, 1)
    },
    referenceGroup () {
      // this.innerVisibleGroup = true
      this.$http.get(`/ctc/project/base/testgroups`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
      }).catch(() => { })
    },
    // 生成成员组
    getDataList () {
      // 勾选成员组成员
      this.innerVisibleGenerate = true
    },
    selection (row) {
      if (row.length === 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    popReset () {
      this.$refs.poplist.poptree = []
    },
    // 设置成员角色
    deleteHandle (data, index) {
      this.roleDialog = true
      // projectUuid缺少
      this.$http.get(`/ctc/project/projectgroup/roles?projectUuid=`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.indexRole = index
        this.roleList = [
          ...res.data
        ]
      }).catch(() => { })
    },
    // 请求项目经理
    requestPopGroup () {
      // 请求成员分页信息
      this.$http.get(`/ctc/project/projectgroup/page?projectUuid=${this.dataFormGiv.id}&page=1&limit=10&username=${this.name}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataList = [
          ...this.dataList,
          ...res.page.list
        ]
      }).catch(() => { })
    },
    handleSelect (item) {
      console.log(item)
    },
    // 获取默认项目经理
    pushMarger () {
      this.$http.get(`/sys/user/getById?id=${this.dataFormGiv.managerId}`).then(({ data: res }) => {
        if (this.dataList.length === 0) {
          this.dataList.push(res.data)
          this.dataList[0].manager = 1
        } else {
          this.dataList = [{
            ...res.data
          }]
        }
      }).catch(() => { })
    },
    // 获取项目经理归属机构
    hasInstitu () {
      this.$http.get(`/sys/user/page?username=${this.dataList[0].username}`).then(({ data: res }) => {
        this.dataList[0].deptName = res.data.list[0].deptName
      }).catch(() => { })
    },
    submitForm () {
      var dataFormdist = []
      dataFormdist = JSON.parse(JSON.stringify(this.dataList))
      for (let index = 0; index < this.dataList.length; index++) {
        if (index === 0) {
          dataFormdist[0].userId = this.dataList[index].id
          dataFormdist[0].manager = 1
        } else {
          dataFormdist[index].manager = 0
          dataFormdist[index].userId = this.dataList[index].id
        }
        dataFormdist[index].name = this.dataFormGiv.name
        dataFormdist[index].projectUuid = this.dataFormGiv.projectUuid
        dataFormdist[index].projectId = this.dataFormGiv.projectId
        if (dataFormdist[index].manager === 1) {
          dataFormdist[index].groupRoleId = 1
        } else if (dataFormdist[index].manager === '测试成员') {
          dataFormdist[index].manager = 0
          dataFormdist[index].groupRoleId = 2
        } else if (dataFormdist[index].manager === '测试组QA') {
          dataFormdist[index].manager = 0
        } else if (dataFormdist[index].manager === '质量分析员') {
          dataFormdist[index].manager = 0
          dataFormdist[index].groupRoleId = 4
        } else if (dataFormdist[index].manager === 0) {
          dataFormdist[index].groupRoleId = 2
        }
      }
      this.$http.post('/ctc/project/projectgroup/projectgroups', dataFormdist).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$emit('givePop', this.dataList)
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => { })
    },
    twoPrevious () {
      this.$emit('toPre', this.dataList)
    },
    addOrUpdateHandle () {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  },
  mounted () {
    this.restaurants = this.dataList
    this.requestPopGroup()
  },
  activated () {
    this.pushMarger()
    this.hasInstitu()
  }
}
</script>
