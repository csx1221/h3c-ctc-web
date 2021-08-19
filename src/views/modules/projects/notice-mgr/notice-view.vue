<template>
  <el-card shadow="never" class="aui-card--fill">
    <div>
      <hr size=1 color="#ddd" style="margin:5px 0 10px 0;">
      <span><i class="el-icon-user-solid" style="color: #e6444a"></i> 发布人：{{dataForm.creatorName}}</span>
      <el-divider direction="vertical"></el-divider>
      <span><i class="el-icon-time" style="color: #e6444a"></i> 创建时间：{{dataForm.createDate}}</span>
      <el-divider direction="vertical"></el-divider>
      <span><i class="el-icon-time" style="color: #e6444a"></i> 发布时间：{{dataForm.publishTime}}</span>
      <el-divider direction="vertical" style="margin: 0px;padding:0px;"></el-divider>
      <hr size=1 color="#ddd" style="margin:10px 0 30px 0;">
    </div>
    <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">公告标题</span></el-divider>
    <div style="padding-left:120px;font-size: 28px">{{dataForm.title}}</div>
    <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">公告内容</span></el-divider>
    <div v-html="dataForm.content" style="padding-left:120px;"></div>
    <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">附件信息</span></el-divider>
    <el-row>
      <el-col :span="24" style="padding-left:35px;">
        <el-table :data="noticeFileAttaData" stripe border>
          <el-table-column prop="id" label="附件编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileType" label="文件类型" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button @click="handleDownClick(scope.row)" type="text" size="small">{{isImgType(scope.row.fileType)?'预览':'下载'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">项目成员阅读详情</span></el-divider>
    <el-table stripe :data="projectNoticeData" border style="width: 100%;padding-left:35px;">
      <el-table-column prop="userName" label="成员姓名" header-align="center" align="center">
        <template slot-scope="scope">
          <span style="color:#ff0000;font-size:20px;" v-if="$store.state.id==scope.row.userId">★</span>
          <span style="font-size:14px;padding-left:5px;">{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="readStatus" :label="$t('notice.readStatus')" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.readStatus === 0" size="small" type="danger">{{ $t('notice.readStatus0') }}</el-tag>
          <el-tag v-else size="small" type="success">{{ $t('notice.readStatus1') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="readDate" :label="$t('notice.readDate')" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-divider></el-divider>
    <div style="text-align: center;">
      <el-button type="blue" size="small" @click="closeCurrentTab()">{{ $t('notice.close') }}</el-button>
    </div>
    <!--图片放大功能-->
    <ctc-big-img v-if="ctcBigImg" :ctcBigImgSrc="ctcBigImgSrc" @doCloseBigImg="doCloseBigImg"></ctc-big-img>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import ctcUtils from '@/utils/ctc-utils.js'
import { polishingOssHost } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/notice/user/page',
        createdIsNeed: false,
        activatedIsNeed: true,
        getDataListIsPage: true
      },
      dataForm: {
        noticeId: '',
        projectId: '',
        creatorName: '',
        createDate: ''
      },
      projectNoticeData: [],
      noticeFileAttaData: [],
      ctcBigImg: false,
      ctcBigImgSrc: ''
    }
  },
  mounted () {
    this.dataForm.noticeId = this.$route.params.noticeId || ''
    this.dataForm.projectId = this.$route.params.projectId || ''
    this.getNoticeInfo()
  },
  methods: {
    getNoticeInfo () {
      if (this.dataForm.noticeId) {
        this.$http.get('ctc/project/projectNotice/' + this.dataForm.noticeId).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataForm = { ...this.dataForm, ...res.data }
            this.getNoticeFileAttaData()
            this.getNoticeReadInfo()
          }
        }).catch(() => { })
      }
    },
    // 获取缺陷原始附件信息
    getNoticeFileAttaData () {
      let attachmentId = this.dataForm.attachementId
      if (attachmentId !== '' && attachmentId !== undefined && attachmentId !== null) {
        let params = { 'recordId': attachmentId }
        this.$http.get('/ctc/oss/mutiFile/listFiles', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.noticeFileAttaData = res.data
          }
        }).catch(() => {
        })
      }
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
    handleDownClick (item) {
      let thisvm = this
      if (thisvm.isImgType(item.fileType)) {
        thisvm.execImgPreview(item.id, function (data) {
          thisvm.ctcBigImg = true
          thisvm.ctcBigImgSrc = data
        })
      } else {
        let data = {}
        let fileName = item.fileName
        // 特殊处理用例勾选用例，只导出用户勾选用例
        let url = '/ctc/oss/file/download/' + item.id
        ctcUtils.customExportGet(url, data, fileName)
      }
    },
    getImgSrc (item) {
      let imgSrc = ''
      if (item.imgSrc) {
        imgSrc = item.imgSrc
      } else {
        if (this.isImgType(item.fileType)) {
          imgSrc = this.defaultImg
        } else {
          imgSrc = this.defaultFile
        }
      }
      return imgSrc
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
    getNoticeReadInfo () {
      if (this.dataForm.noticeId && this.dataForm.projectId) {
        let params = { 'projectId': this.dataForm.projectId, 'noticeId': this.dataForm.noticeId }
        this.$http.get('/ctc/project/userProjectNoticeRead', { 'params': params }).then(({ data: res }) => {
          this.projectNoticeData = res || []
        }).catch(() => { })
      }
    }
  }
}
</script>
