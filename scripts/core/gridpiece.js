/*
   Class: GridPiece
   Node in the game grid
*/
function GridPiece()
{
	/*
	  Variable: position
	  Position of this node in the grid
	*/
	this.position = [0.0,0.0];

	/*
	  Variable: owner
	  Indicates who owns this piece, 1 for player1, 2 for player2
	*/	
	this.owner = -1;
	
	/*
	  Variable: _selected
	  (private) Indicates if this piece is currently selected
	*/
	this._selected = false;
	
	/*
	  Variable: _locatedNode
	  (private) Grid node on which this piece is currently located
	*/
	this._locatedNode = null;	
	
	/*
	  Variable: captured
	  Indicates if this piece has been captured, 
	  if so it is removed from grid
	*/	
	this.captured = false;	
	
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
	  Variable: enforcer
	  Reference to the game rule enforcer
	 */
	this.enforcer = null;
	
	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "gridpiece";
	
};

/*
  Method: init
  Initialises this grid piece
*/	
GridPiece.prototype.init = function(settings,slate){
	//Store reference to settings
	this._settings = settings;

	//Cache the reference to the slate
	this._slate = slate;

	//Setup the kineticJS shape for this grid piece
	this._shape = new Kinetic.Circle({
                x: this.position[0],
                y: this.position[1],
                radius: this._settings.grid.gridPiece.radius,
                fill: this._settings.grid.gridPiece["color"+this.owner],
                stroke: "black",
                strokeWidth: 1
   });
   
   
   var xloc = this.position[0];
   var yloc = this.position[1];
   var radius = this._settings.grid.gridPiece.radius*1.5;
   var color = this._settings.grid.gridPiece["color"+this.owner];
	//Setup the kineticJS shape that is used to indicate selection of this piece
	this._selectionShape = new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			context.beginPath();
			context.arc(xloc, 
						yloc,
						radius,
						0.0,
						340.0,
						false);
			context.lineWidth = 3;
			context.strokeStyle = color; // line color
			context.stroke();
		}
   });
   

	this._shape.alpha = 1.0;
	this._selectionShape.alpha = 0.0;
	
	
	//Add the circle to the draw layer of main slate
	var drawLayer = slate.getDrawLayer();
	if(drawLayer==null)
		throw("Cannot find master slate!")
	drawLayer.add(this._selectionShape);
	drawLayer.add(this._shape);

	var currObj = this;	
	// this._shape.on("mousedown", function(){slate.onMouseDown();});
   	// this._shape.on("mouseup", function(){slate.onMouseUp();});
   	// this._shape.on("mousemove", function(){currObj.onMouseMove();});
   	this._shape.on("mouseover", function(){currObj.onMouseOver();});
   	this._shape.on("mouseout", function(){currObj.onMouseOut();});
}


/*
  Method: select
  Selects or deselects a grid piece
  
  Parameters:
   mustSelect - boolean indicating whether piece is selected or deselected 	
*/
GridPiece.prototype.select = function(mustSelect){
	
}

/*
  Method: isSelected
  Returns a boolean indicating if this piece is selected
*/
GridPiece.prototype.isSelected = function(){
	return this._selected;
}

/*
  Method: onMouseDown
  Handler for the mouse down event
*/		
GridPiece.prototype.onMouseDown = function(){
}

/*
  Method: onMouseUp
  Handler for the mouse up event
*/		
GridPiece.prototype.onMouseUp = function(){
}

/*
  Method: onMouseMove
  Handler for the mouse over event
*/		
GridPiece.prototype.onMouseMove = function(){
}
	
/*
  Method: onMouseOver
  Handler for the mouse over event
*/		
GridPiece.prototype.onMouseOver = function(){
	this._selectionShape.alpha = 0.2;
	this._slate.refresh();
}

/*
  Method: onMouseOut
  Handler for the mouse out event
*/		
GridPiece.prototype.onMouseOut = function(){
	this._selectionShape.alpha = 0.0;
	this._slate.refresh();
}

//expose module API
exports.instance = GridPiece;