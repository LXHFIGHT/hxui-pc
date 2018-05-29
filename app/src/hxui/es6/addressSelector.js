/**
 * Created by lxhfight on 2018/1/29.
 * Email:
 * Description:
 *  坐标选择器
 */

(function($, window){
    window.HXUI = window.HXUI || {};

    const addressSelector = (options) => {
        if (!options) {
            console.warn('HXUI.addSelector 方法需要传一个{ choose, hide }对象作为唯一参数');
            return null;
        }
        const { choose, hide } = options;
        let map = {}, Geolocation, Geocoder, Autocomplete;
        let state = {
            location: {},
            poi: []
        };
        let poi = [];
        // 定义POI数组变动关联方法
        Object.defineProperty(state, 'poi', {
            set: (data) => {
                $('.pad-poi').empty();
                if (data.length === 0 || !data) {
                    const emptySet = `<span class="emptyset">附近没有热门地点</span>`;
                    $(emptySet).appendTo('.pad-poi');
                } else {
                    data.forEach((item) => {
                        const subNode = `<div class="item-poi" data-uid="${item.uid}">
                                            ${ item.title }
                                            <small>${ item.address }</small>
                                         </div>`;
                        $(subNode).appendTo('.pad-poi');
                    });
                }
                poi = data;
            }
        });
        const node = `<div class="hx-modal choose-address-modal">
                        <div class="pad-address-content">
                            <div class="pad-address-selector">
                                <input type="text" 
                                       ref="address" 
                                       id="suggestion" 
                                       placeholder="搜索地点"/>
                                <button class="btn-close-modal"></button>       
                            </div>
                            <div class="pad-map">
                                <div class="map" id="baidu-map" />
                                <img class="icon-pinpoint" 
                                     src="/dist/hxui/img/icon/icon-pinpoint.png" alt=""/>
                                <button class="btn-pinpoint">
                                    <img src="/dist/hxui/img/icon/icon-current-location.png" alt=""/>
                                </button>
                            </div>
                            <div class="pad-poi">
                                <span class="emptyset">正在加载地图中...</span>                               
                            </div>
                        </div>
                      </div>`
        $(node).appendTo('body');
        const _initMap = () => {
            map = new BMap.Map("baidu-map");    // 创建Map实例
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            Geolocation = new BMap.Geolocation();
            Geocoder = new BMap.Geocoder();
            // 自动填充组件
            Autocomplete = new BMap.Autocomplete({
                input: 'suggestion',
                location: map
            });
            _pinpointCurrentLocation();
            /**
             * 搜索并定位到指定的位置
             * @param value 地址名
             */
            const _setPlace = (value) => {
                function mySpot() {
                    const pinpoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(pinpoint, 16);
                    _getSurroundingPOIs();
                }
                let local = new BMap.LocalSearch(map, {
                    onSearchComplete: mySpot
                });
                local.search(value);
            };
            Autocomplete.addEventListener('onconfirm', function(e) {
                const _value = e.item.value;
                const selectValue = `${_value.province}${_value.city}${_value.district}${_value.street}${_value.business}`;
                _setPlace(selectValue);
            });
            map.addEventListener('touchend', (e) => {
                _getSurroundingPOIs();
            });
            map.addEventListener('mouseup', (e) => {
                _getSurroundingPOIs();
            });
        };
        /**
         * 获取地图正中央点位置及附近点的POI
         * @private
         */
        const _getSurroundingPOIs = () => {
            if (map) {
                const { lat, lng } = map.getCenter();
                Geocoder.getLocation(new BMap.Point(lng, lat), (result) => {
                    if (result){
                        state.poi = result.surroundingPois;
                    }
                });
            }
        };
        const _pinpointCurrentLocation = () => {
            Geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    map.centerAndZoom(r.point, 16);      // 初始化地图,设置中心点坐标和地图级别
                    const { lat, lng } = r.point;
                    state.location = { lat, lng, address: '' }
                    console.log('CURRENT STATE: ', state);
                    _getSurroundingPOIs();
                }
                else {
                    popTipWarningQuick('无法获取当前位置');
                }
            }, {
                enableHighAccuracy: true
            });
        };
        const _closeModal = () => {
            let $modal = $('.choose-address-modal');
            $modal.removeClass('show');
            map = null;
            Geolocation = null;
            Geocoder = null;
            Autocomplete = null;
            let timer = setTimeout(() => {
                $modal.remove();
                clearTimeout(timer);
            }, 10000);
            typeof hide === 'function' && hide();
        };
        const init = setTimeout(() => {
            const $modal = $('.choose-address-modal');
            $modal.addClass('show');
            _initMap();
            $modal.on('click', '.btn-close-modal', _closeModal);
            $modal.on('click', '.item-poi', function(){
                const $view = $(this);
                const uid = $view.data('uid');
                for (let item of poi) {
                    if (item.uid ===  uid) {
                        const { address, city, point, title } = item;
                        const { lng, lat } = point;
                        typeof choose === 'function' && choose({ address, city, lng, lat, title });
                        _closeModal();
                        break;
                    }
                }
            });
            clearTimeout(init);
        }, 50);
    };

    window.HXUI = Object.assign(window.HXUI, { addressSelector });
}(jQuery, window));
