/**
 * Created by LXHFIGHT on 2016/12/29 14:13.
 * Email: lxhfight51@outlook.com
 * Description:
 *   HTML5缓存服务 --属于工具服务
 */

var module = angular.module('HelperService');

module.factory('StorageHelper',[ function(){
    return {
        setValue: function(key, value){
            var storage = window.sessionStorage;
            storage.setItem(key, value);
            return true;
        },
        getValue: function(key){
            var storage = window.sessionStorage;
            return storage.getItem(key);
        },
        popValue: function(key){
            var value = window.sessionStorage.getItem(key);
            window.sessionStorage.removeItem(key);
            return value;
        },
        /**
         * 将JavaScript对象转换为JSON字符串后存在缓存中
         * @param key 键
         * @param obj 需要存储的对象
         */
        saveObject: function(key, obj){
            var json = JSON.stringify(obj);
            var storage = window.sessionStorage;
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
        clearValue: function(key) {
            var storage = window.sessionStorage;
            storage.removeItem(key);
        }
    }

}]);