<template>
  <div class="bcw personal">
    <div class="personal-head">
      <div class="personal-bc">
        <el-avatar class="personal-bc-avatar" :size="120" :src="$store.state.user.headUrl"></el-avatar>
      </div>
      <div class="personal-content">
        <p class="p-c-name">{{name}}</p>
        <p class="p-c-position" v-html="position"></p>
        <div class="p-c-path">
          <template v-for="(item, index) in list">
            <div :key="index" class="p-c-path-content" @click="$router.push({ name: item.path })">
              <div>
                <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true">
                  <use :xlink:href="`#${item.icon}`"></use>
                </svg>
              </div>
              <span>{{item.title}}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'personalInformation',
  data () {
    return {
      name: this.$store.state.user.realName,
      position: this.$store.state.user.subName,
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:集中化测试平台门户登录;1:4A登录)
      list: [
        {
          icon: 'icon-setting',
          path: 'personalsettings',
          title: '个人设置'
        },
        {
          icon: 'icon-file-unknown',
          path: 'helpdocuments',
          title: '帮助文档'
        }
      ]
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.personal {
  .personal-head {
    .personal-bc {
      border-radius: 6px 6px 0 0;
      height: 120px;
      background: url('../../../assets/img/big_screen_bg.png') top center
        no-repeat;
      position: relative;
      .personal-bc-avatar {
        position: absolute;
        bottom: -60px;
        left: calc(50% - 60px);
      }
    }
  }
  .personal-content {
    text-align: center;
    padding: 20px 0;
    .p-c-name {
      font-size: 20px;
      margin-top: 60px;
      /*font-weight: bold;*/
    }
    .p-c-position {
      font-size: 16px;
      color: #cccccc;
    }
    .p-c-path {
      .p-c-path-content {
        width: 60px;
        display: inline-block;
        margin: 20px 10px;
        cursor: pointer;
        color: #4190f7;
        img {
          /*width: 30px;*/
        }
        span {
          display: inline-block;
          margin: 10px 0;
        }
      }
      .p-c-path-content:hover {
        color: #67a6f9;
      }
    }
    .list-down {
      border-top: 1px solid #eeeeee;
      padding: 0 20px;
      .list-down-title {
        float: left;
      }
      .list-down-link {
        float: right;
      }
    }
  }
}
</style>
