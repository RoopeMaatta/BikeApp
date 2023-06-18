/**
 * createSuggestions creates an autocomplete input field with a list of suggestions.
 *
 * @param {string} inputElementId - The ID of the input field to add autocomplete functionality.
 * @param {string} suggestionsUrl - The URL of the API endpoint to fetch suggestions.
 * @param {string} selectedContainerId - The ID of the element where selected items from the autocomplete will be added.
 *
 * @returns {void}
 */


function createSuggestions(inputElementId, suggestionsUrl, selectedContainerId) {
  let timer;  // Timer to delay suggestion fetching
  const inputElement = document.getElementById(inputElementId);  // Input field
  const selectedContainer = document.getElementById(selectedContainerId);  // Container for selected items
  let lastSuggestions = [];  // Array to store the latest suggestions

  // Event listener for when the user types in the input field
  inputElement.addEventListener('input', (event) => {
    // Clear any previous timeout
    if (timer) {
      clearTimeout(timer);
    }

    // Delay suggestion fetching until the user stops typing
    timer = setTimeout(async () => {
      // Clear out the old suggestions
      const dataList = inputElement.list;
      dataList.innerHTML = '';

      // Create URL with user input as query parameter
      let url = new URL(suggestionsUrl, window.location.origin);
      const currentInputValue = inputElement.value.trim();
      let params = {
        q: currentInputValue
      };
      for (let key in params) {
        url.searchParams.append(key, params[key]);
      }

      // Fetch the suggestions from the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const suggestions = await response.json();

      // Store the latest suggestions
      lastSuggestions = suggestions;

      // Populate the datalist with the new suggestions
      for (const suggestion of suggestions) {
        const option = document.createElement('option');
        option.value = suggestion.name;
        option.dataset.id = suggestion.id;
        dataList.appendChild(option);
      }
    }, 0);
  });

  // Event listener for when the user selects a suggestion
  inputElement.addEventListener('input', () => {
    const currentValue = inputElement.value.trim();
    // If the current value is in the list of suggestions, add it to the selected items
    if (currentValue !== '' && lastSuggestions.some(suggestion => suggestion.name === currentValue)) {
      const matchingSuggestion = lastSuggestions.find(suggestion => suggestion.name === currentValue);

      // Create a new tag for the selected item and append it to the selected container
      const tag = document.createElement('span');
      tag.textContent = currentValue;
      tag.classList.add('tag');
      tag.dataset.id = matchingSuggestion.id;

      // Add a remove button to the tag
      const removeButton = document.createElement('button');
      removeButton.textContent = 'x';
      removeButton.classList.add('remove-button');
      tag.appendChild(removeButton);

      selectedContainer.appendChild(tag);
      inputElement.value = '';
    }
  });

  // Event listener for when the user clicks on the remove button of a selected item
  selectedContainer.addEventListener('click', (event) => {
    if (event.target.matches('.remove-button')) {
      event.target.parentNode.remove();
    }
  });
}
