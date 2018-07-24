/**
 * Created by LXHFIGHT on 2017/2/20 1:07.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var menus = angular.module('menus');

menus.value('sidebarMenus', [
    {
        name: '信息页面',
        state: 'enter.list',
        icon: 'list',
        role: '*',
        selected: true,
        children: [
            {
                name: '展示组件',
                state: 'enter.list-head',
                icon: 'th',
                role: '*',
                selected:false
            },
            {
                name: '带footer列表',
                state: 'enter.list-footer',
                icon: 'calendar',
                role: '*',
                selected:false
            },
            {
                name: '完整布局列表',
                state: 'enter.list-both',
                icon: 'check-square-o',
                role: '*',
                selected: false
            }
        ]
    },
    {
        name: '表单组件',
        state: 'enter.config',
        icon: 'cog',
        role: '*',
        selected: false
    },
    {
        name: '一级菜单',
        state: 'enter.system',
        icon: 'cogs',
        role: '*',
        selected: false,
        children: [
            {
                name: '二级菜单5',
                state: '',
                icon: 'user',
                role: '*',
                selected:false
            },
            {
                name: '二级菜单6',
                state: '',
                icon: 'users',
                role: '*',
                selected: false
            }
        ]
    }
]);
