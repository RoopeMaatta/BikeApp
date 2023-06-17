/**
 * Description: Suggests station names on input
 */


function getSelectedStations() {
  const tags = document.querySelectorAll('#selected-stations .tag');
  const selectedStations = Array.from(tags).map(tag => tag.childNodes[0].textContent);  // get textContent of the first child node (station name)
  return selectedStations;
}

// Usage
//console.log(getSelectedStations());  // Will output an array of selected station names





// Populate datalist with suggestions fetch
let timer;
const stationInput = document.getElementById('station-input');
const selectedStationsContainer = document.getElementById('selected-stations');
let lastSuggestions = [];  // NEW: variable to store the latest list of suggestions

stationInput.addEventListener('input', (event) => {
  // Clear the previous timeout if it exists
  if (timer) {
    clearTimeout(timer);
  }

  // Set a new timeout
  timer = setTimeout(async () => {
    // Clear out the old options
    const dataList = document.getElementById('stations');
    dataList.innerHTML = '';

    // Create a new URL object
    let url = new URL('/api/suggestions', window.location.origin);

    // Gather user input into params object
    const currentInputValue = stationInput.value.trim();

    let params = {
      q: currentInputValue
    };

    // Add each parameter to the URL
    for (let key in params) {
      url.searchParams.append(key, params[key]);
    }

    // Make the HTTP request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const stationNames = await response.json();

    // NEW: update lastSuggestions
    lastSuggestions = stationNames;

    // Populate the datalist with the new options
    for (const name of stationNames) {
      const option = document.createElement('option');
      option.value = name;
      dataList.appendChild(option);
    }
  }, 100); // Fetch suggestions 100 ms after the user stops typing
});
stationInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    // add the current value to the selected stations, if it's in the list of last suggestions
    const currentValue = stationInput.value.trim();

    if (currentValue !== '' && lastSuggestions.includes(currentValue)) {  
      // Create a new tag (span) element
      const tag = document.createElement('span');
      tag.classList.add('tag');

      // NEW: Create a new text node for the tag name
      const tagName = document.createTextNode(currentValue);
      // NEW: Append the text node to the tag element
      tag.appendChild(tagName);

      // NEW: Create a new button element for removing the tag
      const removeButton = document.createElement('button');
      removeButton.textContent = 'x';
      removeButton.classList.add('remove-button');
      // NEW: Append the remove button to the tag element
      tag.appendChild(removeButton);

      // Append the complete tag element (including the remove button) to the selected stations container
      selectedStationsContainer.appendChild(tag);

      // clear the input
      stationInput.value = '';
    }
  }
});



// If input field matches suggestion field add to tag
// not optimal but workaround with datalist.
// NEW: Listen for changes to the input field
stationInput.addEventListener('input', () => {
  const currentValue = stationInput.value.trim();
  // add the current value to the selected stations, if it's in the list of last suggestions
  if (currentValue !== '' && lastSuggestions.includes(currentValue)) {
    const tag = document.createElement('span');
    tag.textContent = currentValue;
    tag.classList.add('tag');

    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.classList.add('remove-button');
    tag.appendChild(removeButton);

    selectedStationsContainer.appendChild(tag);
    stationInput.value = '';
  }
});

selectedStationsContainer.addEventListener('click', (event) => {
  if (event.target.matches('.remove-button')) {
    event.target.parentNode.remove();
  }
});