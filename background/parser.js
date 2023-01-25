class Response_parser {
    constructor(response, locations) {
        this.size = response["destinationAddresses"].length; 
        this.mappings = new Map(); 
        this.distance_matrix = new Array(this.size); 

        for(let i = 0 ; i < this.size; i++) {
            this.distance_matrix[i] = new Array(this.size); 
            this.mappings.set(i, locations[i]); 
            
            for(let j = 0; j < this.size; j++) {
                this.distance_matrix[i][j] = response["rows"][i]["elements"][j]["distance"]["value"]; 
            }
        }
    }
}