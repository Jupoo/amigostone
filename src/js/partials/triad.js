$(document).ready( function() {
	//********* Ввод в поле только цифр и разделение по триадам *************//
    $(document).on("propertychange input", ".js-triad", function () {
        var triad_el = $(this);
        var inp_val = triad_el.val().replace(/\s/g, "");
        var new_val = inp_val;
        var pattern = /^[0-9]+$/i;//регулярка для цифр
        if (inp_val.search(pattern) != 0) {
            new_val = parseInt(inp_val.replace(/\D+/g, ""));
            if (!new_val)
                new_val = '';
        }
        new_val = str_triad(new_val);
        triad_el.val(new_val);

        //Для подсчета общей стоимости заказа в отклике компании (для камня)
        if(triad_el.attr("data-order")=="sum") {
            var sum_res = triad_el.closest(".js-order-sum-wrap").find(".js-order-sum-res");
            var sum_new = new_val.replace(/\s/g, "")*1;
            triad_el.attr("data-sum",sum_new);

            var sum = 0;
            triad_el.closest(".js-order-sum-wrap").find(".js-triad").each(function() {
                var sum_el = $(this);
                sum = sum + sum_el.attr("data-sum")*1;
            });
            sum_res.text(str_triad(sum));
        }

        //Для подсчета общей стоимости заказа в отклике компании (для услуг)
        if(triad_el.attr("data-order")=="sum-price" || triad_el.attr("data-order")=="sum-count") {
            var sum_res = triad_el.closest(".js-order-sum-wrap").find(".js-order-sum-res");
            var sum_new = new_val.replace(/\s/g, "")*1;
            triad_el.attr("data-count",sum_new);

            var sum = triad_el.closest(".js-order-sum-wrap").find(".js-triad[data-order='sum-price']").attr("data-count") * triad_el.closest(".js-order-sum-wrap").find(".js-triad[data-order='sum-count']").attr("data-count");
            sum_res.text(str_triad(sum));
        }
    });
    $(document).on("click", ".js-triad", function () {
        var inp_val = $(this).val() * 1;
        if (inp_val == 0) {
            $(this).val('');
        }
    });
    $(document).on("blur", ".js-triad", function () {
        var inp_val = $(this).val();
        if (inp_val == '') {
            $(this).val('');
        }
    });
});

//Разбиение по триадам
function str_triad(str) {
    str = str + '';
    str = str.replace(/\s/g,"");
    var newVal = '', length = str.length, i;
    for( i = 1; i * 3 < length; i++ )
        newVal = ' ' + str.substring( length - i*3, length - ( i - 1 ) * 3 ) + newVal;
    str = str.substr( 0, 3 - i*3 + length ) + newVal;
    return str;
}