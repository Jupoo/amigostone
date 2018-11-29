//$(window).load(function() {
	$(document).ready( function() {
		//Кнопка Показать полностью
		$(".js-show-more-wrap").each(function() {
			show_more($(this));
		});

		// установим обработчик события resize
		$(window).resize(function() {
			$(".js-show-more-wrap").each(function() {
				show_more($(this));
			});
		});

		//Раскрытие списка
		$(document).on("click", ".js-show-more-btn", function () {
			var btn = $(this);
			var wrap = btn.closest(".js-show-more-wrap");
			var text = wrap.find(".js-show-more-text");

			var openText = "no";
			if(wrap.hasClass("open")) {
				openText = "yes";
			}

			if(openText == "yes") {
				wrap.removeClass("open").addClass("close");
				btn.text("Показать полностью");
			} else {
				wrap.addClass("open").removeClass("close");
				btn.text("Свернуть");
			}
			return false;
		});
	});
//});

//Кнопка Показать полностью
function show_more(wrap_item) {
	var wrap_text = wrap_item.find(".js-show-more-text");
	wrap_item.removeClass("open").removeClass("show").removeClass("close");
	wrap_item.find(".js-show-more-btn").text("Показать полностью");
	var sub_height = wrap_text.height();
	//Если текста много
	if(wrap_text.hasClass("show-more--text-min"))
		var height_bl = 42;
	else
		var height_bl = 184;
	if(sub_height > height_bl) {
		wrap_item.addClass("show").addClass("close");
	}
}