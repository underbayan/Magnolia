import overWrite from '../util/overWrite'

const self = {
    getWSQuaString: function() {
        var ua = (window.navigator && window.navigator.userAgent) || '',
            wsQuaReg = /(V\S+_\S+_WEISHI_\S+_\S+_\S+_\S+)/i

        return (ua.match(wsQuaReg) || [])[1] || ''
    },
    getWSQuaObj: function() {
        // 兼容大小写
        var strQua = self.getWSQuaString().toUpperCase()
        var arr = strQua.split('_')
        var OS_REG = /^(AND|IOS|IPH)$/
        var APP_REG = /^[a-zA-Z]+$/
        var VER_REG = /^\d+\.\d+\.\d+$/
        var SUB_VER_REG = /^\d+$/
        var res
        if (arr.length == 7 && OS_REG.test(arr[1]) && APP_REG.test(arr[2]) && VER_REG.test(arr[3]) && SUB_VER_REG.test(arr[4])) {
            res = {
                os: arr[1],
                app: arr[2],
                version: arr[3],
                subVersion: arr[4],
                appType: arr[5]
            }
        } else {
            res = {}
        }
        return res
    },
    compareWSVersion: function(target, cmd) {
        var version = self.getWSQuaObj().version
        if (!version) {
            return false
        }
        var _compare = function(tokens1, tokens2, p) {
            if (!tokens1[p] && !tokens2[p]) {
                return 0
            }
            return (tokens1[p] || 0) - (tokens2[p] || 0) || _compare(tokens1, tokens2, p + 1)
        }
        var r = _compare(version.split('.'), (target + '').split('.'), 0)
        r = r < 0 ? -1 : r > 0 ? 1 : 0

        switch (cmd) {
            case 'eq':
                return r === 0
            case 'neq':
                return r !== 0
            case 'lt':
                return r < 0
            case 'nlt':
                return r >= 0
            case 'gt':
                return r > 0
            case 'ngt':
                return r <= 0
            default:
                return r
        }
    }
}
const shareIMg =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAMAAACdUboEAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMACfYO2d9HIvrmWxaelO6NLNFuzcLrJ8WkUDnyu7KCfHZqZT4ztYYcrFULprFuAAACtUlEQVRYw+2X6ZaiMBCFwyqIqICoiAvi2nn/B5wz4k2azgKZyZ8+x/uX7k9SqXurIB/9ejl2cV4a0/LuWXw/n/5VcLVGXNBObmuLGFBo69g5NOXy17aJ1J3aI0KpY4kYZUAWEztE15kBOa/sEAmZumAuLBHJ0gdy87BDJN4TyDK0QHwpj8A8WiKSK3PQPrFDJN4ByPjyv0SoATJqLBHJJQbz8E+hOQGRK9kDaRyazuWeUU7kOrKTn01411lNIRChsGShOfbkTltQSEIkjw0LzeUo4BR9JxAhZ2ESmmFG+4q3RFQ1x+PZQGh6sx7NT6cTRRuwwmTacbELOC16trqY4aFZfxGZEAZQlieD9XYHx8WdQsVwYvVDU95G7BhBNbbNtiyNFEDzkXfGySWHOppGNEJTNX9a9IvhAE1WCuL1fcsrw4zaId2+5FsdLQyB5whHU9yKn5gFHu+On7W6vDcGsxpyI96Eo2WohYnCuXrant8pYgQ8gTcPxXKUXWqZ3AoftJmkVHn3SJ6dSXU/yByt26aduDO7ZHY1zwAZLk+dKJeGktSYu9PeVU2FBYv3HZFp05Wj101pKZ8z8F2nlbx91z+rOFloJ9cu1mcUjhCwf8CeKBDhu8Ep2N1a8+7aDRXlSn231K829PHqiX0fVd5AVPtO1YzF6zM1+o5b5UvsZqLvTkStPf6iKr/j2kTY9rS+4/K691o7KcfVKWoEouA7jar3QuRTaN6gRIyo8J2ud3yX3euR8ThR8J1O6H/8fiLbmgXf6VT3trBKvocrfKe2IDTzFN+u3HdaGHJHvVWDaLB9oj7oMT0RvtPrRpWrBIiG3y8BgInqucZ3uncIHvqNktdk5FXHSlt5G/hupMLuBdaaUxz92s/HL5QtVglratC2VoS4LRxLMNSxXhOrusUh+eijj8boD5nyxqZzTYowAAAAAElFTkSuQmCC'

