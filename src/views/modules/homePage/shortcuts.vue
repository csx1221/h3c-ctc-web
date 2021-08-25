<template>
  <div class="bcw shortcuts">
    <el-row class="shortcuts-top">
      <el-col :span="12" class="split-line" style="text-align:left;">
        快捷操作
      </el-col>
    </el-row>
    <el-row class="shortcuts-bottom">
      <template v-for="(item, index) in list">
        <el-col :span="6" :key="index" v-if="item.includes.includes(roleType)">
          <div class="shortcuts-box" v-if="item.type==='click'" @click="doTableOperate(item.clickType)">
            <div class=" imgfl vcenter">
              <div class="imgbac">
                <img class="imgbac-bg" :src="item.icon" alt="" style="width:32px;height:32px;" />
              </div>
            </div>
            {{item.title}}
          </div>
          <div class="shortcuts-box" v-if="item.type==='path'" @click="$router.push({ name: item.path })">
            <div class=" imgfl vcenter">
              <div class="imgbac">
                <img class="imgbac-bg" :src="item.icon" alt="" style="width:32px;height:32px;" />
              </div>
            </div>
            {{item.title}}
          </div>
        </el-col>
      </template>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { addDynamicRoute } from '@/router'
import AddOrUpdate from '@/views/modules/sys/user/user-add-or-update'
import cjxm from '../../../assets/img/svg/cjxm.svg'
import gdgl from '../../../assets/img/svg/gdgl.svg'
import cjzh from '../../../assets/img/svg/cjzh.svg'
import wddb from '../../../assets/img/svg/wddb.svg'
import ylgl from '../../../assets/img/svg/ylgl.svg'
import ylsj from '../../../assets/img/svg/ylsj.svg'
import ylzx from '../../../assets/img/svg/ylzx.svg'
import qxgl from '../../../assets/img/svg/qxgl.svg'
export default {
  name: 'shortcuts',
  data () {
    return {
      addOrUpdateVisible: false, // 新增／更新，弹窗visible状态
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      list: [
        { title: '创建项目', includes: ['0', '1'], type: 'click', clickType: '1', icon: cjxm },
        { title: '工单管理', includes: ['0', '1'], type: 'path', path: 'workbench-workorder-mgr-workordermgr-page', icon: gdgl },
        { title: '创建账户', includes: ['0'], type: 'click', clickType: '2', icon: cjzh },
        { title: '我的待办', includes: ['1'], type: 'path', path: 'workbench-mytodo-mytodo-page', icon: wddb },
        { title: '用例管理', includes: ['1'], type: 'path', path: 'casecenter-new-casedesignmgr-case-design-mgr', icon: ylgl },
        { title: '用例设计', includes: ['2'], type: 'path', path: 'casecenter-new-casedesignmgr-case-design-mgr', icon: ylsj },
        { title: '用例执行', includes: ['2'], type: 'path', path: 'casecenter-new-executecasemgr-execute-case-mgr', icon: ylzx },
        { title: '缺陷管理', includes: ['1', '2', '3'], type: 'path', path: 'defectcenter-defect-mgr-defect-mgr', icon: qxgl }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  props: {
    roleType: String
  },
  mounted () {
    // 判断登录方式(0:云测试平台门户登录;1:4A登录)
    if (this.loginSw === '1') {
      this.list = this.list.filter((item) => {
        return !['创建账户'].includes(item.title)
      })
    }
  },
  methods: {
    doTableOperate (clickType) {
      let path = ''
      let title = ''
      let params = {}
      if (clickType === '1') {
        path = 'projects/project-new-mgr/create-project-page'
        title = '创建项目'
        params.operationType = 'add'
        params.readOnly = 0 // 0:编辑模式;1:只读模式
        this.customAddDynamicRoute(path, title, params)
      } else {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      }
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
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
  }
}
.shortcuts-box {
  border: 1px solid #eeeeee;
  width: 108px;
  margin: 10px auto;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  line-height: 1.8;
  .imgbac {
    margin: 10px 0;
    position: relative;
    .imgbac-up {
      position: absolute;
    }
  }
}
.shortcuts-box:active,
.shortcuts-box:hover {
  background-color: #ecf4fe;
  color: #409eff;
}
</style>
