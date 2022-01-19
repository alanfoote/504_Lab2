mapboxgl.accessToken = 'pk.eyJ1IjoiYWZvb3RlIiwiYSI6ImNrNzJwbDNnMzA0dDEzbW9ua3V0dHVxajAifQ.FlxlFZJiRJyfh5eEwStItQ';
const apiKey = "AAPKb05d37dd2d6249d38bbe847c047eb17a6BlVIrcxsUC2--KtgDxIpSOU9k8CT2p0YBYj-MHNg_Cc8RzltygPTKjic3Taotn4";
const basemapEnum = "ArcGIS:Streets";
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v10', // stylesheet location; feel free to change this if you prefer another style, but choose something simple that includes the road network.
  center: [-122.4443, 47.2529], // starting position
  zoom: 10 // starting zoom
});
map.on('load', function() {
  map.addLayer({
    id: 'hospitals',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: hospitalPoints
    },
    layout: {
      'icon-image': 'hospital-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });
  map.addLayer({
    id: 'libraries',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: libraryPoints
    },
    layout: {
      'icon-image': 'library-15',
      'icon-allow-overlap': true
    },
    paint: {

 }

  }
    );
  map.addSource('nearest-hospital', {
   type: 'geojson',
   data: {
     type: 'FeatureCollection',
     features: [
     ]
   }
 });

});

var popup = new mapboxgl.Popup();

map.on('click', 'hospitals', function(e) {

  var feature = e.features[0];

  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('<h2><b>' + feature.properties.NAME + '</h2><br></b><h3> is located at <b>' +feature.properties.ADDRESS +'</b>.</h3>')
    .addTo(map);
});
map.on('click', 'libraries', function(f) {// Using Turf, find the nearest hospital to library clicked
  var refLibrary = f.features[0];
  var nearestHospital = turf.nearest(refLibrary, hospitalPoints);

  // Update the 'nearest-hospital' data source to include the nearest library
 map.getSource('nearest-hospital').setData({
     type: 'FeatureCollection',
     features: [
       nearestHospital
     ]
   });

   var imperial = {unit:'mile'};
   var distance = turf.distance(refLibrary, nearestHospital,imperial);
   // Create a new circle layer from the 'nearest-hospital' data source
   map.addLayer({
     id: 'nearestHospitalLayer',
     type: 'circle',
     source: 'nearest-hospital',
     paint: {
       'circle-radius': 20,
       'circle-color': '#3690c0',
       'circle-opacity': 0.75
     }
   }, 'hospitals');
   popup.setLngLat(refLibrary.geometry.coordinates)
    .setHTML('<h2><b>' + refLibrary.properties.NAME + '</h2></b><br><h3>The nearest hospital is <b>'  + nearestHospital.properties.NAME +  '</b>, located at <b>' + nearestHospital.properties.ADDRESS + '</b> which is <b> ' + distance.toFixed(2) + " miles </b> away.</h3>")
    .addTo(map);
});




//var distance = turf.distance(from, to, options);
