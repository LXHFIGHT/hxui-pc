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
        },
        doImagePreview: () => {
            let urls = [
                'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-1.jpeg',
                'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-2.png',
                'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-3.jpeg',
                'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-4.jpeg'
            ];
            const currentUrl = 'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-3.jpeg';
            HXUI.imagePreviewer({ urls, currentUrl });
        }
    };


    $scope._init = {
        initRoute: () => {
            HXUI.showRouteMap({
                query: 'map',
                startLabel: '起始点',
                endLabel: '结束点',
                startTime: '05.10 12:30',
                endTime: '05.10 13:00',
                routes: [
                    { lng: 113.23, lat: 23.33 },
                    { lng: 114.45, lat: 23.40 },
                    { lng: 113.87, lat: 23.52 }
                ]
            })
        }
    };

    $scope.init = function(){
        $scope._init.initRoute();
    }();

}]);

