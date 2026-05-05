export async function sendFormData(event, fetchUrl, method, redirectUrl, submitBtn = null) {
  if (submitBtn) {
    submitBtn.disabled = true;
  }

  const formElement = event.target;
  const formData = new FormData(formElement);

  // Check if form has a file input. 
  // If it does, send raw FormData. If not, fallback to URLSearchParams
  const hasFile = formElement.querySelector("input[type='file']");
  const body = hasFile ? formData : new URLSearchParams(formData);


  const response = await customFetch(fetchUrl, method, redirectUrl, body, null);
  let toReturn = null;
  if (response && response.errors) {
    toReturn =  response.errors;

    //We enable the submit only if there is an error, otherwise the page will reload and it would be pointless
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  } 
  
  return toReturn;
}

export async function customFetch(fetchUrl, method, redirectUrl, body = null, submitbtn = null) {
  if (submitbtn) {
    submitbtn.disabled = true;
  }
  
  try {

    const response = await fetch(fetchUrl, {
      method: method,
      body,
    });

    if (response.ok) {
      window.location.href = redirectUrl;
      return null;
    } else {
      const errorData = await response.json();

      //We enable the submit only if there is an error, otherwise the page will reload and it would be pointless
      if (submitbtn) {
      submitbtn.disabled = false;
      }

      return errorData;
    }
  } catch (error) {
    console.error("Error:", error);

    //We enable the submit only if there is an error, otherwise the page will reload and it would be pointless
    if (submitbtn) {
      submitbtn.disabled = false;
    }

    return error;
  }
}

export function addError(input, errorContainer, msg) {
  errorContainer.textContent = msg;
  input.classList.add("errorInput");
  input.setAttribute("aria-invalid", "true");
}

export function clearError(input, errorContainer) {
  errorContainer.textContent = "";
  input.classList.remove("errorInput");
  input.removeAttribute("aria-invalid");
}