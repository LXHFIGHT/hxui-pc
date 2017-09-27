/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      This is the front-page of hxui.lxhfight.com
 */

let HomeCtrl = angular.module('HXUIController');

HomeCtrl.controller('HomeCtrl', ['$scope', ($scope) => {
    $scope._init = {
        wave: () => {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = document.body.clientHeight;
            //如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
            window.requestAnimFrame = (function(){
                return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            // 波浪大小
            var boHeight = canvas.height / 20;
            var posHeight = canvas.height / 1.1;
            //初始角度为0
            var step = 0;
            //定义三条不同波浪的颜色
            var lines = [
                "rgba(0,222,255, 0.2)",
                "rgba(157,192,249, 0.2)",
                "rgba(0,168,255, 0.2)"
            ];
            function loop(){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                step++;
                //画3个不同颜色的矩形
                for(var j = lines.length - 1; j >= 0; j--) {
                    ctx.fillStyle = lines[j];
                    //每个矩形的角度都不同，每个之间相差45度
                    var angle = (step+j*50)*Math.PI/180;
                    var deltaHeight   = Math.sin(angle) * boHeight;
                    var deltaHeightRight  = Math.cos(angle) * boHeight;
                    ctx.beginPath();
                    ctx.moveTo(0, posHeight+deltaHeight);
                    ctx.bezierCurveTo(
                        canvas.width / 2,
                        posHeight+deltaHeight-boHeight,
                        canvas.width / 2,
                        posHeight+deltaHeightRight-boHeight,
                        canvas.width,
                        posHeight+deltaHeightRight
                    );
                    ctx.lineTo(canvas.width, canvas.height);
                    ctx.lineTo(0, canvas.height);
                    ctx.lineTo(0, posHeight+deltaHeight);
                    ctx.closePath();
                    ctx.fill();
                }
                requestAnimFrame(loop);
            }
            loop();
        }
    }


    $scope.init = function(){
        $scope._init.wave();
    }();

}]);

