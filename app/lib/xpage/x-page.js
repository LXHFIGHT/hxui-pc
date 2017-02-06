/**
 * Created by LXHFIGHT on 15/12/27.
 */


function deleteItem(array, item){
    var i = 0;
    for(i = 0; i < array.length; i++){
        if(array[i] === item){
            array.splice(i, 1);
        }
    }
}

String.prototype.resetString = String.prototype.resetString || function(){
    var msg = this.replace(/&quot;/g, '\"')
        .replace(/&nbsp;/g, ' ')
        .replace(/&rsquo;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&le;/g, '≤')
        .replace(/&ge;/g, '≥');
    return msg;
};
function resetString(msg){
    var string = msg.replace([/&quot;/g, /&nbsp;/g, /&rsquo;/g, /&lt;/g, /&gt;/g, /&le;/g, /&ge;/g],
                                ["\"", " ", "\'", "<", ">", "≤", "≥"]);
    return string;
}

/**
 * 弹出确定框 0.1.2
 * @param msg  弹出消息, 支持传入HTML
 * @param confirmEvent 点击确定键触发事件， 不需要使弹出框消失，该方法中已带有
 * 前置： 引入Bootstrap.css, Bootstrap.js 和 jquery.js
 */
function confirmModel(msg, confirmEvent) {
    $('#confirmModal button#btn_confirm').unbind('click');
    <!-- 点击删除按钮后跳出的选择模态框-->
    if ($('.confirmModal').length > 0) {
        $('#confirmModal .text-message').html(msg);
        $('#confirmModal').modal('show');
    } else {
        var node = "<div id='confirmModal' class='confirmModal modal fade bs-example-modal-sm' tabindex='-1'  role='dialog' aria-labelledby='mySmallModalLabel'>" +
            "<div class='modal-dialog modal-sm'>" +
            "<div class='modal-content' style='height: 200px'>" +
            "<div class='x_row_no_padding' style='height:150px'>" +
            "<div class='text-message' style='position: relative; width: 100%; text-align:center; top: 60px; height: 30px; line-height: 30px; display: inline-block'>" +
            msg +
            "</div>" +
            "</div>" +
            "<div class='x_row'>" +
            "<button class='btn btn-default ' style='float:right; margin-right: 10px' data-dismiss='modal'>取消</button>" +
            "<button class='btn btn-success ' style='float:right; margin-right: 10px' id='btn_confirm' >确定</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $('body').append($(node));
        $('#confirmModal').modal('show');
        $('#confirmModal button[data-dismiss]').click(function () {
            $('#deleteModal').modal('hide');
        })
    }
    $('#confirmModal button#btn_confirm').click(function () {
        confirmEvent();
        $('#confirmModal').modal('hide');

    })
}

/**
 * 轻量级的弹出框提示
 * @param msg   消息内容
 * @param level 等级 1：通知， 2: 警告， 3：错误
 */
var timeout = null;
function showTipLight(msg, level, second){
    clearTimeout(timeout);
    var decoration = {bgColor: null, fontColor: null    };
    if(level === 1){    decoration.bgColor = '#2dd307';decoration.fontColor = 'white'   }
    else if(level === 2){    decoration.bgColor = '#fbad07';decoration.fontColor = 'white'  }
    else if(level === 3){    decoration.bgColor = '#f53631';decoration.fontColor = 'white'  }
    else    {   decoration.bgColor = "#888"; decoration.fontColor = '#f2f2f2'}
    if($('.pad-poptip').length !== 0){
        $('.pad-poptip').css({'background-color':decoration.bgColor, 'color':decoration.fontColor}).html(msg).slideDown(500);
    }else{
        var node = "<div class='x-center-horizontal pad-poptip'  style='position: absolute; padding: 0 10px; display: none; text-align: center;" +
            "background-color: " + decoration.bgColor +";color:" + decoration.fontColor + ";  font-size:16px; " +
            " max-width: 80%; top: 0; margin: 0 auto; line-height:60px;  height:60px; z-index: 10000; position: absolute'>" + msg + "</div>";
        $(node).appendTo("body").slideDown(500);
    }
    timeout = setTimeout("$('.pad-poptip').fadeOut(500)", second);
}
//  通知级别的弹出提示
function popTipInfo(msg)        {   showTipLight(msg, 1, 3000);      }
function popTipInfoQuick(msg)   {   showTipLight(msg, 1, 1500);      }
//  警告级别的弹出提示
function popTipWarning(msg) {   showTipLight(msg, 2, 3000);          }
function popTipWarningQuick(msg) {   showTipLight(msg, 2, 1500);     }
//  错误级别的弹出提示
function popTipError(msg)   {   showTipLight(msg, 3, 3000);          }
function popTipErrorQuick(msg)   {   showTipLight(msg, 3, 1500);     }
//  随便的弹出提示
function popTipNormal(msg)  {   showTipLight(msg, -1,3000);          }
function popTipNormalQuick(msg)  {   showTipLight(msg, -1,1500);     }

/**
 * 弹出对话框按钮方法
 * @param options 需要参数
 * @param options.title                 弹出框标题
 * @param options.content               弹出框内容
 * @param options.buttons[]             弹出框按钮集合信息
 * @param options.buttons[].text        弹出框按钮集合文本
 * @param options.buttons[].style       弹出框按钮集合样式
 * @param options.buttons[].callback    弹出框按钮回调方法
 */
var showDialog = function(options){
    //var title = options.title || '确认';
    //var content = options.content || '';
    //var buttons = '';
    //var i = 0;
    //for (i = 0; i < options.buttons.length; i++) {
    //    buttons += "<button class='hx-button button-" + i + "' style='" + options.buttons[i].style + "'>" + options.buttons[i].text + "</button>";
    //}
    //var node =
    //    "<div class='x-center-horizontal x-confirm-model'>" +
    //    "   <header>" + title + "</header>" +
    //    "   <div class='content'>" + content + "</div>"+
    //    "   <footer>" +  buttons + "</footer>" +
    //    "</div>";
    //$(node).appendTo("body").fadeIn(500);
    //for (i = 0; i < options.buttons.length; i++) {
    //    var button = options.buttons[i];
    //    document.getElementsByClassName("button-" + index)[0].addEventListener('click', function(e){
    //        button.callback(e);
    //    });
    //}
};
