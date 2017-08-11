/**
 * Created by lxhfight on 2017/7/17.
 * Email:
 * Description:
 *    角色管理value模块
 */

let factoriesModule = angular.module('factories');

factoriesModule.factory('authority', ['$rootScope', 'StorageHelper', ($rootScope, StorageHelper) => {
    return {
        ROLE_COMMON_USER: 0,            // 普通用户
        ROLE_SUPER_ADMIN: 100,          // 系统管理员
        /**
         * 判断当前用户是否为参数中的角色
         * @param userRole
         * @returns {boolean}
         */
        isRole: (userRole) => {
            if (userRole === '*') {
                return true;
            }
            let role =  parseInt(StorageHelper.getValue('role'));
            return (userRole === role);
        },
        /**
         * 判断当前用户角色是否输入参数中的角色集合中
         * @param userRoles
         * @returns {boolean}
         */
        withRole: (userRoles) => {
            if (userRoles === '*') {
               return true;
            }
            let arr = userRoles.split('|');
            let role = parseInt(StorageHelper.getValue('role'));
            for (let item of arr) {
                if (role === parseInt(item)) {
                    return true;
                }
            }
            return false;
        }
    }
}]);