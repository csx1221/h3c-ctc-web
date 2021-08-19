<template>
    <div>
        <el-table stripe :data="data" border style="width: 100%;">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="处理结果" prop="result" align="center"></el-table-column>
            <el-table-column label="附件" align="center">
                <template slot-scope="scope">
                    <ctc-download-table :id="scope.row.attachementId"></ctc-download-table>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  name: 'result',
  data () {
    return {

    }
  },
  props: {
    data: Array
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
    .is_flex{
        display: flex;
        min-height: 80px;
        .flex_left{
            width: 120px;
            text-align: right;
            padding-right: 10px;
            color: #cccccc;
        }
        .flex_right{
            flex: 1;
        }
    }
</style>
