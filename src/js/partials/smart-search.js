$(document).ready( function() {
    if ($(".js-search-id").length) {
         $('.js-search-id').each(function () {
             var el = $(this);
             var wrap = el.closest(".smart-search__search");
             var text_wrap = wrap.find(".smart-search__search-text");

             if(el.val() != "") {
                 text_wrap.append("<div class='smart-search__search-icon smart-search--search-close icon--close js-search-close'></div>");
             }
         });
    }

    $(document).on("click", ".js-search-close", function () {
        var btn_close = $(this);
        var wrap = btn_close.closest(".smart-search");
        var text = wrap.find(".js-text-insert");
        var def_text = text.attr("data-default-text");
        var input_id = wrap.find(".js-search-id");

        text.text(def_text);
        input_id.val("");
        btn_close.remove();

        return false;
    });

    //ПОИСК
	//Клик вне поиска
    if ($(".smart-search").length) {
        $(document).click(function (e) {
            if ($(e.target).closest(".smart-search__search").length) {
                return;
            }
            else {
                $(".smart-search__search-result").removeClass("block");
                $(".smart-search__search-wrap").removeClass("block");
            }
            e.stopPropagation();
        });
    }

    //Раскрываем поиск
    $(document).on("click", ".smart-search__search-text", function () {
    	var el = $(this);
    	var wrap = el.closest(".smart-search");

    	$(".smart-search__search-wrap").removeClass("block");

        wrap.find(".smart-search__search-wrap").addClass("block");
        wrap.find(".smart-search__search-input").click();
        wrap.find(".smart-search__search-input").focus();
    });

    //Поиск по элементам
    $(document).on("propertychange input click", ".smart-search__search-input", function () {
        var input_el = $(this);

        if(input_el.hasClass("process")) {
            return false;
        } else {
            input_el.addClass("process");

            var el_wrap = input_el.closest('.smart-search');
            var el_res = el_wrap.find(".smart-search__search-result");
            var el_wrap_id = el_wrap.attr("data-id");

            el_res.addClass("block");
            var search_val = input_el.val().toLowerCase();
            //search_val = search_val.replace(/^\s*/, '').replace(/\s*$/, '');//Удаляем пробелы в начале и конце строки

            var ajax_search = 'no';

            //ЕСЛИ AJAX
            //Формирование аякс-запроса для вывода списка элементов
            if(el_wrap.find(".js-ajax").length > 0) {
				//проверяем предыдущий поисковый запрос
                var last_search = el_wrap.find(".js-ajax").text();
                if(last_search != '') {
                    if (search_val.indexOf(last_search) == 0) {
                        //выборка по уже выбранным категориям
                        ajax_search = 'no';
                    }
                    else {
                        //аякс запрос
                        ajax_search = 'yes';
                    }
                }
                else {
                    //выборка по уже выбранным категориям
                    ajax_search = 'no';
                }

                //Если ничего не выбрано ранее, то делаем аякс-запрос
                if(ajax_search == 'yes') {
                    var ajax_url = el_wrap.attr("data-ajax-url");
                    $.get(ajax_url, { startswith: search_val.substring(0, 1) }, function (data) {
                        if(data.items) {
                            var data_res = "";
                            data_res = data_res + '<ul>';
                            for (var i = 0; i < data.items.length; i++) {
                                for (var j = 0; j < data.items[i]["children"].length; j++) {
                                    data_res = data_res + '<li class="smart-search__item active ininput" data-id="' + data.items[i]["children"][j]["id"] + '">' + data.items[i]["children"][j]["text"] + ', ' + data.items[i]["text"] + '</li>';
                                }
                            }
                            data_res = data_res + '<li class="smart-search__item smart-search--item-empty">Результатов не найдено</li>';
                            data_res = data_res + '</ul>';
                            el_wrap.find(".smart-search__search-result").html(data_res);

                            var all_hidden = 'yes';
                            el_wrap.find('.smart-search__item').each(function () {
                                var each_el = $(this);
                                //var cat_text = each_el.text().toLowerCase().replace(/^\s*/, '').replace(/\s*$/, '');
                                var cat_text = each_el.text().toLowerCase();
                                if (cat_text.indexOf(search_val) == 0) {
                                    each_el.removeClass('hidden');
                                    all_hidden = 'no';
                                }
                                else {
                                    each_el.addClass('hidden');
                                }
                                if (all_hidden == 'yes') {
                                    el_wrap.find(".smart-search--item-empty").removeClass('hidden');
                                }
                                else {
                                    el_wrap.find(".smart-search--item-empty").addClass('hidden');
                                }
                            });
                            el_wrap.find(".js-ajax").text(search_val.substring(0, 1));
                        }
                        if(search_val=="") {
                            el_wrap.find(".js-ajax").text('no empty');
                            el_wrap.find(".smart-search__search-result").html("");
                        }

                        //Расставляем классы для элементов в списке (делаем неактивными те, что уже выбраны)
                        //Множественный выбор
                        if (el_wrap.find(".smart-search__selected-list").length > 0) {
                            var arrElements = [];
                            var count = 0;
                            el_wrap.find(".smart-search__selected-wrap").each(function () {
                                var each_el = $(this);
                                var el_id = each_el.attr("data-id");
                                arrElements[count] = el_id;
                                count++;
                            });
                            //делаем активной выборку, если элемент еще не выбран
                            el_wrap.find('.smart-search__item').each(function () {
                                var each_el = $(this);
                                if(!each_el.hasClass("smart-search--item-empty")) {
                                    var el_search_id = each_el.attr('data-id');
                                    if ($.inArray(el_search_id, arrElements) == -1) {
                                        each_el.addClass('active');
                                    }
                                    else {
                                        each_el.removeClass('active');
                                    }
                                }
                            });
                        }
                        //Выбор одного значения
                        else {
                            var arrElements = [];
                            arrElements[0] = el_wrap.find(".js-search-id").val();
                            el_wrap.find('.smart-search__item').each(function () {
                                var each_el = $(this);
                                if(!each_el.hasClass("smart-search--item-empty")) {
                                    var el_search_id = each_el.attr('data-id');
                                    if ($.inArray(el_search_id, arrElements) == -1) {
                                        each_el.addClass('active');
                                    }
                                    else {
                                        each_el.removeClass('active');
                                    }
                                }
                            });
                        }

                        input_el.removeClass("process");
                        if(search_val != input_el.val().toLowerCase()) {
                            input_el.click();
                        }
                    },"json");
                }
            }

            //Если продолжаем выборку из уже выбранного ранее
            if (search_val != '' && ajax_search == 'no') {
                var all_hidden = 'yes';
                el_wrap.find('.smart-search__item').each(function () {
                	var each_el = $(this);
                    //var cat_text = $(this).text().toLowerCase().replace(/^\s*/, '').replace(/\s*$/, '');
                    var cat_text = each_el.text().toLowerCase();

                    //Если это город
                    if(el_wrap_id == "city") {
                        cat_text = cat_text.split(',');
                        cat_text = cat_text[0];
                    }

                    if (cat_text.indexOf(search_val) !=-1) {
                        each_el.removeClass('hidden');
                        all_hidden = 'no';
                    }
                    else {
                        each_el.addClass('hidden');
                    }

                    if (all_hidden == 'yes') {
                        el_wrap.find(".smart-search--item-empty").removeClass('hidden');
                    }
                    else {
                        el_wrap.find(".smart-search--item-empty").addClass('hidden');
                    }
                });
            }

            //если запрос пустой
            if(search_val == '' && ajax_search == 'no') {
                el_wrap.find('.smart-search__item').each(function () {
                	var each_el = $(this);
                    each_el.removeClass('hidden');
                });
                el_wrap.find(".smart-search--item-empty").addClass('hidden');
                el_wrap.find(".js-ajax").text('no empty');
            }

            if(ajax_search == 'no') {
                //Расставляем классы для элементов в списке (делаем неактивными те, что уже выбраны)
                //Множественный выбор
                if (el_wrap.find(".smart-search__selected-list").length > 0) {
                    var arrElements = [];
                    var count = 0;
                    el_wrap.find(".smart-search__selected-wrap").each(function () {
                    	var each_el = $(this);
                        var el_id = each_el.attr("data-id");
                        arrElements[count] = el_id;
                        count++;
                    });
                    //делаем активной выборку, если элемент еще не выбран
                    el_wrap.find('.smart-search__item').each(function () {
                    	var each_el = $(this);
                    	if(!each_el.hasClass("smart-search--item-empty")) {
                    	    var el_search_id = each_el.attr('data-id');
                            if ($.inArray(el_search_id, arrElements) == -1) {
                                each_el.addClass('active');
                            }
                            else {
                                each_el.removeClass('active');
                            }
                        }
                    });
                }
                //Выбор одного значения
                else {
                    var arrElements = [];
                    arrElements[0] = el_wrap.find(".js-search-id").val();
                    el_wrap.find('.smart-search__item').each(function () {
                    	var each_el = $(this);
                    	if(!each_el.hasClass("smart-search--item-empty")) {
                            var el_search_id = each_el.attr('data-id');
                            if ($.inArray(el_search_id, arrElements) == -1) {
                                each_el.addClass('active');
                            }
                            else {
                                each_el.removeClass('active');
                            }
                        }
                    });
                }

                input_el.removeClass("process");
                if(search_val != input_el.val().toLowerCase()) {
                    input_el.click();
                }
            }
        }
    });

    //Выборка элемента из поиска
    $(document).on("click", ".smart-search__item.active.ininput", function () {
        var el = $(this);
    	var el_wrap = el.closest('.smart-search');
    	var id_wrap = el_wrap.attr("data-id");
        var el_name = el.text();
        var el_id = el.attr('data-id');

        //Если это город
        if(id_wrap == "city") {
            el_name = el_name.split(',');
            el_name = el_name[0];
        }

        el_wrap.find(".smart-search__search-input").prop("value","");
        el_wrap.find(".js-search-id").prop("value",el_id).change();
        el_wrap.find(".js-text-insert").text(el_name);
        el_wrap.find(".smart-search__search-text").append("<div class='smart-search__search-icon smart-search--search-close icon--close js-search-close'></div>");

        if(el_wrap.find(".js-ajax").length > 0)
            el_wrap.find(".smart-search__search-result").html("").removeClass("block");
        else
            el_wrap.find(".smart-search__search-result").removeClass("block");

        el_wrap.find(".smart-search__search-wrap").removeClass("block");
        el_wrap.find(".smart-search__search-text").addClass("filled");
    });

    //Выборка элемента из поиска (множественный выбор с добавлением в нижний список)
    $(document).on("click", ".smart-search__item.active.multy", function () {
        var el = $(this);
    	var el_wrap = el.closest('.smart-search');
    	var id_wrap = el_wrap.attr("data-id");
        var el_name = el.text();
        var el_id = el.attr('data-id');

        el_wrap.find(".smart-search__selected-list").append(
            '<div class="smart-search__selected-wrap" data-id="' + el_id + '">' +
                '<div class="smart-search__selected-block">' +
                    '<span class="smart-search__selected-icon icon--right-open-mini"></span>' +
                    '<div class="smart-search__selected-name">' + el_name + '</div>' +
                    '<input type="hidden" name="' + id_wrap + '" value="' + el_id + '" />' +
                    '<div class="smart-search__selected-del icon--delete"></div>' +
                '</div>' +
            '</div>'
        );

        el_wrap.find(".smart-search__search-input").prop("value","");
        el_wrap.find(".js-search-id").prop("value","");

        if(el_wrap.find(".js-ajax").length > 0)
	      	el_wrap.find(".smart-search__search-result").html("").removeClass("block");
		else
			el_wrap.find(".smart-search__search-result").removeClass("block");

        el_wrap.find(".smart-search__search-wrap").removeClass("block");

        if(el_wrap.find(".smart-search__selected-wrap").length == 1) {
            el_wrap.find(".smart-search__selected-title").removeClass('hidden');
        }
    });

    //Удаление элемента из списка
    $(document).on("click", ".smart-search__selected-del", function () {
        var el_del = $(this);
        var search_wrap = el_del.closest(".smart-search");
        var el_wrap = el_del.closest(".smart-search__selected-wrap");
        var el_id = el_wrap.attr("data-id");
        var el_list = el_del.closest(".smart-search__selected-list");
        el_list.find(".smart-search__selected-wrap[data-id='"+el_id+"']").remove();
        if(el_list.html().replace(/^\s*/, '').replace(/\s*$/, '') == '') {
            search_wrap.find(".smart-search__selected-title").addClass('hidden');
        }
    });
});