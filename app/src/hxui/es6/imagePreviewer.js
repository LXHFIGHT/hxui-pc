/**
 * Created by lxhfight on 2018/1/4.
 * Email:   lxhfight1@gmail.com
 * Description: this is a loading modal
 *
 */
(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 查看预览大图方法
     * @param options
     * @param options.currentUrl 【必填】需要展示的图片URL
     * @param options.urls 【选填】供多图预览上下切换的图片URL集合
     * @param options.screen  【选填】支持 空， "left" 和 "right" 三个参数，分别表示全屏、左半屏和右半屏
     * @param options.maxium  【选填】支持的最大图片放大比例
     */
    const imagePreviewer = (options) => {
        let { currentUrl, urls, screen } = options;
        !screen || (screen = '');
        var index = 0;
        var imageUrls = urls ? [].concat(urls) : [currentUrl];
        let maxium = options ? (options.maxium || 2.5) : 2.5;
        var currentDegree = 0;
        var scale = 1.0;
        var mouseOffsetX = 0;   // 滑动图片其实X坐标值
        var mouseOffsetY = 0;   // 滑动图片其实Y坐标值
        var isDraging = false;  // 是否可以滑动
        var isMovable = false;  // 是否可以滑动
        //  隐藏图片预览组件
        var _hidePreviewer = function() {
            $('.hx-image-modal').removeClass('show');
            var timer = setTimeout(function() {
                $('.hx-image-modal').remove();
                clearTimeout(timer);
            }, 400);
        };
        //  调整比例大小
        var _adjustScale = function(isPlus) {
            if (isPlus) {
                if (scale < maxium) {
                    scale += 0.5;
                }
                else {
                    popTipInfoQuick('不能再放大了');
                }
            } else {
                if (scale > 1.0) {
                    scale -= 0.5;
                }
                else {
                    popTipInfoQuick('不能再缩小了');
                }
            }
            _judgeIsMovable();
            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText();
        };
        //  处理transform样式代码方法
        var _transformText = function(isReset) {
            if (isReset) {
                return 'translate(-50%, -50%)';
            } else {
                return 'translate(-50%, -50%) rotate(' + currentDegree + 'deg) scale(' + scale + ', ' + scale + ')';
            }
        };
        //  判断是否可移动
        var _judgeIsMovable = function() {
            var $img = document.getElementsByClassName('modal-image-preview')[0],
                $modal = document.getElementsByClassName('hx-image-modal')[0];
            var imgHeight = $img.offsetHeight * scale;
            var imgWidth = $img.offsetWidth * scale;
            var modalHeight = $modal.offsetHeight;
            var modalWidth = $modal.offsetWidth;
            if (imgHeight > modalHeight || imgWidth > modalWidth) {
                isMovable = true;
                $img.setAttribute('class', 'modal-image-preview movable');
            } else {
                isMovable = false;
                $img.setAttribute('class', 'modal-image-preview');
                $img.style.top = '50%';
                $img.style.left = '50%';
            }
            imageUrls.length !== 1 && ($('.hx-image-modal').find('.title').text((index + 1) + ' / ' + imageUrls.length));
        };
        var _reset = function() {
            var $img = document.getElementsByClassName('modal-image-preview')[0];
            scale = 1.0;
            currentDegree = 0;
            $img.style.top = '50%';
            $img.style.left = '50%';
            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
            _judgeIsMovable();
        };
        /**
         * 旋转图片方法
         * @param isRotateRight 是否顺时针
         */
        var _rotate = function(isRotateRight) {
            var imgElem = document.getElementsByClassName('modal-image-preview')[0];
            isRotateRight ? (currentDegree += 90) : (currentDegree -= 90);
            imgElem.style.transform = _transformText();
            imgElem.style.top = '50%';
            imgElem.style.left = '50%';
        };
        var _initComponent = function() {
            for (var i = 0; i < imageUrls.length; i++ ) {
                if (currentUrl === imageUrls[i]) {
                    index = i;
                    break;
                }
            }
            var timer = setTimeout(function() {
                var $btnLast = $('.btn-to-last'), $btnNext = $('.btn-to-next');
                var $modal = $('.hx-image-modal');
                $modal.addClass('show');
                _judgeIsMovable();
                $btnLast.unbind().bind('click', function(){
                    if (index === 0) {
                        popTipWarningQuick('没有上一张了');
                        return;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
                        }
                        index--;
                        $('.modal-image-preview').attr('src', imageUrls[index]);
                        $('.btn-download').attr('src', imageUrls[index]);
                        _reset();
                    }
                });
                $btnNext.unbind().bind('click', function(){
                    if ( index === imageUrls.length - 1 ) {
                        popTipWarningQuick('没有下一张了');
                        return;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = _transformText(true);
                        }
                        index++;
                        $('.modal-image-preview').attr('src', imageUrls[index]);
                        $('.btn-download').attr('src', imageUrls[index]);
                        _reset();
                    }
                });
                if (imageUrls.length === 1) {
                    $btnLast.addClass('hidden');
                    $btnNext.addClass('hidden');
                }
                clearTimeout(timer);
            }, 100);
        };
        _initComponent();
        let node =  `<div class='hx-image-modal hx-modal ${screen}'>
                        <header class='navbar'>
                            <span class='title'></span>
                            <button class='btn-quit-preview'></button>
                        </header>
                        <img class='modal-image-preview' ondragstart='return false;' src='${currentUrl}' alt='image' />
                        <button class='btn-to-last hide-sm fa fa-angle-left'></button>
                        <button class='btn-to-next hide-sm fa fa-angle-right'></button>
                        <div class='pad-functions'>
                            <button class='btn-to-last hide-md hide-bg fa fa-angle-left'></button>
                            <button class='btn-search-plus fa fa-search-plus'></button>
                            <button class='btn-search-minus fa fa-search-minus'></button>
                            <button class='btn-rotate-left fa fa-undo'></button>
                            <button class='btn-rotate-right fa fa-repeat'></button>
                            <a class='btn-download fa fa-download' href='${currentUrl}' download='图片预览效果.jpg'></a>
                            <button class='btn-to-next hide-md hide-bg fa fa-angle-right'></button>
                        </div>
                    </div>`;
        $(node).appendTo('body');
        $('body')
            .on('click', '.btn-rotate-left', function() {
                _rotate();
            })
            .on('click', '.btn-rotate-right', function() {
                _rotate(true);
            })
            .on('click', '.btn-search-plus', function(){
                _adjustScale(true);
            })
            .on('click', '.btn-search-minus', function(){
                _adjustScale(false);
            })
            .on('click', '.hx-image-modal', function(){
                var className = event.target.getAttribute('class');
                if(className.indexOf('hx-image-modal') !== -1) {
                    _hidePreviewer();
                }
            })
            .on('touchstart', '.modal-image-preview.movable', function(event) {
                var e = event || window.event;
                var pageX = e.originalEvent.changedTouches[0].pageX;
                var pageY = e.originalEvent.changedTouches[0].pageY;
                mouseOffsetX = pageX - $(this)[0].offsetLeft;
                mouseOffsetY = pageY - $(this)[0].offsetTop;
                isDraging = true;
            })
            .on('mousedown', '.modal-image-preview.movable', function(event) {
                var e = event || window.event;
                var pageX = e.pageX || e.originalEvent.pageX;
                var pageY = e.pageY || e.originalEvent.pageY;
                mouseOffsetX = pageX - $(this)[0].offsetLeft;
                mouseOffsetY = pageY - $(this)[0].offsetTop;
                isDraging = true;
            })
            .on('mousemove', '.modal-image-preview.movable', function(event) {
                var e = event || window.event;
                var mouseX = e.pageX;
                var mouseY = e.pageY;
                var moveX = 0;
                var moveY = 0;
                if (isDraging === true) {
                    moveX = mouseX - mouseOffsetX;
                    moveY = mouseY - mouseOffsetY;
                    $(this).css('left', moveX);
                    $(this).css('top', moveY);
                }
            })
            .on('touchmove', '.modal-image-preview.movable', function(event) {
                var e = event || window.event;
                var mouseX = e.originalEvent.changedTouches[0].pageX;
                var mouseY = e.originalEvent.changedTouches[0].pageY;
                var moveX = 0;
                var moveY = 0;
                if (isMovable === true) {
                    moveX = mouseX - mouseOffsetX;
                    moveY = mouseY - mouseOffsetY;
                    $(this).css('left', moveX);
                    $(this).css('top', moveY);
                }
                console.log('On touch move is draging: ', isDraging);
                console.log('On touch move: ', moveX, moveY);
                console.log('On touch move: ', mouseOffsetX, mouseOffsetX);
            })
            .on('click', '.btn-quit-preview', function() {
                _hidePreviewer();
            });
        window.addEventListener('mouseup', () => {
            isDraging = false;
        });
    };

    const hidePreviewImage = () => {
        $('.hx-image-modal').removeClass('show');
        const timer = setTimeout(() => {
            $('.hx-image-modal').remove();
            clearTimeout(timer);
        }, 400);
    };

    window.HXUI = Object.assign(window.HXUI, { imagePreviewer, hidePreviewImage });
}(jQuery, window));