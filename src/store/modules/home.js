import mockRequest from '@/utils/request-mock'
import axios from 'axios'
const state = {
    list: {}
}
const mutations = {
    GETDATA(state, list) {
        state.list = list
    }
}
const actions = {
    // 发请求获取首页的模拟数据
    async getDate({ commit }) {
        // 也可直接mockRequest({})，这只是两种不同写法，下面直接把get写在外面了
        let result = await mockRequest.get('/home/list')
        if (result.code === 20000) {
            commit('GETDATA', result.data)
        }


    },

}
const getter = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getter
}