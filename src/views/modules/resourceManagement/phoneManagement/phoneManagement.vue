<template>
  <div>
    <el-row style="margin-bottom: 20px">
      <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-form
          ref="dataForm"
          :model="dataForm"
          :inline="false"
          label-position="right"
          label-width="100px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item prop="name" label="手机">
                <el-input
                  v-model="dataForm.name"
                  placeholder="请输入手机名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统类别" prop="platform">
                <el-select
                  v-model="dataForm.platform"
                  defaultValue="lucy"
                  clearable
                  filterable
                  placeholder="系统类别"
                  value-key="moduleId"
                >
                  <!-- 未知:0;安卓：1；IOS：2 -->
                  <el-option key="0" label="未知" value="0">未知</el-option>
                  <el-option key="1" label="安卓" value="1">安卓</el-option>
                  <el-option key="2" label="IOS" value="2">IOS</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-button type="primary" size="small" @click="getPhoneListData()"
                >查询</el-button
              >
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
      <el-row>
        <el-row style="margin-bottom:20px;">
          <el-col :span="12" class="split-line" style="text-align:left;">
              列表展示
          </el-col>
          <el-col :span="12" align="right">
          </el-col>
        </el-row>
        <el-table
          stripe
          highlight-current-row
          v-loading="dataListLoading"
          :data="dataList"
          ref="dataList"
          border
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="45"></el-table-column> -->
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
              {{
                scope.row.platform == 0
                  ? "未知"
                  : scope.row.execResult == 1
                  ? "安卓"
                  : scope.row.execResult == 2
                  ? "IOS"
                  : ""
              }}
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
          <el-table-column
            prop="serverIp"
            label="执行机IP"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="mobiledeviceState"
            label="状态"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="editOperate(scope.row)"
                type="text"
                size="small"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="dataForm.page"
          :page-sizes="[10, 100, 500, 1000]"
          :page-size="dataForm.limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
        >
        </el-pagination>
      </el-row>
      <add-or-updata
        v-if="addOrUpdataVisible"
        ref="addOrUpdata"
        @refresh="getPhoneData"
        @init="addOrUpdataVisible = false"
      ></add-or-updata>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import addOrUpdata from "@/views/modules/resourceManagement/numbeWrorkorder/addOrUpdata";

export default {
  name: "batchImport",
  components: {
    addOrUpdata,
  },
  data() {
    return {
      dataListLoading: false,
      addOrUpdataVisible: false,
      dataListSelections: "",
      dataForm: {
        limit: 10,
        page: 1,
      },
      dataList: [],
      total: 0,
    };
  },
  props: {},
  watch: {},
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.getPhoneListData();
      });
    },
    resetForm() {
      this.$refs.dataForm.resetFields();
      this.getUserListData();
    },
    getPhoneListData() {
      let params = {
        limit: this.dataForm.limit,
        page: this.dataForm.page,
        ...this.dataForm,
      };
      this.$http
        .get("/ctc/resource/MobilePhone/page", { params: params })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.dataList = res.data.list;
            this.total = res.data.totalCount;
          }
          this.$ctcLoading.close();
        })
        .catch(() => {
          this.$ctcLoading.close();
        });
    },
    pageSizeChangeHandle(val) {
      this.dataForm.limit = val;
      this.getPhoneListData();
    },
    pageCurrentChangeHandle(val) {
      this.dataForm.page = val;
      this.getPhoneListData();
    },
    editOperate(row) {
      this.addOrUpdataVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdata.init("编辑手机", "9");
        this.$refs.addOrUpdata.selectData = row;
      });
    },
    getPhoneData(data) {
      this.getPhoneListData();
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
