<template>
    <el-row class="project-mgr-page account-4a noLoginForm">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item prop="type" label="机构类型：">
                            <el-select v-model="dataForm.type" placeholder="请选择机构类型" @change="organizeTypeChange">
                                <el-option v-for="data in organizeTypeList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue" :disabled="data.disabled">{{data.dictLabel}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item prop="name" label="机构名称：">
                            <el-input v-model="dataForm.name" type="text" placeholder="请输入机构名称">
                                <span slot="append">{{dataForm.serviceOrganizeName}}</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item v-if="validServiceOrganizeShow()" prop="serviceOrganizeId" :label="servOrganizeLabel">
                            <el-select v-model="dataForm.serviceOrganizeId" :placeholder="servOrganizePlaceHolder" clearable filterable>
                                <el-option v-for="(item,index) in serviceOrganizeData" :key="index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item prop="abbreviatedName" label="机构简称：">
                            <el-input v-model="dataForm.abbreviatedName" placeholder="请输入机构简称(只支持英文)" :change="checkAbbreviated()"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item prop="regionId" label="所属区域：">
                            <el-select v-model="dataForm.regionId" placeholder="请选择所属区域" clearable filterable>
                                <el-option v-for="(item,index) in regionData" :key="index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
<!--                <template>-->
<!--                    <el-button @click="visible = false">{{ $t('cancel') }}</el-button>-->
<!--                    <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>-->
<!--                </template>-->
            </el-card>
        </el-col>
    </el-row>
</template>
<script>
import { getDictDataList } from '@/utils'
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      // 过滤机构集团类型
      organizeTypeList: getDictDataList('organizeType').filter(function (item) {
        if (item.dictValue === '0' || item.dictValue === '2') {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      }),
      regionData: [],
      serviceOrganizeData: [],
      servOrganizeLabel: '归属机构：',
      servOrganizePlaceHolder: '请选择归属机构',
      isAppendName: true, // 是否追加服务对象
      dataForm: {
        regionId: '',
        id: '',
        type: '',
        name: '',
        abbreviatedName: '',
        remark: '',
        // 归属机构
        ascriptionOrganizeId: '',
        // 服务对象
        serviceOrganizeId: '',
        serviceOrganizeName: ''
      }
    }
  },
  props: {
    data: Object
  },
  watch: {
    // 监控机构名称是否改变
    'dataForm.name' (newVal, oldVal) {
      this.autoFillOrganizeName()
    },
    // 监控服务机构是否改变
    'dataForm.serviceOrganizeId' (newVal, oldVal) {
      this.autoFillOrganizeName()
    },
    'dataForm': {
      handler: function (newVal) {
        this.$emit('update:data', newVal)
      },
      // 开启深度监听：只要obj中的任何一个属性发生改变，都会触发相应的代码
      deep: true
    }
  },
  computed: {
    dataRule () {
      return {
        regionId: [
          { required: true, message: '所属区域不允许为空', trigger: 'blur' },
          { required: true, message: '所属区域不允许为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '机构名称不允许为空', trigger: 'blur' },
          { required: true, message: '机构名称不允许为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '机构类型不允许为空', trigger: 'blur' },
          { required: true, message: '机构类型不允许为空', trigger: 'change' }
        ],
        abbreviatedName: [
          { required: true, message: '机构简称不允许为空', trigger: 'blur' },
          { required: true, message: '机构简称不允许为空', trigger: 'change' }
        ],
        serviceOrganizeId: [
          { required: true, message: '不允许为空', trigger: 'blur' },
          { required: true, message: '不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getRegionData()
  },
  methods: {
    init (res) {
      this.$nextTick(() => {
        this.isAppendName = true
        this.dataForm.serviceOrganizeName = ''
        this.$refs['dataForm'].resetFields()
        // this.getRegionData()
        // if (this.dataForm.id !== '' && this.dataForm.id !== undefined) {
        //   this.getOrganizeInfo(this.dataForm.id)
        // }

        this.dataForm.type = res.type + ''
        this.dataForm.name = res.name
        this.dataForm.abbreviatedName = res.abbreviatedName
        this.dataForm.regionId = res.regionId
        // this.dataForm.remark = res.data.remark
        this.dataForm.serviceOrganizeId = res.serviceOrganizeId
        // 设置机构服务对象
        this.getServiceOrganizeData()
      })
    },
    // 自动填充机构名称
    autoFillOrganizeName () {
      // 判断是否追加服务对象
      if (this.isAppendName) {
        let organizeName = this.dataForm.name
        let serviceOrganizeId = this.dataForm.serviceOrganizeId
        let bool = ['4', '5'].includes(this.dataForm.type)
        // 4:第三方机构;5:集成商或其他合作厂商
        if (organizeName !== '' && serviceOrganizeId !== '' && bool) {
          this.serviceOrganizeData.forEach((item, index) => {
            if (item.id === serviceOrganizeId) {
              let name = '(' + item.name + ')'
              this.dataForm.name = this.dataForm.name.replace(name, '')
              this.dataForm.serviceOrganizeName = name
            }
          })
        }
      }
    },
    getOrganizeInfo (id) {
      this.$http.get(`/sys/organize/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm.type = res.data.type + ''
          this.dataForm.name = res.data.name
          this.dataForm.abbreviatedName = res.data.abbreviatedName
          this.dataForm.regionId = res.data.regionId
          this.dataForm.remark = res.data.remark
          this.dataForm.serviceOrganizeId = res.data.serviceOrganizeId
          // 设置机构服务对象
          this.getServiceOrganizeData()
        }
      }).catch(() => { })
    },
    getRegionData () {
      this.$http.get('/sys/region/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.regionData = res.data
        }
      }).catch(() => { })
    },
    checkAbbreviated () {
      this.dataForm.abbreviatedName = this.dataForm.abbreviatedName.replace(/[^a-zA-Z]/g, '')
    },
    // 判断是否显示服务对象
    validServiceOrganizeShow () {
      let bool = false
      // 3:地市公司;4:第三方机构;5:集成商或其他合作厂商
      if (['3', '4', '5'].includes(this.dataForm.type) || (this.dataForm.serviceOrganizeId !== '' && this.dataForm.serviceOrganizeId !== null)) {
        bool = true
      }
      return bool
    },
    organizeTypeChange (type) {
      this.getServiceOrganizeData()
    },
    // 获取服务对象
    getServiceOrganizeData () {
      let organizeType = ''
      if (this.dataForm.type === '3') {
        organizeType = '2'
        this.servOrganizeLabel = '归属机构：'
        this.servOrganizePlaceHolder = '请选择归属机构'
        console.log('归属机构')
      } else {
        organizeType = '0,1,2'
        this.servOrganizeLabel = '服务对象：'
        this.servOrganizePlaceHolder = '请选择服务对象'
        console.log('服务对象')
      }
      if (organizeType !== '') {
        this.$http.get('/sys/organize/page', {
          params: {
            organizeTypes: organizeType, page: 1, limit: 999999
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.serviceOrganizeData = res.data.list
        }).catch(() => { })
      }
    },
    submit (callback) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (callback) {
            callback && callback()
          }
        } else {
          return false
        }
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isAppendName = false
        // 特殊处理归属平台
        this.dataForm.ascriptionOrganizeId = this.dataForm.serviceOrganizeId || ''
        // 特殊处理服务对象名称
        let name = this.dataForm.name
        let serviceOrganizeName = this.dataForm.serviceOrganizeName
        var reg = new RegExp(serviceOrganizeName, 'gm')
        name = name.replace(reg, '')
        this.dataForm.name = name + serviceOrganizeName
        // 新增：post;修改：put
        this.$http[!this.dataForm.id ? 'post' : 'put']('sys/organize55', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style  lang="scss">
    .organize-add-or-update {
        .el-select,
        .el-date-editor {
            width: 100%;
        }
    }
    .noLoginForm{
        .el-form-item{
            margin-bottom: 22px!important;
        }
    }
</style>
