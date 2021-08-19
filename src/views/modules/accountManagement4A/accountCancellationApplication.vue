<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请列表</span></el-divider>
            <el-col :span="24" align="right" style="margin-bottom: 5px">
                <el-button type="primary" size="small" @click="removeNodeAll">一键清空</el-button>
                <el-badge :value="selectData.length" size="mini" class="item"></el-badge>
            </el-col>
            <el-table max-height="450" stripe :data="selectData" border style="width: 100%;">
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <template v-for="(item, index) in titleDataList">
                    <template v-if="item.code==='status'">
                        <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <template v-if="scope.row.status===3||scope.row.status===5">
                                    <span v-html="getTableColumnData(scope.row,item)"></span><br>
                                    <span style="color: red" v-html="scope.row.msg"></span>
                                </template>
                                <template v-else>
                                    <template v-if="scope.row.status===2">
                                        <el-tooltip class="item" effect="light" content="4A账号已注销，请重新申请" placement="top">
                                            <span v-html="getTableColumnData(scope.row,item)"></span>
                                        </el-tooltip>
                                    </template>
                                    <template v-else-if="scope.row.status===4">
                                        <el-tooltip class="item" effect="light" content="15分钟后通过正确密码登录即可解锁" placement="top">
                                            <span v-html="getTableColumnData(scope.row,item)"></span>
                                        </el-tooltip>
                                    </template>
                                    <template v-else>
                                        <span v-html="getTableColumnData(scope.row,item)"></span>
                                    </template>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-html="getTableColumnData(scope.row,item)"></span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
                <el-table-column fixed="right" label="操作" header-align="center" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removeNode(scope.row.index,scope.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span> <div style="color:red;line-height: 1.8;display: inline-block">
                <span>  (账号注销需由局方负责人提交注销申请)</span><br>
            </div></el-divider>
            <el-form style="width: 100%" :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="注销原因：" prop="msg">
                        <ctc-select v-model="dataForm.msg" dict-type="cancelCause" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="注销说明：" prop="content">
                        <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.content"></el-input>
                    </el-form-item>
                </el-col>
<!--                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
<!--                    <el-form-item label="审批附件：" prop="fileId">-->
<!--                      <div style="color:red;line-height: 1.8">-->
<!--                        <span>安全中心对审批附件有以下要求：</span><br>-->
<!--                        <span>1-信息技术中心人员申请4A主账号时，需部门领导知晓、同意</span><br>-->
<!--                        <span>2-其他移动机构申请4A主账号时，需局方直属领导，或局方分管领导，或局方部门领导知晓、同意</span><br>-->
<!--                        <span>请上传相关领导知晓、同意的审批材料，支持截图、邮件附件等形式。</span>-->
<!--                      </div>-->
<!--                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
            </el-form>
            <div align="center">
                <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
                <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
            </div>
        </el-row>
        <fix-message v-if="fixMessageVisible" ref="fixMessage" @init="fixMessageVisible = false,$emit('close', 'refresh')"></fix-message>
    </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import fixMessage from '@/views/modules/accountManagement4A/fixMessage'
export default {
  name: 'accountApplication',
  mixins: [mixinViewModule],
  components: { fixMessage },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/participant/pass',
        getDataListIsPage: true
      },
      fixMessageVisible: false,
      dataForm: {
        msg: '',
        content: ''
        // fileId: ''
      },
      dataRule: {
        msg: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        fileId: [
          { required: true, message: '请上传附件', trigger: 'change' }
        ]
      },
      titleDataList: [
        {
          name: '账号',
          code: 'loginName'
        },
        {
          name: '姓名',
          code: 'name'
        },
        // {
        //   name: '姓名全拼',
        //   code: 'fullPinyinName'
        // },
        {
          name: '项目组',
          code: 'orgName'
        },
        {
          name: '所属机构',
          code: 'organName'
        },
        // {
        //   name: '申请人',
        //   code: 'creatorName'
        // },
        // {
        //   name: '申请时间',
        //   code: 'createDate'
        // },
        {
          name: '状态',
          code: 'status'
        },
        // {
        //   name: '审批状态',
        //   code: 'approvalStatus'
        // }
        {
          name: 'VPN权限',
          code: 'canLoginWay'
        },
        {
          name: '图形堡垒权限',
          code: 'isGfort'
        },
        {
          name: 'VPN开始时间',
          code: 'vpnEffectTime'
        },
        {
          name: 'VPN结束时间',
          code: 'vpnExpireTime'
        }
      ]
    }
  },
  props: {
    selectData: Array
  },
  computed: {},
  mounted () {
    // this.initFileUpload()
  },
  methods: {
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
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    removeNode (index, node) {
      let _this = this
      _this.selectData.splice(_this.selectData.findIndex(item => item.id === node.id), 1)
    },
    removeNodeAll () {
      let _this = this
      _this.selectData.splice(0, _this.selectData.length)
    },
    submitResult (res) {
      // console.log(this.selectData)
      if (this.selectData.length > 0) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.submitData()
          } else {
            return false
          }
        })
      } else {
        this.$message.warning('申请列表为空，请重新选择')
      }
    },
    submitData () {
      let params = {}
      params.accounts = []
      for (let i = 0; i < this.selectData.length; i++) {
        params.accounts.push({ loginName: this.selectData[i].loginName })
      }
      params.msg = this.dataForm.msg
      params.content = this.dataForm.content
      params.fileId = this.dataForm.fileId
      this.$http.post('/account4a/account/cancel', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.removeNodeAll()
          this.open(res.data)
          // this.$emit('close', 'refresh')
        }
      }).catch(() => {
      })
    },
    open (msg) {
      this.fixMessageVisible = true
      this.$nextTick(() => {
        this.$refs.fixMessage.init('提交成功，待审批', msg)
      })
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': [] }
      this.$refs.ctcFileUpload.init()
    }
  }
}
</script>

<style scoped>
    .el-form{
        display: inline-block;
    }
</style>
