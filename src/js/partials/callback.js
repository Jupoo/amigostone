$(function(){
    $('#add_callback').ajaxForm(
        {
            type: 'post',
            beforeSubmit: function () {

            },
            success: function(responseText, statusText, xhr) {
                if(responseText.success){
                    $('#add_callback .call_order_form_success').show();
                    $('#add_callback form')[0].reset();
                    $('#add_callback .field-alert').removeClass('field-alert');

                    setTimeout(function(){
                    $('#add_callback .call_order_form_success').fadeOut();
                    $('#add_callback').find('a.close').click()
                    }, 1000);

                } else {
                    for(var field in responseText.fields) {
                        $('#add_callback #id_'+responseText.fields[field]).parent().addClass('field-alert')
                    }
                }
            }
        }
    )
})