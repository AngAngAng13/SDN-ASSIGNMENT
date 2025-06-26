import $ from "jquery";

import themeController from "./modules/theme.js";
import { handleFormSubmit } from "./modules/forms.js";
import { initPlayerFilters } from "./modules/playerFilter.js";
import { initPlayerDetailPage } from "./modules/playerDetail.js";
import { initProfilePage } from "./modules/profile.js";
import { initAdminDashboard } from "./modules/admin.js";
import { initAuthUI } from "./modules/authUI.js";
$(() => {
  themeController.init();
  initPlayerFilters();
  initPlayerDetailPage();
  initAuthUI();
  initProfilePage();
  initAdminDashboard();
  handleFormSubmit({
    formId: "register-form",
    submitButtonId: "register-submit-button",
    errorDivId: "register-form-error",
    apiUrl: "api/auth/register",
    onSuccess: (response) => {
      alert(response.message || "Registration successful! Please log in.");
      window.location.href = "/login";
    },
  });

  handleFormSubmit({
    formId: "login-form",
    submitButtonId: "login-submit-button",
    errorDivId: "login-form-error",
    apiUrl: "api/auth/login",
    onSuccess: (response) => {
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      window.location.href = "/";
    },
  });
});
