import $ from "jquery";
import { showNotificationModal } from "./modal.js";
import { callApi } from "./api.js"; 

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

    $profileEditForm.on("submit", async function (e) {
        e.preventDefault();
        const name = $(this).find('input[name="name"]').val() as string;
        const YOB = parseInt($(this).find('input[name="YOB"]').val() as string, 10);

        displayErrors($profileEditForm, {});

        try {
            const data = await callApi({
                url: "/api/members/me",
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({ name, YOB }),
            });
            $("#view-name").text(data.name);
            $("#view-yob").text(data.YOB);
            $("#cancel-edit-profile-btn").trigger("click");
           
            showNotificationModal("Success", "Your profile has been updated successfully.", "Great!");
        } catch (err: any) {
            displayErrors($profileEditForm, err.responseJSON);
        }
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

    $passwordChangeForm.on("submit", async function (e) {
        e.preventDefault();
        const formData = {
            oldPassword: $(this).find('input[name="oldPassword"]').val() as string,
            newPassword: $(this).find('input[name="newPassword"]').val() as string,
            confirmNewPassword: $(this).find('input[name="confirmNewPassword"]').val() as string,
        };

        displayErrors($passwordChangeForm, {});

        try {
            await callApi({
                url: "/api/auth/change-password",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
            });
           
            showNotificationModal("Success", "Your password has been changed successfully.", "OK");
            $("#cancel-change-password-btn").trigger("click");
        } catch (err: any) {
            displayErrors($passwordChangeForm, err.responseJSON);
        }
    });
};