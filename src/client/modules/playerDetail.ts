import $ from "jquery";
import { showNotificationModal, showErrorModal } from "./modal.js";
import { callApi } from "./api.js";

export const initPlayerDetailPage = () => {
    if ($("#comment-form").length === 0) {
        return;
    }

    const $addCommentContainer = $("#add-comment-container");
    const $addCommentBtn = $("#add-comment-btn");
    const $commentFormCard = $("#comment-form-card");
    const $cancelBtn = $("#cancel-comment-btn");
    const $commentForm = $("#comment-form");

    const accessToken = localStorage.getItem("accessToken");
    const playerId = window.location.pathname.split("/").pop();

    $addCommentBtn.on("click", () => $commentFormCard.removeClass("hidden"));
    $cancelBtn.on("click", () => $commentFormCard.addClass("hidden"));

    if (accessToken) {
        callApi({ url: "/api/members/me", method: "GET" })
        .then((user) => {
            const comments = $(".comment-author");
            const hasCommented = Array.from(comments).some((c) => $(c).data("author-id") === user._id);
            if (!hasCommented) {
                $addCommentContainer.removeClass("hidden");
            }
        })
        .catch(() => {
            
            console.log("Not logged in or token expired.");
        });
    }

    $commentForm.on("submit", async function (event) {
        event.preventDefault();

        if (!localStorage.getItem("accessToken")) {
            
            showErrorModal("You must be logged in to comment.");
            setTimeout(() => window.location.href = "/login", 2000);
            return;
        }

        const rating = $(this).find('input[name="rating"]:checked').val();
        const content = $(this).find('textarea[name="content"]').val();

        try {
            await callApi({
                url: `/api/players/${playerId}/comments`,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ rating: Number(rating), content }),
            });
            showNotificationModal("Success!", "Your comment has been submitted successfully.");
        } catch (err: any) {
            const errorMsg = err.responseJSON?.errors?.content|| err.responseJSON?.message || "Failed to submit comment.";
            showErrorModal(errorMsg);
        }
    });
};