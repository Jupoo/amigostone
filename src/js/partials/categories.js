$(document).ready( function() {
	//Левое меню с категориями
	$('.js-cat-wrap').each(function() {
		var catWrap = $(this);
		if(catWrap.hasClass("categories--active")) {
			catWrap.addClass("categories--active-global");
        }
    });

	$(document).on("click", ".js-cat-btn", function () {
		var btn = $(this);
		var catWrap = btn.closest('.js-cat-wrap');
		var catList = catWrap.find('.js-cat-list');

		var activeWrap = 'no';
		if(catWrap.hasClass("categories--active")) {
			activeWrap = "yes";
        }

        //сворачиваем все открытые
		$('.js-cat-list').each(function() {
			var catListAll = $(this);
			var catWrapAll = catListAll.closest('.js-cat-wrap');
			catListAll.slideUp("100", function () {
				catWrapAll.removeClass("categories--active");
			});
		});

		//разворачиваем, если было свернуто
		if(activeWrap == "no") {
			catList.slideDown("100", function () {
				catWrap.addClass("categories--active");
			});
		}
		return false;
    });
});