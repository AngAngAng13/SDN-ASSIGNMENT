import $ from "jquery";

const $modal = $("#app-modal") as JQuery<HTMLDialogElement>;
const $title = $("#modal-title");
const $body = $("#modal-body");
const $actions = $("#modal-actions");


export const showConfirmationModal = (
  title: string,
  message: string,
  confirmText: string,
  cancelText: string = "Cancel"
): Promise<boolean> => {
  return new Promise((resolve) => {
    $title.text(title);
    $body.html(message.replace(/\n/g, "<br/>"));
    $actions.empty(); 

    const $confirmBtn = $(`<button class="btn btn-error">${confirmText}</button>`);
    const $cancelBtn = $(`<button class="btn btn-ghost">${cancelText}</button>`);

    $confirmBtn.on("click", () => {
      $modal[0].close();
      resolve(true);
    });

    $cancelBtn.on("click", () => {
      $modal[0].close();
      resolve(false);
    });

    $actions.append($cancelBtn, $confirmBtn);
    $modal[0].showModal();
  });
};


export const showNotificationModal = (title: string, message: string, buttonText: string = "OK"): void => {
  $title.text(title);
  $body.text(message);
  $actions.empty();

  const $okBtn = $(`<button class="btn btn-primary">${buttonText}</button>`);

 
  const handleOKClick = () => {
    $modal[0].close();
    location.reload(); 
    $okBtn.off("click", handleOKClick); 
  };

  $okBtn.on("click", handleOKClick);

  $actions.append($okBtn);
  $modal[0].showModal();
};


export const showErrorModal = (message: string): void => {
  $title.text("Error");
  $body.text(message);
  $actions.empty();

  const $closeBtn = $(`<button class="btn">Close</button>`);

  const handleCloseClick = () => {
    $modal[0].close();
    $closeBtn.off("click", handleCloseClick);
  };

  $closeBtn.on("click", handleCloseClick);

  $actions.append($closeBtn);
  $modal[0].showModal();
};
