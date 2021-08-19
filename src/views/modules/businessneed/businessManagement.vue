<template>
  <el-card shadow="never" class="aui-card--fill bob">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" ref="aForm" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务名称">
              <el-input v-model="dataForm.name" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求提出人">
              <el-input v-model="dataForm.contactName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参测省">
              <el-select v-model="provinceCode" placeholder="请先选择省份" clearable>
                <el-option
                  v-for="item in organizeList"
                  :key="item.val"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
          <el-col :span="24" style="margin-top:24px;">
            <el-tabs v-model="activeGroup" type="border-card">
              <el-tab-pane label="待测试" name="1">
                <!-- there is el-table -->
                <el-table stripe highlight-current-row max-height="680" :data="testedDataList" >
                  <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                  <el-table-column prop="orderCode" align="center" v-if="false"></el-table-column>
                  <el-table-column width="160" label="业务名称" header-align="center" align="center">
                    <template slot-scope="scope">
                      <span :class="{red:redNotify(scope.row),red1:redNotify1(scope.row,'orderName')}" @click="resetBlack(scope.row.orderCode,'orderName')">{{scope.row.orderName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="operationType" label="操作类型" header-align="center" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.operationType==11">新增</span>
                      <el-button type="text" size="small" v-if="scope.row.operationType==12" :class="{red1:redNotify1(scope.row,'operationType')}" @click="resetBlack(scope.row.orderCode,'operationType');getUpdateExplain(scope.row)">修改</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="需求文件" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'attachment')}" @click="resetBlack(scope.row.orderCode,'attachment');getDemandDownloadList(scope.row.orderCode)">下载</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="160" label="前序测试结果" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="getTestResultDownloadList(scope.row.orderCode)">下载</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="参测省" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'province')}" @click="resetBlack(scope.row.orderCode,'province');getTestProvince(scope.row.orderCode)">{{ scope.row.province }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="已上线省份" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'onlineProvinceName')}" @click="resetBlack(scope.row.orderCode,'onlineProvinceName');getOnlineProvince(scope.row.orderCode)">{{ scope.row.onlineProvinceName }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="160" prop="mktTestExpectFinishTime" label="期望完成时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="contactName" label="需求提出人" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getPersonInfo(scope.row.orderCode)">{{scope.row.contactName}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="更新记录" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getUpdateRecord(scope.row.orderCode)">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="130" fixed="right" label="是否接收" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-radio-group v-model="scope.row.orderStatus" @change="doReceive(scope.row.orderStatus,scope.row.orderCode)">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="查看记录" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getLookRecord(scope.row.orderCode)">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="doFinish(scope.row.orderCode)">归档</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                  <!-- 分页组件 -->
                <el-pagination :current-page="testedPage" :page-sizes="[10, 20, 50, 100]" :page-size="testedLimit" :total="testedTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="pageTestSizeChangeHandle" @current-change="pageTestCurrentChangeHandle">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane label="已归档" name="2">
                <!-- there is el-table -->
                <el-table stripe highlight-current-row max-height="680" :data="filedDataList">
                  <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                  <el-table-column prop="orderCode" align="center" v-if="false"></el-table-column>
                  <el-table-column width="160" label="业务名称" header-align="center" align="center">
                    <template slot-scope="scope">
                      <span :class="{red:redNotify(scope.row),red1:redNotify1(scope.row,'orderName')}" @click="resetBlack(scope.row.orderCode,'orderName')">{{scope.row.orderName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="operationType" label="操作类型" header-align="center" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.operationType==11">新增</span>
                      <el-button type="text" size="small" v-if="scope.row.operationType==12" :class="{red1:redNotify1(scope.row,'operationType')}" @click="resetBlack(scope.row.orderCode,'operationType');getUpdateExplain(scope.row)">修改</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="需求文件" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'attachment')}" @click="resetBlack(scope.row.orderCode,'attachment');getDemandDownloadList(scope.row.orderCode)">下载</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="160" label="前序测试结果" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="getTestResultDownloadList(scope.row.orderCode)">下载</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="参测省" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'province')}" @click="resetBlack(scope.row.orderCode,'province');getTestProvince(scope.row.orderCode)">{{ scope.row.province }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="已上线省份" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" :class="{red1:redNotify1(scope.row,'onlineProvinceName')}" @click="resetBlack(scope.row.orderCode,'onlineProvinceName');getOnlineProvince(scope.row.orderCode)">{{ scope.row.onlineProvinceName }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="160" prop="mktTestExpectFinishTime" label="期望完成时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
                  <el-table-column width="160" prop="contactName" label="需求提出人" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getPersonInfo(scope.row.orderCode)">{{scope.row.contactName}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="更新记录" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getUpdateRecord(scope.row.orderCode)">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="130" fixed="right" label="是否接收" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-radio-group v-model="scope.row.orderStatus" @change="doReceive(scope.row.orderStatus,scope.row.orderCode)">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" >否</el-radio>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="查看记录" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small"  @click="getLookRecord(scope.row.orderCode)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页组件 -->
                <el-pagination :current-page="filedPage" :page-sizes="[10, 20, 50, 100]" :page-size="filedLimit" :total="filedTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="pageFiledSizeChangeHandle" @current-change="pageFiledCurrentChangeHandle">
                </el-pagination>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <demandDownload :visible.sync="visibleDemandDownload" v-if="showDemandDownload" ref="demandDownloadRef"></demandDownload>
    <testResultDownload :visible.sync="visibleTestResultDownload" v-if="showTestResultDownload" ref="testResultDownloadRef"></testResultDownload>
    <testProvince :visible.sync="visibleTestProvince" v-if="showTestProvince" ref="testProvinceRef"></testProvince>
    <onlineProvince :visible.sync="visibleOnlineProvince" v-if="showOnlineProvince" ref="onlineProvinceRef"></onlineProvince>
    <updateRecord :visible.sync="visibleUpdateRecord" v-if="showUpdateRecord" ref="updateRecordRef"></updateRecord>
    <lookRecord :visible.sync="visibleLookRecord" v-if="showLookRecord" ref="lookRecordRef"></lookRecord>
    <personInfo :visible.sync="visiblePersonInfo" v-if="showPersonInfo" ref="personInfoRef"></personInfo>
    <updateExplain :visible.sync="visibleUpdateExplain" v-if="showUpdateExplain" ref="updateExplainRef"></updateExplain>
  </el-card>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import demandDownload from '@/views/modules/businessneed/demandDownload'
import testResultDownload from '@/views/modules/businessneed/testResultDownload'
import testProvince from '@/views/modules/businessneed/testProvince'
import onlineProvince from '@/views/modules/businessneed/onlineProvince'
import updateRecord from '@/views/modules/businessneed/updateRecord'
import lookRecord from '@/views/modules/businessneed/lookRecord'
import personInfo from '@/views/modules/businessneed/personInfo'
import updateExplain from '@/views/modules/businessneed/updateExplain'

export default {
  // mixins: [projectView],
  data () {
    return {
      optionProps: {
        expandTrigger: 'hover',
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'list'
      },
      dataForm: {
        contactName: '',
        name: ''
      },
      provinceCode: '',
      // 省份数据
      organizeList: [],
      activeGroup: '1',
      testedDataList: [],
      testedPage: 1,
      testedLimit: 10,
      testedTotal: 0,
      filedDataList: [],
      filedPage: 1,
      filedLimit: 10,
      filedTotal: 0,
      dataListLoading: false,
      showDemandDownload: false,
      visibleDemandDownload: false,
      showTestResultDownload: false,
      visibleTestResultDownload: false,
      showTestProvince: false,
      visibleTestProvince: false,
      showOnlineProvince: false,
      showPersonInfo: false,
      visiblePersonInfo: false,
      visibleOnlineProvince: false,
      showUpdateRecord: false,
      visibleUpdateRecord: false,
      showLookRecord: false,
      visibleLookRecord: false,
      showUpdateExplain: false,
      visibleUpdateExplain: false,
      checked: {
        onlineProvinceName: [],
        orderName: [],
        province: [],
        attachment: [],
        operationType: []
      },
      flag: false
    }
  },
  components: {
    demandDownload,
    testResultDownload,
    testProvince,
    onlineProvince,
    updateRecord,
    lookRecord,
    personInfo,
    updateExplain
  },
  mounted () {
    const savedCheck = JSON.parse(localStorage.getItem('user-checked'))
    if (savedCheck) {
      this.checked = savedCheck
    }
    this.getOrganizeList()
    this.getTestedDataList()
    this.getFiledDataList()
  },
  watch: {

  },
  methods: {
    resetSelectInfo () {
      this.dataForm = {
        contactName: '',
        name: ''
      }
      this.provinceCode = ''
      if (this.activeGroup === '1') {
        this.testedPage = 1
        this.getTestedDataList()
      } else {
        this.filedPage = 1
        this.getFiledDataList()
      }
    },
    convertKey (arr, key) {
      let newArr = []
      let a = 0
      arr.forEach((item, index) => {
        let newObj = {}
        for (var i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newObj['id'] = `${a}`
        newArr.push(newObj)
        a++
      })
      return newArr
    },
    /*
    @params: Array(el-select<object>)
    省份多选选择器更改条件
    */
    provinceHandle (e) {
      var _this = this
      _this.provinceCode = e
    },
    // 获取信息
    getOrganizeList () {
      this.$http.get(`/ctc/plan/CommodityAttachment/provinceSelection`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.organizeList = res.data
      }).catch(() => { })
    },
    getDataList () {
      console.log(this.activeGroup)
      let param = {
        ...this.dataForm

      }
      if (this.provinceCode !== '' && this.provinceCode !== '0') {
        param = {
          ...param,
          provinceCode: this.provinceCode
        }
      }
      if (this.activeGroup === '1') {
        this.testedPage = 1
        this.getTestedDataList(param)
      } else {
        this.filedPage = 1
        this.getFiledDataList(param)
      }
    },
    getTestedDataList (param = {}) {
      this.dataListLoading = true
      let params = { ...param, 'page': this.testedPage, 'limit': this.testedLimit, 'archive': 0 }
      this.$http.get('/ctc/plan/commodityOrderInfo/getAllCommodityOrder', { 'params': params }).then(({ data: res }) => {
        console.log(res)
        res.data = res.data || {}

        if (res.code !== 0) {
          this.testedDataList = []
          this.testedTotal = 0
          this.$message.error(res.msg)
        } else {
          if (res.data.records) {
            this.testedDataList = res.data.records
            this.testedTotal = Number(res.data.total)
          } else {
            this.testedDataList = []
            this.testedTotal = 0
          }
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getFiledDataList (param = {}) {
      this.dataListLoading = true
      let params = { ...param, 'page': this.filedPage, 'limit': this.filedLimit, 'archive': 1 }
      this.$http.get('/ctc/plan/commodityOrderInfo/getAllCommodityOrder', { 'params': params }).then(({ data: res }) => {
        res.data = res.data || {}
        if (res.code !== 0) {
          this.filedDataList = []
          this.filedTotal = 0
          this.$message.error(res.msg)
        } else {
          if (res.data.records) {
            this.filedDataList = res.data.records
            this.filedTotal = Number(res.data.total)
          } else {
            this.filedDataList = []
            this.filedTotal = 0
          }
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    resetBlack (id, text) {
      this.checked[text].push(id)
      localStorage.setItem('user-checked', JSON.stringify(this.checked))
    },
    redNotify (row) {
      if (row.operationType === '11' && row.orderStatus !== 1) {
        return true
      } else {
        return false
      }
    },
    redNotify1 (row, text) {
      // todo
      if (row.operationType === '12' &&
                row.updateRecord.length > 0 &&
                this.checked[text].indexOf(row.orderCode) === -1) {
        if (text === 'operationType') {
          return true
        } else {
          for (let i = 0; i < row.updateRecord.length; i++) {
            if (text === row.updateRecord[i]) {
              return true
            }
          }
        }
      } else {
        return false
      }
    },
    getDemandDownloadList (id) {
      this.showDemandDownload = true
      this.$nextTick(() => {
        this.$refs.demandDownloadRef.dataForm.id = id
        this.$refs.demandDownloadRef.init()
      })
    },
    getTestResultDownloadList (id) {
      this.showTestResultDownload = true
      this.$nextTick(() => {
        this.$refs.testResultDownloadRef.dataForm.id = id
        this.$refs.testResultDownloadRef.init()
      })
    },
    getTestProvince (id) {
      this.showTestProvince = true
      this.$nextTick(() => {
        this.$refs.testProvinceRef.dataForm.id = id
        this.$refs.testProvinceRef.init()
      })
    },
    getOnlineProvince (id) {
      this.showOnlineProvince = true
      this.$nextTick(() => {
        this.$refs.onlineProvinceRef.dataForm.id = id
        this.$refs.onlineProvinceRef.init()
      })
    },
    getPersonInfo (id) {
      this.showPersonInfo = true
      this.$nextTick(() => {
        this.$refs.personInfoRef.dataForm.id = id
        this.$refs.personInfoRef.init()
      })
    },
    getUpdateRecord (row) {
      this.showUpdateRecord = true
      this.$nextTick(() => {
        this.$refs.updateRecordRef.dataForm.id = row.orderCode
        this.$refs.updateRecordRef.init()
      })
    },
    getUpdateExplain (row) {
      this.showUpdateExplain = true
      this.$nextTick(() => {
        this.$refs.updateExplainRef.dataForm.modifyDescription = row.modifyDescription
        this.$refs.updateExplainRef.init()
      })
    },
    getLookRecord (id) {
      this.showLookRecord = true
      this.$nextTick(() => {
        this.$refs.lookRecordRef.dataForm.id = id
        this.$refs.lookRecordRef.init()
      })
    },
    doReceive (value, id) {
      console.log(value, id)
      this.$confirm('确认是否修改接受配置？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃修改'
      })
        .then(() => {
          this.dataListLoading = true
          let params = { 'orderCode': id, 'orderStatus': value }
          this.$http.post('/ctc/plan/commodityOrderInfo/updateOrderStatusAndAddRecord', params, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(({ data: res }) => {
            if (res.code === 0 && res.msg === 'success') {
              this.$message.success('保存修改成功')
              this.getTestedDataList()
            } else {
              this.$message.error('保存修改朽败')
            }
          }).catch(() => {
            this.dataListLoading = false
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '放弃修改'
          })
        })
    },
    doFinish (id) {
      this.dataListLoading = true
      let params = { 'orderCode': id, 'archive': 1 }
      this.$http.post('/ctc/plan/commodityOrderInfo/orderArchive', params, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(({ data: res }) => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('归档成功')
          this.getTestedDataList()
        } else {
          this.$message.error('归档失败')
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    pageTestSizeChangeHandle (val) {
      this.testedLimit = val
      this.getTestedDataList()
    },
    pageTestCurrentChangeHandle (val) {
      this.testedPage = val
      this.getTestedDataList()
    },
    pageFiledSizeChangeHandle (val) {
      this.filedLimit = val
      this.getFiledDataList()
    },
    pageFiledCurrentChangeHandle (val) {
      this.filedPage = val
      this.getFiledDataList()
    },
    cellStyle (row) {
      if ((row.row.operationType === '新增' && row.columnIndex === 1)) {
        return 'color:red'
      }
    }
  }
}
</script>
<style lang="scss" >
.bob{
.red {
  color:red!important;
}
.red1 {
  color:red!important;
}
.table-head {
  font-size: 14px !important;
}
/deep/ .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
  margin: 0 1px;
}
}
</style>
