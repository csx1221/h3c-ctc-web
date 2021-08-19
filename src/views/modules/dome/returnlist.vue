<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params">
      <el-form label-position="top" :inline="true" ref="ruleForm" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目/子项目名称">
              <el-input v-model="dataForm.name" placeholder="请输入项目/子项目名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类别">
              <el-select v-model="dataForm.category" placeholder="请选择项目类别">
                <el-option label="生产" value="1"></el-option>
                <el-option label="非生产" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目范围">
              <el-select v-model="dataForm.scope" placeholder="请选择项目范围">
                <el-option label="全网" value="1"></el-option>
                <el-option label="集中化" value="2"></el-option>
                <el-option label="全网&集中化" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目状态">
              <el-select filterable="true" remote v-model="dataForm.state" placeholder="请选择项目状态">
                <el-option label="未开始" value="1"></el-option>
                <el-option label="正常在测" value="2"></el-option>
                <el-option label="正常完成" value="3"></el-option>
                <el-option label="延期在测" value="4"></el-option>
                <el-option label="延期完成" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目经理">
              <el-cascader :options="dataForm.pop" placeholder="请选择项目经理" filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属机构">
              <el-cascader :options="dataForm.institutions" placeholder="请选择归属机构" filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-button v-if="$hasPermission('dome:returnlist:new')" type="primary" @click="addOrUpdateHandle('',0)">创建项目</el-button>
          <el-button v-if="$hasPermission('dome:returnlist:new')" type="primary" @click="addOrUpdateHandle('',1)">创建子项目</el-button>
          <el-button type="primary" @click="deletePro()" :disabled="dele">删除</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="searchList()">查询</el-button>
          <el-button @click="reset('ruleForm')">重置</el-button>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-table :data="dataList"  style="width: 100%;margin-bottom: 20px;">
          <el-table-column style="text-align: center;" prop="num" :label="$t('dome.num')" width="90"></el-table-column>
        </el-table>
      </el-row> -->
        <el-table :data="dataList" highlight-current-row @current-change="handleCurrentChange" row-key="id"  style="width: 100%;margin-bottom: 20px;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column style="text-align: center;" prop="num" :label="$t('dome.num')" width="90"></el-table-column>
        <el-table-column prop="name" :label="$t('dome.name')" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="state" :label="$t('dome.state')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="level" :label="$t('dome.level')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="category" :label="$t('dome.category')" header-align="center" align="center" width="150" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="scope" :label="$t('dome.scope')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="obj" :label="$t('dome.obj')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="manager" :label="$t('dome.pop')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="date" :label="$t('dome.time')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="institutions" :label="$t('dome.institutions')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="time" :label="$t('完成时间')" header-align="center" align="center"></el-table-column>
        <el-table-column  :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update :modify='meth' v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
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
      mixinViewModuleOptions: {
        getDataListURL: '/dome/returnlist/page',
        getDataListIsPage: true,
        deleteURL: '/dome/returnlist',
        deleteIsBatch: true
      },
      addOrUpdateVisible: false,
      dele: false,
      meth: '',
      currentRow: null, // 选中列表
      dataForm: {
        name: '',
        category: '',
        scope: '',
        state: '',
        pop: [{
          value: 'shenzhenzhognyigongsi',
          label: '深圳中移公司',
          children: [{
            vlalue: 'wangyan',
            label: '王燕'
          },
          {
            value: 'zixu',
            label: '贾子旭'
          },
          {
            value: 'shenchen',
            label: '沈晨'
          },
          {
            value: 'fengguangming',
            label: '冯光明'
          },
          {
            value: 'chendongfen',
            label: '陈东分'
          }]
        }],
        institutions: [{
          value: 1,
          label: '中移信息技术公司'
        },
        {
          value: 2,
          label: '深圳中移信息测试公司'
        }],
        data: ''
      },
      dataList: [{
        id: 1,
        num: '1',
        name: '需求调研测试项目',
        state: '正常在测',
        level: '重要',
        category: '生产',
        scope: '集中化',
        obj: '12',
        manager: '王燕',
        date: '2020-3-11至2020-3-18',
        institutions: '中移信息技术公司',
        time: '2002-03-27 11:07:23',
        children: [{
          id: 12,
          num: '1-2',
          name: '　　需求调研测试项目',
          state: '正常在测',
          level: '重要',
          category: '生产',
          scope: '集中化',
          obj: '12',
          manager: '王燕',
          date: '2020-3-11至2020-3-18',
          institutions: '中移信息技术公司',
          time: '2002-03-27 11:07:23',
          children: []
        }]
      }]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    reset () {
      console.log(1)
    },
    deletePro () { // 删除归档任务，缺少接口
      if (this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      }
      if (this.currentRow.children.length === 0) {
        this.$message.error('成功删除!') // 删除接口的地址
      } else {
        this.$message.error('请先删除子项目!')
      }
    },
    handleCurrentChange (val) {
      this.currentRow = val
      console.log(this.currentRow)
    }
  }
  // mounted: {
  // 请求项目列表
  //   getDataList () {
  //   },
  //   searchList () {
  //   }
  // }
}
</script>
