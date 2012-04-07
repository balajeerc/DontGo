/*
   Class: GridLogic
   Controls the game rules enforcement
*/
function GridLogic(){
	/*
	 	Variable: _application
	 	Reference to the application
	*/
	this._application = null;
	
	/*
	   Variable: _drawSlate
	   Reference to the drawslate for game
	*/	
	this._drawSlate = null;
	
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
	this._activeSelection = false;

	/*
	 	Variable: _activePlayer
	 	Currently active player
	*/
	this._activePlayer = false;
	
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
		throw("Invalid settings specified for grid logic initialization!");
	this._grid = grid;	
	
}

GridLogic.prototype.notify = function(objType,eventType){
	var response = this[objType][eventType];
	response(objType);
}

GridLogic.prototype.gridPiece.onMouseDown = function(gridNode){
	
}

//expose module API
exports.instance = GridLogic;