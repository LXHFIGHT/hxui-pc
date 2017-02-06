/**
 * Created by LXHFIGHT on 15/12/26.
 */
/**
 * Created by LXHFIGHT on 15/11/26.
 * x_extend是一个类似于x_page一样的公共方法文件， 不够x_extend中存放的方法是对jQuery对象的扩展方法，
 * 即x_extend需要依赖jquery框架(1.8版本以上)
 */

(function($) {
    "use strict";

    //使用popTip需要引用这段样式或引用x_page.css
    /*   popTip() 方法弹出框及字体样式
     .xe-pad-tip{display: none;opacity: 0.9;width: 50%; height: auto; padding: 20px 20px;  z-index: 9999;position: absolute; left: 50%; top: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background: linear-gradient(top, #252626 0%, #3b3c3c 50%);background: -webkit-linear-gradient(top, #252626 0%, #3b3c3c 50%);background: -moz-linear-gradient(top, #252626 0%, #3b3c3c 50%);background: -o-linear-gradient(top, #252626 0%, #3b3c3c 50%);-webkit-border-radius: 6px;-moz-border-radius: 6px;border-radius: 6px;-webkit-box-shadow: 0 10px 25px #797979;-moz-box-shadow: 0 10px 25px #797979;box-shadow: 0 10px 25px #797979;}
     .xe-tip{color: #f8f8f8;text-shadow: 0 0 8px yellow;font-size: 16px;line-height: 24px;}
     */
    $.fn.popTip = function(){
        return this.each(function(){
            var time = 0;
            var interval = null;
            if( $(this).parents('body').children('.xe-pad-tip').length === 0){
                var $tipPad = $("<div class='xe-pad-tip'><span class='xe-tip'></span></div>");
                $tipPad.appendTo($(this).parents('body'));
            }
            $(this).bind('mouseenter', function(){
                var tip = $(this).attr('title');
                interval = setInterval(function(){
                    if(time < 300 ){
                        time += 100;
                    }else{
                        $('.xe-tip').html(tip);
                        $('.xe-pad-tip').fadeIn(300);
                    }
                }, 100);
            }).bind('mouseout', function(){
                clearInterval(interval);
                $('.xe-pad-tip').fadeOut(300);
                time = 0;
            });
        })
    };
    //使用addClearButton需要引用这段样式或引用x_page.css,需要引用font-awasome
    /*
     // 表单组件添加清空按钮组件样式
     .xe-pad-input{display: inline-block; position: relative; border-color: red;}
     .xe-clear-button{font-size: 14px; line-height: 20px; padding: 0; display:none; position: absolute;background-color: #ccc;color: white;right: 5px;z-index: 10000;border:none;top: 50%;height: 20px;width: 20px;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;-webkit-transform: translate(0, -50%);-moz-transform: translate(0, -50%);-ms-transform: translate(0, -50%);-o-transform: translate(0, -50%);transform: translate(0, -50%);}
     .xe-clear-button:hover{cursor: pointer;background-color: #bbb;color: #f2f2f2;}
     */
    $.fn.addClearButton = function(){
        return this.each(function(){
            var $inputer = $(this);
            var width = $(this)[0].offsetWidth;
            var parent = "<div class='xe-pad-input'/>";
            var $clearBtn = $("<button class='xe-clear-button' type='button'><span class='fa fa-times'></span></button>");
            // 为所选表单元素添加父类框更加方便管理
            $(this).wrap(parent);
            // 设置所选文本框占添加的父类框100%宽度
            $(this).parent().css('width', (width+'px'));
            $(this).css('width', '100%');
            // 为所选表单元素添加清空按钮
            $(this).after($clearBtn);

            $(this).bind('focus',function(){
                $clearBtn.fadeIn(300);
            }).bind('blur', function(){
                $clearBtn.fadeOut(300);
            });

            $clearBtn.bind('click', function(){
                $inputer.val('');
            });
        })
    };

    /**
     * 下拉菜单方法
     * options: 配置下拉菜单的方法
     *  mainButtonFunc: 主菜单方法
     * @returns {*}
     */
    $.fn.dropdownMenu = function(){
        return this.each(function(){
            var _this = $(this);
            var mainButton = _this.find('.btn-main'), padMenu = _this.find('ul').addClass('hide');
            // 绑定主按钮事件
            mainButton.click(function(){

            }).mouseover(function(){
                padMenu.removeClass('hide');
            }).mouseout(function(){
                padMenu.addClass('hide')  ;
            });
            padMenu.mouseover(function(){
                padMenu.removeClass('hide');
            }).mouseout(function(){
                padMenu.addClass('hide')  ;
            })
        })
    };

    //$.fn.pictureDetail = function(){
    //    return this.each(function(){
    //        var targetUrl = null;
    //        // 判断src属性或background-url是否为空
    //        if($(this)[0].tagName.toUpperCase() !== 'IMG'  ){
    //            if($(this).css('background-image') === null ||  $(this).css('background-image') === ""){
    //                console.log('绑定')
    //            }else{
    //
    //            }
    //        }else{
    //
    //        }
    //    });
    //};

    /**
     * 对可以滚动的组件进行高度自适应，进而取消滚动效果
     * 同时编辑的时候也会进行高度自适应
     */
    $.fn.adjustScrollHeight = function(){
        return this.each(function(){
            var height = $(this)[0].scrollHeight + 2;
            var resetedString = resetString($(this).html());
            $(this).html(resetedString);
            //console.log('-------------------'+resetedString);
            $(this).css('height', height + 'px');
            $(this).keyup(function(){
                var height = $(this)[0].scrollHeight + 2;
                $(this).css('height', height + 'px');
            }).change(function(){
                var height = $(this)[0].scrollHeight + 2;
                $(this).css('height', height + 'px');
            });
        })
    };

    /**
     * 将组件tab键操作改进为缩进而非切换至下一个组件
     */
    $.fn.tabInit = function(){
        return this.each(function(){
            $(this).keydown(function(event){
                //support tab on textarea
                if (event.keyCode == 9) { //tab was pressed
                    event.preventDefault();
                    console.log('Tab pressed');
                    var content = $(this).html();
                    content = content + '      ';
                    $(this).html(content);

                }
            });
        })
    };
    /**
     * 对齐
     */
    $.fn.alignWithOthers = function(selector){
        return this.each(function(){
            $(this).css('position', 'absolute');
            var left = $(selector)[0].offsetLeft;
            $(this).css('left',left+'px');
        })
    };


    /**
     * 通过元素属性注入数据以及设置样式 用于显示当前进度条
     *
     *  data 显示进度的相关数据
     *        data.percentage 进度
     *        data.max        最大值
     *  config
     *        config.radius   半径
     *        config.bgColor  背景颜色
     *        config.defaultColor 没有进度的颜色
     *        config.barColor 进度条颜色
     */
    // 对即将展示圆形进度条的div进行初始化

    //var i = null;   // i是动画中启用的计时器
    $.fn.showCircleProgressBar = function(){
        return this.each(function(){
            clearInterval(i);
            var data =   {   percentage: 60, max: 100   };
            var config = {   radius: 0, bgColor: 'white', defaultColor: '#ddd',  barColor: 'limegreen'  };
            var font =   {   fontColor: 'white', fontSize: '30px', needPercent: true};
            var canvas = $(this)[0];
            var context = canvas.getContext('2d');
            var radius = null;

            if( typeof $(this).attr('data-percentage') !== 'undefined'){
                data.percentage = $(this).attr('data-percentage');
            }else{
                alert('canvas必须设置 data-percentage 值以表示进度');
                return;
            }
            if( typeof $(this).attr('data-max') !== 'undefined'){
                data.max = $(this).attr('data-max');
            }
            if( typeof $(this).attr('data-radius') !== 'undefined'){
                config.radius = $(this).attr('data-radius');
                radius = config.radius;
            }else{
                alert('canvas必须设置 data-radius 值以表示图像半径');
                return;
            }
            if( typeof $(this).attr('data-bgcolor') !== 'undefined'){
                config.bgColor = $(this).attr('data-bgcolor');
            }
            if( typeof $(this).attr('data-defaultcolor') !== 'undefined' ){
                config.defaultColor = $(this).attr('data-defaultcolor');
            }
            if( typeof $(this).attr('data-barcolor') !== 'undefined' ){
                config.barColor = $(this).attr('data-barcolor');
            }
            // 如果该圆形进度条需要显示字体式
            if( typeof $(this).attr('data-needFont') !== 'undefined') {
                var parent = "<div class='pad-progress' style='position: relative'/>";
                $(this).wrap(parent);
                var node = "<strong class='msg' style='font-size: " + Math.floor(radius / 2) + "px;top:0; left: 0; color: black; position: absolute; z-index: 1000;" +
                    "height:" + (radius * 2) + "px; width:" + (radius * 2) + "px; text-align:center; line-height: " + (radius * 2) + "px' >1232</strong>";
                $(this).after($(node));
            }
            // 大圆
            context.beginPath();
            context.arc(
                radius, radius, radius, 0, 2 * Math.PI
            );
            context.fillStyle = config.defaultColor;
            context.fill();

            // 小圆
            context.beginPath();
            context.arc(
                radius, radius, radius * 0.9, 0, 2 * Math.PI
            );
            context.fillStyle = config.bgColor;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = radius / 10;
            context.shadowColor = '#aaa';
            context.fill();
            context.globalCompositeOperation = 'source-atop';

            var increase = 0;
            context.strokeStyle = config.barColor;
            context.lineWidth = config.radius * 0.2;
            context.shadowBlur = 0;
            var $view  = $(this).next();
            //$view.find('i').css('font-size', Math.floor(radius/3) + 'px');
            if(typeof $(this).attr('data-noanimate') === 'undefined'){
                var rate = (data.percentage / data.max * 100).toFixed(0);
                var i = setInterval(function(){
                    $view.html(increase+"<i style='font-size: " + Math.floor(radius/3) + "px'>%</i>");
                    context.beginPath();
                    console.log(increase);
                    context.arc(
                        radius, radius, radius, 1.5 * Math.PI , (1.5 + increase / rate  ) * Math.PI
                    );
                    context.stroke();
                    //$view.html(increase + '%');
                    increase++;
                    if(increase > rate){
                        clearInterval(i);
                    }
                }, 18);
            }else{
                $view.html((data.percentage / data.max * 100).toFixed(0) +"<i style='font-size: " + Math.floor(radius/3) + "px'>%</i>");
                context.beginPath();
                context.arc(radius, radius, radius, 1.5 * Math.PI , (data.percentage / data.max  * 2) * Math.PI);
                context.stroke();
            }
        })



    }

    /**
     * 通用表单数据验证初始化
     * @returns {*}
     */
    $.fn.xInitValidate = function(){
        return this.each(function(){
            $(this).focus(function(){
                if($(this).hasClass('error')){
                    $(this).removeClass('error');
                    $(this).val('');
                }
            });
        })
    };
    /**
     * 通用的表单数据验证方法
     */
    $.fn.xValidate = function(){
        var isGoodToSubmit = true;
        this.each(function(){
            var emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            var phoneReg = /^1[3, 5, 7, 8][0-9]{9}|^0[0-9]{2,3}\-[0-9]{7,8}$/;
            var qqReg = /[0-9]{4,}/;
            var type = $(this).attr('type');
            var value = $(this).val();
            $(this).focus(function(){
                if($(this).hasClass('error')){
                    $(this).removeClass('error');
                    $(this).val('');
                }
            });
            if( typeof($(this).attr('required')) !== 'undefined'){
                if(value === '' || value === null || $(this).hasClass('error')){
                    if(type !== 'password'){
                        $(this).addClass('error').val('该选项为必填项');
                    }else{
                        $(this).addClass('error');
                    }
                    isGoodToSubmit = false;
                }
            }
            // 主要验证 邮箱 电话以及QQ
            if(type === 'email'){
                if(!emailReg.test(value)){
                    $(this).addClass('error').val('电子邮件格式出错');
                    isGoodToSubmit = false;
                }
            }else if(type === 'tel'){
                if(!phoneReg.test(value)){
                    $(this).addClass('error').val('不符合中国大陆电话格式');
                    isGoodToSubmit = false;
                }
            }else if(type === 'qq'){
                if(!qqReg.test(value)){
                    $(this).addClass('error').val('不符合中国大陆电话格式');
                    isGoodToSubmit = false;
                }
            }
        });
        return isGoodToSubmit;
    };
    /**
     * xPop 是一个轻量级的弹出选择的jquery方法，
     * 前置： 引入jquery，可以引入angularJS v1.4.0或以前
     *       xpage.min.css或xpage.css
     *
     * 需要传入的参数有：
     * (xSelectItems, [isAngular], [state])
     *
     * main 包含所有参数的主对象
     *      selectItems 对象数组，包括以下参数
     *          text:   选项按钮上的文本内容
     *          classes:【数组】按钮的类，可以通过设置一个带有特定的样式的类进行绑定
     *          func:   点击触发的方法
     *
     */
    //$.fn.xpop = function(){
    //    return this.each(main){
    //        var top = $(this)[0].offsetTop + $(this)[0].offsetHeight;
    //        var left = $(this)[0].offsetLeft;
    //        alert(top +  "   " +  left);
    //        var nodes = "";
    //        // 判断该适用场景是否为AngularJS
    //        for(var i = 0; i < main.selectItems; i++){
    //            var classes = main.selectItems[i].classes.join(' ');
    //            var node = "<button class='" + classes + "'>" + main.selectItems[i].text + "</button>"
    //            nodes += (node + " ");
    //        }
    //        var $pad = {};
    //        $(this).bind('mouseover',function(){
    //             $pad = $("<div class='pad-xpop' style='top: " + top + "px; left:" + left + "px'>" +
    //                nodes + "</div>");
    //            $pad.appendTo("body").fadeIn(400);
    //        })
    //    }
    //}

}(jQuery));