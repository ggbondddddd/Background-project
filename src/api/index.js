// 将四个模块请求的接口函数统一暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

//引入权限相关的接口文件  有一个是采取分别暴露，两个采取默认暴露，引入的形式有区别
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'

// 对外暴露
export default {
    trademark,
    attr,
    sku,
    spu,
    // 下面是权限管理接口的暴露
    user,
    role,
    permission
}