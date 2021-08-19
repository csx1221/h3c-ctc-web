<template>
    <el-row class="project-new-mgr-page">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="orgName" label="机构名称">
                                <el-input v-model="dataForm.orgName" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18" style="text-align:right;">
                            <el-button type="primary" size="small" @click="getProjectInfo(1,true)">查询</el-button>
                            <el-button size="small" @click="resetForm()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="24" style="margin-top:24px;">
            <el-card shadow="never" class="aui-card--fill">
                <el-row style="margin-bottom:20px;">
                    <el-col :span="12" class="split-line" style="text-align:left;">
                        机构列表
                    </el-col>
                    <el-col :span="12" style="padding-left:0px;text-align:right;">
                        <el-button type="blue" size="small" @click="doTableOperate('0',{})">添加部门</el-button>
                    </el-col>
                </el-row>
                <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" row-key="id" border lazy :expand-row-keys="['0']" :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%;">
                    <template v-for="(item, index) in projectTableTitleData">
                        <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" :width="getTableColumnWidth(item)" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-html="getTableColumnData(scope.row,item)"></span>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column fixed="right" label="操作" width="160">
                        <template slot-scope="scope">
                            <template v-if="scope.row.lv===1">
                                <el-button @click="doTableOperate('1',scope.row)" type="text" size="small">添加项目组</el-button>
                                <el-button @click="doTableOperate('2',scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="doTableOperate('4',scope.row)" type="text" size="small">删除</el-button>
                            </template>
                            <template v-else-if="scope.row.lv===2">
                                <el-button @click="doTableOperate('2-2',scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="doTableOperate('4',scope.row)" type="text" size="small">删除</el-button>
                            </template>
                            <template v-else-if="scope.row.lv===0">
                                <el-button @click="doTableOperate('0',{})" type="text" size="small">添加部门</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
