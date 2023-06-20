/**
* Description: formats incoming biketrip json data
*/

window.formatData = function(item) {
  //  function formatData(item) {
  
  console.log('Item:', item);
  
  let div = document.createElement('div');
  div.className = "item"; // set class name
  
  let details = document.createElement('p');
  details.innerHTML = `${item.departureStationName} -> ${item.returnStationName}<br />` +
  `${item.departureTime} -> ${item.returnTime}<br />` +
  `Distance: ${(item.coveredDistanceMeters / 1000).toFixed(2)}km. Duration: ${Math.floor(item.durationSeconds / 60)}min${item.durationSeconds % 60}s`;
  div.appendChild(details);
  
  return div;
  
  
};

//export { formatData };
