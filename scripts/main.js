var Application = require('core/application');

function main()
{	    
    var trialArr = ["james","bond","johnny","english"];
    trialArr.splice(2,1);
    for(var i=0; i<trialArr.length; i++)
    {
    	console.log("entry: " + trialArr[i]);
    }
	
    var application = new Application.instance();
    application.init();
    application.run();	
}

main();