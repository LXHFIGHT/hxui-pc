/**
 * Created by LXHFIGHT on 2017/2/19 21:40.
 * Email: lxhfight51@outlook.com
 * Description:
 *  the main controller module
 */

var module = angular.module('MainController', ['LayoutController', 'UserController', 'SystemController']);

var layout = angular.module('LayoutController', []);
var user = angular.module('UserController', []);
var system = angular.module('SystemController', []);