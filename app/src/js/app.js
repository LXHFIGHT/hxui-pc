/**
 * Created by LXHFIGHT on 2017/2/19 17:04.
 * Email: lxhfight51@outlook.com
 * Description:
 *  The main angular.js(v 1.4) configuration of the project
 */

var main = angular.module('mainApp', [ 'ui.router', 'MainController', 'MainDirective', 'MainFilter', 'MainService', 'MainValue', 'Config']);

// 路由配置
main.config(['$stateProvider','$urlRouterProvider','$httpProvider',  function($stateProvider, $urlRouterProvider, $httpProvider ){
    $urlRouterProvider.otherwise('/enter');
    $stateProvider
    // 配置主页中各个模块位置
        .state('enter',{
            url: '/enter',
            views:{
                '':{
                    templateUrl: 'views/layout/enter.html',
                    controller: 'IndexCtrl'
                },
                'navbar@enter': {
                    templateUrl: 'views/layout/navbar.html',
                    controller: 'NavbarCtrl'
                },
                'sidebar@enter': {
                    templateUrl: 'views/layout/sidebar.html',
                    controller: 'SidebarCtrl'
                },
                'main@enter':{

                }
            }
        })
        .state('enter.users', {
            url: '/user/list',
            views: {
                'main@enter': {
                    templateUrl: 'views/user/list.html',
                    controller: 'UsersCtrl'
                }
            }
        })
        .state('enter.user', {
            url: '/user/:id',
            views: {
                'main@enter': {
                    template: 'views/user/detail.html',
                    controller: 'UserCtrl'
                }
            }
        })
        .state('enter.system', {
            url: '/system',
            views: {
                'main@enter': {
                    templateUrl: 'views/system/detail.html',
                    controller: 'SystemCtrl'
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

// 允许未登录情况下查看的页面
var statesAllowAccess = ['register', 'index'];

main.run(['$rootScope', '$location', '$log', '$state','globalValue', 'HttpHelper', 'config',
    function($rootScope, $location,  $log, $state, globalValue, HttpHelper, config){
        $rootScope.stateStack = [];
        $rootScope.stateParamsStack = [];

        // 定义全局变量
        $rootScope.avatar = '';
        $rootScope.bootstrap = [ ];
        $rootScope.avatar = ''; // 用户全局样式

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



        // 路由跳转控制
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // 记录
            if(config.statusLog){
                $log.log('from state: '+fromState.name+'\t'+"to state: "+toState.name);
            }
            // 判断是否是跳转到登录页面，只有跳转至非登录页面才会执行路由控制
            if(toState.name !== 'login'){

            }
        });

        // 路由跳转成功控制
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $rootScope.stateStack.push(toState.name);
            $rootScope.stateParamsStack.push(toParams);
        });
    }]);

