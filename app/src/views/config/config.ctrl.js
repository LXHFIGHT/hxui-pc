/**
 * Created by LXHFIGHT on 2017/2/20 10:28.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

let ConfigCtrl = angular.module('ConfigController');
ConfigCtrl.controller('ConfigCtrl', ['$scope', function($scope){
    $scope.isSwitchOn = false;
    $scope.radio = 1;
    $scope.event = {
        doToggleSwitch() {
            $scope.isSwitchOn = !$scope.isSwitchOn;
        },
        toggleCheckbox(event) {
            const $view = $(event.target);
            $view.hasClass('selected')
            ? $view.removeClass('selected')
            : $view.addClass('selected');
        },
        toggleRadio(number) {
            $scope.radio = number;
        }
    };
}]);