/**
 * Created by LXHFIGHT on 2017/3/1 16:10.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var module = angular.module('CommonController');

module.controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'HttpHelper', 'StorageHelper', 'config',
    function($scope, $state, $stateParams, HttpHelper, StorageHelper, config){

    $scope.logoUrl = config.logo.url;
    $scope.state = $stateParams.state || 'enter.goods';  //需要跳转的页面
    // 登录用户信息
    $scope.userInfo = {
        username: '',
        password: ''
    };

    $scope.keyForLogin = function($event) {
        if($event.keyCode === 13){
            $scope.doLogin();
        }
    };

    // 登录操作
    $scope.doLogin = function(){
        if($scope.userInfo.username && $scope.userInfo.password){
            var user = {
                username: $scope.userInfo.username,
                password: md5($scope.userInfo.password)
            };
            HttpHelper.doPost('/common/login', user).success(function(data){
                if (!data.result) {
                    popTipInfoQuick('登录成功');
                    StorageHelper.setValue('username', $scope.userInfo.username);
                    $state.go($scope.state);
                } else {
                    popTipError(data.msg);
                }
            })
        }else{
            popTipWarningQuick('请完善登录信息');
        }
    };
}]);