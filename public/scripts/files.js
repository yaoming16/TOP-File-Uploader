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

// Open Delete Modal
const deleteModal = document.getElementById("deleteModal");
const openDeleteModalBtn = document.getElementById("openDeleteModalBtn");
const fileToDeleteSpan = document.getElementById("fileToDeleteName");

openDeleteModalBtn.addEventListener("click", () => {
  const fileName = menu.dataset.name;
  const extension = menu.dataset.extension;
  fileToDeleteSpan.textContent = extension? fileName + extension : fileName;
})


// Delete Modal
