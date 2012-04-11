/*
   Class: GridThread
   Line between nodes in the game grid
*/
function GridThread()
{
	/*
	  Variable: gridNodes
	  Nodes that this thread connects
	 */
	this._gridPieces = [];

	/*
	  Variable: owner
	  Player owning this grid thread
	 */
	this.owner = 0;
	
	/*
	  Variable: _slate
	  (private) Reference to the drawslate
	 */
	this._slate = null;
	
	/*
	  Variable: _shape
	  (private) KineticJS shape for this thread
	 */
	this._shape = null;
	
	/*
	  Variable: _settings
	  (private) Reference to the application settings
	 */
	this._settings = null;

	/*
	  Variable: id
	  id uniquely identifying this grid thread
	 */
	this.id = null;	
		
   	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "gridthread";
	
}

GridThread.prototype.init = function(settings,slate,piece1,piece2,owner){
	//Set the reference to settings
	this._settings = settings;
	
	//Set the reference to the slate
	this._slate = slate;
	
	//Store the nodes
	this._gridPieces.push(piece1);
	this._gridPieces.push(piece2);	
	
	piece1.addThread(this);
	piece2.addThread(this);
	
	//Set the owner
	this.owner = owner;
		
	//Create the KineticJS shape representing this thread
	var thisObj = this;
	this._shape = new Kinetic.Shape({
		drawFunc: function() {
		    var context = this.getContext();
		    thisObj.drawLine(context);
		},
		strokeWidth: 1
    });
    
    var layer = this._slate.getDrawLayer();
    layer.add(this._shape);
    
    console.log("Registering color of thread as: "+this._settings.grid.gridThread["color"+(this.owner*0.5+1.5)]);
}

GridThread.prototype.drawLine = function(context)
{
	var piece1 = this._gridPieces[0];
	var piece2 = this._gridPieces[1];
	var color = this._settings.grid.gridThread["color"+(this.owner*0.5+1.5)];

    context.beginPath();
    context.moveTo(piece1.position[0], piece1.position[1]);
    context.lineTo(piece2.position[0], piece2.position[1]);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
}

GridThread.prototype.remove = function()
{
	var drawLayer = this._slate.getDrawLayer();
	drawLayer.remove(this._shape);
}

GridThread.prototype.getPiece = function(indx)
{
	if(indx!=0 && indx!=1)
		throw("Invalid index specified for fetching node of grid thread");
	
	return this._gridPieces[indx];	
}

//expose module API
exports.instance = GridThread;