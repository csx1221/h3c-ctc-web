<template>
  <el-row class="project-mgr-page numberChild">
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
<!--          <el-table-column type="selection" width="45"></el-table-column>-->
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
<!--            <template v-if="item.code==='number'">-->
<!--              <el-table-column :key="index" :label="item.name" align="center" width="110">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button @click="createConfig('查看','8',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </template>-->
<!--            <template v-else-if="item.code==='serviceNo'">-->
<!--              <el-table-column :key="index" :label="item.name" align="center">-->
<!--                <template slot-scope="scope">-->
<!--                  <span v-html="scope.row.serviceNo"></span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </template>-->
            <template>
              <el-table-column :key="index" :label="item.name" align="center">
                <template slot-scope="scope">
                  <span v-html="getTableColumnData(scope.row,item)"></span>
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table>
        <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  name: 'numberOperationHistory',
  components: {
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      titleDataList: [
        {
          name: '卡号',
          code: 'number'
        },
        {
          name: '锁定状态',
          code: 'lockState'
        },
        {
          name: '被锁定平台',
          code: 'lockPlatformDefine'
        },
        {
          name: '锁定时间',
          code: 'lockTime'
        },
        {
          name: '锁定截止时间',
          code: 'lockEndTime'
        },
        {
          name: '操作人',
          code: 'creatorName'
        },
        {
          name: '操作时间',
          code: 'createDate'
        },
        {
          name: '备注',
          code: 'remarks'
        }
      ],
      dataList: [],
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get('audit4ASw') // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
    }
  },
  computed: {},
  props: {
    selectData: Object
  },
  mounted () {
    this.getProjectInfo(1)
  },
  methods: {
    handleSizeChange (val) {
      this.page = 1
      this.limit = val
      this.getProjectInfo()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getProjectInfo()
    },
    resetForm (formName) {
      this.dataForm.orgId = []
      this.$refs.dataForm.resetFields()
      this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      this.$http.get('/ctc/resource/lock/manager/log', { 'params': { 'cardNumberId': this.selectData.cardNumberId } }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
          this.total = 0
        } else {
          this.dataList = res.data.list
          this.total = res.data.totalCount
        }
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
        this.total = 0
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'perators') {
        columnValue = this.$getDictLabel('platform', row[item.code])
      } else if (item.code === 'state') {
        columnValue = this.$getDictLabel('numberStatus', row[item.code])
      } else if (item.code === 'brand') {
        columnValue = this.$getDictLabel('brand', row[item.code])
      } else if (item.code === 'operator') {
        columnValue = this.$getDictLabel('operators', row[item.code])
      } else if (item.code === 'lineState') {
        columnValue = this.$getDictLabel('lineState', row[item.code])
      } else if (item.code === 'lockState') {
        columnValue = this.$getDictLabel('lockState', row[item.code])
      } else if (item.code === 'lockPlatform') {
        columnValue = this.$getDictLabel('lockPlatform', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    }
  }
}
</script>
<style lang="scss" scoped>
.numberChild .el-pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
