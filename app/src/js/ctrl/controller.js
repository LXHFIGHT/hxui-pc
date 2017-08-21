/**
 * Created by LXHFIGHT on 2017/2/19 21:40.
 * Email: lxhfight51@outlook.com
 * Description:
 *  the main controller module
 */

var module = angular.module('MainController', ['LayoutController', 'ListController', 'CommonController', 'SystemController']);

var layout = angular.module('LayoutController', []);
var list = angular.module('ListController', []);
var common = angular.module('CommonController', []);
var system = angular.module('SystemController', []);