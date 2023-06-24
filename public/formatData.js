/**
* Description: formats incoming biketrip json data
*/

window.formatData = function(item) {
  let div = document.createElement('div');
  div.className = "item";

  let details = document.createElement('p');

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

  details.innerHTML = `${item.departureStationName} -> ${item.returnStationName}<br />` +
  `${item.departureTime} -> ${item.returnTime}<br />` +
  `Distance: ${(item.coveredDistanceMeters / 1000).toFixed(2)}km. Duration: ${formattedDuration}`;
  
  div.appendChild(details);

  return div;
};
