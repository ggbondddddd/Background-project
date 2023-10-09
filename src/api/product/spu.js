import request from '@/utils/request-brand'

//获取SPU列表数据的接口   /admin/product/{page}/{limit}   get 有三个参数前两个是关于分页器展示数据的page limit category3Id
// 这里不知道为什么category3Id一定要用params携带过去，里面是kv一致省略v
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu信息   /admin/product/getSpuById/{spuId}   get  带参  spuId
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息   /admin/product/baseTrademark/getTrademarkList   get   无参数
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取spu图片的接口  /admin/product/spuImageList/{spuId}    get  有参
export const reqSpuImage = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台全部销售属性----整个平台销售属性最多三个  /admin/product/baseSaleAttrList   get  无参数
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 修改SPU或添加SPU：对于修改或者添加，携带给服务器参数大致一样，唯一的区别在于修改spu携带的参数多了一个id，因为需要知道你修改的是那一个
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 如果携带的参数有id，修改spu
    if (spuInfo.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
    } else {
        // 携带的参数没有id--添加spu
        return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
    }
}

// 删除spu      /admin/product/deleteSpu/{spuId}     带参   
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 下面是在spu管理里面点击添加sku按钮的一系列需要的接口

// 获取图片的数据     /admin/product/spuImageList/{spuId}   带参   get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性的数据   /admin/product/spuSaleAttrList/{spuId}   带参          get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的数据    /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}    get   带参
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
    request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加SKU    /admin/product/saveSkuInfo     post   带参
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo })

// 获取sku列表数据的接口    /admin/product/findBySpuId/{spuId}   get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })

