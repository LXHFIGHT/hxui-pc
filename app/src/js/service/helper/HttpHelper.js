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
            }
        }
    }]);

