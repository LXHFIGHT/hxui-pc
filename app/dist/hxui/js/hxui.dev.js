'use strict';

/**
 * Created by lxhfight on 2018/1/29.
 * Email:
 * Description:
 *  坐标选择器
 */

(function ($, window) {
    window.HXUI = window.HXUI || {};

    var addressSelector = function addressSelector(options) {
        if (!options) {
            console.warn('HXUI.addSelector 方法需要传一个{ choose, hide }对象作为唯一参数');
            return null;
        }
        var choose = options.choose,
            hide = options.hide;

        var map = {},
            Geolocation = void 0,
            Geocoder = void 0,
            Autocomplete = void 0;
        var state = {
            location: {},
            poi: []
        };
        var poi = [];
        // 定义POI数组变动关联方法
        Object.defineProperty(state, 'poi', {
            set: function set(data) {
                $('.pad-poi').empty();
                if (data.length === 0 || !data) {
                    var emptySet = '<span class="emptyset">\u9644\u8FD1\u6CA1\u6709\u70ED\u95E8\u5730\u70B9</span>';
                    $(emptySet).appendTo('.pad-poi');
                } else {
                    data.forEach(function (item) {
                        var subNode = '<div class="item-poi" data-uid="' + item.uid + '">\n                                            ' + item.title + '\n                                            <small>' + item.address + '</small>\n                                         </div>';
                        $(subNode).appendTo('.pad-poi');
                    });
                }
                poi = data;
            }
        });
        var node = '<div class="hx-modal choose-address-modal">\n                        <div class="pad-content">\n                            <div class="pad-address-selector">\n                                <input type="text" \n                                       ref="address" \n                                       id="suggestion" \n                                       placeholder="\u641C\u7D22\u5730\u70B9"/>\n                                <button class="btn-close-modal"></button>       \n                            </div>\n                            <div class="pad-map">\n                                <div class="map" id="baidu-map" />\n                                <img class="icon-pinpoint" \n                                     src="/dist/hxui/img/icon/icon-pinpoint.png" alt=""/>\n                                <button class="btn-pinpoint">\n                                    <img src="/dist/hxui/img/icon/icon-current-location.png" alt=""/>\n                                </button>\n                            </div>\n                            <div class="pad-poi">\n                                <span class="emptyset">\u6B63\u5728\u52A0\u8F7D\u5730\u56FE\u4E2D...</span>                               \n                            </div>\n                        </div>\n                      </div>';
        $(node).appendTo('body');
        var _initMap = function _initMap() {
            map = new BMap.Map("baidu-map"); // 创建Map实例
            map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
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
            var _setPlace = function _setPlace(value) {
                function mySpot() {
                    var pinpoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(pinpoint, 16);
                    _getSurroundingPOIs();
                }
                var local = new BMap.LocalSearch(map, {
                    onSearchComplete: mySpot
                });
                local.search(value);
            };
            Autocomplete.addEventListener('onconfirm', function (e) {
                var _value = e.item.value;
                var selectValue = '' + _value.province + _value.city + _value.district + _value.street + _value.business;
                _setPlace(selectValue);
            });
            map.addEventListener('touchend', function (e) {
                _getSurroundingPOIs();
            });
            map.addEventListener('mouseup', function (e) {
                _getSurroundingPOIs();
            });
        };
        /**
         * 获取地图正中央点位置及附近点的POI
         * @private
         */
        var _getSurroundingPOIs = function _getSurroundingPOIs() {
            if (map) {
                var _map$getCenter = map.getCenter(),
                    lat = _map$getCenter.lat,
                    lng = _map$getCenter.lng;

                Geocoder.getLocation(new BMap.Point(lng, lat), function (result) {
                    if (result) {
                        state.poi = result.surroundingPois;
                    }
                });
            }
        };
        var _pinpointCurrentLocation = function _pinpointCurrentLocation() {
            Geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    map.centerAndZoom(r.point, 16); // 初始化地图,设置中心点坐标和地图级别
                    var _r$point = r.point,
                        lat = _r$point.lat,
                        lng = _r$point.lng;

                    state.location = { lat: lat, lng: lng, address: '' };
                    console.log('CURRENT STATE: ', state);
                    _getSurroundingPOIs();
                } else {
                    popTipWarningQuick('无法获取当前位置');
                }
            }, {
                enableHighAccuracy: true
            });
        };
        var _closeModal = function _closeModal() {
            typeof hide === 'function' && hide();
            var $modal = $('.choose-address-modal');
            $modal.removeClass('show');
            map = null;
            Geolocation = null;
            Geocoder = null;
            Autocomplete = null;
            var timer = setTimeout(function () {
                $modal.remove();
                clearTimeout(timer);
            }, 400);
        };
        var init = setTimeout(function () {
            var $modal = $('.choose-address-modal');
            $modal.addClass('show');
            _initMap();
            $modal.on('click', '.btn-close-modal', _closeModal);
            $modal.on('click', '.item-poi', function () {
                var $view = $(this);
                var uid = $view.data('uid');
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = poi[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        if (item.uid === uid) {
                            var address = item.address,
                                city = item.city,
                                point = item.point,
                                title = item.title;
                            var lng = point.lng,
                                lat = point.lat;

                            typeof choose === 'function' && choose({ address: address, city: city, lng: lng, lat: lat, title: title });
                            _closeModal();
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
            clearTimeout(init);
        }, 50);
    };

    window.HXUI = Object.assign(window.HXUI, { addressSelector: addressSelector });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2017/12/20.
 * Email:
 * Description:
 *  日历选择框组件
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 弹出选择日期框
     * @param options 所需要的参数
     * @param options.date          当前日期
     * @param options.beginDate     起始日期
     * @param options.endDate       结束日期
     * @param options.select  选择日期触发事件
     */
    var calendar = function calendar(options) {
        /**
         * 获取今天的字符串
         * @returns {string}
         * @private
         */
        var _getToday = function _getToday() {
            var today = new Date();
            return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        };
        /**
         * 获取 "YYYY-MM-DD" 格式日期的时间戳
         * @param selectedDate
         * @returns {number}
         * @private
         */
        var _getTimestamp = function _getTimestamp(selectedDate) {
            if (!selectedDate) {
                return 0;
            }
            var arr = selectedDate.split('-');
            var y = arr[0],
                m = parseInt(arr[1]) - 1,
                d = parseInt(arr[2]);
            return new Date(y, m, d).getTime();
        };
        /**
         * 内置方法 获取每月多少天
         */
        var _getMonthDays = function _getMonthDays(date) {
            var dateArr = date.split('-');
            var d = new Date(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]));
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        /**
         * 展示模态框
         * @param evt
         * @private
         */
        var _showModal = function _showModal(evt) {
            var className = $(evt.target).attr('class') || '';
            if (className.indexOf('hxui-modal') !== -1) {
                $('.hxui-modal.calendar').removeClass('show');
            }
        };
        /**
         * 切换到下一个月份
         * @private
         */
        var _toNextMonth = function _toNextMonth() {
            var dateArr = date.split('-');
            var newDate = '';
            console.log('日期：' + date);
            console.log('切换下一个月份为：' + dateArr[1] + '  ' + month);
            if (parseInt(dateArr[1]) === 12) {
                newDate = parseInt(dateArr[0]) + 1 + '-01-' + dateArr[2];
            } else {
                newDate = dateArr[0] + '-' + (parseInt(dateArr[1]) + 1) + '-' + dateArr[2];
            }
            date = newDate;
            _initPad(newDate);
            $('.pad-dates li').unbind().bind('click', _clickFunc);
        };
        /**
         * 切换到上一个月份
         * @private
         */
        var _toLastMonth = function _toLastMonth() {
            var dateArr = date.split('-');
            var newDate = '';
            console.log('日期：' + date);
            console.log('切换上一个月份为：' + dateArr[1] + '  ' + month);
            if (parseInt(dateArr[1]) === 1) {
                newDate = parseInt(dateArr[0]) - 1 + '-12-' + dateArr[2];
            } else {
                newDate = dateArr[0] + '-' + (parseInt(dateArr[1]) - 1) + '-' + dateArr[2];
            }
            date = newDate;
            _initPad(newDate);
            $('.pad-dates li').unbind().bind('click', _clickFunc);
        };
        var date = options.date || _getToday();
        var month = 0,
            day = 0,
            year = 0;
        var originDate = date;
        var beginDate = options.beginDate;
        var endDate = options.endDate;
        /**
         * 内置方法 初始化日期项
         * @param date 日期
         * @private
         */
        var _initPad = function _initPad(date) {
            var arr = date.split('-');
            year = arr[0];
            month = parseInt(arr[1]);
            day = parseInt(arr[2]);
            var originalMonth = parseInt(originDate.split('-')[1]);
            var originalYear = originDate.split('-')[0];
            var lastMonth = month === 1 ? 12 : month - 1;
            var nextMonth = month === 12 ? 1 : month + 1;
            var $padDates = $('.pad-dates');
            var beginDay = (_getTimestamp(beginDate) / 1000 / 24 / 3600).toFixed(0);
            var endDay = (_getTimestamp(endDate) / 1000 / 24 / 3600).toFixed(0);
            // 生成标题栏的内容
            $('.calendar-content .to-next-month').text(nextMonth + '月').attr('data-month', nextMonth);
            $('.calendar-content .to-last-month').text(lastMonth + '月').attr('data-month', lastMonth);
            $('.calendar-content .title').text(arr[0] + '.' + parseInt(arr[1]));
            var whichDay = new Date(year, month - 1, 1).getDay();
            var monthDays = _getMonthDays(date);
            var i = 0;
            $padDates.empty();
            for (i = 0; i < whichDay; i++) {
                var node = '<li class="passed" data-selectable="0">-</li>';
                $padDates.append(node);
            }
            for (i = 0; i < parseInt(monthDays); i++) {
                var today = (Date.now() / 1000 / 24 / 3600).toFixed(0);
                var selectedDay = (new Date(year, month - 1, day).getTime() / 1000 / 24 / 3600).toFixed(0);
                var currentDay = (new Date(year, month - 1, i + 1).getTime() / 1000 / 24 / 3600).toFixed(0);
                var node = '';
                if (selectedDay === currentDay && originalMonth === month && originalYear === year) {
                    node = '<li class="selected"><button>' + (i + 1) + '</button></li>';
                    $padDates.append(node);
                    continue;
                }
                if (parseInt(endDay) && currentDay > endDay || parseInt(beginDay) && currentDay < beginDay) {
                    node = '<li class="disabled"><button>' + (i + 1) + '</button></li>';
                } else if (currentDay < today) {
                    node = '<li class="passed"><button>' + (i + 1) + '</button></li>';
                } else if (currentDay === today) {
                    node = '<li class="today"><button>' + (i + 1) + '</button></li>';
                } else {
                    node = '<li><button>' + (i + 1) + '</button></li>';
                }
                $padDates.append(node);
            }
        };
        /**
         * 内置方法 格式化日期字符串
         * @type {string}
         */
        var _formatDate = function _formatDate(str) {
            var dateArr = str.split('.');
            var month = dateArr[1] >= 10 ? dateArr[1] : '0' + dateArr[1];
            var day = dateArr[2] >= 10 ? dateArr[2] : '0' + dateArr[2];
            return dateArr[0] + '-' + month + '-' + day;
        };
        /**
         * 选中日期触发事件
         * @param evt 事件对象
         * @private
         */
        var _clickFunc = function _clickFunc(evt) {
            var $view = $(evt.currentTarget);
            if ($view.hasClass('disabled')) {
                return;
            }
            var selectable = $view.data('selectable');
            if (selectable === 0) {
                return;
            }
            var day = $(evt.currentTarget).find('button').text();
            var yearMonth = $('.calendar-content .title').text();
            $('.pad-dates li').removeClass('selected');
            $view.addClass('selected');
            var date = yearMonth + '.' + day;
            $('.hxui-modal.calendar').removeClass('show');
            typeof options.select === 'function' && options.select(_formatDate(date));
        };

        if ($('.hxui-modal.calendar').length !== 0) {
            $('.hxui-modal.calendar').addClass('show');
            _initPad(date);
            $('.pad-dates li').unbind().bind('click', _clickFunc);
            $('body').off('click', '.hxui-modal.calendar', _showModal).on('click', '.hxui-modal.calendar', _showModal)
            // 切换到下一个月
            .off('click', '.calendar-content .to-next-month', _toNextMonth).on('click', '.calendar-content .to-next-month', _toNextMonth)
            // 切换到上一个月
            .off('click', '.calendar-content .to-last-month', _toLastMonth).on('click', '.calendar-content .to-last-month', _toLastMonth);
        } else {
            var node = "<div class='hx-modal calendar'>" + "    <div class='calendar-content'>" + "       <header>" + "           <button class='to-last-month'></button>" + "           <span class='title'></span>" + "           <button class='to-next-month'></button>" + "       </header>" + "    <div class='table-dates'> " + "       <ul class='header-date'> " + "           <li>日</li>" + "           <li>一</li>" + "           <li>二</li>" + "           <li>三</li>" + "           <li>四</li>" + "           <li>五</li>" + "           <li>六</li>" + "           <div style='clear: both'></div> " + "       </ul>" + "       <ul class='pad-dates'>" + "       </ul>" + "    </div>" + "</div>";
            $(node).appendTo('body');
            $('body').off('click', '.hxui-modal.calendar', _showModal).on('click', '.hxui-modal.calendar', _showModal)
            // 切换到下一个月
            .off('click', '.calendar-content .to-next-month', _toNextMonth).on('click', '.calendar-content .to-next-month', _toNextMonth)
            // 切换到上一个月
            .off('click', '.calendar-content .to-last-month', _toLastMonth).on('click', '.calendar-content .to-last-month', _toLastMonth);
            var timer = setTimeout(function () {
                _initPad(date);
                $('.hxui-modal.calendar').addClass('show');
                $('.pad-dates li').unbind().bind('click', _clickFunc);
                clearTimeout(timer);
            }, 100);
        }
    };

    window.HXUI = Object.assign(window.HXUI, { calendar: calendar });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 展示加载框
     * @param options
     * @param options.title  自定义加载文案
     * @param options.during  展示时长  单位为： 毫秒
     */
    var showLoading = function showLoading(options) {
        var title = options ? options.title || '加载中...' : '加载中...';
        var during = options ? options.during || 5000 : 5000;
        var $view = $('.hx-loading-modal');
        if ($view.length !== 0) {
            $view.addClass('show');
            $view.find('.txt-loading').text(title);
        } else {
            var node = '<div class=\'hx-loading-modal\'>\n                   <section class=\'hx-loading\'></section>\n                   <span class=\'txt-loading\'>' + title + '</span>\n                </div>';
            $(node).appendTo('body');
            var timer = setTimeout(function () {
                $('.hx-loading-modal').addClass('show');
                clearTimeout(timer);
            }, 30);
        }
        var timer2 = setTimeout(function () {
            $('.hx-loading-modal').removeClass('show');
            clearTimeout(timer2);
        }, during);
    };

    var hideLoading = function hideLoading() {
        $('.hx-loading-modal').removeClass('show');
    };

    window.HXUI = Object.assign(window.HXUI, { showLoading: showLoading, hideLoading: hideLoading });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 查看预览大图方法
     * @param options
     * @param options.currentUrl 【必填】需要展示的图片URL
     * @param options.urls 【选填】供多图预览上下切换的图片URL集合
     * @param options.screen  【选填】支持 空， "left" 和 "right" 三个参数，分别表示全屏、左半屏和右半屏
     * @param options.maxium  【选填】支持的最大图片放大比例
     */
    var imagePreviewer = function imagePreviewer(options) {
        var currentUrl = options.currentUrl,
            urls = options.urls,
            screen = options.screen;

        !screen || (screen = '');
        var index = 0;
        var imageUrls = urls ? [].concat(urls) : [currentUrl];
        var maxium = options ? options.maxium || 2.5 : 2.5;
        var currentDegree = 0;
        var scale = 1.0;
        var mouseOffsetX = 0; // 滑动图片其实X坐标值
        var mouseOffsetY = 0; // 滑动图片其实Y坐标值
        var isDraging = false; // 是否可以滑动
        var isMovable = false; // 是否可以滑动
        //  隐藏图片预览组件
        var _hidePreviewer = function _hidePreviewer() {
            $('.hx-image-modal').removeClass('show');
            var timer = setTimeout(function () {
                $('.hx-image-modal').remove();
                clearTimeout(timer);
            }, 400);
        };
        //  调整比例大小
        var _adjustScale = function _adjustScale(isPlus) {
            if (isPlus) {
                if (scale < maxium) {
                    scale += 0.5;
                } else {
                    popTipInfoQuick('不能再放大了');
                }
            } else {
                if (scale > 1.0) {
                    scale -= 0.5;
                } else {
                    popTipInfoQuick('不能再缩小了');
                }
            }
            _judgeIsMovable();
            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText();
        };
        //  处理transform样式代码方法
        var _transformText = function _transformText(isReset) {
            if (isReset) {
                return 'translate(-50%, -50%)';
            } else {
                return 'translate(-50%, -50%) rotate(' + currentDegree + 'deg) scale(' + scale + ', ' + scale + ')';
            }
        };
        //  判断是否可移动
        var _judgeIsMovable = function _judgeIsMovable() {
            var $img = document.getElementsByClassName('modal-image-preview')[0],
                $modal = document.getElementsByClassName('hx-image-modal')[0];
            var imgHeight = $img.offsetHeight * scale;
            var imgWidth = $img.offsetWidth * scale;
            var modalHeight = $modal.offsetHeight;
            var modalWidth = $modal.offsetWidth;
            if (imgHeight > modalHeight || imgWidth > modalWidth) {
                isMovable = true;
                $img.setAttribute('class', 'modal-image-preview movable');
            } else {
                isMovable = false;
                $img.setAttribute('class', 'modal-image-preview');
                $img.style.top = '50%';
                $img.style.left = '50%';
            }
            imageUrls.length !== 1 && $('.hx-image-modal').find('.title').text(index + 1 + ' / ' + imageUrls.length);
        };
        var _reset = function _reset() {
            var $img = document.getElementsByClassName('modal-image-preview')[0];
            scale = 1.0;
            currentDegree = 0;
            $img.style.top = '50%';
            $img.style.left = '50%';
            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
            _judgeIsMovable();
        };
        /**
         * 旋转图片方法
         * @param isRotateRight 是否顺时针
         */
        var _rotate = function _rotate(isRotateRight) {
            var imgElem = document.getElementsByClassName('modal-image-preview')[0];
            isRotateRight ? currentDegree += 90 : currentDegree -= 90;
            imgElem.style.transform = _transformText();
            imgElem.style.top = '50%';
            imgElem.style.left = '50%';
        };
        var _initComponent = function _initComponent() {
            for (var i = 0; i < imageUrls.length; i++) {
                if (currentUrl === imageUrls[i]) {
                    index = i;
                    break;
                }
            }
            var timer = setTimeout(function () {
                var $btnLast = $('.btn-to-last'),
                    $btnNext = $('.btn-to-next');
                var $modal = $('.hx-image-modal');
                $modal.addClass('show');
                _judgeIsMovable();
                $btnLast.unbind().bind('click', function () {
                    if (index === 0) {
                        popTipWarningQuick('没有上一张了');
                        return;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
                        }
                        index--;
                        $('.modal-image-preview').attr('src', imageUrls[index]);
                        $('.btn-download').attr('src', imageUrls[index]);
                        _reset();
                    }
                });
                $btnNext.unbind().bind('click', function () {
                    if (index === imageUrls.length - 1) {
                        popTipWarningQuick('没有下一张了');
                        return;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
                        }
                        index++;
                        $('.modal-image-preview').attr('src', imageUrls[index]);
                        $('.btn-download').attr('src', imageUrls[index]);
                        _reset();
                    }
                });
                if (imageUrls.length === 1) {
                    $btnLast.addClass('hidden');
                    $btnNext.addClass('hidden');
                }
                clearTimeout(timer);
            }, 100);
        };
        _initComponent();
        var node = '<div class=\'hx-image-modal hx-modal ' + screen + '\'>\n                        <header class=\'navbar\'>\n                            <span class=\'title\'></span>\n                            <button class=\'btn-quit-preview\'></button>\n                        </header>\n                        <img class=\'modal-image-preview\' ondragstart=\'return false;\' src=\'' + currentUrl + '\' alt=\'image\' />\n                        <button class=\'btn-to-last hide-sm fa fa-angle-left\'></button>\n                        <button class=\'btn-to-next hide-sm fa fa-angle-right\'></button>\n                        <div class=\'pad-functions\'>\n                            <button class=\'btn-to-last hide-md hide-bg fa fa-angle-left\'></button>\n                            <button class=\'btn-search-plus fa fa-search-plus\'></button>\n                            <button class=\'btn-search-minus fa fa-search-minus\'></button>\n                            <button class=\'btn-rotate-left fa fa-undo\'></button>\n                            <button class=\'btn-rotate-right fa fa-repeat\'></button>\n                            <a class=\'btn-download fa fa-download\' href=\'' + currentUrl + '\' download=\'\u56FE\u7247\u9884\u89C8\u6548\u679C.jpg\'></a>\n                            <button class=\'btn-to-next hide-md hide-bg fa fa-angle-right\'></button>\n                        </div>\n                    </div>';
        $(node).appendTo('body');
        $('body').on('click', '.btn-rotate-left', function () {
            _rotate();
        }).on('click', '.btn-rotate-right', function () {
            _rotate(true);
        }).on('click', '.btn-search-plus', function () {
            _adjustScale(true);
        }).on('click', '.btn-search-minus', function () {
            _adjustScale(false);
        }).on('click', '.hx-image-modal', function () {
            var className = event.target.getAttribute('class');
            if (className.indexOf('hx-image-modal') !== -1) {
                _hidePreviewer();
            }
        }).on('touchstart', '.modal-image-preview.movable', function (event) {
            var e = event || window.event;
            var pageX = e.originalEvent.changedTouches[0].pageX;
            var pageY = e.originalEvent.changedTouches[0].pageY;
            mouseOffsetX = pageX - $(this)[0].offsetLeft;
            mouseOffsetY = pageY - $(this)[0].offsetTop;
            isDraging = true;
        }).on('mousedown', '.modal-image-preview.movable', function (event) {
            var e = event || window.event;
            var pageX = e.pageX || e.originalEvent.pageX;
            var pageY = e.pageY || e.originalEvent.pageY;
            mouseOffsetX = pageX - $(this)[0].offsetLeft;
            mouseOffsetY = pageY - $(this)[0].offsetTop;
            isDraging = true;
        }).on('mousemove', '.modal-image-preview.movable', function (event) {
            var e = event || window.event;
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var moveX = 0;
            var moveY = 0;
            if (isDraging === true) {
                moveX = mouseX - mouseOffsetX;
                moveY = mouseY - mouseOffsetY;
                $(this).css('left', moveX);
                $(this).css('top', moveY);
            }
        }).on('touchmove', '.modal-image-preview.movable', function (event) {
            var e = event || window.event;
            var mouseX = e.originalEvent.changedTouches[0].pageX;
            var mouseY = e.originalEvent.changedTouches[0].pageY;
            var moveX = 0;
            var moveY = 0;
            if (isMovable === true) {
                moveX = mouseX - mouseOffsetX;
                moveY = mouseY - mouseOffsetY;
                $(this).css('left', moveX);
                $(this).css('top', moveY);
            }
            console.log('On touch move is draging: ', isDraging);
            console.log('On touch move: ', moveX, moveY);
            console.log('On touch move: ', mouseOffsetX, mouseOffsetX);
        }).on('click', '.btn-quit-preview', function () {
            _hidePreviewer();
        });
        window.addEventListener('mouseup', function () {
            isDraging = false;
        });
    };

    var hidePreviewImage = function hidePreviewImage() {
        $('.hx-image-modal').removeClass('show');
        var timer = setTimeout(function () {
            $('.hx-image-modal').remove();
            clearTimeout(timer);
        }, 400);
    };

    window.HXUI = Object.assign(window.HXUI, { imagePreviewer: imagePreviewer, hidePreviewImage: hidePreviewImage });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2017/10/9.
 * Email:
 * Description:
 * 轻量级的弹出框提示
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 轻量级的弹出框提示
     * @param msg   消息内容
     * @param level 等级 1：通知， 2: 警告， 3：错误
     * @param during 提示时长
     */
    var timeout = null;
    var _showTipLight = function _showTipLight(msg, level, during) {
        clearTimeout(timeout);
        var className = 'default';
        if (level === 1) {
            className = 'success';
        } else if (level === 2) {
            className = 'warn';
        } else if (level === 3) {
            className = 'error';
        }
        if ($('.pad-poptip').length !== 0) {
            $('.pad-poptip').attr('class', 'pad-poptip ' + className).text(msg).addClass('show');
        } else {
            var node = "<div class='pad-poptip " + className + "'  >" + msg + "</div>";
            $(node).appendTo('body');
            setTimeout(function () {
                $('.pad-poptip').addClass('show');
            }, 1000 / 60);
        }
        timeout = setTimeout(function () {
            $('.pad-poptip').removeClass('show');
        }, during);
    };

    //  通知级别的弹出提示
    var popTipInfo = function popTipInfo(msg) {
        _showTipLight(msg, 1, 3000);
    };
    var popTipInfoQuick = function popTipInfoQuick(msg) {
        _showTipLight(msg, 1, 1500);
    };
    //  警告级别的弹出提示
    var popTipWarning = function popTipWarning(msg) {
        _showTipLight(msg, 2, 3000);
    };
    var popTipWarningQuick = function popTipWarningQuick(msg) {
        _showTipLight(msg, 2, 1500);
    };
    //  错误级别的弹出提示
    var popTipError = function popTipError(msg) {
        _showTipLight(msg, 3, 3000);
    };
    var popTipErrorQuick = function popTipErrorQuick(msg) {
        _showTipLight(msg, 3, 1500);
    };
    //  随便的弹出提示
    var popTipNormal = function popTipNormal(msg) {
        _showTipLight(msg, -1, 3000);
    };
    var popTipNormalQuick = function popTipNormalQuick(msg) {
        _showTipLight(msg, -1, 1500);
    };

    window.HXUI = Object.assign(window.HXUI, {
        popTipInfo: popTipInfo,
        popTipInfoQuick: popTipInfoQuick,
        popTipWarning: popTipWarning,
        popTipWarningQuick: popTipWarningQuick,
        popTipError: popTipError,
        popTipErrorQuick: popTipErrorQuick,
        popTipNormal: popTipNormal,
        popTipNormalQuick: popTipNormalQuick
    });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2018/1/27.
 * Email: lxhfight1@gmail.com
 * Description:
 *     用于将指定的坐标连成线展示在百度地图上
 *     注意： 在使用该方法之前需要在index网页文件引入：
 *     <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak={YOUR_APP_KEY}"></script>
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};
    var showRouteMap = function showRouteMap(options) {
        var query = options.query || 'map'; // 初始化路线地图的组件的ID
        var routes = options.routes || []; // 路线
        var startLabel = options.startLabel; // 开始文本
        var endLabel = options.endLabel; // 结束文本
        var startTime = options.startTime; // 开始时间
        var endTime = options.endTime; // 结束时间
        var isComplete = options.isComplete; // 结束时间
        var iconStartUrl = '/dist/hxui/img/icon/icon-route-start.png',
            iconEndUrl = '/dist/hxui/img/icon/icon-route-end.png';
        if (!window.BMap) {
            console.warn('\u5F15\u7528HXUI.showRouteMap\u65B9\u6CD5\u9700\u8981\u5F15\u5165\u767E\u5EA6\u5730\u56FEJavsScript API\uFF0C\u8BF7\u5728\u5165\u53E3\u7F51\u9875\u6587\u4EF6\uFF08index.html\uFF09\u5F15\u5165: <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak={YOUR_APP_KEY}"></script> ');
            return null;
        }
        if (routes.length === 0) {
            console.log('options.routes 不能为空');
            return null;
        }
        var map = new BMap.Map(query);
        map.enableScrollWheelZoom(true);
        map.clearOverlays();
        var _markPoint = function _markPoint(item) {
            var iconCaretUrl = '/dist/hxui/img/icon/icon-caret-down.png';
            var lat = item.lat,
                lng = item.lng,
                iconUrl = item.iconUrl;

            if (lat && lng) {
                var point = new BMap.Point(lng, lat);
                // 添加定位图标
                var pinPointSize = new BMap.Size(40, 40);
                var iconPinpoint = new BMap.Icon(iconUrl, pinPointSize);
                iconPinpoint.setImageSize(pinPointSize);
                var mkPinpoint = new BMap.Marker(point, { icon: iconPinpoint, offset: new BMap.Size(0, -14) });
                map.addOverlay(mkPinpoint);
                //  添加小箭头
                var caretSize = new BMap.Size(10, 5);
                var iconCaret = new BMap.Icon(iconCaretUrl, caretSize);
                iconCaret.setImageSize(caretSize);
                var mkCaret = new BMap.Marker(point, { icon: iconCaret, offset: new BMap.Size(0, -34) });
                map.addOverlay(mkCaret);
                //  添加文本标签
                var opts = {
                    position: point, // 指定文本标注所在的地理位置
                    offset: new BMap.Size(0, -80) //设置文本偏移量
                };
                var content = '<span>' + item.label + '</span><br />' + item.time;
                var label = new BMap.Label(content, opts); // 创建文本标注对象
                map.addOverlay(label);
            }
        };
        var paths = routes.map(function (v) {
            return new BMap.Point(v.lng, v.lat);
        });
        var polyline = new BMap.Polyline(paths, {
            strokeColor: "#00c397",
            strokeWeight: 8,
            strokeOpacity: 1.0
        });
        var markPoints = [{
            lng: routes[0].lng,
            lat: routes[0].lat,
            label: startLabel,
            time: startTime,
            iconUrl: iconStartUrl
        }, {
            lng: routes[routes.length - 1].lng,
            lat: routes[routes.length - 1].lat,
            label: endLabel,
            time: endTime,
            iconUrl: isComplete ? iconEndUrl : iconStartUrl
        }];
        map.addOverlay(polyline);
        _markPoint(markPoints[0]);
        _markPoint(markPoints[1]);
        map.centerAndZoom(paths[routes.length - 1], 14);
    };
    window.HXUI = Object.assign(window.HXUI, { showRouteMap: showRouteMap });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2018/3/30.
 * Email:
 * Description:
 *
 */

