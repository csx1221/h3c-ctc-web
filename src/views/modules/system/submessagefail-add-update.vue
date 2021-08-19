<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="160px">
      <el-form-item prop="dataSource" label="数据来源">
        <el-select v-model="dataForm.dataSource" filterable placeholder="请选择应用平台">
          <el-option
            v-for="item in applicationSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="businessType" label="业务类型">
        <el-select v-model="dataForm.businessType" filterable placeholder="请选择业务类型">
          <el-option
            v-for="item in optionsBusiness"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="operationType" label="业务操作">
        <el-select v-model="dataForm.operationType" filterable placeholder="请选择业务操作">
          <el-option
            v-for="item in operationSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      dataForm: {
        dataSource: '',
        businessType: '',
        operationType: ''
      },
      operationSelect: [
        {
          value: 0,
          label: '新增'
        },
        {
          value: 1,
          label: '修改'
        },
        {
          value: 2,
          label: '删除'
        },
        {
          value: 3,
          label: '其他'
        }
      ],
      applicationSelect: [
        {
          value: 0,
          label: '集中化平台'
        },
        {
          value: 1,
          label: '集成平台'
        }
      ],
      optionsBusiness: [
        {
          value: 0,
          label: '项目'
        },
        {
          value: 1,
          label: '任务'
        },
        {
          value: 2,
          label: '工单'
        },
        {
          value: 3,
          label: '用例主本'
        },
        {
          value: 4,
          label: '用例副本'
        },
        {
          value: 5,
          label: '参测对象'
        },
        {
          value: 6,
          label: '参测对象成员'
        },
        {
          value: 7,
          label: '项目成员'
        },
        {
          value: 8,
          label: '工单执行人'
        },
        {
          value: 9,
          label: '机构'
        }
      ]
    }
  },
  computed: {
    dataRule () {
      return {
        dataSource: [
          { required: true, message: '请选择应用平台', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'blur' }
        ],
        operationType: [
          { required: true, message: '请求地址业务操作', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
      this.$http.get(`/ctc/servicebus/messagefail/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/servicebus/messagefail', this.dataForm).then(({ data: res }) => {
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
