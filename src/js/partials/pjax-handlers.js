/**
 * Created by user on 15.06.17.
 */
if ($('#item-search').length) {
    /*при клике на цвет чекать чекбокс и ставить галочку*/
    $(document).on('click', '.color', function () {
        var input = $(this).find('input');

        if (input.prop('checked')) {
            $(this).find('.state.active').hide();
        }
        else {
            $(this).find('.state.active').show();
        }
        input.prop('checked', !input.prop('checked'));
        input.trigger('change');
    });


    var $range = $("#range_price"),
        slider;

    /*функция отображения слайдера цены*/
    function show_range_slider() {
        $range.ionRangeSlider({
            type: 'double',
            step: 1000,
            force_edges: true,
            postfix: " р.",
            prettify: true,
            onChange: function (obj) {      // callback, вызывается при каждом изменении состояния
                //console.log(obj)
                $('input[name="min_price"]').val(obj.from);
                $('input[name="max_price"]').val(obj.to);

            },
            onUpdate: function (obj) {      // callback, вызывается при каждом изменении состояния
                //console.log(obj)
                $('input[name="min_price"]').val(obj.from);
                $('input[name="max_price"]').val(obj.to);

            },

            onFinish: function (obj) {      // callback, вызывается при каждом изменении состояния

                $('input[name="min_price"]').trigger('blur');
            }
        });

        slider = $range.data("ionRangeSlider");
    }

    $(document).on('keyup', 'input[name="min_price"],input[name="max_price"]', function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("blur");
        }
    });

    $(document).on('blur', 'input[name="min_price"],input[name="max_price"]', function () {

        //console.log(slider)
        slider.update({
            from: parseInt($('input[name="min_price"]').val()),
            to: parseInt($('input[name="max_price"]').val())
        });
        animate_flag = 1;
        $('[data-filter-form]').trigger('submit');
    });

    var animate_flag = 0;
    $(document).ready(function () {

        /*если js включен убираем кнопку сабмита формы*/
        // $('.left-menu form .btn-submit').hide();
        if ($('#range_price').length > 0) {
            show_range_slider()
        }
        /*Инициализируем pjax при клике на пагинацию*/
        $(document).pjax('.pagination a', '#item-search', {
            "push": true,
            "replace": false,
            "timeout": 5000,
            "scrollTo": false
        });

        /*Инициализируем pjax при клике на сортировку*/
        $(document).pjax('.sorting-cabinet a', '#item-search', {
            "push": true,
            "replace": false,
            "timeout": 5000,
            "scrollTo": false
        });

        /*Инициализируем pjax при клике на кнопки производителей*/
        $(document).pjax('.filter-top a', '#item-search', {
            "push": true,
            "replace": false,
            "timeout": 5000,
            "scrollTo": false
        })

        /*Инициализируем pjax при клике на меню навигации по каталогу*/
        //$(document).pjax('.nav_menu1 a', '#item-search',{"push":true,"replace":false,"timeout":5000,"scrollTo":0})
    });

    /*При клике на чекбоксы и выборе селектов сабмитим форму для pjax*/
    $(document).on('change', 'input[type=checkbox], [data-filter-form] select, .smart-search input[type=hidden]', function () {
        var ch = $(this);
        // console.log(ch.attr('name'));
        if (ch.attr('name') != 'want_copies') {
            $('[data-filter-form]').trigger('submit');
            animate_flag = 0;
        }

    });

    $(document).on('change', '[data-material-search] input', function () {
        $('[data-material-search]').trigger('submit');
        animate_flag = 0;
    });

    $(document).on('change', '[data-material-line] select', function () {
        $('[data-material-line]').trigger('submit');
        animate_flag = 0;
    });

    /*Если идет pjax запрос - выводим прелоадер*/
    $(document).on('pjax:send', function (xhr, options) {
        var t;
        var item_search = $('#item-search');
        var offset = item_search.offset();

        item_search.html('<div class="loading" ></div><br/><br/>');


        $("body, html").animate({
            scrollTop: offset.top - 145
        }, "500", "swing");
        // if (!animate_flag) {
        //     $("body, html").animate({
        //         scrollTop: offset.top - 120
        //     }, "500", "swing");
        //     console.log('scroll');
        // } else {
        //     clearTimeout(t);
        //     t = setTimeout(function () {
        //         $("body, html").animate({
        //             scrollTop: offset.top - 120
        //         }, "500", "swing")
        //         console.log('scroll')
        //     }, 2500);
        // }
    });

    /*После успешного pjax запроса - обновляем сортировки (обновляем get параметры урла)*/
    $(document).on('pjax:success', function (data, status, xhr, options) {
        $(document).fill_sorting_href();
    });


    /*Событие на сабмит формы pjax*/
    $(document).on('submit', "[data-filter-form]", function (event) {
        $.pjax.submit(event, '#item-search', {"push": true, "replace": false, "timeout": 5000, "scrollTo": false});
    });
    $(document).on('submit', '[data-material-search]', function (event) {
        $.pjax.submit(event, '#item-search', {"push": true, "replace": false, "timeout": 5000, "scrollTo": false});
    });
    $(document).on('submit', '[data-material-line]', function (event) {
        $.pjax.submit(event, '#item-search', {"push": true, "replace": false, "timeout": 5000, "scrollTo": false});
    });
}