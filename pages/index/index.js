// index.js

const WXAPI = require('apifm-wxapi')
const WxRequest = require('../../utils/request')

// 获取应用实例
const app = getApp()

Page({
        data: {
            motto: '喜宠商城',
            userInfo: {},
            hasUserInfo: false,
            canIUse: wx.canIUse('button.open-type.getUserInfo')
        },
        // 事件处理函数
        bindViewTap() {
            wx.navigateTo({
                url: '../logs/logs'
            })
        },
        onLoad() {
            //加载轮播图
            this.initBanners()
            //this.goodsDynamic()
            this.getNotice()
            this.categories()
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
            } else if (this.data.canIUse) {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                app.userInfoReadyCallback = res => {
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            } else {
                // 在没有 open-type=getUserInfo 版本的兼容处理
                wx.getUserInfo({
                    success: res => {
                        app.globalData.userInfo = res.userInfo
                        this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                    }
                })
            }
        },
        getUserInfo(e) {
            console.log(e)
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
        },

        async initBanners() {
            const _data = {}
            // 读取头部轮播图
            const res1 = await WxRequest.banners({
                type: 'index'
            })
            if (res1.data == null) {
                wx.showModal({
                    title: '提示',
                    content: '请在后台添加 banner 轮播图片',
                    showCancel: false
                })
            } else {
                _data.banners = res1.data
            }
            this.setData(_data)
        },
        async categories() {
            const res = await WxRequest.goodsCategory();
            console.log(res)
            this.setData({
                activeCategoryId: 0,
                curPage: 1,
                categories: res.data,
                prefix: WxRequest.OSS_BASE_URL,
            })
            this.getGoodsList();
        },
        async getGoodsList() {
            wx.showLoading({
                "mask": true
            })
            const res = await WxRequest.goods({
                categoryId: ''
            })
            wx.hideLoading()
            // if (res.code == 404 || res.code == 700) {
            //   let newData = {
            //     loadingMoreHidden: false
            //   }
            //   if (!append) {
            //     newData.goods = []
            //   }
            //   this.setData(newData);
            //   return
            // }
            // let goods = [];
            // if (append) {
            //   goods = this.data.goods
            // }
            // for (var i = 0; i < res.data.length; i++) {
            //   goods.push(res.data[i]);
            // }
            this.setData({
                loadingMoreHidden: false,
                goods: res.data,
            });
        },

        async goodsDynamic() {
            const res = await WXAPI.goodsDynamic(0)
            if (res.code == 0) {
                this.setData({
                    goodsDynamic: res.data
                })
            }
        },

        goCoupons: function (e) {
            // wx.switchTab({
            //   url: "/pages/index/index"
            // })
            wx.showModal({
                title: '优惠卷',
                content: '该功能正在紧张筹备中',
                showCancel: false
            })
        },

        getNotice: function () {
            var that = this;
            var noticeList = {dataList: []}
            noticeList.dataList.push({
                dateAdd: "2020",
                dateUpdate: "2021",
                id: 1,
                isShow: true,
                title: "大蕾子天下第一！！！！！！！！！！！"
            });
            noticeList.dataList.push({dateAdd: "2020", dateUpdate: "2021", id: 1, isShow: true, title: "喜宠商城开业咯！！！！！！！！"});
            this.setData({noticeList: noticeList})
            // WXAPI.noticeList({pageSize: 5}).then(function (res) {
            //   res.data.dataList.push({id:1,isShow:true,title:"sdfadsfa"})
            //   console.log(res)
            //   if (res.code == 0) {
            //     that.setData({
            //       noticeList: res.data
            //     });
            //   }
            // })
        },

        goSearch() {
            wx.navigateTo({
                url: '/pages/search/index'
            })
        },
        tapBanner(e) {
            const url = e.currentTarget.dataset.url
            if (url) {
                // wx.navigateTo({
                //   url
                // })
            }
        },
        tabClick(e) {
            // const id = e.currentTarget.dataset.id
            // console.log(id)
            //   wx.navigateTo({
            //    url: '/pages/goods/list?categoryId=' + e.currentTarget.id,
            //  })
            wx.setStorageSync("_categoryId", e.currentTarget.dataset.id)
            wx.switchTab({
                url: '/pages/category/category',
            })
        },
        toDetailsTap(e) {
            wx.navigateTo({
                url: "/pages/goods-detail/index?id=" + e.currentTarget.dataset.id
            })
        }
    }
)


