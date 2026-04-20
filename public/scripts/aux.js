export async function sendFormData(event, fetchUrl, method, redirectUrl) {
  const formElement = event.target;
  const formData = new FormData(formElement);

  // Check if form has a file input. 
  // If it does, send raw FormData. If not, fallback to URLSearchParams
  const hasFile = formElement.querySelector("input[type='file']");
  const body = hasFile ? formData : new URLSearchParams(formData);

  const response = await customFetch(fetchUrl, method, redirectUrl, body);
  if (response && response.errors) {
    return response.errors;
  } else {
    return null;
  }
}

export async function customFetch(fetchUrl, method, redirectUrl, body = null) {
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
      return errorData;
    }
  } catch (error) {
    console.error("Error:", error);
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