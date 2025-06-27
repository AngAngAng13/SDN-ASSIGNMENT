import $ from "jquery";
import { showConfirmationModal, showNotificationModal, showErrorModal } from "./modal.js";
import { callApi } from "./api.js";

export const initAdminDashboard = () => {
  const $page = $("#admin-tabs");
  if ($page.length === 0) return;

  const $tabs = $page.find(".tab");
  const $teamsContent = $("#teams-content");
  const $playersContent = $("#players-content");

  const $teamFormCard = $("#team-form-card");
  const $teamForm = $("#team-form");

  const $playerFormCard = $("#player-form-card");
  const $playerForm = $("#player-form");

  const hideForms = () => {
    $teamFormCard.addClass("hidden");
    ($teamForm[0] as HTMLFormElement).reset();
    $teamForm.find('[name="teamId"]').val("");

    $playerFormCard.addClass("hidden");
    ($playerForm[0] as HTMLFormElement).reset();
    $playerForm.find('[name="playerId"]').val("");
  };

  $tabs.on("click", function () {
    const tabName = $(this).data("tab");
    $tabs.removeClass("tab-active");
    $(this).addClass("tab-active");
    hideForms();

    $teamsContent.toggleClass("hidden", tabName !== "teams");
    $playersContent.toggleClass("hidden", tabName !== "players");
  });

  $("#add-team-btn").on("click", () => {
    hideForms();
    $teamForm.find("#team-form-title").text("Add New Team");
    $teamForm.find("#team-form-submit-btn").text("Add Team");
    $teamFormCard.removeClass("hidden");
  });

  $teamsContent.on("click", ".edit-team-btn", function () {
    hideForms();
    const $card = $(this).closest(".card");
    const teamId = $card.data("team-id");
    const teamName = $card.data("team-name");
    $teamFormCard[0].scrollIntoView({ behavior: "smooth", block: "start" });

    $teamForm.find("#team-form-title").text("Edit Team");
    $teamForm.find('[name="teamId"]').val(teamId);
    $teamForm.find('[name="teamName"]').val(teamName);
    $teamForm.find("#team-form-submit-btn").text("Update Team");
    $teamFormCard.removeClass("hidden");
  });

  $teamsContent.on("click", ".delete-team-btn", async function () {
    const $card = $(this).closest(".card");
    const teamId = $card.data("team-id");
    const teamName = $card.data("team-name");
    const playerCount = parseInt($card.data("player-count"), 10);

    let confirmationMessage = `Are you sure you want to delete the team "${teamName}"?`;
    if (playerCount > 0) {
      confirmationMessage += `\n\nThis action is irreversible and will also permanently delete the <strong>${playerCount} player(s)</strong> associated with this team.`;
    }

    const confirmed = await showConfirmationModal("Confirm Deletion", confirmationMessage, "Yes, Delete");

    if (!confirmed) return;

    try {
      const response = await callApi({
        url: `/api/teams/${teamId}`,
        method: "DELETE",
      });
      showNotificationModal("Success", response.message || "Team deleted successfully!");
    } catch (err: any) {
      showErrorModal(err.responseJSON?.message || "Could not delete team.");
    }
  });

  $teamForm.on("submit", async function (e) {
    e.preventDefault();
    console.log("Submitting team form...");
    const $submitBtn = $(this).find("#team-form-submit-btn");
    const teamId = $(this).find('[name="teamId"]').val();
    const teamName = $(this).find('[name="teamName"]').val();
    const isEditing = !!teamId;

    const url = isEditing ? `/api/teams/${teamId}` : "/api/teams";
    const method = isEditing ? "PUT" : "POST";

    try {
      $submitBtn.addClass("loading").prop("disabled", true);

      await callApi({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify({ teamName }),
      });
      showNotificationModal("Success", `Team ${isEditing ? "updated" : "added"}!`);
    } catch (err: any) {
      showErrorModal(err.responseJSON?.errors?.teamName || err.responseJSON?.message || "Could not save team.");
    } finally {
      $submitBtn.removeClass("loading").prop("disabled", false);
    }
  });

  $("#team-form-cancel-btn").on("click", hideForms);

  $("#add-player-btn").on("click", () => {
    hideForms();
    $playerForm.find("#player-form-title").text("Add New Player");
    $playerForm.find("#player-form-submit-btn").text("Add Player");
    $playerFormCard.removeClass("hidden");
    $playerFormCard[0].scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $playersContent.on("click", ".edit-player-btn", function () {
    hideForms();
    const playerData = $(this).closest("tr").data("player");

    $playerForm.find("#player-form-title").text("Edit Player");
    $playerForm.find('[name="playerId"]').val(playerData._id);
    $playerForm.find('[name="playerName"]').val(playerData.playerName);
    $playerForm.find('[name="team"]').val(playerData.team._id);
    $playerForm.find('[name="image"]').val(playerData.image);
    $playerForm.find('[name="cost"]').val(playerData.cost);
    $playerForm.find('[name="information"]').val(playerData.information);
    $playerForm.find('[name="isCaptain"]').prop("checked", playerData.isCaptain);
    $playerForm.find("#player-form-submit-btn").text("Update Player");
    $playerFormCard.removeClass("hidden");
    $playerFormCard[0].scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $playersContent.on("click", ".delete-player-btn", async function () {
    const confirmed = await showConfirmationModal(
      "Confirm Deletion",
      "Are you sure you want to delete this player?",
      "Yes, Delete"
    );
    if (!confirmed) return;

    const playerId = $(this).closest("tr").data("player")._id;
    try {
      await callApi({
        url: `/api/players/${playerId}`,
        method: "DELETE",
      });
      showNotificationModal("Success", "Player deleted!");
    } catch (err: any) {
      showErrorModal(err.responseJSON?.message || "Could not delete player.");
    }
  });

  $playerForm.on("submit", async function (e) {
    e.preventDefault();
    const playerId = $(this).find('[name="playerId"]').val();
    const playerData = {
      playerName: $(this).find('[name="playerName"]').val(),
      team: $(this).find('[name="team"]').val(),
      image: $(this).find('[name="image"]').val(),
      cost: Number($(this).find('[name="cost"]').val()),
      information: $(this).find('[name="information"]').val(),
      isCaptain: $(this).find('[name="isCaptain"]').is(":checked"),
    };

    const isEditing = !!playerId;
    const url = isEditing ? `/api/players/${playerId}` : "/api/players";
    const method = isEditing ? "PUT" : "POST";

    try {
      await callApi({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(playerData),
      });
      showNotificationModal("Success", `Player ${isEditing ? "updated" : "added"}!`);
    } catch (err: any) {
      showErrorModal(err.responseJSON?.message || "Could not save player.");
    }
  });

  $("#player-form-cancel-btn").on("click", hideForms);
};
