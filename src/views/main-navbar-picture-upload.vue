<template>
  <el-dialog :visible.sync="visible" title="头像上传" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
    <div class="cropper-content">
      <div class="cropper">
        <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :fixed="true" :fixedNumber="[1,1]" :full="option.full" :centerBox="true" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :fixedBox="option.fixedBox" @realTime="realTime" />
      </div>
    </div>
    <template slot="footer">
      <el-button icon="el-icon-upload" @click="clickInput">选择图片</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <input type="file" class="uploads" id="upload_file" accept="image/*" @change="uploadImg($event)" hidden>
  </el-dialog>
</template>

<script>
// import Cookies from 'js-cookie'
import { VueCropper } from 'vue-cropper'
import Cookies from 'js-cookie'
import { polishingOssHost } from '@/utils/validate'
import md5 from 'js-md5'
export default {
  name: 'main-navbar-picture-upload',
  components: {
    VueCropper
  },
  data () {
    return {
      visible: false,
      list: {},
      uploadParams: {
        // 文件上传地址
        uploadUrl: '/ctc/oss/file/upload'
        // /ctc/oss/mutiFile/uploads
      },
      headImg: '',
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: false,
        autoCrop: true,
        fixedBox: true
      },
      fileName: '' // 本机文件地址
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (list) {
      this.visible = true
      this.list = list
    },
    clickInput () {
      document.getElementById('upload_file').click()
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
    dataFormSubmitHandle () {
      let _this = this
      if (_this.option.img) {
        let formData = new FormData()
        // 输出
        this.$refs.cropper.getCropBlob(data => {
          this.$ctcLoading.open()
          // let img = window.URL.createObjectURL(data)
          formData.append('file', data, this.fileName)
          let paiWeiMap = this.getPaiWei()
          let url = `${window.SITE_CONFIG['apiURL']}${this.uploadParams.uploadUrl}?token=` + Cookies.get('token')
          var xhr = new XMLHttpRequest()
          xhr.open('POST', url, true)
          xhr.setRequestHeader('panWei', paiWeiMap.panWei)
          xhr.send(formData)
          xhr.onload = () => {
            if (xhr.status === 200) {
              var res = JSON.parse(xhr.responseText)
              if (res.code !== 0) {
                this.$ctcLoading.close()
                this.$message.error(res.msg)
              } else {
                // this.submitPic(res.data)
                this.backPicUrl(res.data)
              }
            } else {
              this.$ctcLoading.close()
              this.$message.error('上传失败！')
            }
          }
        })
      } else {
        _this.$message.warning('请选择需要上传的头像')
      }
    },
    backPicUrl (attachementId) {
      this.$http.get(`/ctc/oss/file/photo/path/${attachementId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$ctcLoading.close()
          this.$message.error(res.msg)
        } else {
          this.submitPic(attachementId, res.data)
        }
      }).catch((res) => {
        this.$ctcLoading.close()
      })
    },
    submitPic (attachementId, picUrl) {
      let parmas = {}
      parmas.id = this.list.id
      parmas.headUrl = attachementId
      this.$http.put('/sys/user/base', { ...parmas }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('上传成功')
          this.$store.state.user.headUrl = polishingOssHost(picUrl)
          this.visible = false
          this.$emit('refresh')
        }
      }).catch((res) => {
        this.$ctcLoading.close()
      })
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 选择本地图片
    uploadImg (event) {
      var _this = this
      // 上传图片
      var file = event.target.files[0]
      _this.fileName = file.name
      if (!/\.(jpeg|jpg|png)$/.test(event.target.value.toLowerCase())) {
        _this.$message.warning('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        _this.option.img = data
        event.target.value = '' // 避免每次选择同样的文件时，input @change 方法不执行问题
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    }
  }
}
</script>

<style lang="scss">
//改变背景色
.cropper-box {
  background: #333 !important;
}
//使截图框变为圆形
.cropper-crop-box {
  overflow: hidden;
  border-radius: 50% !important;
}
//截图相关样式
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  height: 315px;
  width: 100%;
  .cropper {
    width: 100%;
    height: 100%;
    /*position: absolute;*/
  }

  /*.show-preview {*/
  /*    flex: 1;*/
  /*    -webkit-flex: 1;*/
  /*    display: flex;*/
  /*    display: -webkit-flex;*/
  /*    justify-content: center;*/
  /*    -webkit-justify-content: center;*/

  /*    .preview {*/
  /*        overflow: hidden;*/
  /*        border-radius: 50%;*/
  /*        border: 1px solid #cccccc;*/
  /*        background: #cccccc;*/
  /*        margin-left: 40px;*/
  /*    }*/
  /*}*/
}
</style>
