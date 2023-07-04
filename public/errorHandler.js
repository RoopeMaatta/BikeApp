/**
 * Description: Communicates error to html
 */


export function displayError(error) {
  const errorMessageDiv = document.getElementById('error-message');
  
  if (error && Array.isArray(error) && error.length > 0) {
    const errorMessages = error.map(err => err.msg).join(', ');
    errorMessageDiv.textContent = `Errors occurred: ${errorMessages}`;
  } else {
    errorMessageDiv.textContent = 'An unknown error occurred';
  }
  errorMessageDiv.style.display = 'block';
}


  
  export function hideError() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';
  }
  