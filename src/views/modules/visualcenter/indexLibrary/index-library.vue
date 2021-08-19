<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="指标名称">
              <el-input v-model="dataForm.normName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="指标分类">
              <el-select v-model="dataForm.firstNorm" placeholder="请选择" style="width: 48%;">
                <el-option key="" label="全部(一级分类)" value=""></el-option>
                <el-option v-for="item in this.firstNormList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="dataForm.twoNorm" placeholder="请选择" style="width: 48%;margin-left: 3%;">
                <el-option key="" label="全部(二级分类)" value=""></el-option>
                <el-option v-for="item in this.twoNormList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="指标类型">
              <ctc-select v-model="dataForm.indicatorType" dict-type="indicator_type" placeholder="全部"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align:right;float:right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table stripe highlight-current-row border v-loading="dataListLoading" :data="dataList">
        <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
        <el-table-column prop="normName" label="指标名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="指标分类" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.firstNorm }} > {{ scope.row.twoNorm }}
          </template>
        </el-table-column>
        <el-table-column prop="supportDimensions" label="支持维度" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.supportDimensions.split(',')" v-if="index < scope.row.supportDimensions.split(',').length-1" :key="item"> {{ $getDictLabel('support_dimensions',item) }}<span v-if="index < scope.row.supportDimensions.split(',').length-2">,</span></span>
          </template>
        </el-table-column>
        <el-table-column prop="indicatorType" label="指标类型" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('indicator_type',scope.row.indicatorType) }}
          </template>
        </el-table-column>
        <el-table-column prop="calculationMethod" label="计算方法" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.calculationMethod ? scope.row.calculationMethod : '无' }}
          </template>
        </el-table-column>
        <el-table-column prop="indexDescription" label="指标说明" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      // 回显表单数据
      echoDataForm: {
        normName: '',
        firstNorm: '',
        twoNorm: '',
        indicatorType: ''
      },
      dataForm: {
        normName: '',
        firstNorm: '',
        twoNorm: '',
        indicatorType: ''
      },
      mixinViewModuleOptions: {
        createdIsNeed: true,
        getDataListURL: 'ctc/visualization/indexLibrary/getPage',
        getDataListIsPage: true
      },
      firstNormList: [],
      twoNormList: [],
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  components: {
  },
  mounted () {
    this.echoDataForm = { ...this.dataForm }
  },
  created () {
    this.getFirstNormList()
  },
  watch: {
    'dataForm.firstNorm': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$http.get(`/ctc/visualization/indexLibrary/getTwoNorm/`, { params: { firstNorm: newVal } }, { emulateJSON: true }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm.twoNorm = ''
          this.twoNormList = res.data
        }).catch(() => { })
      }
    }
  },
  methods: {
    // 重置初始条件状态
    resetSelectInfo () {
      this.$nextTick(() => {
        this.dataForm.normName = ''
        this.dataForm.firstNorm = ''
        this.dataForm.twoNorm = ''
        this.dataForm.indicatorType = ''
        this.getDataList()
      })
    },
    getFirstNormList () {
      this.$http.get(`/ctc/visualization/indexLibrary/getFirstNorm`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.firstNormList = res.data
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
</style>
