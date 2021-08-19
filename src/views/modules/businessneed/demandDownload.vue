<template>
  <el-dialog :visible.sync="visibleDemandDownload" @close="closeToast" width="width: 100%" title="需求文件" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-col :span="2" style="text-align: right;">
      <el-button size="small" type="primary" @click="batchDownload()">批量下载</el-button>
    </el-col>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="demandDownloadDataList" @selection-change="dataListSelectionChangeHandle" row-key="getRowKey" border style="width: 100%;">
      <el-table-column type="selection" reserve-selection header-align="center" align="center" width="50"></el-table-column>
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
      visibleDemandDownload: false,
      dataListLoading: false, // 数据列表，loading状态
      demandDownloadDataList: [], // 获取分页列表的数据
      demandDownloadPage: 1,
      demandDownloadLimit: 10,
      demandDownloadTotal: 0,
      dataForm: {
        id: ''
      },
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
  mounted () {
  },
  methods: {
    init () {
      this.visibleDemandDownload = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getDemandDataList(this.dataForm.id)
        }
      })
    },
    closeToast () {
      this.demandDownloadDataList = []
    },
    getDemandDataList (id) {
      this.dataListLoading = true
      this.$http.get('/ctc/plan/CommodityAttachment/selectAttachment/' + id).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code === 0 && res.data.length > 0) {
          this.demandDownloadDataList = res.data
        } else {
          this.demandDownloadDataList = []
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getRowKey (row) {
      return row.id
    },
    batchDownload () {
      let attachmentEntities = []
      this.demandDownloadDataList.forEach(item => {
        let attachmentEntitie = { 'attachmentId': item.attachmentId, 'attachmentName': item.attachmentName, 'orderCode': item.orderCode, 'recordId': item.recordId }
        attachmentEntities.push(attachmentEntitie)
      })
      let dataDate = ctcUtils.getDynamicDate('s', 'yyyyMMddhhmmss', 0)
      ctcUtils.customExportPost(this.uploadParams.batchUrl, attachmentEntities, '需求文件_' + dataDate + '.zip')
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
          ctcUtils.customExportPost(url, data, fileName)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },

    handDealWebDownFile (fileData, data, fileName) {
      document.getElementById('ctc-spin-spinning').style.display = 'none'
      // 组装文件下载名
      let dataDate = ctcUtils.getDynamicDate('s', 'yyyyMMddhhmmss', 0)
      let downfileName = (data.fileName || '文件下载') + '-' + dataDate + '.xls'
      if (fileName) {
        downfileName = fileName
      }
      // 兼容IE浏览器下载
      if ('msSaveOrOpenBlob' in navigator) {
        var blob = new Blob([fileData])
        window.navigator.msSaveOrOpenBlob(blob, downfileName)
      } else {
        let blob = new Blob([fileData])
        let objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.download = downfileName
        link.href = objectUrl
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href) // 释放内存
        document.body.removeChild(link)
      }
    }
  }
}
</script>
