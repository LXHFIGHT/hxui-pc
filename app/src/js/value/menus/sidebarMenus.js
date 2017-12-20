/**
 * Created by LXHFIGHT on 2017/2/20 1:07.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var menus = angular.module('menus');

menus.value('sidebarMenus', [
    {
        name: '列表页面',
        state: 'enter.list',
        icon: 'list',
        role: '*',
        selected: true,
        children: [
            {
                name: '二级菜单1',
                state: '',
                icon: 'car',
                role: '*',
                selected:false
            },
            {
                name: '二级菜单2',
                state: '',
                icon: 'calendar',
                role: '*',
                selected:false
            },
            {
                name: '二级菜单3',
                state: 'enter.orders',
                icon: 'check-square-o',
                role: '*',
                selected: false
            }
        ]
    },
    {
        name: '系统设置',
        state: 'enter.system',
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
