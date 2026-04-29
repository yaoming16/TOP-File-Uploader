// Custom menu
const menu = document.getElementById("customMenu");
const folderContentContainer = document.getElementById(
  "folderContentContainer",
);

//Function to open the options menu
function openOptionsMenu(e) {
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
}

folderContentContainer.addEventListener("contextmenu", openOptionsMenu);

//If user clicks anywhere else we hide the menu
document.addEventListener("click", (e) => {
  //Close only if already visible and clicked DOM element isnt the button to open the menu 
  if (menu.style.display === "block" && !e.target.classList.contains("optionsBtn")) {
    menu.style.display = "none";
  }
});

//When Delete Modal opens
const openDeleteModalBtn = document.getElementById("openDeleteModalBtn");
const fileToDeleteSpan = document.getElementById("fileToDeleteName");

openDeleteModalBtn.addEventListener("click", () => {
  const fileName = menu.dataset.name;
  const extension = menu.dataset.extension;
  fileToDeleteSpan.textContent = extension ? fileName + extension : fileName;
});

//When Update folder/file opens
const openUpdateModalBtn = document.getElementById("openUpdateModalBtn");
const newNameInput = document.getElementById("newName");
const newNameError = document.getElementById("newNameError");

openUpdateModalBtn.addEventListener("click", () => {
  const fileName = menu.dataset.name;
  newNameInput.value = fileName;
});

//Open options menu using the on screen Btn
folderContentContainer.addEventListener("click", (e) => {

  if (e.target.classList.contains("optionsBtn")) {
    openOptionsMenu(e);
  }
});
