<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="220px">
      <el-form-item prop="applicationId" label="应用系统">
        <el-select v-model="dataForm.applicationId" filterable placeholder="请选择应用">
          <el-option
            v-for="item in selectOptons"
            :key="item.applicationId"
            :label="item.name"
            :value="item.applicationId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type" label="路由字典">
        <el-select v-model="dataForm.type" filterable placeholder="请选择路由字典">
          <el-option
            v-for="item in optionsBusiness"
            :key="item.pid"
            :label="item.bizName"
            :value="item.pid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="requestMethod" label="请求方法">
        <el-select v-model="dataForm.requestMethod" filterable placeholder="请选择请求方法">
          <el-option
            v-for="item in requestOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="opertionType" label="业务操作类型">
        <el-select v-model="dataForm.opertionType" filterable placeholder="请选择业务操作类型">
          <el-option
            v-for="item in OpertionType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item prop="requestUrl" label="请求Url">
        <el-input v-model="dataForm.requestUrl" placeholder="请输入请求地址"></el-input>
      </el-form-item>
      <el-form-item prop="requestParams" label="请求参数">
        <el-input v-model="dataForm.requestParams" placeholder="请输入请求参数"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      selectOptons: [],
      dataForm: {
        opertionType: '',
        requestMethod: '',
        applicationId: '',
        requestUrl: '',
        type: '',
        requestParams: ''
      },
      OpertionType: [
        {
          value: '0',
          label: '新增'
        },
        {
          value: '1',
          label: '修改'
        },
        {
          value: '2',
          label: '删除'
        },
        {
          value: '3',
          label: '推送'
        },
        {
          value: '4',
          label: '其他'
        }
      ],
      requestOptions: [
        {
          value: 'GET',
          label: 'GET'
        },
        {
          value: 'POST',
          label: 'POST'
        },
        {
          value: 'PUT',
          label: 'PUT'
        },
        {
          value: 'DELETE',
          label: 'DELETE'
        },
        {
          value: 'OPTIONS',
          label: 'OPTIONS'
        },
        {
          value: 'CONNECT',
          label: 'CONNECT'
        },
        {
          value: 'TRACE',
          label: 'TRACE'
        },
        {
          value: 'HEAD',
          label: 'HEAD'
        }
      ],
      optionsBusiness: []
    }
  },
  created () {
    this.getSelectAppId()

    this.initRouteDic()
  },
  computed: {
    dataRule () {
      return {
        applicationId: [
          { required: true, message: '请选择应用', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择路由字典', trigger: 'blur' }
        ],
        requestUrl: [
          { required: true, message: '请求地址不能为空', trigger: 'blur' }
        ],
        requestMethod: [
          { required: true, message: '请选择请求方法', trigger: 'blur' }
        ],
        opertionType: [
          { required: true, message: '请选择业务操作类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getSelectAppId () {
      this.dataListLoading = true
      this.$http.get(`/ctc/servicebus/route/getApplications`, {}).then(({ data: res }) => {
        if (res.code === 0) {
          this.selectOptons = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 初始化路由字段
    initRouteDic () {
      this.dataListLoading = true
      this.$http.get(`/ctc/servicebus/routedic/getList`, {}).then(({ data: res }) => {
        if (res.code === 0) {
          this.optionsBusiness = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    init () {
      this.dataForm.applicationId = ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/servicebus/route/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (typeof res.data.opertionType === 'number') {
          this.dataForm.opertionType = res.data.opertionType.toString()
          return this.dataForm
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.status = Number(this.dataForm.status)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/servicebus/route', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
