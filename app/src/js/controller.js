/**
 * Created by LXHFIGHT on 2017/2/19 21:40.
 * Email: lxhfight51@outlook.com
 * Description:
 *  the main controller module
 */

let controller = angular.module('MainController', [
    'HXUIController',
    'LayoutController',
    'ListController',
    'CommonController',
    'ConfigController'
]);

let HXUIController = angular.module('HXUIController', []);
let layout = angular.module('LayoutController', []);
let list   = angular.module('ListController', []);
let common = angular.module('CommonController', []);
let config = angular.module('ConfigController', []);