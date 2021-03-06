/**
 * Created by lxhfight on 2018/6/11.
 * Email:
 * Description:
 *    弹出简易提示框的方法
 */

(function($, window) {
    window.HXUI = window.HXUI || {};
    const tipsModalQuery = '.hx-small-modal.tips';
    /**
     * 展示加载框
     * @param options
     * @param options.title  自定义加载文案
     * @param options.type   提示消息类型：目前支持 'success'（默认） 和 'error'
     * @param options.during  展示时长  单位为： 毫秒
     */
    const toast = (options) => {
        const title = options ? ( options.title || '加载中...' ) : '加载中...';
        const during = options ? (options.during || 1500) : 1500;
        const type = options ? (options.type || 'success') : 'success';
        const $view = $(tipsModalQuery);
        if ($view.length !== 0) {
            $view.remove();
            const { shopTipTimer, shopTipTimer2 } = window.HXUI;
            clearTimeout(shopTipTimer);
            clearTimeout(shopTipTimer2);
        }
        const node =
            `<div class='hx-small-modal tips'>
               <section id="hx-icon" class='hx-icon ${type}'></section>
               <span class='text-small-modal'>${title}</span>
            </div>`;
        $(node).appendTo('body');
        window.HXUI.shopTipTimer = setTimeout(() => {
            $(tipsModalQuery).addClass('show');
        }, 10);
        window.HXUI.shopTipTimer2 = setTimeout(() => {
            $(tipsModalQuery).removeClass('show');
        }, during);
    };

    window.HXUI = Object.assign(window.HXUI, { toast });
}(jQuery, window));
