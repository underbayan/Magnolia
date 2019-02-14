import overWrite from '../util/overWrite'
/**
 * @description qq 的browser client或者webview，会自动加载qq的sdk，然后覆盖master api的分享方法
 */
export default async master => {
    if (master.browser.isQQ) {
        master.isSupportBase64 = true
        if (!window.mqq) {
            await master.load('//qzonestyle.gtimg.cn/qzone/hybrid/lib/qqapi.js')
        }
        const shareLinkAux = (client, source) => {
            const sinfo = master.shareInfo
            window.mqq.ui.shareMessage(
                {
                    title: sinfo.title,
                    desc: sinfo.desc,
                    share_type: client,
                    share_url: sinfo.link,
                    image_url: sinfo.imgUrl,
                    shareElement: sinfo.shareElement || '',
                    flash_url: sinfo.flash_url || '',
                    puin: sinfo.puin || '',
                    appid: sinfo.appid || '',
                    sourceName: sinfo.sourceName || '',
                    toUin: sinfo.toUin || '',
                    src_action: sinfo.src_action || 'plugin',
                    src_actionData: sinfo.schema || sinfo.src_actionData || '',
                    src_iconUrl: sinfo.src_iconUrl || '',
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
                    base64: master.shareInfo.base64.replace(
                        'data:image/jpeg;',
                        'data:image/jpg;'
                    ) /** qq 目前支持jpg的base64 */
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
                        source_name: master.shareInfo.sourceName
                    },
                    data =>
                        window.mqq.ui.setOnShareHandler(type => {
                            shareLinkAux(
                                type,
                                ['qq', 'qzone', 'weixin', 'timeLine', 'weibo'][
                                    type
                                ]
                            )
                        })
                )
            },
            share2qq: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('0', 'qq')
                    : shareLinkAux(0, 'qq'),
            share2qz: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('1', 'qzone')
                    : shareLinkAux(1, 'qzone'),
            share2wx: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('2', 'weixin')
                    : shareLinkAux(2, 'weixin'),
            share2timeLine: _ =>
                master.shareInfo.type === 'base64'
                    ? shareImgAux('3', 'timeLine')
                    : shareLinkAux(3, 'timeLine')
        })
    }
}
