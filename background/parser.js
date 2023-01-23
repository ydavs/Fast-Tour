class Response_parser {
    constructor(response) {
        this.size = response["destinationAddresses"].length; 
        this.mappings = new Map(); 
        this.distanc_matrix = new Array(this.size); 

        for(let i = 0 ; i < this.size; i++) {
            this.distanc_matrix[i] = new Array(this.size); 
            this.mappings.set(i, response["destinationAddresses"][i]); 

            for(let j = 0; j < this.size; j++) {
                this.distanc_matrix[i][j] = response["rows"][i]["elements"][j]["distance"]["value"]; 
            }
        }
    }
}