// var offer_company = this.offer_company;
// console.log("BBBBBBBBBB", offer_company);
// console.log("ORDER", window.offer_company);
$(function () {
    $('form.quick_order').ajaxForm(
        {
            type: 'post',
            data: {
                // offer_company: typeof window.offer_company !== 'undefined' ? window.offer_company : ''
            },
            beforeSubmit: function (formData, jqForm, options) {
                var formElement = jqForm[0];
                console.log("ORDER2", window.offer_company);
                this.data['offer_company'] = window.offer_company;
                $(formElement).find('.loader').addClass('loader--show');
                $(formElement).find('.errors').hide().remove();
            },
            success: function (responseText, statusText, xhr, $form) {
                if (responseText.success) {
                    $($form).hide().prev('.call_order_form_success').show();
                    if (responseText.auth) {
                        $('body').on('closemodal', function () {
                            location.href = '/accounts/order/' + responseText.order_id;
                        });
                    }
                    // setTimeout(function () {
                    //     //$.fancybox.close()
                    // }, 120000);
                } else if (responseText.error) {
                    var box = $('.box--err').empty();

                    grecaptcha.reset();

                    for (var key in responseText.fields) {
                        //$($form).find('.loader').removeClass('loader--show');
                        $($form).find('#id_' + key).addClass('err');
                        //$($form).find('box--err').append('<p class="errors text-orange">' + responseText.fields[key] + '</p>')
                        if (key == 'captcha') { box.show().append('<p>' + error_messages[key] + '</p>') } else {
                            box.show().append('<p>' + error_messages[key] + responseText.fields[key] + '</p>')
                        }
                    }
                } else {
                    console.log('Unexpected error')
                }
            }
        }
    );

    $('form#index_quick_order').ajaxForm(
        {
            type: 'post',
            data: {
                // offer_company: typeof window.offer_company !== 'undefined' ? window.offer_company : ''
            },
            beforeSubmit: function (formData, jqForm, options) {
                var formElement = jqForm[0];
                // $(formElement).find('.loader').addClass('loader--show');
                // $(formElement).find('.errors').hide().remove();
                $('.box--err').empty();
                var submit_button = $(formElement).find('button.request-btn');
                submit_button.attr('disabled', 'disabled');
                submit_button.addClass('btn--disabled');
                // this.data['offer_company'] = window.offer_company;
                // console.log("ORDER3", window.offer_company);
            },
            success: function (responseText, statusText, xhr, $form) {
                var submit_button = $($form).find('button.request-btn');
                submit_button.removeAttr('disabled');
                submit_button.removeClass('btn--disabled');

                if (responseText.success) {
                    openmodal('order_success');
                    if (responseText.auth) {
                        $('body').on('closemodal', function () {
                            location.href = '/accounts/order/' + responseText.order_id;
                        });
                    }
                    // setTimeout(function () {
                    //     //$.fancybox.close()
                    // }, 120000);
                } else if (responseText.error) {
                    var box = $('.box--err').empty();

                    grecaptcha.reset();

                    for (var key in responseText.fields) {
                        //$($form).find('.loader').removeClass('loader--show');
                        $($form).find('#id_' + key).addClass('err');
                        //$($form).find('box--err').append('<p class="errors text-orange">' + responseText.fields[key] + '</p>')
                        // if (key == 'captcha') { box.show().append('<p>' + error_messages[key] + '</p>') } else {
                        //     box.show().append('<p>' + error_messages[key] + responseText.fields[key] + '</p>')
                        // }
                    }
                } else {
                    console.log('Unexpected error')
                }
            }
        }
    );
});

function enableSubmit1() {
    var submit = $('form.quick_order').find('button[type="submit"]');
    submit.removeAttr('disabled');
    submit.removeClass('btn--disabled');
    submit.siblings('.help-text').slideUp('slow')
}

var error_messages = {
    captcha: "Вы не ввели капчу",
    email: "Поле \"E-mail\": ",
    name: "Поле \"Имя\": ",
    phone: "Поле \"Контактный телефон\": ",
    title: "Поле \"Название заказа\": ",
    description: "Поле \"Описание заказа\": "
}