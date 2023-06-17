/**
 * Description: Suggests station names on input
 */



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

    if (currentValue !== '' && lastSuggestions.includes(currentValue)) {  // UPDATED: check if currentValue is in lastSuggestions
      const tag = document.createElement('span');
      tag.textContent = currentValue;
      tag.classList.add('tag');
    
      // Create button for removing tag
      const removeButton = document.createElement('button');
      removeButton.textContent = 'x';
      removeButton.classList.add('remove-button');
      tag.appendChild(removeButton);
      
      selectedStationsContainer.appendChild(tag);
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