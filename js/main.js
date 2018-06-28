console.log("hello there")

var markers = [];
var geojson = {};
geojson['type'] = 'FeatureCollection';
geojson['features'] = [];

$.getJSON("data/caracteristiques.json",function(data){
	console.log(data[0]);
	console.log("size : " + Object.keys(data).length);
	for(i=0;i<127395;i++){
		if (data[i]['lat']!=0){
	  var newFeature = {
	    "type": "Feature",
	    "geometry": {
	      "type": "Point",
	      "coordinates": [data[i]['long'], data[i]['lat']]
	    },
	    "properties": {
	      "title": data[i]['Num_Acc'],
	      "description": data[i]['adr'],
				"lumiere": data[i]['lum'],
				"localisation": data[i]['agg'],
        "meteo": data[i]['atm'],
        "gravite" : data[i]['grav'],
				"vehicule" : data[i]['catv']
	    }
	  };
	  geojson['features'].push(newFeature);
	};
	};
});

console.log("general kenobi");

var filter_lum = [];
var filter_agg = [];
var filter_meteo = [];

function reinitialize(me){
  $(':radio').prop('checked', false);
  map.setFilter("depart",["all"]);
  filter_lum = [];
  filter_agg = [];
  filter_meteo = [];
};

function filter(me){

    var filters = ["all"];
    var filters_data = me.value.split('-');
    var lumi = parseInt(filters_data[1]);
    var name = filters_data[0];
    var fil = ["==",name,lumi];

    if (name == 'lumiere'){
      filter_lum = fil
    }
    else if (name == 'meteo'){
      filter_meteo = fil
    }
    else if (name == 'localisation'){
      filter_agg = fil
    }
      console.log(lumi);
    if (filter_agg.length > 0){
      filters.push(filter_agg);
    }
    if (filter_meteo.length > 0){
      filters.push(filter_meteo);
    }
    if (filter_lum.length >0){
      filters.push(filter_lum);
    }
      map.setFilter("depart",filters);


};

mapboxgl.accessToken = 'pk.eyJ1IjoieW93ZXNoIiwiYSI6ImNqaHcxbWx5czAwbGIza3J2YmszNG9tMGwifQ.ZiZnkDNktllBEhraykM3dQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [ 2.8,46.5], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

var color = '#007cbf';

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());

function getLatLongFromAddress(address,couleur){
	console.log("getLatLongFromAddress");
	console.log(address);
	var replaced = address.split(' ').join('+');
	var coordonnes = []; // create an empty array
	var my_data;
	$.ajax({
    async: false,
    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyCiDVl2auVK0fI4ibfo0hLreGcVERJa4Ts",
    success: function(data) {
       // my_data = data["results"][0]["geometry"]["location"]["lat"];
        latitude = data["results"][0]["geometry"]["location"]["lat"]
		longitude = data["results"][0]["geometry"]["location"]["lng"]
        coordonnes.push(latitude);
		coordonnes.push(longitude);
    }
});
	var marker = new mapboxgl.Marker().setLngLat([coordonnes[1],coordonnes[0]]).addTo(map);
	markers.push(marker);
	return coordonnes;
}

//Conversion des degrés en radian
function convertRad(input){
        return (Math.PI * input)/180;
}
function Distance(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){

        R = 6378000 //Rayon de la terre en mètre

    lat_a = convertRad(lat_a_degre);
    lon_a = convertRad(lon_a_degre);
    lat_b = convertRad(lat_b_degre);
    lon_b = convertRad(lon_b_degre);

    d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
    return d;
}
//map.data.loadGeoJson("https://maps.googleapis.com/maps/api/geocode/json?address=143+Boulevard+Murat+Paris&key=AIzaSyCiDVl2auVK0fI4ibfo0hLreGcVERJa4Ts");
function getItineraire(dep,arr){
	console.log("getItineraire");
	console.log(dep);
	console.log(arr);
	var depart = getLatLongFromAddress(dep, "#3887be");
	console.log("depart");
	console.log(depart);
	var arrivee = getLatLongFromAddress(arr,"#e55e5e");
	var distance = Distance(depart[1],depart[0],arrivee[1],arrivee[0]);
	var zoom = Math.max(10 - parseInt(distance)/100000,5);
	//var zoom = 4;
	console.log("distance");
	console.log(distance);
	console.log(zoom);
	map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: [(depart[1]+arrivee[1])/2,(depart[0]+arrivee[0])/2],
        zoom: zoom,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.9, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        }
    });
	}

//var intineraire = getItineraire();
function getData(){
	var my_data;
	$.ajax({
    async: false,
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=143+Boulevard+Murat+Paris&key=AIzaSyCiDVl2auVK0fI4ibfo0hLreGcVERJa4Ts",
    success: function(data) {
        my_data = data["results"][0]["geometry"]["location"]["lat"];
    }
});
	return my_data
}

var form =document.getElementById("subscribe_frm");


document.getElementById("myid").onclick = clic;

function clic(){
	//console.log("lol");
	console.log("test 1 marker");
 	console.log(markers);
 	for (var i = markers.length - 1; i >= 0; i--) {
 		markers[i].remove();
 	}
 	console.log("test 2 marker");
 	console.log(markers);
 	markers = [];
	var txtDepart = document.getElementById("depart").value;
	var txtArrivee = document.getElementById("arrivee").value;
	console.log("clic");
	console.log(txtDepart.value);
	console.log(txtArrivee.value);
	var chemin = getItineraire(txtDepart,txtArrivee);
	console.log("test 3 marker");
 	console.log(markers);
}


map.on('load', function() {
  map.addLayer({
        "id": "depart",
        "source": {
            "type": "geojson",
            "data": geojson,
        },
        "type": "circle",
        "paint": {
            "circle-radius": 5,
            "circle-color": color,
        }
    });
});

function display_colors(evt, parameters) {
    // Declare all variables
    var i, tabcontent, tablinks;

    if (parameters == 'Gravite'){
      color = ['match',['get', 'gravite'],1, '#fbb03b', 2, '#223b53',3, '#e55e5e',4, '#3bb2d0',/* other */ '#007cbf'];
    }
		if (parameters == 'Vehicule'){
      color = ['match',['get', 'vehicule'],1, '#fbb03b', [2,4,5,6,30,31,34], '#223b53',[7,8,9,10,11,12], '#e55e5e',[13,14], '#04B45F',[37,38], '#FF8000',/* other */ '#007cbf'];
    }
    else if (parameters == 'Aucun'){
      color = '#007cbf';
    };

    map.setPaintProperty('depart', 'circle-color', color);
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(parameters).style.display = "block";
    evt.currentTarget.className += " active";


    //Display the colors on the map

}
