/**
 * Description: Suggests station names on input
 */


function getSelectedStations() {
  const tags = document.querySelectorAll('#selected-stations .tag');
  const selectedStations = Array.from(tags).map(tag => ({
    name: tag.childNodes[0].textContent,  // get textContent of the first child node (station name)
    id: tag.dataset.id  // get the data-id attribute of the tag (station ID)
  }));
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
    for (const station of stationNames) {
      const option = document.createElement('option');
      option.value = station.name;  // Set the visible value to the station's name
      option.dataset.id = station.id;  // Store the station's ID in a data attribute
      dataList.appendChild(option);
    }
  }, 0); // Fetch suggestions x ms after the user stops typing
});


// If input field matches suggestion field add to tag
// not optimal but workaround with datalist.
// NEW: Listen for changes to the input field
stationInput.addEventListener('input', () => {
  const currentValue = stationInput.value.trim();
  // add the current value to the selected stations, if it's in the list of last suggestions
  if (currentValue !== '' && lastSuggestions.some(station => station.name === currentValue)) {
    const matchingStation = lastSuggestions.find(station => station.name === currentValue);  // Find the matching station

    const tag = document.createElement('span');
    tag.textContent = currentValue;
    tag.classList.add('tag');
    tag.dataset.id = matchingStation.id;  // Store the station's ID in a data attribute

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