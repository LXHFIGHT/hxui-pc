/**
 * Created by LXHFIGHT on 2017/3/31 11:12.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

/**
 * Created by LXHFIGHT on 2016/12/29 14:13.
 * Email: lxhfight51@outlook.com
 * Description:
 *   HTML5缓存服务 --属于工具服务
 */

var module = angular.module('HelperService');

module.factory('LocalStorageHelper',[ function(){
    var storage = window.localStorage;
    return {
        setValue: function(key, value){
            storage.setItem(key, value);
            return true;
        },
        getValue: function(key){
            return storage.getItem(key);
        },
        popValue: function(key){
            var value = storage.getItem(key);
            storage.removeItem(key);
            return value;
        },
        /**
         * 将JavaScript对象转换为JSON字符串后存在缓存中
         * @param key 键
         * @param obj 需要存储的对象
         */
        saveObject: function(key, obj){
            var json = JSON.stringify(obj);
            storage.setItem(key, json);
        },
        /**
         * 将存在缓存中的JSON字符串获取出并转换为JavaScript对象
         * @param key 键
         */
        getObject: function(key){
            var json = window.sessionStorage.getItem(key);
            return JSON.parse(json);
        },
        /**
         * 通过objName.paramName方式获取缓存中的对象的指定变量内容
         * @param key
         */
        getObjectItem: function(key){
            if (typeof key === 'string') {
                let data = key.split('.');
                if (data.length === 2) {
                    var json = JSON.parse(storage.getItem(data[0]));
                    return json[data[1]];
                } else {
                    return 'key值形式不符合 objName.paramName'
                }
            } else {
                return '传入参数key不是字符串'
            }
        },

        clearValue: (key) => {
            storage.removeItem(key);
        }
    }

}]);