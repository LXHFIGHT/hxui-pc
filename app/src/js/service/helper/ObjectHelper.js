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

    let getDatetime = (timestamp) => {
        let date = new Date(timestamp);
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate()),
            hour = date.getHours() >= 10 ? date.getHours() : ('0' + date.getHours()),
            minute = date.getMinutes() >= 10 ? date.getMinutes() : ('0' + date.getMinutes()),
            second = date.getSeconds() >= 10 ? date.getSeconds() : ('0' + date.getSeconds());
        return `${ year }-${ month >= 10 ? month : ('0' + month) }-${ day } ${ hour }:${ minute }:${ second }`;
    };

    let getCity = (str) => {
        if(typeof str === 'string' && str.indexOf('市') !== -1) {
            return str.substr(0, str.indexOf('市')) + '市';
        }
        return null;
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

        getDate,

        getDatetime,

        getCity,

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

        doSelect: (array, name, param = 'selected') => {
            if (Object.prototype.toString.call(array) === '[object Array]'){
                for(let item of array) {
                    (name.indexOf(item.name) !== -1) ?
                        item[param] = true :
                        item[param] = false;
                }
            } else {
                console.log('doSelect方法第一个参数类型需要为数组对象');
            }
        },

        /**
         * 判断一个对象中是否存在非空的参数 如果有返回true 没有返回false
         * @param obj
         * @returns {boolean}
         */
        hasNone: (obj) => {
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                let result = false;
                for (let param in obj) {
                    if (!obj[param]) {
                        result = true;
                    }
                }
                return result;
            } else {
                console.log('调用ObjectHelper.hasNone要求传入的参数为 JS对象');
                return true;
            }
        },

        isEmail: (str) => {
            let regExp = /\w@\w*\.\w/;
            return regExp.test(str);
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

