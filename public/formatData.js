/**
* Description: formats incoming biketrip json data
*/

//window.formatData = function(item) {
  export function formatData(item) {
  let div = document.createElement('div');
  div.className = "grid-item";


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


  return div;
};

