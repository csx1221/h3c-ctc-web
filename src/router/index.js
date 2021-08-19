import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/request'
import { isURL } from '@/utils/validate'

// 解决重复路由点击报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

// 页面路由(独立页面)
export const pageRoutes = [
  {
    path: '/404',
    component: () => import('@/views/pages/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter (to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next()
    }
  },
  { path: '/login', component: () => import('@/views/pages/login'), name: 'login', meta: { title: '登录' } },
  { path: '/login4A', component: () => import('@/views/pages/login-4A'), name: 'login4A', meta: { title: '4A登录' } },
  { path: '/bigscreenpage', component: () => import('@/views/modules/visualcenter/bigscreen/big-screen-page'), name: 'bigscreenpage', meta: { title: '可视化中心' } },
  { path: '/provincechildrenpage', component: () => import('@/views/modules/visualcenter/bigscreen/province-children-page'), name: 'provincechildrenpage', meta: { title: '省份下钻' } },
  { path: '/projectchildrenpage', component: () => import('@/views/modules/visualcenter/bigscreen/project-children-page'), name: 'projectchildrenpage', meta: { title: '项目下钻' } },
  { path: '/statisticsReportPage', component: () => import('@/views/modules/visualcenter/statisticsReport/statisticsReportPage'), name: 'statisticsReportPage', meta: { title: '统计报表' } }
]

// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/views/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口布局' },
  children: [
    { path: '/home', component: () => import('@/views/modules/home'), name: 'home', meta: { title: '首页', isTab: true } },
    { path: '/personalsettings', component: () => import('@/views/modules/personalsettings/personal-settings'), name: 'personalsettings', meta: { title: '个人设置', isTab: true } },
    { path: '/helpdocuments', component: () => import('@/views/modules/helpdocuments/help-documents'), name: 'helpdocuments', meta: { title: '帮助文档', isTab: true } }
  ]
}

// 移除当前tab
export function removeCurrentTabsHandle (thisvm) {
  let tabName = thisvm.$store.state.contentTabsActiveName
  thisvm.$store.state.contentTabs = thisvm.$store.state.contentTabs.filter(item => item.name !== tabName)
  if (thisvm.$store.state.contentTabs.length <= 0) {
    thisvm.$store.state.sidebarMenuActiveName = thisvm.$store.state.contentTabsActiveName = 'home'
    return false
  }
  // 当前选中tab被删除
  if (tabName === thisvm.$store.state.contentTabsActiveName) {
    let tab = thisvm.$store.state.contentTabs[thisvm.$store.state.contentTabs.length - 1]
    // 追加随机数参数，主页面监听路由变化触发加载数据
    let random = Math.random()
    thisvm.$router.push({
      name: tab.name,
      params: { ...tab.params, 'random': random },
      query: { ...tab.query, 'random': random }
    })
  }
}

export function addDynamicRoute (routeParams, router) {
  // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
  var routeName = routeParams.routeName
  var dynamicRoute = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
  if (dynamicRoute) {
    return router.push({ name: routeName, params: routeParams.params })
  }
  // 否则: 添加并全局变量保存, 再跳转
  dynamicRoute = {
    path: routeName,
    component: () => import(`@/views/modules/${routeParams.path}`),
    name: routeName,
    meta: {
      ...window.SITE_CONFIG['contentTabDefault'],
      menuId: routeParams.menuId,
      title: `${routeParams.title}`
    }
  }
  router.addRoutes([
    {
      ...moduleRoutes,
      name: `main-dynamic__${dynamicRoute.name}`,
      children: [dynamicRoute]
    }
  ])
  window.SITE_CONFIG['dynamicRoutes'].push(dynamicRoute)
  router.push({ name: dynamicRoute.name, params: routeParams.params })
}

// 5.25 liyufeng添加第三方模块自定义路由跳转
export function appListRouter (routeParams, router) {
  // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
  var routeName = routeParams.routeName
  var dynamicRoute = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
  if (dynamicRoute) {
    return router.push({ name: routeName, params: routeParams.params })
  }
  // 否则: 添加并全局变量保存, 再跳转
  dynamicRoute = {
    path: routeName,
    component: () => import(`@/views/modules/${routeParams.path}`),
    name: routeName,
    meta: {
      ...window.SITE_CONFIG['contentTabDefault'],
      menuId: routeParams.menuId,
      title: `${routeParams.title}`
    }
  }
  router.addRoutes([
    {
      ...moduleRoutes,
      name: `main-dynamic__${dynamicRoute.name}`,
      children: [dynamicRoute]
    }
  ])
  window.SITE_CONFIG['dynamicRoutes'].push(dynamicRoute)
  router.push({ name: dynamicRoute.name, params: routeParams.params })
}
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: pageRoutes.concat(moduleRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 已添加或者当前路由为页面路由, 可直接访问
  if (window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] || fnCurrentRouteIsPageRoute(to, pageRoutes)) {
    return next()
  }
  // 获取字典列表, 添加并全局变量保存
  http.get('/sys/dict/type/all').then(({ data: res }) => {
    if (res.code !== 0) {
      return
    }
    window.SITE_CONFIG['dictList'] = res.data
  }).catch(() => {})
  // 获取菜单列表, 添加并全局变量保存
  http.get('/sys/menu/nav').then(({ data: res }) => {
    if (res.code !== 0) {
      Vue.prototype.$message.error(res.msg)
      return next({ name: 'login' })
    }
    let data = res.data
    window.SITE_CONFIG['menuList'] = data
    fnAddDynamicMenuRoutes(window.SITE_CONFIG['menuList'])
    next({ ...to, replace: true })
  }).catch(() => {
    next({ name: 'login' })
  })
})

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute (route, pageRoutes = []) {
  var temp = []
  for (var i = 0; i < pageRoutes.length; i++) {
    if (route.path === pageRoutes[i].path) {
      return true
    }
    if (pageRoutes[i].children && pageRoutes[i].children.length >= 1) {
      temp = temp.concat(pageRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
      continue
    }
    // 组装路由
    var route = {
      path: '',
      component: null,
      name: '',
      meta: {
        ...window.SITE_CONFIG['contentTabDefault'],
        menuId: menuList[i].id,
        title: menuList[i].name
      }
    }
    // eslint-disable-next-line
    let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      route['path'] = route['name'] = `i-${menuList[i].id}`
      route['meta']['iframeURL'] = URL
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      route['path'] = route['name'] = URL.replace(/\//g, '-')
      route['component'] = () => import(`@/views/modules/${URL}`)
    }
    routes.push(route)
  }
  if (temp.length >= 1) {
    return fnAddDynamicMenuRoutes(temp, routes)
  }
  // 添加路由
  router.addRoutes([
    {
      ...moduleRoutes,
      name: 'main-dynamic-menu',
      children: routes
    },
    { path: '*', redirect: { name: '404' } }
  ])
  window.SITE_CONFIG['dynamicMenuRoutes'] = routes
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = true
}

export default router
