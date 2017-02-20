/**
 * Created by LXHFIGHT on 2017/2/20 9:08.
 * Email: lxhfight51@outlook.com
 * Description:
 *
 */
var module = angular.module('UserController');
module.controller('UserCtrl', ['$scope', function($scope){
    $scope.searchInfo = {
        page: 1,
        pagesize: 20,
        maxsize: 0,
        jumpPage: 0
        //content: ''
    };
    // 获取用户列表方法
    $scope.requestList = function(){
        HttpHelper.doGet('/wallpaper/list', $scope.searchInfo).success(function(data){
            if(!data.result){
                $scope.searchInfo.maxsize = data.data.maxsize;
                $scope.list = data.data.list;
            }
        })
    };
    // 分页必备方法 requestListByPage 上下翻页的方法 toPageOfList 跳转指定页面方法
    $scope.requestListByPage = function(page){
        $scope.searchInfo.page = page;
        $scope.requestList();
    };
    $scope.toPageOfList = function(){
        if($scope.searchInfo.maxsize >= $scope.searchInfo.jumpPage &&  $scope.searchInfo.jumpPage > 0  ){
            $scope.searchInfo.page = parseInt($scope.searchInfo.jumpPage);
            $scope.requestList();
        }else{
            popTipWarningQuick('跳转页面超过范围');
        }
    };
}]);