import { sendFormData, addError, clearError } from "./aux.js";

//Folders

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
      addError(folderName, folderNameError, e.msg);
    }
  }
});

//Files

const fileForm = document.getElementById("fileForm");

const file = document.getElementById("file");
const fileError = document.getElementById("fileError");

fileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(file, fileError);

  const errors = await sendFormData(
    e,
    `/files/add/${folderId}/file`,
    "POST",
    `/files/${folderId}`,
  );
  if (errors) {
    for (const e of errors) {
      addError(file, fileError, e.msg);
    }
  }
});

