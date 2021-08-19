<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :width="getTitleWidth()"
    class="add-require"
    append-to-body
  >
    <template v-if="type === '1' || type === '2'">
      <!--            新增与编辑号码-->
      <number-addition
        :selectData="selectData"
        @close="close"
      ></number-addition>
    </template>
    <template v-else-if="type === '3'">
      <!--            批量导入-->
      <batch-import :selectData="selectData" @close="close"></batch-import>
    </template>
    <template v-else-if="type === '4'">
      <!--            清理设置-->
      <cleanup-settings
        :selectData="listId"
        :operationType="operationType"
        @close="close"
      ></cleanup-settings>
    </template>
    <template v-else-if="type === '5'">
      <!--            短信详情-->
      <s-m-s-details :selectData="selectData" @close="close"></s-m-s-details>
    </template>
    <template v-else-if="type === '6'">
      <!--            号码查看-->
      <number-detail :selectData="selectData" @close="close"></number-detail>
    </template>
    <template v-else-if="type === '7'">
      <!--            批量锁定-->
      <number-lock-batch  :selectData="listId"  :lockState="lockState"  @close="close"></number-lock-batch>
    </template>
    <template v-else-if="type === '8'">
      <!--            操作历史-->
      <number-operation-history
        :selectData="selectData"
        @close="close"
      ></number-operation-history>
    </template>
    <template v-else-if="type === '9'">
      <!--            新增与编辑，手机-->
      <phone-addition :selectData="selectData" @close="close"></phone-addition>
    </template>
    <template v-else-if="type === '10'">
      <!--          手机  批量导入-->
      <phone-batch-import
        :selectData="selectData"
        @close="close"
      ></phone-batch-import>
    </template>
    <template v-else-if="type === '11'">
      <!--          批量获取APP测试未入库手机-->
      <mobile-phone-list
        :selectData="selectData"
        @close="close"
      ></mobile-phone-list>
    </template>
    <template v-else-if="type === '12'">
      <!--          手机  批量导入-->
      <phone-list  :selectData="selectData"  @close="close"></phone-list>
    </template>
    <template v-else-if="type === '50'">
      <!--          卡号  批量导入-->
      <number-list  :selectData="selectData"  @close="close"></number-list>
    </template>
    <template v-else-if="type === '110'">
      <!--人员-->
      <user-list
        :selectData="selectData"
        @close="close"
        @closeAuth="closeAuth"
      ></user-list>
    </template>
    <template v-else-if="type === '111'">
      <!--部门-->
      <dept-list
        :selectData="selectData"
        @close="close"
        @closeAuth="closeAuth"
      ></dept-list>
    </template>
    <template v-else-if="type === '112'">
      <!--角色-->
      <role-list
        :selectData="selectData"
        @close="close"
        @closeAuth="closeAuth"
      ></role-list>
    </template>
    <template v-else-if="type === '113'">
      <!--项目-->
      <project-list
        :selectData="selectData"
        @close="close"
        @closeAuth="closeAuth"
      ></project-list>
    </template>
    <template v-else-if="type === '201'">
      <!--审批记录-->
      <approval-record
        :recordData="recordData"
        @close="close"
      ></approval-record>
    </template>
    <template v-else-if="type === '211' || type === '212'">
      <!--卡号入库、注销详情、审批-->
      <number-add-detail
        :selectData="recordData"
        @close="close"
      ></number-add-detail>
    </template>
    <template v-else-if="type === '221' || type === '222'">
      <!--手机入库、注销详情、审批-->
      <phone-storage-detail
        :selectData="recordData"
        @close="close"
      ></phone-storage-detail>
    </template>
    <template v-else-if="type === '223' || type === '224'">
      <!--手机使用授权申请审批-->
      <phone-auth-detail
        :selectData="recordData"
        @close="close"
      ></phone-auth-detail>
    </template>
    <template v-else-if="type === '213' || type === '214'">
      <!--卡号使用授权申请审批-->
      <number-auth-detail
        :selectData="recordData"
        @close="close"
      ></number-auth-detail>
    </template>
  </el-dialog>
</template>
<script>
/* eslint-disable */
import numberAddition from "./numberAddition"; // 号码新增编辑
import phoneAddition from "./phoneAddition"; // 手机新增编辑
import numberDetail from "./numberDetail"; // 号码查看
import batchImport from "./batchImport"; // 批量导入
import phoneBatchImport from "./phoneBatchImport"; // 手机批量导入
import cleanupSettings from "../SMSManagement/cleanupSettings"; // 清理设置
import SMSDetails from "../SMSManagement/SMSDetails"; // 短信详情
import numberLockBatch from "../numberStateManagement/numberLockBatch"; // 批量锁定
import numberOperationHistory from "@/views/modules/resourceManagement/numberStateManagement/numberOperationHistory"; // 操作历史
import phoneList from "./phoneList"; // 批量导入
// import numberList from "./numberList"; //卡号批量导入
import mobilePhoneList from "./mobilePhoneList"; // 未入库手机批量
import userList from "./userList"; // 用户
import deptList from "./deptList"; // 部门
import roleList from "./roleList"; // 角色
import projectList from "./projectList"; // 项目
import approvalRecord from "./approvalRecord"; // 审批记录
// import numberCartimpower from "./numberCartimpower";
import numberAddDetail from "./numberAddDetail"; // 卡号入库、注销详情、审批
import phoneStorageDetail from "./phoneStorageDetail"; // 手机入库、注销详情、审批
import phoneAuthDetail from "./phoneAuthDetail"; // 手机使用授权申请审批
import numberAuthDetail from "./numberAuthDetail"; // 卡号使用授权申请审批

export default {
  name: "AddRequire",
  components: {
    numberAddition,
    phoneAddition,
    batchImport,
    phoneBatchImport,
    cleanupSettings,
    SMSDetails,
    numberDetail,
    numberLockBatch,
    numberOperationHistory,
    phoneList,
    // numberList,
    mobilePhoneList,
    userList,
    deptList,
    roleList,
    projectList,
    approvalRecord,
    // numberCartimpower,
    numberAddDetail,
    phoneStorageDetail,
    phoneAuthDetail,
    numberAuthDetail
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      title: "",
      type: "",
      selectionList: [], // 选中账号列表
      selectData: {}, // 选中账号
      recordData: {}, // 选中流程
      listId: [],
      lockState: "", // 锁定状态
      operationType: "", // 在清理设置中 1表示单个清理 2表示批量清理
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      if (!newVal) {
        this.$emit("init");
      }
    },
  },
  methods: {
    init(title, type, data) {
      console.log(123);
      this.dialogVisible = true;
      this.title = title;
      this.type = type;
      this.recordData = data;
    },
    close(res) {
      this.dialogVisible = false;
      // console.log(res)
      if (res === "refresh") {
        this.$emit("refresh");
      } else if (typeof(res) === "object") {
        this.$emit("refresh", res);
      }
    },
    closeAuth(res) {
      this.dialogVisible = false;
      console.log(res)
      this.$emit("refreshAuth", res);
    },
    getTitleWidth() {
      let width = "100%";
      if (this.type === "4") {
        width = "40%";
      } else if (this.type === "7") {
        width = "60%";
      } else {
        width = "80%";
      }
      return width;
    },
  },
};
</script>
<style lang="scss" scoped>
.add-require {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
