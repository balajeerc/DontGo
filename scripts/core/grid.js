var GridNode = require('core/gridnode');
var GridLine = require('core/gridline');
var GridPiece = require('core/gridpiece');
var GridLogic = require('core/gridlogic');
var GridThread = require('core/gridthread');


/*
   Class: Grid
   Game grid for DontGo on which the gameplay occurs
*/
function Grid(){
	/*
	  Variable: _gridNodes
	  (private) Array of all the grid nodes
	 */
	this._gridNodes = [];

	/*
	  Variable: _gridEdges
	  (private) Array of all the grid edges
	 */
	this._gridLines = [];
	
	/*
	  Variable: _gridPieces
	  (private) Array of all grid pieces	
	 */
	this._gridPieces = [];
	
	/*
	 Variable: _gridThreads
	 (private) Array of all grid threads running between
	 grid pieces	
	*/
	this._gridThreads = [];

	/*
	 Variable: _backgroundShape
	 (private) A shape that exists in the background only to detect input
	*/
	this._backgroundShape = null;
	
	/*
	 Variable: _slate
	 (private) Reference to the slate where all the drawing happens
	*/
	this._slate = null;
	
	/*
	 Variable: _settings
	 (private) Settings for grid
	*/
	this._settings = null;
	
	/*
	  Variable: _gridLogic
	  (private) Reference to the game rule enforcer
	 */
	this._gridLogic = null;		

   	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "grid";
   	
   	/*
   	  Variable: _threadIdCounter
   	  Counter keeping track of threads 
   	  Used to generate unique ids for threads 
   	*/
   	this._threadIdCounter = 0;
}

/*
 Method: init
 Initializes this grid
*/	
Grid.prototype.init = function(settings,slate){	
	this._slate = slate;
	this._settings = settings;
}

/*
 Method: setupGrid
 Sets up grid based on the specified grid data
 
 Parameters:
 gridData - data with which the grid is to be setup
*/	
Grid.prototype.setupGrid = function(gridData){
	console.log("Setting up grid!")
		
	if(gridData==null)
		throw("Invalid grid data specified to setup grid with!")		
	
	var stage = this._slate.getStage();
	this._backgroundShape = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.width,
		height: stage.height,
		alpha: 0.0
    });
	
	var drawLayer = this._slate.getDrawLayer();
	drawLayer.add(this._backgroundShape);
	
	//First we parse the vertex list
	//For each vertex, we create a grid node
	var vertexList = gridData["vertices"];	
	if(vertexList==null)
		throw("Cannot find  vertex list in grid data!");
	
	var stage = this._slate.getStage();
	var width = stage.width;
	var height = stage.height;	
	var scaledVertexList = this.fitVerticesInGrid(vertexList,width,height);				
	for(var i=0; i<scaledVertexList.length; ++i){
		var gridNode = new GridNode.instance();
		var vertex = scaledVertexList[i];
		gridNode.position[0] = vertex[0];
		gridNode.position[1] = vertex[1];		
		this._gridNodes.push(gridNode);					 
	}
	
	//We now parse the list of edges
	//For every edge we come across, we one of its 
	//vertices as being adjacent to the other in the edge
	var edgeList = gridData["edges"];
	if(edgeList==null)
		throw("Cannot find  edge list in grid data!");
	for(var i=0; i<edgeList.length; ++i){
		var edge = edgeList[i];
		//Register adjacent nodes
		var node1 = this._gridNodes[edge[0]];
		var node2 = this._gridNodes[edge[1]];
		node1.adjacentNodes.push(node2);				
		node2.adjacentNodes.push(node1);
		
		var gridLine = new GridLine.instance();
		gridLine.init(this._settings,this._slate,node1,node2);
		this._gridLines.push(gridLine);
	}
	
	for(var i=0; i<this._gridNodes.length; ++i){
		this._gridNodes[i].init(this._settings,this._slate);
	}
	
	var idGen = 1;
	var pieces = gridData["start_pieces"];
	var player1_pieces = pieces["player1"];
	for(var i=0; i<player1_pieces.length; i++)
	{
		var newPiece = new GridPiece.instance();
		newPiece.owner = -1;
		newPiece.id = idGen*-1;
		newPiece.init(this._settings,this._slate);
		this._gridPieces.push(newPiece);
		newPiece.moveTo(this._gridNodes[player1_pieces[i]]);
		idGen++;
	}
	idGen = 1;
	var player2_pieces = pieces["player2"];
	for(var i=0; i<player2_pieces.length; i++)
	{
		var newPiece = new GridPiece.instance();
		newPiece.owner = 1;
		newPiece.id = idGen;
		newPiece.init(this._settings,this._slate);
		this._gridPieces.push(newPiece);
		newPiece.moveTo(this._gridNodes[player2_pieces[i]]);	
		idGen++;
	}
	this._slate.refresh();
	
	//Initialise the grid logic
	this._gridLogic = new GridLogic.instance();
	this._gridLogic.init(this._settings,this);
	
	var curr = this;
	var drawLayer = this._slate.getDrawLayer();	
	//drawLayer.on("mousedown", function(){curr.onMouseDown();});
   	drawLayer.on("mouseup", function(){curr.onMouseUp();});
   	//drawLayer.on("mousemove", function(){curr.onMouseMove();});
   	//drawLayer.on("mouseover", function(){curr.onMouseOver();});
   	//drawLayer.on("mouseout", function(){curr.onMouseOut();});
}

