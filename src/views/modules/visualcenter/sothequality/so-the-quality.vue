<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="归属省份">
              <el-cascader v-model="provinceList" :show-all-levels="false"
              :props="optionProps" :options="organizeList"
              placeholder="请先选择省份" clearable collapse-tags></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目经理">
              <ctc-project-user-table ref="childcom" v-model="managerList" placeholder="请选择项目经理"></ctc-project-user-table>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table max-height="660" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column width="140" prop="organizeName" label="省份/机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pcounts" label="项目数" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="quanlityDetailHandle(scope.row.organizeId)">{{ scope.row.pcounts }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="pcCounts" label="子项目数" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="quanlityChildDetailHandle(scope.row.organizeId)">{{ scope.row.pcCounts }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="taskCounts" label="任务数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="caseCounts" label="用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="passCaseCounts" label="通过用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="failCaseCounts" label="不通过用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="casePassRate" label="用例通过率" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="caseExecRate" label="用例执行率" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="caseExecPassRate" label="执行通过率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="caseDefectCounts" label="缺陷数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="caseRepairedCounts" label="待修复缺陷" header-align="center" align="center"></el-table-column>
        <el-table-column width="160" fixed="right" :render-header="resetTableHead" prop="actStartDate" label="实际开发日期" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.actStartDate || '暂无'}}</p>
          </template>
        </el-table-column>
        <el-table-column width="160" fixed="right" :render-header="resetTableHead" prop="actEndDate" label="实际结束日期" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.actEndDate || '暂无'}}</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <quanlityProject v-if="quanlityDetail" ref="qualityProject" @refreshDataList="getDataList"></quanlityProject>
      <childQuanlityProject v-if="childQuanlityDetail" ref="qualityChildProject" @refreshDataList="getDataList"></childQuanlityProject>
    </div>
  </el-card>
</template>

<script>
import childQuanlityProject from '@/views/modules/visualcenter/sothequality/childProjectHandle'
import quanlityProject from '@/views/modules/visualcenter/sothequality/projectHandle'
import CtcProjectUserTable from '@/views/modules/visualcenter/component/ctc-project-user-table'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      // isResouceShow: 0,
      optionProps: {
        expandTrigger: 'hover',
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'list'
      },
      // 索引经理
      managerList: '',
      // 索引省份
      provinceList: '',
      // 省份数据
      organizeList: [],
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/network/project',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        name: '',
        type: null
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  components: {
    CtcProjectUserTable,
    childQuanlityProject,
    quanlityProject
  },
  mounted () {
    this._getOrganizeList()
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.startTime = ''
          this.endTime = ''
        }
      }
    }
    // provinceList: {
    //   handler: function (newVal, oldVal) {
    //     ++this.isResouceShow
    //     this.$refs.cascaderHandle.dropDownVisible = true
    //   }
    // }
  },
  methods: {
    // 因为这里的数据是引用类型，并且前面开发时候发现一个数据回显问题导致数据没有更改，此后对状态做了一些更改
    // 以事件是为了能够解决点击回调问题，在本组件中明确使用多选属性，但是，状态被改变了。
    // closeCascader () {
    //   this.$refs.cascaderHandle.dropDownVisible = true
    // },
    // 更改数组键值key
    convertKey (arr, key) {
      let newArr = []
      let a = 0
      arr.forEach((item, index) => {
        let newObj = {}
        for (var i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newObj['id'] = `${a}`
        newArr.push(newObj)
        a++
      })
      return newArr
    },
    /*
      @params: Array(el-select<object>)
      省份多选选择器更改条件
    */
    provinceHandle (e) {
      var _this = this
      _this.provinceList = e
    },
    // 重置初始条件状态
    resetSelectInfo () {
      this.$refs.childcom.showUserName = ''
      this.dateTimeArr = ''
      this.startTime = ''
      this.endTime = ''
      this.provinceList = ''
      this.managerList = ''
      this.getDataList()
    },
    // 获取信息
    _getOrganizeList () {
      this.$http.get(`/ctc/visualization/network/organize/all`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        let newKeyList = JSON.parse(JSON.stringify(this.convertKey(res.data, ['name', 'list'])))
        this.organizeList = newKeyList
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
/deep/ .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
  margin: 0 1px;
}
</style>
