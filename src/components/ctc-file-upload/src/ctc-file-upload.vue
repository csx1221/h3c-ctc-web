<template>
  <el-row :gutter="0" class="file-upload-data">
    <el-col :span="24" v-if="deFaultUploadParams.isShowUpload">
      <div :class="['upload',{'isDisabled':disabled}]">
        <div class="upload_warp">
          <div class="upload_warp_left" @click="fileClick">
            <img src="../../../assets/img/upload.png">
          </div>
          <div class="upload_warp_right" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
            或者将文件拖到此处
          </div>
          <div class="upload_warp_button">
            <el-col :span="12">
              <el-button type="primary" size="small" @click="doFileUploadAction()">上传</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="into" size="small" @click="doFileClearAction">清空</el-button>
            </el-col>
          </div>
        </div>
        <div class="upload_warp_text">
          选中 {{imgList.length}} 张文件 ，
          共 {{bytesToSize(this.size)}} ，
          目前还可上传<span style="color:#d22b3b;font-size:18px;font-weight:bold;"> {{this.limit}} </span>个文件
          <span v-if="deFaultUploadParams.checkFileSize>0" style="padding-left:20px;">最大允许上传【{{bytesToSize(deFaultUploadParams.checkFileSize)}}】文件</span>
        </div>
        <div class="upload_warp_text" v-if="deFaultUploadParams.checkFileType.length>0">
          <span>仅支持【{{deFaultUploadParams.checkFileType.join('，')}}】文件上传</span>
        </div>
        <el-input :value="value" style="display: none"></el-input>
        <input @change="fileChange($event)" type="file" :id="'upload_file_'+uniqueId" multiple style="display: none" />
        <div class="upload_warp_img" v-show="imgList.length!=0">
          <div class="upload_warp_img_div" v-for="(item,index) in imgList" v-dragging="{ item: item, list: imgList, group: 'color' }" :key="index">
            <div class="upload_warp_img_div_top">
              <div class="upload_warp_img_div_text">
                {{item.file.name}}
              </div>
              <img src="../../../assets/img/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
            </div>
            <img :src="item.file.src">
          </div>
        </div>
        <div class="upload-file-list">
          <div v-for="(item,index) in imgList" :key="index">
            {{index+1}}：{{item.file.name}}
          </div>
        </div>
        <div class="disabled"></div>
      </div>
    </el-col>
    <el-col :span="24" :style="getTableStyle()">
      <el-table :data="fileAttachmentData" stripe border>
        <el-table-column prop="id" label="附件编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileType" label="文件类型" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileSize" label="文件大小" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{bytesToSize(Number(scope.row.fileSize))}}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDownClick(scope.row)" type="text" size="small">下载</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import ctcUtils from '@/utils/ctc-utils.js'
