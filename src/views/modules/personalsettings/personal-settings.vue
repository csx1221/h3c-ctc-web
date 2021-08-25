<template>
  <el-card shadow="never" class="aui-card--fill  project-mgr-page">
    <el-container style="height: 100%;width: 100%;margin: 30px 0;">
      <el-aside width="320px">
        <div class="head">
          <el-avatar :size="150" :src="$store.state.user.headUrl"></el-avatar>
        </div>
      </el-aside>
      <el-main style="height: 100%; width: 100%;">
        <div>
          <div class="main_top">
            <span class="pName">{{list.realName}}</span>
            <span>{{$getDictLabel('gender', list.gender)}}</span>
          </div>
          <div>
            <el-button type="primary" round @click="updatePasswordHandle">修改密码</el-button>
            <el-button round @click="pictureUpload">更换头像</el-button>
            <el-button type="success" round @click="editInformation" v-if="loginSw==0">编辑资料</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
    <div>
      <el-divider content-position="left">基础信息</el-divider>
      <div class="footer">
        <el-row>
          <el-col :span="24" class="is_flex">
            <div class="flex_left">手机:</div>
            <div class="flex_right">{{list.mobile}}</div>
          </el-col>
          <el-col :span="24" class="is_flex">
            <div class="flex_left">邮箱:</div>
            <div class="flex_right">{{list.email}}</div>
          </el-col>
          <!--
          <el-col :span="24" class="is_flex">
            <div class="flex_left">提醒形式:</div>
            <div class="flex_right">{{$getDictLabel('noticeForm', list.noticeForm)}}</div>
          </el-col>
          <el-col :span="24" class="is_flex">
            <div class="flex_left">提醒时间点:</div>
            <div class="flex_right">{{$getDictLabel('noticeTime', list.noticeTime)}}</div>
          </el-col>
          -->
        </el-row>
      </div>
      <el-divider content-position="left">项目组信息</el-divider>
      <el-row>
        <el-col :span="24" style="padding-left:40px;">
          <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" border height="600" style="width: 100%;">
            <el-table-column prop="name" label="项目名称" header-align="left" align="left" width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="projectStatus" label="项目状态" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('project.projectStatus', scope.row.projectStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="项目范围" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('project.scope', scope.row.scope) }}
              </template>
            </el-table-column>
            <el-table-column prop="planPeriod" label="计划周期" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.planStartTime}}~{{scope.row.planEndTime}}
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    <edit-information v-if="editInformationVisible" ref="editInformation" @refresh="getInfo"></edit-information>
    <!-- 头像-->
    <picture-upload v-if="pictureUploadVisible" @init="pictureUploadVisible=false" @refresh="getInfo" ref="pictureUpload"></picture-upload>
  </el-card>
</template>

<script>
import Cookies from 'js-cookie'
import UpdatePassword from '@/views/main-navbar-update-password'
import editInformation from '@/views/main-navbar-edit-information'
import pictureUpload from '@/views/main-navbar-picture-upload'
import headUrl from '@/assets/img/avatar.png'
export default {
  name: 'personal-settings',
  data () {
    return {
      headUrl: headUrl,
      updatePasswordVisible: false,
      editInformationVisible: false,
      pictureUploadVisible: false,
      list: {},
      projectTableData: [],
      loginSw: Cookies.get('loginSw') // 判断登录方式(0:云测试平台门户登录;1:4A登录)
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    pictureUpload () {
      this.pictureUploadVisible = true
      this.$nextTick(() => {
        this.$refs.pictureUpload.init(this.list)
      })
    },
    // 编辑资料
    editInformation () {
      this.editInformationVisible = true
      this.$nextTick(() => {
        this.$refs.editInformation.init(this.list)
      })
    },
    getInfo () {
      let userId = this.$store.state.user.id
      if (userId) {
        this.$ctcLoading.open()
        this.$http.get('/sys/user/' + userId, { 'params': {} }).then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.list = res.data
          }
          this.getProjectTableData()
        }).catch((res) => {
          this.$ctcLoading.close()
        })
      }
    },
    getProjectTableData () {
      this.$http.get('/ctc/project/projectBase/getProjectInfoListByUserId', { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询数据失败：' + res.msg)
        } else {
          this.projectTableData = res.data
        }
      }).catch(() => { })
    }
  },
  components: {
    UpdatePassword,
    editInformation,
    pictureUpload
  }
}
</script>

<style scoped lang="scss">
.head {
  text-align: center;
}
.main_top {
  margin-bottom: 60px;
  .pName {
    font-size: 25px;
    font-weight: bold;
    margin-right: 25px;
  }
}
.el-divider__text.is-left {
  color: #17b3a3;
  font-size: 20px;
}
.footer {
  padding-left: 120px;
  padding-top: 25px;
  .is_flex {
    display: flex;
    min-height: 60px;
    .flex_left {
      width: 120px;
      text-align: right;
      padding-right: 10px;
      color: darkgray;
    }
    .flex_right {
      flex: 1;
    }
  }
}
</style>
