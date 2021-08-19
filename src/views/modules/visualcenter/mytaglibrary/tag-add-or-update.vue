<template>
  <el-dialog :visible.sync="visible" @close="closeToast" width="88%" :title="!dataForm.id ? $t('add') : $t('update')" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="220px">
      <el-form-item prop="labelName" label="标签名字">
        <el-input v-model="dataForm.labelName" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item label="内容统计">
        <el-button type="primary" size="small" @click="tagEditListHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :header-cell-style="getRowClass" max-height="500" v-loading="dataListLoading" :data="dataForm.projectBaseinfoDtos" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column label="序号" width="55" type="index" header-align="center" align="center"></el-table-column>
          <el-table-column :render-header="resetTableHead" prop="name" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column :render-header="resetTableHead" prop="projectStatus" label="项目状态" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text">{{ $getDictLabel('project.projectStatus',scope.row.projectStatus) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="项目范围" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{ $getDictLabel('project.scope', scope.row.scope) }}</template>
          </el-table-column>
          <el-table-column :render-header="resetTableHead" prop="organizeName" label="参测省份/机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column :render-header="resetTableHead" prop="participantCount" label="参测对象(数量)" header-align="center" align="center"></el-table-column>
          <el-table-column :render-header="resetTableHead" prop="planCyle" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteRow(scope.row.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="display: flex;justify-content: center;align-items: center;">
        <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" @click="dataFormSubmitHandle()">保存</el-button>
      </el-form-item>
    </el-form>
    <addListModule v-if="tagEditList" ref="tagEditListRef" @ListChangeHandle="getListParams"></addListModule>
  </el-dialog>
</template>

<script>
import addListModule from '@/views/modules/visualcenter/mytaglibrary/addListComponent'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import debounce from 'lodash/debounce'
export default {
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false
      },
      visible: false,
      dataForm: {
        id: '',
        pid: '',
        labelName: '',
        remark: '',
        status: '0'
      }
    }
  },
  components: {
    addListModule
  },
  computed: {
    dataRule () {
      return {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.dataForm.projectBaseinfoDtos = []
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        } else {
          this.dataForm.remark = ''
          this.dataForm.labelName = ''
          this.dataForm.projectBaseinfoDtos = []
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/project/projectLabel/getLabelById/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = { ...this.dataForm, ...res.data }
      }).catch(() => { })
    },
    // 去重方法
    _uniqueHandle (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.name) && res.set(arr.name, 1))
    },
    // 本地对调用的数据进行去重
    getListParams (val) {
      if (val.length > 0) {
        this.$nextTick(() => {
          this.dataForm.projectBaseinfoDtos.push.apply(this.dataForm.projectBaseinfoDtos, val)
          this.dataForm.projectBaseinfoDtos = this._uniqueHandle(this.dataForm.projectBaseinfoDtos)
        })
      }
    },
    // 移除方法
    deleteRow (val) {
      this.dataForm.projectBaseinfoDtos.splice(val, 1)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.status = Number(this.dataForm.status)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/ctc/project/projectLabel/save' : '/ctc/project/projectLabel/updateLabel', this.dataForm).then(({ data: res }) => {
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
    }, 1000, { 'leading': true, 'trailing': false }),
    closeToast () {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
