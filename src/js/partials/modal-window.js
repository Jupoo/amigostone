//************ Модальные окна BEGIN *******************//
$(document).ready( function() {
	//Генерация подложки для модального окна
	$("body").prepend("<div class='modal-shadow'></div>");

	//Инициализация окна
	$(".modal-window").each(function() {
		var win = $(this);

	  	win.find(".modal-window__body").prepend("<a href='' class='closemodal'><span class='icon--close'></span></a>");
	  	win.addClass("js-window");
	    modalresizer();
	});

	//Открытие окна
	$(document).on("click", ".openmodal", function (e) {
		e.preventDefault();
		var btn = $(this);
		var modal_id = btn.attr("data-id");
		// console.log("ORDER2", window.offer_company);
		if (btn.attr("name")) {
			window.offer_company = btn.attr("name");
			// console.log("ORDER2", window.offer_company);
		}
		// alert(window.offer_company);

		// console.log("open window", window.offer_company);
		openmodalContent(btn, modal_id, window.offer_company);
	});
	
	//Закрытие модального окна
	$("body").on("click", ".closemodal, .modal-shadow", function(event) {
		var closethis = "y";
		// console.log("ORDER2");

		$(this).trigger('closemodal', ['Custom', 'Event']);
		// console.log("ORDER2", window.offer_company);
		// alert(window.offer_company);
		delete window.offer_company;
		// alert(window.offer_company);
		// console.log("ORDER2", window.offer_company);
		if(closethis == "y") {
	    	$(".modal-window, .modal-shadow").animate({
		      	opacity: 0
		    }, 500, function() {
		      	$(".modal-window, .modal-shadow").removeClass("js-active");

		      	$("body").removeClass("overflow-no").css("padding-right","0px");
				$(".page-header").css("padding-right","0px");
		    });
		    event.preventDefault();
	    }
  	});

	if ($(".modal-window").length) {
        $(document).click(function (e) {
        	if ($(e.target).closest(".modal-window").length) {
				if ($(e.target).closest(".modal-window__body").length) {
					return;
				}
				else {
					$(e.target).find(".closemodal").click();
				}
            }
            e.stopPropagation();
        });
    }

	//Функция отложенного конечного действия
	var waitForFinalEvent = (function () {
  		var timers = {};
  		return function (callback, ms, uniqueId) {
    		if (!uniqueId) {
      			uniqueId = "Don't call this twice without a uniqueId";
    		}
	    	if (timers[uniqueId]) {
	      		clearTimeout (timers[uniqueId]);
	    	}
	    	timers[uniqueId] = setTimeout(callback, ms);
  		};
	})();
	//При ресайзе окна
	$(window).resize(function () {
		/*$(".modal-window").each(function() {
			var el_win = $(this);
			el_win.css({"height" : "auto" });
			if(el_win.hasClass("js-active")) {
				if(el_win.outerHeight() < $(window).height()) {
					$("body").removeClass("overflow-no").css("padding-right","0px");
					$(".page-header").css("padding-right","0px");

					el_win.removeClass("js-window-absolut");
					var getheight = $(window).height();
					var getmodalheight = el_win.innerHeight();
					var gtx = getheight - getmodalheight;
					gtx = gtx / 2;
					el_win.css({"top" : gtx, "height" : "auto" });
				}
				else {
					$("body").addClass("overflow-no").css("padding-right",scrollbarWidth());
					$(".page-header").css("padding-right",scrollbarWidth());
					el_win.css({"top" : 0, "height" : "100%" });
				}
			}
        });*/
		//waitForFinalEvent(function(){
		modalresizer();
		//}, 500, "some unique string");
	});

	$(".modal-window").bind( 'DOMSubtreeModified',function(){ // отслеживаем изменение содержимого окна
		/*$(".modal-window").each(function() {
			var el_win = $(this);
			if(el_win.hasClass("js-active")) {
				if(el_win.outerHeight() < $(window).height()) {
					$("body").removeClass("overflow-no").css("padding-right","0px");
					$(".page-header").css("padding-right","0px");
				}
			}
        });*/
		//waitForFinalEvent(function(){
		modalresizer();
		//}, 500, "some unique string");
	});
});

//Выводим нужный контент
function openmodalContent(btn, modal_id, offer_company) {
	var modal_open = "no";
	// window.offer_company = offer_company;
	// console.log("content W", window.offer_company);
	// console.log("content V", offer_company);

	if(modal_open == "no") {
		openmodal(modal_id);
	}
}

//Открытие окна
function openmodal(artic) {
  	$("#" + artic).addClass("js-active");  	
  	$("#" + artic).animate({
    	opacity: 1
  	}, 500);
  	$(".modal-shadow").addClass("js-active");
  	$(".modal-shadow").animate({
    	opacity: 0.5
  	}, 500);
  	modalresizer();
}

//Делаем окно адаптивным
function modalresizer() {
    $(".modal-window").each(function() {
    	var el_win = $(this);
    	el_win.css({"height" : "auto" });
    	if(el_win.hasClass("js-active")) {
			if(el_win.outerHeight() >= $(window).height()) {
				$("body").addClass("overflow-no").css("padding-right",scrollbarWidth());
				$(".page-header").css("padding-right",scrollbarWidth());
				el_win.css({"top" : 0, "height" : "100%" });
				/*el_win.addClass("js-window-absolut");
				var toppos = $(window).scrollTop();
				el_win.css({"top" : toppos });*/
			} else {
				$("body").removeClass("overflow-no").css("padding-right","0px");
				$(".page-header").css("padding-right","0px");

				el_win.removeClass("js-window-absolut");
				var getheight = $(window).height();
				var getmodalheight = el_win.innerHeight();
				var gtx = getheight - getmodalheight;
				gtx = gtx / 2;
				el_win.css({"top" : gtx, "height" : "auto" });
			}
        }
    });
}
//************ Модальные окна END *******************//

//узнаем ширину полосы прокрутки
function scrollbarWidth() {
	var block = $('<div>').css({'height':'50px','width':'50px'}),
		indicator = $('<div>').css({'height':'200px'});

	$('body').append(block.append(indicator));
	var w1 = $('div', block).innerWidth();
	block.css('overflow-y', 'scroll');
	var w2 = $('div', block).innerWidth();
	$(block).remove();
	return (w1 - w2);
}