/**
 * Created by lxhfight on 2017/10/9.
 * Email:
 * Description:
 * 轻量级的弹出框提示
 */
(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 轻量级的弹出框提示
     * @param msg   消息内容
     * @param level 等级 1：通知， 2: 警告， 3：错误
     * @param second 提示时长
     */
    let timeout = null;
    let _showTipLight = (msg, level, second) => {
        clearTimeout(timeout);
        let className = 'default';
        if(level === 1){
            className = 'success';
        }
        else if(level === 2){
            className = 'warn';
        }
        else if(level === 3){
            className = 'error';
        }
        if ($('.pad-poptip').length !== 0) {
            $('.pad-poptip').attr('class', 'pad-poptip ' + className).text(msg).addClass('show');
        } else {
            var node = "<div class='pad-poptip " + className + "'  >" + msg + "</div>";
            $(node).appendTo('body');
            setTimeout(function(){
                $('.pad-poptip').addClass('show');
            }, 100);
        }
        timeout = setTimeout(function() {
            $('.pad-poptip').removeClass('show');
        }, second);
    };

    //  通知级别的弹出提示
    const popTipInfo = (msg) => {
        _showTipLight(msg, 1, 3000);
    };
    const popTipInfoQuick = (msg) => {
        _showTipLight(msg, 1, 1500);
    };
    //  警告级别的弹出提示
    const popTipWarning = (msg) => {
        _showTipLight(msg, 2, 3000);
    };
    const popTipWarningQuick = (msg) => {
        _showTipLight(msg, 2, 1500);
    };
    //  错误级别的弹出提示
    const popTipError = (msg) =>   {
        _showTipLight(msg, 3, 3000);
    };
    const popTipErrorQuick = (msg) =>   {
        _showTipLight(msg, 3, 1500);
    };
    //  随便的弹出提示
    const popTipNormal = (msg) =>  {
        _showTipLight(msg, -1,3000);
    };
    const popTipNormalQuick = (msg) =>  {
        _showTipLight(msg, -1,1500);
    };


    window.HXUI = Object.assign(window.HXUI, {
        popTipInfo,
        popTipInfoQuick,
        popTipWarning,
        popTipWarningQuick,
        popTipError,
        popTipErrorQuick,
        popTipNormal,
        popTipNormalQuick
    });

}(jQuery, window));


