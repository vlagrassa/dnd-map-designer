// Get the names of all the available maps
app.ports.requestMapNames.subscribe( function() {
    firebase.database().ref("/").once("value", function(snapshot) {
        app.ports.receiveMapNames.send(Object.keys(snapshot.val()));
    });
});


// Load the map with the requested name
app.ports.requestMap.subscribe( function(name) {
    firebase.database().ref("/").once("value", function(snapshot) {
        app.ports.receiveMap.send(snapshot.val()[name]);
    });
});


// Save the given map
app.ports.uploadMap.subscribe( function(data) {
    if (data.name != undefined && data.map != undefined) {
        // console.log("Requesting to save " + data.name + ":", data.map);
        firebase.database().ref("/" + data.name).set(data.map);
    }
});
