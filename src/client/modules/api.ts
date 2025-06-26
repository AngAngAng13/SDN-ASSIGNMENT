import $ from "jquery";

declare global {
  namespace JQuery {
    interface AjaxSettings {
      _retry?: boolean;
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};


export const callApi = (options: JQuery.AjaxSettings): Promise<any> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("accessToken");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const ajaxSettings: JQuery.AjaxSettings = {
      ...options,
      headers: headers,
      xhrFields: {
        withCredentials: true,
        ...options.xhrFields,
      },
      
      success: (data, ) => {
        resolve(data);
      },
      
      error: (jqXHR) => {
       
        if (jqXHR.status === 401 && !options._retry) {
          console.log("Access token expired. Attempting to refresh...");

          $.ajax({
            url: "/api/auth/refresh",
            method: "POST",
            xhrFields: { withCredentials: true },
            success: (response) => {
              console.log("Token refreshed successfully.");
              localStorage.setItem("accessToken", response.accessToken);

              
              const newOptions: JQuery.AjaxSettings = { ...options, _retry: true };

             
              callApi(newOptions).then(resolve).catch(reject);
            },
            error: (refreshError) => {
              console.error("Refresh token invalid. Logging out.");
              handleLogout();
              reject(refreshError);
            },
          });
        } else {
          reject(jqXHR);
        }
      },
    };

    $.ajax(ajaxSettings);
  });
};
