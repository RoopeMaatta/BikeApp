/**
* Description: Set user input to use the fetchtrips api
*/



  // Gather user input into params object
  let inputs = [
    {id: 'departureStationIds', type: 'array', emptyValue: '', isTagContainer: true},
    {id: 'returnStationIds', type: 'array', emptyValue: '', isTagContainer: true},
    {id: 'departureDate', type: 'string', emptyValue: ''},
    {id: 'departureTimeMin', emptyValue: '', type: 'time' },
    {id: 'departureTimeMax', emptyValue: '', type: 'time' },
    {id: 'returnDate', type: 'string', emptyValue: ''},
    {id: 'returnTimeMin', emptyValue: '', type: 'time' },
    {id: 'returnTimeMax', emptyValue: '', type: 'time' },
    {id: 'coveredDistanceMetersMin', type: 'number', emptyValue: ''},
    {id: 'coveredDistanceMetersMax', type: 'number', emptyValue: ''},
    {id: 'durationHoursMin', type: 'number', emptyValue: ''},
    {id: 'durationMinutesMin', type: 'number', emptyValue: ''},
    {id: 'durationSecondsMin', type: 'number', emptyValue: ''},
    {id: 'durationHoursMax', type: 'number', emptyValue: ''},
    {id: 'durationMinutesMax', type: 'number', emptyValue: ''},
    {id: 'durationSecondsMax', type: 'number', emptyValue: ''},
    {id: 'pageNumber', type: 'number', emptyValue: 1},
    {id: 'pageSize', type: 'number', emptyValue: 50},
  ];


function fetchTrips() {
  // Create a new URL object
  let url = new URL('/api/findTrips', window.location.origin);
  
  
  let params = {};
  
  inputs.forEach(input => {
    if (input.isTagContainer) {
      let tagContainer = document.getElementById(input.id);
      let tagElements = Array.from(tagContainer.getElementsByClassName('tag'));
      let idValues = tagElements.map(tag => Number(tag.dataset.id));
      params[input.id.replace('selected-', '')] = idValues;
    } else {
      let inputValue = document.getElementById(input.id).value;
      if (inputValue !== input.emptyValue) {
        if (input.id.includes('Date')) {
          params[input.id] = inputValue;
        } else if (input.id.includes('Time')) {
          params[input.id] = inputValue;
        } else if (input.type === 'number') {
          params[input.id] = Number(inputValue);
        } else if (input.id.startsWith('duration')) {
          let baseId = input.id.replace(/Hours|Minutes|Seconds/g, '');
              
          let hours = Number(document.getElementById(baseId + 'Hours').value) || 0;
          let minutes = Number(document.getElementById(baseId + 'Minutes').value) || 0;
          let seconds = Number(document.getElementById(baseId + 'Seconds').value) || 0;
              
          let totalSeconds = hours * 3600 + minutes * 60 + seconds;
          params[baseId] = totalSeconds;
        } else {
          params[input.id] = inputValue;
        }
      }
    }
  });
  
  
  
  
  
  
  console.log('Initial url:', url);
  console.log('Initial params:', params);
  
  // Add each parameter to the URL
  for (let key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => url.searchParams.append(key + '[]', value));
    } else {
      url.searchParams.append(key, params[key]);
    }
  }
  
  
  console.log('Final url:', url);
  
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log('Response received:', response);
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
    if (data.errors) {
      console.log('Error details:', data.errors);
    } else {
      // Get a reference to the results div
      let resultsDiv = document.getElementById('results');
      let entryCountDiv = document.getElementById('entryCount');
      
      // Clear the current contents of the results div
      resultsDiv.innerHTML = '';
      //console.log('formatData:', window.formatData);

      data.data[0].forEach(item => {
        let formattedItem = formatData(item);
        resultsDiv.appendChild(formattedItem);
      });
      //console.log('formatData:', window.formatData);

      let paginationMetadata = data.pagination;
      
      // Update the entry count div
      let start = paginationMetadata.pageSize * (paginationMetadata.currentPage - 1) + 1;
      let end = Math.min(start + paginationMetadata.pageSize - 1, paginationMetadata.totalRecords);
      entryCountDiv.textContent = `Showing ${start}-${end} of ${paginationMetadata.totalRecords} entries`;
      
      // Maximum number of pages
      let maxPageNumber = Math.ceil(paginationMetadata.totalRecords / end)
      document.getElementById("pageNumberMax").textContent = `/ ${maxPageNumber}`

      // Update the page navigation controls based on the paginationMetadata
      let prevButton = document.getElementById('prevPageButton');
      let nextButton = document.getElementById('nextPageButton');
      
      // Disable the "Previous Page" button if we're on the first page
      prevButton.disabled = paginationMetadata.currentPage === 1;
      
      // Disable the "Next Page" button if we're on the last page
      nextButton.disabled = paginationMetadata.currentPage === paginationMetadata.totalPages;
      
      
    }
  })
  
  .catch((error) => {
    console.error('Error:', error);
  });
};

document.getElementById('resetSearch').addEventListener('click', resetSearch);
function resetSearch() {
  inputs.forEach(input => {
    let element = document.getElementById(input.id);
    if (input.isTagContainer) {
      element.innerHTML = '';
    } else {
      element.value = input.emptyValue;
    }
  });
  
  // Clear the current contents of the results div
  document.getElementById('results').innerHTML = '';
  document.getElementById('entryCount').textContent = '';
}


// enter key stroke activates query search
document.addEventListener('keydown', enterPressed);
function enterPressed(event) {
  // Check if 'Enter' was pressed when not in any input field
  if (event.key === 'Enter' ) {     // && document.activeElement.tagName !== 'INPUT') {
      // If so, trigger the button click
      document.getElementById('findTripsButton').click();
  }
}

document.getElementById('findTripsButton').addEventListener('click', function() {
  // Reset the page number to 1
  document.getElementById('pageNumber').value = 1;
  // Perform the fetch operation
  fetchTrips();
});

document.getElementById('prevPageButton').addEventListener('click', function() {
  let pageNumberInput = document.getElementById('pageNumber');
  pageNumberInput.value = Math.max(Number(pageNumberInput.value) - 1, 1);
  
  // Perform the fetch operation
  fetchTrips();
});

document.getElementById('nextPageButton').addEventListener('click', function() {
  let pageNumberInput = document.getElementById('pageNumber');
  pageNumberInput.value = Number(pageNumberInput.value) + 1;
  
  // Perform the fetch operation
  fetchTrips();
});

