/**
 * Created by lxhfight on 2018/6/29.
 * Email:
 * Description:
 *    弹出式选项框方法
 */

(function($, window) {
    window.HXUI = window.HXUI || {};
    const modalQuery = '.hx-modal.actionsheet';
    /**
     * 展示加载框
     * @param options
     * @param options.title  选项框标题， 默认"请选择"
     * @param options.items   选项数组
     *                        其中每一项以 {key:'', value:''}（如： {key: 'foo', value: 'bar'}） 形式
     *                        或者当不需要区分key，value时，可以只提供基本数据类型，如12，'foo'
     * @param options.onSelect 当点击其中任一选项时
     */
    const actionSheet = (options) => {
        const items = options.items || [];
        const $view = $(modalQuery);
        const _quit = () => {
            const { showActionSheetTimer, showActionSheetTimer2 } = window.HXUI;
            showActionSheetTimer && (clearTimeout(showActionSheetTimer));
            showActionSheetTimer2 && (clearTimeout(showActionSheetTimer2));
            $(modalQuery).removeClass('show');
            window.HXUI.showActionSheetTimer2 = setTimeout(() => {
                $(modalQuery).remove();
            }, 400);
        };
        const onSelect = typeof options.onSelect === 'function'
            ? options.onSelect
            : () => { console.log('请提供onSelect（选择任一选项后的事件）作为HXUI.actionSheet 方法的参数'); _quit() };
        const _generateItemNodes = items.map((v) => {
            if (typeof v === 'object') {
                return `<li class="item" data-value="${v.value}">${v.key}</li>`
            } else {
                return `<li class="item" data-value="${v}">${v}</li>`
            }
        });
        if ($view.length !== 0) {
            _quit();
        }
        const node =
            `<div class='hx-modal actionsheet'>
                <div class="mask"></div>
                <div class="content">
                    <ul class="hx-actionsheet">
                        ${_generateItemNodes.join('')}
                    </ul>
                    <ul class="hx-actionsheet">
                        <li class="item-quit">取消选择</li>
                    </ul>
                </div>
            </div>`;
        $(node).appendTo('body');
        window.HXUI.showActionSheetTimer = setTimeout(() => {
            $(modalQuery).addClass('show');
        }, 10);
        $(modalQuery)
            .on('click', '.item', (e) => {
                const item = {
                    key: e.target.innerText,
                    value: e.target.dataset.value,
                };
                onSelect(item);
                _quit();
            })
            .on('click', '.mask, .item-quit', _quit);
    };

    window.HXUI = Object.assign(window.HXUI, { actionSheet });
}(jQuery, window));
