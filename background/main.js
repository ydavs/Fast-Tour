// Initialize google maps api
function googleapi_callback() {
    console.log('Google maps api initialized!');
}

function initiate_googleapi() {
    var script = document.createElement('script'); 
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLLBNRKemkSReXKKKwfR4fCMYGF70XYAI&callback=googleapi_callback';
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
        let responseParser = new Response_parser(response);
        // TODO: Optimize routes via TSP 
        // TODO: Display optimized route  
    }
}

function display(locations) {
    locations.reverse(); 
    console.log(locations); 
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
browser.browserAction.onClicked.addListener((tab) =>{
    console.log("Got " + tab.url);
    url = tab.url; 
    let locations = parse_url(url); 
    if(locations != -1) {
        get_distance_matrix(locations);  
    } 
});