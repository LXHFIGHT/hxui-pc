/**
 * Created by LXHFIGHT on 2017/2/19 22:59.
 * Email: lxhfight51@outlook.com
 * Description:
 *  navbar controller
 */

var module = angular.module('LayoutController');

module.controller('NavbarCtrl', ['$scope', 'navbarMenus', 'config', function($scope, navbarMenus, config){
    $scope.config = config;
    $scope.buttons = navbarMenus;

    // 导航栏按钮入口
    $scope.doClick = function($event, menu){
        var $view = $($event.currentTarget);
        switch (menu.name) {
            case "login":
                $scope.doLogin();
                break;
            default:
                break;
        }
    };

    $scope.doLogin = function(){
        alert('I am trying to login in');
    }
}]);