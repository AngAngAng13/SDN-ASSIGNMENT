import $ from 'jquery';

interface RegisterFormData {
  [key: string]: string | number | boolean;
}

$(() => { 
  
  const themeController = {
    controller: document.querySelector('.theme-controller') as HTMLInputElement,

    init() {
    
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      if (this.controller) {
        this.controller.checked = currentTheme === 'dark';
      }
      this.listen();
    },

    listen() {
      if (!this.controller) return;
      $(this.controller).on('change', (e) => {
        const target = e.target as HTMLInputElement;
        const theme = target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      });
    },
  };

  themeController.init();

  const $registerForm = $('#register-form');

  if ($registerForm.length) {
    $registerForm.on('submit', (event) => {
      event.preventDefault();

      const $submitButton = $('#submit-button');
      const $errorDiv = $('#form-error');
      const originalButtonText = $submitButton.data('original-text') || 'Submit';
      
      const formData = $registerForm.serializeArray();
      const data: RegisterFormData = {};

      formData.forEach((field) => {
        data[field.name] = field.value;
      });

      data.YOB = Number(data.YOB);
      data.isAdmin = $('#isAdmin').is(':checked');

      $.ajax({
        url: '/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),

        beforeSend: () => {
          $errorDiv.text('');
          $submitButton.prop('disabled', true)
                       .addClass('btn-disabled loading')
                       .html('<span class="loading loading-spinner"></span> Submitting...');
        },

        success: (_response) => {
           alert('Registration successful! Redirecting to login page...');
        },

        error: (jqXHR) => {
          let errorMessage = 'An unknown error occurred.';
          if (jqXHR.responseJSON) {
            const errorData = jqXHR.responseJSON;
            errorMessage = errorData.message || errorMessage;
            if (errorData.errors) {
              errorMessage = Object.values(errorData.errors).join(', ');
            }
          }
          $errorDiv.text(errorMessage);
        },

        complete: () => {
          $submitButton.prop('disabled', false)
                       .removeClass('btn-disabled loading')
                       .html(originalButtonText);
        }
      });
    });
  }
});