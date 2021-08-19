<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <ctc-account-file
        ref="ctcFileImport"
        @watchChildImport="triggerParentPage"
      ></ctc-account-file>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="12" class="split-line" style="text-align: left">
        导入手机列表
      </el-col>
      <el-col :span="12" align="right">
        <span class="spanList">上传数量：{{ dataList.length }}</span>
        <span class="spanList success">正常数量：{{ normalQuantity }}</span>
        <span class="spanList error">异常数量：{{ abnormalqQuantity }}</span>
        <el-button
          v-if="dataList.length > 0"
          type="primary"
          @click="operation('1')"
          size="small"
          >批量移除</el-button
        >
        <el-button
          v-if="abnormalqQuantity !== 0"
          type="primary"
          @click="operation('2')"
          size="small"
          >移除异常</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-table
        stripe
        highlight-current-row
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
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
        <el-table-column
          prop="dateState"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.dateState === 1 ? '正常' : '异常' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="errMsg"
          label="信息"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="deleteOperate(scope.$index)"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div style="text-align: center; margin-top: 20px">
      <el-button type="primary" size="small" @click="submitResult()">批量录入</el-button>
      <el-button type="info" size="small" @click="$emit('close')"
        >取消</el-button
      >
    </div>
  </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
// import ctcUtils from '@/utils/ctc-utils.js'

/* eslint-disable */
export default {
  name: "batchImport",
  data() {
    return {
      addOrUpdataVisible: false,
      dataListLoading: false,
      ctcFileImport: false,
      normalQuantity: 0, // 正常数量
      abnormalqQuantity: 0, // 异常数量
      dataListSelections: "",
      dataForm: {
        fileId: "",
      },
      dataRule: {
        fileId: [{ required: true, message: "请上传附件", trigger: "change" }],
      },
      dataList: [],
    };
  },
  props: {
    selectData: Array,
  },
  watch: {
    dataList(newVal, oldVal) {
      this.normalQuantity = this.dataList.filter(
        (obj) => obj.dateState !== 2
      ).length;
      this.abnormalqQuantity = this.dataList.length - this.normalQuantity;
    },
  },
  computed: {},
  mounted() {
    this.initFileImport();
  },
  methods: {
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 操作
    operation(type) {
      // 1 批量移除 2 移除异常
      if (type === "1") {
        if (this.dataListSelections.length !== 0) {
          this.dataList = [...this.dataList].filter((x) =>
            [...this.dataListSelections].every((y) => y !== x)
          );
        } else {
          this.$message.warning("请选择需要移除项！！！");
        }
      } else if (type === "2") {
        this.dataList = this.dataList.filter((obj) => obj.dateState !== 2);
      }
    },
    deleteOperate(index) {
      this.dataList.splice(index, 1)
    },
    submitResult(res) {
      if (this.abnormalqQuantity > 0) {
        this.$message.warning("请处理异常列表");
      } else if (this.dataList.length === 0) {
        this.$message.warning("数据为空，请先添加数据");
      } else {
        this.submitData();
      }
    },
    submitData() {
      let thisvm = this;
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open();
      let phoneData = []
      let _ = require('lodash')
      phoneData = this.dataList.concat(this.selectData)
      console.log(phoneData)
      // 根据serialNo属性  去重
      let arr = _.uniqBy(phoneData, 'serialNo')
      if (phoneData.length == arr.length) {
        thisvm.$http.post("/ctc/resource/activiti/mobilephone/saveBatch", { list: this.dataList }).then(({ data: res }) => {
          thisvm.$ctcLoading.close();
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg);
          }
          this.$message.success("提交成功");
          let phoneArr = res.data.concat(this.selectData)
          this.$emit("close", phoneArr);
        })
        .catch(() => {
          thisvm.$ctcLoading.close();
        });
      } else {
        thisvm.$message.warning("请检查！存在重复设备序号");
        thisvm.$ctcLoading.close();
      }
    },
    initFileImport() {
      let fileImportParams = { 'templateData': {'fileName': '资源手机模板下载'}, 'uploadData': {} };
      // 文件上传、下载地址
      fileImportParams.templateUrl = "/ctc/resource/activiti/mobilephone/downExcel";
      fileImportParams.uploadUrl = "/ctc/resource/activiti/mobilephone/importBatch";
      this.$refs.ctcFileImport.fileImportParams = { ...fileImportParams };
      this.$refs.ctcFileImport.init();
    },
    triggerParentPage(res) {
      this.dataList = this.dataList.concat(res.data.list);
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
