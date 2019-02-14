import overWrite from '../util/overWrite'
/**
 * @description 如果是wechat 的browser client或者webview，会自动加载weixin的sdk，然后覆盖master api的分享方法
 */
export default async master => {
    if (master.browser.isWX) {
        master.isSupportBase64 = false
        /** 兼容旧版本的微信 */
        const wxjsBridge = await new Promise((res, rej) => {
            if (
                typeof window.WeixinJSBridge === 'object' &&
                typeof window.WeixinJSBridge.invoke === 'function'
            ) {
                res(window.WeixinJSBridge)
            }
            if (document.addEventListener) {
                document.addEventListener(
                    'window.WeixinJSBridgeReady',
                    res(window.WeixinJSBridge),
                    false
                )
            } else if (document.attachEvent) {
                document.attachEvent(
                    'window.WeixinJSBridgeReady',
                    res(window.WeixinJSBridge)
                )
                document.attachEvent(
                    'onwindow.WeixinJSBridgeReady',
                    res(window.WeixinJSBridge)
                )
            }
            setTimeout(() => res(null), 20)
        })
        if (wxjsBridge) {
            overWrite(master.api, {
                share2wx: _ => {
                    window.WeixinJSBridge.invoke(
                        'sendAppMessage',
                        master.shareInfo,
                        _ => master.shareCallback(_)
                    )
                },
                share2timeLine: _ => {
                    window.WeixinJSBridge.invoke(
                        'shareTimeline',
                        master.shareInfo,
                        _ => master.shareCallback(_)
                    )
                },
                share2weibo: () => {
                    window.WeixinJSBridge.invoke(
                        'shareWeibo',
                        {
                            content:
                                master.shareInfo.title +
                                ' \n ' +
                                master.shareInfo.desc +
                                ' \n ' +
                                master.shareInfo.link,
                            url: data.link
                        },
                        function(res) {}
                    )
                }
            })
        }
        async function loadWxlib() {
            if (
                typeof define == 'function' &&
                (define.amd || define.cmd) &&
                window.seajs
            ) {
                return new Promise((res, rej) => {
                    seajs.use(
                        '//res.wx.qq.com/open/js/jweixin-1.0.0.js',
                        wx => {
                            res(wx)
                            window.wx = wx
                        }
                    )
                })
            } else {
                return master.load('//res.wx.qq.com/open/js/jweixin-1.0.0.js')
            }
        }
        await loadWxlib()

        const common = (s, callback) => {
            master.shareInfo = s
            master.shareCallback = callback
            const wsinfo = source => ({
                title: master.shareInfo.title,
                desc: master.shareInfo.desc,
                link: master.shareInfo.link,
                imgUrl: master.shareInfo.imgUrl,
                // type: master.shareInfo.contentType,
                // dataUrl: master.shareInfo.dataUrl || '',
                success: _ => master.shareCallback(_, source),
                cancel: _ => master.shareCallback(_, source)
            })
            wx.onMenuShareAppMessage(wsinfo('weixin'))
            wx.onMenuShareQZone(wsinfo('qzone'))
            wx.onMenuShareQQ(wsinfo('qq'))
            wx.onMenuShareTimeline(wsinfo('timeLine'))
            wx.onMenuShareWeibo(wsinfo('weibo'))
        }
        overWrite(master.ui, {
            open: master.ui.openMask,
            close: master.ui.closeMask
        })
        overWrite(master.api, {
            initWx: async opts => {
                const wx = window.wx
                wx.config(opts)
                await new Promise((res, rej) => {
                    wx.ready(function() {
                        common(master.shareInfo, master.shareCallback)
                        overWrite(master.api, {
                            openNativeShare: _ =>
                                wx.showMenuItems({
                                    menuList: [
                                        'menuItem:share:appMessage',
                                        'menuItem:share:timeline',
                                        'menuItem:share:qq',
                                        'menuItem:share:weiboApp',
                                        'menuItem:favorite',
                                        'menuItem:share:facebook',
                                        'menuItem: share: QZone'
                                    ]
                                }) || true,
                            setShareInfo: common
                        })
                        res(true)
                        setTimeout(() => rej(false), 300)
                    })
                })
            }
        })
    }
}
