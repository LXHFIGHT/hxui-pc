/**
 * Created by LXHFIGHT on 2017/2/20 0:12.
 * Email: lxhfight51@outlook.com
 * Description:
 *      Index controller
 */

let IndexCtrl = angular.module('LayoutController');

IndexCtrl.controller('IndexCtrl', ['$scope', '$rootScope', ($scope, $rootScope) => {
    $scope.toggleSidebar = () => {
        $rootScope.showSidebar = ! $rootScope.showSidebar;
    };
}]);