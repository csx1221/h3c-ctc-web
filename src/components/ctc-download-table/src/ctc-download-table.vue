<template>
  <div class="downTable" :style="{display:(is4A?'inline-block':'block')}">
    <el-button v-if="id!==''&&id!==null&&id!==undefined" @click="openDialog" type="text" :size="is4A?'default':'small'" v-html="is4A?'操作手册':'查看'"></el-button>
    <span v-else></span>
    <el-dialog :visible.sync="visibleDown" width="45%" :modal="false" :title="is4A?'操作手册':'附件'" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table v-loading="dataListLoading" :data="fileAttachmentData" stripe border height="400" style="width: 100%;overflow-y:auto;">
        <el-table-column v-if="!is4A" prop="id" label="附件编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileType" label="文件类型" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDownClick(scope.row)" type="text" size="small">{{isImgType(scope.row.fileType)?'预览':'下载'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--图片放大功能-->
      <ctc-big-img v-if="ctcBigImg" :ctcBigImgSrc="ctcBigImgSrc" @doCloseBigImg="doCloseBigImg"></ctc-big-img>
    </el-dialog>
  </div>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'ctc-download-table',
  data () {
    return {
      visibleDown: false,
      fileAttachmentData: [],
      dataListLoading: false,
      uploadParams: {
        // 下载文件
        downLoadFileUrl: '/ctc/oss/file/download/',
        // 获取已上传文件列表
        showUploadFileUrl: '/ctc/oss/mutiFile/listFiles'
      },
      ctcBigImg: false,
      ctcBigImgSrc: ''
    }
  },
  props: {
    id: [Number, String],
    is4A: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  methods: {
    openDialog () {
      this.visibleDown = true
      if (this.is4A) {
        let newData = []
        let node = {
          fileName: '4A主从账号管理操作手册.docx',
          fileType: 'docx'
        }
        newData.push(node)
        this.fileAttachmentData = newData
      } else {
        this.getData(this.id)
      }
    },
    // 附近回显
    getData (attachmentId) {
      if (attachmentId !== '' && attachmentId !== undefined) {
        this.dataListLoading = true
        // 设置附件id回显
        let params = { 'recordId': attachmentId }
        this.$http.get(this.uploadParams.showUploadFileUrl, { 'params': params }).then(({ data: res }) => {
          this.dataListLoading = false
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.fileAttachmentData = res.data
          }
        }).catch(() => {
          this.dataListLoading = false
        })
      }
    },
    handleDownClick (row) {
      let thisvm = this
      if (thisvm.isImgType(row.fileType)) {
        thisvm.execImgPreview(row.id, function (data) {
          thisvm.ctcBigImg = true
          thisvm.ctcBigImgSrc = data
        })
      } else {
        if (this.is4A) {
          this.returnUrl()
        } else {
          let data = {}
          let fileName = row.fileName
          // 特殊处理用例勾选用例，只导出用户勾选用例
          let url = this.uploadParams.downLoadFileUrl + row.id
          ctcUtils.customExportGet(url, data, fileName)
        }
      }
    },
    // 验证文件是否是图片类型
    isImgType (fileType) {
      let bool = false
      let tfileType = (fileType || '').replace('.', '')
      if (['jpeg', 'jpg', 'png', 'gif', 'bmp'].includes(tfileType.toLowerCase())) {
        bool = true
      }
      return bool
    },
    doCloseBigImg () {
      this.ctcBigImg = false
    },
    execImgPreview (id, callback) {
      this.$http.get('/ctc/oss/file/photo/path/' + id).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let picUrl = polishingOssHost(res.data)
          callback && callback(picUrl)
        }
      }).catch((res) => { })
    },
    returnUrl () {
      this.$http.get('/account4a/home/register/acct/attarAddr').then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let url = res.data
          if (url) {
            ctcUtils.customExportPostRemove(url, '4A主从账号管理操作手册')
          }
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
.downTable {
  .el-dialog__header {
    text-align: left;
  }
}
</style>
