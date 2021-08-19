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
          <el-col :span="8">
            <el-form-item prop="realName" label="姓名">
              <el-input v-model="dataForm.realName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="organizeId" label="所属机构">
              <ctc-organize-table v-model="dataForm.organizeId" placeholder="请输入机构名称" :organizeId.sync="dataForm.organizeId"></ctc-organize-table>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="primary" size="small" @click="getUserListData()"
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
        <el-table-column prop="username" label="用户账号" header-align="left" align="left"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" header-align="left" align="left"></el-table-column>
        <el-table-column prop="organizeName" label="所属机构 / 部门" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.deptName"> {{scope.row.organizeName}} / {{scope.row.deptName}}</span>
            <span v-else> {{scope.row.organizeName}}</span>
          </template>
        </el-table-column>
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
  name: "batchImport",
  data() {
    return {
      dataListLoading: false,
      dataListSelections: "",
      dataForm: {
        realName: '',
        organizeId: '',
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
        this.getUserListData()
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getUserListData()
    },
    getUserListData () {
      let params = {
        limit: this.dataForm.limit,
        page: this.dataForm.page,
        ...this.dataForm
      }
      this.$http.get('/sys/user/page', { 'params': params }).then(({ data: res }) => {
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
      this.getUserListData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getUserListData()
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
      console.log(selectionData)
      arrData = selectionData.concat(this.selectData)
      console.log(arrData)
      let arr = _.uniqBy(arrData, 'id')
      console.log(arr)
      this.$emit("closeAuth", arr)
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
