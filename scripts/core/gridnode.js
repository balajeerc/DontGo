/*
   Class: GridNode
   Node in the game grid
*/
function GridNode()
{
	/*
	  Variable: position
	  Position of this node in the grid
	*/
	this.position = [0.0,0.0];
	
	/*
	  Variable: adjacentNodes
	  List of nodes that are adjacent to this one in
	  the grid and connected to it by an edge in the grid.
	  The player can move his pieces from this node to only
	  one of the connected nodes in the grid only per move.
	*/
	this.adjacentNodes = [];
	
	/*
	  Variable: _slate
	  (private) Reference to the drawslate
	 */
	this._slate = null;
	
	/*
	  Variable: _shape
	  (private) KineticJS shape visually representing this node
	 */
	this._shape = null;
	
	/*
	  Variable: _settings
	  (private) Reference to the application settings
	 */
	this._settings = null;
	
	/*
	  Variable: _enforcer
	  Reference to the game rule enforcer
	 */
	this.enforcer = null;
	
   	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "gridnode";
	
};

/*
  Method: init
  Initialises this grid node
*/	
GridNode.prototype.init = function(settings,slate){
	//Store reference to settings
	this._settings = settings;

	//Cache the reference to the slate
	this._slate = slate;
	// console.log("Drawing grid node at: "+this.position[0]+","+this.position[1]);
	//Setup the kineticJS shape for this gridnode
	this._shape = new Kinetic.Circle({
                x: this.position[0],
                y: this.position[1],
                radius: this._settings.grid.gridNode.radius,
                fill: this._settings.grid.gridNode.color,
                stroke: "none",
                strokeWidth: 0
   });

	//
	
	//Add the circle to the draw layer of main slate
	var drawLayer = slate.getDrawLayer();
	if(drawLayer==null)
		throw("Cannot find master slate!")
	drawLayer.add(this._shape);
	
	var curr = this;	
	// this._shape.on("mousedown", function(){curr.onMouseDown();});
   	// this._shape.on("mouseup", function(){curr.onMouseUp();});
   	// this._shape.on("mousemove", function(){curr.onMouseMove();});
   	this._shape.on("mouseover", function(){curr.onMouseOver();});
   	this._shape.on("mouseout", function(){curr.onMouseOut();});   	
}

/*
  Method: onMouseDown
  Handler for the mouse down event
*/		
GridNode.prototype.onMouseDown = function(){
}

/*
  Method: onMouseUp
  Handler for the mouse up event
*/		
GridNode.prototype.onMouseUp = function(){
}

/*
  Method: onMouseMove
  Handler for the mouse over event
*/		
GridNode.prototype.onMouseMove = function(){
}
	
/*
  Method: onMouseOver
  Handler for the mouse over event
*/		
GridNode.prototype.onMouseOver = function(){
	this._shape.fill = this._settings.grid.gridNode.active_color;
	this._slate.refresh();
}

/*
  Method: onMouseOut
  Handler for the mouse out event
*/		
GridNode.prototype.onMouseOut = function(){
	this._shape.fill = this._settings.grid.gridNode.color;
	this._slate.refresh();	
}

/*
  Method: draw
  Draws the current grid node
*/	
GridNode.prototype.draw = function(){
	this._shape.draw();
}	

//expose module API
exports.instance = GridNode;