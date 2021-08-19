<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%" class="add-require" append-to-body>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitResult(dataForm)" status-icon style="">
            <el-form-item prop="captcha">
                <el-row :gutter="20">
                    <el-col :span="10" class="login-captcha">
                        <img :src="captchaPath" @click="getCaptcha()">
                    </el-col>
                    <el-col :span="14">
                        <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true">
                        <use xlink:href="#icon-safetycertificate"></use>
                      </svg>
                    </span>
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <el-row>
            <div align="center">
                <el-button type="primary" size="small" @click="$emit('init')">取消</el-button>
                <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
            </div>
        </el-row>
    </el-dialog>
</template>
<script>
import loginFilter from '../../../utils/login-filter'
export default {
  mixins: [loginFilter],
  name: 'checkCode',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      title: '',
      captchaPath: '',
      dataForm: {
        uuid: '',
        captcha: ''
      },
      parentMenth: ''
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  computed: {
    dataRule () {
      return {
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (title, backMenth) {
      this.dialogVisible = true
      this.title = title
      this.parentMenth = backMenth
      this.getCaptcha()
    },
    submitResult (res) {
      let _this = this
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // this.$emit('init')
          // eval('this.$parent.' + this.parentMenth + '(' + this.dataForm + ')')
          // console.log(_this.$parent)
          _this.$parent.$parent[_this.parentMenth](_this.dataForm)
          // this.$emit('refresh', this.dataForm)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .add-require {
        .selected {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
