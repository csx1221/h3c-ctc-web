<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row style="margin-bottom: 20px">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :inline="false"
        label-position="right"
        label-width="80px"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item prop="name" label="部门">
              <el-input v-model="dataForm.name" placeholder="请输入部门名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="primary" size="small" @click="getDeptListData()"
              >查询</el-button
            >
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        stripe
        highlight-current-row
        v-loading="dataListLoading"
        @select="getChooseRow"
        :data="dataList"
        ref="dataList"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="部门名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="userCount"
          label="用户数"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-row>
    <div style="text-align: center; margin-top: 20px">
      <el-button type="primary" size="small" @click="submitResult()"
        >确定</el-button
      >
      <el-button type="info" size="small" @click="$emit('close')"
        >取消</el-button
      >
    </div>
  </el-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "deptList",
  data() {
    return {
      dataListLoading: false,
      dataListSelections: "",
      dataForm: {
        name: '',
				limit: 10,
        page: 1
      },
      dataList: [],
      total: 0,
    };
  },
  props: {
    selectData: Array,
  },
  watch: {

  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
		init () {
      this.$nextTick(() => {
        this.getDeptListData()
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getDeptListData()
    },
    getDeptListData () {
      let params = {
        limit: this.dataForm.limit,
        page: this.dataForm.page,
        ...this.dataForm
      }
      this.$http.get('/sys/deptnew/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataList = res.data.list
          this.total = res.data.total
          // 回显已勾选的数据
          if (this.selectData) {
            for (let i = 0; i < this.selectData.length; i++) {
              for (let k = 0; k < this.dataList.length; k++) {
                if (this.selectData[i].id == this.dataList[k].id) {
                  this.$nextTick(() => {
                    this.$refs.dataList.toggleRowSelection(this.dataList[k]);
                  })
                }
              }
            }
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getDeptListData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getDeptListData()
    },
    getChooseRow (val, row) {
      // console.log(val, row)
      // for (let i = 0; i < this.selectData.length; i++) {
      //   if (row.id == this.selectData[i].id) {
      //     this.selectData.splice(i, 1)
      //   }
      // }
    },
    submitResult () {
      let arrData = []
      let _ = require('lodash')
      let selectionData = this.$refs.dataList.selection
      arrData = selectionData.concat(this.selectData)
      let arr = _.uniqBy(arrData, 'id')
      this.$emit("closeAuth", arr);
    }
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.spanList {
  margin: 0 10px;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
</style>
