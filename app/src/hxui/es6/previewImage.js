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
     */
    const previewImage = (options) => {
        let index = 0;
        const screen = options.screen || '';
        let currentUrl = options.currentUrl || '';
        let urls = options.urls || [options.currentUrl];
        let currentDegree = 0;
        if (typeof urls !== 'undefined' && Object.prototype.toString.call(urls) === '[object Array]') {
            for (let i = 0; i < urls.length; i++ ) {
                if (currentUrl === urls[i]) {
                    index = i;
                    break;
                }
            }
        }
        if ($('.hx-image-modal').length !== 0) {
            $('.hx-image-modal').attr('class', 'hx-image-modal show');
            $('.hx-image-modal').addClass(screen);
            $('.hx-image-modal img').attr('src', currentUrl);
            $('.btn-to-last').unbind().bind('click', function(){
                if (index === 0) {
                    popTipWarningQuick('没有上一张了');
                    return;
                } else {
                    if (currentDegree !== 0) {
                        currentDegree = 0;
                        document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                    }
                    index--;
                    $('.modal-image-preview').attr('src', urls[index]);
                }
            });
            $('.btn-to-next').unbind().bind('click', function(){
                if ( index === urls.length - 1 ) {
                    popTipWarningQuick('没有下一张了');
                    return;
                } else {
                    if (currentDegree !== 0) {
                        currentDegree = 0;
                        document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                    }
                    index++;
                    $('.modal-image-preview').attr('src', urls[index]);
                }
            });
        } else {
            const node = `<div class='hx-image-modal ${screen}'>
                             <img class='modal-image-preview' src='${currentUrl}' alt='image' />
                             <button class='btn-to-last fa fa-angle-left'></button>
                             <button class='btn-to-next fa fa-angle-right'></button>
                             <button class='btn-quit-preview fa fa-times-circle-o'></button>
                             <div class='pad-rotate'>
                                 <button class='btn-rotate-left fa fa-undo'></button>
                                 <button class='btn-rotate-right fa fa-repeat'></button>
                             </div>
                          </div>`;
            $(node).appendTo('body');
            let timer = setTimeout(function() {
                $('.hx-image-modal').addClass('show');
                $('.btn-to-last').unbind().bind('click', function(){
                    if (index === 0) {
                        popTipWarningQuick('没有上一张了');
                        return null;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                        }
                        index--;
                        $('.modal-image-preview').attr('src', urls[index]);
                    }
                });
                $('.btn-to-next').unbind().bind('click', function(){
                    if ( index === urls.length - 1 ) {
                        popTipWarningQuick('没有下一张了');
                        return null;
                    } else {
                        if (currentDegree !== 0) {
                            currentDegree = 0;
                            document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                        }
                        index++;
                        $('.modal-image-preview').attr('src', urls[index]);
                    }
                });
                $('.btn-rotate-left').unbind().bind('click', function () {
                    currentDegree = (currentDegree - 90);
                    document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                });
                $('.btn-rotate-right').unbind().bind('click', function () {
                    currentDegree = (currentDegree + 90);
                    document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                });
                clearTimeout(timer);
            }, 100);
        }
        $('body')
            .on('click', '.hx-image-modal', function(){
                var className = event.target.getAttribute('class');
                if(className.indexOf('hx-image-modal') !== -1) {
                    $('.hx-image-modal').removeClass('show');
                    if (currentDegree !== 0) {
                        currentDegree = 0;
                        document.getElementsByClassName('modal-image-preview')[0].style.transform = 'translate(-50%, -50%) ' + 'rotate(' + currentDegree + 'deg)';
                    }
                }
            })
            .on('click', '.btn-quit-preview', function() {
                $('.hx-image-modal').removeClass('show');
            });
    };

    const hidePreviewImage = () => {
        $('.hx-image-modal').removeClass('show');
    };

    window.HXUI = Object.assign(window.HXUI, { previewImage, hidePreviewImage });
}(jQuery, window));