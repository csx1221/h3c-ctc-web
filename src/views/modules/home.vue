<template>
  <div class="mod-home">
    <el-row>
      <el-col :span="24">
        <head-list :roleType="roleType" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <my-work-order :roleType="roleType" />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="height: 700px;overflow-y: auto">
      <el-col :span="12" class="isVflex">
        <div>
          <shortcuts :roleType="roleType" />
        </div>
        <div class="isVflexGutter"></div>
        <div style="flex: 1">
          <testShop />
        </div>
      </el-col>
      <el-col :span="12" class="isVflex" style="overflow:auto;">
        <div style="height: 294px;">
          <project-announcement :roleType="roleType" />
        </div>
        <div class="isVflexGutter"></div>
        <div style="flex: 1">
          <personal-information />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headList from '@/views/modules/homePage/headList'
import myWorkOrder from '@/views/modules/homePage/myWorkOrder'
import task from '@/views/modules/homePage/task'
import taskType from '@/views/modules/homePage/taskType'
import shortcuts from '@/views/modules/homePage/shortcuts'
import testShop from '@/views/modules/homePage/testShop'
import projectAnnouncement from '@/views/modules/homePage/projectAnnouncement'
import personalInformation from '@/views/modules/homePage/personalInformation'
export default {
  name: 'home',
  data () {
    return {
      roleType: ''
    }
  },
  mounted () {
    let roleType = this.$store.state.user.roleType
    if ([0, '01', '04', '05', '06', '07'].includes(roleType)) {
      this.roleType = '0' // 0超管 1项目经理 2测试人员 3开发和配置人员
    } else if (['02', '03', '08', '09', '10'].includes(roleType)) {
      this.roleType = '1' // 0超管 1项目经理 2测试人员 3开发和配置人员
    } else if (['12'].includes(roleType)) {
      this.roleType = '2' // 0超管 1项目经理 2测试人员 3开发和配置人员
    } else if (['11', '13', '14', '15'].includes(roleType)) {
      this.roleType = '3' // 0超管 1项目经理 2测试人员 3开发和配置人员
    }
  },
  methods: {
  },
  components: {
    headList,
    myWorkOrder,
    task,
    taskType,
    shortcuts,
    testShop,
    projectAnnouncement,
    personalInformation
  }
}
</script>
<style scoped lang="scss">
.mod-home {
  background-color: #f1f4f5;
  line-height: 1.15;
  margin: -20px 0;
  .el-row {
    margin: 20px 0;
    .el-col {
      height: 100%;
    }
  }
}
.bcw {
  background-color: #ffffff;
  border-radius: 6px;
  height: 100%;
}
.isVflex {
  display: flex;
  flex-flow: column;
  .isVflexTop {
    flex: 1;
    overflow: auto;
  }
  .isVflexBottom {
    flex: 2;
  }
  .isVflexGutter {
    height: 20px;
  }
}
</style>
