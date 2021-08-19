<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-divider content-position="left">
      <span style="color: #26c6da; font-size: 15px"
        >申请单信息</span
      ></el-divider
    >
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
            <el-input v-model="dataForm.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="from">
        <el-form-item label="授权类型:" prop="authorizeType">
          <el-select
            v-model="dataForm.authorizeType"
            defaultValue="lucy"
            clearable
            filterable
            placeholder="系统类别"
            value-key="moduleId"
            @change="chooseModule"
          >
            <el-option key="0" label="人员" value="0">人员</el-option>
            <el-option key="1" label="部门" value="1">部门</el-option>
            <el-option key="2" label="角色" value="2">角色</el-option>
            <el-option key="3" label="项目" value="3">项目</el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="createConfig('新增授权项', '11')"
          style="marginLeft: 20px; marginBottom: 22px"
          >选择内容项</el-button
        >
      </div>
      <div class="from">
        <div style="width: 100px; textAlign: right; paddingRight: 12px">
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
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(1, scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
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
          <!-- <el-table-column
            prop="createDate"
            label="创建时间"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(1, scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
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
          <!-- <el-table-column
            prop="createDate"
            label="创建时间"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(1, scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 项目列表 -->
        <el-table :data="authorizeList" border style="width: 100%" v-else-if="dataForm.authorizeType == 3">
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
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(1, scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="from">
        <div style="width: 100px; textAlign: right; paddingRight: 12px">
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
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="deleteOperate(2, scope.$index)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button
        type="primary"
        size="middle"
        @click="createConfig('增加手机', '12')"
        style="margin: 0px 0 20px 100px"
        >增加手机</el-button
      >
      <div class="from">
        <el-form-item prop="authorizeDate" label="授权日期:">
          <el-radio-group v-model="dataForm.authorizeDate">
            <el-radio label="1">短期</el-radio>
            <el-radio label="2">长期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.authorizeDate === '1'"
          prop="date"
          label=""
        >
          <el-date-picker
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
        <el-input type="textarea" v-model="dataForm.desc"></el-input>
      </el-form-item>
    </el-form>
    <div align="center" style="margintop: 20px">
      <el-button
        type="primary"
        size="middle"
        @click="handleSubmit(dataForm)"
        style="margin: 0px 0 20px 0px"
        >提交申请</el-button
      >
      <el-button
        type="primary"
        size="middle"
        @click="handleCancel()"
        style="margin: 0px 0 20px 80px"
        >取消</el-button
      >
    </div>
    <add-or-updata
      v-if="addOrUpdataVisible"
      ref="addOrUpdata"
      @refreshAuth="getAuthData"
      @refresh="getPhoneData"
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
      isOpen: false,
      addOrUpdataVisible: false,
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
      dataRule: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        authorizeType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        date: [
          {
            validator: (rule, value, callback) => {
              if (this.authorizeDate == '1') {
                callback()
              } else {
                if (value) {
                  callback()
                } else {
                  callback(new Error())
                }
              }
            },
            message: '请选择',
            trigger: 'change'
          }
        ],
      },
    };
  },
  computed: {},
  mounted() {
    console.log(this.$route.params)
    if (this.$route.params.code) {
      this.getDetailData()
    }
  },
  methods: {
    translateData (data) {
      let thisvm = this
      Object.keys(data).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (data[key] === null) {
              thisvm.dataForm[key1] = ''
            } else {
              thisvm.dataForm[key1] = data[key]
            }
          }
        })
      })
    },
    getDetailData () {
      let code = this.$route.params.code
      this.$http.get(`/ctc/resource/activiti/apply/applyDetail/${code}`).then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.authorizeList = res.data.authorizeKeyList;
            this.translateData(res.data);
          }
        }).catch(() => {
          this.dataListLoading = false;
        });
    },
    getAuthData(data) {
      // console.log(data);
      if (Array.isArray(data)) {
        // this.authorizeList.push(...data);
        this.authorizeList = data
      }
      console.log(this.authorizeList);
    },
    getPhoneData(data) {
      this.dataForm.mobilePhoneList = data
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
    chooseModule(val) {
      this.authorizeList = [];
    },
    createConfig(title, type, data) {
      // 11、新增授权项  12、新增手机
      if (type === "11") {
        let authType = this.dataForm.authorizeType;
        if (authType == "") {
          this.$message.warning("请选择授权类型");
        } else {
          this.addOrUpdataVisible = true;
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              title,
              "11" + this.dataForm.authorizeType
            );
            this.$refs.addOrUpdata.selectData = this.authorizeList
          });
        }
      } else if (type === "12") {
        this.addOrUpdataVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init(title, "12");
          this.$refs.addOrUpdata.selectData = this.dataForm.mobilePhoneList
        });
      }
    },
    customAddDynamicRoute(path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {},
      };
      addDynamicRoute(routeParams, this.$router);
    },
    deleteOperate(type, index) {
      if (type == 1) {
        this.authorizeList.splice(index, 1);
      } else if (type == 2) {
        this.dataForm.mobilePhoneList.splice(index, 1);
      }
    },
    // 关闭当前窗口
    closeCurrentTab() {
      var tabName = this.$store.state.contentTabsActiveName;
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(
        (item) => item.name !== tabName
      );
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName =
          this.$store.state.contentTabsActiveName = "home";
        return false;
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({
          name: this.$store.state.contentTabs[
            this.$store.state.contentTabs.length - 1
          ].name,
        });
      }
    },
    handleCancel() {
      this.closeCurrentTab();
    },
    handleSubmit() {
      let thisvm = this;
      let code = this.$route.params.code
      let taskId = this.$route.params.taskId
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.dataForm.mobilePhoneList.length === 0) {
            thisvm.$message.warning("手机数据为空，请至少添加一条数据");
          } else if (this.authorizeList.length === 0) {
            thisvm.$message.warning("授权项数据为空，请至少添加一条数据");
          } else {
            let params = { ...this.dataForm, definitionId: 5, taskId: taskId };
            // 特殊处理创建日期、修改日期 1 false  短期 ；2 true 长期
            if (params.authorizeDate == 1) {
              params.authorizeDate = false
              if (params.date.length > 0) {
                params.startTime = params.date[0];
                params.endTime = params.date[1];
                delete params["date"];
              }
            } else if (params.authorizeDate == 2) {
              params.authorizeDate = true
            }
            
            for (var k = 0, length = this.authorizeList.length; k < length; k++) {
              if (params.authorizeType == 3) {
                params.authorizeKeyList.push(this.authorizeList[k].projectId)
              } else {
                params.authorizeKeyList.push(this.authorizeList[k].id)
              }
            }
            thisvm.$http["post"](
              code ? '/ctc/resource/activiti/apply/resubmitMobilePhoneAuthApply' : "/ctc/resource/activiti/apply/addMobilePhoneAuthApply",
              params
            )
              .then(({ data: res }) => {
                if (res.code !== 0) {
                  return thisvm.$message.error(res.msg);
                } else {
                  thisvm.$message.success(
                    code ? '修改成功' : '创建成功'
                  );
                  thisvm.closeCurrentTab();
                }
              })
              .catch(() => {});
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.biaodan {
  width: 100%;
}
.from {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
