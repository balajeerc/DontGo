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
	this._gridNodes = [];

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

GridThread.prototype.init = function(settings,slate,node1,node2){
	//Set the reference to settings
	this._settings = settings;
	
	//Set the reference to the slate
	this._slate = slate;
	
	//Store the nodes
	this.gridNodes.push(node1);
	this.gridNodes.push(node2);	
	
		
	//Create the KineticJS shape representing this thread
	var thisObj = this;
	this._shape = new Kinetic.Shape({
		drawFunc: function() {
		    var context = this.getContext();
		    thisObj.drawLine(context);
		},
		//stroke: this._settings.grid.gridLine.color,
		//fill: this._settings.grid.gridLine.color,
		strokeWidth: 1
    });
    
    var layer = this._slate.getDrawLayer();
    layer.add(this._shape);
}

GridThread.prototype.drawLine = function(context)
{
	var node1 = this.gridNodes[0];
	var node2 = this.gridNodes[1];
	var color = this._settings.grid.gridLine["color"+(this.owner*0.5+1.5)];

    context.beginPath();
    context.moveTo(node1.position[0], node1.position[1]);
    context.lineTo(node2.position[0], node2.position[1]);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
}

//expose module API
exports.instance = GridThread;