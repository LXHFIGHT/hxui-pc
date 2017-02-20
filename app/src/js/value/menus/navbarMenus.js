/**
 * Created by LXHFIGHT on 2017/2/19 17:42.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var menus = angular.module('menus');


module.value('navbarMenus', [
    // 从左往右排序
    {
        icon: 'user',
        name: 'login',
        show: true,
        disabled: false,
        func: function(){
            alert('I am trying to login in here');
        }
    },
    {
        icon: 'user',
        name: 'login',
        show: true,
        disabled: false
    }
]);