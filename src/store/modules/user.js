// 引入 登录，退出登录，获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入异步路由,任意路由,重置路由
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
// 引入的这个router和上面不一样,上面的是那个文件里面对外暴露的路径，这里引入的是router实例
import router from '@/router'

// 箭头函数
const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 服务器返回的菜单信息,根据不同的角色,返回的不同的标记信息,数组里面的元素是字符串
    routes: [],
    // 当前用户登录之后的角色信息
    roles: [],
    // 按钮权限的信息
    buttons: [],
    // 项目中已有的异步路由与服务器返回的标记信息进行对比，最终需要展示异步路由
    resultAsyncRoutes: [],
    // 用户最终需要展示的路由,符合条件的异步路由+常量路由+任意路由合并起来的路由
    resultAllRequests: []
  }
}

const state = getDefaultState()


const mutations = {
  // 重置清空state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息 自己写的  这里这个userinfo是通过服务器请求回来数据，和下面那个不是同一个
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限的标记
    state.routes = userInfo.routes
    // 按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles

  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncroutes) => {
    // 这里仅仅只有异步路由,用户展示的路由应该将常量路由与异步路由还有任意路由合并展示
    state.resultAsyncRoutes = asyncroutes
    // 计算出当前用户需要展示所有路由
    let product = []
    product.push(asyncRoutes[1])
    // console.log(product)
    state.resultAllRequests = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes, product)
    // 添加新的路由    addRoutes方法
    router.addRoutes(state.resultAllRequests)
  }
}
// 定义一个函数:两个数组进行对比,对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户(超级管理|普通员工)需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.includes(item.name)) {

      // 因为可能还存在二级三级乃至四五六级路由,所以要递归
      if (item.children && item.children.length > 0) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  }
  )
}

// 这里在处理登录业务 
const actions = {
  // 这个三连环我们用的是async await  下面注掉的用的是then catch
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 现在使用的是mock的数据，mock数据的code=20000
    if (result.code === 20000) {
      // vuex存储token
      commit('SET_TOKEN', result.data.token)
      // 本地持久化存储token，用的cookie
      setToken(result.data.token)
      return 'success'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取到用户信息：返回数据包含name：用户名 ；avator：用户头像；routes：返回的标志，不同用户应该展示哪些菜单的标记，rules：用户角色的信息，
        // button：按钮的信息，按钮权限用的标记
        const { data } = response
        // console.log(data)
        // 自己写的 vuex存储用户的全部信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}

