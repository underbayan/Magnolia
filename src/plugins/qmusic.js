import overWrite from '../util/overWrite'
/**
 * @description qqmusic 的browser client或者webview，会自动加载qq music的sdk，然后覆盖master api的分享方法
 */
export default async master => {
    if (master.browser.isQQYY) {
        if (!window.M) {
            await master.load('//y.gtimg.cn/music/h5/client/jsbridge.js')
        }
        master.isSupportBase64 = false
        const commonShare = () =>
            M.client.invoke('other', 'callShareWeb', {
                imgUrl: master.shareInfo.imgUrl,
                link: master.shareInfo.link,
                title: master.shareInfo.title,
                desc: master.shareInfo.desc
            })
        overWrite(master.api, {
            openNativeShare: _ => commonShare() || true,
            setShareInfo: (s, callback) => {
                master.shareCallback = callback
                master.shareInfo = s
                const initShare = (data, callback) =>
                    M.client.invoke(
                        'ui',
                        'setActionBtn', {
                            type: 'icon',
                            content: 'share'
                        },
                        _ =>
                        M.client.invoke(
                            'other',
                            'callShareWeb',
                            data,
                            callback
                        )
                    )
                initShare({
                        imgUrl: master.shareInfo.imgUrl,
                        link: master.shareInfo.link,
                        title: master.shareInfo.title,
                        desc: master.shareInfo.desc
                    },
                    data => master.shareCallback(data, 'qmusic')
                )
            },
            share2qq: commonShare,
            share2qz: commonShare,
            share2wx: commonShare,
            share2timeLine: commonShare,
            share2weibo: commonShare
        })
    }
}
