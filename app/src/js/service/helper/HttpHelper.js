/**
 * Created by LXHFIGHT on 2016/12/29 11:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *    对HTTP请求封装的服务模块 属于工具服务
 */

var service = angular.module('HelperService');

service.factory('HttpHelper',['$http', '$log', 'config', 'globalValue', 'StorageHelper',
    function($http, $log, config, globalValue, StorageHelper){
        var serverPrefix = config.serverPrefix;
        let token = StorageHelper.getValue('token');
        return {
            open: function(path) {
                 window.open((serverPrefix + path), '_blank');
            },
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
                    url: (serverPrefix + path + '?token=' + token)
                })
            },
            /**
             * GET 方法作HTTP数据请求 一般适用于获取数据单项或列表请求
             * @param path 请求位置
             * @param data 请求数据
             * @returns {*} 请求成功后的promise对象
             */
            doGet: function(path, data){
                data.token = StorageHelper.getValue('token');
                console.log('请求信息为： ' + JSON.stringify(data));
                return $http({
                    method: 'GET',
                    url: (serverPrefix + path),
                    params: data,
                    timeout: 30000  //30秒请求超时
                }).error((data, status, header, config) => {
                    console.warn('服务端错误：');
                    console.warn(data);
                    console.warn(status);
                    console.warn(header);
                    console.warn(config);
                    popTipErrorQuick('服务端错误信息：' + data);
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
                    url: (serverPrefix + path + '?token=' + StorageHelper.getValue('token')),
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
            doPut: function(path, data){
                console.log('doPut: ' + JSON.stringify(data));
                return $http({
                    method: 'PUT',
                    url: (serverPrefix + path + '?token=' + StorageHelper.getValue('token')),
                    data: data,
                    timeout: 30000, //30秒请求超时
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
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
            doPatch: function(path, data){
                console.log('doPatch: ' + JSON.stringify(data));
                return $http({
                    method: 'PATCH',
                    url: (serverPrefix + path + '?token=' + StorageHelper.getValue('token')),
                    data: data,
                    timeout: 30000, //30秒请求超时
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).error(function(data, status, header, config){
                    popTipErrorQuick(globalValue.errorMsg);
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
                let fd = new FormData();
                let files = options.query[0].files;
                let token = StorageHelper.getValue('token');
                popTipWarningQuick('文件正在上传中，请稍等');
                if(files !== null){
                    fd.append('image', files[0]);
                    fd.append('token', token);
                    $http({
                        method:'POST',
                        url: config.serverPrefix + "storage/upload",
                        data: fd,
                        headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined },
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
            },

            /**
             * 上传文件
             * @param options 上传对象
             * @param options.query 上传组件的选择器 类似于 .uploader
             * @param options.paramName  上传对应的文件夹 类似于  cover avatar
             * @param callback(err, data) 上传之后的回调方法
             */
            uploadFiles: function(options, callback){
                let fd = new FormData();
                let files = options.query[0].files;
                options.paramName = options.paramName || 'file';
                popTipWarningQuick('文件正在上传中，请稍等');
                if(files !== null){
                    for (let i = 0; i < files.length; i++ ) {
                        fd.append(options.paramName + '-' + i, files[i]);
                    }
                    fd.append('token', token);
                    $http({
                        method:'POST',
                        url: config.serverPrefix + "/record/upload.json",
                        data: fd,
                        headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined },
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
            },
            /**
             * 封装了对服务端响应参数的处理方式
             * @param data  响应的参数方式
             * @param callback
             * @param errCallback
             */
            responseHandler: (data, callback, errCallback) => {
                if (data.code >= 200 && data.code < 300) {
                    typeof callback === 'function' && callback(data.data);
                } else {
                    typeof errCallback === 'function' && errCallback(data);
                    typeof errCallback === 'undefined' && popTipWarning(data.message);
                }
            }
        }
    }]);

