/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

let DemosCtrl = angular.module('HXUIController');

DemosCtrl.controller('DemosCtrl', ['$scope', ($scope) => {
    $scope.event = {
        doPopInfo: (type) => {
            switch (type) {
                case 0: HXUI.popTipNormal('调用 HXUI.popTipNormal 弹出常规提示框'); break;
                case 1: HXUI.popTipInfo('调用 HXUI.popTipInfo 弹出成功提示框'); break;
                case 2: HXUI.popTipWarning('调用 HXUI.popTipWarning 弹出警告提示框'); break;
                case 3: HXUI.popTipError('调用 HXUI.popTipError 弹出错误提示框'); break;
                default: break;
            }
        },
        doShowLoading: (title, during) => {
            HXUI.showLoading({ title, during });
        },
        doHideLoading: () => {
            HXUI.hideLoading();
        },
        doMarkInput: (type) => {
            HXUI.markInput({ type });
        }
    };

    $scope._init = {

    }

}]);

