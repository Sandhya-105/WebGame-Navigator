const map = L.map("map", {keyboard: false}).setView([27.968241926260404, -82.42396116256715], 18);
const basemap = "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"

L.tileLayer(basemap, {subdomains:['mt0','mt1','mt2','mt3']}).addTo(map);

map.on('click', (e) => console.log(e.latlng));

var autoPan = true;
var isLandmarks = false;

var currentPositionIcon = new L.Icon({
    iconUrl: 'assets/navigation.png',
    iconSize: [45, 45]
});

//----------------------------------------------------------- Bounds----------------------------------------------------------------//
let boundary = [
    new L.LatLng(27.98149774256935, -82.4347758293152),
    new L.LatLng(27.981459844058637, -82.42239475250244),
    new L.LatLng(27.966678409520828, -82.42230892181398),
    new L.LatLng(27.96679212059305, -82.43475437164308)  
];

L.Mask = L.Polygon.extend({
	options: {
		stroke: false,
		color: '#333',
		fillOpacity: 0.5,
		clickable: true,

		outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
	},

	initialize: function (latLngs, options) {
        
         var outerBoundsLatLngs = [
			this.options.outerBounds.getSouthWest(),
			this.options.outerBounds.getNorthWest(),
			this.options.outerBounds.getNorthEast(),
			this.options.outerBounds.getSouthEast()
		];
        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);	
	},

});

L.mask = function (latLngs, options) {
	return new L.Mask(latLngs, options);
};

L.mask(boundary).addTo(map);

//----------------------------------------------------------- Bounds----------------------------------------------------------------//

// const startingPoint = L.marker([27.969298471714566, -82.42522716522218]).bindTooltip("Starting Point", {permanent: true}).addTo(map);
const endingPoint = L.marker([27.97932329397738, -82.43453443050386]).bindTooltip("Destination", {permanent: true}).addTo(map);

const currentPosition = L.marker([27.968241926260404, -82.424040116256715], {icon: currentPositionIcon, rotationOrigin: "center center"}).addTo(map);
L.marker([27.97767940069139, -82.43075251579285]).bindTooltip("Kafe Coffee Day", {permanent: true}).addTo(map); // Landmark

const turnByTurnInstructions = [
    [new L.LatLng(27.968241926260404, -82.42396116256715), "Drive West onto E18th Ave for 400m"],
    [new L.LatLng(27.96822297467799, -82.42810249328615), "Turn Right onto N29th Street and drive 240m"],
    [new L.LatLng(27.970411860436794, -82.42809712886812), "Turn left onto E21st Ave and drive 240m"],
    [new L.LatLng(27.97046871402067, -82.43061840534212), "Turn right onto N26th Street and drive 800m"],
    [new L.LatLng(27.977807312595292, -82.43064522743227), "Turn left onto E Lake Ave and drive 400m"],
    [new L.LatLng(27.97779783764465, -82.4347597360611), "At the signal intersection turn right and drive 180m"],
    [new L.LatLng(27.97936119323891, -82.43475437164308), "You have reached your destination!"]
];

const landmarkInstructions = [
    [new L.LatLng(27.968241926260404, -82.42396116256715), "The 3100 E18th Ave parking is on the left, drive in that direction till you reach the 29th Street Store"],
    [new L.LatLng(27.96822297467799, -82.42810249328615), "At the 29th Street store, turn right and continue straight ahead till Abe Brown Ministries"],
    [new L.LatLng(27.970411860436794, -82.42809712886812), "At Abe Brown Ministries, turn left and continue driving"],
    [new L.LatLng(27.97046871402067, -82.43061840534212), "At the Centro Espanol Cemetry, turn right and continue driving till you reach Kafe Coffee Day"],
    [new L.LatLng(27.977807312595292, -82.43064522743227), "Turn left and continue straight ahead"],
    [new L.LatLng(27.97779783764465, -82.4347597360611), "At the traffic signal intersection, turn right and continue driving. The destination is on the right, opposite to Tampa Police Station"],
    [new L.LatLng(27.97936119323891, -82.43475437164308), "You have reached your destination!"]  
];

const snackbar = document.getElementById("snackbar");

snackbar.innerHTML = turnByTurnInstructions[0][1]; // Default instruction
// snackbar.className = "show";
// setTimeout(() =>  snackbar.className = snackbar.className.replace("show", ""), 1000 * 10); // 10 seconds

function move(bearing)
{
    const distance = 20;
    const movementRate = 1;

    for(let movementDistance = 1; movementDistance <= distance; movementDistance++)
    {
        let destination = L.GeometryUtil.destination(currentPosition.getLatLng(), bearing, movementRate);
        currentPosition.setLatLng(destination);
        currentPosition.setRotationAngle(bearing);
        if(autoPan) map.panTo(destination);
    }

    let navigationInstructions;
    if(isLandmarks)
        navigationInstructions = landmarkInstructions;
    else
        navigationInstructions = turnByTurnInstructions;

    for(let instruction of navigationInstructions)
    {
        let distance = currentPosition.getLatLng().distanceTo(instruction[0])
        if(distance <= 20)
        {
            snackbar.innerHTML = instruction[1];
            // snackbar.className = "show";
            // setTimeout(() =>  snackbar.className = snackbar.className.replace("show", ""), 1000 * 10); // 10 seconds
        }
    }
}

document.onkeydown = (e) => 
{
    switch (e.key) {
        case "ArrowUp":
            move(0);
            break;
        case "ArrowDown":
            move(180);
            break;
        case "ArrowLeft":
            move(270);
            break;
        case "ArrowRight":
            move(90);
            break;
    }
};

function togglePan()
{
    if(autoPan)
    {
        document.getElementsByClassName("togglePan")[0].style.backgroundColor = "#a813ec";
        document.getElementsByClassName("togglePan")[0].style.color = "#fff";
    }
    else
    {
        document.getElementsByClassName("togglePan")[0].style.backgroundColor = "#333";
        document.getElementsByClassName("togglePan")[0].style.color = "bisque";
    }

    autoPan = !autoPan;
}

function toggleLandmarks()
{
    isLandmarks = document.getElementById("isLandmarks").checked;
    currentPosition.setLatLng([27.968241926260404, -82.424040116256715]);
    currentPosition.setRotationAngle(0);
    map.panTo([27.968241926260404, -82.424040116256715]);

    let distance = currentPosition.getLatLng().distanceTo(L.latLng(27.968241926260404, -82.42396116256715));
    if(distance <= 20)
    {
        if(isLandmarks)
            snackbar.innerHTML = landmarkInstructions[0][1]; // Default instruction
        else
            snackbar.innerHTML = turnByTurnInstructions[0][1]; // Default instruction

        // snackbar.className = "show";
        // setTimeout(() =>  snackbar.className = snackbar.className.replace("show", ""), 1000 * 10); // 10 seconds
    }
}