import { sendFormData, addError, clearError, customFetch } from "./aux.js";

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
    `/files/${folderId}/folder`,
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
    `/files/${folderId}/folder`,
  );
  if (errors) {
    for (const e of errors) {
      addError(file, fileError, e.msg);
    }
  }
});

// Custom menu
const menu = document.getElementById("customMenu");
const folderContentContainer = document.getElementById(
  "folderContentContainer",
);

folderContentContainer.addEventListener("contextmenu", (e) => {
  //if (e.target.classList.contains('file-container')) return;

  // Whe get the nearest file-container from where the user clicked (usually should be the parent article of the element the user clicked)
  const clickedItem = e.target.closest(".file-container");

  if (clickedItem) {
    // Now we save the id of the file/folder and type on the menu data-id and data-type attribute for future use
    e.preventDefault();
    const id = clickedItem.dataset.id;
    const type = clickedItem.dataset.type;
    const name = clickedItem.dataset.name;
    const extension = clickedItem.dataset.extension;

    menu.setAttribute("data-id", id);
    menu.setAttribute("data-type", type);
    menu.setAttribute("data-name", name);

    if (extension) menu.setAttribute("data-extension", extension);

    // Show the menu
    menu.style.display = "block";
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
  }
});

//If user clicks anywhere else we hide the menu
document.addEventListener("click", () => {
  menu.style.display = "none";
});

//When Delete Modal opens
const openDeleteModalBtn = document.getElementById("openDeleteModalBtn");
const fileToDeleteSpan = document.getElementById("fileToDeleteName");

openDeleteModalBtn.addEventListener("click", () => {
  const fileName = menu.dataset.name;
  const extension = menu.dataset.extension;
  fileToDeleteSpan.textContent = extension ? fileName + extension : fileName;
});

// Delete confirmation
const confirmDelete = document.getElementById("confirmDelete");

confirmDelete.addEventListener("click", async () => {
  const id = menu.dataset.id;
  const type = menu.dataset.type;

  if (type === "file" || type === "folder") {
    const res = await customFetch(
      `/files/delete/${id}/${type}`,
      "DELETE",
      window.location.href,
    );
  }
});

//When Update folder/file opens
const openUpdateModalBtn = document.getElementById("openUpdateModalBtn");
const newNameInput = document.getElementById("newName");
const newNameError = document.getElementById("newNameError");

openUpdateModalBtn.addEventListener("click", () => {
  const fileName = menu.dataset.name;
  newNameInput.value = fileName;
});

//Update confirmation
const updateForm = document.getElementById("updateForm");

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
    );
    if (errors) {
      for (const e of errors) {
        addError(newNameInput, newNameError, e.msg);
      }
    }
  }
});
