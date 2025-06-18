import $ from "jquery";

const displayErrors = (form: JQuery, response: any) => {
  form.find(".text-error").text("");
  form.find(".input-error").removeClass("input-error");

  const fieldErrors = response?.errors;
  if (fieldErrors) {
    for (const key in fieldErrors) {
      const errorMsg = fieldErrors[key];
      const $input = form.find(`input[name="${key}"]`);
      const $errorSpan = form.find(`[data-error-for="${key}"]`);
      $input.addClass("input-error");
      $errorSpan.text(errorMsg);
    }
  } else {
    const generalError = response?.message;
    form.find(".h-4.text-sm").text(generalError);
  }
};

export const initProfilePage = () => {
  const $profileContainer = $("#profile-container");
  if ($profileContainer.length === 0) return;

  const $profileView = $("#profile-view");
  const $profileEditForm = $("#profile-edit-form");
  const $editProfileBtn = $("#edit-profile-btn");
  const $cancelEditProfileBtn = $("#cancel-edit-profile-btn");

  const $passwordView = $("#password-view");
  const $passwordChangeForm = $("#password-change-form");
  const $changePasswordBtn = $("#change-password-btn");
  const $cancelChangePasswordBtn = $("#cancel-change-password-btn");

  const accessToken = localStorage.getItem("accessToken");

  $editProfileBtn.on("click", () => {
    $profileView.addClass("hidden");
    $profileEditForm.removeClass("hidden");
    $editProfileBtn.addClass("hidden");
  });

  $cancelEditProfileBtn.on("click", () => {
    $profileView.removeClass("hidden");
    $profileEditForm.addClass("hidden");
    $editProfileBtn.removeClass("hidden");
    $("#profile-update-error").text("");
  });

  $profileEditForm.on("submit", function (e) {
    e.preventDefault();
    const name = $(this).find('input[name="name"]').val() as string;
    const YOB = parseInt($(this).find('input[name="YOB"]').val() as string, 10);

    $.ajax({
      url: "/api/members/me",
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      data: JSON.stringify({ name, YOB }),
      beforeSend: () => {
        displayErrors($profileEditForm, {});
      },
      success: (data) => {
        $("#view-name").text(data.name);
        $("#view-yob").text(data.YOB);
        $("#cancel-edit-profile-btn").trigger("click");
        alert("Profile updated successfully!");
      },
      error: (jqXHR) => {
        displayErrors($profileEditForm, jqXHR.responseJSON);
      },
    });
  });

  $changePasswordBtn.on("click", () => {
    $passwordView.addClass("hidden");
    $passwordChangeForm.removeClass("hidden");
  });

  $cancelChangePasswordBtn.on("click", () => {
    $passwordView.removeClass("hidden");
    $passwordChangeForm.addClass("hidden");
    ($passwordChangeForm[0] as HTMLFormElement).reset();
    $("#password-change-error").text("");
  });

  $passwordChangeForm.on("submit", function (e) {
    e.preventDefault();
    const formData = {
      oldPassword: $(this).find('input[name="oldPassword"]').val() as string,
      newPassword: $(this).find('input[name="newPassword"]').val() as string,
      confirmNewPassword: $(this).find('input[name="confirmNewPassword"]').val() as string,
    };

    $.ajax({
      url: "/api/auth/change-password",
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      xhrFields: { withCredentials: true },
      data: JSON.stringify(formData),
      beforeSend: () => {
        displayErrors($passwordChangeForm, {});
      },
      success: () => {
        alert("Password changed successfully!");
        $("#cancel-change-password-btn").trigger("click");
      },
      error: (jqXHR) => {
        displayErrors($passwordChangeForm, jqXHR.responseJSON);
      },
    });
  });
};
