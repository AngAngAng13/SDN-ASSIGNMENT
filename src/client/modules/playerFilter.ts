import $ from "jquery";

export const initPlayerFilters = () => {
  const $searchInput = $("#player-search");
  const $teamFilter = $("#team-filter");
  const $captainFilter = $("#captain-filter");
  const $clearButton = $("#clear-filters");
  const $playerGrid = $("#player-grid");
  const $playerCards = $(".player-card");
  const $playerCount = $("#player-count");
  const $noResultsMessage = $("#no-results-message");

  function filterPlayers() {
    const searchTerm = String($searchInput.val() ?? "").toLowerCase();
    const selectedTeam = $teamFilter.val();
    const captainsOnly = $captainFilter.is(":checked");

    let visibleCount = 0;

    $playerCards.each(function () {
      const $card = $(this);
      const playerName = $card.data("player-name");
      const teamId = $card.data("team-id");
      const isCaptain = $card.data("is-captain");

      const matchesSearch = playerName.includes(searchTerm);
      const matchesTeam = !selectedTeam || teamId === selectedTeam;
      const matchesCaptain = !captainsOnly || isCaptain;

      if (matchesSearch && matchesTeam && matchesCaptain) {
        $card.removeClass("hidden");
        visibleCount++;
      } else {
        $card.addClass("hidden");
      }
    });

    $playerCount.text(visibleCount);
    $noResultsMessage.toggleClass("hidden", visibleCount > 0);
    $playerGrid.toggleClass("hidden", visibleCount === 0);

    const isFiltered = searchTerm || selectedTeam || captainsOnly;
    $clearButton.toggleClass("hidden", !isFiltered);
  }

  function clearFilters() {
    $searchInput.val("");
    $teamFilter.val("");
    $captainFilter.prop("checked", false);
    filterPlayers();
  }

  $searchInput.on("input", filterPlayers);
  $teamFilter.on("change", filterPlayers);
  $captainFilter.on("change", filterPlayers);
  $clearButton.on("click", clearFilters);
};
