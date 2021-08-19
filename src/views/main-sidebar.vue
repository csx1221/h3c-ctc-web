<template>
  <aside :class="['aui-sidebar', `aui-sidebar--${$store.state.sidebarLayoutSkin}`]">
    <div class="aui-sidebar__inner">
      <el-menu :default-active="$store.state.sidebarMenuActiveName" :collapse="$store.state.sidebarFold" :unique-opened="true" :collapseTransition="false" class="aui-sidebar__menu">
        <sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
  created () {
    this.$store.state.sidebarMenuList = window.SITE_CONFIG['menuList']
  }
}
</script>
<style lang="scss">
.aui-sidebar.aui-sidebar--default {
  .aui-sidebar__inner .el-menu {
    background: transparent;
    li.el-submenu.is-active.is-opened {
      .el-submenu__title {
        color: #fff;
        background-color: #4190f7;
        box-shadow: 0px 0px 16px 0px rgba(38, 50, 60, 0.22);
        border-radius: 3px;
        .el-submenu__icon-arrow.el-icon-arrow-down {
          color: #fff;
        }
      }
      .el-menu-item.is-active,
      .el-menu-item:focus,
      .el-menu-item:hover {
        background: transparent;
      }
    }
    .el-menu-item.is-active {
      color: #4190f7;
    }
  }
}
</style>
