import { sendFormData, addError, clearError, customFetch } from "./aux.js";

//Folders
const folderForm = document.getElementById("folderForm");
const folderId = folderForm.dataset.folderId;

const folderName = document.getElementById("folderName");
const folderNameError = document.getElementById("folderNameError");
const createFolderBtn = document.getElementById("createFolderBtn");

folderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(folderName, folderNameError);

  const errors = await sendFormData(
    e,
    `/files/add/${folderId}/folder`,
    "POST",
    `/files/${folderId}/folder`,
    createFolderBtn
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
const uploadFileBtn = document.getElementById("uploadFileBtn");

fileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(file, fileError);

  const errors = await sendFormData(
    e,
    `/files/add/${folderId}/file`,
    "POST",
    `/files/${folderId}/folder`,
    uploadFileBtn
  );
  if (errors) {
    for (const e of errors) {
      addError(file, fileError, e.msg);
    }
  }
});

// Delete confirmation
const confirmDelete = document.getElementById("confirmDelete");
const menu = document.getElementById("customMenu");

confirmDelete.addEventListener("click", async () => {
  const id = menu.dataset.id;
  const type = menu.dataset.type;

  if (type === "file" || type === "folder") {
    const res = await customFetch(
      `/files/delete/${id}/${type}`,
      "DELETE",
      window.location.href,
      confirmDelete
    );
  }
});

//Update confirmation
const updateForm = document.getElementById("updateForm");
const newNameInput = document.getElementById("newName");
const newNameError = document.getElementById("newNameError");
const confirmUpdate = document.getElementById("confirmUpdate");

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(newNameInput, newNameError);

  const id = menu.dataset.id;
  const type = menu.dataset.type;

  if (type === "file" || type === "folder") {
    const errors = await sendFormData(
      e,
      `/files/update/${id}/${type}`,
      "PUT",
      window.location.href,
      confirmUpdate
    );
    if (errors) {
      for (const e of errors) {
        addError(newNameInput, newNameError, e.msg);
      }
    }
  }
});