/**
 * Created by lxhfight on 2018/1/27.
 * Email: lxhfight1@gmail.com
 * Description:
 *     用于将指定的坐标连成线展示在百度地图上
 *     注意： 在使用该方法之前需要在index网页文件引入：
 *     <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak={YOUR_APP_KEY}"></script>
 */
(function($, window) {
    window.HXUI = window.HXUI || {};
    const showRouteMap = (options) => {
        let query = options.query || 'map';   // 初始化路线地图的组件的ID
        let routes = options.routes || [];    // 路线
        let startLabel = options.startLabel;  // 开始文本
        let endLabel = options.endLabel;      // 结束文本
        let startTime = options.startTime;    // 开始时间
        let endTime = options.endTime;        // 结束时间
        let isComplete = options.isComplete;        // 结束时间
        let iconStartUrl = '/dist/hxui/img/icon/icon-route-start.png',
            iconEndUrl = '/dist/hxui/img/icon/icon-route-end.png';
        if (!window.BMap) {
            console.warn(`引用HXUI.showRouteMap方法需要引入百度地图JavsScript API，请在入口网页文件（index.html）引入: <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak={YOUR_APP_KEY}"></script> `);
            return null;
        }
        if (routes.length === 0) {
            console.log('options.routes 不能为空');
            return null;
        }
        let map = new BMap.Map(query);
        map.enableScrollWheelZoom(true);
        map.clearOverlays();
        let _markPoint = function (item) {
            let iconCaretUrl = '/dist/hxui/img/icon/icon-caret-down.png';
            let {lat, lng, iconUrl} = item;
            if (lat && lng) {
                let point = new BMap.Point(lng, lat);
                // 添加定位图标
                let pinPointSize = new BMap.Size(40, 40);
                let iconPinpoint = new BMap.Icon(
                    iconUrl,
                    pinPointSize
                );
                iconPinpoint.setImageSize(pinPointSize);
                let mkPinpoint = new BMap.Marker(point, {icon: iconPinpoint, offset: new BMap.Size(0, -14)});
                map.addOverlay(mkPinpoint);
                //  添加小箭头
                let caretSize = new BMap.Size(10, 5);
                let iconCaret = new BMap.Icon(
                    iconCaretUrl,
                    caretSize
                );
                iconCaret.setImageSize(caretSize);
                let mkCaret = new BMap.Marker(point, {icon: iconCaret, offset: new BMap.Size(0, -34)});
                map.addOverlay(mkCaret);
                //  添加文本标签
                let opts = {
                    position: point,    // 指定文本标注所在的地理位置
                    offset: new BMap.Size(0, -80)    //设置文本偏移量
                };
                let content = `<span>${item.label}</span><br />${item.time}`;
                let label = new BMap.Label(content, opts);  // 创建文本标注对象
                map.addOverlay(label);
            }
        };
        let paths = routes.map(function (v) {
            return (new BMap.Point(v.lng, v.lat));
        });
        let polyline = new BMap.Polyline(paths, {
            strokeColor: "#00c397",
            strokeWeight: 8,
            strokeOpacity: 1.0
        });
        let markPoints = [
            {
                lng: routes[0].lng,
                lat: routes[0].lat,
                label: startLabel,
                time: startTime,
                iconUrl: iconStartUrl,
            }, {
                lng: routes[routes.length - 1].lng,
                lat: routes[routes.length - 1].lat,
                label: endLabel,
                time: endTime,
                iconUrl: isComplete ? iconEndUrl : iconStartUrl
            },
        ];
        map.addOverlay(polyline);
        _markPoint(markPoints[0]);
        _markPoint(markPoints[1]);
        map.centerAndZoom(paths[routes.length - 1], 14);
    };
    window.HXUI = Object.assign(window.HXUI, { showRouteMap });
}(jQuery, window));

