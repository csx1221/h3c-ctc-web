<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <ctc-account-file ref="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-account-file>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        申请列表
      </el-col>
      <el-col :span="12" align="right">
        <span class="spanList">上传数量：{{dataList.length}}</span>
        <span class="spanList success">正常数量：{{normalQuantity}}</span>
        <span class="spanList error">异常数量：{{abnormalqQuantity}}</span>
        <el-button v-if="dataList.length>0" type="primary" @click="operation('1')" size="small">批量移除</el-button>
        <el-button v-if="abnormalqQuantity!==0" type="primary" @click="operation('2')" size="small">移除异常</el-button>
      </el-col>
    </el-row>
    <div style="color:red;">
      <span>标红内容可能存在重复异常</span>
    </div>
    <el-row>
      <el-table :empty-text="'请先录入附件'" stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column v-if="type !== '3'" prop="isExistAcct" label="是否已有主账号" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="$getDictLabel('isExistAcct', scope.row.isExistAcct)"></span>
          </template>
        </el-table-column>
        <el-table-column v-if="type !== '3'" prop="loginName" label="主账号用户账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="type !== '3'" prop="fullPinyinName" label="姓名全拼" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机号" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.exception.mobile">
              <span style="color: red" v-html="scope.row.mobile"></span>
            </template>
            <template v-else>
              <span v-html="scope.row.mobile"></span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.exception.email">
              <span style="color: red" v-html="scope.row.email"></span>
            </template>
            <template v-else>
              <span v-html="scope.row.email"></span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="cardValue" label="身份证" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.exception.cardValue">
              <span style="color: red" v-html="scope.row.cardValue"></span>
            </template>
            <template v-else>
              <span v-html="scope.row.cardValue"></span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="项目组" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organName" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="type === '3'" prop="canLoginWay" label="VPN权限" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="$getDictLabel('VPNPermission', scope.row.canLoginWay)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="isException" label="状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{'spanList error':scope.row.isException,'spanList success':scope.row.isException}" v-html="scope.row.isException?'异常':'正常'"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button @click="createConfig('编辑','1',scope.row,scope.$index,type)" type="text" size="small">编辑</el-button>
            <el-button @click="createConfig('移除','2',scope.row,scope.$index)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <!--                <el-col v-if="hasFile" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
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
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item prop="applyReason" label="申请原因：">
            <el-input v-model="dataForm.applyReason" placeholder="请输入" :rows="5" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div style="text-align:center;margin-top: 20px;">
      <!--            <el-button type="primary" size="small" @click="fileImport">批量录入</el-button>-->
      <el-button type="info" size="small" @click="$emit('close')">取消</el-button>
      <el-button :disabled="dataList.length===0" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
    </div>
    <!--        编辑-->
    <updata-list v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="updataList" @init="addOrUpdataVisible = false"></updata-list>
    <fix-message v-if="fixMessageVisible" ref="fixMessage" @init="fixMessageVisible = false,$emit('close', 'refresh')"></fix-message>
    <!--引入文件导入-->
    <!--        <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-file-import>-->
  </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
