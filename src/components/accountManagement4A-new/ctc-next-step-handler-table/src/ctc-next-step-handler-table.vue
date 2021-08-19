<template>
    <div>
        <el-input v-model="showOrganizeName" :disabled="disabled" :placeholder="placeholder" readonly>
            <el-button slot="append" icon="el-icon-search" @click="organizeDialog"></el-button>
        </el-input>
        <el-input :value="value" style="display: none"></el-input>
        <el-dialog :visible.sync="visibleOrganize" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row>
                <el-col :span="16">
                    <el-input v-model="searchName" size="mini" placeholder="请输入用户姓名" clearable @keyup.enter.native="getOrganizeList(1)"/>
                </el-col>
                <el-col :span="8" style="text-align:right">
                    <el-button type="primary" size="small" @click="getOrganizeList(1)">查询</el-button>
                </el-col>
            </el-row>
            <el-table ref="tableObject" :data="organizeList" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row.id" v-model="organizeRadio" @change.native="getChooseOrganizeRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <!--                <el-table-column prop="demandCode" label="4A主账号" header-align="center" align="center"></el-table-column>-->
                <el-table-column prop="username" label="集中化从账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="realName" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userRoleNames" label="所属角色" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orgName" label="机构/部门/科室" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getOrganizeList" style="text-align:left;">
            </el-pagination>
            <template slot="footer">
                <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
                <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'CtcNextStepHandlerTable',
  data () {
    return {
      visibleOrganize: false,
      organizeList: [],
      showOrganizeName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      organizeRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    organizeId: String,
    placeholder: String,
    backName: Boolean,
    disabled: Boolean
  },
  watch: {
    organizeId (newVal, oldVal) {
      this.echoOrganizeData()
    }
  },
  methods: {
    organizeDialog () {
      this.visibleOrganize = true
      this.searchName = ''
      // this.getOrganizeList()
    },
    getChooseOrganizeRow (index, row) {
      this.selectRowData = row
    },
    echoOrganizeData () {
      if (this.organizeId !== '' && this.organizeId.indexOf('clear') === -1) {
        this.showOrganizeName = ''
        if (this.$store.state.user.id === 0) {
          this.$http.get('/sys/organize/getOrganizeById?organizeId=' + this.organizeId).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            } else {
              this.showOrganizeName = res.data.name
              if (this.backName) {
                this.$emit('update:organName', res.data.name)
              }
            }
          }).catch(() => { })
        } else {
          this.$http.get(`/sys/project/select/organize?organizeId=${this.organizeId}`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            } else {
              if (res.data.list.length > 0) {
                this.showOrganizeName = res.data.list[0].name
                if (this.backName) {
                  this.$emit('update:organName', res.data.list[0].name)
                }
              }
            }
          }).catch(() => { })
        }
      } else {
        this.showOrganizeName = ''
      }
    },
    getOrganizeList (page) {
      if (page) {
        this.page = page
      }
      if (this.$store.state.user.id === 0) {
        return this.$http.post('/sys/user/page2', {
          realName: this.searchName,
          page: this.page,
          limit: this.limit
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            list[i].orgName = (list[i].organizeName ? list[i].organizeName : '') + (list[i].deptName ? ' / ' + list[i].deptName : '') + (list[i].sectionName ? ' / ' + list[i].sectionName : '')
          }
          this.organizeList = list
          this.total = res.data.totalCount
        }).catch(() => { })
      } else {
        return this.$http.get('/sys/user/page2', {
          params: {
            realName: this.searchName,
            page: this.page,
            limit: this.limit
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            list[i].orgName = (list[i].organizeName ? list[i].organizeName : '') + (list[i].deptName ? ' / ' + list[i].deptName : '') + (list[i].sectionName ? ' / ' + list[i].sectionName : '')
          }
          this.organizeList = list
          this.total = res.data.total
        }).catch(() => { })
      }
    },
    cancelHandle () {
      this.visibleOrganize = false
      this.organizeList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning(this.placeholder)
        return
      }
      console.log(node)
      this.$emit('input', node.id)
      this.$emit('update:organizeName', node.name)
      this.$emit('watchChildPage', { 'type': 'chooseOrganize', 'data': node })
      this.showOrganizeName = node.realName + '（' + node.username + '）'
      this.visibleOrganize = false
      this.organizeList = []
      if (this.backName) {
        this.$emit('update:organName', node.name)
      }
    }
  }
}
</script>
