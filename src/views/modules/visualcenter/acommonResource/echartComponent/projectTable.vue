<template>
  <el-table :header-cell-style="getRowClass" max-height="350" :data="tableData" style="width: 100%;">
    <el-table-column label="序号" width="55" type="index"></el-table-column>
    <el-table-column  prop="projectStageName" label="阶段名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column  prop="orderCode" label="工单编号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="orderStatus" label="工单状态" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" >{{ $getDictLabel('dealStatus',scope.row.orderStatus) }}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="planPeriod" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="actualPeriod" label="实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'height:47px;padding:3px;color:#EAE7E1 !important;background:rgba(34, 179, 197, 0.85) !important;text-align:center;'
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
</style>
