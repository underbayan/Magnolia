export default () => {
    const ua = navigator.userAgent || ''
    const iPad = ua.match(/(iPad).*OS\s([\d_]+)/),
        iPhone = !iPad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        iPod = ua.match(/(iPod).*OS\s([\d_]+)/),
        android = ua.match(/(Android)\s+([\d.]+)/) || ua.match(/Android/),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        isMobile = iPad || iPhone || iPad || wp || android
    const isWX = ua.match(/MicroMessenger\/([\d\.]+)/), //微信
        isQQ = ua.match(/QQ\/([\d\.]+)/), //手Q
        isQzone = ua.match('Qzone'), //手空
        isQQBrowser = ua.match('MQQBrowser'), //qq浏览器
        isFM = ua.match('_FM_'), //企鹅FM
        isQQYY = ua.match('QQMusic'), // qqmusic
        isWS = ua.match('_WEISHI_'), //微视
        isPITU = ua.match('_PITU_') //天天P图，不然就被误认为QQ浏览器了
    let client = 'other'
    if (isQQ) {
        client = 'qq'
    } else if (isQzone) {
        client = 'qzone'
    } else if (isWX) {
        client = 'wx'
    } else if (isFM) {
        client = 'fm'
    } else if (isWS) {
        client = 'ws'
    } else if (isPITU) {
        client = 'ttpic'
    } else if (isQQBrowser) {
        client = 'QQBrowser'
    }
    let quaString =
        (ua.match(/Qzone\/[^ ]*/) && ua.match(/Qzone\/[^ ]*/)[0]) || ''
    if (quaString && quaString != '') {
        quaString = quaString.replace('Qzone/', '')
    }
    //手Q也来一发
    if (!quaString || quaString == '') {
        //手Q android userua
        //Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; MI NOTE LTE Build/KTU84P) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025489 Mobile Safari/533.1 V1_AND_SQ_6.2.1_334_YYB_D QQ/6.2.1.2690 NetType/WIFI WebP/0.3.0 Pixel/1080
        //手Q ios userua
        //user-ua: Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 QQ/6.2.2.402 Pixel/750 NetType/WIFI Mem/51
        //需要输出成V1_IPH_SQ_6.2.2_1_APP_A
        //先把android的搞出来
        var qqQuaReg = /(V\S+_\S+_\S+_\S+_\S+_\S+_\S+)/
        quaString = (ua.match(qqQuaReg) && ua.match(qqQuaReg)[1]) || ''
        if (!quaString || quaString == '') {
            //再把ios的qq版本号转换出来
            quaString =
                (ua.match(/QQ\/[^ ]*/) && ua.match(/QQ\/[^ ]*/)[0]) || ''
            if (quaString && quaString != '') {
                quaString = quaString.replace('QQ/', '')
                var quaArr = quaString.split('.')
                if (quaArr && quaArr.length == 4) {
                    quaString =
                        'V1_IPH_SQ_' +
                        quaArr[0] +
                        '.' +
                        quaArr[1] +
                        '.' +
                        quaArr[2] +
                        '_1_APP_A'
                } else {
                    quaString = ''
                }
            }
        }
    }
    let msie, version, mozilla, webkit, opera, m
    if (window.ActiveXObject || window.msIsStaticHTML) {
        msie = true
        ;(window.XMLHttpRequest || ua.indexOf('MSIE 7.0') > -1) && (version = 7)
        ;(window.XDomainRequest || ua.indexOf('Trident/4.0') > -1) &&
            (version = 8)
        ua.indexOf('Trident/5.0') > -1 && (version = 9)
        ua.indexOf('Trident/6.0') > -1 && (version = 10)
        ua.indexOf('Trident/7.0') > -1 && (version = 11)
    } else if (
        document.getBoxObjectFor ||
        typeof window.mozInnerScreenX != 'undefined'
    ) {
        r = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+)/i
        mozilla = true
        version = parseFloat((r.exec(ua) || r.exec('Firefox/3.3'))[1], 10)
    } else if (!navigator.taintEnabled) {
        webkit = true
        m = /AppleWebKit.(\d+\.\d+)/i.exec(ua)
        version = m
            ? parseFloat(m[1], 10)
            : document.evalbrowserte
                ? document.querySelector
                    ? 525
                    : 420
                : 419
    } else if (window.opera) {
        opera = true
        version = parseFloat(window.opera.version(), 10)
    }

    return {
        os: {
            iPad,
            iPhone,
            android,
            wp
        },
        client,
        isMobile,
        isWX,
        isQzone,
        isQQ,
        isQQYY,
        isFM,
        isWS,
        isPITU,
        isQQBrowser,
        msie,
        version,
        mozilla,
        webkit,
        opera,
        quaString
    }
}
