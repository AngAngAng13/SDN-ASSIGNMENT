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

  $form.on('submit', (event) => {
    event.preventDefault();

    const $submitButton = $(`#${options.submitButtonId}`);
    const $errorDiv = $(`#${options.errorDivId}`);
    const originalButtonText = $submitButton.data('original-text') || 'Submit';

    const clearErrors = () => {
      $errorDiv.text('');
      $form.find('.input-error').removeClass('input-error');
    };

    const formData = $form.serializeArray();
    const data: { [key: string]: any } = {};
    formData.forEach((field) => { data[field.name] = field.value; });

    if (options.formId === 'register-form') {
      data.YOB = Number(data.YOB);
      data.isAdmin = $('#isAdmin').is(':checked');
    }

    $.ajax({
      url: options.apiUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      beforeSend: () => {
        clearErrors();
        $submitButton.prop('disabled', true).addClass('loading').html('<span class="loading loading-spinner"></span> Working...');
      },
      success: (response) => {
        options.onSuccess(response);
      },
      error: (jqXHR) => {
        let errorMessage = 'An unknown error occurred.';
        if (jqXHR.responseJSON) {
          const errorData = jqXHR.responseJSON;
          errorMessage = errorData.message || errorMessage;
          if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).join('\n');
          }
        }
        $errorDiv.text(errorMessage);
      },
      complete: () => {
        $submitButton.prop('disabled', false).removeClass('loading').html(originalButtonText);
      }
    });
  });
};