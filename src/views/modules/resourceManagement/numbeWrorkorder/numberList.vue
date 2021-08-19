<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row style="margin-bottom: 20px">
      <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
          <el-row>
             <el-col :span="6">
                 <el-form-item label="手机号码" prop=" number ">
                     <el-input v-model="dataForm.number" placeholder="请输入" clearable></el-input>
                 </el-form-item>
             </el-col>
             <el-col :span="6">
                 <el-form-item label="省份：" prop=" provinceDefine ">
                     <el-input v-model="dataForm.provinceDefine" placeholder="请输入" clearable></el-input>
                 </el-form-item>
             </el-col>
             <el-col :span="6">
                 <el-form-item label="所属平台:" prop=" platform ">
                   <el-select  v-model="dataForm.platform"  defaultValue="lucy"  clearable  filterable  placeholder="所属平台"  value-key="moduleId">
                     <el-option key="0" label="-" value="0">-</el-option>
                     <el-option key="1" label="智能拨测平台" value="1">智能拨测平台</el-option>
                     <el-option key="2" label="用户模拟平台" value="2">用户模拟平台</el-option>
                     <el-option key="3" label="APP测试平台" value="3">APP测试平台</el-option>
                     <el-option key="4" label="资费测试" value="4">资费测试</el-option>
                   </el-select>
                 </el-form-item>
             </el-col>
             <el-col :span="6" align="right">
                 <el-button type="primary" size="small" @click="search()">查询</el-button>
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
        @select="getChoosePhoneRow"
        :data="dataList"
        ref="dataList"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column
          prop="code"
          label="编号"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          label="手机名称"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="owner"
          label="负责人"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="manufacturer"
          label="厂商"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="platform"
          label="系统"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.platform == 0 ? '未知' : scope.row.execResult == 1 ? '安卓' : scope.row.execResult == 2 ? 'IOS' : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="型号"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serialNo"
          label="设备序号"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="displayRadio"
          label="分辨率"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="mem"
          label="内存"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="descript"
          label="备注"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <!-- <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> -->
      <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page="dataForm.page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
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
      this.getPhoneListData()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getUserListData()
    },
    getPhoneListData () {
      let params = {
        limit: this.dataForm.limit,
        page: this.dataForm.page,
        ...this.dataForm
      }
      this.$http.get('/ctc/resource/activiti/mobilephone/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataList = res.data.list
          this.total = res.data.totalCount
          // 回显已勾选的数据
          if (this.selectData) {
            for (let i = 0; i < this.selectData.length; i++) {
              for (let k = 0; k < this.dataList.length; k++) {
                if (this.selectData[i].mobilephoneId == this.dataList[k].mobilephoneId) {
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
    handleSizeChange (val) {
      this.dataForm.limit = val
      this.getPhoneListData()
    },
    handleCurrentChange (val) {
      this.dataForm.page = val
      this.getPhoneListData()
    },
    getChoosePhoneRow (val, row) {
      // console.log(val, row)
      for (let i = 0; i < this.selectData.length; i++) {
        if (row.mobilephoneId == this.selectData[i].mobilephoneId) {
          this.selectData.splice(i, 1)
        }
      }
    },
    submitResult () {
      let phoneData = []
      let _ = require('lodash')
      let selectionData = this.$refs.dataList.selection
      phoneData = selectionData.concat(this.selectData)
      // console.log(phoneData)
      // 根据mobilephoneId属性  去重
      let arr = _.uniqBy(phoneData, 'mobilephoneId')
      this.$emit("close", arr)
    },
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
