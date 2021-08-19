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
            <el-table  stripe  v-loading="dataListLoading"  :data="dataForm.cardnumberList"  border style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="number" width="110" label="手机号码" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="operator" width="110" label="运营商" align="center" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="cityDefine" width="110" label="地方" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="imsi" width="100" label="IMSI" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="brand" width="100" label="品牌" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ $getDictLabel('brand', scope.row.brand) }}
                </template>
              </el-table-column>
              <el-table-column prop="applicationName" width="110" label="所属平台" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="serviceNo" width="110" label="密码服务" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="monthlyFee" width="110" label="月度资费" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="score" width="110" label="积分" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="owner" width="200" label="负责人" align="center" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="owner" width="200" label="负责人联系方式" align="center" show-overflow-tooltip></el-table-column> -->
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
        cardnumberList: []
      },
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
