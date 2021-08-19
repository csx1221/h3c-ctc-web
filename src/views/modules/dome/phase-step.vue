<template>
  <el-row>
    <el-button type="primary" @click="searchList()">添加阶段</el-button>
    <el-table :data="companyList">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="阶段名称"></el-table-column>
          <el-table-column prop="stageName" label="基础阶段"></el-table-column>
          <el-table-column prop="toTime" label="开始日期"></el-table-column>
          <el-table-column prop="outTime" label="结束日期"></el-table-column>
          <el-table-column prop="orderNum" label="时序"></el-table-column>
          <el-table-column prop="stageStatusName" label="状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletePhase(scope.$index, companyList)">删除</el-button>
              <el-button type="text" @click="searchList(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style='margin: 20px;text-align: center;'>
          <el-button v-if="!modify" type="primary" @click="twoPrevious()">上一步</el-button>
          <el-button v-if="modify" type="primary" @click="addOrUpdateHandle()">保存提交</el-button>
          <el-button v-if="!modify" type="primary" @click="upLoad()">下一步</el-button>
        </el-row>
        <el-dialog width="30%" :title="projectTitle" :visible.sync="innerVisibleGenerate" append-to-body>
          <div style="text-align: center;">
            <el-form label-position="right" label-width="100px" :data="addphase">
                <el-form-item label="阶段名称:">
                  <el-input v-model="addphase.name" placeholder="请输入阶段名称"></el-input>
                </el-form-item>
              <el-form-item label="基础阶段:">
                <el-select style='width: 100%;' v-model="listAdd" value-key="stageId" @change="selectChange" placeholder="请选择基础阶段">
                  <el-option v-for="item in addhelise" :key="item.stageId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style='width: 100%;' label="开始日期:">
                <el-date-picker style='width: 100%;' format="yyyy-MM-dd" :picker-options="updateTime" value-format="yyyy-MM-dd h:mm:ss" v-model="addphase.planStartTime" type="date" placeholder="请选择开始日期" >
                </el-date-picker>
              </el-form-item>
              <el-form-item style='width: 100%;' label="结束日期:">
                <el-date-picker style='width: 100%;' format="yyyy-MM-dd" :picker-options="actStartTime" value-format="yyyy-MM-dd h:mm:ss" v-model="addphase.planEndTime" type="date" placeholder="请选择结束日期" >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-button type="primary" style='margin: 30px auto;' @click="generate()">确定</el-button>
          </div>
        </el-dialog>
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
      visible: false,
      value: 1,
      innerVisibleGenerate: false,
      addhelise: [],
      listAdd: {},
      projectTitle: '',
      addphase: {
        name: '',
        stageUuid: '',
        planStartTime: '',
        planEndTime: '',
        stageId: null
      },
      updateTime: { // 开始日期小于结束日期
        disabledDate: time => {
          let endDateVal = this.addphase.planEndTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      actStartTime: { // 结束日期
        disabledDate: time => {
          let beginDateVal = this.addphase.planStartTime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      companyList: []
    }
  },
  mounted () {
    // 缺少放置请求列表数据
    this.initialList()
  },
  methods: {
    // 修改/新增
    searchList (index, row) {
      this.projectTitle = '新增阶段'
      this.requestPhaseList()
      this.addphase = {
        name: '',
        stageUuid: '',
        planStartTime: '',
        planEndTime: '',
        stageId: null
      }
      // 选择阶段bug
      if (row) {
        this.projectTitle = '修改阶段'
        this.addphase = row
      }
      this.innerVisibleGenerate = true
    },
    selectChange (res) {
      console.log(this.listAdd)
    },
    // 修改 新增
    generate () {
      const postList = {
        ...this.addphase,
        projectUuid: this.dataForm.projectUuid,
        projectId: this.dataForm.projectId,
        stageId: Number(this.listAdd.stageId),
        stageUuid: this.listAdd.stageUuid
      }
      this.$http[!this.addphase.projectStageUuid ? 'post' : 'put']('/ctc/project/stage/project/stage', postList).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.initialList()
        this.innerVisibleGenerate = false
        this.addphase = {
          name: '',
          stageUuid: '',
          planStartTime: '',
          planEndTime: '',
          stageId: null
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => {})
    },
    deletePhase (index, row) {
      this.$http.delete(`/ctc/project/stage/project/stage/${row[index].projectStageUuid}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.initialList()
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
    addOrUpdateHandle () {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    upLoad () {
      this.$emit('givePhase', this.companyList)
    },
    // 请求阶段列表
    requestPhaseList () {
      this.$http.get(`/ctc/project/stage/infos`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.addhelise = res.data
      }).catch(() => {})
    },
    // 请求初始列表
    initialList () {
      this.$http.get(`/ctc/project/stage/project/stages?projectUuid=${this.dataForm.projectUuid}`).then(({ data: res }) => {
        this.companyList = res.data
        for (let index = 0; index < this.companyList.length; index++) {
          this.companyList[index].toTime = this.companyList[index].planStartTime.split(' ')[0]
          this.companyList[index].outTime = this.companyList[index].planEndTime.split(' ')[0]
        }
      }).catch(() => {})
    },
    twoPrevious () {
      this.$emit('toPre', this.dataForm)
    }
  }
}
</script>
