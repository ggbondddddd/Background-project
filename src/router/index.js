// 引入Vue|Vue-router
import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'
import store from '@/store'

// 使用路由组件
Vue.use(Router)

/* 引入最外层骨架的一级路由组件 */
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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 路由的配置：为什么不同用户登录我们项目，展示的菜单（路由）都是一样的
// 因为我们的路由是'死的'，不管是老板还是员工，看到的操作的菜单都是一样的
// 需要把项目中的路由进行拆分

// 常量路由：就是不管用户是什么角色都可以看见的路由，
// 超级管理员或普通员工都可以看到登录，404，首页
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,

    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

]

// 异步路由：不同用户（角色），需要过滤筛选出的路由，称之为异步路由
// 为什么这里是一个数组,因为点击登录服务器返回来的信息routes是一个数组,要拿着返回信息数组和这里数组进行对比过滤
export const asyncRoutes = [
  // 权限管理路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  // 商品管理路由
  {
    path: '/produt',
    // 这里一定注意 product 的组件也是 layout layout 组件是你登录以后显示包含一整个页面结构的组件，在 app 下
    component: Layout,
    name: 'product',
    // 这里meta里面的title控制左边商品管理栏里面的名称
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'trademark',
        name: 'TradeMark',
        // 点击品牌管理 layout模块的AppMain里面就会显示下面这个路由
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'Spu 管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'Sku 管理' }
      },
    ]
  },
  // 最后面加的test管理,在菜单栏里面
  {
    path: '/test',
    component: Layout,
    name: 'Test',
    meta: { title: '测试管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/Test/Test1'),
        meta: { title: '测试管理1' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/Test/Test2'),
        meta: { title: '测试管理2' }
      },
    ]
  }
]

// 任意路由:当你路径出现错误的时候,重定向到404路由去
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 我们注册的路由时'死的'，'活的'路由可以根据不同的角色，老板或员工，展示不同的菜单
  routes: constantRoutes
})



const router = createRouter()
// console.log(store)
// const whiteList = ['/login']

// router.beforeEach(async (to, from, next) => {
//   //获取token
//   const hasToken = getToken()
//   //判断token是否存在
//   if (hasToken) {
//     //如果是从login过来的，就放行
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       //如果不是从login过来的，那就是因为路由跳转或刷新出现的问题了，我们可以获取用户信息
//       const hasGetUserInfo = store.getters.name
//       // console.log(store)
//       //判断用户信息是否存在，如果存在就放行，说明没有刷新，只是路由跳转
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         //说明用户信息丢失，需要重新获取用户信息
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')
//           // hack方法 确保addRoutes已完成,注意要添加 replace: true
//           // 其实在路由守卫中，只有next()是放行，其他的诸如：next('/logon') 、 next(to) 或者 next({ ...to, replace: true })都不是放行，
//           // 而是：中断当前导航，执行新的导航
//           // next({ ...to, replace: true })中的replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由。
//           next({ ...to, replace: true })
//           // next()
//         } catch (error) {
//           await store.dispatch('user/resetToken')
//           next(`/login?redirect=${to.path}`)
//         }
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`)
//     }
//   }
// })
// router.beforeEach((to, from, next) => {
//   next({ ...to, replace: true })
// })

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由的方法
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
