/*
   Class: GridLogic
   Controls the game rules enforcement
*/
function GridLogic(){	
	/*
	 	Variable: _grid
	 	Reference to the game grid
	*/
	this._grid = null;
	
	/*
	 	Variable: _activeSelection
	 	Keeps track of whether there is a currently
	 	active selection of a piece on the grid at the
	 	moment
	*/
	this._activeSelection = null;

	/*
	 	Variable: _activePlayer
	 	Currently active player
	*/
	this._activePlayer = 1;
	
	/*
	 	Variable: _mouseDown
	 	(private) Indicates if the mouse is currently down
	 	indicating that a mouse drag might currently be in
	 	process
	 */
	this._mouseDown = false;

	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "gridlogic";

}

GridLogic.prototype.init = function(settings,grid){
	
	if(!settings)
		throw("Invalid settings specified for grid logic initialization!");		
	this._settings = settings;
	
	if(!grid)
		throw("Invalid grid specified for grid logic initialization!");
	this._grid = grid;	
}

/*
  Method: registerMouseDownOnPiece
  Processes a mouse down action happening on a piece
*/		
GridLogic.prototype.registerMouseDownOnGridPiece = function(piece){
	if(!piece)
		throw("No piece specified for registering mouse down on!");
	
	//First check if the piece is owned by the currently active player
	//If not, don't process this action
	if(piece.owner!=this._activePlayer)
		return;
	
	//Check if there is a previously selected piece
	if(this._activeSelection)
		this._activeSelection.select(false);
	
	this._activeSelection = piece;
	piece.select(true);
	
	//Register the mouse down event
	this._mouseDown = true;
	
	console.log("Piece of player "+this._activePlayer+" selected!");
}

/*
  Method: registerMouseDownOnGridNode
  Processes a mouse down action happening on a grid node
*/		
GridLogic.prototype.registerMouseDownOnGridNode = function(node){
	if(!node)
		throw("No node specified for registering mouse down on!");
	
	//First we check if there is an active selection
	//If not, we can simply ignore this mouse down on grid
	if(!this._activeSelection)
		return;
	
	//Check if the node is a blank node
	//If not, the action is invalid since a piece cannot be moved
	//onto an already occupied node
	if(node.occupyingPiece)
		return;
		
	//Now that we have established that the current node is blank
	//and that there is a valid actively selected piece, we simply
	//need to:
	//i) Make note of the current location of actively selected piece
	var currLocation = this._activeSelection.getOccupiedNode();
	if(!currLocation)
		throw("Cannot find current location of piece!");
	//ii) Move this piece onto the specified point on the grid	
	this._activeSelection.moveTo(node);
	//iii) Deselect the currently selected grid piece
	console.log("Deselecting currently selected piece!");
	this._activeSelection.select(false);
	//iv) Test for piece removal on thread sweeping	
	//If the activeSelection that was just moved, has a thread attached
	//to it, we need to check if the movement of the piece just made, sweeps
	//over any of the opponent's pieces. If so, the opponent's pieces are to
	//to be removed from the board
	var sweptPieces = this.getSweptPieces(this._activeSelection,currLocation,node);
	if(sweptPieces)
	{
		for(var i=0; i<sweptPieces.length; i++)
		{
			sweptPieces[i].remove();
		}	
	}
	//v) Clear the active selection
	this._activeSelection = null;
	//vi) Change the active player (effect a change of turn)
	this._activePlayer = this._activePlayer*-1;
	
	console.log("Moving piece of "+this._activePlayer+" to grid node!");
}

