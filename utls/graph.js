export class Graph {
    #vertices = new Set();
    #adjacentList = new Map();
    
    get vertices() {
      return Array.from(this.#vertices)
    }
    constructor(){
        
    }

    get adjacentList() {
      const list = {};
      
      this.#adjacentList.forEach((val, key) => {
        list[key] = Array.from(val)
      })
      
      return list
    }

    addVertex(vertex = null) {
        if(
         !this.#vertices.has(vertex) &&
         vertex !== null && 
         vertex !== undefined
        ) {
          this.#vertices.add(vertex);
          this.#adjacentList.set(vertex, new Set());
        }
      }

      addEdge(vertex1 = null, vertex2 = null, directed = true) {
        if(
          vertex1 !== null && vertex1 !== undefined &&
          vertex2 !== null && vertex2 !== undefined && 
          vertex1 != vertex2
        ) {
          this.addVertex(vertex1);
          this.addVertex(vertex2);
          this.#adjacentList.get(vertex1).add(vertex2);
          if(directed) {
            this.#adjacentList.get(vertex2).add(vertex1);
          }
        }
      }

      
  }