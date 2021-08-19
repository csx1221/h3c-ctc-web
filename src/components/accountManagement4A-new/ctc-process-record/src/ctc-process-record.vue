<template>
    <el-table stripe :data="dataList" border style="width: 100%;">
        <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
        <template v-for="(item, index) in titleDataList">
            <template>
                <el-table-column :key="index" :label="item.name" align="center">
                    <template slot-scope="scope">
                        <span v-html="getTableColumnData(scope.row,item)"></span>
                    </template>
                </el-table-column>
            </template>
        </template>
        <el-table-column fixed="right" label="备注" header-align="center" align="center">
            <template slot-scope="scope">
                <template v-if="![0,7,8,null].includes(scope.row.opinion)">
                    <span>{{scope.row.handleExplain}}</span>
                    <ctc-download-table :id="scope.row.fileId"></ctc-download-table>
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
  name: 'CtcProcessRecord',
  data () {
    return {
      dataList: [],
      titleDataList: [
        {
          name: '处理时间',
          code: 'createDate'
        },
        {
          name: '处理人',
          code: 'userName'
        },
        {
          name: '处理意见',
          code: 'opinion'
        }
        // {
        //   name: '备注',
        //   code: 'name'
        // }
      ]
    }
  },
  props: {
    recordId: [Number, String, Array]
  },
  mounted () {
    this.getRecordData() // 获取处理记录信息
  },
  watch: {
  },
  methods: {
    getRecordData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: this.recordId }
      thisvm.$http.get('/account4a/done/record', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        thisvm.dataList = res.data
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accStateNew', row[item.code])
      } else if (item.code === 'approvalStatus') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else if (item.code === 'canLoginWay') {
        columnValue = this.$getDictLabel('VPNPermission', row[item.code])
      } else if (item.code === 'isGfort') {
        columnValue = this.$getDictLabel('isGfort', row[item.code])
      } else if (item.code === 'opinion') {
        columnValue = this.$getDictLabel('handlingOpinions', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    }
  }
}
</script>
