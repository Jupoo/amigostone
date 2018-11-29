$("#id_inn").suggestions({
    token: "4b01ba9439567734d64241b896c5dd6deb66d6c6",
    type: "PARTY",
    count: 5,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function (suggestion) {
        $(this).val(suggestion.data.inn);
        $('#id_kpp').val(suggestion.data.kpp);
        $('#id_ogrn').val(suggestion.data.ogrn);
        $('#id_okpo').val(suggestion.data.okpo);
        $('#id_okved').val(suggestion.data.okved);
        $('#id_dir_name').val('management' in suggestion.data ? suggestion.data.management.name : suggestion.value);
        //console.log(suggestion.data.inn);
    }
});
$(document).ready(function () {
    $("#id_inn").on('keypress', function(event) { validate(event) })
});