/*
 Method: getGridLogic
 Returns a reference to grid logic
*/	
Grid.prototype.getGridLogic = function(){
	return this._gridLogic;
}

/*
 Method: getGridPieces
 Returns the list of pieces held by the grid
*/	
Grid.prototype.getGridPieces = function(){
	return this._gridPieces;
}
	
/*
 Method: draw
 Draws this grid
*/	
Grid.prototype.draw = function(){
	//Draw the grid nodes
	for(var i=0; i<this._gridNodes.length; ++i){
		this._gridNodes[i].draw();
	}
}

/*
 Method: fitVerticesInGrid
 The grid obtained by parsing the JSON data exported from
 Blender, may be too small for our purposes. We try to fit
 the grid in our drawSlate. To do this, we go through the 
 vertex list to find minx, maxx, miny and maxy and use them
 to obtain the scaling required to fit the vertices in our grid
*/	
Grid.prototype.fitVerticesInGrid = function(vertexList,width,height){
	//We need to find the vertices at the extremities
	 //of the grid.
	var minx = 9999; 
	var miny = 9999;
	var maxx = -9999;
	var maxy = -9999;
	
	//Walk through the vertex list and find the vertices
	//at the extremities
	for(var i=0; i<vertexList.length; ++i){
		var vert = vertexList[i];
		x = vert[0];
		y = vert[1];
		if(x>maxx)
			maxx = x;
		if(y>maxy)
			maxy = y;
		if(x<minx)
			minx = x;
		if(y<miny)
			miny = y;					
	}
	
	//We fix the maximum of the 
	var maxXReq = 0.7*width;
	var maxYReq = 0.9*height;
	var minXReq = 0.3*width;
	var minYReq = 0.1*height;
	
	var xslope = (maxXReq-minXReq)/(maxx-minx);
	var yslope = (maxYReq-minYReq)/(maxy-miny);
	
	var offx = maxXReq - (xslope*maxx);
	var offy = maxYReq - (yslope*maxy);

	var scaledVertexList = [];
	for(var i=0; i<vertexList.length; ++i){
		var scaledx = xslope*vertexList[i][0]+offx;
		var scaledy = yslope*vertexList[i][1]+offy;
		scaledVertexList.push([scaledx,scaledy]);
	}	
	return scaledVertexList;
}

/*
 Method: addThread
 Adds a grid thread between two given nodes
 
 Parameters:
  node1 - first node to connect thread between
  node2 - second node to connect thread between
  owner - player that this thread belongs to
*/	
Grid.prototype.addThread = function(node1,node2,owner){
	//Run through the list of threads already in grid
	//and ensure that there isnt another thread between
	//the specified nodes belonging to the owner
	var newThread = new GridThread.instance();
	newThread.init(this._settings,this._slate,node1,node2,owner);
	newThread.id = this._threadIdCounter;
	this._gridThreads.push(newThread);
	this._threadIdCounter++;	
}

/*
 Method: removeThread
 Removes an existing grid thread between two given nodes
 
 Parameters:
  thread - thread to be removed
*/	
Grid.prototype.removeThread = function(thread){
	for(var i=0;i<this._gridThreads.length;i++)
	{
		var currThread = this._gridThreads[i];
		if(currThread.id==thread.id)
		{
			//This is the thread we need to remove
			var piece1 = currThread.getPiece(0);
			var piece2 = currThread.getPiece(1);
			piece1.removeThread(currThread);
			piece2.removeThread(currThread);
			currThread.remove();
			this._gridThreads.splice(i,1);			
		}
	}
}

Grid.prototype.onMouseUp = function(){
	console.log("Registering mouse up on layer!")
	this._gridLogic.registerMouseUpOnGrid();
}

	
//expose module API
exports.instance = Grid;