<!--                <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">-->
<!--                </el-pagination>-->
                <el-pagination v-if="!this.dataForm.orgName" :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </el-card>
        </el-col>
        <public-dialog v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="refresh" @init="addOrUpdataVisible = false"></public-dialog>
    </el-row>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import publicDialog from './publicDialog'
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import CtcProjectUserTable from '@/components/project/ctc-project-user-table'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'ProjectmgrPage',
  components: {
    CtcProjectOrganizeTable, CtcProjectUserTable, publicDialog
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      radio: '',
      addOrUpdataVisible: false,
      dataForm: {
        orgName: '',
        lv: 1
      },
      total: 0,
      projectTableTitleData: [
        { 'code': 'orgName', 'name': '机构名称' },
        // { 'code': 'id', 'name': '机构编码' },
        { 'code': 'orgDesc', 'name': '机构描述' },
        { 'code': 'managerList', 'name': '项目经理' }
      ],
      projectTableData: [],
      projectTableDataSer: [],
      maps: new Map(),
      pid: ''
    }
  },
  watch: {
    'dataForm.orgName' (newVal, oldVal) {
      if (newVal) {
        this.dataForm.lv = ''
        this.limit = -1
      } else {
        this.dataForm.lv = 1
        this.limit = 10
      }
    }

  },
  computed: {
  },
  mounted () {
    this.getProjectInfo()
  },
  activated () {
    // this.getProjectInfo()
  },
  methods: {
    getTableColumnWidth (item) {
      let width = 'auto'
      if (['name'].includes(item.code)) {
        width = 250
      }
      return width
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      let bool = 'projectStatus,level,category,scope'.includes(item.code)
      if (bool) {
        columnValue = this.$getDictLabel('project.' + item.code, row[item.code])
      } else {
        columnValue = row[item.code]
      }
      // 特殊处理计划周期
      if (item.code === 'managerList') {
        let managerList = row[item.code]
        let name = []
        if (managerList) {
          for (let i = 0; i < managerList.length; i++) {
            name.push(managerList[i].realName + '（' + managerList[i].userName + '）')
          }
          columnValue = name.join('、')
        } else {
          columnValue = ''
        }
      }
      return columnValue
    },
    handleSizeChange (val) {
      this.page = 1
      this.limit = val
      this.getProjectInfo()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getProjectInfo()
    },
    getProjectInfo (res) {
      let thisvm = this
      if (res) {
        this.page = res
      }
      // if (thisvm.pid) {
      //   let { tree, treeNode, resolve } = this.maps.get(thisvm.pid)
      //   this.$set(this.$refs.projectTableData.store.states.lazyTreeNodeMap, thisvm.pid, [])
      //   this.subTableload(tree, treeNode, resolve)
      //   thisvm.pid = ''
      // }
      thisvm.$ctcLoading.open()
      thisvm.projectTableData = []
      thisvm.projectTableDataSer = []
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      thisvm.$http.get('/account4a/organize/manager/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
          thisvm.projectTableData = []
          thisvm.total = 0
        } else {
          if (thisvm.dataForm.orgName) {
            console.log(thisvm.buildTreeDate(res.data.list, '0'))
            let firstNode = {
              // hasChildren: true,
              id: '0',
              lv: 0,
              orgDesc: '',
              orgName: '中国移动',
              parentId: '0',
              children: thisvm.buildTreeDate(res.data.list, '0')
            }
            thisvm.projectTableDataSer = res.data.list
            thisvm.projectTableData = [firstNode]
          } else {
            let firstNode = {
              // hasChildren: true,
              id: '0',
              lv: 0,
              orgDesc: '',
              orgName: '中国移动',
              parentId: '0',
              children: res.data.list
            }
            thisvm.projectTableData = [firstNode]
            thisvm.total = res.data.total
          }
          thisvm.$ctcLoading.close()
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
        thisvm.projectTableData = []
        thisvm.total = 0
      })
    },
    buildTreeDate (data, pid) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].lv === 1) {
          result.push(data[i])
        }
      }
      return result
    },
    subTableload (tree, treeNode, resolve) {
      if (tree.lv !== 0) {
        if (this.projectTableDataSer.length !== 0) {
          let pid = tree.id
          let pData = []
          for (let i = 0; i < this.projectTableDataSer.length; i++) {
            if (this.projectTableDataSer[i].parentId === pid) {
              pData.push(this.projectTableDataSer[i])
            }
          }
          resolve(pData)
        } else {
          console.log(tree)
          // console.log(treeNode)
          // resolve(treeNode.children)
          let pid = tree.id
          this.pid = pid
          this.maps.set(pid, { tree, treeNode, resolve })
          let params = { 'parentId': tree.id, lv: 2, page: 1, limit: 999999 }
          this.$http.get('/account4a/organize/manager/list', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              console.log(1)
              resolve(res.data.list)
            }
          }).catch(() => {
          })
        }
      } else {
        // let thisvm = this
        // let params = { page: this.page, limit: this.limit, ...this.dataForm }
        // thisvm.$http.get('/account4a/organize/list', { 'params': params }).then(({ data: res }) => {
        //   if (res.code !== 0) {
        //     this.$message.error(res.msg)
        //   } else {
        //     resolve(res.data.list)
        //   }
        // }).catch(() => {
        // })
      }
    },
    refresh (pid) {
      if (pid) {
        this.getProjectInfo(1)
        let { tree, treeNode, resolve } = this.maps.get(pid)
        this.$set(this.$refs.projectTableData.store.states.lazyTreeNodeMap, pid, [])
        this.subTableload(tree, treeNode, resolve)
      } else {
        this.getProjectInfo(1)
      }
    },
    doTableOperate (type, row) {
      // 创建机构
      // 创建(1L)  查看(3L) 编辑(2L) 删除4
      //   0 添加部门 1 添加项目组 2部门编辑 2-2项目组编辑
      if (type === '0') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('添加部门', type, row, '中国移动')
        })
      } else if (type === '1') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('添加项目组', type, { parentId: row.id, lv: 2, managerList: [] }, '中国移动 > ' + row.orgName)
        })
      } else if (type === '2') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('编辑部门', type, row, '中国移动')
        })
      } else if (type === '2-2') {
        this.addOrUpdataVisible = true
        let list = this.projectTableData[0].children
        let newArr = list.filter((item, index, list) => {
          return item.id === row.parentId
        })
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('编辑项目组', type, row, '中国移动 > ' + newArr[0].orgName)
        })
      } else if (type === '3') {
        this.addOrUpdataVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('查看：' + row.orgName, type, row)
        })
      } else if (type === '4') {
        this.doDelete(row)
      }
    },
    doDelete (row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctcLoading.open()
        this.$http.post('/account4a/organize/delete', { id: row.id }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('删除成功')
            // this.getProjectInfo()
            this.refresh(row.parentId)
          }
        }).catch(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.limit = 10
      this.dataForm.lv = 1
      this.getProjectInfo()
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
    .project-new-mgr-page {
    }
</style>
<style lang="scss" scoped>
</style>
