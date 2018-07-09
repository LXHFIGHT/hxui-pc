/**
 * Created by lxhfight on 2017/12/20.
 * Email:
 * Description:
 *  日历选择框组件
 */
(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 弹出选择日期框
     * @param options 所需要的参数
     * @param options.date          当前日期
     * @param options.beginDate     起始日期
     * @param options.endDate       结束日期
     * @param options.onSelect  选择日期触发事件
     */
    let calendar = (options) => {
        /**
         * 获取今天的字符串
         * @returns {string}
         * @private
         */
        let _getToday = function() {
            var today = new Date();
            return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        };
        /**
         * 获取 "YYYY-MM-DD" 格式日期的时间戳
         * @param selectedDate
         * @returns {number}
         * @private
         */
        let _getTimestamp = function(selectedDate) {
            if (!selectedDate) {
                return 0;
            }
            var arr = selectedDate.split('-');
            var y = arr[0], m = parseInt(arr[1]) - 1, d = parseInt(arr[2]);
            return new Date(y, m, d).getTime();
        };
        /**
         * 内置方法 获取每月多少天
         */
        let _getMonthDays = function(date) {
            var dateArr = date.split('-');
            var d = new Date(dateArr[0], parseInt(dateArr[1]) - 1, parseInt(dateArr[2]));
            return new Date(d.getFullYear(), (d.getMonth()+1), 0).getDate();
        };
        /**
         * 展示模态框
         * @param evt
         * @private
         */
        let _showModal = function(evt){
            var className = $(evt.target).attr('class') || '';
            if (className.indexOf('hxui-modal') !== -1) {
                $('.hxui-modal.calendar').removeClass('show');
            }
        };
        /**
         * 切换到下一个月份
         * @private
         */
        let _toNextMonth = function(){
            var dateArr = date.split('-');
            var newDate = '';
            console.log('日期：' + date);
            console.log('切换下一个月份为：' + dateArr[1] + '  ' + month);
            if (parseInt(dateArr[1]) === 12) {
                newDate = (parseInt(dateArr[0]) + 1) + '-01-' + dateArr[2];
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
        let _toLastMonth = function(){
            var dateArr = date.split('-');
            var newDate = '';
            console.log('日期：' + date);
            console.log('切换上一个月份为：' + dateArr[1] + '  ' + month);
            if (parseInt(dateArr[1]) === 1) {
                newDate = (parseInt(dateArr[0]) - 1) + '-12-' + dateArr[2];
            } else {
                newDate = dateArr[0] + '-' + (parseInt(dateArr[1]) - 1) + '-' + dateArr[2];
            }
            date = newDate;
            _initPad(newDate);
            $('.pad-dates li').unbind().bind('click', _clickFunc);
        };
        let date = (options.date) || (_getToday());
        let month = 0, day = 0, year = 0;
        let originDate = date;
        let beginDate = options.beginDate;
        let endDate = options.endDate;
        /**
         * 内置方法 初始化日期项
         * @param date 日期
         * @private
         */
        let _initPad = function(date) {
            var arr = date.split('-');
            year = arr[0];
            month = parseInt(arr[1]);
            day = parseInt(arr[2]);
            var originalMonth = parseInt(originDate.split('-')[1]);
            var originalYear = originDate.split('-')[0];
            var lastMonth = (month === 1 ? 12 : month - 1);
            var nextMonth = (month === 12 ? 1 : month + 1);
            var $padDates = $('.pad-dates');
            var beginDay = (_getTimestamp(beginDate) / 1000 / 24 / 3600).toFixed(0);
            var endDay = (_getTimestamp(endDate) / 1000 / 24 / 3600).toFixed(0);
            // 生成标题栏的内容
            $('.calendar-content .to-next-month').text(nextMonth + '月').attr('data-month', nextMonth);
            $('.calendar-content .to-last-month').text(lastMonth + '月').attr('data-month', lastMonth);
            $('.calendar-content .title')
                .text(arr[0] + ('.') + parseInt(arr[1]))
            ;
            var whichDay = new Date(year, (month - 1), 1).getDay();
            var monthDays = _getMonthDays(date);
            var i = 0;
            $padDates.empty();
            for (i = 0; i < whichDay; i++) {
                var node = '<li class="passed" data-selectable="0">-</li>';
                $padDates.append(node);
            }
            for(i = 0; i < parseInt(monthDays); i++ ) {
                var today = (Date.now() / 1000 / 24 / 3600).toFixed(0);
                var selectedDay = (new Date(year, (month - 1), day).getTime() / 1000 / 24 / 3600).toFixed(0);
                var currentDay = (new Date(year, (month - 1), (i + 1)).getTime() / 1000 / 24 / 3600).toFixed(0);
                var node = '';
                if (selectedDay === currentDay &&
                    originalMonth === month &&
                    originalYear === year
                ) {
                    node = '<li class="selected"><button>' + (i + 1) + '</button></li>';
                    $padDates.append(node);
                    continue;
                }
                if ((parseInt(endDay) && currentDay > endDay) || (parseInt(beginDay) && currentDay < beginDay)) {
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
        let _formatDate = function(str) {
            var dateArr = str.split('.');
            var month = dateArr[1] >= 10 ? dateArr[1] : '0' + dateArr[1];
            var day = dateArr[2] >= 10 ? dateArr[2] : '0' + dateArr[2];
            return (dateArr[0] + '-' + month + '-' + day);
        };
        /**
         * 选中日期触发事件
         * @param evt 事件对象
         * @private
         */
        let _clickFunc = function(evt) {
            let $view = $(evt.currentTarget);
            if ($view.hasClass('disabled')) {
                return;
            }
            let selectable = $view.data('selectable');
            if (selectable === 0) {
                return;
            }
            let day = $(evt.currentTarget).find('button').text();
            let yearMonth = $('.calendar-content .title').text();
            $('.pad-dates li').removeClass('selected');
            $view.addClass('selected');
            let date = yearMonth + '.' + day;
            $('.hxui-modal.calendar').removeClass('show');
            typeof options.onSelect === 'function' && options.onSelect(_formatDate(date));
        };

        if ($('.hxui-modal.calendar').length !== 0) {
            $('.hxui-modal.calendar').addClass('show');
            _initPad(date);
            $('.pad-dates li')
                .unbind()
                .bind('click', _clickFunc);
            $('body')
                .off('click', '.hxui-modal.calendar', _showModal)
                .on('click', '.hxui-modal.calendar', _showModal)
                // 切换到下一个月
                .off('click', '.calendar-content .to-next-month', _toNextMonth)
                .on('click', '.calendar-content .to-next-month', _toNextMonth)
                // 切换到上一个月
                .off('click', '.calendar-content .to-last-month', _toLastMonth)
                .on('click', '.calendar-content .to-last-month', _toLastMonth);
        }
        else {
            var node =
                "<div class='hx-modal calendar'>" +
                "    <div class='calendar-content'>" +
                "       <header>" +
                "           <button class='to-last-month'></button>" +
                "           <span class='title'></span>" +
                "           <button class='to-next-month'></button>" +
                "       </header>" +
                "    <div class='table-dates'> " +
                "       <ul class='header-date'> " +
                "           <li>日</li>"+
                "           <li>一</li>"+
                "           <li>二</li>"+
                "           <li>三</li>"+
                "           <li>四</li>"+
                "           <li>五</li>"+
                "           <li>六</li>"+
                "           <div style='clear: both'></div> "+
                "       </ul>" +
                "       <ul class='pad-dates'>" +
                "       </ul>" +
                "    </div>" +
                "</div>";
            $(node).appendTo('body');
            $('body')
                .off('click', '.hxui-modal.calendar', _showModal)
                .on('click', '.hxui-modal.calendar', _showModal)
                // 切换到下一个月
                .off('click', '.calendar-content .to-next-month', _toNextMonth)
                .on('click', '.calendar-content .to-next-month', _toNextMonth)
                // 切换到上一个月
                .off('click', '.calendar-content .to-last-month', _toLastMonth)
                .on('click', '.calendar-content .to-last-month', _toLastMonth);
            var timer = setTimeout(function() {
                _initPad(date);
                $('.hxui-modal.calendar').addClass('show');
                $('.pad-dates li')
                    .unbind()
                    .bind('click', _clickFunc);
                clearTimeout(timer);
            }, 100);
        }
    };

    window.HXUI = Object.assign(window.HXUI, { calendar });

}(jQuery, window));
