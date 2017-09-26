/**
 * Created by lxhfight on 2017/9/25.
 * Email:
 * Description:
 *      a very smart and strong validator for any form element
 */
(function($, window){
    window.HXUI = window.HXUI || {};

    /**
     * 智能判断表单组件是否为必填或者银行卡
     * @param query 需要限制的组件选择字符串
     *
     * 规则：
     *    required                      必填项
     *    data-type="bank_number"       银行卡号  16位或19位数字
     *    data-type="number"
     * @returns { boolean } true为正常
     */
    let smartValidate = (query) => {
        const RESULT_REQUIRED_ISSUE = 1;
        const RESULT_BANK_NUMBER_ISSUE = 2;
        const RESULT_NUMBER_ISSUE = 3;

        let components =  $(query ? (query + ' [required]') : '[required]');
        let bankNumbers = $(query ? (query + ' [data-type="bank_number"]') : '[data-type="bank_number"]');
        let numbers = $(query ? (query + ' [data-type="number"]') : '[data-type="number"]');
        let result = true;
        let $view = null;
        let numberExp = /^[0-9]*$/;

        components.unbind('focus').focus(function(){
            $(this).removeClass('error');
        });

        // 非空验证
        for(let i = 0; i < components.length; i++) {
            $view = $(components[i]);
            if (!$view.val()) {
                result = RESULT_REQUIRED_ISSUE;
                $view.addClass('error');
            }
        }

        // 银行卡验证
        for (let i = 0; i < bankNumbers.length; i++) {
            $view = $(bankNumbers[i]);
            let val = $(bankNumbers[i]).val();
            if (isNaN(val)) {
                result = RESULT_BANK_NUMBER_ISSUE;
                $view.addClass('error');
            } else {
                if (val.length !== 16 && val.length !== 19 ) {
                    result = RESULT_BANK_NUMBER_ISSUE;
                    $view.addClass('error');
                }
            }
        }

        // 数字验证
        for (let i = 0; i < numbers.length; i++) {
            $view = $(numbers[i]);
            let val = $(bankNumbers[i]).val();
            if (!numberExp.test(val)) {
                result = RESULT_NUMBER_ISSUE;
                $view.addClass('error');
            }
        }

        switch (result) {
            case RESULT_REQUIRED_ISSUE: popTipWarningQuick('请完善所有信息'); break;
            case RESULT_BANK_NUMBER_ISSUE: popTipWarningQuick('银行卡号要求16位或19位数字'); break;
            case RESULT_NUMBER_ISSUE: popTipWarningQuick('请填写数字'); break;
            default: break;
        }

        if (typeof result === 'number') {
            return false;
        }
        return true;
    };

    window.HXUI = Object.assign(window.HXUI, { smartValidate });

}(jQuery, window));
