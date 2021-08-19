<template>
  <div>
    <div class="el-input el-input-group el-input-group--append">
      <div class="el-input__inner dib" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList">
          <el-tag v-if="item.disable" class="eltag" :key="index" type="info">{{item.demandName}}</el-tag>
          <el-tag v-else class="eltag" :key="index" closable @close="handleClose(item)">{{item.demandName}}</el-tag>
        </template>
      </div>
      <el-input v-else :placeholder="placeholder"></el-input>
      <div class="el-input-group__append">
        <el-button slot="append" @click="userDialog">从需求仓库</el-button>
        <el-button slot="append" @click="uploadDialog">从本地关联</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="visibleUser" width="55%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="20">
          需求编码
          <el-input v-model="dataForm.demandCode" placeholder="请输入需求编码" style="width:120px;margin-right: 5px" />
          需求名称
          <el-input v-model="dataForm.demandName" placeholder="请输入需求名称" style="width:120px;margin-right: 5px" />
          责任人
          <el-input v-model="dataForm.personLiableName" placeholder="请输入责任人" style="width:120px;margin-right: 5px" />
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" border :data="userList" @selection-change="getChooseUserRow" :row-key="getRowKeys" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="60" :reserve-selection="true" :selectable="selectable"></el-table-column>
        <el-table-column prop="demandCode" label="需求编码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="demandName" label="需求名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="demandSide" label="需求方" header-align="center" align="center"></el-table-column>
        <el-table-column prop="personLiableName" label="责任人" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getUserList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="visibleUpload" width="50%" :modal="false" title="附件上传" :close-on-click-modal="false" :close-on-press-escape="false">
      <ctc-file-upload ref="ctcFileUpload" v-model="uploadId"></ctc-file-upload>
      <template slot="footer">
        <el-button type="default" @click="visibleUpload=false" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandleUpload()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcAssociatedRequirementsTable',
  data () {
    return {
      visibleUser: false,
      visibleUpload: false,
      uploadId: '',
      userList: [],
      showUserName: '',
      nameList: [],
      dataForm: {
        demandCode: '', // 需求编号
        demandName: '', // 需求名称
        personLiableName: '' // 责任人
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectData: [],
      userRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0,
      temporaryStorageData: []
    }
  },
  props: {
    value: Array,
    taskId: String,
    deptId: String,
    userId: String,
    placeholder: String,
    taskData: Object
  },
  watch: {
    taskId (newVal, oldVal) {
      console.log(9999)
      this.echoUserData()
    }
  },
  mounted () {
    if (this.taskId) {
      this.echoUserData()
    }
  },
  methods: {
    getRowKeys (row) {
      return row.demandId
    },
    handleClose (tag) {
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      let node = this.nameList
      let list = []
      for (let i = 0; i < node.length; i++) {
        list.push(node[i].demandId)
      }
      this.$emit('input', list)
    },
    selectable (row, index) {
      if (this.taskData.baseInfo.taskStatus === 1) {
        for (let i = 0; i < this.temporaryStorageData.length; i++) {
          if (this.temporaryStorageData[i] === row.demandId) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    userDialog () {
      this.visibleUser = true
      this.searchName = ''
      this.page = 1
      this.getUserList()
      this.$nextTick(() => {
        this.$refs.tableObject.clearSelection()
        if (this.nameList.length !== 0) {
          this.nameList.forEach(rows => {
            this.$refs.tableObject.toggleRowSelection(rows)
          })
        } else {
          this.$refs.tableObject.clearSelection()
        }
      })
    },
    uploadDialog () {
      if (this.taskData.baseInfo.taskStatus === 1) {
        this.$message.warning('任务进行中，不可关联')
      } else {
        this.visibleUpload = true
        this.uploadId = ''
        this.$nextTick(() => {
          this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 100, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
          this.$refs.ctcFileUpload.init()
        })
      }
    },
    getChooseUserRow (val) {
      this.selectData = val
    },
    echoUserData () {
      if (this.taskId !== '') {
        let params = { 'taskId': this.taskId }
        this.$http.get('/ctc/task/relation/show', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            console.log(res)
            let demand = res.data.demand
            this.selectList = demand
            let id = []
            let name = []
            for (let i = 0; i < demand.length; i++) {
              id.push(demand[i].id)
              name.push({ demandId: demand[i].id, demandName: demand[i].name })
            }
            this.$emit('input', id)
            this.nameList = name
            if (this.taskData.baseInfo.taskStatus === 1) {
              this.temporaryStorageData = id
              let newNameList = []
              name.forEach(item => {
                newNameList.push({ disable: true, ...item })
              })
              this.nameList = newNameList
            }
          }
        }).catch(() => { })
      } else {
        this.nameList = []
      }
    },
    doResetGetUserList () {
      this.dataForm.demandCode = ''
      this.dataForm.demandName = ''
      this.dataForm.personLiableName = ''
      this.getUserList()
    },
    getUserList () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      this.userList = []
      this.$http.get('/ctc/plan/demand/page', {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.dataForm
        }
      }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data.data.list
        this.total = res.data.data.total
      }).catch(() => { thisvm.$ctcLoading.close() })
    },
    cancelHandle () {
      this.visibleUser = false
      this.userList = []
    },
    commitHandle () {
      const node = this.selectData
      if (node.length === 0) {
        this.$message.warning(this.placeholder)
        return
      }
      let id = []
      let name = []
      for (let i = 0; i < node.length; i++) {
        id.push(node[i].demandId)
        name.push(node[i])
      }
      this.$emit('input', id)
      this.nameList = name
      if (this.taskData.baseInfo.taskStatus === 1) {
        for (let i = 0; i < name.length; i++) {
          for (let j = 0; j < this.temporaryStorageData.length; j++) {
            if (this.temporaryStorageData[j] === name[i].demandId) {
              name[i].disable = true
            }
          }
        }
        this.nameList = name
      }
      this.visibleUser = false
    },
    commitHandleUpload () {
      let thisvm = this
      if (this.uploadId !== '') {
        // 设置附件id回显
        let params = { 'recordId': thisvm.uploadId }
        this.$http.get('/ctc/oss/mutiFile/listFiles', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            console.log(res)
            thisvm.backDemand(res.data[0].fileName.split('.')[0])
          }
        }).catch(() => {
          this.dataListLoading = false
        })
      } else {
        this.$message.warning('请先上传附件！！！')
      }
    },
    backDemand (name) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { attachementId: this.uploadId, attachementName: name }
      this.$http.post('/ctc/plan/demand/taskSave', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        console.log(res)
        this.$emit('input', [res.data.demandId])
        this.nameList = [{ demandId: res.data.demandId, demandName: res.data.demandName }]
        this.visibleUpload = false
      }).catch(() => { thisvm.$ctcLoading.close() })
    }
  }
}
</script>
