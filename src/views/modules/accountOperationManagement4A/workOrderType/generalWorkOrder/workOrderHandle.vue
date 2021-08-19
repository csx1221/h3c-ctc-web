<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">{{title}}</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="工单编号：">
                        <el-input v-model="echoData.workNo" placeholder="请输入" clearable disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="工单标题：">
                        <el-input v-model="echoData.title" placeholder="请输入" clearable disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="工单类型：">
                        <ctc-select v-model="echoData.type" dict-type="workOrderType" placeholder="请选择" disabled></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="工单状态：">
                        <ctc-select v-model="echoData.state" dict-type="workOrderStatus" placeholder="请选择" disabled></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="提出人：">
                        <el-input v-model="echoData.userName" placeholder="请输入" clearable disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="创建时间：">
                        <el-input v-model="echoData.createDate" placeholder="请输入" clearable disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="工单描述：">
                        <el-input v-model="echoData.oderDesc" placeholder="请输入" :rows="5" type="textarea" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="附件：">
                        <ctc-download-table :id="echoData.fileId"></ctc-download-table>
                    </el-form-item>
                </el-col>
                <template v-if="isHidden">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="处理意见：" prop="opinion">
                            <el-radio-group v-model="dataForm.opinion">
                                <el-radio label="2" border>已完成</el-radio>
                                <el-radio label="3" border>否决</el-radio>
                                <el-radio label="1" border>转单</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item prop="handlerExplain" label="处理说明：">
                            <el-input v-model="dataForm.handlerExplain" placeholder="请输入" :rows="5" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="上传附件：" prop="fileId">
                            <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="dataForm.opinion==='1'">
                        <el-form-item label="下一步处理人：" prop="handleUserId">
<!--                            &lt;!&ndash;                        urlType 1 为4A测管理员  2 为集测管理员  3当前登录用户所在项目组项目经理&ndash;&gt;-->
<!--                            <ctc-next-step-handler v-model="dataForm.handleUserId" urlType="2" placeholder="请选择"></ctc-next-step-handler>-->
                            <ctc-next-step-handler-table v-model="dataForm.handleUserId" placeholder="请选择"></ctc-next-step-handler-table>
                        </el-form-item>
                    </el-col>
                    <div align="center" style="margin:40px 0 30px 0;">
                        <el-button type="primary" size="small" @click="close">取消</el-button>
                        <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
                    </div>
                </template>
              <template v-if="isHiddenYz">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="验证结果：" prop="opinion">
                    <el-radio-group v-model="dataForm.opinion">
                      <el-radio label="6" border>同意</el-radio>
                      <el-radio label="9" border>驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item prop="handlerExplain" label="结果说明："
                                :rules="[{ required: true, message: '请输入', trigger: 'blur' },{ required: true, message: '最多输入500个字', trigger: 'blur', min: 1, max: 500 }]">
                    <el-input v-model="dataForm.handlerExplain" placeholder="请输入" :rows="5" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="上传附件：" prop="fileId">
                    <ctc-file-upload ref="ctcFileUpload2" v-model="dataForm.fileId"></ctc-file-upload>
                  </el-form-item>
                </el-col>
                <div align="center" style="margin:40px 0 30px 0;">
                  <el-button type="primary" size="small" @click="close">取消</el-button>
                  <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
                </div>
              </template>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="处理记录：">
                        <ctc-process-record :record-id="$route.params.recordId"></ctc-process-record>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </el-card>
</template>

<script>

import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'workOrderHandle',
  components: {
  },
  watch: {
  },
  data () {
    return {
      isHasOrgId: false,
      title: '',
      isHidden: true,
      isHiddenYz: true,
      nameList: [],
      dataForm: {
        opinion: '', // 处理意见
        handlerExplain: '', // 处理说明
        fileId: '',
        handleUserId: '' // 下一步处理人
      },
      echoData: {
      }
    }
  },
  computed: {
    dataRule () {
      return {
        opinion: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        handlerExplain: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入200个字', trigger: 'blur', min: 1, max: 200 }
        ],
        handleUserId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.title = this.$route.meta.title
    // handlerType 1去处理 2 查看 5验证工单
    if (this.$route.params.handlerType === '1') {
      // do something
      this.isHiddenYz = false
    } else if (this.$route.params.handlerType === '2') {
      // do something
      this.isHidden = false
      this.isHiddenYz = false
    } else if (this.$route.params.handlerType === '5') {
      // do something
      this.isHidden = false
      this.initFileUpload2()
    }

    // console.log(this.$route.params.recordId)
    this.getEchoData(this.$route.params.recordId) // 获取工单信息

    let thisvm = this
    // setTimeout(res => {
    thisvm.initFileUpload()
    // }, 1000)
  },
  methods: {
    getEchoData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/currency/order/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        thisvm.echoData = res.data || {}
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    close () {
      removeCurrentTabsHandle(this)
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accState', row[item.code])
      } else if (item.code === 'approvalStatus') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else if (item.code === 'canLoginWay') {
        columnValue = this.$getDictLabel('VPNPermission', row[item.code])
      } else if (item.code === 'isGfort') {
        columnValue = this.$getDictLabel('isGfort', row[item.code])
      } else if (item.code === 'opinion') {
        columnValue = this.$getDictLabel('handlingOpinions', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (thisvm.$route.params.handlerType === '1') {
            // do something
            thisvm.$refs.ctcFileUpload.doFileUploadAction(function () {
              thisvm.submitData()
            })
          } else if (thisvm.$route.params.handlerType === '5') {
            // do something
            thisvm.$refs.ctcFileUpload2.doFileUploadAction(function () {
              thisvm.submitData()
            })
          } else {
            thisvm.submitData()
          }
        } else {
          return false
        }
      })
    },
    submitData (val) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { ...thisvm.dataForm, recordId: thisvm.$route.params.recordId }
      thisvm.$http.post('/account4a/handler/approval', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        thisvm.$message.success('处理成功')
        thisvm.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    },
    initFileUpload2 () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload2.init()
    }
  }
}
</script>

<style scoped lang="scss">
    .accStyle{
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 100%;
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
