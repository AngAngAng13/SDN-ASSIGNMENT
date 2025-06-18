import $ from "jquery";

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
    $.ajax({
      url: "/api/members/me",
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      success: function (user) {
        const comments = $(".comment-author"); 
        const hasCommented = Array.from(comments).some((c) => $(c).data("author-id") === user._id);

        if (!hasCommented) {
          $addCommentContainer.removeClass("hidden");
        }
      },
      error: function () {
        
        console.log("Not logged in or token expired.");
      },
    });
  }

  $commentForm.on("submit", function (event) {
    event.preventDefault();

    if (!accessToken) {
      alert("You must be logged in to comment.");
      return (window.location.href = "/login");
    }

    const rating = $(this).find('input[name="rating"]:checked').val();
    const content = $(this).find('textarea[name="content"]').val();

    $.ajax({
      url: `/api/players/${playerId}/comments`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      xhrFields: {
        withCredentials: true,
      },
      data: JSON.stringify({ rating: Number(rating), content }),
      success: function () {
        alert("Comment submitted successfully!");
        window.location.reload(); 
      },
      error: function (jqXHR) {
        const errorMsg = jqXHR.responseJSON?.message || "Failed to submit comment.";
        alert(`Error: ${errorMsg}`);
      },
    });
  });
};