(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 生成导航栏
     * @param options       生成导航栏方法所需参数集合
     * @param options.query 需要生成导航栏的父组件
     * @param options.menus 按钮集合
     *        options.menu.name 按钮名
     *        options.menu.className 按钮类名
     *        options.menu.value 按钮附加内容
     *        options.menu.selected 是否選中
     *        options.children  按钮的二级目录
     * @param options.clickFunc 点击按钮的方法
     * @param options.themeColor: 主题色
     */
    var createSidebar = function createSidebar(options) {
        if (!options) {
            console.log('使用HXUI.createSidebar方法需要传入一个配置对象');
            return;
        }
        var query = options.query,
            menus = options.menus,
            clickFunc = options.clickFunc;

        var $sidebar = $(query);
        $sidebar.addClass('hx-sidebar');
        if (!query || !menus || !clickFunc) {
            console.log('请检查设置对象中是否包含 query(需要生成导航目录的载体HTML元素的选择方法)， menus(菜单集合)和clickFunc(点击触发的事件)');
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = menus[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                // const node = `<div class='group-btn-sidebar'>
                //
                //               </div>`;
                // $sidebar.append(node);

                var menu = _step.value;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    window.HXUI = Object.assign(window.HXUI, {
        createSidebar: createSidebar
    });
})(jQuery, window);
'use strict';

/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      a very smart and strong validator for any form element
 */
(function ($, window) {
    window.HXUI = window.HXUI || {};

    /**
     * 智能判断表单组件是否为必填或者银行卡
     * @param query 需要限制的组件选择字符串
     *
     * 规则：
     *    required                      必填项
     *    data-type="bank_number"       银行卡号  16位或19位数字
     *    data-type="number"
     * @returns { boolean } true为正常
     */
    var smartValidate = function smartValidate(query) {
        var RESULT_REQUIRED_ISSUE = 1;
        var RESULT_BANK_NUMBER_ISSUE = 2;
        var RESULT_NUMBER_ISSUE = 3;

        var components = $(query ? query + ' [required]' : '[required]');
        var bankNumbers = $(query ? query + ' [data-type="bank_number"]' : '[data-type="bank_number"]');
        var numbers = $(query ? query + ' [data-type="number"]' : '[data-type="number"]');
        var result = true;
        var $view = null;
        var numberExp = /^[0-9]*$/;

        components.unbind('focus').focus(function () {
            $(this).removeClass('error');
        });

        // 非空验证
        for (var i = 0; i < components.length; i++) {
            $view = $(components[i]);
            if (!$view.val()) {
                result = RESULT_REQUIRED_ISSUE;
                $view.addClass('error');
            }
        }

        // 银行卡验证
        for (var _i = 0; _i < bankNumbers.length; _i++) {
            $view = $(bankNumbers[_i]);
            var val = $(bankNumbers[_i]).val();
            if (isNaN(val)) {
                result = RESULT_BANK_NUMBER_ISSUE;
                $view.addClass('error');
            } else {
                if (val.length !== 16 && val.length !== 19) {
                    result = RESULT_BANK_NUMBER_ISSUE;
                    $view.addClass('error');
                }
            }
        }

        // 数字验证
        for (var _i2 = 0; _i2 < numbers.length; _i2++) {
            $view = $(numbers[_i2]);
            var _val = $(bankNumbers[_i2]).val();
            if (!numberExp.test(_val)) {
                result = RESULT_NUMBER_ISSUE;
                $view.addClass('error');
            }
        }

        switch (result) {
            case RESULT_REQUIRED_ISSUE:
                popTipWarningQuick('请完善所有信息');break;
            case RESULT_BANK_NUMBER_ISSUE:
                popTipWarningQuick('银行卡号要求16位或19位数字');break;
            case RESULT_NUMBER_ISSUE:
                popTipWarningQuick('请填写数字');break;
            default:
                break;
        }

        if (typeof result === 'number') {
            return false;
        }
        return true;
    };

    window.HXUI = Object.assign(window.HXUI, { smartValidate: smartValidate });
})(jQuery, window);