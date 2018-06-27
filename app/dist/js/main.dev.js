'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 17:04.
 * Email: lxhfight51@outlook.com
 * Description:
 *  The main angular.js(v 1.4) configuration of the project
 */

var main = angular.module('mainApp', ['ui.router', 'MainController', 'MainFilter', 'MainService', 'MainValue', 'Config']);

// 路由配置
main.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.otherwise('/enter');
    $stateProvider.state('home', {
        url: '/home',
        views: {
            '': {
                templateUrl: 'src/views/hxui/home/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    // 插件库
    .state('plugins', {
        url: '/plugins',
        views: {
            '': {
                templateUrl: 'src/views/hxui/plugins/plugins.html',
                controller: 'PluginsCtrl'
            }
        }
    })
    // 示例按钮
    .state('demos', {
        url: '/demos',
        views: {
            '': {
                templateUrl: 'src/views/hxui/demos/demos.html',
                controller: 'DemosCtrl'
            }
        }
    })

    // 配置主页中各个模块位置
    .state('login', {
        url: '/login/:state',
        views: {
            '': {
                templateUrl: 'src/views/login/login.html',
                controller: 'LoginCtrl'
            }
        }
    })
    // 配置主页中各个模块位置
    .state('enter', {
        url: '/enter',
        views: {
            '': {
                templateUrl: 'src/views/layout/enter/enter.html',
                controller: 'IndexCtrl'
            },
            'sidebar@enter': {
                templateUrl: 'src/views/layout/sidebar/sidebar.html',
                controller: 'SidebarCtrl'
            },
            'main@enter': {}
        }
    })
    // 配置主页中各个模块位置
    .state('enter.list-head', {
        url: '/listHead',
        views: {
            'main@enter': {
                templateUrl: 'src/views/list/list-head/index.html',
                controller: 'ListHeadCtrl'
            }
        }
    }).state('enter.config', {
        url: '/config',
        views: {
            'main@enter': {
                templateUrl: 'src/views/config/config.html',
                controller: 'ConfigCtrl'
            }
        }
    });

    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' };
}]);

main.run(['$rootScope', '$location', '$log', '$state', 'globalValue', 'HttpHelper', 'config', 'StorageHelper', 'authority', 'sidebarMenus', function ($rootScope, $location, $log, $state, globalValue, HttpHelper, config, StorageHelper, authority, sidebarMenus) {
    $rootScope.stateStack = [];
    $rootScope.stateParamsStack = [];

    // 定义全局变量
    $rootScope.authority = authority;
    $rootScope.config = config;

    $rootScope.pagesize = [{ value: 10, text: '每页10条记录' }, { value: 20, text: '每页20条记录' }, { value: 30, text: '每页30条记录' }, { value: 40, text: '每页40条记录' }, { value: 50, text: '每页50条记录' }];

    // 定义全局方法
    $rootScope.back = function () {
        if ($rootScope.stateStack.length === 0) {
            popTipWarningQuick('已经无法后退了，请勿频繁刷新页面');
        } else {
            $rootScope.stateStack.pop();
            $rootScope.stateParamsStack.pop();
            $state.go($rootScope.stateStack.pop(), $rootScope.stateParamsStack.pop());
        }
    };
    // 切换移动端是否展示高级搜索栏的按钮
    $rootScope.toggleAdvanceSearch = function () {
        var $view = $('.hxui-advance-search');
        $rootScope.showSidebar = false;
        $view.hasClass('show') ? $view.removeClass('show') : $view.addClass('show');
    };
    // 跳转到指定的页面
    $rootScope.toState = function (stateName) {
        $state.go(stateName);
    };
    // 弹出正在开发中的语句
    $rootScope.isDeveloping = function () {
        var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '该功能正在开发中...';

        popTipWarningQuick(msg);
    };

    // 路由跳转控制
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // 记录
        if (config.statusLog) {
            $log.log('from state: ' + fromState.name + '\t' + "to state: " + toState.name);
        }
        // 判断是否是跳转到登录页面，只有跳转至非登录页面才会执行路由控制
        if (toState.name !== 'login' && config.needLogin) {
            if (!StorageHelper.getValue('username')) {
                toState.name !== 'enter' && popTipWarningQuick('请先登录');
                event.preventDefault(); // 取消默认跳转行为
                $state.go('login', { state: toState.name });
            }
        }
    });

    /**
     * 用于判断当前页面路由state，选中侧边栏相关的按钮
     * @param name
     * @private
     */
    var _autoSelectOption = function _autoSelectOption(name) {
        console.log('The name is : ', name);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sidebarMenus[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (item.children && Object.prototype.toString.call(item.children) === '[object Array]') {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = item.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var subItem = _step2.value;

                            console.log('MENUS: ', subItem.state);
                            if (name === subItem.state) {
                                subItem.selected = true;
                                item.selected = true;
                                continue;
                            }
                            subItem.selected = false;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    if (item.state === name) {
                        item.selected = true;
                    }
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
    };

    // 路由跳转成功控制
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        var name = toState.name;

        $rootScope.stateStack.push(name);
        $rootScope.stateParamsStack.push(toParams);
        _autoSelectOption(name);
    });
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 17:13.
 * Email: lxhfight51@outlook.com
 * Description:
 *      the basic configuration file
 */

var _module = angular.module('Config', []);

// the main configuration content
_module.value('config', {
    isDebug: true,
    serverPrefix: 'http://localhost:3000', // 提供数据服务器位置
    logo: {
        url: './dist/img/logo/logo.png', // 项目 logo 所在位置
        show: true // 是否展示项目logo
    },
    projectVersion: 'V 0.0.1 DEV',
    projectName: 'HXUI Admin', // 项目名
    subProjectName: '', // 项目描述
    subject: '', // 系统围绕的主业务名，  类似于 酒店，车检所之类的
    needLogin: false, // 是否需要登录
    loginTitle: '登录管理后台', // 登录页面标题
    loginBg: './dist/img/bg/bg-login.jpg', // 登录页面背景
    copyright: 'Candy UI' // 企业信息
});

_module.factory('globalValue', [function () {
    return {
        errorMsg: '服务器请求失败，暂无响应',
        isLogOpen: true, // 全部控制台是否打印效果
        statusLog: false, // 此处设置为true则会将每次页面跳转的state打印在浏览器的控制台中
        requestJsonLog: true, // 此处设置为true则会在每次请求服务器的时候将请求内容打印在浏览器控制台中
        responseJsonLog: true, // 此处设置为true则会在每次获取服务器响应的时候将响应内容打印在浏览器控制台中
        kindLists: null // 分类列表
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 21:40.
 * Email: lxhfight51@outlook.com
 * Description:
 *  the main controller module
 */

var controller = angular.module('MainController', ['HXUIController', 'LayoutController', 'ListController', 'CommonController', 'ConfigController']);

var HXUIController = angular.module('HXUIController', []);
var layout = angular.module('LayoutController', []);
var list = angular.module('ListController', []);
var common = angular.module('CommonController', []);
var config = angular.module('ConfigController', []);
'use strict';

/**
 * Created by LXHFIGHT on 15/11/13.
 */
var service = angular.module('MainService', ['HelperService', 'BusinessService']);

var helperService = angular.module('HelperService', []);
var BusinessService = angular.module('BusinessService', []);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 17:38.
 * Email: lxhfight51@outlook.com
 * Description:
 *  the main value module
 */

var mainValueModule = angular.module('MainValue', ['menus', 'factories']);

var menus = angular.module('menus', []);
var factories = angular.module('factories', []);
'use strict';

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

service.factory('AuthHttpHelper', ['$http', '$state', '$log', 'config', 'StorageHelper', 'globalValue', function ($http, $state, $log, config, StorageHelper, globalValue) {
    var serverPrefix = config.serverPrefix;

    var authorizeDealer = function authorizeDealer(data, status) {
        if (status === 401) {
            $state.go('login', { state: $state.$current.name });
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
        doDelete: function doDelete(path, data) {
            var token = StorageHelper.getValue('token');
            return $http({
                method: 'DELETE',
                url: serverPrefix + path,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).error(function (data, status, header, config) {
                authorizeDealer(data, status);
            });
        },
        /**
         * GET 方法作HTTP数据请求 一般适用于获取数据单项或列表请求
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doGet: function doGet(path, data) {
            var authToken = StorageHelper.getValue('token');
            return $http({
                method: 'GET',
                url: serverPrefix + path,
                params: data,
                timeout: 30000, //30秒请求超时,
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            }).error(function (data, status, header, config) {
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
        doPost: function doPost(path, data, headers) {
            var token = StorageHelper.getValue('token');
            var headersBundle = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            };
            if (typeof headers !== 'undefined') {
                headersBundle = headers;
            } else if (headers === null) {
                headersBundle = {
                    'Authorization': 'Bearer ' + token
                };
            }
            return $http({
                method: 'POST',
                url: serverPrefix + path,
                data: data,
                timeout: 60000, // 60秒请求超时
                headers: headersBundle
            }).error(function (data, status, header, config) {
                authorizeDealer(data, status);
            });
        },
        /**
         * PUT 方法作HTTP数据请求， 一般适用于创建新的数据
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doPut: function doPut(path, data) {
            var token = StorageHelper.getValue('token');
            return $http({
                method: 'PUT',
                url: serverPrefix + path,
                data: data,
                timeout: 30000, //30秒请求超时
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                }
            }).error(function (data, status, header, config) {
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
        uploadFile: function uploadFile(options, callback) {
            var fd = new FormData();
            var files = options.query[0].files;
            popTipWarningQuick('文件正在上传中，请稍等');
            if (files !== null) {
                fd.append('image', files[0]);
                $http({
                    method: 'POST',
                    url: config.serverPrefix + "/common/uploadCloud/" + options.type,
                    data: fd,
                    headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined, 'Authorization': 'Bearer ' + token },
                    transformRequest: angular.identity
                }).success(function (data) {
                    popTipInfoQuick('图片上传成功');
                    callback(null, data.data);
                }).error(function (err) {
                    popTipErrorQuick('传输出错');
                    console.log(err);
                    callback(err, null);
                });
            }
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2016/12/29 11:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *    对HTTP请求封装的服务模块 属于工具服务
 */

var service = angular.module('HelperService');

service.factory('HttpHelper', ['$http', '$log', 'config', 'globalValue', 'StorageHelper', function ($http, $log, config, globalValue, StorageHelper) {
    var serverPrefix = config.serverPrefix;
    var token = StorageHelper.getValue('token');
    return {
        open: function open(path) {
            window.open(serverPrefix + path, '_blank');
        },
        /**
         * DELETE 方法作HTTP数据请求 一般适用于删除数据请求
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doDelete: function doDelete(path, data) {
            var token = StorageHelper.getValue('token');
            return $http({
                method: 'DELETE',
                url: serverPrefix + path + '?token=' + token
            });
        },
        /**
         * GET 方法作HTTP数据请求 一般适用于获取数据单项或列表请求
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doGet: function doGet(path, data) {
            data.token = StorageHelper.getValue('token');
            console.log('请求信息为： ' + JSON.stringify(data));
            return $http({
                method: 'GET',
                url: serverPrefix + path,
                params: data,
                timeout: 30000 //30秒请求超时
            }).error(function (data, status, header, config) {
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
        doPost: function doPost(path, data, headers) {
            var headersBundle = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            if (typeof headers !== 'undefined') {
                headersBundle = headers;
            } else if (headers === null) {
                headersBundle = {};
            }
            return $http({
                method: 'POST',
                url: serverPrefix + path + '?token=' + StorageHelper.getValue('token'),
                data: data,
                timeout: 60000, // 60秒请求超时
                headers: headersBundle
            }).error(function (data, status, header, config) {
                popTipErrorQuick(globalValue.errorMsg);
            });
        },
        /**
         * PUT 方法作HTTP数据请求， 一般适用于创建新的数据
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doPut: function doPut(path, data) {
            console.log('doPut: ' + JSON.stringify(data));
            return $http({
                method: 'PUT',
                url: serverPrefix + path + '?token=' + StorageHelper.getValue('token'),
                data: data,
                timeout: 30000, //30秒请求超时
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).error(function (data, status, header, config) {
                popTipErrorQuick(globalValue.errorMsg);
            });
        },

        /**
         * PUT 方法作HTTP数据请求， 一般适用于创建新的数据
         * @param path 请求位置
         * @param data 请求数据
         * @returns {*} 请求成功后的promise对象
         */
        doPatch: function doPatch(path, data) {
            console.log('doPatch: ' + JSON.stringify(data));
            return $http({
                method: 'PATCH',
                url: serverPrefix + path + '?token=' + StorageHelper.getValue('token'),
                data: data,
                timeout: 30000, //30秒请求超时
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).error(function (data, status, header, config) {
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
        uploadFile: function uploadFile(options, callback) {
            var fd = new FormData();
            var files = options.query[0].files;
            var token = StorageHelper.getValue('token');
            if (files.length === 0) {
                popTipWarningQuick('请选择图片');
                return;
            }
            popTipWarningQuick('文件正在上传中，请稍等');
            if (files !== null) {
                fd.append('image', files[0]);
                fd.append('token', token);
                $http({
                    method: 'POST',
                    url: config.serverPrefix + "storage/upload",
                    data: fd,
                    headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (data) {
                    popTipInfoQuick('图片上传成功');
                    callback(null, data.data);
                }).error(function (err) {
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
        uploadFiles: function uploadFiles(options, callback) {
            var fd = new FormData();
            var files = options.query[0].files;
            options.paramName = options.paramName || 'file';
            if (files.length === 0) {
                popTipWarningQuick('请选择图片');
                return;
            }
            popTipWarningQuick('文件正在上传中，请稍等');
            if (files !== null) {
                for (var i = 0; i < files.length; i++) {
                    fd.append(options.paramName + '-' + i, files[i]);
                }
                fd.append('token', token);
                $http({
                    method: 'POST',
                    url: config.serverPrefix + "/record/upload.json",
                    data: fd,
                    headers: { 'Accept-Language': 'en, zh', 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (data) {
                    popTipInfoQuick('图片上传成功');
                    callback(null, data.data);
                }).error(function (err) {
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
        responseHandler: function responseHandler(data, callback, errCallback) {
            if (data.code >= 200 && data.code < 300) {
                typeof callback === 'function' && callback(data.data);
            } else {
                typeof errCallback === 'function' && errCallback(data);
                typeof errCallback === 'undefined' && popTipWarning(data.message);
            }
        }
    };
}]);
'use strict';

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

var _module = angular.module('HelperService');

_module.factory('LocalStorageHelper', [function () {
    var storage = window.localStorage;
    return {
        setValue: function setValue(key, value) {
            storage.setItem(key, value);
            return true;
        },
        getValue: function getValue(key) {
            return storage.getItem(key);
        },
        popValue: function popValue(key) {
            var value = storage.getItem(key);
            storage.removeItem(key);
            return value;
        },
        /**
         * 将JavaScript对象转换为JSON字符串后存在缓存中
         * @param key 键
         * @param obj 需要存储的对象
         */
        saveObject: function saveObject(key, obj) {
            var json = JSON.stringify(obj);
            storage.setItem(key, json);
        },
        /**
         * 将存在缓存中的JSON字符串获取出并转换为JavaScript对象
         * @param key 键
         */
        getObject: function getObject(key) {
            var json = window.sessionStorage.getItem(key);
            return JSON.parse(json);
        },
        /**
         * 通过objName.paramName方式获取缓存中的对象的指定变量内容
         * @param key
         */
        getObjectItem: function getObjectItem(key) {
            if (typeof key === 'string') {
                var data = key.split('.');
                if (data.length === 2) {
                    var json = JSON.parse(storage.getItem(data[0]));
                    return json[data[1]];
                } else {
                    return 'key值形式不符合 objName.paramName';
                }
            } else {
                return '传入参数key不是字符串';
            }
        },

        clearValue: function clearValue(key) {
            storage.removeItem(key);
        }
    };
}]);
'use strict';

/**
 * Created by lxhfight on 2017/7/17.
 * Email:
 * Description:
 *  支持百度地图工具方法
 */

var service = angular.module('HelperService');

service.factory('BaiduMapHelper', [function () {
    return {
        /**
         * 最基础的初始化一个地图
         * @param options 初始化地图需要的参数
         * @param options.id  用于承载地图的组件ID
         * @param options.lat  初始化纬度
         * @param options.lng  初始化经度
         * @param clickFunc 点击地图触发事件
         * @param callback 初始化地图后的回调事件
         */
        initSimpleMap: function initSimpleMap(options, clickFunc, callback) {
            if (!BMap) {
                console.warn('由于使用到百度地图工具方法，请引入百度地图javascript api文件： http://api.map.baidu.com/api?v=2.0&ak={百度地图开放平台AK}');
                return null;
            } else {
                var id = options.id,
                    lat = options.lat,
                    lng = options.lng;

                if (!(lat && lng)) {
                    popTipInfoQuick('正在定位当前位置...');
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                            console.log('\u521D\u59CB\u5316\u5750\u6807\u4E3A\uFF1A ' + lng + ', ' + lat);
                            var _map = new BMap.Map(id);
                            _map.centerAndZoom(r.point, 14);
                            var mk = new BMap.Marker(r.point);
                            _map.addOverlay(mk);
                            _map.panTo(r.point);
                            _map.enableScrollWheelZoom(true);
                            _map.addEventListener("click", function (e) {
                                _map.clearOverlays();
                                var newMk = new BMap.Marker(e.point);
                                _map.addOverlay(newMk);
                                newMk.setAnimation(BMAP_ANIMATION_BOUNCE);
                                _map.panTo(e.point);
                                typeof clickFunc === 'function' && clickFunc(e.point);
                            });
                            typeof callback === 'function' && callback(_map);
                        } else {
                            popTipWarningQuick('获取位置失败：' + this.getStatus());
                        }
                    }, { enableHighAccuracy: true });
                } else {
                    var map = new BMap.Map(id); // 创建Map实例
                    var point = new BMap.Point(parseFloat(lng), parseFloat(lat)); // 创建点坐标
                    map.centerAndZoom(point, 14);
                    map.enableScrollWheelZoom();
                    var mk = new BMap.Marker(point);
                    map.addOverlay(mk);
                    map.addEventListener("click", function (e) {
                        map.clearOverlays();
                        var newMk = new BMap.Marker(e.point);
                        map.addOverlay(newMk);
                        newMk.setAnimation(BMAP_ANIMATION_BOUNCE);
                        map.panTo(e.point);
                        typeof clickFunc === 'function' && clickFunc(e.point);
                    });
                    typeof callback === 'function' && callback(map);
                }
            }
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/3/24 14:55.
 * Email: lxhfight51@outlook.com
 * Description:
 *  对象工具方法
 */

var ObjectHelper = angular.module('HelperService');

ObjectHelper.factory('ObjectHelper', [function () {
    var getDate = function getDate(timestamp) {
        var date = new Date(timestamp);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    };

    var getDatetime = function getDatetime(timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate(),
            hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours(),
            minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes(),
            second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
        return year + '-' + (month >= 10 ? month : '0' + month) + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    };

    var getCity = function getCity(str) {
        if (typeof str === 'string' && str.indexOf('市') !== -1) {
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
        generateDayArray: function generateDayArray(beginDate, endDate) {
            var array = [];
            var currentDate = beginDate;
            while (true) {
                // 当遍历到结束时间的时候结束
                if (currentDate > endDate) {
                    console.log(currentDate + '   ' + endDate);
                    break;
                }
                var day = new Date(currentDate).getDay();
                var item = { 'date': currentDate, day: day };
                array.push(item);
                currentDate = getDate(new Date(currentDate).getTime() + 86400000);
            }
            return array;
        },

        getDate: getDate,

        getDatetime: getDatetime,

        getCity: getCity,

        /**
         * 比较两个日期之间相差多少天
         * @param date1 日期一
         * @param date2 日期二
         * @returns {number} 相差天数
         */
        compareDays: function compareDays(date1, date2) {
            var time = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
            var divider = 24 * 60 * 60 * 1000;
            return time % divider === 0 ? time / divider : Math.floor(time / divider);
        },
        /**
         * 获取天数中最大的天数
         * @param  days 存有日期的数组
         * @returns {string}
         */
        maxDate: function maxDate(days) {
            var max = '2000-01-01';
            days.forEach(function (v) {
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
        validCellphone: function validCellphone(cellphone) {
            var reg = /^1[3|5|7|8]{1}[0-9]{9}/;
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
        clearParamInArray: function clearParamInArray(array, param) {
            if (typeof param !== 'string') return false;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var a = _step.value;

                    delete a[param];
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

            return true;
        },

        /**
         * 调整之后将适应二级分类模式的侧边栏
         * @param array
         * @param name
         * @param param
         */
        doSelect: function doSelect(array, name) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'selected';

            if (Object.prototype.toString.call(array) === '[object Array]') {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        if (item.children && Object.prototype.toString.call(item.children) === '[object Array]') {
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = item.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var subItem = _step3.value;

                                    if (name.indexOf(subItem.name) !== -1) {
                                        subItem[param] = true;
                                        item.selected = true;
                                        continue;
                                    }
                                    subItem[param] = false;
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                        _iterator3.return();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
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
        hasNone: function hasNone(obj) {
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                var result = false;
                for (var param in obj) {
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

        isEmail: function isEmail(str) {
            var regExp = /\w@\w*\.\w/;
            return regExp.test(str);
        },

        /**
         * 获取随机字符串
         * @param length 需要生成的长度
         */
        getRandomString: function getRandomString(length) {
            var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = "";
            for (var i = 0; i < length; i++) {
                result += str.charAt(Math.floor(parseInt(Math.random() * 36)));
            }
            return result;
        }

    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2016/12/29 14:13.
 * Email: lxhfight51@outlook.com
 * Description:
 *   HTML5缓存服务 --属于工具服务
 */

var _module = angular.module('HelperService');

_module.factory('StorageHelper', [function () {
    return {
        KEY_APPOINTMENT_SEARCH_INFO: 'KEY_APPOINTMENT_SEARCH_INFO',
        setValue: function setValue(key, value) {
            var storage = window.sessionStorage;
            storage.setItem(key, value);
            return true;
        },
        getValue: function getValue(key) {
            var storage = window.sessionStorage;
            return storage.getItem(key);
        },
        popValue: function popValue(key) {
            var value = window.sessionStorage.getItem(key);
            window.sessionStorage.removeItem(key);
            return value;
        },
        /**
         * 将JavaScript对象转换为JSON字符串后存在缓存中
         * @param key 键
         * @param obj 需要存储的对象
         */
        saveObject: function saveObject(key, obj) {
            var json = JSON.stringify(obj);
            var storage = window.sessionStorage;
            storage.setItem(key, json);
        },
        /**
         * 将存在缓存中的JSON字符串获取出并转换为JavaScript对象
         * @param key 键
         */
        getObject: function getObject(key) {
            var json = window.sessionStorage.getItem(key);
            return JSON.parse(json);
        },
        clearValue: function clearValue(key) {
            var storage = window.sessionStorage;
            storage.removeItem(key);
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 21:40.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var _module = angular.module('MainFilter', []);
'use strict';

/**
 * Created by lxhfight on 2017/7/17.
 * Email:
 * Description:
 *    角色管理value模块
 */

var factoriesModule = angular.module('factories');

factoriesModule.factory('authority', ['$rootScope', 'StorageHelper', function ($rootScope, StorageHelper) {
    return {
        ROLE_COMMON_USER: 0, // 普通用户
        ROLE_SUPER_ADMIN: 100, // 系统管理员
        /**
         * 判断当前用户是否为参数中的角色
         * @param userRole
         * @returns {boolean}
         */
        isRole: function isRole(userRole) {
            if (userRole === '*') {
                return true;
            }
            var role = parseInt(StorageHelper.getValue('role'));
            return userRole === role;
        },
        /**
         * 判断当前用户角色是否输入参数中的角色集合中
         * @param userRoles
         * @returns {boolean}
         */
        withRole: function withRole(userRoles) {
            if (userRoles === '*') {
                return true;
            }
            var arr = userRoles.split('|');
            var role = parseInt(StorageHelper.getValue('role'));
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if (role === parseInt(item)) {
                        return true;
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

            return false;
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/20 1:07.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var menus = angular.module('menus');

menus.value('sidebarMenus', [{
    name: '列表页面',
    state: 'enter.list',
    icon: 'list',
    role: '*',
    selected: true,
    children: [{
        name: '带header列表',
        state: 'enter.list-head',
        icon: 'th',
        role: '*',
        selected: false
    }, {
        name: '带footer列表',
        state: 'enter.list-footer',
        icon: 'calendar',
        role: '*',
        selected: false
    }, {
        name: '完整布局列表',
        state: 'enter.list-both',
        icon: 'check-square-o',
        role: '*',
        selected: false
    }]
}, {
    name: '系统设置',
    state: 'enter.config',
    icon: 'cog',
    role: '*',
    selected: false
}, {
    name: '一级菜单',
    state: 'enter.system',
    icon: 'cogs',
    role: '*',
    selected: false,
    children: [{
        name: '二级菜单5',
        state: '',
        icon: 'user',
        role: '*',
        selected: false
    }, {
        name: '二级菜单6',
        state: '',
        icon: 'users',
        role: '*',
        selected: false
    }]
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/20 9:08.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */
var _module = angular.module('ListController');
_module.controller('ListCtrl', ['$scope', 'HttpHelper', function ($scope, HttpHelper) {
    $scope.searchInfo = {
        page: 1,
        pagesize: 20,
        maxsize: 0
    };

    $scope.list = [];

    // 获取用户列表方法
    $scope.requestList = function () {
        HttpHelper.doGet('/wallpaper/list', $scope.searchInfo).success(function (data) {
            HttpHelper.responseHandler(data, function (res) {
                // 请求成功时处理
            }, function (err) {
                // 请求失败时处理
            });
        });
    };
    // 分页必备方法 requestListByPage 上下翻页的方法 toPageOfList 跳转指定页面方法
    $scope.requestListByPage = function (page) {
        $scope.searchInfo.page = page;
        $scope.requestList();
    };
    $scope.toPageOfList = function () {
        if ($scope.searchInfo.maxsize >= $scope.searchInfo.jumpPage && $scope.searchInfo.jumpPage > 0) {
            $scope.searchInfo.page = parseInt($scope.searchInfo.jumpPage);
            $scope.requestList();
        } else {
            popTipWarningQuick('跳转页面超过范围');
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/20 9:08.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */
var _module = angular.module('ListController');
_module.controller('ListHeadCtrl', ['$scope', 'HttpHelper', function ($scope, HttpHelper) {
    $scope.searchInfo = {
        page: 1,
        pagesize: 20,
        maxsize: 0
    };

    $scope.list = [];

    // 获取用户列表方法
    $scope.requestList = function () {
        HttpHelper.doGet('/wallpaper/list', $scope.searchInfo).success(function (data) {
            HttpHelper.responseHandler(data, function (res) {
                // 请求成功时处理
            }, function (err) {
                // 请求失败时处理
            });
        });
    };
    // 分页必备方法 requestListByPage 上下翻页的方法 toPageOfList 跳转指定页面方法
    $scope.requestListByPage = function (page) {
        $scope.searchInfo.page = page;
        $scope.requestList();
    };
    $scope.toPageOfList = function () {
        if ($scope.searchInfo.maxsize >= $scope.searchInfo.jumpPage && $scope.searchInfo.jumpPage > 0) {
            $scope.searchInfo.page = parseInt($scope.searchInfo.jumpPage);
            $scope.requestList();
        } else {
            popTipWarningQuick('跳转页面超过范围');
        }
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/20 10:28.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var ConfigCtrl = angular.module('ConfigController');
ConfigCtrl.controller('ConfigCtrl', ['$scope', function ($scope) {}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/3/1 16:10.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var LoginCtrl = angular.module('CommonController');

LoginCtrl.controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'HttpHelper', 'StorageHelper', 'config', function ($scope, $state, $stateParams, HttpHelper, StorageHelper, config) {
    $scope.isLoginMode = true;

    $scope.logoUrl = config.logo.url;

    $scope.state = $stateParams.state || 'enter.users'; //需要跳转的页面

    $scope.toggleMode = function (mode) {
        $scope.isLoginMode = mode;
    };

    // 登录用户信息
    $scope.userInfo = {
        username: '',
        password: ''
    };

    $scope.keyForLogin = function ($event) {
        $event.keyCode === 13 && $scope.doLogin();
    };

    // 登录操作
    $scope.doLogin = function () {
        if ($scope.userInfo.username && $scope.userInfo.password) {
            // 如果是debug模式下 输入 admin 账号和 admin123 密码进行登录
            if (config.isDebug && $scope.userInfo.username === 'admin' && $scope.userInfo.password === 'admin123') {
                popTipInfoQuick('登录成功');
                StorageHelper.setValue('username', 'superadmin');
                $state.go($scope.state);
            } else {
                // let user = {
                //     username: $scope.userInfo.username,
                //     password: md5($scope.userInfo.password)
                // };
                // HttpHelper.doPost('/common/login', user).success(function(data){
                //     if (!data.result) {
                //         popTipInfoQuick('登录成功');
                //         StorageHelper.setValue('username', $scope.userInfo.username);
                //         $state.go($scope.state);
                //     } else {
                //         popTipError(data.msg);
                //     }
                // })
            }
        } else {
            popTipWarningQuick('请完善登录信息');
        }
    };

    $scope.keyForRegister = function ($event) {
        if ($event.keyCode === 13) {
            $scope.doRegister();
        } else {
            var _$scope$register = $scope.register,
                password = _$scope$register.password,
                passwordConfirm = _$scope$register.passwordConfirm;

            if (passwordConfirm !== password) {
                $('.input-password-confirm').addClass('error');
            } else {
                $('.input-password-confirm').removeClass('error');
            }
        }
    };

    $scope.doRegister = function () {
        var _$scope$register2 = $scope.register,
            username = _$scope$register2.username,
            password = _$scope$register2.password,
            passwordConfirm = _$scope$register2.passwordConfirm,
            email = _$scope$register2.email;

        if (ObjectHelper.hasNone($scope.register)) {
            popTipWarningQuick('请完善所有信息');
            return;
        } else if (password !== passwordConfirm) {
            popTipWarningQuick('账号密码和密码确认不匹配');
            return;
        }
        // else if (!ObjectHelper.isEmail(email)) {
        //     popTipWarningQuick('电子邮箱格式不正确');
        //     return;
        // }
        else {
                // 发起注册操作
                HttpHelper.doPost('user/signup', { username: username, password: password, email: email }).success(function (data) {
                    if (data.code === 200) {
                        popTipInfoQuick('注册车检所成功，自动登录');
                        var _data$data = data.data,
                            token = _data$data.token,
                            role = _data$data.role;

                        StorageHelper.setValue('token', token);
                        StorageHelper.setValue('role', role);
                        $state.go('enter.inspection');
                        $scope._initProjectName(role);
                    } else {
                        popTipWarningQuick(data.message);
                    }
                });
            }
    };
}]);
'use strict';

/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

var DemosCtrl = angular.module('HXUIController');

DemosCtrl.controller('DemosCtrl', ['$scope', function ($scope) {
    $scope.location = '';
    $scope.event = {
        doPopInfo: function doPopInfo(type) {
            switch (type) {
                case 0:
                    HXUI.popTipNormal('调用 HXUI.popTipNormal 弹出常规提示框');break;
                case 1:
                    HXUI.popTipInfo('调用 HXUI.popTipInfo 弹出成功提示框');break;
                case 2:
                    HXUI.popTipWarning('调用 HXUI.popTipWarning 弹出警告提示框');break;
                case 3:
                    HXUI.popTipError('调用 HXUI.popTipError 弹出错误提示框');break;
                default:
                    break;
            }
        },
        doShowLoading: function doShowLoading(title, during) {
            HXUI.showLoading({ title: title, during: during });
        },
        doHideLoading: function doHideLoading() {
            HXUI.hideLoading();
        },
        doShowTip: function doShowTip(options) {
            HXUI.toast(options);
        },
        doMarkInput: function doMarkInput(type) {
            HXUI.markInput({ type: type });
        },
        doConfirm: function doConfirm() {
            HXUI.confirm({
                title: 'HXUI确认框',
                content: '请问你觉得这个框怎么样呢？',
                confirmText: '挺不错的',
                cancelText: '不喜欢',
                confirmFunc: function confirmFunc() {
                    HXUI.popTipInfoQuick('很高兴得到你的认可');
                },
                cancelFunc: function cancelFunc() {
                    HXUI.popTipInfoQuick('好的我们继续改进');
                }
            });
        },
        doImagePreview: function doImagePreview() {
            var urls = ['http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-1.jpeg', 'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-2.png', 'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-3.jpeg', 'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-4.jpeg'];
            var currentUrl = 'http://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/example-3.jpeg';
            HXUI.imagePreviewer({ urls: urls, currentUrl: currentUrl });
        },
        doChooseAddress: function doChooseAddress() {
            HXUI.addressSelector({
                choose: function choose(position) {
                    var lng = position.lng,
                        lat = position.lat,
                        address = position.address,
                        city = position.city,
                        title = position.title;

                    $scope.location = city + ' ' + title + ' ' + address + ', \uFF08\u7ECF\u5EA6\uFF1A' + lng + ', \u7EAC\u5EA6\uFF1A' + lat + '\uFF09';
                    $scope.$apply();
                }
            });
        }
    };

    $scope._init = {
        initRoute: function initRoute() {
            HXUI.showRouteMap({
                query: 'map',
                startLabel: '起始点',
                endLabel: '结束点',
                startTime: '05.10 12:30',
                endTime: '05.10 13:00',
                isComplete: true,
                routes: [{ lng: 113.23, lat: 23.33 }, { lng: 113.35, lat: 23.35 }, { lng: 113.28, lat: 23.40 }]
            });
        }
    };

    $scope.init = function () {
        $scope._init.initRoute();
    }();
}]);
'use strict';

/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

var HomeCtrl = angular.module('HXUIController');

HomeCtrl.controller('HomeCtrl', ['$scope', function ($scope) {
    $scope._init = {
        wave: function wave() {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = document.body.clientHeight;
            //如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
            window.requestAnimFrame = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            }();
            // 波浪大小
            var boHeight = canvas.height / 20;
            var posHeight = canvas.height / 1.1;
            //初始角度为0
            var step = 0;
            //定义三条不同波浪的颜色
            var lines = ["rgba(0,222,255, 0.2)", "rgba(157,192,249, 0.2)", "rgba(0,168,255, 0.2)"];
            function loop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                step++;
                //画3个不同颜色的矩形
                for (var j = lines.length - 1; j >= 0; j--) {
                    ctx.fillStyle = lines[j];
                    //每个矩形的角度都不同，每个之间相差45度
                    var angle = (step + j * 50) * Math.PI / 180;
                    var deltaHeight = Math.sin(angle) * boHeight;
                    var deltaHeightRight = Math.cos(angle) * boHeight;
                    ctx.beginPath();
                    ctx.moveTo(0, posHeight + deltaHeight);
                    ctx.bezierCurveTo(canvas.width / 2, posHeight + deltaHeight - boHeight, canvas.width / 2, posHeight + deltaHeightRight - boHeight, canvas.width, posHeight + deltaHeightRight);
                    ctx.lineTo(canvas.width, canvas.height);
                    ctx.lineTo(0, canvas.height);
                    ctx.lineTo(0, posHeight + deltaHeight);
                    ctx.closePath();
                    ctx.fill();
                }
                requestAnimFrame(loop);
            }
            loop();
        }
    };

    $scope.init = function () {
        $scope._init.wave();
    }();
}]);
'use strict';

/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *
 */

var EnterCtrl = angular.module('LayoutController');

EnterCtrl.controller('EnterCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.toggleSidebar = function () {
        $rootScope.showSidebar = !$rootScope.showSidebar;
    };
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/20 0:12.
 * Email: lxhfight51@outlook.com
 * Description:
 *      Index controller
 */

var IndexCtrl = angular.module('LayoutController');

IndexCtrl.controller('IndexCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.toggleSidebar = function () {
        $rootScope.showSidebar = !$rootScope.showSidebar;
    };

    $scope._init = function () {
        window.addEventListener('click', function (e) {
            var $view = $(e.target);
            var parents = $view.parents();
            var isOnSidebar = false;
            for (var i = 0; i < parents.length; i++) {
                var item = parents[i].getAttribute('class') || '';
                if (item.indexOf('hx-sidebar') !== -1 || item.indexOf('btn-show-sidebar') !== -1) {
                    isOnSidebar = true;
                    break;
                }
            }
            var className = $view.attr('class') || '';
            if (className.indexOf('hx-sidebar') !== -1 || className.indexOf('btn-show-sidebar') !== -1) {
                isOnSidebar = true;
            }
            if (!isOnSidebar) {
                $rootScope.showSidebar = false;
                $rootScope.$apply();
            }
        });
    }();
}]);
'use strict';

/**
 * Created by LXHFIGHT on 2017/2/19 22:59.
 * Email: lxhfight51@outlook.com
 * Description:
 *  sidebar controller
 */

var sidebarModule = angular.module('LayoutController');

sidebarModule.controller('SidebarCtrl', ['$scope', '$state', 'sidebarMenus', 'config', 'StorageHelper', function ($scope, $state, sidebarMenus, config, StorageHelper) {
    // sidebar ctrl
    $scope.config = config;

    $scope.doLogout = function () {
        StorageHelper.clearValue('token');
        StorageHelper.clearValue('role');
        StorageHelper.clearValue('station_id');
        $state.go('login', { state: '' });
    };

    $scope.menus = sidebarMenus;

    $scope.selectedMenu = sidebarMenus[0];

    $scope.doClick = function ($event, menu) {
        if (menu.children) {
            menu.selected = !menu.selected;
            return;
        }
        if (!menu.selected) {
            if ($scope.selectedMenu && !$scope.selectedMenu.children) {
                $scope.selectedMenu.selected = false;
            }
            menu.selected = !menu.selected;
            $scope.selectedMenu = menu;
            menu.state && $state.go(menu.state);
        }
    };
}]);
'use strict';

/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

var PluginsCtrl = angular.module('HXUIController');

PluginsCtrl.controller('PluginsCtrl', ['$scope', function ($scope) {

  $scope._init = {};
}]);