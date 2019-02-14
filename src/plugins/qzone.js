import overWrite from '../util/overWrite'
/**
 * @description 如果是qzone 的browser client或者webview，会自动加载qzone的sdk，然后覆盖master api的分享方法
 */
export default async master => {
    if (master.browser.isQzone) {
        master.isSupportBase64 = true
        if (!window.mqq) {
            await master.load(
                '//qzonestyle.gtimg.cn/qzone/hybrid/lib/jsbridge.js'
            )
        }
        const shareLinkAux = (cmd, source) => {
            const sinfo = master.shareInfo
            window.mqq.invoke(
                'share',
                cmd,
                {
                    title: sinfo.title,
                    imgUrl: sinfo.imgUrl,
                    link: sinfo.link,
                    desc: sinfo.desc,
                    back: true
                },
                data => master.shareCallback(data, source)
            )
        }
        const shareImgAux = (cmd, source) =>
            window.mqq.invoke(
                'Qzone',
                'sharePicture',
                {
                    type: cmd,
                    base64: master.shareInfo.base64
                },
                data => master.shareCallback(data, source)
            )
        overWrite(master.api, {
            openNativeShare: _ =>
                window.mqq.invoke('ui', 'showShareMenu') || true,
            setShareInfo: (s, callback) => {
                master.shareCallback = callback
                master.shareInfo = s

                window.mqq.invoke(
                    'data',
                    'setShareInfo',
                    {
                        share_url: master.shareInfo.link,
                        title: master.shareInfo.title,
                        desc: master.shareInfo.desc,
                        image_url: master.shareInfo.imgUrl,
                        appid: master.shareInfo.appid,
                        source_name: master.shareInfo.sourceName,
                        back: true
                    },

                    data =>
                        window.mqq.ui.setOnShareHandler(type => {
                            const sinfo = master.shareInfo
                            // !master.browser.os.android?
                            mqq.ui.shareMessage(
                                {
                                    title: sinfo.title,
                                    desc: sinfo.desc,
                                    share_type: type,
                                    share_url: sinfo.link,
                                    image_url: sinfo.imgUrl,
                                    back: true
                                },
                                data =>
                                    master.shareCallback(
                                        data,
                                        ['qq', 'qzone', 'weixin', 'timeLine'][
                                            type
                                        ]
                                    )
                            )
                            // : shareLinkAux(
                            //       type,
                            //       ['qq', 'qzone', 'weixin', 'timeLine'][
                            //           type
                            //       ]
                            //   )
                        })
                )
            },
            share2qq: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('0', 'qq')
                    : shareLinkAux('toQQ', 'qq'),
            share2qz: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('1', 'qzone')
                    : shareLinkAux('toQz', 'qzone'),
            share2wx: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('2', 'weixin')
                    : shareLinkAux('toWX', 'weixin'),
            share2timeLine: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('3', 'timeLine')
                    : shareLinkAux('toTL', 'timeLine')
        })
    }
}
