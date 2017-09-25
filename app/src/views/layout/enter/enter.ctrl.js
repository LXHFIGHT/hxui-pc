/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *
 */

let EnterCtrl = angular.module('LayoutController');

EnterCtrl.controller('EnterCtrl', ['$scope', '$rootScope', ($scope, $rootScope) => {
    $scope.toggleSidebar = () => {
        $rootScope.showSidebar = !$rootScope.showSidebar;
    };
}]);