/*
  Method: registerMouseDownUpOnGrid
  Processes a mouse up occurring anywhere on grid
*/		
GridLogic.prototype.registerMouseUpOnGrid = function(){
	//Chcek if there is a registered mouse down
	//i.e. a mouse down registered on a grid piece
	if(this._mouseDown)
	{
		var pieceList = this._grid.getGridPieces();
		var reqPiece = null;		
		//Iterate over all the grid pieces		
		for(var i=0; i<pieceList.length;i++)
		{
			var currPiece = pieceList[i];
			//Check if one of them has the mouse over it
			if(currPiece.isMouseOver())
			{
				//If so, check if that piece belongs to the active player
				//and also that it is not the same piece as the active selection
				if(currPiece.owner == this._activePlayer && 
				   currPiece.id != this._activeSelection.id)
					reqPiece = currPiece;
			}
		}
		
		if(reqPiece)
		{
			//If we found a piece satisfying our above requirements,
			// then draw a line between the active selected piece
			//and the piece we just searched for if there is no line
			//between them already. If there is a line already, then we
			//delete it
			// console.log("Drawing line between piece with id "+this._activeSelection.id+
						// " piece with id " + reqPiece.id);
			var existingThread = reqPiece.findThreadToNode(this._activeSelection);
			if(existingThread)
			{
				this._grid.removeThread(existingThread);
			}
			else
			{
				this._grid.addThread(reqPiece,this._activeSelection,this._activePlayer);
			}
			
			//Clear active selection
			this._activeSelection.select(false);
			this._activeSelection = null;
			
			//Also register that a turn has been consumed so shift the
			//active player
			this._activePlayer = this._activePlayer*-1;	
		}
	}
	 
	this._mouseDown = false;
}

/*
  Method: getSweptPieces
  Tests if moving a piece, with one or more threads attached to
  it causes these threads to sweep over any of the opponent's pieces.
  If there are such pieces that are removed, this function returns
  an array of the removed pieces
  
  Parameters:
   piece - piece that is being moved
   currentNode - node on which the piece is currently located
   targetNode - node to which the piece will be moved   
*/		
GridLogic.prototype.getSweptPieces = function(piece,currentNode,targetNode){
	
	var sweptPieces = [];
	
	if(!targetNode || !currentNode)
		throw("Invalid nodes specified for processing sweeping with!");
	
	function SameSide(p1,p2,a,b)
	{
		var ba = [0.0,0.0];
		ba[0] = b[0] - a[0];
		ba[1] = b[1] - a[1];
		
		var p1a = [0.0,0.0];
		p1a[0] = p1[0] - a[0];
		p1a[1] = p1[1] - a[1];
		
		var p2a = [0.0,0.0];
		p2a[0] = p2[0] - a[0];
		p2a[1] = p2[1] - a[1];

		var cp1 = ba[0]*p1a[1] - ba[1]*p1a[0];
		var cp2 = ba[0]*p2a[1] - ba[1]*p2a[0];

    	if(cp1*cp2 >= 0)
    		return true
    	return false
	}
	
	function PointInTriangle(p,a,b,c)
	{
    	if( SameSide(p,a,b,c) && SameSide(p,b,a,c) && SameSide(p,c,a,b) )
    		return true;    		
    	return false;
	}
	
	var numThreads = piece.getNumThreads();
	if(numThreads<=0)
		return null;
		
	for(var i=0; i<numThreads; ++i)
	{
		var currThread = piece.getThread(i);
		if(!currThread)
			throw("Cannot find thread for piece as expected!");
		
		//We need the location of the other node connected to
		//this one via this thread
		var otherPiece = currThread.getPiece(0).id==piece.id?
							currThread.getPiece(1):
								currThread.getPiece(0);	
		if(!otherPiece)
			throw("Cannot find other piece if grid thread being swept!");
		
		var currLoc = currentNode.position;
		var targLoc = targetNode.position;
		var otherLoc = otherPiece.position;
		
		var pieceList = this._grid.getGridPieces();
		for(var j=0;j<pieceList.length;j++)
		{
			var checkedPiece = pieceList[j];
						
			//Check if this piece is the other player's
			if(checkedPiece.owner==piece.owner*-1)
			{
				var swept = PointInTriangle(checkedPiece.position,
											currLoc,
											targLoc,
											otherLoc);
				if(swept)
				{
					sweptPieces.push(checkedPiece);
				}					
			}			
		}	
	}
	
	return sweptPieces;	
}

//expose module API
exports.instance = GridLogic;