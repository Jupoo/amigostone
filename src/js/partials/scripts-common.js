$(document).ready( function() {
	//Подключение масок для валидации телефона
	if($(".request-phone").length)
    	$(".request-phone").mask("+7 (999) 999-99-99");

	var elem = $('.page-header');
	var h_hght = elem.outerHeight(); // высота шапки

	$(window).resize(function(){
		h_hght = elem.outerHeight(); // высота шапки
	});

	//Плавная прокрутка до якоря
	$(document).on('click', 'a.ancLinks', function () {
		var elementClick = $(this).attr("href");
		var destination = $(elementClick).offset().top - h_hght;//минус высота шапки
		$("html:not(:animated),body:not(:animated)").animate({scrollTop: destination},500);

		return false;
	});

	//Мобильное меню
	$(document).on("click", ".js-menu-adaptive-btn, .js-menu-adaptive-close", function (e) {
		if($("body").hasClass("overflow-no")) {
			$(".js-menu-adaptive-list").fadeOut(0);
			$(".js-menu-adaptive-close").css("right","0px");
			$("body").removeClass("overflow-no").css("padding-right","0px");
			$(".page-header").css("padding-right","0px");
		} else {
			$(".js-menu-adaptive-list").fadeIn(400);
			//$(this).closest(".js-menu-adaptive-wrap").find(".js-menu-adaptive-list").slideToggle("100", function () {
				$("body").addClass("overflow-no").css("padding-right",scrollbarWidth());
				$(".page-header").css("padding-right",scrollbarWidth());
				$(".js-menu-adaptive-close").css("right",scrollbarWidth());
			//});
		}
		e.preventDefault();
	});

	//узнаем ширину полосы прокрутки
	/*function scrollbarWidth() {
		var block = $('<div>').css({'height':'50px','width':'50px'}),
			indicator = $('<div>').css({'height':'200px'});

		$('body').append(block.append(indicator));
		var w1 = $('div', block).innerWidth();
		block.css('overflow-y', 'scroll');
		var w2 = $('div', block).innerWidth();
		$(block).remove();
		return (w1 - w2);
	}*/

	//Заблокированные кнопки
	$(document).on("click", ".btn--disabled", function () {
		return false;
    });

	//Вкладки
	$(document).on("click", ".js-tab-btn", function () {
		var btn = $(this);
		var tab_wrap = btn.closest(".js-tab");
		var page = btn.attr('data-tab');
		tab_wrap.find('.js-tab-content').removeClass('current');
		tab_wrap.find('.js-tab-content[data-tab='+page+']').addClass('current');
		tab_wrap.find('.js-tab-btn').removeClass('current');
		btn.addClass('current');
	});

	$('.js-slider-main').slick({
		dots: false,
        arrows: false,
		speed: 30000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 0,
		cssEase: 'linear',
	});

	//FAQ
	$(document).on("click", ".js-faq-btn", function () {
		var btn = $(this);
		var faqWrap = btn.closest('.js-faq-wrap');
		var faqBody = faqWrap.find('.js-faq-body');
		faqBody.slideToggle("100", function () {
			if(faqWrap.hasClass("faq--active")) {
				faqWrap.removeClass("faq--active");
			} else {
				faqWrap.addClass("faq--active");
			}
		});
		return false;
    });

	//Разворачивание скрытого контента по кнопке
	$(document).on('click', '.js-expand-btn', function () {
		var btn = $(this);
		var btn_hidden = btn.attr("data-expand");
		var wrap = btn.closest(".js-expand-wrap");
		var id = btn.attr("data-id");

		if(id) {
			var btn_body = wrap.find(".js-expand-body[data-id="+id+"]");

			//скрываем открытые блоки
			wrap.find(".js-expand-body").each(function() {
				var body_el = $(this);
				//не скрываем вложенные body, если есть указывающий класс
				if(!body_el.hasClass("js-expand-body-nohidden")) {
                    var body_id = body_el.attr("data-id");
                    if (body_id != id)
                        body_el.hide();
                }
			});
		} else {
			 btn_body =  wrap.find(".js-expand-body");
		}

        btn_body.slideToggle("400", function () {
        	if(btn.hasClass('active')) {
                btn.removeClass('active');
            }
        	else {
        		btn.addClass('active');
			}

        	if(btn_hidden == "show") {
        		if(btn.hasClass("js-expand-inherit-hidden")) {
					wrap.find(".js-expand-show[data-id="+id+"]").hide();
					wrap.find(".js-expand-hidden[data-id="+id+"]").show();
				} else {
        			wrap.find(".js-expand-show").hide();
					wrap.find(".js-expand-hidden").show();
				}
			}

			if(btn_body.css("display")=="block") {
        		var destination = btn_body.offset().top - h_hght;//минус высота шапки
				$("html:not(:animated),body:not(:animated)").animate({scrollTop: destination},500);
			}

			//Если в раскрывающемся блоке есть скрытый текст
			$(".js-show-more-wrap").each(function() {
				show_more($(this));
			});
		});

        if(btn_hidden == "hidden") {
        	if(btn.hasClass("js-expand-inherit-hidden")) {
        		wrap.find(".js-expand-hidden[data-id="+id+"]").hide();
            	wrap.find(".js-expand-show[data-id="+id+"]").show();
			} else {
				wrap.find(".js-expand-hidden").hide();
            	wrap.find(".js-expand-show").show();
			}
        }

        return false;
    });

	//Окошко-подтверждение в заказе - Вы уверены?
	$(document).on('click', '.js-confirm-win-btn', function () {
		var btn = $(this);
		var wrap = btn.closest(".js-confirm-win-wrap");
		var modal = wrap.find(".js-confirm-win-modal");
		$(".js-confirm-win-modal").css({display: "none"});
		modal.fadeIn(400);
		return false;
    });

	$(document).on('click', '.js-confirm-win-btn-no', function () {
		$(".js-confirm-win-modal").fadeOut(400);
		return false;
    });

	//Закрываем окошко
	if ($(".js-confirm-win-modal").length) {
        $(document).click(function (e) {
            if ($(e.target).closest(".js-confirm-win-modal").length) {
                return;
            } else {
                $(".js-confirm-win-modal").fadeOut(400);
            }
            e.stopPropagation();
        });
    }

    //Рейтинг в добавлении отзыва
	$(document).on('click', '.js-order-mark-star', function () {
		var star = $(this);
		var star_wrap = star.closest(".js-order-mark");
		var res = star.attr("data-star");
		var res_wrap = star_wrap.find(".js-order-mark-res");

		star_wrap.find('.js-order-mark-star').each(function () {
			var el = $(this);
			var count = el.attr("data-star");
			if(count <= res)
				el.addClass("active");
			else
				el.removeClass("active");
        });
		res_wrap.val(res);
    });

	$('.js-order-mark-star').hover(
		function(event) {
			var star = $(this);
			var star_wrap = star.closest(".js-order-mark");
			var res = star.attr("data-star");
			star_wrap.find('.js-order-mark-star').each(function () {
				var el = $(this);
				var count = el.attr("data-star");
				if(count <= res)
					el.css("color","#f98500");
				else
					el.removeAttr("style");
			});
		},
		function(event) {
			var star = $(this);
			var star_wrap = star.closest(".js-order-mark");
			star_wrap.find('.js-order-mark-star').each(function () {
				var el = $(this);
				el.removeAttr("style");
            });
		}
	);

	//Выборка камней в кабинете
	$(document).on("click", ".js-stone-check", function () {
        var el = $(this);
        var wrap = el.closest(".js-stone-check-wrap");
        var show = wrap.find(".js-stone-prices");

        show.slideToggle("400", function () {
        	if(wrap.hasClass("check")) {
				wrap.removeClass("check");

			} else {
				wrap.addClass("check");
			}
		});
    });

	//Ползунок с ценой
	$( function() {
		$( "#slider-range" ).slider({
		  	range: true,
		  	min: 0,
		  	max: 500,
		  	values: [ 75, 300 ],
		  	slide: function( event, ui ) {
				$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		  	}
		});
		$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
			" - $" + $( "#slider-range" ).slider( "values", 1 ) );
	});

	$('.filter-top__item').on('click', function () {
		var smart_search = $('.smart-search');
		var $this = $(this);

		$('.filter-top__item').removeClass('filter-top--active');
		$this.addClass('filter-top--active');
		$.ajax({url: '/materials/lines/', data:{'production': $this.data('id')}, success: function(data) {
			smart_search.html(data);
		}})
    });
});

// функция валидации ввода в инпут, пропускает только числа
function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

// функция для вытаскивания перменных из GET параметров
function getUrlVars() {
    var vars = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}