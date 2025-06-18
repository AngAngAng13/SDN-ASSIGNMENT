import $ from "jquery";

const handleLogout = () => {
  $.ajax({
    url: "/api/auth/logout",
    method: "DELETE",
    xhrFields: {
      withCredentials: true,
    },
    complete: () => {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    },
  });
};

export const initAuthUI = () => {

  $("#logout-button").on("click", (event) => {
    event.preventDefault();
    handleLogout();
  });
};
