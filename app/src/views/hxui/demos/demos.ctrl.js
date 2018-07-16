/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

let DemosCtrl = angular.module('HXUIController');

DemosCtrl.controller('DemosCtrl', ['$scope', ($scope) => {
    $scope.location = '';
    $scope.actionSheetText = '请选择收货地区';
    $scope.event = {
        doSelectCalendar() {
            HXUI.calendar({
                
            });
        },
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
        doShowTip: (options) => {
            HXUI.toast(options);
        },
        doMarkInput: (type) => {
            HXUI.markInput({ type });
        },
        doConfirm: () => {
            HXUI.confirm({
                title: 'HXUI确认框',
                content: '请问你觉得这个框怎么样呢？',
                confirmText: '挺不错的',
                cancelText: '不喜欢',
                onConfirm() {
                    HXUI.popTipInfoQuick('很高兴得到你的认可');
                },
                onCancel() {
                    HXUI.popTipInfoQuick('好的我们继续改进');
                }
            })
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
        },
        doChooseAddress: () => {
            HXUI.addressSelector({
                choose: (position) => {
                    let { lng, lat, address, city, title } = position;
                    $scope.location = `${city} ${title} ${address}, （经度：${lng}, 纬度：${lat}）`;
                    $scope.$apply();
                }
            });
        },
        showActionSheet() {
            HXUI.actionSheet({
                items: [
                    '中国大陆', '中国台湾', '中国香港', '中国澳门'
                ],
                onSelect: (data) => {
                    HXUI.popTipInfoQuick(`已选择${data.value}`);
                    $scope.actionSheetText = data.value;
                    $scope.$apply();
                }
            })
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
                isComplete: true,
                routes: [
                    { lng: 113.23, lat: 23.33 },
                    { lng: 113.35, lat: 23.35 },
                    { lng: 113.28, lat: 23.40 }
                ]
            })
        }
    };

    $scope.init = function(){
        $scope._init.initRoute();
    }();

}]);

