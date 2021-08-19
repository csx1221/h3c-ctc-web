<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <ctc-account-file ref="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-account-file>
    </el-row>
<!--    {{dataList}}-->
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
<!--    {{dataList}}-->
    <el-row>
      <el-table :empty-text="'请先录入附件'" stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <template v-if="type==='1'">
          <el-table-column prop="type" label="申请类型" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('acctApplyType', scope.row.type)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="loginName" label="4A主账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.mobile">
                <span style="color: red" v-html="scope.row.mobile"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.mobile"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.email">
                <span style="color: red" v-html="scope.row.email"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.email"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="cardValue" label="身份证" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.cardValue">
                <span style="color: red" v-html="scope.row.cardValue"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.cardValue"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="部门/项目组" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isGfort" label="图形堡垒权限" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('isGfort', scope.row.isGfort)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="canLoginWay" label="VPN权限" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('VPNPermission', scope.row.canLoginWay)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="sysAcctType" label="账号类型" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('accTypeNew', scope.row.sysAcctType)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="所属机构/部门/科室" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serviceName" label="服务机构/部门/科室" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="roles" label="账号角色" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isException" label="状态" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="{'spanList error':scope.row.isException,'spanList success':scope.row.isException}" v-html="scope.row.isException?'失败':'正常'"></span>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="type==='2'">
          <el-table-column prop="loginName" label="4A主账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.mobile">
                <span style="color: red" v-html="scope.row.mobile"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.mobile"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.email">
                <span style="color: red" v-html="scope.row.email"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.email"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="cardValue" label="身份证" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.exception&&scope.row.exception.cardValue">
                <span style="color: red" v-html="scope.row.cardValue"></span>
              </template>
              <template v-else>
                <span v-html="scope.row.cardValue"></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="部门/项目组" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isGfort" label="图形堡垒权限" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('isGfort', scope.row.isGfort)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="canLoginWay" label="VPN权限" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('VPNPermission', scope.row.canLoginWay)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="sysAcctType" label="账号类型" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('accTypeNew', scope.row.sysAcctType)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="所属机构/部门/科室" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serviceName" label="服务机构/部门/科室" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="roles" label="账号角色" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isException" label="状态" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="{'spanList error':scope.row.isException,'spanList success':scope.row.isException}" v-html="scope.row.isException?'失败':'正常'"></span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button @click="createConfig('编辑','1',scope.row,scope.$index,type)" type="text" size="small">编辑</el-button>
            <el-button @click="createConfig('移除','2',scope.row,scope.$index)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--        编辑-->
    <updata-list v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="updataList" @init="addOrUpdataVisible = false"></updata-list>
  </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
import updataList from '@/views/modules/accountOperationManagement4A/pubilcModule/updataList'
export default {
  name: 'accountBatch',
  components: {
    updataList
  },
  data () {
    return {
      addOrUpdataVisible: false,
      dataListLoading: false,
      ctcFileImport: false,
      normalQuantity: 0, // 正常数量
      abnormalqQuantity: 0, // 异常数量
      dataListSelections: '',
      dataList: [
        // {
        //   type: '0',
        //   loginName: '主账号名1',
        //   name: 'name1',
        //   mobile: '18126006639',
        //   email: '110@qq.com',
        //   cardValue: '362330199402095815',
        //   orgId: '1462',
        //   orgName: '集中化测试中心',
        //   isGfort: '1',
        //   canLoginWay: '1',
        //   sysAcctType: '1',
        //   organId: '1326351810782384130',
        //   organName: '所属机构名',
        //   serviceId: '1326351810782384130;1328229534702546946',
        //   serviceName: '服务机构名1/服务机构名2,服务机构名2/服务机构名3',
        //   // organization: [],
        //   // organizationGs: [],
        //   roleIds: ['2', '3'],
        //   fullPinyinName: 'lipengfei',
        //   isException: true,
        //   exception: [
        //     {
        //       type: true,
        //       loginName: true,
        //       name: true,
        //       mobile: true,
        //       email: true,
        //       cardValue: true,
        //       orgId: true,
        //       isGfort: true,
        //       canLoginWay: true,
        //       sysAcctType: true,
        //       organId: true,
        //       serviceId: true,
        //       roles: true
        //     }
        //   ]
        // },
        // {
        //   'type': 0,
        //   'loginName': null,
        //   'name': '李鹏飞1',
        //   'mobile': '18126006639',
        //   'email': '181260066@qq.com',
        //   'cardValue': '362330199402095815',
        //   'orgId': '1462',
        //   'orgName': null,
        //   'isGfort': '1',
        //   'canLoginWay': '0',
        //   'sysAcctType': 0,
        //   'organId': '1323915112471592962',
        //   'organName': '信息技术中心/测试部门/1231',
        //   'organizeFrom': {
        //     'serviceId': '1323915112471592962',
        //     'lv': 2,
        //     'type': 0,
        //     'organId': '1253335131565850002',
        //     'deptId': '1285120843713716225',
        //     'sectionId': '1323915112471592962'
        //   },
        //   'serviceId': '1323915112471592962;1323939433403432962',
        //   'serviceName': '信息技术中心/测试部门/1231,信息技术中心/测试部门/测试科室1',
        //   'roles': '委托方;测试人员',
        //   'roleIds': [
        //     '11',
        //     '12'
        //   ],
        //   'fullPinyinName': null,
        //   'isException': true,
        //   'exception': {
        //     'type': false,
        //     'loginName': false,
        //     'name': true,
        //     'mobile': false,
        //     'email': false,
        //     'cardValue': false,
        //     'orgId': false,
        //     'isGfort': false,
        //     'canLoginWay': false,
        //     'sysAcctType': false,
        //     'organId': false,
        //     'serviceId': false,
        //     'roles': false
        //   }
        // }
      ]
    }
  },
  props: {
    data: Array,
    // 选中类型
    type: [String, Number]
  },
  watch: {
    dataList (newVal, oldVal) {
      this.normalQuantity = this.dataList.filter(obj => obj.isException !== true).length
      this.abnormalqQuantity = this.dataList.length - this.normalQuantity

      this.$emit('update:data', newVal)
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
      // 1编辑 2移除
      if (type === '1') {
        this.addOrUpdataVisible = true
        console.log(updataType)
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, type, data, index, updataType)
        })
      } else if (type === '2') {
        this.dataList.splice(index, 1)
        this.validateForm()
      }
    },
    submitResult (callback) {
      if (this.abnormalqQuantity > 0) {
        this.$message.warning('请处理异常列表')
      } else {
        if (callback) {
          callback && callback()
        }
      }
    },
    initFileImport () {
      let fileImportParams = this.type === '2' ? { 'templateData': { 'fileName': '主从账号变更模板' }, 'uploadData': {} } : { 'templateData': { 'fileName': '主从账号申请模板' }, 'uploadData': {} }
      // type === '2' 为批量变更 1为批量申请
      fileImportParams.templateUrl = this.type === '2' ? '/account4a/update/account/updateTemp' : '/account4a/apply/account/applyTemp'
      fileImportParams.uploadUrl = this.type === '2' ? '/account4a/update/account/updateFileAnalysis' : '/account4a/apply/account/applyFileAnalysis'
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
      let { exception, isException, ...account } = item
      account.orgId = Array.isArray(item.orgId) ? item.orgId[item.orgId.length - 1] : account.orgId
      let params = { ...account }
      // type 1批量申请 2批量变更
      thisvm.$http.post(this.type === '1' ? '/account4a/apply/account/applyAccountValidator' : '/account4a/update/account/updateAccountValidator', params).then(({ data: res }) => {
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
