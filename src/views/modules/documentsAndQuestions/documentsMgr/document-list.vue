<template>
  <div class="document-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="name" label="文档名称">
                  <el-input v-model="dataForm.name" placeholder="请输入文档名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="documentCode" label="文档编码">
                  <el-input v-model="dataForm.documentCode" placeholder="请输入文档编码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                <el-button type="primary" size="small" @click="getProjectDocument()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-col>
            </el-row>
            <el-row v-if="isOpen">
              <el-col :span="8">
                <el-form-item prop="ifAuth" label="是否审批">
                  <ctc-select v-model="dataForm.ifAuth" dict-type="yesOrNo" placeholder="请选择是否审批"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="creatorName" label="创建人名">
                  <el-input v-model="dataForm.creatorName" placeholder="请输入创建人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="documentStatus" label="文档状态">
                  <ctc-select v-model="dataForm.documentStatus" dict-type="document.documentStatus" placeholder="请选择评审状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="createDate" label="创建时间">
                  <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="18" class="split-line" style="text-align:left;">
              文档列表
              <span style="color:#4190f7;padding-right:10px;">说明：普通创建要选到具体目录节点，审核创建要选到具体项目节点</span>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-button type="blue" size="small" @click="doAddOrUpdateHandle('create0')" v-if="projectData && projectData.dirLevel>0">普通创建</el-button>
              <el-button type="warning" size="small" @click="doAddOrUpdateHandle('create1' )" v-if="projectData && projectData.dirLevel==0">审核创建</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="documentTableData" ref="documentTableData" border height="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="documentCode" label="文档编码" header-align="left" align="left" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="doSearchDocumentDetail(scope.row)">{{scope.row.documentCode}} </el-button>
                <el-button type="text" icon="el-icon-copy-document" @click="$copyContent(scope.row.documentCode)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="文档名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="version" label="版本" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                V{{scope.row.version}}.0
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="文档状态" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('document.documentStatus', scope.row.documentStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="ifAuth" label="是否审核" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('yesOrNo', scope.row.ifAuth) }}
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="handlerName" label="处理人" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="right" align="right" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateDate" label="修改时间" header-align="right" align="right" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="doAddOrUpdateHandle('update',scope.row)" :disabled="doValidBtnAuth(1,scope.row)">修改</el-button>
                <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)" :disabled="doValidBtnAuth(2,scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="doAddOrUpdateHandle('reloadUpdate',scope.row)" :disabled="doValidBtnAuth(3,scope.row)">重新上传</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update :visible.sync="addOrUpdate" ref="addOrUpdate" @watchChildPage="triggerParentMethod"></add-or-update>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import AddOrUpdate from './children/document-add-or-update'

export default {
  name: 'DocumentList',
  components: {
    AddOrUpdate
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        title: '',
        documentCode: '',
        ifAuth: '',
        documentStatus: '',
        createDate: '',
        limit: 10,
        page: 1
      },
      orderId: '',
      total: 0,
      documentTableData: [],
      isOpen: false,
      addOrUpdate: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getProjectDocument()
      }
    }
  },
  computed: {
  },
  mounted () {
    let thisvm = this
    thisvm.getProjectDocument()
    // 为了解决浏览器，两个标签页通信
    window.addEventListener('handReLoadEvent', function (event) {
      if (event.key === 'documentReload') {
        thisvm.getProjectDocument()
      }
    })
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        if (message.data.ifAuth === '1') {
          this.projectData.dirId = ''
        }
        this.getProjectDocument()
      }
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectDocument()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectDocument()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectDocument()
    },
    getProjectDocument () {
      this.$ctcLoading.open()
      let params = { ...this.dataForm }
      params.projectId = this.projectData.projectId || ''
      params.dirId = this.projectData.dirId || ''
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('ctc/project/document/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.documentTableData = res.data.list
          this.total = res.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doValidBtnAuth (type, row) {
      // 判断是否有权限操作，默认false表示无权限
      let authFlag = false
      let opAuth = [row.creator]
      // 特殊判断,是否是超级管理员
      if (this.$store.state.user.superAdmin === 1) {
        opAuth.push(this.$store.state.user.id)
      }
      // 判断当前登录账号
      if (opAuth.includes(this.$store.state.user.id)) {
        authFlag = true
      } else {
        authFlag = false
      }
      if (type === 1) {
        // 修改，判断状态[待审核]可以删除
        if (authFlag && [0].includes(row.documentStatus) && row.version === 1) {
          authFlag = true
        } else {
          authFlag = false
        }
      } else if (type === 2) {
        // 删除，判断状态[待审核]可以删除
        if (authFlag && [0].includes(row.documentStatus) && row.version === 1) {
          authFlag = true
        } else {
          authFlag = false
        }
      } else if (type === 3) {
        // 重新上传
        if (authFlag && [3].includes(row.documentStatus)) {
          authFlag = true
        } else {
          authFlag = false
        }
      }
      // 置灰操作，需要特殊处理取反
      return !authFlag
    },
    doSearchDocumentDetail (row) {
      let path = 'documentsAndQuestions/documentsMgr/document-view.vue'
      let titel = '查看文档详情'
      let params = {}
      params.documentId = row.documentId
      params.version = row.version
      this.customAddDynamicRoute(path, titel, params)
    },
    doAddOrUpdateHandle (type, row) {
      let thisvm = this
      let nodePath = thisvm.projectData.nodePath
      // 判断是否走审批创建
      if (type === 'create0') {
        // 判断有无权限上传
        if (thisvm.projectData.ifWrite === 0) {
          return thisvm.$message.warning('该目录您没有权限上传文档')
        }
        thisvm.$refs.addOrUpdate.dataForm.documentId = ''
        thisvm.$refs.addOrUpdate.dataForm.version = 1
        thisvm.$refs.addOrUpdate.dataForm.chooseIfAuth = '0'
        thisvm.$refs.addOrUpdate.dataForm.dirId = thisvm.projectData.dirId
        thisvm.$refs.addOrUpdate.dataForm.pathId = nodePath.pathId.join('/')
        thisvm.$refs.addOrUpdate.dataForm.pathName = nodePath.pathName.join('/')
      } else if (type === 'create1') {
        thisvm.$refs.addOrUpdate.dataForm.documentId = ''
        thisvm.$refs.addOrUpdate.dataForm.version = 1
        thisvm.$refs.addOrUpdate.dataForm.chooseIfAuth = '1'
        thisvm.$refs.addOrUpdate.dataForm.dirId = thisvm.projectData.dirId
        thisvm.$refs.addOrUpdate.dataForm.pathId = nodePath.pathId.join('/')
        thisvm.$refs.addOrUpdate.dataForm.pathName = nodePath.pathName.join('/')
      } else if (type === 'update' || type === 'reloadUpdate') {
        thisvm.$refs.addOrUpdate.dataForm.documentId = row.documentId
        thisvm.$refs.addOrUpdate.dataForm.version = row.version
        thisvm.$refs.addOrUpdate.dataForm.chooseIfAuth = row.ifAuth
        thisvm.$refs.addOrUpdate.dataForm.dirId = row.dirId
        thisvm.$refs.addOrUpdate.dataForm.pathId = row.pathId
        thisvm.$refs.addOrUpdate.dataForm.pathName = row.pathName
      }
      // 设置操作类型
      thisvm.$refs.addOrUpdate.dataForm.operationType = type
      thisvm.$refs.addOrUpdate.dataForm.parentProjectId = thisvm.projectData.parentProjectId || ''
      thisvm.$refs.addOrUpdate.dataForm.projectId = thisvm.projectData.projectId || ''
      thisvm.$refs.addOrUpdate.init()
    },
    doSingleDeleteData (row) {
      let documentIds = [row.documentId]
      this.executeBatchDeleteOperate(documentIds)
    },
    executeBatchDeleteOperate (documentIds) {
      this.$confirm('确定删除【文档】操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/project/document', { 'data': documentIds }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.getProjectDocument()
          }
        }).catch(() => { })
      }).catch(() => { })
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
<style lang="scss">
</style>
