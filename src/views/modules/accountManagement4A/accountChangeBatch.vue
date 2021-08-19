<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">变更列表</span></el-divider>
            <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="电话号码" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.organizeName" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="组织" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-cascader v-model="scope.row.orgId" :props="{ checkStrictly: true }" :options="options" @change="handleChange"></el-cascader>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="地域ID" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.organizeName" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="邮箱" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.organizeName" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="可登录渠道" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <ctc-select v-model="scope.row.name" dict-type="resultDetermination" placeholder="请选择"></ctc-select>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="VPN生效时间" header-align="center" align="center" show-overflow-tooltip width="245">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.name" value-format="yyyyMMdd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="VPN失效时间" header-align="center" align="center" show-overflow-tooltip width="245">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.name" value-format="yyyyMMdd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="是否开启图形堡垒权限" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <ctc-select v-model="scope.row.name" dict-type="resultDetermination" placeholder="请选择"></ctc-select>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="域ID" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.organizeName" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="加锁状态" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <ctc-select v-model="scope.row.name" dict-type="resultDetermination" placeholder="请选择"></ctc-select>
                    </template>
                </el-table-column>
                <el-table-column prop="organizeName" label="身份证号" header-align="center" align="center" show-overflow-tooltip width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.organizeName" placeholder="请输入" clearable></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <!--            <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">-->
            <!--            </el-pagination>-->
        </el-row>
        <el-row>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="审批附件：" prop="name">
                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.productDoc"></ctc-file-upload>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div style="text-align:center;margin-top: 20px;">
            <!--                <el-button type="primary" size="small" @click="fileImport">批量录入</el-button>-->
            <el-button type="info" size="small" @click="$emit('close')">取消</el-button>
            <el-button type="primary" size="small" @click="submitResult(dataForms)">{{ $t('confirm') }}</el-button>
        </div>
    </el-card>
</template>

<script>
export default {
  name: 'accountApplication',
  data () {
    return {
      dataListLoading: false,
      dataForm: {},
      dataForms: {
        name: ''
      },
      dataRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      dataList: [],
      options: [
        {
          value: '1',
          label: '部门1',
          children: [
            {
              value: '11',
              label: '项目组11'
            },
            {
              value: '12',
              label: '项目组12'
            }]
        },
        {
          value: '2',
          label: '部门2',
          children: [
            {
              value: '21',
              label: '项目组21'
            },
            {
              value: '22',
              label: '项目组22'
            }]
        }]
    }
  },
  props: {
    // 选中列表
    selectionList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {},
  mounted () {
    this.initFileUpload()
    if (this.selectionList.length > 0) {
      this.dataList = JSON.parse(JSON.stringify(this.selectionList))
    }
  },
  methods: {
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$message.success(res)
        } else {
          return false
        }
      })
    },
    handleChange (value) {
      console.log(value)
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    }
  }
}
</script>

<style scoped>
    .el-row{
        margin-bottom: 20px;
    }
</style>
