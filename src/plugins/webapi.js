import overWrite from '../util/overWrite'
import qrcode from 'qrcode'
/**
 * @description 默认的分享方法，都是通过webapi 的方式来分享。
 */
export default async master => {
    let hasQrCodeShow = false;
    const openit = (u, n, p) => {
        const o = _ => {
            const z = window.open(u, n, p)
            if (!z) {
                location.href = u
            } else {
                z.focus()
            }
        }
        master.browser.mozilla ? setTimeout(o, 0) : o()
    }
    const showQRcode = (imgrul) => {
        const dialogContainer = document.createElement('div')
        const dialog = document.createElement('div')
        const close = document.createElement('div')
        const img = document.createElement('img')
        dialog.style.position = 'absolute'
        dialog.style.margin = 'auto'
        dialog.style.left = '50%'
        dialog.style.top = '50%'
        dialog.style.transform = 'translate(-50%, -50%)'
        dialog.style.width = '40vw'
        dialog.style.height = '40vw'
        dialog.style.maxWidth = '200px'
        dialog.style.maxHeight = '200px'
        dialog.style.backgroundColor = 'red'
        dialog.style.zIndex = 99999
        close.style.position = 'absolute'
        close.style.right = '-10px'
        close.style.top = '-10px'
        close.style.backgroundColor = 'rgba(0,0,0,.8)'
        close.style.color = 'white'
        close.style.fontSize = '16px'
        close.style.padding = '5px 12px'
        close.style.borderRadius = '50%'
        close.innerHTML = '<span class="_close">x</span>'
        close.onclick = e => {
            hasQrCodeShow = false;
            e.stopPropagation()
            e.preventDefault()
            document.body.removeChild(dialog)
        }
        img.src = imgrul
        img.crossOrigin = 'Anonymous'
        img.style.width = '100%'
        img.style.height = '100%'
        dialog.appendChild(img)
        dialog.appendChild(close)
        document.body.appendChild(dialog)
    }

    overWrite(master.api, {
        openNativeShare: _ => false,
        setShareInfo: s => (master.shareInfo = s),
        share2qq: () => {
            const shareInfo = master.shareInfo
            const w = '//connect.qq.com/widget/shareqq/index.html',
                q = [
                    '?url=',
                    encodeURIComponent(shareInfo.link),
                    '&title=',
                    encodeURIComponent(shareInfo.title),
                    '&dec=',
                    encodeURIComponent(shareInfo.desc)
                ].join(''),
                p = [w, q].join('')
            openit(
                p,
                'qq',
                'toolbar=0,status=0,resizable=1,width=440,height=430'
            )
            master.shareCallback(null, 'qq')
        },
        share2weibo: () => {
            const shareInfo = master.shareInfo
            const w = '//service.weibo.com/share/share.php',
                q = [
                    '?url=',
                    encodeURIComponent(shareInfo.link),
                    '&title=',
                    encodeURIComponent(shareInfo.title),
                    '&description=',
                    encodeURIComponent(shareInfo.desc),
                    shareInfo.link,
                    '&content=utf-8',
                    '&pic=',
                    encodeURIComponent(shareInfo.imgUrl)
                ].join(''),
                p = [w, q].join('')
            openit(
                p,
                'sina',
                'toolbar=0,status=0,resizable=1,width=440,height=430'
            )
            master.shareCallback(null, 'weibo')
        },
        share2qz: () => {
            const shareInfo = {
                url: master.shareInfo.link,
                jumpUrl: master.shareInfo.link,
                title: master.shareInfo.title,
                desc: master.shareInfo.desc,
                pic: master.shareInfo.imgUrl
            }
            let buff = [],
                p
            for (const k in shareInfo) {
                buff.push(k + '=' + encodeURIComponent(shareInfo[k] || ''))
            }
            p =
                'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' +
                buff.join('&')
            openit(
                p,
                'qzoneshare',
                'width=700, height=480, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no'
            )
            master.shareCallback(null, 'qzone')
        },
        share2timeLine: async e => {
            if (hasQrCodeShow) return;
            hasQrCodeShow = true;
            const shareInfo = master.shareInfo
            // const qrcode = await import('qrcode')
            qrcode.toDataURL(shareInfo.link, (err, url) => {
                showQRcode(url)
                master.shareCallback(null, 'timeLine')
            })
        },
        share2wx: async e => {
            if (hasQrCodeShow) return;
            hasQrCodeShow = true;
            const shareInfo = master.shareInfo
            // const qrcode = await import('qrcode')
            qrcode.toDataURL(shareInfo.link, (err, url) => {
                showQRcode(url)
                master.shareCallback(null, 'weixin')
            })
        }
    })
}
