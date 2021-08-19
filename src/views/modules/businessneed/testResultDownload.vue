<template>
  <el-dialog :visible.sync="visibleDemandDownload" @close="closeToast" width="width: 100%" title="前序测试结果" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" ref="dataForm" label-width="100px">
      <el-row>
          <el-form-item label="省份">
            <el-col :span="8" style="text-align:left">
              <el-select v-model="provinceCode" placeholder="请先选择省份" clearable>
                <el-option
                  v-for="item in organizeList"
                  :key="item.val"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" style="text-align:right">
              <el-button size="small" type="primary" @click="getData">{{ $t('query') }}</el-button>
              <el-button size="small" @click="resetForm">重置</el-button>
              <el-button size="small" type="primary" @click="batchDownload()">批量下载</el-button>
            </el-col>
          </el-form-item>
      </el-row>
    </el-form>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" border style="width: 100%;">
      <el-table-column type="selection" reserve-selection header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="provinceCode" label="省份" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="attachmentName" label="文件名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="160" label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Download(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import ctcUtils from '@/utils/ctc-utils.js'

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
      visibleDemandDownload: false,
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      dataForm: {
        id: ''
      },
      // 索引省份
      provinceCode: '',
      // 省份数据
      organizeList: [],
      fileAttachmentData: [],
      uploadParams: {
        // 下载文件
        downLoadFileUrl: '/ctc/oss/file/download/',
        // 获取已上传文件列表
        showUploadFileUrl: '/ctc/oss/mutiFile/listFiles',
        batchUrl: '/ctc/plan/CommodityAttachment/batchDownload'
      },
      dataListSelections: []
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    // 因为这里的数据是引用类型，并且前面开发时候发现一个数据回显问题导致数据没有更改，此后对状态做了一些更改
    // 以事件是为了能够解决点击回调问题，在本组件中明确使用多选属性，但是，状态被改变了。
    // 更改数组键值key
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
    init () {
      this.visibleDemandDownload = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getDemandDataList(this.dataForm.id)
        }
        this.getOrganizeList()
      })
    },
    closeToast () {
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
    getData () {
      this.getDemandDataList(this.dataForm.id)
    },
    resetForm () {
      this.provinceCode = ''
    },
    getDemandDataList (id) {
      this.dataListLoading = true
      let params = { 'provinceCode': this.provinceCode }
      let requestStr = this.$http.get('/ctc/plan/CommodityTestResult/TestResult/' + id)
      if (this.provinceCode !== '' && this.provinceCode !== '0') {
        requestStr = this.$http.get('/ctc/plan/CommodityTestResult/TestResult' + id, { 'params': params })
      }
      requestStr.then(({ data: res }) => {
        console.log(res)
        this.dataListLoading = false
        if (res.code === 0 && res.data.length > 0) {
          this.dataList = res.data
        } else {
          this.dataList = []
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    batchDownload () {
      let attachmentEntities = []
      this.dataListSelections.forEach(item => {
        let attachmentEntitie = { 'testResultId': item.testResultId, 'provinceCode': item.provinceCode, 'orderCode': item.orderCode, 'recordId': item.recordId }
        attachmentEntities.push(attachmentEntitie)
      })
      let dataDate = ctcUtils.getDynamicDate('s', 'yyyyMMddhhmmss', 0)
      ctcUtils.customExportPost(this.uploadParams.batchUrl, attachmentEntities, '前序测试结果_' + dataDate + '.zip')
    },
    Download (row) {
      let data = {}
      let fileName = row.attachmentName
      let params = { 'recordId': row.recordId }
      this.$http.get(this.uploadParams.showUploadFileUrl, { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.fileAttachmentData = res.data
          let url = this.uploadParams.downLoadFileUrl + this.fileAttachmentData[0].id
          ctcUtils.customExportGet(url, data, fileName)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>