import updataList from './updataList'
import fixMessage from '@/views/modules/accountManagement4A/fixMessage'
export default {
  name: 'accountApplication',
  components: {
    updataList, fixMessage
  },
  data () {
    return {
      addOrUpdataVisible: false,
      fixMessageVisible: false,
      dataListLoading: false,
      ctcFileImport: false,
      hasFile: true,
      normalQuantity: 0, // 正常数量
      abnormalqQuantity: 0, // 异常数量
      dataListSelections: '',
      dataForm: {
        applyReason: ''
      },
      dataRule: {
        applyReason: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dataList: []
    }
  },
  props: {
    // 选中列表
    type: String
  },
  watch: {
    dataList (newVal, oldVal) {
      this.normalQuantity = this.dataList.filter(obj => obj.isException !== true).length
      this.abnormalqQuantity = this.dataList.length - this.normalQuantity
      let zzhlength = this.dataList.filter(obj => obj.isExistAcct === '1').length
      if (zzhlength === newVal.length) {
        this.hasFile = false
      } else {
        this.hasFile = true
      }
    },
    hasFile (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          // this.initFileUpload()
        })
      }
    }
  },
  computed: {},
  mounted () {
    // this.initFileUpload()
    this.initFileImport()
    // if (this.selectionList.length > 0) {
    //   this.dataList = this.selectionList
    // }
  },
  methods: {
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 操作
    operation (type) {
      // 1 批量移除 2 移除异常
      if (type === '1') {
        if (this.dataListSelections.length !== 0) {
          this.dataList = [...this.dataList].filter(x => [...this.dataListSelections].every(y => y !== x))
        } else {
          this.$message.warning('请选择需要移除项！！！')
        }
      } else if (type === '2') {
        this.dataList = this.dataList.filter(obj => obj.isException !== true)
      }
      this.validateForm()
    },
    createConfig (title, type, data, index, updataType) {
      if (type === '1') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, type, data, index, updataType)
        })
      } else if (type === '2') {
        this.dataList.splice(index, 1)
        this.validateForm()
      }
    },
    submitResult (res) {
      if (this.abnormalqQuantity > 0) {
        this.$message.warning('请处理异常列表')
      } else {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.submitData()
          } else {
            return false
          }
        })
      }
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let fromList = []
      let dataList = this.dataList
      // 2批量申请 3 批量变更
      if (this.type === '3') {
        for (let i = 0; i < dataList.length; i++) {
          let node = {}
          node.isExistAcct = dataList[i].isExistAcct
          node.loginName = dataList[i].loginName
          node.name = dataList[i].name
          node.mobile = dataList[i].mobile
          node.email = dataList[i].email
          node.cardValue = dataList[i].cardValue
          node.orgId = Array.isArray(dataList[i].orgId) ? dataList[i].orgId[dataList[i].orgId.length - 1] : dataList[i].orgId
          node.areaId = dataList[i].areaId
          node.isGfort = dataList[i].isGfort
          node.acctType = dataList[i].acctType
          node.organId = dataList[i].organId
          node.canLoginWay = dataList[i].canLoginWay
          node.vpnEffectTime = dataList[i].vpnEffectTime
          node.vpnExpireTime = dataList[i].vpnExpireTime
          fromList.push(node)
        }
      } else {
        for (let i = 0; i < dataList.length; i++) {
          let node = {}
          node.isExistAcct = dataList[i].isExistAcct
          node.loginName = dataList[i].loginName
          node.name = dataList[i].name
          node.fullPinyinName = dataList[i].fullPinyinName
          node.mobile = dataList[i].mobile
          node.email = dataList[i].email
          node.cardValue = dataList[i].cardValue
          node.orgId = Array.isArray(dataList[i].orgId) ? dataList[i].orgId[dataList[i].orgId.length - 1] : dataList[i].orgId
          node.areaId = dataList[i].areaId
          node.acctType = dataList[i].acctType
          node.organId = dataList[i].organId
          node.isGfort = dataList[i].isGfort
          node.canLoginWay = dataList[i].canLoginWay
          node.vpnEffectTime = dataList[i].vpnEffectTime
          node.vpnExpireTime = dataList[i].vpnExpireTime
          fromList.push(node)
        }
      }
      let params = { accounts: fromList, fileId: this.dataForm.fileId }
      if (this.type === '2') {
        params.applyReason = this.dataForm.applyReason
      }
      thisvm.$http.post(this.type === '3' ? '/account4a/account/update' : '/account4a/account/add', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        // this.$message.success('提交成功')
        this.open(res.data)
        // this.$emit('close', 'refresh')
        // console.log(res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    open (msg) {
      this.fixMessageVisible = true
      this.$nextTick(() => {
        this.$refs.fixMessage.init('提交成功，待审批', msg)
      })
    },
    initFileImport () {
      let fileImportParams = this.type === '3' ? { 'templateData': { 'fileName': '主从账号变更模板' }, 'uploadData': {} } : { 'templateData': { 'fileName': '主从账号申请模板' }, 'uploadData': {} }
      // type === '3' 为批量变更
      fileImportParams.templateUrl = this.type === '3' ? '/account4a/account/updateTemp' : '/account4a/account/applyTemp'
      fileImportParams.uploadUrl = this.type === '3' ? '/account4a/account/updateFileAnalysis' : '/account4a/account/applyFileAnalysis'
      this.$refs.ctcFileImport.fileImportParams = { ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    updataList ($index, dataForm) {
      this.dataList.splice($index, 1, dataForm)
      this.validateForm()
    },
    // 校验对应属性重复
    validateRepeat (list, key) {
      // 根据指定字段去重
      const r = list.reduce((all, next) => all.some((atom) => atom[key] === next[key]) ? all : [...all, next], [])
      var newArr = list.filter(el => !r.includes(el))
      for (let i = 0; i < list.length; i++) {
        if (newArr.length > 0) {
          for (let j = 0; j < newArr.length; j++) {
            if (list[i][key] === newArr[j][key]) {
              this.dataList[i].exception[key] = true
              this.dataList[i].isException = true
            }
          }
        } else {
          this.dataList[i].exception[key] = false
        }
      }
    },
    validateForm () {
      let thisvm = this
      let vars = {}
      thisvm.$ctcLoading.open()
      console.log(thisvm.dataList)
      for (let i = 0; i < thisvm.dataList.length; i++) {
        let varname = 'let' + i
        vars[varname] = new Promise((resolve, reject) => {
          thisvm.validateData(i, thisvm.dataList[i], resolve, reject)
        })
      }
      Promise.all(Array.from(vars)).then(() => {
        thisvm.$ctcLoading.close()
      })
    },
    validateType () {
      this.validateRepeat(this.dataList, 'cardValue')
      this.validateRepeat(this.dataList, 'mobile')
      this.validateRepeat(this.dataList, 'email')
    },
    validateData ($index, item, resolve, reject) {
      let thisvm = this
      let { fileId, exception, isException, ...account } = item
      if (item.vpnEffectTime) {
        account.vpnEffectTime = item.vpnEffectTime.replace(/-/g, '')
        account.vpnExpireTime = item.vpnExpireTime.replace(/-/g, '')
      }
      account.orgId = Array.isArray(item.orgId) ? item.orgId[item.orgId.length - 1] : account.orgId
      let params = { ...account }
      thisvm.$http.post(this.type !== '3' ? '/account4a/account/applyAccountValidator' : '/account4a/account/updateAccountValidator', params).then(({ data: res }) => {
        if (res.code !== 0) {
          resolve(false)
          // return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        thisvm.dataList.splice($index, 1, res.data)
        thisvm.validateType()
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    },
    triggerParentPage (res) {
      console.log(res)
      this.dataList = res.data || []
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.spanList {
  margin: 0 10px;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
</style>
