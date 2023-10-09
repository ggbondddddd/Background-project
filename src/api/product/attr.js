// 平台属性管理模块请求文件
import request from '@/utils/request-brand'

// 获取一级分类数据的接口   /admin/product/getCategory1    get  
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

// 获取二级分类的接口   /admin/product/getCategory2/{category1Id} get  有参数，参数是一级分类数据里面带有的id，
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类的接口   /admin/product/getCategory3/{category2Id}  get  有参数哦，参数是二级分类数据里面带有的id
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取平台属性接口  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get 有三个参数 来自子组件三级联动的三个id
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

//添加属性与属性值接口，修改属性也是这个接口     /admin/product/saveAttrInfo   post  带参数  此处kv一致省略v,data:data 
/*   data里面需要带的参数，需要收集到的数据
 {
  "attrName": "",  属性名
  "attrValueList": [   属性名中的属性值,因为属性值可以是多个,因此需要的是数组
    {
      "attrId": 0,    属性的id
      "id": 0, //老师说这里的id是由服务器的数据库生成的,可以删除
      "valueName": ""  属性值
    }
  ],
  "categoryId": 0,      category3Id
  "categoryLevel": 0,    这里是服务器需要区分你是几级id 三级id所以这里是3,这里需要主要我没用这个参数,因为我和老师写写法不同,我自己新建一个即可
  "id": 0  //老师说这里的id是由服务器的数据库生成的,可以删除
} 
 */
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })

// 删除属性接口   /admin/product/deleteAttr/{attrId}   delete
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })