/**
 * Created by LXHFIGHT on 2017/2/19 17:04.
 * Email: lxhfight51@outlook.com
 * Description:
 *  The main angular.js(v 1.4) configuration of the project
 */

let main = angular.module('mainApp', ['ui.router', 'MainController', 'MainFilter', 'MainService', 'MainValue', 'Config']);

// 路由配置
main.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', ($stateProvider, $urlRouterProvider, $httpProvider ) => {
    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.otherwise('/enter');
    $stateProvider
        .state('home', {
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
        .state('login',{
            url: '/login/:state',
            views:{
                '':{
                    templateUrl: 'src/views/login/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        // 配置主页中各个模块位置
        .state('enter', {
            url: '/enter',
            views:{
                '':{
                    templateUrl: 'src/views/layout/enter/enter.html',
                    controller: 'IndexCtrl'
                },
                'sidebar@enter': {
                    templateUrl: 'src/views/layout/sidebar/sidebar.html',
                    controller: 'SidebarCtrl'
                },
                'main@enter': {

                }
            }
        })
        // 配置主页中各个模块位置
        .state('enter.list-head', {
            url: '/listHead',
            views:{
                'main@enter': {
                    templateUrl: 'src/views/list/list-head/index.html',
                    controller: 'ListHeadCtrl'
                }
            }
        })
    ;

    $httpProvider.defaults.transformRequest = function(obj){
        var str = [];
        for(var p in obj){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'}
}]);

main.run(['$rootScope', '$location', '$log', '$state','globalValue', 'HttpHelper', 'config', 'StorageHelper', 'authority',
    ($rootScope, $location,  $log, $state, globalValue, HttpHelper, config, StorageHelper, authority) => {
        $rootScope.stateStack = [];
        $rootScope.stateParamsStack = [];

        // 定义全局变量
        $rootScope.authority = authority;
        $rootScope.config = config;

        $rootScope.pagesize = [
            {value: 10, text: '每页10条记录'},
            {value: 20, text: '每页20条记录'},
            {value: 30, text: '每页30条记录'},
            {value: 40, text: '每页40条记录'},
            {value: 50, text: '每页50条记录'}
        ];

        // 定义全局方法
        $rootScope.back = function(){
            if($rootScope.stateStack.length === 0){
                popTipWarningQuick('已经无法后退了，请勿频繁刷新页面');
            }else{
                $rootScope.stateStack.pop();
                $rootScope.stateParamsStack.pop();
                $state.go($rootScope.stateStack.pop(), $rootScope.stateParamsStack.pop());
            }
        };
        // 切换移动端是否展示高级搜索栏的按钮
        $rootScope.toggleAdvanceSearch = () => {
            let $view = $('.hxui-advance-search');
            $rootScope.showSidebar = false;
            $view.hasClass('show') ?
                $view.removeClass('show') :
                $view.addClass('show');
        };
        // 跳转到指定的页面
        $rootScope.toState = (stateName) => {
            $state.go(stateName);
        };
        // 弹出正在开发中的语句
        $rootScope.isDeveloping = ( msg = '该功能正在开发中...') => {
            popTipWarningQuick(msg);
        };

        // 路由跳转控制
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // 记录
            if(config.statusLog){
                $log.log('from state: '+fromState.name+'\t'+"to state: "+toState.name);
            }
            // 判断是否是跳转到登录页面，只有跳转至非登录页面才会执行路由控制
            if(toState.name !== 'login' && config.needLogin){
                if (!StorageHelper.getValue('username')) {
                    toState.name !== 'enter' && popTipWarningQuick('请先登录');
                    event.preventDefault();// 取消默认跳转行为
                    $state.go('login', { state: toState.name });
                }
            }
        });

        // 路由跳转成功控制
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $rootScope.stateStack.push(toState.name);
            $rootScope.stateParamsStack.push(toParams);
        });
    }]);

