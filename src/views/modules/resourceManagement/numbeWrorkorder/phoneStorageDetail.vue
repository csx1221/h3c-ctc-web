<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <el-form ref="dataForm" :model="dataForm" label-width="100px" class="biaodan">
        <el-form-item label="申请标题:" prop="title">
          <el-input disabled v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="申请理由:" prop="desc">
          <el-input disabled type="textarea" v-model="dataForm.reason"></el-input>
        </el-form-item>
        <el-col :span="24" style="margin-top: 24px">
          <el-card shadow="never" class="aui-card--fill">
            <el-row style="margin-bottom: 20px">
              <el-col :span="12" class="split-line" style="text-align: left">
                入库申请
              </el-col>
            </el-row>
            <el-table
              stripe
              v-loading="dataListLoading"
              :data="dataForm.mobilephoneList"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="手机名称"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="owner"
                label="负责人"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="manufacturer"
                label="厂商"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="model"
                label="型号"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="serialNo"
                label="设备序号"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="displayRadio"
                label="分辨率"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="mem"
                label="内存"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="descript"
                label="备注"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="24" style="margin-top: 24px" v-if="taskId">
          <el-card shadow="never" class="aui-card--fill">
            <el-row style="margin-bottom: 20px">
              <el-col :span="12" class="split-line" style="text-align: left">
                审批
              </el-col>
            </el-row>
            <el-form-item prop="status" label="审批结果:">
              <el-radio-group v-model="dataForm.status">
                <el-radio label="y">同意</el-radio>
                <el-radio label="n">不同意</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见:" prop="descript">
              <el-input type="textarea" v-model="dataForm.descript"></el-input>
            </el-form-item>
          </el-card>
        </el-col>
      </el-form>
      <div align="center" style="marginTop: 20px" v-if="taskId">
        <el-button
          type="primary"
          size="middle"
          @click="handleSubmit(dataForm)"
          style="margin: 0px 0 20px 80px;"
          >提交</el-button>
        <el-button
          type="primary"
          size="middle"
          @click="handleCancel()"
          style="margin: 0px 0 20px 80px;"
          >取消</el-button>
      </div>
    </el-row>
  </el-card>
</template>

<script>
/* eslint-disable */
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'accountApplication',
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/participant/pass',
        getDataListIsPage: true
      },
      dataForm: {
        title: '', // 手机号码
        reason: '',
        status: 'y', // y:同意  n:不同意
        descript: '',
        mobilephoneList: []
      },
      dataList: [],
      taskId: ''
    }
  },
  props: {
    selectData: Object,
  },
  mounted () {
    this.taskId = this.selectData.taskId
    this.getDetailData()
  },
  methods: {
    translateData (data) {
      let thisvm = this
      Object.keys(data).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (data[key] === null) {
              thisvm.dataForm[key1] = ''
            } else {
              thisvm.dataForm[key1] = data[key]
            }
          }
        })
      })
    },
    getDetailData () {
      let code = this.selectData.code
      this.$http.get(`/ctc/resource/activiti/apply/applyDetail/${code}`).then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.translateData(res.data);
          }
        }).catch(() => {
          this.dataListLoading = false;
        });
    },
    handleCancel () {
      this.$emit('close');
    },
    handleSubmit () {
      let params = { 
        taskId: this.selectData.taskId,
        code: this.selectData.code,
        status: this.dataForm.status,
        descript: this.dataForm.descript
      }
      this.$http['post']('/ctc/resource/activiti/approval/handler',
        params
      ).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.$message.success('审批成功')
          this.$emit('close', 'refresh');
        }
      }).catch(() => {
      })
    },
  }
}
</script>

<style scoped>
.el-form{
    display: inline-block;
}
.biaodan {
  width: 100%;
}
.from {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
