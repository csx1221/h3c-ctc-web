<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%" class="add-require" append-to-body>
<!--        {{dataForm}}-->
<!--        {{dataList}}-->
        <el-card shadow="never" class="aui-card--fill">
            <div class="isTips">
                <span>温馨提示:</span>
                <span>1、作为测试项目的非项目经理角色名下有未处理工单，可直接注销。未处理的工单自动转给工单所在测试项目的项目经理名下；</span>
                <span>2、作为测试项目的项目经理角色，需先变更测试项目的项目经理后方可注销账号。</span>
            </div>
            <el-row style="margin-top: 10px">
                <el-table max-height="450px" ref="tableObject" :data="dataList" style="width: 100%;">
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="loginName" label="4A主账号名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="集测从账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="realName" label="用户姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="projectRoleName" label="项目角色" header-align="center" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.projectRoleName||scope.row.projectRoleName==='null'" style="text-align: center;display: inline-block;width: 100%;">-</span>
                            <span v-else style="text-align: center;display: inline-block;width: 100%;">{{scope.row.projectRoleName}}</span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="newManagerId" label="新项目经理" header-align="center" align="center" show-overflow-tooltip></el-table-column>-->
                    <el-table-column fixed="right" label="新项目经理" header-align="center" align="left" width="260">
                        <template slot-scope="scope">
                          <template v-if="scope.row.manager===1">
                            <ctc-tree-table-gy v-if="!scope.row.parentId" v-model="scope.row.newManagerId" type="radio" title="项目经理"  :pid.sync="scope.row.organizeId" :defaultDataFormProps="{name:'name',pid:'organizeId'}" :baseOption="{getUrl: '/sys/project/select/tree/manager',echoUrl: '/sys/project/select/manager?userId='}" placeholder="请选择项目经理" sign="managerId"></ctc-tree-table-gy>
                            <ctc-select-manage v-if="scope.row.parentId" v-model="scope.row.newManagerId" :pid.sync="scope.row.parentId"></ctc-select-manage>
                          </template>
                          <template>
                            <span v-if="scope.row.manager===0" style="text-align: center;display: inline-block;width: 100%;">-</span>
                          </template>
                        </template>
                    </el-table-column>
                </el-table>
<!--                <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getDataList" style="text-align:left;">-->
<!--                </el-pagination>-->
            </el-row>
        </el-card>
        <template slot="footer">
            <el-button type="default" @click="close" size="mini">取消</el-button>
            <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
        </template>
    </el-dialog>
</template>

<script>
// import qs from 'qs'
export default {
  name: 'settingManage',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      title: '',
      type: '',
      dataForm: '',
      dataList: [],
      page: 1,
      limit: 5,
      total: 0
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (title, type, dataForm) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.type = type
      this.dataForm = dataForm
      let loginNames = []
      for (let i = 0; i < dataForm.subAccountList.length; i++) {
        loginNames.push(dataForm.subAccountList[i].loginName)
      }
      this.getDataList([...new Set(loginNames)])
    },
    close (res) {
      this.dialogVisible = false
      if (res === 'refresh') {
        this.$emit('refresh')
      }
    },
    getDataList (data) {
      let thisvm = this
      // if (page) {
      //   this.page = page
      // }
      thisvm.$ctcLoading.open()
      // let params = { loginNames: data }
      thisvm.$http.post('/account4a/cancel/account/getCtcProjectMember', data).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataList = data
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    commitHandle () {
      let list = this.dataList
      for (let i = 0; i < list.length; i++) {
        if (list[i].manager === 1 && !list[i].newManagerId) {
          return this.$message.warning('项目名称：' + list[i].projectName + ' 未变更项目经理！')
        }
      }
      this.$emit('afterDo', { ...this.dataForm, mangerUpdateList: this.dataList })
    }
  }
}
</script>
<style lang="scss" scoped>
    .add-require {
        .selected {
            margin-top: 10px;
            text-align: right;
        }
    }
    .isTips{
        color: red;
        span{
            display: block;
            line-height: 18px;
        }
    }
</style>
