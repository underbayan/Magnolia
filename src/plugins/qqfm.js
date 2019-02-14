import overWrite from '../util/overWrite'
/**
 */
export default async master => {
    if (master.browser.isQQ) {
        master.isSupportBase64 = true
        if (!window.mqq) {
            await master.load('//pub.idqqimg.com/qqmobile/qqapi.js')
        }
        overWrite(master.api, {
            open: master.ui.openMask,
            close: master.ui.closeMask,
            setShareInfo: (s, callback) => {
                master.shareInfo = s
                master.shareCallback = callback
                window.mqq.invoke(
                    'nextradio',
                    'share',
                    {
                        title: s.title,
                        summary: s.desc,
                        shareType: s.shareType,
                        url: s.link,
                        cover: s.imgUrl,
                        dataUrl: s.dataUrl || s.base64 || '',
                        extraSummary: s.extraSummary || '',
                        suffixSummary: s.suffixSummary || ''
                    },
                    data => master.shareCallback(data, source)
                )
            }
        })
    }
}
