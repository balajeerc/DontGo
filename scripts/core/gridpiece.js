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
	  Indicates who owns this piece, -1 for player1, 1 for player2
	*/	
	this.owner = 0;
	
	/*
	  Variable: _selected
	  (private) Indicates if this piece is currently selected
	*/
	this._selected = false;
	
	/*
	  Variable: _locatedNode
	  (private) Grid node on which this piece is currently located
	*/
	this._occupiedNode = null;	
	
	/*
   	  Variable: _threads
   	  (private) Threads connecting this node to others
   	 */
   	this._threads = [];	

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
	  Variable: _grid
	  (private) Reference to the grid
	 */
	this._grid = null;
	
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
   	  Variable: _mouseOver
   	  Indicates if the mouse is currently over th piece
   	 */
   	this._mouseOver = false;
	
	/*
   	  Variable: id
   	  Id number uniquely identifying this grid piece
   	 */
   	this.id = 0;	
	
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
	if(!this._slate)
		throw("Cannot find reference to slate!");

	//Cache the reference to the grid
	this._grid = slate.getGrid();
	if(!this._grid)
		throw("Cannot find grid!");

   var xloc = this.position[0];
   var yloc = this.position[1];
   var radius = this._settings.grid.gridPiece.radius;
   var color = this._settings.grid.gridPiece["color"+(this.owner*0.5+1.5)];
	//Setup the kineticJS shape for this grid piece
	this._shape = new Kinetic.Circle({
                x: xloc,
                y: yloc,
                radius: radius,
                fill: color,
                stroke: "black",
                strokeWidth: 1
   });
   
   var thisObj = this;
	//Setup the kineticJS shape that is used to indicate selection of this piece
	this._selectionShape = new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			// context.beginPath();
			// context.arc(xloc, 
						// yloc,
						// radius*1.5,
						// 0.0,
						// 340.0,
						// false);
			// context.lineWidth = 3;
			// context.strokeStyle = color; // line color
			// context.stroke();
			thisObj.drawSelectionArc(context);
		},
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
	this._shape.on("mousedown", function(){currObj.onMouseDown();});
   	// this._shape.on("mouseup", function(){slate.onMouseUp();});
   	// this._shape.on("mousemove", function(){currObj.onMouseMove();});
   	this._shape.on("mouseover", function(){currObj.onMouseOver();});
   	this._shape.on("mouseout", function(){currObj.onMouseOut();});
   	this._shape.on("dblclick", function(){currObj.onDoubleClick();});
}

