/**
 * Created by LXHFIGHT on 2017/2/19 22:59.
 * Email: lxhfight51@outlook.com
 * Description:
 *  navbar controller
 */

var module = angular.module('LayoutController');

module.controller('SidebarCtrl', ['$scope', '$state', 'sidebarMenus',  function($scope, $state, sidebarMenus){
    // sidebar ctrl
    $scope.menus = sidebarMenus;
    $scope.selectedMenu = sidebarMenus[0];
    $scope.doClick = function($event, menu){
        var $view = $($event.currentTarget);
        if( !menu.selected ){
            if ($scope.selectedMenu) {
                $scope.selectedMenu.selected = false;
            }
            menu.selected = !menu.selected;
            $scope.selectedMenu = menu;
            $state.go(menu.state);
        }
    }
}]);