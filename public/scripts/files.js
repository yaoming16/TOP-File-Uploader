import { sendFormData, addError, clearError } from "./aux.js";

const folderForm = document.getElementById("folderForm");
const folderId = folderForm.dataset.folderId;

const folderName = document.getElementById("folderName");
const folderNameError = document.getElementById("folderNameError");

folderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(folderName, folderNameError);

  const errors = await sendFormData(
    e,
    `/files/add/${folderId}/folder`,
    "POST",
    `/files/${folderId}`,
  );
  if (errors) {
    for (const e of errors) {
      if (e.path === "folderName") {
        addError(folderName, folderNameError, e.msg);
      }
    }
  }
});
