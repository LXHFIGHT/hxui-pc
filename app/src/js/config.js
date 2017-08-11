/**
 * Created by LXHFIGHT on 2017/2/19 17:13.
 * Email: lxhfight51@outlook.com
 * Description:
 *      the basic configuration file
 */

var module = angular.module('Config', []);

// the main configuration content
module.value('config', {
    isDebug: true,

    serverPrefix: 'http://localhost:3000',          // 提供数据服务器位置

    logo: {
        url: './dist/img/logo/logo.png',         // 项目 logo 所在位置
        show: true                                 // 是否展示项目logo
    },
    projectVersion: 'V 0.0.1 DEV',
    projectName: 'HXUI Admin',                      // 项目名

    subject: '',                // 系统围绕的主业务名，  类似于 酒店，车检所之类的
    loginTitle: '登录管理后台',   // 登录页面标题
});

module.factory('globalValue',[function(){
    return {
        errorMsg: '服务器请求失败，暂无响应',
        isLogOpen: true,        // 全部控制台是否打印效果
        statusLog: false,       // 此处设置为true则会将每次页面跳转的state打印在浏览器的控制台中
        requestJsonLog: true,   // 此处设置为true则会在每次请求服务器的时候将请求内容打印在浏览器控制台中
        responseJsonLog: true,  // 此处设置为true则会在每次获取服务器响应的时候将响应内容打印在浏览器控制台中
        kindLists: null         // 分类列表
    }
}]);

