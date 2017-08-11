/**
 * Created by LXHFIGHT on 2017/3/1 16:10.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */

var module = angular.module('CommonController');

module.controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'HttpHelper', 'StorageHelper', 'config',
    function($scope, $state, $stateParams, HttpHelper, StorageHelper, config){
    $scope.isLoginMode = true;

    $scope.logoUrl = config.logo.url;

    $scope.state = $stateParams.state || 'enter.users';  //需要跳转的页面

    $scope.toggleMode = (mode) => {
        $scope.isLoginMode = mode;
    };

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
    $scope.doLogin = () => {
        if($scope.userInfo.username && $scope.userInfo.password){
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
        }else{
            popTipWarningQuick('请完善登录信息');
        }
    };

    $scope.keyForRegister = ($event) => {
        if ($event.keyCode === 13) {
            $scope.doRegister();
        } else {
            let { password, passwordConfirm } = $scope.register;
            if (passwordConfirm !== password) {
                $('.input-password-confirm').addClass('error');
            } else {
                $('.input-password-confirm').removeClass('error');
            }
        }
    };

    $scope.doRegister = () => {
        let { username, password, passwordConfirm, email } = $scope.register;
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
            HttpHelper.doPost('user/signup', {username, password, email}).success((data) => {
                if (data.code === 200) {
                    popTipInfoQuick('注册车检所成功，自动登录');
                    let { token, role } = data.data;
                    StorageHelper.setValue('token', token);
                    StorageHelper.setValue('role', role);
                    $state.go('enter.inspection');
                    $scope._initProjectName(role);
                } else {
                    popTipWarningQuick(data.message);
                }
            });
        }
    }
}]);