<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-tabs :tab-position="tabPosition">
      <!-- 新建流程 -->
      <el-tab-pane label="新建流程" border>
        <el-col :span="9" style="margin-top: 10px; width: 565px">
          <el-table
            stripe
            v-loading="dataListLoading"
            :data="tableData"
            border
            @selection-change="dataListSelectionChangeHandle"
            @sort-change="dataListSortChangeHandle"
          >
            <el-table-column
              prop="definitionName"
              label="流程名称"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="definitionDec"
              label="流程描述"
              width="200"
            ></el-table-column>
            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              width="164"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="!$route.params.number"
                  @click="
                    createConfig(
                      scope.row.definitionName,
                      scope.row,
                      scope.row.path
                    )
                  "
                  type="text"
                  size="small"
                >
                  启动</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
      <!-- 我的待办 -->
      <el-tab-pane label="我的待办">
        <el-form
          ref="dealData"
          :model="dealData"
          :inline="false"
          label-position="right"
          label-width="120px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请标题" prop="title">
                <el-input
                  v-model="dealData.title"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人：" prop="applyName">
                <el-input
                  v-model="dealData.applyName"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="applyDate" label="申请时间">
                <el-date-picker
                  v-model="dealData.applyDate"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" size="small" @click="getDealData()"
                >查询</el-button
              >
              <el-button size="small" @click="resetFormDeal()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          stripe
          v-loading="dataListLoading"
          :data="tableData1"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%"
        >
          <el-table-column
            prop="code"
            label="编号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="申请标题"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="申请类型"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="applyName"
            label="申请人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createdTime"
            label="申请时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="nodeName"
            label="当前环节"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center"
          >
          <!-- -2：撤回；-1：驳回；0：初始；1：已提交；2：审批中；3：审批完成；4：已关闭 -->
            <template slot-scope="scope">
              {{ getStateData(scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="申请理由"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doOperate('1', scope.row)">查看</el-button>
              <el-button v-if='scope.row.state == 1' type="text" size="small" @click="doOperate('2', scope.row)">审批</el-button>
              <el-button v-if='scope.row.state == -2 || scope.row.state == -1' type="text" size="small" @click="doOperate('4', scope.row)">处理</el-button>
              <el-button type="text" size="small" @click="doOperate('3', scope.row)"
                >审批记录</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="dealData.page" :page-sizes="[10, 100, 500,1000]" :page-size="dealData.limit" :total="dealData.dealTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="dealPageSizeChangeHandle" @current-change="dealPageCurrentChangeHandle">
        </el-pagination>
      </el-tab-pane>
      <!-- 我的已办 -->
      <el-tab-pane label="我的已办">
        <el-form
          ref="doneData"
          :model="doneData"
          :inline="false"
          label-position="right"
          label-width="120px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请标题" prop="title">
                <el-input
                  v-model="doneData.title"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人：" prop="applyName">
                <el-input
                  v-model="doneData.applyName"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="applyDate" label="申请时间">
                <el-date-picker
                  v-model="doneData.applyDate"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" size="small" @click="getDoneData()"
                >查询</el-button
              >
              <el-button size="small" @click="resetFormDone()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          stripe
          v-loading="dataListLoading"
          :data="tableData2"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
        >
          <el-table-column
            prop="code"
            label="编号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="申请标题"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="申请类型"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="applyName"
            label="申请人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createdTime"
            label="申请时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="nodeName"
            label="当前环节"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center"
          >
          <!--  -2：撤回；-1：驳回；0：初始；1：已提交；2：审批中；3：审批完成；4：已关闭 -->
            <template slot-scope="scope">
              {{ getStateData(scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="申请理由"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doOperate('1', scope.row)">查看</el-button>
              <el-button v-if="scope.row.state == -2 || scope.row.state == -1" type="text" size="small" @click="close(scope.row.processId)">关闭</el-button>
              <el-button v-if="scope.row.state == 1" type="text" size="small" @click="revert(scope.row.processId)">撤回</el-button>
              <el-button type="text" size="small" @click="doOperate('3', scope.row)">审批记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="doneData.page" :page-sizes="[10, 100, 500,1000]" :page-size="doneData.limit" :total="doneData.doneTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="donePageSizeChangeHandle" @current-change="donePageCurrentChangeHandle"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <add-or-updata
      v-if="addOrUpdataVisible"
      ref="addOrUpdata"
      @refresh="refresh"
      @init="addOrUpdataVisible = false"
    ></add-or-updata>
  </el-card>
</template>
<script>
/* eslint-disable */
import Cookies from "js-cookie";
import mixinViewModule from "@/mixins/view-module";
import addOrUpdata from "@/views/modules/resourceManagement/numbeWrorkorder/addOrUpdata";
import CtcProjectOrganizeTable from "@/components/project/ctc-project-organize-table";
import ctcPersonLiable from "@/components/programmecntre/ctc-person-liable";
import ctcUtils from "@/utils/ctc-utils.js";
import { addDynamicRoute } from "@/router";
export default {
  mixins: [mixinViewModule],
  name: "numberManagement",
  components: {
    addOrUpdata,
    CtcProjectOrganizeTable,
    ctcPersonLiable,
  },
  data() {
    return {
      approval: false,
      backlogApproval: false,
      tabPosition: "left",
      mixinViewModuleOptions: {
        createdIsNeed: false, // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataVisible: false,
      dealData: {
        title: "",
        applyName: "",
        applyDate: "",
        limit: 10,
        page: 1,
        dealTotal: 0,
      },
      doneData: {
        title: "",
        applyDate: "",
        applyName: "",
        limit: 10,
        page: 1,
        doneTotal: 0
      },
      tableData: [],
      tableData1: [],
      tableData2: [],
      refDemand: false,
      loginSw: Cookies.get("loginSw"), // 判断登录方式(0:集中化测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get("audit4ASw"), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      form: {
        name: "",
        date1: "",
        date2: "",
        type: [],
        desc: "",
      },
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
    this.getDealData();
    this.getDoneData();
  },
  methods: {
    refresh () {
      this.getDealData();
      this.getDoneData();
    },
    getTableData() {
      this.$http
        .get(`/ctc/resource/activiti/processDefinition/queryDefinition`)
        .then(({ data }) => {
          // console.log(data);
          this.tableData = data.data;
          this.tableData[0].path =
            "resourceManagement/numbeWrorkorder/numberAdd";
          this.tableData[1].path =
            "resourceManagement/numbeWrorkorder/numberCartimpower";
          this.tableData[2].path =
            "resourceManagement/numbeWrorkorder/numberApplication";
          this.tableData[3].path =
            "resourceManagement/numbeWrorkorder/phoneStorage";
          this.tableData[4].path =
            "resourceManagement/numbeWrorkorder/phoneAuth";
          this.tableData[5].path =
            "resourceManagement/numbeWrorkorder/phoneCancel";
        });
    },
    getDealData() {
      let params = {
        applyName: this.dealData.applyName,
        limit: this.dealData.limit,
        page: this.dealData.page,
        title: this.dealData.title,
        applyDate: this.dealData.applyDate
      };
      if (params.applyDate.length > 0) {
        params.applyStartDate = params.applyDate[0];
        params.applyEndDate = params.applyDate[1];
        delete params["applyDate"];
      }
      this.$http
        .get(`/ctc/resource/activiti/task/myTaskPage`, { params: params })
        .then(({ data }) => {
          if (data.code !== 0) {
            this.$message.error(data.msg);
          } else {
            this.tableData1 = data.data.list;
            this.dealData.dealTotal = data.data.totalCount;
          }
          
        });
    },
    dealPageSizeChangeHandle (val) {
      this.dealData.limit = val
      this.getDealData()
    },
    dealPageCurrentChangeHandle (val) {
      this.dealData.page = val
      this.getDealData()
    },
    getDoneData() {
      // console.log(this.tableData1.title)
      let params = {
        applyName: this.doneData.applyName,
        limit: this.doneData.limit,
        page: this.doneData.page,
        title: this.doneData.title,
        applyDate: this.doneData.applyDate
      };
      if (params.applyDate.length > 0) {
        params.applyStartDate = params.applyDate[0];
        params.applyEndDate = params.applyDate[1];
        delete params["applyDate"];
      }
      this.$http
        .get(`/ctc/resource/activiti/task/MyFinishPage`, { params: params })
        .then(({ data }) => {
          if (data.code !== 0) {
            this.$message.error(data.msg);
          } else {
            this.tableData2 = data.data.list;
            this.doneData.doneTotal = data.data.totalCount;
          }
        });
    },
    donePageSizeChangeHandle(val) {
      this.doneData.page = 1;
      this.limit = val;
      this.getDoneData();
    },
    donePageCurrentChangeHandle(val) {
      this.doneData.page = val;
      this.getDoneData();
    },
    resetFormDeal() {
      this.$refs.dealData.resetFields()
      this.getDealData()
    },
    resetFormDone() {
      this.$refs.doneData.resetFields()
      this.getDoneData()
    },
    // 验证是否要关联字典表
    getStateData (state) {
      // -2：撤回；-1：驳回；0：初始；1：已提交；2：审批中；3：审批完成；4：已关闭
      let columnValue = "";
      if (state == "-2") {
        columnValue = '已撤回';
      } else if (state == "-1") {
        columnValue = '已驳回';
      } else if (state == "0") {
        columnValue = '初始';
      } else if (state == "1") {
        columnValue = '已提交';
      } else if (state == "2") {
        columnValue = '审批中';
      } else if (state == "3") {
        columnValue = '审批完成';
      } else if (state == "4") {
        columnValue = '已关闭';
      }
      return columnValue;
    },
    createConfig(title, data, paths) {
      let path = paths;
      let childrenTitle = title;
      // console.log("%%%%%%%%%%%%%%", data.definitionId);
      let params = { definitionId: data.definitionId };
      params.number = data.number || "";
      this.customAddDynamicRoute(path, childrenTitle, params);
    },
    customAddDynamicRoute(path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params,
      };
      addDynamicRoute(routeParams, this.$router);
    },
    doOperate (type, row) {
      if (type === "4") {
        let params = { code: row.code, taskId: row.taskId }
        if (row.type == '卡号入库申请') {
          this.customAddDynamicRoute(this.tableData[0].path, row.type, params);
        } else if (row.type == '卡号使用授权申请') {
          this.customAddDynamicRoute(this.tableData[1].path, row.type, params);
        } else if (row.type == '卡号注销申请') {
          this.customAddDynamicRoute(this.tableData[2].path, row.type, params);
        } else if (row.type == '手机入库申请') {
          this.customAddDynamicRoute(this.tableData[3].path, row.type, params);
        } else if (row.type == '手机使用授权申请') {
          this.customAddDynamicRoute(this.tableData[4].path, row.type, params);
        } else if (row.type == '手机注销申请') {
          this.customAddDynamicRoute(this.tableData[5].path, row.type, params);
        }
      } else if (type === "3") {
        // 201 审批记录
        this.addOrUpdataVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(
            '审批记录',
            "201",
            row
          );
        })
      } else if (type === "1") {
        // 查看
        this.addOrUpdataVisible = true;
        let selectData = { code: row.code, taskId: '' };
        if (row.type == '卡号入库申请' || row.type == '卡号注销申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '查看',
              "211",
              selectData
            );
          })
        } else if (row.type == '卡号使用授权申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '查看',
              "213",
              selectData
            );
          })
        } else if (row.type == '手机入库申请' || row.type == '手机注销申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '查看',
              "221",
              selectData
            );
          })
        }  else if (row.type == '手机使用授权申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '查看',
              "223",
              selectData
            );
          })
        }
      } else if (type === "2") {
        // 审批 卡号入库、注销
        this.addOrUpdataVisible = true;
        let selectData = { code: row.code, taskId: row.taskId };
        if (row.type == '卡号入库申请' || row.type == '卡号注销申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '审批',
              "212",
              selectData
            );
          })
        } else if (row.type == '卡号使用授权申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '审批',
              "214",
              selectData
            );
          })
        } else if (row.type == '手机入库申请' || row.type == '手机注销申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '审批',
              "222",
              selectData
            );
          })
        }  else if (row.type == '手机使用授权申请') {
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              '审批',
              "224",
              selectData
            );
          })
        }
      }
    },
    revert (processId) {
      this.$confirm('确认撤回该流程？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.get(`/ctc/resource/activiti/apply/callBack/${processId}`).then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.getDoneData()
          }
        }).catch(() => {
          this.dataListLoading = false;
        });
      })
    },
    close (processId) {
      this.$confirm('确认关闭该流程？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.get(`/ctc/resource/activiti/task/close/${processId}`).then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.getDoneData()
          }
        }).catch(() => {
          this.dataListLoading = false;
        });
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.biaodan {
  width: 700px;
}
.from {
  display: flex;
  justify-content: flex-start;
}
.dialog-footer {
  text-align: center;
}
</style>
