<template>
  <el-dialog
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :title="$t('tracking')"
    width="70%"
    class="defect-add-or-update"
  >
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      :header-row-style="{background: 'rgba(38, 198, 218, 0.85)'}"
      max-height="500"
      stripe
      style="width: 100%"
      border
    >
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column
        align="center"
        v-for="(item,index) in tableTitleData"
        :key="index"
        :label="item.name"
        width="auto"
        :show-overflow-tooltip="item.code=='opinion'?true:false"
      >
        <template slot-scope="scope">
          <a
            v-if="scope.row['result']=='提交需求'&&item.code=='opinion'"
            @click="download(scope.row['attachementId'])"
          >{{scope.row["opinion"]}}</a>
          <span v-else v-html="scope.row[item.code]"></span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import ctcUtils from '@/utils/ctc-utils.js'
import mixin from '../../../../mixins/process-module'
export default {
  data () {
    return {
      tableTitleData: [
        { code: 'handlerName', name: '处理人' },
        { code: 'userDuty', name: '职位' },
        { code: 'sectionName', name: '科室' },
        { code: 'result', name: '处理结果' },
        { code: 'arrivalTime', name: '到达时间' },
        { code: 'dealTime', name: '处理时间' },
        { code: 'nextDealUserName', name: '下一步处理人' },
        { code: 'opinion', name: '图文说明' }
      ],
      tableData: []
    }
  },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init (id, c) {
      this.innerVisible = true
      this.tableData = []
      this.getData(id, c)
    },
    getData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      thisvm.getuId(id).then(res => {
        if (res.assessment) {
          let arr = []
          res.data.map(item => {
            arr.push(item.handler)
            item.nextDealUserName = item.nextDealUserName && item.nextDealUserName
              .replace('[', '')
              .replace(']', '')
              .replace(/\,/g, '<br/>') //eslint-disable-line
            thisvm.$ctcLoading.close()
          })
          thisvm.getDepartment(arr, res.data)
        } else {
          thisvm.$http
            .get(`/ctc/demand/getEvaluationHistoryByDemandId/${id}`)
            .then(({ data: res }) => {
              thisvm.$ctcLoading.close()
              if (res.code !== 0) {
                thisvm.$message.error(res.msg)
              } else {
                let arr = []
                res.data.map(item => {
                  arr.push(item.handler)
                  item.nextDealUserName = item.nextDealUserName && item.nextDealUserName
                    .replace('[', '')
                    .replace(']', '')
                    .replace(/\,/g, '<br/>') //eslint-disable-line
                })
                thisvm.getDepartment(arr, res.data)
              }
            })
            .catch(() => {
              thisvm.$ctcLoading.close()
            })
        }
      })
    },
    getuId (id) {
      this.$ctcLoading.open()
      let flag = false
      return this.$http
        .get(`/ctc/demand/getAssessmentByDemandId/${id}`)
        .then(({ data: res }) => {
          if (res.code === 0) {
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i]
              if (item.result === '通过' || item.result === '已评估') {
                if (item.nextDealUser.indexOf(Cookies.get('id')) !== -1) {
                  flag = true
                }
              }
            }
            return { assessment: flag, data: res.data }
          }
        })
        .catch(() => {
          this.$ctcLoading.close()
        })
    },
    download (id) {
      ctcUtils.customExportGet(`/ctc/oss/file/download/${id}`)
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-button--small {
  font-size: 14px;
}
</style>
