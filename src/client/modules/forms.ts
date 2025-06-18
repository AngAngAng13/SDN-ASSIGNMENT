import $ from 'jquery';

export const handleFormSubmit = (options: {
    formId: string;
    submitButtonId: string;
    errorDivId: string; 
    apiUrl: string;
    onSuccess: (response: any) => void;
}) => {
    const $form = $(`#${options.formId}`);
    if (!$form.length) return;

    const clearErrors = () => {
        $(`#${options.errorDivId}`).text('');
        $form.find('.input-error').removeClass('input-error');
        $form.find('[data-error-for]').text('');
    };

    const displayErrors = (errors: Record<string, string>, globalErrorMsg?: string) => {
        if (errors) {
            Object.keys(errors).forEach((key) => {
                const errorMsg = errors[key];
                $form.find(`input[name="${key}"]`).addClass('input-error');
                $form.find(`[data-error-for="${key}"]`).text(errorMsg);
            });
        }
        if (globalErrorMsg) {
            $(`#${options.errorDivId}`).text(globalErrorMsg);
        }
    };

    $form.on('submit', (event) => {
        event.preventDefault();

        const $submitButton = $(`#${options.submitButtonId}`);
        const originalButtonText = $submitButton.data('original-text') || 'Submit';

        const formData = $form.serializeArray();
        // cái name input name mà sai là đảm bảo sends sai 
        const data: { [key: string]: any } = {};
        formData.forEach((field) => { data[field.name] = field.value; });

        if (options.formId === 'register-form') {
            data.YOB = Number(data.YOB);
            // form input thuong la string num no
        }

        $.ajax({
            url: options.apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: () => {
                clearErrors();
                $submitButton.prop('disabled', true).html('<span class="loading loading-spinner"></span> Working...');
            },
            success: (response) => {
                options.onSuccess(response);
            },
            error: (jqXHR) => {
                let errorMessage = 'An unknown error occurred.';
                let fieldErrors: Record<string, string> | undefined;

                if (jqXHR.responseJSON) {
                    const errorData = jqXHR.responseJSON;
                    errorMessage = errorData.message || errorMessage;
                    if (errorData.errors) {
                        fieldErrors = errorData.errors;
                        
                        if (fieldErrors) {
                            displayErrors(fieldErrors);
                        }
                    } else {
                    
                        $(`#${options.errorDivId}`).text(errorMessage);
                    }
                } else {
                    $(`#${options.errorDivId}`).text(errorMessage);
                }
            },
            complete: () => {
                $submitButton.prop('disabled', false).html(originalButtonText);
            }
        });
    });
};