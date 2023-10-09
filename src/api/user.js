// 引入axios进行二次封装 这里原本的二次封装不是我们写的，
import request from '@/utils/request'
// 对外暴露登录接口函数
export function login(data) {
  return request({
    // 这里的接口原本是mock魔力数据，现在换成了我们的真实在线接口
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 对外暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
// 对外暴露退出登录函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
//
// export function login(data) {
//   return request({
//     // 这里的接口原本是mock魔力数据，现在换成了我们的真实在线接口
//     url: '/acl/index/login',
//     method: 'post',
//     data
//   })
// }
// // 对外暴露获取用户信息的函数
// export function getInfo(token) {
//   return request({
//     url: '/acl/index/info',
//     method: 'get',
//     params: { token }
//   })
// }
// // 对外暴露退出登录函数
// export function logout() {
//   return request({
//     url: '/acl/index/logout',
//     method: 'post'
//   })
// }
