$(document).ready(function () {
    $('[data-trash]').on('click', function (e) {
        e.preventDefault()
        var url = $(this).attr('href')
        var _this = $(this)
        $.ajax({
            url: url,
            cache: false
        }).done(function (json) {
            if (json.success) {
                if (json.next && _this.closest('.container_action_bar_visible').length) {
                    var next = $($('.breadcrumbs__item')[$('.breadcrumbs__item').length - 2]).find('.breadcrumbs__link').attr('href');
                    window.location = next
                } else {
                    _this.closest('.catalog-item').fadeOut(300, function () {
                        $(this).remove();
                    });
                }
            } else {
            }
        });
    })
});