const createShareButton = master => {
    if (document.getElementById('__tx__share__share__button')) return
    const shareButton = document.createElement('img')
    shareButton.src = shareIMg
    shareButton.id = '__tx__share__share__button'
    shareButton.style.position = 'absolute'
    shareButton.style.right = '20px'
    shareButton.style.top = '50px'
    shareButton.style.width = '25px'
    shareButton.style.height = '25px'
    shareButton.style.zIndex = 999
    shareButton.onclick = e => master.ui.open()
    document.body.appendChild(shareButton)
}
/**
 * @description 如果是weishi client或者webview，会自动加载weishi的sdk，然后覆盖master api的分享方法
 */
export default async master => {
    if (master.browser.isWS) {
        master.isSupportBase64 = true
        if (!window.mqq) {
            await master.load('//qzonestyle.gtimg.cn/qzone/hybrid/app/weishi/lib/wsapi.js')
        }
        const shareLinkAux = (sinfo, cmd, source) => {
            const tmp = !sinfo.isExt ? {} : sinfo
            window.mqq.invoke(
                'share',
                cmd,
                {
                    ...tmp,
                    type: 'url',
                    title: sinfo.title,
                    imgUrl: sinfo.imgUrl,
                    link: sinfo.link,
                    desc: sinfo.desc
                    // ext: sinfo.ext || {},
                    // sq_ark_info: sinfo.sq_ark_info,
                    // activity_type: sinfo.activity_type,
                    // wx_mini_program: sinfo.wx_mini_program
                },
                data => master.shareCallback(data, source)
            )
        }
        const shareImgWxAux = (sinfo, cmd, source) =>
            window.mqq.invoke(
                'share',
                cmd,
                {
                    type: 'image',
                    title: sinfo.title,
                    content: sinfo.base64,
                    link: sinfo.link,
                    desc: sinfo.desc
                },
                data => master.shareCallback(data, source)
            )
        const shareImgQQAux = (sinfo, cmd, source) =>
            window.mqq.invoke(
                'share',
                cmd,
                {
                    type: 'image',
                    content: sinfo.base64,
                    appName: sinfo.appName || '',
                    link: sinfo.link,
                    desc: sinfo.desc
                },
                data => master.shareCallback(data, source)
            )
        overWrite(master.api, {
            openNativeShare: _ => window.mqq.invoke('ui', 'showShareMenu') || true,
            setShareInfo: (s, callback, fix) => {
                if (!(master.ui.state && master.ui.state.disableWSCustomBtn)) return createShareButton(master)
                const tmp = !master.shareInfo.isExt ? {} : master.shareInfo
                //&& !self.compareWSVersion('5.6.0', 'gt')
                master.shareInfo = s
                master.shareCallback = callback
                window.mqq.invoke(
                    'data',
                    'setShareInfo',
                    {
                        ...tmp,
                        type: 'url',
                        share_url: master.shareInfo.link,
                        jump_url: master.shareInfo.link,
                        title: master.shareInfo.title,
                        weibo_title: master.shareInfo.title,
                        summary: master.shareInfo.desc,
                        weibo_summary: master.shareInfo.desc,
                        desc: master.shareInfo.desc,
                        image_url: master.shareInfo.imgUrl,
                        pic_url: master.shareInfo.imgUrl,
                        weibo_pic_url: master.shareInfo.imgUrl
                        // sq_ark_info: master.shareInfo.sq_ark_info,
                        // wx_mini_program: master.shareInfo.wx_mini_program,
                        // activity_type: master.shareInfo.activity_type,
                        // source_name: master.shareInfo.sourceName || ''
                    },
                    data => {
                        if (window.mqq.share) {
                            window.mqq.share.setOnShareHandler(type => {
                                shareLinkAux(s, type, ['qq', 'qzone', 'weixin', 'timeLine', 'weibo'][type])
                            })
                        }
                    }
                )
            },
            share2qq: _ => (master.shareInfo.type === 'base64' ? shareImgQQAux(master.shareInfo, 'shareQQ', 'qq') : shareLinkAux(master.shareInfo, 'shareQQ', 'qq')),
            share2wx: _ =>
                master.shareInfo.type === 'base64' ? shareImgWxAux(master.shareInfo, 'shareAppMessage', 'weixin') : shareLinkAux(master.shareInfo, 'shareAppMessage', 'weixin'),
            share2qz: _ => (master.shareInfo.type === 'base64' ? shareImgQQAux(master.shareInfo, 'shareQZone', 'qzone') : shareLinkAux(master.shareInfo, 'shareQZone', 'qzone')),
            share2timeLine: _ =>
                master.shareInfo.type === 'base64' ? shareImgWxAux(master.shareInfo, 'shareTimeline', 'timeLine') : shareLinkAux(master.shareInfo, 'shareTimeline', 'timeLine')
        })
    }
}
