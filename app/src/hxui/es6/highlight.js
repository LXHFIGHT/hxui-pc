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
     * @param options.elem  需要高亮的组件
     * @param options.type  高亮颜色
     */
    const markInput = (options) => {
        const elem = options ? (options.elem || 'input') : 'input, textarea';
        const type = options ? (options.type || 'blue') : 'blue';
        const $view = $(elem);
        $view.addClass('hx-mark-anim').addClass(type);
        const timer = setTimeout(() => {
            $view.removeClass('hx-mark-anim').removeClass(type);
            clearTimeout(timer);
        }, 2000);
    };

    window.HXUI = Object.assign(window.HXUI, { markInput });
}(jQuery, window));