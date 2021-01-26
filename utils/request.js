var API_BASE_URL = 'https://api.xipetmedicare.net/app/'
var OSS_BASE_URL ='https://sheepet-shop-1304092752.cos.ap-nanjing.myqcloud.com/'

module.exports = {
  OSS_BASE_URL,
  banners: function banners(data) {
    return request('o/index/banner/v1', 'get', data);
  },
  goodsCategory:function goodsCategory(data){
    return request('/o/index/grid/v1', 'get', data);
  },
  goods:function goods(data){
    return request('/o/index/product/list/v1','get',data)
  }
}

let request = (url, method, data) => {
  const _url = API_BASE_URL + url
  const header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header,
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(rsp) {
        // 加载完成
        console.log(rsp)
      }
    })
  })
}


