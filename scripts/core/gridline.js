/*
   Class: GridLine
   Line between nodes in the game grid
*/
function GridLine()
{
	/*
	  Variable: gridNodes
	  Nodes that this line connects
	 */
	this.gridNodes = [];
	
	/*
	  Variable: _slate
	  (private) Reference to the drawslate
	 */
	this._slate = null;
	
	/*
	  Variable: _shape
	  (private) KineticJS shape for this line
	 */
	this._shape = null;
	
	/*
	  Variable: _settings
	  (private) Reference to the application settings
	 */
	this._settings = null;
	
   	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "gridline";
	
}

GridLine.prototype.init = function(settings,slate,node1,node2){
	//Set the reference to settings
	this._settings = settings;
	
	//Set the reference to the slate
	this._slate = slate;
	
	//Store the nodes
	this.gridNodes.push(node1);
	this.gridNodes.push(node2);	
	
	//Create the KineticJS shape representing this line
	this._shape = new Kinetic.Shape({
		drawFunc: function() {
		    var context = this.getContext();
		    context.beginPath();
		    context.moveTo(node1.position[0], node1.position[1]);
		    context.lineTo(node2.position[0], node2.position[1]);
		    context.closePath();
		    context.strokeStyle = settings.grid.gridLine.color;
		    context.stroke();
		},
		//stroke: this._settings.grid.gridLine.color,
		//fill: this._settings.grid.gridLine.color,
		strokeWidth: 1
    });
    
    var layer = this._slate.getDrawLayer();
    layer.add(this._shape);
}

//expose module API
exports.instance = GridLine;