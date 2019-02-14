'use strict'
import scriptjs from 'scriptjs'
import browser from './util/browser.js'
import qq from './plugins/qq.js'
import qmusic from './plugins/qmusic.js'
import weixin from './plugins/weixin.js'
import qzone from './plugins/qzone.js'
import weishi from './plugins/weishi.js'
import webapi from './plugins/webapi.js'
import defaultTheme from './plugins/theme'
/**
 * @description tx公用的share组件
 * @method config
 * @param {Object} [opts]
 * @param {String} [otps.mountId=''] optional default theme uses body dom to mount
 * @param {Object} [otps.uiState={}] optional
 * @param {Object} [otps.wxConfig={}] optional
 * @param {Object} [otps.shareInfo=...] please see the default define in the code.
 * @example 1
 * Just load the script and then using global variable TX_SHARE to config.
 * @see following example 2 demo,TX_SHARE behavior is the same with Share.
 * const share = new window.TX_SHARE
 * share.api...
 * share.ui...
 * share.shareInfo...
 * @example 2
 * import Share from 'tx-share'
 * const share= new Share()
 * share.config({shareInfo : { type: 'link' ,base64:'' ,link: '',title: '',imgUrl: '',desc: ''},callback:_=>_,mountId="xxxx",uiState={},wxConfig})
 * share.api.share2qq()
 * share.api.share2wx()
 * share.api.share2weibo()
 * share.api.share2timeLine()
 * share.api.share2qz()
 *
 * share.ui.update() // you should call update after you set new share info to update the UI.
 * share.ui.open()
 * share.ui.close()
 * if you want to change the behavior of share, inject a plugin to modify anything.
 * plugin1= master => { master.api={},master.ui={} }
 * share.use(plugin1,opts)
 *
 * @class Share
 */
class Share {
    constructor() {
        this.browser = browser()
        this.api = {
            openNativeShare: _ => _,
            setShareInfo: _ => _,
            share2weibo: _ => _,
            share2qq: _ => _,
            share2qz: _ => _,
            share2wx: _ => _,
            share2timeLine: _ => _,
            initWx: async _ => _
        }
        this.ui = {}
    }
    async config({
        shareInfo = {},
        callback = _ => _,
        uiState = null,
        wxConfig = null,
        mountId = ''
    } = {}) {
        this.shareInfo = shareInfo
        this.shareCallback = callback
        await this.use(defaultTheme, {
            mountId,
            uiState
        })
        await this.use(webapi)
        await this.use(weixin)
        await this.use(qzone)
        await this.use(weishi)
        await this.use(qmusic)
        await this.use(qq)
        wxConfig && this.api.initWx(wxConfig)
        this.setDefaultShareInfo()
        return this
    }
    setDefaultShareInfo() {
        const firstImg = document.getElementsByTagName('img')[0]
        this.shareInfo = this.shareInfo.link ?
            this.shareInfo : {
                type: 'link' /**link| base64*/ ,
                base64: '' /**optional only support jpeg or jpg data url*/ ,
                link: window.location.href /** reuqired ,url link*/ ,
                title: document.title,
                imgUrl: firstImg && firstImg.src,
                desc: ''
            };

        !this.shareInfo.manualSet && this.api.setShareInfo(this.shareInfo, this.shareCallback)
    }
    async use(plugins, opts) {
        await plugins(this, opts)
    }
    load(url) {
        scriptjs(url, 'bundle')
        return new Promise((res, rej) => scriptjs.ready('bundle', _ => res(_)))
    }
}

export default Share
