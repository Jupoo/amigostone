$(document).ready( function() {
    //Проверяем подтвержал ли уже пользователь город
    if (!$.cookie('geoip_confirm')) {
        $('.geoip__confirm').show();
    }

    //Раскрываем поиск
    $(document).on("click", ".js-geoip-select", function () {
    	var el = $(this);
    	var search_wrap = el.closest(".js-geoip-wrap").find(".smart-search");
    	var el_id = el.attr("data-id");
    	var el_name = el.text();

    	search_wrap.find(".smart-search__search-input").prop("value","");
        search_wrap.find(".js-search-id").prop("value",el_id).change();
        search_wrap.find(".js-text-insert").text(el_name);
        search_wrap.find(".smart-search__search-text").addClass("filled");
    });

    //При клике "все верно" скрываем диалог и ставим куку на 14 дней
    $('.geoip__confirm a[data-value=yes]').on('click', function () {
        var confirm = $('.geoip__confirm');

        confirm.hide();
        $.cookie('geoip_confirm', '1', {expires: 14, path: '/'});
    });

});