/**
 * Created by lxhfight on 2017/7/17.
 * Email:
 * Description:
 *  支持百度地图工具方法
 */


let service = angular.module('HelperService');

service.factory('BaiduMapHelper', [() => {
    return {
        /**
         * 最基础的初始化一个地图
         * @param options 初始化地图需要的参数
         * @param options.id  用于承载地图的组件ID
         * @param options.lat  初始化纬度
         * @param options.lng  初始化经度
         * @param clickFunc 点击地图触发事件
         * @param callback 初始化地图后的回调事件
         */
        initSimpleMap: (options, clickFunc, callback) => {
            if (!BMap) {
                console.warn('由于使用到百度地图工具方法，请引入百度地图javascript api文件： http://api.map.baidu.com/api?v=2.0&ak={百度地图开放平台AK}');
                return null;
            } else {
                let { id, lat, lng } = options;
                if (!(lat && lng)) {
                    popTipInfoQuick('正在定位当前位置...');
                    let geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function(r){
                        if(this.getStatus() === BMAP_STATUS_SUCCESS){
                            console.log(`初始化坐标为： ${lng}, ${lat}`);
                            let map = new BMap.Map(id);
                            map.centerAndZoom(r.point, 14);
                            var mk = new BMap.Marker(r.point);
                            map.addOverlay(mk);
                            map.panTo(r.point);
                            map.enableScrollWheelZoom(true);
                            map.addEventListener("click", function(e){
                                map.clearOverlays();
                                let newMk = new BMap.Marker(e.point);
                                map.addOverlay(newMk);
                                newMk.setAnimation(BMAP_ANIMATION_BOUNCE);
                                map.panTo(e.point);
                                typeof clickFunc === 'function' && clickFunc(e.point);
                            });
                            typeof callback === 'function' && callback(map);
                        } else {
                            popTipWarningQuick('获取位置失败：' + this.getStatus());
                        }
                    },{ enableHighAccuracy: true });
                } else {
                    var map = new BMap.Map(id);            // 创建Map实例
                    var point = new BMap.Point(parseFloat(lng), parseFloat(lat)); // 创建点坐标
                    map.centerAndZoom(point, 14);
                    map.enableScrollWheelZoom();
                    var mk = new BMap.Marker(point);
                    map.addOverlay(mk);
                    map.addEventListener("click",function(e){
                        map.clearOverlays();
                        let newMk = new BMap.Marker(e.point);
                        map.addOverlay(newMk);
                        newMk.setAnimation(BMAP_ANIMATION_BOUNCE);
                        map.panTo(e.point);
                        typeof clickFunc === 'function' && clickFunc(e.point);
                    });
                    typeof callback === 'function' && callback(map);
                }
            }
        }
    }
}]);