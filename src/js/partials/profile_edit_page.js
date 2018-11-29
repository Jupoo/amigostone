//------------ СТРАНИЦА Личный кабинет - РЕДАКТИРОВАНИЕ ПРОФИЛЯ

$(document).ready( function() {
	//Показать скрытые чекбоксы при выборе Я поставщик
    $(document).on("change", ".js-checkshow-checkbox", function () {
        var el = $(this);
        var data_id = el.attr("data-id");
        var check_wrap = el.closest(".js-checkshow-wrap");
        var check_show = check_wrap.find(".js-checkshow-show");
        if(el.prop("checked") == true) {
            check_show.show(300, "linear", function() {});
            //Отписка от уведомлений
            if(data_id == "unsubscribe") {
                $('.js-check-notice').each(function(){
                    var check_notice_wrap = $(this);
                    var check_notice = check_notice_wrap.find(".pseudo-check__real");
                    check_notice.prop("disabled","disabled");
                    check_notice_wrap.addClass("pseudo-check--disabled")
                });
            }
        } else {
            check_show.hide(300, "linear", function() {});
            //Отписка от уведомлений
            if(data_id == "unsubscribe") {
                $('.js-check-notice').each(function(){
                    var check_notice_wrap = $(this);
                    var check_notice = check_notice_wrap.find(".pseudo-check__real");
                    check_notice.removeAttr("disabled");
                    check_notice_wrap.removeClass("pseudo-check--disabled")
                });
            }
        }
    });
});