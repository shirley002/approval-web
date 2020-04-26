import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  {
    path: '/flow',
    component: Layout,
    name: 'flow',
    children: [
        {
            path: 'list',
            name: '流程设置',
            component: () => import('@/views/setting/list'),
            meta: {title: '流程设置', icon: 'app'},
        },
        {
            path: 'edit/:id',
            name: '流程编辑',
            component: () => import('@/views/setting/edit'),
            meta: {title: '流程编辑', icon: 'class', activeMenu: '/flow/list'},
            hidden:true,
        }
    ],
    permission : ["approval:setting:list"]
  },
  {
    path: '/dashborad',
    component: Layout,
    name: 'dashborad',
    children: [
      {
        path: 'list',
        name: '流程看板',
        component: () => import('@/views/dashborad/'),
        meta: {title: '流程看板', icon: 'app'},
      }
    ],
    permission : ["approval:dashborad:list"]
  },
  {
    path: '/approval',
    component: Layout,
    name: 'approval',
    children: [
      {
        path: 'list',
        name: '申请审批',
        component: () => import('@/views/manage/list'),
        meta: {title: '申请审批', icon: 'app'},
      },
      {
        path: 'edit/:id/:apply_flow_id',
        name: '审批',
        component: () => import('@/views/manage/edit'),
        meta: {title: '审批', icon: 'teacher', activeMenu:'/approval/list'},
        hidden:true,
      }
    ],
    permission : ["approval:apply:list"]
  },
  {
    path: '/finance',
    component: Layout,
    name: 'finance',
    children: [
      {
        path: 'list',
        name: '我的上报',
        component: () => import('@/views/finance/list'),
        meta: {title: '我的上报', icon: 'app'},
      },
      {
        path: 'add',
        name: '添加',
        component: () => import('@/views/finance/add'),
        meta: {title: '添加', icon: 'class', activeMenu: '/finance/list'},
        hidden:true,
      },
      {
        path: 'edit/:id',
        name: '编辑',
        component: () => import('@/views/finance/edit'),
        meta: {title: '编辑', icon: 'class', activeMenu: '/finance/list'},
        hidden:true,
      },
      {
        path: 'detail/:id',
        name: '详情',
        component: () => import('@/views/finance/detail'),
        meta: {title: '详情', icon: 'class', activeMenu: '/finance/list'},
        hidden:true,
      }
    ],
    permission : ["approval:finance:list"]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
