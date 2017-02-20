/**
 * Created by LXHFIGHT on 2016/12/29 11:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *    对HTTP请求封装的服务模块 属于工具服务
 */

var service = angular.module('HelperService');

service.factory('HttpHelper',['$http', '$log', 'config', 'globalValue',
    function($http, $log, config, globalValue){
        var serverPrefix = config.serverPrefix;
        return {
            /**
             * DELETE 方法作HTTP数据请求 一般适用于删除数据请求
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doDelete: function(path, data){
                return $http({
                    method: 'DELETE',
                    url: (serverPrefix + path)
                })
            },
            /**
             * GET 方法作HTTP数据请求 一般适用于获取数据单项或列表请求
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doGet: function(path, data){
                return $http({
                    method: 'GET',
                    url: (serverPrefix + path),
                    params: data,
                    timeout: 30000  //30秒请求超时
                }).error(function(data, status, header, config){
                    popTipErrorQuick(globalValue.errorMsg);
                });
            },
            /**
             * POST 方法作HTTP数据请求 一般适用于修改数据
             * @param path 请求位置
             * @param data 请求数据
             * @param headers 自定义请求头
             * @returns {*} 请求成功后的promise对象
             */
            doPost: function(path, data, headers){
                var headersBundle = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                if(typeof headers !== 'undefined'){
                    headersBundle = headers;
                }else if(headers === null){
                    headersBundle = {};
                }
                return $http({
                    method: 'POST',
                    url: (serverPrefix + path),
                    data: data,
                    timeout: 60000, // 60秒请求超时
                    headers: headersBundle
                }).error(function(data, status, header, config){
                    popTipErrorQuick(globalValue.errorMsg);
                });
            },
            /**
             * PUT 方法作HTTP数据请求， 一般适用于创建新的数据
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doPut: function(path,data){
                return $http({
                    method: 'PUT',
                    url: (serverPrefix + path),
                    data: data,
                    timeout: 30000, //30秒请求超时
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).error(function(data, status, header, config){
                    popTipErrorQuick(globalValue.errorMsg);
                });
            }
        }
    }]);

