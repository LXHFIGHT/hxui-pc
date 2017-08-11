/**
 * Created by LXHFIGHT on 2017/2/19 22:59.
 * Email: lxhfight51@outlook.com
 * Description:
 *  sidebar controller
 */

let sidebarModule = angular.module('LayoutController');

sidebarModule.controller('SidebarCtrl', ['$scope', '$state', 'sidebarMenus', 'config', 'StorageHelper',
    function($scope, $state, sidebarMenus, config, StorageHelper){
    // sidebar ctrl
    $scope.config = config;

    $scope.doLogout = () => {
        StorageHelper.clearValue('token');
        StorageHelper.clearValue('role');
        StorageHelper.clearValue('station_id');
        $state.go('login', { state: '' });
    };

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