// 这里是我引入的需要对外暴露的数据  用import  data from './data.json'也行
const data = require('./data.json')

module.exports = [
    {
        url: '/home/list',
        type: 'get',
        response: config => {
            const items = data.items
            return {
                code: 20000,
                // kv一致省略v
                data
            }
        }
    }
]
