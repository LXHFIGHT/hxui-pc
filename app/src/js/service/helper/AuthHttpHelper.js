/**
 * Created by LXHFIGHT on 2016/12/29 11:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *    对HTTP请求封装的服务模块 属于工具服务 【PS: 带有JWT授权信息的HTTP请求】
 *    前置条件:
 *      登录操作成功之后需要使用 StorageHelper 将 token 信息保存在前端浏览器缓存SessionStorage中，并且以token作为键
 *
 */

var service = angular.module('HelperService');

service.factory('AuthHttpHelper',['$http', '$state', '$log', 'config', 'StorageHelper', 'globalValue',
    function($http, $state, $log, config, StorageHelper, globalValue){
        let serverPrefix = config.serverPrefix;

        let authorizeDealer = (data, status) => {
            if(status === 401) {
                $state.go('login', { state: $state.$current.name});
                popTipWarningQuick('用户授权失效');
            } else {
                popTipErrorQuick(globalValue.errorMsg);
            }
        };
        return {
            /**
             * DELETE 方法作HTTP数据请求 一般适用于删除数据请求
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doDelete: function(path, data){
                let token = StorageHelper.getValue('token');
                return $http({
                    method: 'DELETE',
                    url: (serverPrefix + path),
                    headers: {
                        'Authorization':  `Bearer ${token}`
                    }
                }).error(function(data, status, header, config){
                    authorizeDealer(data, status);
                });
            },
            /**
             * GET 方法作HTTP数据请求 一般适用于获取数据单项或列表请求
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doGet: function(path, data){
                let authToken = StorageHelper.getValue('token');
                return $http({
                    method: 'GET',
                    url: (serverPrefix + path),
                    params: data,
                    timeout: 30000,  //30秒请求超时,
                    headers: {
                        'Authorization':  `Bearer ${authToken}`
                    }
                }).error(function(data, status, header, config){
                    authorizeDealer(data, status);
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
                let token = StorageHelper.getValue('token');
                var headersBundle = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                };
                if(typeof headers !== 'undefined'){
                    headersBundle = headers;
                }else if(headers === null){
                    headersBundle = {
                        'Authorization': `Bearer ${token}`
                    };
                }
                return $http({
                    method: 'POST',
                    url: (serverPrefix + path),
                    data: data,
                    timeout: 60000, // 60秒请求超时
                    headers: headersBundle
                }).error(function(data, status, header, config){
                    authorizeDealer(data, status);
                });
            },
            /**
             * PUT 方法作HTTP数据请求， 一般适用于创建新的数据
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doPut: function(path,data){
                let token = StorageHelper.getValue('token');
                return $http({
                    method: 'PUT',
                    url: (serverPrefix + path),
                    data: data,
                    timeout: 30000, //30秒请求超时
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token}`
                    }
                }).error(function(data, status, header, config){
                    authorizeDealer(data, status);
                });
            },

            /**
             * 上传文件
             * @param options 上传对象
             * @param options.query 上传组件的选择器 类似于 .uploader
             * @param options.type  上传对应的文件夹 类似于  cover avatar
             * @param callback(err, data) 上传之后的回调方法
             */
            uploadFile: function(options, callback){
                var fd = new FormData();
                var files = options.query[0].files;
                popTipWarningQuick('文件正在上传中，请稍等');
                if(files !== null){
                    fd.append('image', files[0]);
                    $http({
                        method:'POST',
                        url: config.serverPrefix + "/common/uploadCloud/"+ options.type,
                        data: fd,
                        headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined, 'Authorization': `Bearer ${token}` },
                        transformRequest: angular.identity
                    }).success(function(data) {
                        popTipInfoQuick('图片上传成功');
                        callback(null, data.data);
                    }).error(function(err){
                        popTipErrorQuick('传输出错');
                        console.log(err);
                        callback(err, null);
                    });
                }
            }
        }
    }]);

