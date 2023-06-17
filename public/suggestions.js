/**
 * Description: Suggests station names on input
 */


let timer;
const stationInput = document.getElementById('station-input');

stationInput.addEventListener('input', () => {
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
    let params = {
      q: stationInput.value
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

    // Populate the datalist with the new options
    for (const name of stationNames) {
      const option = document.createElement('option');
      option.value = name;
      dataList.appendChild(option);
    }
  }, 300); // Fetch suggestions 300 ms after the user stops typing
});

///////// Suggestions