import md5 from 'js-md5'
export default {
  name: 'CtcFileUpload',
  props: {
    value: [Number, String],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uniqueId: Math.random(),
      // 默认上传参数
      deFaultUploadParams: {
        // 支持最大上传文件数量
        maxCount: 100,
        // 支持校验上传文件类型
        checkFileType: ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', 'jpeg', '.zip', '.rar', '.mp4'],
        // 支持校验上传文件大小(单位:字节,默认不强制)
        checkFileSize: 104857600,
        // 是否显示上传组件
        isShowUpload: true,
        // 附件表格高度
        tableHeight: '250px'
      },
      // 自定义上传参数
      customUploadParams: {
      },
      uploadParams: {
        // 文件上传地址
        uploadUrl: '/ctc/oss/mutiFile/uploads',
        // 获取已上传文件列表
        showUploadFileUrl: '/ctc/oss/mutiFile/listFiles',
        // 下载文件
        downLoadFileUrl: '/ctc/oss/file/download/',
        // 删除文件
        deleteFileUrl: '/ctc/oss/mutiFile/delete/',
        attachmentId: ''
      },
      fileAttachmentData: [
      ],
      imgList: [],
      size: 0,
      // 最大可上传数量,undefined:表示不限制
      maxlimit: 0,
      limit: 0
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        // 特殊处理校验文件格式
        if (this.customUploadParams.checkFileType && this.customUploadParams.checkFileType.length === 0) {
          delete this.customUploadParams['checkFileType']
        }
        // 合并自定义参数
        this.deFaultUploadParams = { ...this.deFaultUploadParams, ...this.customUploadParams }
        this.maxlimit = this.deFaultUploadParams.maxCount
        this.limit = this.deFaultUploadParams.maxCount
        this.doFileClearAction()
      })
    },
    // 附近回显
    echoInit (attachmentId) {
      if (attachmentId !== '' && attachmentId !== undefined && attachmentId !== null) {
        // 设置附件id回显
        this.uploadParams.attachmentId = attachmentId
        let params = { 'recordId': attachmentId }
        this.$http.get(this.uploadParams.showUploadFileUrl, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.fileAttachmentData = res.data
            let fileSize = 0
            this.fileAttachmentData.forEach((item, index) => {
              fileSize += Number(item.fileSize)
            })
            this.size = this.size + fileSize
            // 设置可上传文件个数
            this.limit = this.maxlimit - (this.imgList.length + this.fileAttachmentData.length)
          }
        }).catch(() => {
        })
      } else {
        this.fileAttachmentData = []
        this.uploadParams.attachmentId = ''
      }
    },
    getTableStyle () {
      let style = { 'width': '100%', 'margin-top': '10px', 'overflow-y': 'auto', 'height': this.deFaultUploadParams.tableHeight }
      if (this.fileAttachmentData.length === 0) {
        style.display = 'none'
      }
      return style
    },
    fileClick () {
      let id = 'upload_file_' + this.uniqueId
      document.getElementById(id).click()
    },
    fileChange (el) {
      if (el.target.files[0].size <= 0) {
        this.$message.warning('空文件不允许上传！')
        return
      }
      this.fileList(el.target)
      el.target.value = ''
    },
    fileList (fileList) {
      let files = fileList.files
      for (let i = 0; i < files.length; i++) {
        // 判断是否为文件夹,特殊处理zip、rar压缩包
        let fileItem = files[i]
        let fileName = fileItem.name
        let postfixName = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
        // 判断是文件夹、还是文件
        let isFolders = true
        if (fileItem.type) {
          isFolders = false
        } else {
          if (postfixName.indexOf('.') !== -1) {
            isFolders = false
          } else {
            isFolders = true
          }
        }
        if (isFolders) {
          // 文件夹处理
          this.folders(fileList.items[i])
        } else {
          if (this.checkAddFile(fileItem)) {
            this.fileAdd(fileItem)
          } else {
            return
          }
        }
      }
    },
    // 文件夹处理
    folders (files) {
      let _this = this
      // 判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry()
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            if (_this.checkAddFile(file[i])) {
              _this.foldersAdd(file[i])
            } else {
              return
            }
          } else {
            _this.folders(file[i])
          }
        }
      })
    },
    foldersAdd (entry) {
      let _this = this
      entry.file(function (file) {
        _this.fileAdd(file)
      })
    },
    // 校验添加的文件
    checkAddFile (file) {
      let resBool = true
      let tfile = file
      // 判断是否满足指定文件格式
      let fileName = tfile.name
      let postfixName = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
      let checkFileType = this.deFaultUploadParams.checkFileType || []
      // 判断是否超过最大上传文件个数
      if (resBool && this.limit !== undefined && this.limit <= 0) {
        this.$message.warning('已超过最大上传文件个数！')
        resBool = false
      }
      // 判断上传文件格式
      if (resBool && checkFileType.length > 0 && !checkFileType.includes(postfixName.toLowerCase())) {
        this.$message.warning('文件格式不符合规范，仅支持【' + checkFileType.join('，') + '】上传')
        resBool = false
      }
      // 判断上传文件大小
      let checkFileSize = this.deFaultUploadParams.checkFileSize || -1
      let sumFileSize = this.size + file.size
      if (resBool && checkFileSize > 0 && sumFileSize > checkFileSize) {
        this.$message.warning('最大允许上传【' + this.bytesToSize(checkFileSize) + '】')
        resBool = false
      }
      if (resBool) {
        if (this.limit !== undefined) {
          this.limit--
        }
      }
      return resBool
    },
    fileAdd (file) {
      // 总大小
      this.size = this.size + file.size
      // 判断是否为图片文件
      if (file.type.indexOf('image') === -1) {
        file.src = require('../../../assets/img/wenjian.png')
        this.imgList.push({
          file
        })
      } else {
        let reader = new FileReader()
        let image = new Image()
        let _this = this
        reader.readAsDataURL(file)
        reader.onload = function () {
          file.src = this.result
          image.onload = function () {
            let width = image.width
            let height = image.height
            file.width = width
            file.height = height
            _this.imgList.push({
              file
            })
          }
          image.src = file.src
        }
      }
    },
    fileDel (index) {
      this.size = this.size - this.imgList[index].file.size // 总大小
      this.imgList.splice(index, 1)
      if (this.limit !== undefined) {
        this.limit = this.maxlimit - (this.imgList.length + this.fileAttachmentData.length)
      }
    },
    bytesToSize (bytes) {
      if (bytes === 0) {
        return '0B'
      }
      let fileSize = parseFloat(bytes)
      let unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = Math.floor(Math.log(fileSize) / Math.log(1024))
      let size = fileSize / Math.pow(1024, index)
      // 保留的小数位数
      size = size.toFixed(2)
      return size + unitArr[index]
    },
    dragenter (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    dragover (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    drop (el) {
      el.stopPropagation()
      el.preventDefault()
      this.fileList(el.dataTransfer)
    },
    doFileClearAction () {
      this.imgList = []
      let fileSize = 0
      this.fileAttachmentData.forEach((item, index) => {
        fileSize += Number(item.fileSize)
      })
      this.size = fileSize
    },
    // 获取加密排位
    getPaiWei () {
      let convData = ''
      // 进行md5秘钥加密(token+userId+param)
      let token = Cookies.get('token') || ''
      let url = this.uploadParams.uploadUrl
      let secretKey = token + '|' + url + '|' + convData
      let paiWeiMap = { 'panWei': md5(secretKey) }
      return paiWeiMap
    },
    // 支持自动触发上传
    doFileUploadAction (callback) {
      try {
        if (this.imgList.length > 0) {
          // 拼接多个文件参数
          let fd = new FormData()
          // 附件回显追加
          fd.append('recordId', this.uploadParams.attachmentId)
          this.imgList.forEach((item, index) => {
            fd.append('files', item.file)
          })
          this.$ctcLoading.open()
          let paiWeiMap = this.getPaiWei()
          let url = `${window.SITE_CONFIG['apiURL']}${this.uploadParams.uploadUrl}?token=` + Cookies.get('token')
          let xhr = new XMLHttpRequest()
          xhr.open('POST', url, true)
          xhr.setRequestHeader('panWei', paiWeiMap.panWei)
          xhr.send(fd)
          xhr.onload = () => {
            this.$ctcLoading.close()
            if (xhr.status === 200) {
              let res = JSON.parse(xhr.responseText)
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$emit('input', res.data)
                this.doFileClearAction()
                this.echoInit(res.data)
                if (callback) {
                  callback && callback(res.data)
                } else {
                  this.$message.success('上传成功！')
                }
              }
            } else {
              this.$message.error('上传失败！')
            }
          }
        } else {
          if (callback) {
            callback && callback()
          } else {
            this.$message.warning('请选择要上传文件！')
          }
        }
      } catch (error) {
        this.$ctcLoading.close()
        console.error('upload file err:', error)
      }
    },
    // 获取文件下载列表
    getFileAttachmentData () {
    },
    handleDownClick (row) {
      let data = {}
      let fileName = row.fileName
      // 特殊处理用例勾选用例，只导出用户勾选用例
      let url = this.uploadParams.downLoadFileUrl + row.id
      ctcUtils.customExportGet(url, data, fileName)
    },
    handleDeleteClick (row) {
      this.$http.delete(this.uploadParams.deleteFileUrl + row.id).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.echoInit(this.uploadParams.attachmentId)
        }
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss">
.file-upload-data {
  .upload_warp_img_div_del {
    position: absolute;
    top: 6px;
    width: 16px;
    right: 4px;
  }
  .upload_warp_img_div_top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.4);
    line-height: 30px;
    text-align: left;
    color: #fff;
    font-size: 12px;
    text-indent: 4px;
  }

  .upload_warp_img_div_text {
    white-space: nowrap;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .upload_warp_img_div img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }

  .upload_warp_img_div {
    position: relative;
    height: 100px;
    width: 120px;
    border: 1px solid #ccc;
    margin: 0px 30px 10px 0px;
    float: left;
    line-height: 100px;
    display: table-cell;
    text-align: center;
    background-color: #eee;
    cursor: pointer;
  }

  .upload_warp_img {
    max-height: 350px;
    overflow-y: auto;
    border-top: 1px solid #d2d2d2;
    padding: 14px 0 0 14px;
  }

  .upload_warp_text {
    text-align: left;
    text-indent: 14px;
    border-top: 1px solid #ccc;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
  }

  .upload_warp_left {
    float: left;
    width: 35%;
    height: 100%;
    border: 1px dashed #999;
    border-radius: 4px;
    cursor: pointer;
    img {
      margin-top: 10px;
      margin-left: 45%;
      width: 30px;
      height: 30px;
    }
  }

  .upload_warp_right {
    float: left;
    width: 45%;
    margin-left: 1%;
    height: 100%;
    border: 1px dashed #999;
    border-radius: 4px;
    line-height: 48px;
    color: #999;
    text-align: center;
  }

  .upload_warp_button {
    float: left;
    width: 17%;
    margin-left: 1%;
    height: 100%;
    border: 1px dashed #999;
    border-radius: 4px;
    cursor: pointer;
    .el-col {
      text-align: center;
      padding-top: 6px;
    }
  }

  .upload_warp {
    margin: 14px;
    height: 50px;
  }

  .upload {
    border: 1px solid #ccc;
    background-color: #fff;
    width: 100%;
    min-width: 650px;
    border-radius: 4px;
    .disabled {
      display: none;
    }
  }
  .isDisabled {
    position: relative;
    .disabled {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: not-allowed;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .upload-file-list {
    max-height: 150px;
    margin-top: 5px;
    padding-left: 10px;
    overflow-y: auto;
    display: none;
    div {
      float: left;
      margin: 5px;
      padding: 0px 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
}
</style>
