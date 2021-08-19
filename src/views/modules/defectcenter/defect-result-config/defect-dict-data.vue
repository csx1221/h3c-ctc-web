<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-divider content-position="left">
      <span style="color:#26c6da;font-size:15px;">待选区域</span>
      <span style="color:#4190f7;font-size:15px;" v-if="dictType=='defectSource'">（如果未关联平台，则这里不展示，新增缺陷时默认为 “执行中心”，这里只展示关联的自动化平台）</span>
    </el-divider>
    <el-row>
      <el-col :span="24" style="padding-left:35px;">
        <el-checkbox v-model="defectConfCheckAll" @change="defectConfCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="defectConf">
          <el-checkbox v-for="(item,index) in defectConfData" :label="item" :key="index">{{item.dictLabel}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button type="primary" size="small" @click="doSaveDefectConfInfo()">保存</el-button>
      </el-col>
    </el-row>
    <el-divider content-position="left">
      <span style="color:#26c6da;font-size:15px;">已选区域</span>
      <span style="color:#4190f7;font-size:15px;" v-if="dictType=='defectType'">（请在选好的缺陷类型基础上，点击字典标签，进行对应的问题类型配置）</span>
    </el-divider>
    <el-col :span="24" style="padding-left:35px;">
      <el-table stripe highlight-current-row :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" height="600px" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="dictType" label="字典类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="dictValue" :label="$t('dict.dictValue')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="dictLabel" :label="$t('dict.dictLabel')" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="dictType=='defectType'" @click="childHandle('缺陷问题类型配置','questionType',scope.row)">{{ scope.row.dictLabel }}</el-button>
            <span v-else>{{ scope.row.dictLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-card>
</template>
<script>
import { addDynamicRoute } from '@/router'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/ctc/defect/defectConfInfo/getDefectConfInfo',
        getDataListIsPage: false,
        deleteURL: '/ctc/defect/defectConfInfo/deleteDefectConfInfo',
        deleteIsBatch: true
      },
      dataForm: {
        isAutoFill: false,
        parentId: '',
        projectId: '',
        dictType: '',
        dictLabel: '',
        dictValue: ''
      },
      dictType: '',
      defectConfCheckAll: false,
      defectConf: [],
      defectConfData: []
    }
  },
  components: {
  },
  created () {
    this.dataForm.parentId = this.$route.params.parentId || ''
    this.dataForm.projectId = this.$route.params.projectId || ''
    this.dataForm.dictType = this.$route.params.dictType || ''
    this.dictType = this.$route.params.dictType || ''
    this.getDefectConfSourceData()
    this.getDataList()
  },
  methods: {
    getDefectConfSourceData () {
      // 判断是否是子项目
      if (this.dataForm.parentId) {
        this.getParentProjectConfData()
      } else {
        if (this.dictType === 'defectSource') {
          this.defectSourceData()
        } else if (this.dictType === 'defectEnv') {
          this.defectConfData = this.$getDictDataList(this.dictType)
        } else if (this.dictType === 'defectType') {
          this.defectConfData = this.$getDictDataList(this.dictType)
        }
      }
    },
    getParentProjectConfData () {
      let params = {}
      params.projectId = this.dataForm.parentId
      params.dictType = this.dataForm.dictType
      params.isAutoFill = false
      this.$http.get('/ctc/defect/defectConfInfo/getDefectConfInfo', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.defectConfData = res.data
        }
      }).catch(() => { })
    },
    defectSourceData () {
      let projectId = this.dataForm.projectId
      this.$http.get('/ctc/project/relaPlatform/getByPjectId', { params: { 'projectId': projectId } }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let newData = []
          res.data.forEach((item, index) => {
            newData.push({ 'dictLabel': item.name, 'dictValue': item.applicationId })
          })
          this.defectConfData = newData
        }
      }).catch(() => { })
    },
    doSaveDefectConfInfo () {
      let thisvm = this
      let saveDefectConf = []
      if (thisvm.defectConf.length === 0) {
        return thisvm.$message.warning('请选择要添加的数据')
      }
      let sortIndex = thisvm.dataList.length
      thisvm.defectConf.forEach((item, index) => {
        let existFlag = true
        thisvm.dataList.forEach((titem, tindex) => {
          if (item.dictValue === titem.dictValue) {
            existFlag = false
          }
        })
        if (existFlag) {
          item.projectId = thisvm.dataForm.projectId
          item.dictType = thisvm.dataForm.dictType
          item.sort = sortIndex
          saveDefectConf.push(item)
          sortIndex++
        }
      })
      if (saveDefectConf.length > 0) {
        thisvm.$http['post']('/ctc/defect/defectConfInfo/insertDefectConfInfo', saveDefectConf).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            thisvm.getDataList()
          }
        })
      }
    },
    defectConfCheckAllChange (checked) {
      let checkBoxArr = []
      if (checked) {
        this.defectConfData.forEach((item, index) => {
          checkBoxArr.push(item)
        })
      }
      this.defectConf = checkBoxArr
    },
    childHandle (name, dictType, row) {
      let path = 'defectcenter/defect-result-config/defect-child-dict-data'
      let titel = name
      let params = {}
      params.dictType = dictType + row.dictValue
      params.projectId = row.projectId
      this.customAddDynamicRoute(path, titel, params)
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
