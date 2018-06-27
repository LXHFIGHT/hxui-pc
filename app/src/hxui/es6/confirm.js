/**
 * Created by lxhfight on 2018/6/11.
 * Email:
 * Description:
 *    弹出确认提示框的方法
 */

(function($, window) {
    window.HXUI = window.HXUI || {};
    const confirmModalQuery = '.hx-modal.confirm';
    /**
     * 展示加载框
     * @param options
     * @param options.title  弹出框标题， 默认"提示"
     * @param options.content   提示消息类型：目前支持 'success'（默认） 和 'error'
     * @param options.confirmFunc
     * @param options.confirmText
     * @param options.cancelFunc
     * @param options.cancelText
     */
    const confirm = (options) => {
        const $view = $(confirmModalQuery);
        const title = options.title || '提示';
        const content = options.content;
        const confirmText = options.confirmText || '确认';
        const cancelText = options.cancelText || '取消';
        const _quitConfirm = () => {
            console.log('quiting...');
            const { showConfirmTimer, showConfirmTimer2 } = window.HXUI;
            showConfirmTimer && (clearTimeout(showConfirmTimer));
            showConfirmTimer2 && (clearTimeout(showConfirmTimer2));
            $(confirmModalQuery).removeClass('show');
            window.HXUI.showConfirmTimer2 = setTimeout(() => {
                $(confirmModalQuery).remove();
            }, 400);
        };
        const confirmFunc = typeof options.confirmFunc === 'function'
            ? () => { options.confirmFunc(); _quitConfirm(); }
            : () => { console.log('请提供confirmFunc（点击确认后的事件）作为HXUI.confirm方法的参数'); _quitConfirm() };
        const cancelFunc = typeof options.cancelFunc === 'function'
            ? () => { options.cancelFunc(); _quitConfirm(); }
            : _quitConfirm;
        if ($view.length !== 0) {
            $view.remove();
            const { shopTipTimer, shopTipTimer2 } = window.HXUI;
            clearTimeout(shopTipTimer);
            clearTimeout(shopTipTimer2);
        }
        const node =
            `<div class='hx-modal confirm'>
                <div class="mask"></div>
                <div class="content">
                    <header>${title}</header>
                    <div class="hx-content">
                        ${content}
                    </div>
                    <footer>
                        <button class="hx-button main btn-confirm">
                            ${confirmText}
                        </button>
                        <button class="hx-button btn-cancel">
                            ${cancelText}
                        </button>
                    </footer>
                </div>
            </div>`;
        $(node).appendTo('body');
        $(confirmModalQuery)
            .on('click', '.btn-confirm', confirmFunc)
            .on('click', '.btn-cancel', cancelFunc)
            .on('click', '.mask', _quitConfirm);
        window.HXUI.showConfirmTimer = setTimeout(() => {
            $(confirmModalQuery).addClass('show');
        }, 10);
    };

    window.HXUI = Object.assign(window.HXUI, { confirm });
}(jQuery, window));
