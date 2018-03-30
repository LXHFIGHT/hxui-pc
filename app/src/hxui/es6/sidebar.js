/**
 * Created by lxhfight on 2018/3/30.
 * Email:
 * Description:
 *
 */

(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 生成导航栏
     * @param options       生成导航栏方法所需参数集合
     * @param options.query 需要生成导航栏的父组件
     * @param options.menus 按钮集合
     *        options.menu.name 按钮名
     *        options.menu.className 按钮类名
     *        options.menu.value 按钮附加内容
     *        options.menu.selected 是否選中
     *        options.children  按钮的二级目录
     * @param options.clickFunc 点击按钮的方法
     * @param options.themeColor: 主题色
     */
    const createSidebar = (options) => {
        if (!options) {
            console.log('使用HXUI.createSidebar方法需要传入一个配置对象');
            return;
        }
        const { query, menus, clickFunc } = options;
        const $sidebar = $(query);
        $sidebar.addClass('hx-sidebar');
        if (!query || !menus || !clickFunc) {
            console.log('请检查设置对象中是否包含 query(需要生成导航目录的载体HTML元素的选择方法)， menus(菜单集合)和clickFunc(点击触发的事件)')
        }
        for (let menu of menus) {
            // const node = `<div class='group-btn-sidebar'>
            //
            //               </div>`;
            // $sidebar.append(node);

        }
    };

    window.HXUI = Object.assign(window.HXUI, {
        createSidebar
    });

}(jQuery, window));