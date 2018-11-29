$(function(){
    $('.g-recaptcha').closest('form').find('button[type="submit"]').attr('disabled', 'disabled')
});
function enableSubmit() {
    var submit = $('.g-recaptcha').closest('form').find('button[type="submit"]');
    submit.removeAttr('disabled');
    submit.removeClass('btn--disabled')
    submit.next().hide('slow')
};