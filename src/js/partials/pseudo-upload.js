$(document).ready( function() {
    $(document).on("click", ".pseudo-upload", function () {
        $(this).next('input[type=file]').click()
    });

    $('form#send_contract input[type=file]').on('change', function () {
        $('#send_contract').submit();
    });
});