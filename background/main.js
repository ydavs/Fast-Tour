// Initialize google maps api
function googleapi_callback() {
    console.log('Google maps api initialized!');
}

function initiate_googleapi() {
    var script = document.createElement('script'); 
    script.src = 'https://maps.googleapis.com/maps/api/js?key=**YOUR_API_KEY**&callback=googleapi_callback';
    script.async = true; 

    document.head.appendChild(script); 
}

function parse_url() {
    const re = new RegExp('https://www.google.com/maps/dir/*');
    if(re.test(url)) {
        console.log('Is a google maps website!'); 
        var tmp_url = url.replace('https://www.google.com/maps/dir/', ''); 
        tmp_url = tmp_url.slice(0, tmp_url.indexOf('/@')); 
        return tmp_url.split('/'); 
    }
    else {
        console.log('Is not a google maps website!'); 
        return -1; 
    }
}

function get_distance_matrix(locations) {
    console.log('Calling for distance matrix on locations: ');
    console.log(locations); 
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
        origins: locations,
        destinations: locations,
        travelMode: 'DRIVING',
    }, distance_matrix_callback);
}

function distance_matrix_callback(response, status) {
    if(status != 'OK') {
        console.log('Google distance api failed!'); 
        // TODO: Show a pop up 
    }
    else {
        console.log(response);    
        // Parse reponse 
        let responseParser = new Response_parser(response, locations);
        console.log(responseParser.mappings)
        
        // Optimize routes via TSP
        let bruteForceSolution = new BruteForceSolution(responseParser.distance_matrix); 
        console.log("Tour distance before optimization ", bruteForceSolution.initial_tour_distance); 
        bruteForceSolution.optimize(); 
        console.log("Tour distance after optimization ", bruteForceSolution.best_tour_distance); 
        locations = bruteForceSolution.get_locations(responseParser.mappings); 
        
        // Display optimized route  
        display(locations); 
    }
}

function display(locations) {
    let url = 'https://www.google.com/maps/dir';

    for(let i = 0; i < locations.length; i++) {
        url = url.concat('/' + locations[i]); 
    }

    console.log(url); 
    // To update active tab 
    /* browser.tabs.update({
        url: url
    }) */

    // To create a new tab 
    browser.tabs.create({
        url: url
    }); 
}

/* 
    Main Script
*/
initiate_googleapi(); 

//Get url on click 
let url; 
let locations; 
browser.browserAction.onClicked.addListener((tab) =>{
    console.log("Got " + tab.url);
    url = tab.url; 
    locations = parse_url(url); 
    if(locations != -1) {
        get_distance_matrix(locations);  
    } 
});