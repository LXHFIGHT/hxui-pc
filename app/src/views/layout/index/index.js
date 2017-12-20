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

    $scope._init = function() {
        window.addEventListener('click', function(e){
            let $view = $(e.target);
            let parents = $view.parents();
            let isOnSidebar = false;
            for (let i = 0; i < parents.length; i++) {
                let item = parents[i].getAttribute('class') || '';
                if (item.indexOf('hx-sidebar') !== -1 || item.indexOf('btn-show-sidebar') !== -1) {
                    isOnSidebar = true;
                    break;
                }
            }
            let className = $view.attr('class') || '';
            if (className.indexOf('hx-sidebar') !== -1 ||
                className.indexOf('btn-show-sidebar') !== -1) {
                isOnSidebar = true;
            }
            if (!isOnSidebar) {
                $rootScope.showSidebar = false;
                $rootScope.$apply();
            }
        });
    }();
}]);