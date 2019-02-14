import toggleClass from '../util/toggleClass'
import guid from '../util/uuid'
export default (master, opts) => {
    const uuid = guid()
    class UI {
        constructor(

        ) {
            const oldState = this.state || {
                copy: {
                    chooseShare: '选择分享方式',
                    shareImage: '分享图',
                    shareLink: '分享链接'
                },
                uuid: uuid,
                isPreview: true,
                isSupportBase64: master.isSupportBase64 && master.shareInfo.base64,
                shareInfo: master.shareInfo,
                type: master.shareInfo.type === 'base64',
                shareConfig: {
                    qq: true,
                    qz: true,
                    wx: true,
                    timeLine: true,
                    weibo: true
                },
                disableWSCustomBtn: false
            }
            this.state = Object.assign(oldState, opts.uiState)
            this.mountId = (opts.mountId || '__tx__share__dom__')
            this.maskMountId = this.mountId + 'mask'
            if (!document.getElementById(this.mountId)) this.appendDom()
            if (!document.getElementById(this.maskMountId)) this.appendMaskDom()
        }
        renderToHtml() {
            const _t = this.state
            return `
            <link media="all" rel="stylesheet" href="//qzs.qzone.qq.com/qz-proj/weishi-mobile/mod-pop-share.css">
              <link media="all" rel="stylesheet" href="//qzs.qzone.qq.com/qz-proj/weishi-mobile/mod-tip-mask.css">
            <div class="pop pop-share show" id="pop-share-${uuid}">
                <div class="mod-box">
                    ${_t.isPreview?`
                    <div class="box-hd">
                        <h4 class="tit">
                            ${_t.shareInfo.link&&_t.isSupportBase64?_t.copy.chooseShare:''}
                        </h4>
                        <button class="btn-close">
                            <i style="overflow:visible" class="icon icon-close icon-share-close" id="icon-share-close-${uuid}"></i>
                        </button>
                    </div>
                    <div class="box-bd">
                        <ul class="type-list">

                            ${_t.isSupportBase64 ? `
                            <li class="type-item ${_t.type?'act':''}" id="tx-share-option-1-${uuid}">
                                <h5 class="type-tit">${_t.copy.shareImage}</h5>
                                <div class="share-card-wrap">
                                    <img src="${_t.shareInfo.base64}" style="width:100%" />
                                </div>
                                ${_t.shareInfo.link?`<i style="overflow:visible" class="icon icon-check"></i>`:''}
                            </li>` : ``}

                            ${_t.shareInfo.link?`<li class = "type-item ${_t.isSupportBase64&&!_t.type?'act':''} "
                            id = "tx-share-option-2-${uuid}" >
                                <h5 class="type-tit">${_t.copy.shareLink}</h5>
                                <div class="share-link-wrap">
                                    <div class="pic" style="background-image:url(${_t.shareInfo.imgUrl})"></div>
                                    <p class="txt">${_t.shareInfo.desc}</p>
                                </div>
                                ${ _t.shareInfo.link && _t.isSupportBase64 ? `<i style="overflow:visible" class="icon icon-check"></i>` : ''
                                }
                            </li>`:''}

                        </ul>
                    </div>`:''}
                    <div class="box-ft">
                        <h4 class="tit">
                            <span>分享到</span>
                            ${!_t.isPreview?`
                            <button class="btn-close">
                            <i style="overflow:visible" class="icon icon-close icon-share-close" id="icon-share-close-${uuid}"></i>
                            </button>`:''}
                        </h4>
                        <ul class="share-list">
                            ${_t.shareConfig.qq?`
                            <li class="share-item">
                                <i style="overflow:visible" class="icon icon-share-qq" id="icon-share-qq-${uuid}"></i>
                                <span class="txt">QQ</span>
                            </li>`:''}
                            ${_t.shareConfig.qz?`
                            <li class="share-item">
                                <i style="overflow:visible" class="icon icon-share-qz" id="icon-share-qz-${uuid}"></i>
                                <span class="txt">QQ空间</span>
                            </li>`:''}
                        ${_t.shareConfig.wx?`
                            <li class="share-item">
                                <i style="overflow:visible" class="icon icon-share-wx" id="icon-share-wx-${uuid}"></i>
                                <span class="txt">微信</span>
                            </li>`:''}
                        ${_t.shareConfig.timeLine?`
                            <li class="share-item">
                                <i style="overflow:visible" class="icon icon-share-pyq" id="icon-share-pyq-${uuid}"></i>
                                <span class="txt">朋友圈</span>
                            </li>`:''}
                            ${_t.shareConfig.weibo?`
                            <li class="share-item">
                                <i style="overflow:visible" class="icon icon-share-wb" id="icon-share-wb-${uuid}"></i>
                                <span class="txt">微博</span>
                            </li>`:''}
                        </ul>
                    </div>
                </div>
            </div>`
        }
        appendMaskDom() {
            const d = document.createElement('div')
            d.id = this.maskMountId
            d.innerHTML = '<div class="mod-tip-mask" > <div class="arrow"></div> <p class="tip">点击右上角分享给好友</p></div >'
            d.style.display = 'none'
            document.body.appendChild(d)
        }
        appendDom() {
            const d = document.createElement('div')
            d.id = this.mountId
            d.style.display = 'none'
            document.body.appendChild(d)
        }
        getMountDom() {
            const mountDom = document.getElementById(this.mountId)
            if (!mountDom) {;
                (console.error || console.log)(
                    'MoundID:',
                    this.mountId,
                    'is not found!'
                )
                return null
            }
            return mountDom
        }
        update() {
            if (!this.getMountDom()) return
            this.state.shareInfo = master.shareInfo
            this.state.isSupportBase64 =
                master.isSupportBase64 && master.shareInfo.base64
            this.state.type = master.shareInfo.type === 'base64'
            this.getMountDom().innerHTML = this.renderToHtml()
            this.afterInstall()
        }
        setState(s) {
            this.state = s
            this.update()
        }
        openMask() {
            const overMask = document.getElementById(this.maskMountId)
            overMask.style.display = 'block'
            overMask.addEventListener(
                'click',
                () => (overMask.style.display = 'none')
            )
        }
        closeMask() {
            const overMask = document.getElementById(this.maskMountId)
            overMask.style.display = 'none'
        }
        open() {
            if (!this.getMountDom()) return
            this.getMountDom().style.display = 'block'
        }
        close() {
            if (!this.getMountDom()) return
            this.getMountDom().style.display = 'none'
        }
        afterInstall() {
            const that = this
            document
                .getElementById('icon-share-close-' + uuid)
                .addEventListener('click', e => that.close(e))
            document
                .getElementById('pop-share-' + uuid)
                .addEventListener('click', function (e) {
                    const target = e.target || e.srcElement;
                    if (target === this) {
                        that.close(e);
                    }
                })
            that.state.shareConfig.qq &&
                document
                .getElementById('icon-share-qq-' + uuid)
                .addEventListener('click', e => master.api.share2qq(e))
            that.state.shareConfig.qz &&
                document
                .getElementById('icon-share-qz-' + uuid)
                .addEventListener('click', e => master.api.share2qz(e))
            that.state.shareConfig.wx &&
                document
                .getElementById('icon-share-wx-' + uuid)
                .addEventListener('click', e => master.api.share2wx(e))
            that.state.shareConfig.timeLine &&
                document
                .getElementById('icon-share-pyq-' + uuid)
                .addEventListener('click', e =>
                    master.api.share2timeLine(e)
                )
            that.state.shareConfig.weibo &&
                document
                .getElementById('icon-share-wb-' + uuid)
                .addEventListener('click', e => master.api.share2weibo(e))

            const option1 = document.getElementById('tx-share-option-1-' + uuid)
            const option2 = document.getElementById('tx-share-option-2-' + uuid)
            option2 &&
                option2.addEventListener('click', e => {
                    master.shareInfo.type = 'link'
                    toggleClass(option2, 'act')
                    toggleClass(option1, 'act')
                })
            option1 &&
                option1.addEventListener('click', e => {
                    master.shareInfo.type = 'base64'
                    toggleClass(option2, 'act')
                    toggleClass(option1, 'act')
                })
        }
    }
    master.ui = new UI()
    master.ui.update()
}
