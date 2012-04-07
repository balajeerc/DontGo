var AppSettings = require('core/settings');
var util = require('utils/util');
var Grid = require('core/grid');

var DRAWSLATE_GRID_DATA = null;

/*
  Class: DrawSlate
  Main visual and interaction area of the application.
  Manages mouse input by listening for input on an invisible
  KineticJS rectangle shape and uses the mouse input to draw
  game elements onto a separate layer
 */
function DrawSlate()
{
	/*
	  Variable: _application
	  (private) Reference to the application
	 */	
	this._application = null;
	
	/*
	  Variable: _stage
	  (private) KineticJS stage
	 */	
	this._stage = null;
	
	/*
	  Variable: _drawLayer
	  (private) KineticJS layer on which the drawing happens
	 */	
	this._drawLayer = null;

	/*
	  Variable: _gameGrid
	  (private) Game grid
	 */	
	this._gameGrid = null;

	/*	
	  Variable: _timeAtLastUpdate
	  (private) Internal timer for slate
	 */	
   	this._timeAtLastUpdate = 0.0;
   	
   	/*	
	  Variable: _settings
	  (private) Reference to the app settings
	 */	
   	this._settings = null;
   	
   	/*
   	  Variable: type
   	  Indicates the type of this class instance
   	 */
   	this.type = "drawslate";
}

/*
  Method: init
  Initialises the draw slate
 */		
DrawSlate.prototype.init = function(app,width, height){
	console.log("Creating stage...")
	this._application = app;

	var appSettings = this._application.getSettings();
	//Register the settings reference
	this._settings = appSettings;
	
	//Set the reference to the stage
	this._stage = new Kinetic.Stage("container", width, height);
					
	//Setup the layer on which the drawing happens
   	this._drawLayer = new Kinetic.Layer();
   	this._stage.add(this._drawLayer);
   	
   	//Grid data with which to setup the grid
 	this.getGridData("data/grid.json");
 	var timeWaited = 0.0;
	var waitInterval = 1000;
	var thisSlate = this;
	var dataLoop = setInterval(function(){
		this._gridData = DRAWSLATE_GRID_DATA;
		if(!this._gridData){
			timeWaited += waitInterval;
			//Timeout
			if(timeWaited/1000 > 10.0){
				console.log("Timing out of grid data fetch!");
				clearTimeout(dataLoop);
				throw("No valid grid data obtained from JSON file!");
			}			
		}
		else{
			clearInterval(dataLoop);			
		 	this._gameGrid = new Grid.instance();
 			this._gameGrid.init(appSettings,thisSlate);
 			this._gameGrid.setupGrid(this._gridData);
		}
	},waitInterval);
}

/*
  Method: update
  Updates all the strokes in the slate
  
  Parameters:
  t - current time	 	
*/	
DrawSlate.prototype.update = function(t){	 	
}

/*
  Method: getGridData
  Retrieves grid data from a specified url
  
  Parameters:
  url - url to json file containing the grid data
 */		 
DrawSlate.prototype.getGridData = function(url){
	$.getJSON(url,function(json){
		var expectedKeys = ["vertices","edges","start_pieces"];			
		var key;
		for (key in json){
		    if (json.hasOwnProperty(key)){
				if(jQuery.inArray(key,expectedKeys)==-1){
					console.log("Found unexpected key: " + key)
					throw("Illegal key found in grid data json!")
				}
		    }		    
		}
		DRAWSLATE_GRID_DATA = json;
		
	});
}

/*
  Method: processGrid
  Parses the grid data specified and populates the game grid
  	  
  Parameters:
  gridData - table holding grid data	
*/
DrawSlate.prototype.processGrid = function(){
	
}

/*
  Method: getStage
  Returns reference to the KineticJS stage of this slate
*/
DrawSlate.prototype.getStage = function(){
	return this._stage;
}

/*
  Method: getDrawLayer
  Returns reference to the KineticJS layer of this slate
*/
DrawSlate.prototype.getDrawLayer = function(){
	return this._drawLayer;
}

/*
  Method: refresh
  Redraws everything in the slate
*/
DrawSlate.prototype.refresh = function(){
	this._drawLayer.draw();
}

exports.instance = DrawSlate;