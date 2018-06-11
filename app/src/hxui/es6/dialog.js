/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function($, window){
    window.HXUI = window.HXUI || {};
    const loadingModalQuery = '.hx-small-modal.loading';

    /**
     * 展示加载框
     * @param options
     * @param options.title  自定义加载文案
     * @param options.during  展示时长  单位为： 毫秒
     */
    const showLoading = (options) => {
        const title = options ? ( options.title || '加载中...' ) : '加载中...';
        const during = options ? (options.during || 5000) : 5000;
        const $view = $(loadingModalQuery);
        if ($view.length !== 0) {
            $view.addClass('show');
            $view.find('.text-small-modal').text(title);
        } else {
            const node =
                `<div class='hx-small-modal loading'>
                   <section class='hx-loading'></section>
                   <span class='text-small-modal'>${title}</span>
                </div>`;
            $(node).appendTo('body');
            const timer = setTimeout(() => {
                $(loadingModalQuery).addClass('show');
                clearTimeout(timer);
            }, 0);
        }
        const timer2 = setTimeout(() => {
            $(loadingModalQuery).removeClass('show');
            clearTimeout(timer2);
        }, during);
    };

    const hideLoading =  () => {
        $(loadingModalQuery).removeClass('show');
    };


    window.HXUI = Object.assign(window.HXUI, { showLoading, hideLoading });
}(jQuery, window));