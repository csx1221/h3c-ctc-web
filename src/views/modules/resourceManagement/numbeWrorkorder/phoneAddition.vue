<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-row>
      <el-divider content-position="left"
        ><span style="color: #26c6da; font-size: 15px"
          >申请信息(带*为必填项)</span
        ></el-divider
      >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        label-width="180px"
      >
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="手机名称：" prop="name">
            <el-input
              v-model="dataForm.name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="设备序号：" prop="serialNo">
            <el-input
              v-model="dataForm.serialNo"
              placeholder="请输入"
              :disabled="dataForm.mobilephoneId ? true : false"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="系统类别：" prop="platform">
            <el-select v-model="dataForm.platform" defaultValue="lucy" clearable filterable placeholder="系统类别" value-key="moduleId" @change="chooseModule">
              <!-- 未知:0;安卓：1；IOS：2 -->
              <el-option key="0" label="未知" value="0">未知</el-option>
              <el-option key="1" label="安卓" value="1">安卓</el-option>
              <el-option key="2" label="IOS" value="2">IOS</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="系统版本：" prop="version">
            <el-input
              v-model="dataForm.version"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="分辨率：" prop="displayRadio">
            <el-input
              v-model="dataForm.displayRadio"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="厂商：" prop="manufacturer">
            <el-input
              v-model="dataForm.manufacturer"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="型号：" prop="model">
            <el-input
              v-model="dataForm.model"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="内存：" prop="mem">
            <el-input
              v-model="dataForm.mem"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
         <el-form-item prop="ownerId" label="负责人：">
            <ctc-user-table v-model="dataForm.ownerId" placeholder="请选择负责人" :userName2.sync="dataForm.owner" :userId.sync="dataForm.ownerId" :type="1"></ctc-user-table>
            <el-input v-model="dataForm.ownerId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="负责人联系方式：" prop="contract">
            <el-input
              v-model="dataForm.contract"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="备注：" prop="descript">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入"
              v-model="dataForm.descript"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div align="center">
      <el-button type="primary" size="small" @click="$emit('close')"
        >取消</el-button
      >
      <el-button type="primary" size="small" @click="submitResult(dataForm)">{{
        $t("confirm")
      }}</el-button>
    </div>
  </el-card>
</template>

<script>
/* eslint-disable */
import { isMobile } from "@/utils/validate";

export default {
  name: "phoneAddition",
  data() {
    let validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        return callback(
          new Error(this.$t("validate.format", { attr: "手机号码" }))
        );
      }
      callback();
    };
    return {
      dataForm: {
        mobilephoneId: "",
        name: "",
        serialNo: "",
        platform: "1",
        platform: "",
        version: "",
        displayRadio: "",
        model: "",
        manufacturer: "",
        handler: "",
        mem: "",
        owner: "",
        ownerId: "",
        // contract: "",
        descript: "",
      },
      dataRule: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        serialNo: [{ required: true, message: "请输入", trigger: "blur" }],
        platform: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        version: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        displayRadio: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        model: [{ required: true, message: "请输入", trigger: "blur" }],
        mem: [{ required: true, message: "请输入", trigger: "blur" }],
        ownerId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
      },
    };
  },
  props: {
    selectData: Object,
  },
  computed: {},
  mounted() {
    let thisvm = this;
    if (this.selectData) {
      Object.keys(thisvm.selectData).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (thisvm.selectData[key] === null) {
              thisvm.dataForm[key1] = "";
            } else {
              thisvm.dataForm[key1] = thisvm.selectData[key];
            }
          }
        });
      });
    }
  },
  methods: {
    chooseModule () {

    },
    submitResult(res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    submitData() {
      let thisvm = this;
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open();
      let params = { ...this.dataForm, mobilephoneId: this.dataForm.mobilephoneId };
      thisvm.$http["post"](
        this.dataForm.mobilephoneId
          ? "/ctc/resource/MobilePhone/updateMobilephone"
          : "/ctc/resource/activiti/mobilephone/save",
        params
      )
        .then(({ data: res }) => {
          thisvm.$ctcLoading.close();
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg);
          } else {
            this.$message.success(
              this.dataForm.mobilephoneId ? "修改成功" : "创建成功"
            );
            this.$emit('close', res.data);
          }
          
        })
        .catch(() => {
          thisvm.$ctcLoading.close();
        });
    },
  },
};
</script>

<style scoped lang="scss">
.accStyle {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
