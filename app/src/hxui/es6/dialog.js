/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 展示加载框
     * @param options
     * @param options.title  自定义加载文案
     * @param options.during  展示时长  单位为： 毫秒
     */
    const showLoading = (options) => {
        const title = options ? ( options.title || '加载中...' ) : '加载中...';
        const during = options ? options.during : null;
        const $view = $('.hx-loading-modal');
        if ($view.length !== 0) {
            $view.addClass('show');
            $view.find('.txt-loading').text(title);
        } else {
            const node =
                `<div class='hx-loading-modal'>
                   <section class='hx-loading'></section>
                   <span class='txt-loading'>${title}</span>
                </div>`;
            $(node).appendTo('body');
            const timer = setTimeout(() => {
                $('.hx-loading-modal').addClass('show');
                clearTimeout(timer);
            }, 30);
        }
        if (during && (typeof during === 'number')) {
            const timer2 = setTimeout(() => {
                $('.hx-loading-modal').removeClass('show');
                clearTimeout(timer2);
            }, during);
        }
    };

    const hideLoading =  () => {
        $('.hx-loading-modal').removeClass('show');
    };

    window.HXUI = Object.assign(window.HXUI, { showLoading, hideLoading });
}(jQuery, window));