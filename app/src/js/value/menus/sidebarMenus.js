/**
 * Created by LXHFIGHT on 2017/2/20 1:07.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var menus = angular.module('menus');

menus.value('sidebarMenus', [
    {
        name: '用户管理',
        state: 'enter.users',
        icon: 'users',
        role: '*',
        selected: true
    },
    {
        name: '系统设置',
        state: 'enter.system',
        icon: 'cog',
        role: '*',
        selected: false
    }
]);