/*
  Method: drawSelectionArc
  Selects or deselects a grid piece
  
  Parameters:
   context - canvas context with which to draw 	
*/
GridPiece.prototype.drawSelectionArc = function(context){
   var xloc = this.position[0];
   var yloc = this.position[1];
   var radius = this._settings.grid.gridPiece.radius*1.5;
   var color = this._settings.grid.gridPiece["color"+(this.owner*0.5+1.5)];

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

/*
  Method: select
  Selects or deselects a grid piece
  
  Parameters:
   mustSelect - boolean indicating whether piece is selected or deselected 	
*/
GridPiece.prototype.select = function(mustSelect){
	this._selected = mustSelect;
	if(this._selected)
		this._selectionShape.alpha = 1.0;
	else
		this._selectionShape.alpha = 0.0;
	this._slate.refresh();	
}

/*
  Method: getOccupiedNode
  Returns the node on which the piece is currently located
*/
GridPiece.prototype.getOccupiedNode = function(){
	return this._occupiedNode;
}

/*
  Method: isSelected
  Returns a boolean indicating if this piece is selected
*/
GridPiece.prototype.isSelected = function(){
	return this._selected;
}

/*
  Method: isMouseOver
  Indicates of mouse is over this piece currently
*/
GridPiece.prototype.isMouseOver = function(){
	return this._mouseOver;
}

/*
  Method: moveTo
  Changes the node location of the current piece
*/		
GridPiece.prototype.moveTo = function(targetNode){
	this._occupiedNode = targetNode;
	this.position = targetNode.position;
	// this._selectionShape.x = this.position[0];
	// this._selectionShape.y = this.position[1];
	this._shape.x = this.position[0];
	this._shape.y = this.position[1];
	this._slate.refresh();
	targetNode.occupyingPiece = this;
}

/*
  Method: findThreadToNode
  Finds a thread from the list of nodes this is connected to,
  running towards the specified node
  
  Parameters:
   node - node that we need to find a thread connected to
*/		
GridPiece.prototype.findThreadToNode = function(node){
	
	if(!this.owner == node.owner)
	{
		console.log("Piece not of same owner!");
		return null;
	}
		
	for(var i=0; i<this._threads.length; i++)
	{
		var currThread = this._threads[i];
		if(currThread.getPiece(0).id==node.id ||
			currThread.getPiece(1).id==node.id)
			{
				console.log("Returning thread!");
				return this._threads[i];
			}
	}
	
	console.log("Couldn't find any thread to node!");
	return null;
}

/*
  Method: addThread
  Adds a new thread to this piece's list of threads	
	  
  Parameters:
   thread - thread to be added to this node
*/		
GridPiece.prototype.addThread = function(thread){
	this._threads.push(thread);
}

/*
  Method: removeThread
  Removes a thread from this piece's list of threads	
	  
  Parameters:
   thread - thread to be removed from this node
*/		
GridPiece.prototype.removeThread = function(thread){
	for(var i=0; i<this._threads.length; i++)
	{
		var currThread = this._threads[i];
		if(currThread.id == thread.id)
		{
			this._threads.splice(i,1);
			return;
		}		
	}
	
	throw("Cannot find specified thread in this piece's thread list!");	
}

/*
  Method: getNumThreads
  Returns the number of threads this piece holds
*/		
GridPiece.prototype.getNumThreads = function(){
	return this._threads.length;
}

/*
  Method: remove
  Removes the piece from grid
*/		
GridPiece.prototype.remove = function(){
	var drawLayer = this._slate.getDrawLayer();
	drawLayer.remove(this._shape);
	this.captured = true;
	
	//We also remove all the threads associated with this piece
	for(var i=0;i<this._threads.length;i++)
	{
		this._grid.removeThread(this._threads[i]);
	}
}

/*
  Method: getThread
  Returns a thread that this piece holds by index
  
  Parameters:
   indx - index in thread array that must be returned
   		  (must be within array bounds - use getNumThreads)  
*/		
GridPiece.prototype.getThread = function(indx){
	return this._threads[indx];
}

/*
  Method: onMouseDown
  Handler for the mouse down event
*/		
GridPiece.prototype.onMouseDown = function(){
	console.log("Mouse down on grid piece!");
	var gridLogic = this._grid.getGridLogic();
	gridLogic.registerMouseDownOnGridPiece(this);
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
	//Register that the mouse is over this piece
	this._mouseOver = true;	
	//If the piece is currently selected, then we shouldn't do
	//anything on mouse out
	if(this._selected)
		return;
	this._selectionShape.alpha = 0.2;
	this._slate.refresh();
}

/*
  Method: onMouseOut
  Handler for the mouse out event
*/		
GridPiece.prototype.onMouseOut = function(){
	//Register that the mouse is not over this piece currently
	this._mouseOver = false;	
	//If the piece is currently selected, then we shouldn't do
	//anything on mouse out
	if(this._selected)
		return;
	this._selectionShape.alpha = 0.0;
	this._slate.refresh();
}

/*
  Method: onDoubleClick
  Handler for the double click event
*/		
GridPiece.prototype.onDoubleClick = function(){
	// var gridLogic = this._grid.getGridLogic();
	// gridLogic.registerMouseDoubleClickOnGridPiece(this);
}

//expose module API
exports.instance = GridPiece;