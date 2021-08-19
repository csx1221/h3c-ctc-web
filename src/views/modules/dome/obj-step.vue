<template>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-input v-model="company"><i class="el-icon-search el-input__icon" slot="suffix"></i></el-input>
          <!-- <el-button type="text" size="small">全选</el-button> -->
          <!-- <el-button type="text" size="small">全清</el-button> -->
          <el-button type="text" size="small"></el-button>
          <div>
              <el-radio-group v-model="radio">
                <el-radio-button label="省公司"></el-radio-button>
                <el-radio-button label="专业公司"></el-radio-button>
              </el-radio-group>
          </div>
          <el-table :data="companyListLeft">
            <el-table-column prop="name" label="公司名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="addCompany(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
        :page-sizes="[10, 20, 50, 100]">
        </el-pagination>
      </el-col>
      <el-col :span="1">
        <span style='height: 100px;display: inline-block;'></span>
        <el-divider direction="vertical"></el-divider>
        <span style='height: 100px;display: inline-block;'></span>
      </el-col>
      <el-col :span="17">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="机构名称:">
            <el-input v-model="selected" style="width=50%"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
           <el-row>
             <el-col :span="16">
                机构类型:
              <el-radio-group v-model="radioselected" aria-label="机构类型">
                <el-radio-button label="所有类型"></el-radio-button>
                <el-radio-button label="省公司"></el-radio-button>
                <el-radio-button label="专业公司"></el-radio-button>
              </el-radio-group>
             </el-col>
             <el-col :span="8">
               <el-button type="primary">查询</el-button>
               <el-button @click="resetValue">重置</el-button>
             </el-col>
           </el-row>
        </div>
        <el-table :data="companyList">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="participantOrgName" label="公司名称"></el-table-column>
          <el-table-column prop="type" label="机构类型"></el-table-column>
          <el-table-column prop="userName" label="对应账号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="deleteRow(scope.$index, companyList)">移除</el-button>
              <el-button type="text" @click="specifyAccount(scope.$index, scope.row)">指定账号</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        :page-sizes="[10, 20, 50, 100]">
        </el-pagination>
      </el-col>
      <el-dialog width="30%" title="指定账号" :visible.sync="roleDialog" append-to-body>
      <div style="text-align: center;">
        <el-select v-model="roleChoose" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.username" :value="item.id">
          </el-option>
        </el-select>
        <div style='margin: 30px auto;'>
          <el-button type="primary" @click="generate(roleList)">确定</el-button>
        </div>
      </div>
    </el-dialog>
      <el-col  style='margin: 20px auto;text-align: center;'>
        <el-button v-if="!modify" type="primary" @click="twoPrevious()">上一步</el-button>
        <el-button v-if="modify" type="primary" @click="addOrUpdateHandle()">保存提交</el-button>
        <el-button v-if="!modify" type="primary" @click="tofive()">下一步</el-button>
      </el-col>
    </el-row>
</template>

<script>
export default {
  props: {
    modify: {
      type: Boolean
    },
    dataForm: {
      type: String
    }
  },
  data () {
    return {
      company: '',
      selected: '',
      visible: false,
      roleChoose: '', // 指定账号
      roleList: [],
      roleDialog: false,
      vulue: 1,
      radio: '省公司',
      companyPopa: '',
      radioselected: '所有类型',
      companyList: [
      ],
      companyListLeft: [
      ]
    }
  },
  mounted () {
    this.requestParameterObj('3')
  },
  watch: {
    radio: function (oldval, newval) {
      if (newval === '专业公司') {
        this.requestParameterObj('3')
      } else if (newval === '省公司') {
        this.requestParameterObj('4')
      }
    },
    // 缺少请求专业公司
    radioselected: function (oldval, newval) {
      this.requestRight()
      if (newval === '专业公司') {
        console.log(3)
      } else if (newval === '省公司') {
        console.log(2)
      } else if (newval === '所有类型') {
        console.log(4)
      }
    }
  },
  methods: {
    architecture (data) {
      this.vulue = data
      this.$emit('funcarchitecture', this.vulue)
    },
    addCompany (index, row) {
      const parameterObj = {
        participantOrgId: row.id,
        projectId: this.dataForm.projectId,
        projectUuid: this.dataForm.projectUuid
      }
      this.$http.post('/ctc/project/base/projectparticipant', { ...parameterObj }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.requestRight()
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => {})
    },
    specifyAccount (index, row) {
      this.companyPopa = row.participantUuid
      this.roleChoose = row.userName
      this.$http.get(`/sys/dept/users?deptId=${row.participantOrgId}`).then(({ data: res }) => {
        this.roleDialog = true
        this.roleList = [
          ...res.data
        ]
      }).catch(() => {})
    },
    // 选择指定账号
    generate (rule) {
      const specify = {
        uuid: this.companyPopa,
        userId: this.roleChoose
      }
      this.$http.put(`/ctc/project/base/projectparticipant?uuid=${specify.uuid}&userId=${specify.userId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.roleDialog = false
        this.requestRight()
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => {})
    },
    // 删除项目
    deleteRow (index, rows) {
      this.$http.delete(`/ctc/project/base/projectparticipant?participantUuid=${rows[index].participantUuid}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.requestRight()
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            // this.query()  删除成功回调
          }
        })
      }).catch(() => {})
    },
    // 请求左侧参测对象列表  3省公司  4专业公司
    requestParameterObj (num) {
      // this.requestRight()
      this.$http.get(`/sys/dept/depts?types=${num}`).then(({ data: res }) => {
        this.companyListLeft = res
      }).catch(() => {})
      // /sys/dept/list?order=&sidx=1
    },
    // 请求右侧参测对象
    requestRight () {
      this.$http.get(`/ctc/project/base/projectparticipants?projectUuid=${this.dataForm.projectUuid}&page=1&limit=10&limit=10&sidx=participant_id&order=desc`).then(({ data: res }) => {
        this.companyList = res.data
      }).catch(() => {})
    },
    tofive () {
      this.$emit('giveType', this.companyList)
    },
    twoPrevious () {
      this.$emit('toPre', this.dataForm)
    },
    resetValue () {
      this.selected = ''
    },
    addOrUpdateHandle () {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  }
}
</script>

<style>
.el-divider {
  height: 400px;
}
</style>
