
function get_filtered_url_search() {
    var search = window.location.search
        url_vars = getUrlVars()
        output = '?';

    if ('o' in url_vars) {
    for (var key in url_vars) {
            if (key == 'o') continue
            output += '&'+key+'='+url_vars[key]
        }
        return output
    } else {
        return search
    }
}

(function($){
    $.fn.fill_sorting_href = function() {
        var url_vars = getUrlVars();
        var filtered_url = get_filtered_url_search();
        var title = $('.sorting-cabinet:first-child');
        var title1 = $('.sorting__order-by:first-child');
        var date = $('.sorting-cabinet:nth-child(2)');
        var date1 = $('.sorting__order-by:nth-child(2)');

        if (filtered_url != '') {
            title.add(title1).find('a:first').attr('href', filtered_url+'&o=title');
            title.add(title1).find('a:eq(1)').attr('href', filtered_url+'&o=-title');
            date.add(date1).find('a:first').attr('href', filtered_url+'&o=date');
            date.add(date1).find('a:eq(1)').attr('href', filtered_url+'&o=-date');

        } else {
            title.add(title1).add(title1).find('a:first').attr('href', '?o=title');
            title.add(title1).find('a:eq(1)').attr('href', '?o=-title');
            date.add(date1).find('a:first').attr('href', '?o=date');
            date.add(date1).find('a:eq(1)').attr('href', '?o=-date');
        }

        if ('o' in url_vars) {
            if (url_vars['o'] == 'title') {
                title.add(title1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                title.add(title1).find('a:first').addClass('sorting-cabinet--toggle-views-active')
            } else if (url_vars['o'] == '-title') {
                title.add(title1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                title.add(title1).find('a:eq(1)').addClass('sorting-cabinet--toggle-views-active')
            } else if (url_vars['o'] == 'date') {
                title.add(title1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a:first').addClass('sorting-cabinet--toggle-views-active')
            } else if (url_vars['o'] == '-date') {
                title.add(title1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a').removeClass('sorting-cabinet--toggle-views-active');
                date.add(date1).find('a:eq(1)').addClass('sorting-cabinet--toggle-views-active')
            }
        } else {
            title.add(title1).find('a').removeClass('sorting-cabinet--toggle-views-active');
            date.add(date1).find('a').removeClass('sorting-cabinet--toggle-views-active');
        }
    };
})(jQuery);

$(document).ready(function () {
   $(document).fill_sorting_href();
});
