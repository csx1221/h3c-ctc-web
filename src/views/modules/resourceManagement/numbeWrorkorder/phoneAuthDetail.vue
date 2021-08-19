<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <el-form
        ref="dataForm"
        :rules="dataRule"
        :model="dataForm"
        label-width="100px"
        class="biaodan"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="申请标题:" prop="title">
              <el-input disabled v-model="dataForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="from">
          <el-form-item label="授权类型:" prop="authorizeType">
            <el-select
              disabled
              v-model="dataForm.authorizeType"
              defaultValue="lucy"
              clearable
              filterable
              placeholder="系统类别"
              value-key="moduleId"
            >
              <el-option key="0" label="人员" value="0">人员</el-option>
              <el-option key="1" label="部门" value="1">部门</el-option>
              <el-option key="2" label="角色" value="2">角色</el-option>
              <el-option key="3" label="项目" value="3">项目</el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="from">
          <div style="width: 100px; textalign: right; paddingright: 12px">
            授权项:
          </div>
          <!-- 人员列表 -->
          <el-table
            v-if="dataForm.authorizeType == 0"
            v-loading="dataListLoading"
            :data="authorizeList"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="realName"
              label="姓名"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="organizeName"
              label="所属机构 / 部门"
              header-align="center"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.deptName">
                  {{ scope.row.organizeName }} / {{ scope.row.deptName }}</span
                >
                <span v-else> {{ scope.row.organizeName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 部门列表 -->
          <el-table
            v-else-if="dataForm.authorizeType == 1"
            v-loading="dataListLoading"
            :data="authorizeList"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="部门名称"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="organizeName"
              label="所属机构"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="userCount"
              label="用户数"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <!-- 角色列表 -->
          <el-table
            v-else-if="dataForm.authorizeType == 2"
            v-loading="dataListLoading"
            :data="authorizeList"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="角色名称"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <!-- 项目列表 -->
          <el-table
            :data="authorizeList"
            border
            style="width: 100%"
            v-else-if="dataForm.authorizeType == 3"
          >
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50"
            ></el-table-column>
            <template v-for="(item, index) in projectTableTitleData">
              <el-table-column
                v-if="item.code != 'operate'"
                :key="index"
                :label="item.name"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-html="getTableColumnData(scope.row, item)"></span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div class="from">
          <div style="width: 100px; textalign: right; paddingright: 12px">
            授权列表:
          </div>
          <el-table
            v-loading="dataListLoading"
            :data="dataForm.mobilePhoneList"
            border
            style="width: 100%"
          >
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
            ></el-table-column>
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
        </div>
        <div class="from">
          <el-form-item prop="authorizeDate" label="授权日期:">
            <el-radio-group disabled v-model="dataForm.authorizeDate">
              <el-radio label="1">短期</el-radio>
              <el-radio label="2">长期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="dataForm.authorizeDate === '1'"
            prop="date"
            label=""
            disabled
          >
            <el-date-picker
              disabled
              v-model="dataForm.date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="申请理由:" prop="desc">
          <el-input disabled type="textarea" v-model="dataForm.desc"></el-input>
        </el-form-item>
        <el-col :span="24" style="margin-top: 24px" v-if="taskId">
          <el-card shadow="never" class="aui-card--fill">
            <el-row style="margin-bottom: 20px">
              <el-col :span="12" class="split-line" style="text-align: left">
                审批
              </el-col>
            </el-row>
            <el-form-item prop="status" label="审批结果:">
              <el-radio-group v-model="dataForm.status">
                <el-radio label="y">同意</el-radio>
                <el-radio label="n">不同意</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见:" prop="descript">
              <el-input type="textarea" v-model="dataForm.descript"></el-input>
            </el-form-item>
          </el-card>
        </el-col>
      </el-form>
      <div align="center" style="margintop: 20px" v-if="taskId">
        <el-button
          type="primary"
          size="middle"
          @click="handleSubmit(dataForm)"
          style="margin: 0px 0 20px 80px"
          >提交</el-button>
        <el-button
          type="primary"
          size="middle"
          @click="handleCancel()"
          style="margin: 0px 0 20px 80px"
          >取消</el-button>
      </div>
    </el-row>
  </el-card>
</template>

<script>
/* eslint-disable */
import mixinViewModule from "@/mixins/view-module";
export default {
  name: "accountApplication",
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/ctc/visualization/report/participant/pass",
        getDataListIsPage: true,
      },
      authorizeList: [],
      projectTableTitleData: [
        { code: "name", name: "项目名称" },
        { code: "projectStatus", name: "状态" },
        { code: "level", name: "级别" },
        { code: "scope", name: "范围" },
        { code: "managerName", name: "项目经理" },
        { code: "organizeIdName", name: "归属机构" },
        { code: "createDate", name: "创建时间" },
      ],
      dataForm: {
        title: "", // 标题
        authorizeType: "", // 授权类型  	0-人员（缺省）；1-部门；2-角色；3-项目
        authorizeKeyList: [], // 授权项
        mobilePhoneList: [], // 授权手机列表
        authorizeDate: "1", // 授权日期   false: 短期   true:  长期
        date: "", // 短期日期区间
        reason: "", // 申请理由
      },
      dataList: [],
      taskId: "",
    };
  },
  props: {
    selectData: Object,
  },
  mounted() {
    this.taskId = this.selectData.taskId;
    this.getDetailData();
  },
  methods: {
    translateData(data) {
      let thisvm = this;
      Object.keys(data).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (data[key] === null) {
              thisvm.dataForm[key1] = "";
            } else {
              thisvm.dataForm[key1] = data[key];
            }
          }
        });
      });
    },
    getDetailData() {
      let code = this.selectData.code;
      this.$http
        .get(`/ctc/resource/activiti/apply/applyDetail/${code}`)
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.authorizeList = res.data.authorizeKeyList
            this.translateData(res.data);
          }
        })
        .catch(() => {
          this.dataListLoading = false;
        });
    },
    // 验证是否要关联字典表
    getTableColumnData(row, item) {
      let columnValue = "";
      let bool = "projectStatus,level,category,scope".includes(item.code);
      if (bool) {
        columnValue = this.$getDictLabel(
          "project." + item.code,
          row[item.code]
        );
        columnValue = columnValue === -1 ? "" : columnValue;
      } else {
        columnValue = row[item.code];
      }
      // 特殊处理计划周期
      if (item.code === "planPeriod") {
        columnValue = row.planStartTime + "~" + row.planEndTime;
      }
      // 判断是否追加空格,保持项目名称对齐
      if (!row.hasChildren && item.code === "name") {
        columnValue = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + columnValue;
      }
      return columnValue;
    },
    handleCancel() {
      this.$emit('close');
    },
    handleSubmit() {
      let params = {
        taskId: this.selectData.taskId,
        code: this.selectData.code,
        status: this.dataForm.status,
        descript: this.dataForm.descript,
      };
      this.$http["post"]("/ctc/resource/activiti/approval/handler", params)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("审批成功");
            this.$emit('close', 'refresh');
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-form {
  display: inline-block;
}
.biaodan {
  width: 100%;
}
.from {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
