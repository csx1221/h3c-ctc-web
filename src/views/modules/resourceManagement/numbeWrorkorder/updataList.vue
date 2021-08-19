<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%" class="add-require" append-to-body>
    <el-row>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="手机号码：" prop="number">
            <el-input v-model="dataForm.number" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="IMSI：" prop="imsi">
            <el-input v-model="dataForm.imsi" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="所属平台：" prop="applicationId">
            <!--                        <ctc-select v-model="dataForm.platform" dict-type="platform" placeholder="请选择"></ctc-select>-->
            <ctc-platform-list v-model="dataForm.applicationId" :name.sync="dataForm.platformDefine" :level="'1'" :placeholder="'请选择'"></ctc-platform-list>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="服务密码：" prop="serviceNo">
            <el-input v-model="dataForm.serviceNo" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="所属省份：" prop="province">
            <ctc-province-team v-model="dataForm.province" :name.sync="dataForm.provinceDefine" :level="'1'" :placeholder="'请选择'"></ctc-province-team>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="所属地市：" prop="city">
            <ctc-province-team v-model="dataForm.city" :level="'2'" :name.sync="dataForm.cityDefine" :childrenId="dataForm.province" :placeholder="'请选择'"></ctc-province-team>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="办卡人：" prop="handler">
            <el-input v-model="dataForm.handler" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="品牌：" prop="brand">
            <ctc-select v-model="dataForm.brand" dict-type="brand" placeholder="请选择"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="月度资费：" prop="monthlyFee">
            <el-input v-model="dataForm.monthlyFee" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="余额：" prop="blance">
            <el-input v-model="dataForm.blance" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="积分：" prop="score">
            <el-input v-model="dataForm.score" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
<!--          <el-form-item label="负责人：" prop="owner">-->
<!--            <el-input v-model="dataForm.owner" placeholder="请输入" clearable></el-input>-->
<!--          </el-form-item>-->
          <el-form-item prop="ownerId" label="负责人：">
            <ctc-user-table v-model="dataForm.ownerId" placeholder="请选择负责人" :userName2.sync="dataForm.owner" :userId.sync="dataForm.ownerId" :type="1"></ctc-user-table>
            <el-input v-model="dataForm.ownerId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--          <el-form-item label="负责人联系方式：" prop="contract">-->
<!--            <el-input v-model="dataForm.contract" placeholder="请输入" clearable></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="号码状态：" prop="state">
            <ctc-select v-model="dataForm.state" dict-type="numberStatus" placeholder="请选择"></ctc-select>
          </el-form-item>
        </el-col>
<!--        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--          <el-form-item label="创建人：" prop="creatorName">-->
<!--            <el-input disabled v-model="dataForm.creatorName" placeholder="请输入" clearable></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="备注：" prop="descript">
            <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.descript"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div align="center">
      <el-button type="primary" size="small" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import { isMobile } from '@/utils/validate'
export default {
  name: 'updataList',
  components: {
    CtcProjectOrganizeTable
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
      type: '',
      index: '',
      organId: '',
      dataForm: {
        cardNumberId: '',
        number: '',
        imsi: '',
        platform: '1', // 暂时加上 后面去掉
        state: '', // 暂时加上 后面去掉
        applicationId: '',
        platformDefine: '',
        serviceNo: '',
        province: '',
        provinceDefine: '',
        city: '',
        cityDefine: '',
        handler: '',
        brand: '',
        monthlyFee: '',
        blance: '',
        score: '',
        ownerId: '',
        owner: '',
        contract: '',
        descript: ''
        // creator: this.$store.state.user.id,
        // creatorName: this.$store.state.user.realName
      }
    }
  },
  computed: {
    dataRule () {
      let validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': '手机号码' })))
        }
        callback()
      }
      return {
        number: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        imsi: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        applicationId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        ownerId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        contract: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (title, type, row, index) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.type = type
      this.index = index
      let newData = row
      for (var i in newData) {
        if (newData[i] === null) {
          newData[i] = ''
        }
      }
      this.$nextTick(() => {
        this.dataForm = JSON.parse(JSON.stringify(newData))
      })
    },
    submitResult () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.validateForm('/ctc/resource/activiti/cardnumber/updateCardNumberImport')
          // this.dialogVisible = false
          // this.dataForm.isException = false
          // this.$emit('refresh', this.index, this.dataForm)
        } else {
          return false
        }
      })
    },
    validateForm (url) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      thisvm.$http.post(url, params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 3000 })
        }
        console.log(res.data)
        this.dialogVisible = false
        // this.dataForm.isException = false
        // this.$emit('refresh', this.index, this.dataForm)
        this.$emit('refresh', this.index, res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
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
.isTips{
  color: red;
  margin-bottom: 10px;
  span{
    display: block;
  }
}
</style>
