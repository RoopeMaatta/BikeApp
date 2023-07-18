/**
* Description: formats incoming biketrip json data
*/

//window.formatData = function(item) {
  export function formatData(item, isFirstItem = false) {
  let div = document.createElement('div');
  
    // First item is the average trip
    if (isFirstItem) {
      div.className = "grid-item average-trip grid-item-full-width";
    } else {
      div.className = "grid-item";
    }


  let seconds = item.durationSeconds;
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let formattedDuration;
  if (hours > 0) {
    formattedDuration = `${hours}h ${minutes}min ${seconds}s`;
  } else if (minutes > 0) {
    formattedDuration = `${minutes}min ${seconds}s`;
  } else {
    formattedDuration = `${seconds}s`;
  }

  div.innerHTML = 
  `<div>${item.departureStationName} -> ${item.returnStationName}</div>` +
  `<div>${item.departureTime} -> ${item.returnTime}</div>` +
  `<div>Distance: ${(item.coveredDistanceMeters / 1000).toFixed(2)}km. Duration: ${formattedDuration}</div>`;
  
  if (isFirstItem) { div.innerHTML = `<h3 class="grid-item-full-width">Average trip</h3>`+ div.innerHTML }

 // div.appendChild(tripDetailsDiv);

  return div;
};

//format number into K / M ending with one desimal
export function formatBigNumber(num) {
  if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
};