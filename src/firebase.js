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


// Once Elm is listening, pass in the gallery whenever it changes
app.ports.requestGallery.subscribe( function() {

    // Add event listener for changes anywhere in the gallery
    firebase.database().ref("/").on("value", function(snapshot) {
        let gallery = snapshot.val();

        // If the gallery exists, format it and port it into Elm
        if (gallery != null) {

            // By format, I mean make the name of each map into a field
            let elm_gallery = Object.keys(gallery).map(name => {
                let ground = gallery[name].ground;
                let walls  = gallery[name].walls;
                return {name, ground, walls}
            });

            // Port the gallery into Elm
            app.ports.receiveGallery.send(elm_gallery);
        }
    });
});


// Save the given map
app.ports.uploadMap.subscribe( function(data) {

    // Make sure there's a name! If not, this will overwrite the entire gallery!!
    if (data.name == "") return;

    // Make sure fields are defined
    if (data.name != undefined && data.map != undefined) {
        
        // Filter out any empty shapes
        let ground = data.map.ground.filter(x => x.shape.outline.length > 0);
        let walls  = data.map.walls.filter(x => x.path.length > 0);

        // Upload the map
        firebase.database().ref("/" + data.name).set({ground, walls});
    }
});
