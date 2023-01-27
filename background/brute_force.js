"use strict"; 

class BruteForceSolution {
    constructor(distance_matrix) {
        this.size = distance_matrix.length; 
        this.distance_matrix = distance_matrix;  
        this.initial_tour_distance = 0; 
        this.best_permutation = new Array(this.size); 
        this.best_tour_distance = 0; 

        for(let i = 0; i < this.size; i++) {
            this.initial_tour_distance += distance_matrix[i][(i + 1) % this.size]; 
            this.best_permutation[i] = i; 
        }

        this.best_tour_distance = this.initial_tour_distance; 
    }

    get_locations(address_mapping) {
        let locations = new Array(this.size); 

        for(let i = 0; i < this.size; i++) {
            locations[i] = address_mapping.get(this.best_permutation[i]); 
        }

        return locations; 
    }

    optimize() {
        this.current_permutation = new Array(); 
        this.current_permutation.push(0); // Tour must begin at index 0    
        
        this.chosen = new Array(this.size); // Bool array for brute iterating 
        for(let i = 0; i < this.size - 1; i++) {
            this.chosen[i] = false; 
        }
        
        // Path must begin at index 0 and end at index n - 1.
        this.chosen[0] = true;   
        this.chosen[this.size - 1] = true; 

        this.choose_next_node(1);  
    }

    choose_next_node(current_size) {
        if(current_size == this.size - 1) {
            // push last node to current permutation 
            this.current_permutation.push(this.size - 1);
            console.assert(this.current_permutation.length == this.size);  

            let tour_distance = 0; 
            for(let i = 0; i < this.size; i++) {
                tour_distance += this.distance_matrix[this.current_permutation[i]][this.current_permutation[(i + 1) % this.size]];
            }
            
            if(tour_distance < this.best_tour_distance) {
                this.best_tour_distance = tour_distance; 
                this.best_permutation = this.current_permutation.map((x) => x); 
            }
            
            // pop last index (n - 1^th) from the current permutation
            this.current_permutation.pop(); 
            return; 
        }

        // choose one of the unchosen nodes 
        for(let i = 0; i < this.size - 1; i++) {
            if(this.chosen[i]) continue; 

            this.chosen[i] = true; 
            this.current_permutation.push(i); 
            this.choose_next_node(current_size + 1);
            this.chosen[i] = false;
            this.current_permutation.pop(); 
        }
    }
}