/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function($, window){
    window.HXUI = window.HXUI || {};
    const loadingModalQuery = '.hx-small-modal.loading';
    const tipsModalQuery = '.hx-small-modal.tips';
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

    /**
     * 展示加载框
     * @param options
     * @param options.title  自定义加载文案
     * @param options.during  展示时长  单位为： 毫秒
     */
    const showTip = (options) => {
        const title = options ? ( options.title || '加载中...' ) : '加载中...';
        const during = options ? (options.during || 1500) : 1500;
        const type = options ? (options.type || 'success') : 'success';
        const $view = $(tipsModalQuery);
        if ($view.length !== 0) {
            $view.addClass('show');
            $view.find(tipsModalQuery).text(title);
            $view.find('#hx-icon')[0].setAttribute('class', `hx-icon ${type}`);
        } else {
            const node =
                `<div class='hx-small-modal tips'>
                   <section id="hx-icon" class='hx-icon ${type}'></section>
                   <span class='text-small-modal'>${title}</span>
                </div>`;
            $(node).appendTo('body');
            const timer = setTimeout(() => {
                $(tipsModalQuery).addClass('show');
                clearTimeout(timer);
            }, 0);
        }
        const timer2 = setTimeout(() => {
            $(tipsModalQuery).removeClass('show');
            clearTimeout(timer2);
        }, during);
    };



    window.HXUI = Object.assign(window.HXUI, { showLoading, hideLoading, showTip });
}(jQuery, window));