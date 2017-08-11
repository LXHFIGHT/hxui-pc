/**
 * Created by LXHFIGHT on 2017/2/20 0:12.
 * Email: lxhfight51@outlook.com
 * Description:
 *      Index controller
 */

let indexModule = angular.module('LayoutController');

indexModule.controller('IndexCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.toggleSidebar = () => {
        $rootScope.showSidebar = ! $rootScope.showSidebar;
    };
}]);