export class GraphNode {	
	private connections : GraphNode[];
	getConnections() : GraphNode[]{ return this.connections; }

    public x: number; 
    public y: number; 
    public z: number;
    public weight: number;

	constructor(
		 x: number, 
		 y: number, 
		 z: number,
		 weight: number) {		
             this.x =x;
             this.y =y;
             this.z =z;
             this.weight =weight;
		this.connections = [];
	}

    connectTo(b : GraphNode) {
		this.connections.push(b);
	}


	toString() : string {
		var ret = "{" + this.x + "," + this.y + "," + this.z + "," + this.weight+ "}";
		return ret;
	}

}


export class PathNode {	
	
	f() : number{ return this.g + this.h; }

    public g: number; 
    public h: number;
    public previous: PathNode;
    public data: GraphNode;
	constructor(
		g: number, 
		h: number,
		previous: PathNode,
		data: GraphNode) {
			this.g = g;
			this.h = h;
			this.previous = previous;
			this.data = data;
	}
}


export class Graph {
	private nodes : GraphNode[];
	getNode(x: number, y: number) : GraphNode { 
		for (var i = 0; i < this.nodes.length; i++) {
			var n = this.nodes[i];
			if (n.x == x && n.y == y)
				return n;
		}
		return null;
	}
	getNodes() : GraphNode[] { return this.nodes; }
		
    constructor() {
		this.nodes = [];
	}
	
	/**
	 * convert a 2d array to a graph
	 * @param data The 2d array containing weights of each tile
	 */
	fromArray(data : number[][]) {
		this.nodes = [];
		
		var width  = data[0].length;
		var height = data.length;
		
		// create and add nodes
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {				
				var weight = data[i][j];
				var node = new GraphNode(j, i, 0, weight);
				this.nodes.push(node);
			}
		}
		
		// connect the nodes in O(n)
		for (var i = 0; i < this.nodes.length; i++) {
			var n = this.nodes[i];
			
			let allowDiagonals = false;
			if (allowDiagonals){
				// loop in a square adding each node as a connection
				for (var x = -1; x <= 1; x++) {
					for (var y = -1; y <= 1; y++) {
						
						if (x == 0 && y == 0) continue;
						if (n.x+x < 0 || n.x+x >= width || 
							n.y+y < 0 || n.y+y >= height) continue;
						
						var node  = this.nodes[i+width*y+x];		
						this.nodes[i].connectTo(node);
					}
				}			
			}
			else
			{
				for (var x = -1; x <= 1; x++) {
					for (var y = -1; y <= 1; y++) {
						
						if (x == 0 && y == 0) continue;
						if (n.x+x < 0 || n.x+x >= width || 
							n.y+y < 0 || n.y+y >= height || 
							Math.abs(x) == Math.abs(y) )
							continue;
						
						var node  = this.nodes[i+width*y+x];		
						this.nodes[i].connectTo(node);
					}
				}			
			}
		}
	}
}


export class /*Manhatten*/Heuristic /*extends Heuristic*/ {
	constructor() {
		//super();
	}
		
	getHeuristic (
		x1:number, y1:number, z1:number, 
		x2:number, y2:number, z2:number) : number {
		return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
	}
}

export class AStar 
{
	private graph : Graph;
	getGraph() : Graph { return this.graph; }
	getNode(x : number, y : number) : GraphNode { return this.graph.getNode(x, y); }
		
	private heuristic : Heuristic;
	setHeuristic(heuristic : Heuristic) { this.heuristic = heuristic; }
	
	constructor(heuristic: Heuristic) {
		this.graph = new Graph();
		this.setHeuristic(heuristic);
	}	
	
	pathSimple(x0 : number,y0: number,x1: number,y1: number) : number[] {
        let ret : number[];
        let complexPath = this.path(this.getGraph().getNode(x0,y0), this.getGraph().getNode(x1,y1));

        for ( let i = 0 ; i < complexPath.length ; i++)
        {
            ret.push(complexPath[i].x);    
            ret.push(complexPath[i].y);    
        };
        return ret;
    }



	/**
	 * Find the cheapest path between two nodes
	 * @param a Origin
	 * @param b Destination
	 */
	path(a: GraphNode, b: GraphNode) : GraphNode[] {
		var open = new Array<PathNode>(); 
		var	closed = new Array<PathNode>();
					
		var next = new PathNode(
			0, this.heuristic.getHeuristic(a.x, a.y, a.z, b.x, b.y, b.z), null, a);
		
		// find lowest
		while (next.data != b)
		{
			var lowest: PathNode = null;
			var lowestIndex = -1;
			for (var i = 0; i < open.length; i++) 
			{
				if (lowest == null || lowest.f() > open[i].f()) {
					lowest = open[i];
					lowestIndex = i;
				}
			}
			
			// add to closed
			if (lowest != null) {
				// open[open.length-1] = open[lowestIndex];
				open.splice(lowestIndex, 1);
				closed.push(lowest);			
				next = lowest;
			}
			
			// for all next connections, add to open if not in closed or open
			var connections = next.data.getConnections();
			for (var i = 0; i < connections.length; i++) {
				
				// list check
                var add = true;
                var openIndex = -1;
				for (var j = 0; j < open.length; j++) 
					if (open[j].data.x == connections[i].x &&
						open[j].data.y == connections[i].y &&
						open[j].data.z == connections[i].z) 
						openIndex = j;
				for (var j = 0; j < closed.length; j++)
					if (closed[j].data.x == connections[i].x &&
						closed[j].data.y == connections[i].y &&
						closed[j].data.z == connections[i].z)
						add = false;
				
				// calculate score
				var node = connections[i];
				var g = next.g;
				g += Math.sqrt(
						Math.pow(next.data.x - node.x, 2) + 
						Math.pow(next.data.y - node.y, 2) + 
						Math.pow(next.data.z - node.z, 2)) * node.weight;
				var h = this.heuristic.getHeuristic(node.x, node.y, node.z, b.x, b.y, b.z);
				
				// if not in open
				if (openIndex == -1 && add)
					open.push(new PathNode(g, h, next, node));
				// update open if better score
				else if (
					openIndex > -1 &&
					g + h < open[openIndex].f() && add) {
					open[openIndex].g = g;
					open[openIndex].h = h;
					open[openIndex].previous = next;
				}
			}
		}
				
		var path = new Array<GraphNode>();
		while (next != null) {
			path.push(next.data);
			next = next.previous;
		}
		path.reverse();
		
		return path;
	}
	
	/**
	 * Load an array into graph
	 * @param data The 2d array containing weights of each tile
	 */
	load(data: number[][]) {
		this.graph.fromArray(data);
	}
}



namespace Testing
{
    function main()
    {
        var dataForGraph : number[][]= [
            [0, 0, 0, 0],
            [0, 5, 5, 0],
            [0, 5, 5, 0],
            [0, 0, 0, 0]
        ];
        
        var astar = new AStar(new /*Manhatten*/Heuristic());
        astar.load(dataForGraph);
        
        var g = astar.getGraph();
		var path = astar.path(g.getNode(0,0), g.getNode(3,3));
		for (var i = 0; i < path.length; i++) {
			console.log(path[i].toString());
		}
    }
    main();
}

