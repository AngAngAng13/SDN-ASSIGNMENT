import $ from 'jquery';

import themeController from './modules/theme.js';
import { handleFormSubmit } from './modules/forms.js';

$(() => {
  themeController.init();

  handleFormSubmit({
    formId: 'register-form',
    submitButtonId: 'register-submit-button',
    errorDivId: 'register-form-error',
    apiUrl: '/auth/register',
    onSuccess: (response) => {
      alert(response.message || 'Registration successful! Please log in.');
      window.location.href = '/login';
    },
  });

  handleFormSubmit({
    formId: 'login-form',
    submitButtonId: 'login-submit-button',
    errorDivId: 'login-form-error', 
    apiUrl: '/auth/login',
    onSuccess: (response) => {
      alert('Login Successful!');
      window.location.href = '/';
    },
  });
});