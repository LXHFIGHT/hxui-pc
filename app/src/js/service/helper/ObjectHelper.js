/**
 * Created by LXHFIGHT on 2017/3/24 14:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *  对象工具方法
 */

var module = angular.module('HelperService');

module.factory('ObjectHelper', [function(){
    let getDate = (timestamp) => {
        let date = new Date(timestamp);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${ day < 10 ? '0' + day : day}`;
    };
    return {
        /**
         * 通过开始时间和结束时间段生成对应的数组
         * @param beginDate
         * @param endDate
         */
        generateDayArray: (beginDate, endDate) => {
            let array = [];
            let currentDate = beginDate;
            while (true) {
                // 当遍历到结束时间的时候结束
                if (currentDate > endDate) {
                    console.log(currentDate + '   ' + endDate);
                    break;
                }
                let day = new Date(currentDate).getDay();
                let item = { 'date': currentDate, day};
                array.push(item);
                currentDate = getDate(new Date(currentDate).getTime() + 86400000);
            }
            return array;
        },
        getDate: getDate,
        /**
         * 比较两个日期之间相差多少天
         * @param date1 日期一
         * @param date2 日期二
         * @returns {number} 相差天数
         */
        compareDays: (date1, date2) => {
            let time = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
            let divider = 24 * 60 * 60 * 1000;
            return (time % divider === 0 ? time / divider : Math.floor(time / divider));
        },
        /**
         * 获取天数中最大的天数
         * @param  days 存有日期的数组
         * @returns {string}
         */
        maxDate: (days) => {
            let max = '2000-01-01';
            days.forEach((v) => {
                if (v > max) {
                    max = v;
                }
            });
            return max;
        },

        /**
         * 判断是否符合手机格式
         * @param cellphone
         */
        validCellphone: (cellphone) => {
            let reg = /^1[3|5|7|8]{1}[0-9]{9}/;
            if (cellphone) {
                return reg.test(cellphone);
            }
            return false;
        },

        /**
         * 用于清除数组内指定的参数
         * @param array 待清理的数组
         * @param param 需要清理的参数
         */
        clearParamInArray: (array, param) => {
            if(typeof param !== 'string')
                return false;

            for(let a of array){
                delete a[param];
            }
            return true;
        },


        /**
         * 获取随机字符串
         * @param length 需要生成的长度
         */
        getRandomString: (length) => {
            let str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = "";
            for(let i = 0; i < length; i++){
                result += str.charAt(Math.floor(parseInt(Math.random() * 36)));
            }
            return result;
        }

    }
}]);

