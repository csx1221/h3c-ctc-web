<template>
  <el-dialog width='60%' :visible.sync="visible" :title="titleName()" :close-on-click-modal="false" :close-on-press-escape="false">
  <el-steps v-if="!modify" style='margin-bottom: 40px;' :active="active" finish-status="success">
    <el-step title="选择项目架构"></el-step>
    <el-step title="基础数据"></el-step>
    <el-step title="设置成员"></el-step>
    <el-step title="设置参测对象"></el-step>
    <el-step title="设置阶段"></el-step>
  </el-steps>
  <el-tabs v-if="modify" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :lazy=true label="基础数据" name="first">
      <infor-step :dataForm="dataForm" :modify="modify"></infor-step>
    </el-tab-pane>
    <el-tab-pane label="设置成员" name="second">
      <pop-step :dataFormGiv="dataForm" :modify="modify"></pop-step>
    </el-tab-pane>
    <el-tab-pane label="设置参测对象" name="third">
      <obj-step :dataForm="dataForm" :modify="modify" ></obj-step>
    </el-tab-pane>
    <el-tab-pane label="设置阶段" name="fourth">
      <phase-step :dataForm="dataForm" :modify="modify"></phase-step>
    </el-tab-pane>
  </el-tabs>
    <keep-alive>
      <type-step v-if="active===0" @funcarchitecture='getVulue' ></type-step>
      <infor-step :currentRow="currentRow" :dataForm="dataForm" v-if="active===1" @giveDataForm='getVulue' @toPre='previous' ></infor-step>
      <pop-step :dataFormGiv="dataForm" v-if="active===2" @givePop='getVulue' @toPre='previous' ></pop-step>
      <boj-step :dataForm="dataForm" v-if="active===3" @giveType='getVulue' @toPre='previous' ></boj-step>
      <phase-step :dataForm="dataForm" v-if="active===4" @givePhase='getVulue' @toPre='previous' ></phase-step>
      <template v-if="active===5" >
        <el-row style="text-align: center;margin-top: 120px;" :gutter="20">
          <span>您确定要提交?</span>
          <div style="center;margin-top: 120px">
            <el-button type="primary" @click="previous()">上一步</el-button>
            <el-button type="primary" @click="toGiveForm()">提交</el-button>
          </div>
        </el-row>
      </template>
    </keep-alive>
  </el-dialog>
</template>

<script>
// 修改控件名
import debounce from 'lodash/debounce'
import TypeStep from './type-step'
import InforStep from './infor-step'
import PopStep from './pop-step'
import ObjStep from './obj-step'
import PhaseStep from './phase-step'
export default {
  props: {
    modify: {
      type: Boolean
    },
    currentRow: {
      type: Object
    }
  },
  data () {
    return {
      visible: false,
      activeName: 'first', // 标签页
      dataForm: {
        id: ''
      },
      active: 0,
      displayChild: '',
      giveForm: { // 改对象
        // oneStepVulue: '',
        // twoStepVulue: '',
        // threeStepVulue: '',
        // fourStepVulue: '',
        // fiveStepVulue: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        paramCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        paramValue: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    TypeStep,
    InforStep,
    PopStep,
    ObjStep,
    PhaseStep
  },
  methods: {
    titleName () {
      if (this.displayChild === 0) {
        return '创建项目'
      } else if (this.displayChild === 1) {
        return '创建子项目'
      } else {
        return '修改项目'
      }
    },
    getVulue (data) {
      this.active++
      if (this.active === 1) {
        this.dataForm.type = data
      }
      this.giveForm = {
        ...data,
        ...this.giveForm
      }
    },
    previous (data) {
      this.active--
    },
    // 将所有的信息提交到后台
    toGiveForm () {
      this.visible = false
      console.log(this.giveForm)
    },
    // 都要调用子组件
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        } else {
          this.emptyDataForm()
        }
      })
    },
    handleClick (tab, event) {
      console.log(this.dataForm)
      console.log(tab, event)
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/project/base/project/info?uuid=${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        console.log(this.dataForm)
      }).catch(() => {})
    },
    // 滞空dataForm
    emptyDataForm () {
      this.dataForm = {
        projectId: '',
        projectUuid: '',
        name: '',
        category: '',
        level: '',
        scope: '',
        paramValue: '',
        remark: '',
        type: '',
        planStartTime: '',
        planEndTiem: '',
        managerId: '',
        organizationId: '',
        source: '',
        projectStatus: ''
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/params', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
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
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
