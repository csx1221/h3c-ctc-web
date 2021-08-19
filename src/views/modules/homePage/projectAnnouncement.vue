<template>
  <div class="bcw shortcuts">
    <el-row class="shortcuts-top">
      <el-col :span="12" class="split-line" style="text-align:left;">
        项目公告
      </el-col>
    </el-row>
    <el-row class="shortcuts-bottom">
      <el-timeline>
        <template v-for="(item, index) in list">
          <el-timeline-item :timestamp="item.createDate" placement="top" :key="index" :type="item.readStatus==0?'':'primary'">
            <div @click="viewHandle(item)" style="cursor:pointer;padding:5px 10px;border:1px dashed #ccc ;">
              <el-row>
                <el-col :span="12">
                  <h2>
                    {{item.title}}（{{item.readStatus==0?'未读':'已读'}}）
                    <img v-if="item.readStatus==0" src="../../../assets/img/new.gif" style="margin-left:5px;margin-bottom:10px;" />
                  </h2>
                </el-col>
                <el-col :span="12" style="text-align:right;color:#4190f7;">
                  <h4>
                    所属项目：{{item.name}}，发布人：{{item.creatorName}}
                  </h4>
                </el-col>
              </el-row>
              <p class="project-content" v-html="item.content">{{item.content}}</p>
            </div>
          </el-timeline-item>
        </template>
      </el-timeline>
    </el-row>
  </div>
</template>

<script>
import { addDynamicRoute } from '@/router'
export default {
  name: 'projectAnnouncement',
  data () {
    return {
      list: []
    }
  },
  props: {
    roleType: String
  },
  activated () {
    this.getData()
  },
  methods: {
    viewHandle (row) {
      // 判断当前是否已读
      if (row.readStatus === 1) {
        this.gotoNoticeView(row)
      } else {
        this.$http.post('/ctc/project/userProjectNoticeRead', { 'noticeId': row.noticeId }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.gotoNoticeView(row)
          }
        }).catch((res) => { })
      }
    },
    gotoNoticeView (row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.noticeId}`,
        title: '公告详情查看',
        path: 'projects/notice-mgr/notice-view',
        params: {
          noticeId: row.noticeId,
          projectId: row.projectId
        }
      }
      // 动态路由
      addDynamicRoute(routeParams, this.$router)
    },
    getData () {
      this.$http.get('/ctc/project/projectNotice/projectList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.list = res.data
        }
      }).catch((res) => { })
    }
  }
}
</script>

<style scoped lang="scss">
.shortcuts {
  display: flex;
  flex-flow: column;
  padding: 10px;
  .shortcuts-bottom {
    flex: 1;
    overflow: auto;
    .project-content {
      color: #909399;
      padding: 5px;
      height: 80px;
      overflow: hidden;
    }
  }
}
.el-timeline {
  padding: 0 10px;
}
</style>
