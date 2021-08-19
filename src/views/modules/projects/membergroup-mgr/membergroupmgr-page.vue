<template>
  <el-row class="project-mgr-page member-group-mgr">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-row>
          <el-col :span="12">
            <el-form :model="dataForm" :inline="false" label-position="right" label-width="90px">
              <el-form-item label="项目组名称">
                <el-input v-model="dataForm.userGroupName" placeholder="请输入项目组名称"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
            <el-button size="small" @click="onReset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
          <el-col :span="12" class="split-line" style="text-align:left;">
            成员组列表
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <!--
            <el-button type="blue" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
            <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
            -->
          </el-col>
        </el-row>

        <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="userGroupName" label="项目组名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userGroupDevMemberCount" label="成员数量" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <div style="color:#4190f7;cursor:pointer;" @click="searchUsersInfo(scope.row)">{{scope.row.userGroupMemberCount}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userGroupDevMemberCount" label="成员用户名" header-align="center" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.userGroupMemberNames.join("，")}}
            </template>
          </el-table-column>
          <!--
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userGroupId)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.userGroupId)">删除</el-button>
            </template>
          </el-table-column>
          -->
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <ctc-data-tag :visible.sync="visibleDataTag" :tagDataMap="tagDataMap"></ctc-data-tag>
        <search-member-info :visible.sync="searchMemberInfo" ref="searchMemberInfo"></search-member-info>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './membergroup-add-or-update'
import SearchMemberInfo from './search-member-info'
export default {
  mixins: [mixinViewModule],
  name: 'MembergroupmgrPage',
  components: {
    AddOrUpdate, SearchMemberInfo
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/project/userGroup/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/project/userGroup',
        deleteIsBatch: true,
        deleteIsBatchKey: 'userGroupId'
      },
      dataForm: {
        userGroupName: ''
      },
      visibleDataTag: false,
      searchMemberInfo: false,
      tagDataMap: {}
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    onReset () {
      this.dataForm.userGroupName = ''
      this.getDataList()
    },
    searchUsersNumberInfo (row) {
      this.visibleDataTag = true
      this.tagDataMap.title = '成员详情'
      this.tagDataMap.tagData = row.userGroupMemberNames
    },
    searchUsersInfo (row) {
      this.$refs.searchMemberInfo.userGroupId = row.userGroupId
      this.$refs.searchMemberInfo.init()
    }
  }
}
</script>
<style lang="scss">
.member-group-mgr {
  .el-message-box {
    width: 800px;
  }
}
</style>
