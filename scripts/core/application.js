var DrawSlate = require('core/drawslate');
var AppSettings = require('core/settings');

/*
  Class: AppManager
  Control Center for the application.
  Initiates and coordinates the running ofthe application.	 
 */
function Application()
{	
	/*
	  Variable: _slate
	  (private) Slate in which all the stroke drawing happens
	 */	
	this._drawSlate = null;
	
	/*
	  Variable: _settings
	  (private) Settings for application
	 */	
	this._settings = null;	
}

/*
  Method: init
  Initializes the application
  
  Parameters:
  	canvasCtxt - valid canvas context for this app to run within	  
 */		 
Application.prototype.init = function(){
	this._settings = new AppSettings.instance().values;
	this._drawSlate = new DrawSlate.instance();
	this._drawSlate.init(this,
						 this._settings.global.canvas_width,
						 this._settings.global.canvas_height);
}

/*
  Method: run
  Starts running the application
 */		 
Application.prototype.run = function(){		
		console.log("Running app!")		
		var time = 0.0;
		var fps = this._settings.global.fps;
		var interval = 1000.0/fps;
		var app = this;
		// setInterval(function(){
			// time += interval;
			// app.update(time/1000);	
		// },interval);
}

/*
  Method: update
  Main update loop for the application
  
  Parameters:
  	t - current time (or time since start of application)
*/		 
Application.prototype.update = function(t){				
	this._drawSlate.update(t);
}

/*
  Method: getSettings
  Returns settings for the application
*/		 
Application.prototype.getSettings = function(){				
	return this._settings;
}

/*
  Method: getSlate
  Returns a reference to the drawslate
*/		 
Application.prototype.getSlate = function(){				
	return this._drawSlate;
}

/*
  Method: getEnforcer
  Returns a reference to the enforcer
*/		 
Application.prototype.getEnforcer = function(){				
	return this._enforcer;
}

//expose module API
exports.instance = Application;
