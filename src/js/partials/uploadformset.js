$( document ).ready(function() {
    var formset = $('.uploadformset');

    if (formset.length) {
        formset.each(function (index) {
           $($(this).data('formset-elements')).uploadformset({
                prefix: $(this).data('formset-prefix'),
                deleteText: '',
                addText: '',
                ajaxUploadFileId: $(this).data('formset-ajaxuploadfileid'),
                formCssClass: $(this).data('formset-formcssclass'),
                allowedFileExtensions: $(this).data('formset-allowedfileextensions').split(',')
            })
        })
    }

    var form_data = $('.uploadform-data');

    if (form_data.length) {
        form_data.each(function (index) {
            $($(this).data('id-label')).uploadform({
                allowedFileExtensions: $(this).data('formset-allowedfileextensions')
            })
        })
    }

    var form_data_prefix = $('.uploadform-data-prefix');

    if (form_data_prefix.length) {
        form_data_prefix.each(function (index) {
            $($(this).data('id-field')).uploadform({
                allowedFileExtensions: '',
                ajaxUploadFileId: $(this).data('formset-ajaxuploadfileid')
            })
        })
    }
});