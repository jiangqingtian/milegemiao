const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
    data: {},
    onLoad: function (options) {
        this.setData({
            version: CONFIG.version
        })
    },
    onShow: function () {
        this.getUserApiInfo()
    },
    async getUserApiInfo() {
        const res = await WXAPI.userDetail(wx.getStorageSync('token'))
        if (res.code == 0) {
            let _data = {}
            _data.apiUserInfoMap = res.data
            if (res.data.base.mobile) {
                _data.userMobile = res.data.base.mobile
            }
            if (this.data.order_hx_uids && this.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
                _data.canHX = true // 具有扫码核销的权限
            }
            const adminUserIds = wx.getStorageSync('adminUserIds')
            if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
                _data.isAdmin = true
            }
            if (res.data.peisongMember && res.data.peisongMember.status == 1) {
                _data.memberChecked = false
            } else {
                _data.memberChecked = true
            }
            this.setData(_data);
        }
    },
    clearStorage() {
        wx.clearStorageSync()
        wx.showToast({
            title: '已清除',
            icon: 'success'
        })
    },
    loginOut() {
        AUTH.loginOut()
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
})
