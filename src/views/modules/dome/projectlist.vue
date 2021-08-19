<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params">
      <el-form label-position="right" :inline="true" ref="ruleForm" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目/子项目名称">
              <el-input v-model="dataForm.name" placeholder="请输入项目/子项目名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类别">
              <ctc-select v-model="dataForm.category" dict-type="project_category" placeholder="请选择项目类别"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目范围">
              <ctc-select v-model="dataForm.scope" dict-type="project_scope" placeholder="请选择项目范围"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目状态">
              <ctc-select v-model="dataForm.status" dict-type="project_status" placeholder="请选择项目状态"></ctc-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目经理">
              <el-cascader style="width=100%" :options="dataForm.pop" placeholder="请选择项目经理" filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属机构">
              <el-cascader :options="dataForm.institutions" placeholder="请选择归属机构" filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="dataForm.date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-button type="primary" @click="addOrUpdateHandle('',0)">创建项目</el-button>
          <el-button type="primary" @click="addOrUpdateHandle('',1)">创建子项目</el-button>
          <el-button type="primary" @click="deleteHe(currentRow.projectUuid)" :disabled="dele">删除</el-button>
          <!-- <el-button type="primary" @click="addComplete()">归档</el-button> -->
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-table :data="dataList"  style="width: 100%;margin-bottom: 20px;">
          <el-table-column style="text-align: center;" prop="num" :label="$t('dome.num')" width="90"></el-table-column>
        </el-table>
      </el-row> -->
        <el-table :data="dataList" ref="singleTable" row-key="projectId" style="width: 100%;margin-bottom: 20px;" highlight-current-row @current-change="handleCurrentChange" fit :tree-props="{children: 'childs', hasChildren: 'hasChildren'}">
        <el-table-column type="index"  :label="$t('dome.num')" width="90"></el-table-column>
        <el-table-column prop="projectName" :label="$t('dome.name')" header-align="center" min-width="150"></el-table-column>
        <!-- <el-table-column prop="projectStatus" :label="$t('dome.state')" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="projcetStatus" :label="$t('dome.state')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("project_status", scope.row.projcetStatus) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="level" :label="$t('dome.level')" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="level" :label="$t('dome.level')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("project_level", scope.row.level) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="category" :label="$t('dome.category')" header-align="center" align="center" width="150" :show-overflow-tooltip="true" ></el-table-column> -->
        <el-table-column prop="category" :label="$t('dome.category')" header-align="center" align="center">
          <!-- <template slot-scope="scope"> -->
          <template>
            {{ $getDictLabel("project_category", "0") }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="scope" :label="$t('dome.scope')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column> -->
        <el-table-column prop="scope" :label="$t('dome.scope')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("project_scope", scope.row.scope) }}
          </template>
        </el-table-column>
        <el-table-column prop="participantNum" :label="$t('dome.obj')" header-align="center" width="180" align="center"></el-table-column>
        <el-table-column prop="managerId" width="160" :label="$t('dome.pop')" header-align="center" align="center">
          河北项目经理
        </el-table-column>
        <el-table-column prop="planStartTime,planEndTiem" :label="$t('dome.time')" header-align="center"  width="170" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.planStartTime}}</p>
            <p v-if="scope.row.planStartTime !== null">至</p>
            <p>{{scope.row.planEndTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" :label="$t('dome.institutions')" header-align="center" align="center">河北省公司</el-table-column>
        <el-table-column prop="createTime" :label="$t('dome.date')" header-align="center" align="center"></el-table-column>
        <el-table-column  :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.projectUuid)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="deleteHe(scope.row.projectUuid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update :currentRow='currentRow' :modify='meth' v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './goods-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      // 请求项目列表
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/project/base/projects', // 数据列表接口，API地址
        getDataListIsPage: true, // 数据列表接口，是否需要分页？
        deleteURL: '/ctc/project/base/project', // 删除接口，API地址
        deleteIsBatch: true // 删除接口，是否需要批量？
      },
      addOrUpdateVisible: false,
      dele: false,
      meth: '',
      currentRow: null,
      dataForm: {
        name: '',
        level: '',
        scope: '',
        category: '',
        status: '',
        type: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 选择项目
    handleCurrentChange (val) {
      this.currentRow = val
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    timeOver () {
      console.log(this.dataList)
      // for (let index = 0; index < this.dataList.length; index++) {
      // this.companyList[index].toTime = this.companyList[index].planStartTime.split(' ')[0]
      // this.companyList[index].outTime = this.companyList[index].planEndTime.split(' ')[0]
      // }
    },
    addComplete () {
      console.log(this.dataList)
    }
  },
  mounted: {
    // 请求项目列表
    // 初始化重置
    resetForm (formName) {
      // console.log(2)
      // this.$refs[formName].resetFields()
    }
  }
}
</script>
