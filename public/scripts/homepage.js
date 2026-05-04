const imgContainer = document.getElementById("imgContainer");
const imgDialog = document.getElementById("imgDialog");
const mockupImagesDiv = document.getElementById("mockupImagesDiv");

mockupImagesDiv.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    const imgSrc = event.target.getAttribute("src");
    const imgAlt = event.target.getAttribute("alt");

    imgContainer.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}">`;
    imgDialog.showModal();
  }
}
);
