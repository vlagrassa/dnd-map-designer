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


// Load the map with the requested name
app.ports.requestGallery.subscribe( function() {
    firebase.database().ref("/").on("value", function(snapshot) {
        let gallery = snapshot.val();
        let elm_gallery = Object.keys(gallery).map(name => {
            let ground = gallery[name].ground;
            let walls  = gallery[name].walls;
            return {name, ground, walls}
        });

        app.ports.receiveGallery.send(elm_gallery);
    });
});


// Save the given map
app.ports.uploadMap.subscribe( function(data) {
    if (data.name != undefined && data.map != undefined) {
        let ground = data.map.ground.filter(x => x.outline.length > 0);
        let walls  = data.map.walls.filter(x => x.length > 0);
        firebase.database().ref("/" + data.name).set({ground, walls});
    }
});
